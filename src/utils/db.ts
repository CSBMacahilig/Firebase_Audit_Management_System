/**
 * db.ts — Firebase Firestore data layer for all audit app entities.
 *
 * Provides typed CRUD + real-time subscription functions for:
 *  - engagements (with nested subcollections: working_notes, findings, timeline_activities, files, activity_log)
 *  - issues_register
 *  - universe_entities
 *  - sizing_configs (persisted via master_data/sizing_configs)
 *  - user_profiles (split PII: email stored in user_profiles/{id}/private/contact)
 *  - audit_frequencies
 *  - audit_division_risk_scales
 *  - master_data
 */

import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Unsubscribe,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { supabase } from './supabaseClient';
import {
  ActivityLogItem,
  AuditDivisionRiskScale,
  AuditEngagement,
  AuditFile,
  AuditFinding,
  INITIAL_ENGAGEMENTS,
  INITIAL_ISSUES_REGISTER,
  INITIAL_SIZING,
  INITIAL_UNIVERSE,
  IssueRegisterItem,
  SizingConfig,
  TimelineActivity,
  UniverseEntity,
  UserProfile,
  USERS,
  WorkingNote,
} from '../data/auditData';
import { getCurrentAccountEmail } from './auditMetadata';
import {
  BOOTSTRAPPED_ADMIN_EMAIL,
  createOrSyncSystemUser,
  emailToSystemUserId,
  loadSession,
  loadUsers,
  sanitizeFirestoreId,
} from './authStore';
import { handleFirestoreError, OperationType } from './firestoreError';
import { normalizeLegacyIdentifier, normalizeYearIdentifier } from './identifiers';
import { normalizeRole } from './rbac';
import { DEFAULT_AUDIT_DIVISION_RISK_SCALES } from './riskScale';
import {
  fetchSqlMasterData,
  fetchSqlWorkspace,
  getSqlConnectStatus,
  sqlMirrorHelpers,
} from './sqlApiClient';

export interface AuditFrequencies {
  high: number;
  medium: number;
  low: number;
}

const ADMIN_ONLY_MASTER_KEYS = new Set([
  'access_users_registry',
  'auditors',
  'auditee_directory',
]);

const cachedWorkspaceMemberEmails = new Set<string>([BOOTSTRAPPED_ADMIN_EMAIL]);

function rememberMemberEmails(raw: unknown) {
  if (!Array.isArray(raw)) return;
  for (const item of raw) {
    if (typeof item === 'string' && item.trim() && cachedWorkspaceMemberEmails.size < 100) {
      cachedWorkspaceMemberEmails.add(item.trim().toLowerCase().slice(0, 160));
    }
  }
}

function clampStr(val: unknown, maxLen: number, fallback = ''): string {
  if (typeof val !== 'string') return fallback;
  return val.slice(0, maxLen);
}

function clampNum(val: unknown, min: number, max: number, fallback: number): number {
  const num = Number(val);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function getAuthAccessContext() {
  const current = auth.currentUser;
  const uid = sanitizeFirestoreId(current?.uid ?? 'system');
  const email = clampStr((current?.email ?? BOOTSTRAPPED_ADMIN_EMAIL).toLowerCase(), 160);
  if (email) cachedWorkspaceMemberEmails.add(email);
  cachedWorkspaceMemberEmails.add(BOOTSTRAPPED_ADMIN_EMAIL);
  const memberUids = Array.from(new Set([uid])).slice(0, 100);
  const memberEmails = Array.from(cachedWorkspaceMemberEmails).slice(0, 100);
  const isBootstrapped = email === BOOTSTRAPPED_ADMIN_EMAIL;
  const isAdmin = isBootstrapped || loadSession()?.role === 'admin';
  return { uid, email, memberUids, memberEmails, isBootstrapped, isAdmin };
}

function buildCollectionQuery(colName: string) {
  const { email, isBootstrapped } = getAuthAccessContext();
  const colRef = collection(db, colName);
  return isBootstrapped ? colRef : query(colRef, where('memberEmails', 'array-contains', email));
}

function buildSubcollectionQuery(engagementId: string, subName: string) {
  const { email, isBootstrapped } = getAuthAccessContext();
  const safeEngId = sanitizeFirestoreId(engagementId);
  const colRef = collection(db, 'engagements', safeEngId, subName);
  return isBootstrapped ? colRef : query(colRef, where('memberEmails', 'array-contains', email));
}

let sqlWorkspaceInflight: Promise<Awaited<ReturnType<typeof fetchSqlWorkspace>>> | null = null;
let sqlWorkspaceLastFetchedAt = 0;
let sqlWorkspaceCache: Awaited<ReturnType<typeof fetchSqlWorkspace>> | null = null;

async function loadSqlWorkspaceShared() {
  if (sqlWorkspaceCache && Date.now() - sqlWorkspaceLastFetchedAt < 4000) {
    return sqlWorkspaceCache;
  }
  if (!sqlWorkspaceInflight) {
    sqlWorkspaceInflight = fetchSqlWorkspace()
      .then((res) => {
        sqlWorkspaceCache = res;
        sqlWorkspaceLastFetchedAt = Date.now();
        return res;
      })
      .finally(() => {
        sqlWorkspaceInflight = null;
      });
  }
  return sqlWorkspaceInflight;
}

async function isSqlPrimaryMode(): Promise<boolean> {
  const status = await getSqlConnectStatus();
  return status.configured && status.mode === 'primary';
}

function invalidateSqlWorkspaceCache() {
  sqlWorkspaceCache = null;
  sqlWorkspaceLastFetchedAt = 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Document mappers
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToEngagement(id: string, row: any, subs: {
  workingNotes: WorkingNote[];
  findings: AuditFinding[];
  timelineActivities: TimelineActivity[];
  files: AuditFile[];
  activityLog: ActivityLogItem[];
}): AuditEngagement {
  const year = Number(row.year) || 2026;
  return {
    id,
    ref: normalizeYearIdentifier(row.ref, 'AE', year, 1),
    year,
    title: String(row.title ?? ''),
    category: String(row.category ?? ''),
    department: String(row.department ?? ''),
    auditDivisionId: row.auditDivisionId ?? undefined,
    entityName: String(row.entityName ?? ''),
    likelihood: Number(row.likelihood ?? 3),
    impact: Number(row.impact ?? 3),
    riskScore: Number(row.riskScore ?? 9),
    riskLevel: row.riskLevel ?? 'Medium',
    lead: String(row.lead ?? ''),
    headReviewer: String(row.headReviewer ?? ''),
    independentReviewer: String(row.independentReviewer ?? 'Not needed'),
    startDate: String(row.startDate ?? ''),
    endDate: String(row.endDate ?? ''),
    objectives: row.objectives ?? '',
    scope: row.scope ?? '',
    criteria: row.criteria ?? '',
    addresseeName: row.addresseeName ?? '',
    addresseeTitle: row.addresseeTitle ?? '',
    copyFurnished: row.copyFurnished ?? '',
    durationDays: Number(row.durationDays ?? 0),
    budgetedHours: Number(row.budgetedHours ?? 0),
    status: String(row.status ?? 'Planned'),
    readyRatio: String(row.readyRatio ?? '0/9 ready'),
    lifecycleStage: Number(row.lifecycleStage ?? 1) as AuditEngagement['lifecycleStage'],
    fieldworkPct: Number(row.fieldworkPct ?? 0),
    fieldworkDayCurrent: Number(row.fieldworkDayCurrent ?? 0),
    fieldworkDayTotal: Number(row.fieldworkDayTotal ?? 0),
    reportStatus: row.reportStatus ?? 'Draft',
    reportRating: row.reportRating ?? undefined,
    reportRef: String(row.reportRef ?? ''),
    executiveSummary: String(row.executiveSummary ?? ''),
    addedBy: row.addedBy ?? undefined,
    modifiedBy: row.modifiedBy ?? undefined,
    modifiedAt: row.modifiedAt?.toDate ? row.modifiedAt.toDate().toISOString() : (row.modifiedAt ?? undefined),
    ...subs,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToWorkingNote(id: string, row: any): WorkingNote {
  return {
    id,
    ref: normalizeLegacyIdentifier(row.ref, 'WP', 1),
    title: String(row.title ?? ''),
    controlArea: String(row.controlArea ?? ''),
    author: String(row.author ?? ''),
    status: row.status ?? 'Draft',
    hasException: Boolean(row.hasException),
    updatedAt: String(row.updatedAt ?? ''),
    testingProcedure: String(row.testingProcedure ?? ''),
    observations: row.observations ?? '',
    conclusion: String(row.conclusion ?? ''),
    reviewerComments: row.reviewerComments ?? undefined,
    addedBy: row.addedBy ?? undefined,
    modifiedBy: row.modifiedBy ?? undefined,
    modifiedAt: row.modifiedAt?.toDate ? row.modifiedAt.toDate().toISOString() : (row.modifiedAt ?? undefined),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToFinding(id: string, row: any): AuditFinding {
  return {
    id,
    ref: normalizeLegacyIdentifier(row.ref, 'FN', 1),
    title: String(row.title ?? ''),
    severity: String(row.severity ?? 'Medium'),
    category: row.category ?? 'General',
    condition: String(row.condition ?? ''),
    criteria: String(row.criteria ?? ''),
    cause: String(row.cause ?? ''),
    effect: String(row.effect ?? ''),
    recommendation: String(row.recommendation ?? ''),
    owner: String(row.owner ?? ''),
    targetDate: String(row.targetDate ?? ''),
    status: row.status ?? 'Open',
    linkedNoteRef: String(row.linkedNoteRef ?? ''),
    addedBy: row.addedBy ?? undefined,
    modifiedBy: row.modifiedBy ?? undefined,
    modifiedAt: row.modifiedAt?.toDate ? row.modifiedAt.toDate().toISOString() : (row.modifiedAt ?? undefined),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToTimeline(id: string, row: any): TimelineActivity {
  return {
    id: normalizeLegacyIdentifier(id, 'AL', 1),
    name: String(row.name ?? ''),
    roleResponsible: String(row.roleResponsible ?? ''),
    dueDate: String(row.dueDate ?? ''),
    completedDate: row.completedDate ?? undefined,
    status: row.status ?? 'Pending',
    stageId: Number(row.stageId ?? 1) as TimelineActivity['stageId'],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToFile(id: string, row: any): AuditFile {
  return {
    id: normalizeLegacyIdentifier(id, 'AF', 1),
    name: String(row.name ?? ''),
    folder: String(row.folder ?? ''),
    size: String(row.size ?? ''),
    uploadedBy: String(row.uploadedBy ?? ''),
    uploadedAt: String(row.uploadedAt ?? ''),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToActivityLog(id: string, row: any): ActivityLogItem {
  return {
    id: normalizeLegacyIdentifier(id, 'AL', 1),
    timestamp: String(row.timestamp ?? ''),
    actor: String(row.actor ?? ''),
    action: String(row.action ?? ''),
    detail: row.detail ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToIssue(id: string, row: any): IssueRegisterItem {
  return {
    id,
    ref: normalizeLegacyIdentifier(row.ref, 'IS', 1),
    title: String(row.title ?? ''),
    auditRef: String(row.auditRef ?? ''),
    auditTitle: String(row.auditTitle ?? ''),
    severity: String(row.severity ?? 'Medium'),
    owner: String(row.owner ?? ''),
    ownerUnit: String(row.ownerUnit ?? ''),
    originalDue: String(row.originalDue ?? ''),
    currentDue: String(row.currentDue ?? ''),
    extensionCount: Number(row.extensionCount ?? 0),
    daysStatus: String(row.daysStatus ?? ''),
    isOverdue: Boolean(row.isOverdue),
    isDueSoon: Boolean(row.isDueSoon),
    status: row.status ?? 'Open',
    actionPlanSummary: String(row.actionPlanSummary ?? ''),
    evidenceNote: row.evidenceNote ?? undefined,
    extensionReason: row.extensionReason ?? undefined,
    addedBy: row.addedBy ?? undefined,
    modifiedBy: row.modifiedBy ?? undefined,
    modifiedAt: row.modifiedAt?.toDate ? row.modifiedAt.toDate().toISOString() : (row.modifiedAt ?? undefined),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToUniverse(id: string, row: any, index: number): UniverseEntity {
  return {
    id,
    code: normalizeLegacyIdentifier(row.code, 'AU', index + 1),
    name: String(row.name ?? ''),
    division: String(row.division ?? ''),
    auditDivisionId: row.auditDivisionId ?? undefined,
    category: String(row.category ?? ''),
    likelihood: Number(row.likelihood ?? 3),
    impact: Number(row.impact ?? 3),
    riskScore: Number(row.riskScore ?? 9),
    riskLevel: row.riskLevel ?? 'Medium',
    lastAudited: String(row.lastAudited ?? ''),
    nextDue: String(row.nextDue ?? ''),
    cycleMonths: Number(row.cycleMonths ?? 12),
    defaultLead: String(row.defaultLead ?? ''),
    riskNotes: row.riskNotes ?? '',
    addedBy: row.addedBy ?? undefined,
    modifiedBy: row.modifiedBy ?? undefined,
    modifiedAt: row.modifiedAt?.toDate ? row.modifiedAt.toDate().toISOString() : (row.modifiedAt ?? undefined),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToUserProfile(id: string, row: any, email?: string): UserProfile {
  return {
    id,
    name: String(row.name ?? ''),
    email: email || undefined,
    roleTitle: String(row.roleTitle ?? ''),
    fullLabel: String(row.fullLabel ?? ''),
    headerSubtitle: String(row.headerSubtitle ?? ''),
    department: String(row.department ?? ''),
    canApproveHead: Boolean(row.canApproveHead),
    canApproveIndependent: Boolean(row.canApproveIndependent),
    canApproveCAE: Boolean(row.canApproveCAE),
    employeeNumber: row.employeeNumber ?? undefined,
    lastLoginDate: row.lastLoginDate ?? undefined,
    accountModifiedAt: row.accountModifiedAt ?? undefined,
    accountStatus: row.accountStatus ?? 'Active',
    failedLoginCount: Number(row.failedLoginCount ?? 0),
    isLocked: Boolean(row.isLocked),
    requiresPasswordChange: Boolean(row.requiresPasswordChange),
    passwordLastChanged: row.passwordLastChanged ?? undefined,
    passwordHistory: [],
    mfaEnabled: Boolean(row.mfaEnabled),
    isPrivileged: Boolean(row.isPrivileged),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Payload Builders (Volumetric & Schema-Strict)
// ─────────────────────────────────────────────────────────────────────────────

function buildEngagementFields(eng: AuditEngagement, actor: string) {
  const fields: Record<string, unknown> = {
    id: sanitizeFirestoreId(eng.id),
    ref: clampStr(eng.ref, 40),
    year: Math.round(clampNum(eng.year, 2000, 2100, 2026)),
    title: clampStr(eng.title, 240, 'Untitled Engagement'),
    category: clampStr(eng.category, 120),
    department: clampStr(eng.department, 160),
    entityName: clampStr(eng.entityName, 240),
    likelihood: clampNum(eng.likelihood, 1, 5, 3),
    impact: clampNum(eng.impact, 1, 5, 3),
    riskScore: clampNum(eng.riskScore, 1, 25, 9),
    riskLevel: ['High', 'Medium', 'Low'].includes(eng.riskLevel) ? eng.riskLevel : 'Medium',
    lead: clampStr(eng.lead, 160),
    headReviewer: clampStr(eng.headReviewer, 160),
    independentReviewer: clampStr(eng.independentReviewer || 'Not needed', 160),
    startDate: clampStr(eng.startDate, 40),
    endDate: clampStr(eng.endDate, 40),
    durationDays: clampNum(eng.durationDays, 0, 3650, 0),
    budgetedHours: clampNum(eng.budgetedHours, 0, 50000, 0),
    status: clampStr(eng.status, 64, 'Planned'),
    readyRatio: clampStr(eng.readyRatio || '0/9 ready', 32),
    lifecycleStage: Math.round(clampNum(eng.lifecycleStage, 1, 7, 1)),
    fieldworkPct: clampNum(eng.fieldworkPct, 0, 100, 0),
    fieldworkDayCurrent: clampNum(eng.fieldworkDayCurrent, 0, 3650, 0),
    fieldworkDayTotal: clampNum(eng.fieldworkDayTotal, 0, 3650, 0),
    reportStatus: ['Draft', 'Submitted to Lead', 'Approved by Lead', 'Approved by CAE'].includes(eng.reportStatus)
      ? eng.reportStatus
      : 'Draft',
    reportRef: clampStr(eng.reportRef, 64),
    executiveSummary: clampStr(eng.executiveSummary, 8000),
    addedBy: clampStr(eng.addedBy || actor, 160),
    modifiedBy: clampStr(actor, 160),
  };
  if (eng.auditDivisionId) fields.auditDivisionId = clampStr(eng.auditDivisionId, 64);
  if (eng.objectives) fields.objectives = clampStr(eng.objectives, 4000);
  if (eng.scope) fields.scope = clampStr(eng.scope, 4000);
  if (eng.criteria) fields.criteria = clampStr(eng.criteria, 4000);
  if (eng.addresseeName) fields.addresseeName = clampStr(eng.addresseeName, 160);
  if (eng.addresseeTitle) fields.addresseeTitle = clampStr(eng.addresseeTitle, 160);
  if (eng.copyFurnished) fields.copyFurnished = clampStr(eng.copyFurnished, 500);
  if (eng.reportRating) fields.reportRating = clampStr(eng.reportRating, 64);
  return fields;
}

function buildWorkingNoteFields(engagementId: string, note: WorkingNote, actor: string) {
  const fields: Record<string, unknown> = {
    id: sanitizeFirestoreId(note.id),
    engagementId: sanitizeFirestoreId(engagementId),
    ref: clampStr(note.ref, 40),
    title: clampStr(note.title, 240, 'Working Note'),
    controlArea: clampStr(note.controlArea, 160),
    author: clampStr(note.author, 160),
    status: ['Cleared', 'For head review', 'For independent review', 'Draft', 'Returned'].includes(note.status)
      ? note.status
      : 'Draft',
    hasException: Boolean(note.hasException),
    updatedAt: clampStr(note.updatedAt, 64),
    testingProcedure: clampStr(note.testingProcedure, 4000),
    conclusion: clampStr(note.conclusion, 4000),
    addedBy: clampStr(note.addedBy || actor, 160),
    modifiedBy: clampStr(actor, 160),
  };
  if (note.observations) fields.observations = clampStr(note.observations, 4000);
  if (note.reviewerComments) fields.reviewerComments = clampStr(note.reviewerComments, 2000);
  return fields;
}

function buildFindingFields(engagementId: string, finding: AuditFinding, actor: string) {
  const fields: Record<string, unknown> = {
    id: sanitizeFirestoreId(finding.id),
    engagementId: sanitizeFirestoreId(engagementId),
    ref: clampStr(finding.ref, 40),
    title: clampStr(finding.title, 240, 'Finding'),
    severity: clampStr(finding.severity, 40, 'Medium'),
    condition: clampStr(finding.condition, 4000),
    criteria: clampStr(finding.criteria, 4000),
    cause: clampStr(finding.cause, 4000),
    effect: clampStr(finding.effect, 4000),
    recommendation: clampStr(finding.recommendation, 4000),
    owner: clampStr(finding.owner, 160),
    targetDate: clampStr(finding.targetDate, 64),
    status: ['Open', 'Action plan submitted', 'In remediation', 'Validated & Closed'].includes(finding.status)
      ? finding.status
      : 'Open',
    linkedNoteRef: clampStr(finding.linkedNoteRef, 40),
    addedBy: clampStr(finding.addedBy || actor, 160),
    modifiedBy: clampStr(actor, 160),
  };
  if (finding.category) fields.category = clampStr(finding.category, 120);
  return fields;
}

function buildIssueFields(issue: IssueRegisterItem, actor: string) {
  const fields: Record<string, unknown> = {
    id: sanitizeFirestoreId(issue.id),
    ref: clampStr(issue.ref, 40),
    title: clampStr(issue.title, 240, 'Issue'),
    auditRef: clampStr(issue.auditRef, 40),
    auditTitle: clampStr(issue.auditTitle, 240),
    severity: clampStr(issue.severity, 40, 'Medium'),
    owner: clampStr(issue.owner, 160),
    ownerUnit: clampStr(issue.ownerUnit, 160),
    originalDue: clampStr(issue.originalDue, 64),
    currentDue: clampStr(issue.currentDue, 64),
    extensionCount: Math.round(clampNum(issue.extensionCount, 0, 50, 0)),
    daysStatus: clampStr(issue.daysStatus, 64),
    isOverdue: Boolean(issue.isOverdue),
    isDueSoon: Boolean(issue.isDueSoon),
    status: ['Overdue', 'In progress', 'Open', 'Extension requested', 'For validation', 'Closed'].includes(issue.status)
      ? issue.status
      : 'Open',
    actionPlanSummary: clampStr(issue.actionPlanSummary, 4000),
    addedBy: clampStr(issue.addedBy || actor, 160),
    modifiedBy: clampStr(actor, 160),
  };
  if (issue.evidenceNote) fields.evidenceNote = clampStr(issue.evidenceNote, 2000);
  if (issue.extensionReason) fields.extensionReason = clampStr(issue.extensionReason, 2000);
  return fields;
}

function buildUniverseFields(entity: UniverseEntity, actor: string) {
  const fields: Record<string, unknown> = {
    id: sanitizeFirestoreId(entity.id),
    code: clampStr(entity.code, 32),
    name: clampStr(entity.name, 240, 'Entity'),
    division: clampStr(entity.division, 160),
    category: clampStr(entity.category, 120),
    likelihood: clampNum(entity.likelihood, 1, 5, 3),
    impact: clampNum(entity.impact, 1, 5, 3),
    riskScore: clampNum(entity.riskScore, 1, 25, 9),
    riskLevel: ['High', 'Medium', 'Low'].includes(entity.riskLevel) ? entity.riskLevel : 'Medium',
    lastAudited: clampStr(entity.lastAudited, 64),
    nextDue: clampStr(entity.nextDue, 64),
    cycleMonths: clampNum(entity.cycleMonths, 1, 120, 12),
    defaultLead: clampStr(entity.defaultLead, 160),
    addedBy: clampStr(entity.addedBy || actor, 160),
    modifiedBy: clampStr(actor, 160),
  };
  if (entity.auditDivisionId) fields.auditDivisionId = clampStr(entity.auditDivisionId, 64);
  if (entity.riskNotes) fields.riskNotes = clampStr(entity.riskNotes, 2000);
  return fields;
}

// ─────────────────────────────────────────────────────────────────────────────
// Baseline Seeding (first-time Firestore initialization by admin)
// ─────────────────────────────────────────────────────────────────────────────

export async function seedBaselineIfNeeded(force = false): Promise<void> {
  const { uid, memberUids, memberEmails, isAdmin } = getAuthAccessContext();
  if (!auth.currentUser || !isAdmin) return;
  if (!force && (await isSqlPrimaryMode())) return;

  const seedRef = doc(db, 'master_data', 'baseline_seeded');
  if (!force) {
    try {
      const seedSnap = await getDoc(seedRef);
      if (seedSnap.exists()) return;
      const existingEngs = await getDocs(buildCollectionQuery('engagements'));
      if (!existingEngs.empty) {
        await setDoc(seedRef, {
          id: 'baseline_seeded',
          data: { value: true },
          addedBy: getCurrentAccountEmail(),
          modifiedBy: getCurrentAccountEmail(),
          updatedAt: serverTimestamp(),
        });
        return;
      }
    } catch {
      return;
    }
  }

  const actor = getCurrentAccountEmail();

  // Seed audit frequencies
  await setDoc(doc(db, 'audit_frequencies', 'global'), {
    id: 'global',
    high: 12,
    medium: 36,
    low: 48,
    addedBy: actor,
    modifiedBy: actor,
    updatedAt: serverTimestamp(),
  });

  // Seed user profiles
  for (const profile of USERS) {
    const pid = sanitizeFirestoreId(profile.id);
    await setDoc(doc(db, 'user_profiles', pid), {
      id: pid,
      name: clampStr(profile.name, 160),
      roleTitle: clampStr(profile.roleTitle, 160),
      fullLabel: clampStr(profile.fullLabel, 240),
      headerSubtitle: clampStr(profile.headerSubtitle, 160),
      department: clampStr(profile.department, 160),
      canApproveHead: Boolean(profile.canApproveHead),
      canApproveIndependent: Boolean(profile.canApproveIndependent),
      canApproveCAE: Boolean(profile.canApproveCAE),
      ...(profile.employeeNumber ? { employeeNumber: clampStr(profile.employeeNumber, 64) } : {}),
      accountStatus: profile.accountStatus ?? 'Active',
      failedLoginCount: Number(profile.failedLoginCount ?? 0),
      isLocked: Boolean(profile.isLocked),
      requiresPasswordChange: Boolean(profile.requiresPasswordChange),
      mfaEnabled: Boolean(profile.mfaEnabled),
      isPrivileged: Boolean(profile.isPrivileged),
      ownerId: uid,
      memberUids,
      memberEmails,
      addedBy: actor,
      modifiedBy: actor,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });
    if (profile.email) {
      await setDoc(doc(db, 'user_profiles', pid, 'private', 'contact'), {
        profileId: pid,
        email: clampStr(profile.email.toLowerCase(), 160),
        ownerId: uid,
        updatedAt: serverTimestamp(),
      });
    }
  }

  // Seed initial universe entities
  const universeBatch = writeBatch(db);
  for (const entity of INITIAL_UNIVERSE) {
    const eid = sanitizeFirestoreId(entity.id);
    universeBatch.set(doc(db, 'universe_entities', eid), {
      ...buildUniverseFields(entity, actor),
      ownerId: uid,
      memberUids,
      memberEmails,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });
  }
  await universeBatch.commit();

  // Seed primary engagements + subcollections (first 14 detailed engagements from INITIAL_ENGAGEMENTS)
  const seedEngagements = INITIAL_ENGAGEMENTS.slice(0, 14);
  for (const eng of seedEngagements) {
    const eid = sanitizeFirestoreId(eng.id);
    await setDoc(doc(db, 'engagements', eid), {
      ...buildEngagementFields(eng, actor),
      ownerId: uid,
      memberUids,
      memberEmails,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });

    const subBatch = writeBatch(db);
    for (const wn of eng.workingNotes) {
      const wid = sanitizeFirestoreId(wn.id);
      subBatch.set(doc(db, 'engagements', eid, 'working_notes', wid), {
        ...buildWorkingNoteFields(eid, wn, actor),
        ownerId: uid,
        memberUids,
        memberEmails,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      });
    }
    for (const fnd of eng.findings) {
      const fid = sanitizeFirestoreId(fnd.id);
      subBatch.set(doc(db, 'engagements', eid, 'findings', fid), {
        ...buildFindingFields(eid, fnd, actor),
        ownerId: uid,
        memberUids,
        memberEmails,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      });
    }
    for (const ta of eng.timelineActivities) {
      const tid = sanitizeFirestoreId(ta.id);
      subBatch.set(doc(db, 'engagements', eid, 'timeline_activities', tid), {
        id: tid,
        engagementId: eid,
        name: clampStr(ta.name, 240),
        roleResponsible: clampStr(ta.roleResponsible, 160),
        dueDate: clampStr(ta.dueDate, 64),
        ...(ta.completedDate ? { completedDate: clampStr(ta.completedDate, 64) } : {}),
        status: ta.status,
        stageId: ta.stageId,
        ownerId: uid,
        memberUids,
        memberEmails,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      });
    }
    for (const fl of eng.files) {
      const flId = sanitizeFirestoreId(fl.id);
      subBatch.set(doc(db, 'engagements', eid, 'files', flId), {
        id: flId,
        engagementId: eid,
        name: clampStr(fl.name, 200),
        folder: clampStr(fl.folder, 120),
        size: clampStr(fl.size, 40),
        uploadedBy: clampStr(fl.uploadedBy, 160),
        uploadedAt: clampStr(fl.uploadedAt, 64),
        ownerId: uid,
        memberUids,
        memberEmails,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      });
    }
    for (const log of eng.activityLog) {
      const lid = sanitizeFirestoreId(log.id);
      subBatch.set(doc(db, 'engagements', eid, 'activity_log', lid), {
        id: lid,
        engagementId: eid,
        timestamp: clampStr(log.timestamp, 64),
        actor: clampStr(log.actor, 160),
        action: clampStr(log.action, 400),
        ...(log.detail ? { detail: clampStr(log.detail, 1000) } : {}),
        ownerId: uid,
        memberUids,
        memberEmails,
        createdAt: serverTimestamp(),
      });
    }
    await subBatch.commit();
  }

  // Seed initial issues register
  const issueBatch = writeBatch(db);
  for (const iss of INITIAL_ISSUES_REGISTER) {
    const iid = sanitizeFirestoreId(iss.id);
    issueBatch.set(doc(db, 'issues_register', iid), {
      ...buildIssueFields(iss, actor),
      ownerId: uid,
      memberUids,
      memberEmails,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });
  }
  await issueBatch.commit();

  // Seed sizing configs & mark seeded
  await saveMasterData('sizing_configs', INITIAL_SIZING);
  await setDoc(seedRef, {
    id: 'baseline_seeded',
    data: { value: true },
    addedBy: actor,
    modifiedBy: actor,
    updatedAt: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Engagements
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchEngagements(): Promise<AuditEngagement[]> {
  if (!auth.currentUser) return [];
  if (await isSqlPrimaryMode()) {
    const ws = await loadSqlWorkspaceShared();
    return ws.engagements;
  }
  try {
    const snap = await getDocs(buildCollectionQuery('engagements'));
    const engagements = await Promise.all(
      snap.docs.map(async (engDoc) => {
        const engData = engDoc.data();
        rememberMemberEmails(engData.memberEmails);
        const eid = engDoc.id;
        const [wnSnap, fndSnap, taSnap, fileSnap, logSnap] = await Promise.all([
          getDocs(buildSubcollectionQuery(eid, 'working_notes')).catch((err) =>
            handleFirestoreError(err, OperationType.LIST, `engagements/${eid}/working_notes`)
          ),
          getDocs(buildSubcollectionQuery(eid, 'findings')).catch((err) =>
            handleFirestoreError(err, OperationType.LIST, `engagements/${eid}/findings`)
          ),
          getDocs(buildSubcollectionQuery(eid, 'timeline_activities')).catch((err) =>
            handleFirestoreError(err, OperationType.LIST, `engagements/${eid}/timeline_activities`)
          ),
          getDocs(buildSubcollectionQuery(eid, 'files')).catch((err) =>
            handleFirestoreError(err, OperationType.LIST, `engagements/${eid}/files`)
          ),
          getDocs(buildSubcollectionQuery(eid, 'activity_log')).catch((err) =>
            handleFirestoreError(err, OperationType.LIST, `engagements/${eid}/activity_log`)
          ),
        ]);

        return docToEngagement(eid, engData, {
          workingNotes: wnSnap.docs.map((d) => docToWorkingNote(d.id, d.data())),
          findings: fndSnap.docs.map((d) => docToFinding(d.id, d.data())),
          timelineActivities: taSnap.docs.map((d) => docToTimeline(d.id, d.data())),
          files: fileSnap.docs.map((d) => docToFile(d.id, d.data())),
          activityLog: logSnap.docs.map((d) => docToActivityLog(d.id, d.data())),
        });
      })
    );
    return engagements.sort((a, b) => a.ref.localeCompare(b.ref));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'engagements');
  }
}

export async function upsertEngagement(eng: AuditEngagement): Promise<string | null> {
  const actor = getCurrentAccountEmail();
  const safeId = sanitizeFirestoreId(eng.id);
  if (await isSqlPrimaryMode()) {
    invalidateSqlWorkspaceCache();
    await sqlMirrorHelpers.upsertEngagement({ ...eng, id: safeId, modifiedBy: actor });
    return null;
  }
  const ref = doc(db, 'engagements', safeId);
  const { uid, memberUids, memberEmails } = getAuthAccessContext();
  const fields = buildEngagementFields({ ...eng, id: safeId }, actor);

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...fields,
        ownerId: uid,
        memberUids,
        memberEmails,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      });
    } else {
      const updatePayload = { ...fields };
      delete updatePayload.id;
      delete updatePayload.addedBy;
      await updateDoc(ref, {
        ...updatePayload,
        modifiedAt: serverTimestamp(),
      });
    }
    await sqlMirrorHelpers.upsertEngagement({ ...eng, id: safeId });
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `engagements/${safeId}`);
  }
}

export async function upsertWorkingNote(engagementId: string, note: WorkingNote): Promise<string | null> {
  const actor = getCurrentAccountEmail();
  const safeEngId = sanitizeFirestoreId(engagementId);
  const safeNoteId = sanitizeFirestoreId(note.id);
  if (await isSqlPrimaryMode()) {
    invalidateSqlWorkspaceCache();
    await sqlMirrorHelpers.upsertWorkingNote(safeEngId, { ...note, id: safeNoteId, modifiedBy: actor });
    return null;
  }
  const ref = doc(db, 'engagements', safeEngId, 'working_notes', safeNoteId);
  const { uid, memberUids, memberEmails } = getAuthAccessContext();
  const fields = buildWorkingNoteFields(safeEngId, { ...note, id: safeNoteId }, actor);

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...fields,
        ownerId: uid,
        memberUids,
        memberEmails,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      });
    } else {
      const updatePayload = { ...fields };
      delete updatePayload.id;
      delete updatePayload.engagementId;
      delete updatePayload.addedBy;
      await updateDoc(ref, {
        ...updatePayload,
        modifiedAt: serverTimestamp(),
      });
    }
    await sqlMirrorHelpers.upsertWorkingNote(safeEngId, { ...note, id: safeNoteId });
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `engagements/${safeEngId}/working_notes/${safeNoteId}`);
  }
}

export async function upsertFinding(engagementId: string, finding: AuditFinding): Promise<string | null> {
  const actor = getCurrentAccountEmail();
  const safeEngId = sanitizeFirestoreId(engagementId);
  const safeFindingId = sanitizeFirestoreId(finding.id);
  if (await isSqlPrimaryMode()) {
    invalidateSqlWorkspaceCache();
    await sqlMirrorHelpers.upsertFinding(safeEngId, { ...finding, id: safeFindingId, modifiedBy: actor });
    return null;
  }
  const ref = doc(db, 'engagements', safeEngId, 'findings', safeFindingId);
  const { uid, memberUids, memberEmails } = getAuthAccessContext();
  const fields = buildFindingFields(safeEngId, { ...finding, id: safeFindingId }, actor);

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...fields,
        ownerId: uid,
        memberUids,
        memberEmails,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      });
    } else {
      const updatePayload = { ...fields };
      delete updatePayload.id;
      delete updatePayload.engagementId;
      delete updatePayload.addedBy;
      await updateDoc(ref, {
        ...updatePayload,
        modifiedAt: serverTimestamp(),
      });
    }
    await sqlMirrorHelpers.upsertFinding(safeEngId, { ...finding, id: safeFindingId });
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `engagements/${safeEngId}/findings/${safeFindingId}`);
  }
}

export async function upsertTimelineActivity(engagementId: string, activity: TimelineActivity): Promise<void> {
  const safeEngId = sanitizeFirestoreId(engagementId);
  const safeActId = sanitizeFirestoreId(activity.id);
  if (await isSqlPrimaryMode()) {
    invalidateSqlWorkspaceCache();
    await sqlMirrorHelpers.upsertTimelineActivity(safeEngId, { ...activity, id: safeActId });
    return;
  }
  const ref = doc(db, 'engagements', safeEngId, 'timeline_activities', safeActId);
  const { uid, memberUids, memberEmails } = getAuthAccessContext();

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        id: safeActId,
        engagementId: safeEngId,
        name: clampStr(activity.name, 240),
        roleResponsible: clampStr(activity.roleResponsible, 160),
        dueDate: clampStr(activity.dueDate, 64),
        ...(activity.completedDate ? { completedDate: clampStr(activity.completedDate, 64) } : {}),
        status: activity.status,
        stageId: activity.stageId,
        ownerId: uid,
        memberUids,
        memberEmails,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        status: activity.status,
        dueDate: clampStr(activity.dueDate, 64),
        ...(activity.completedDate ? { completedDate: clampStr(activity.completedDate, 64) } : {}),
        modifiedAt: serverTimestamp(),
      });
    }
    await sqlMirrorHelpers.upsertTimelineActivity(safeEngId, { ...activity, id: safeActId });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `engagements/${safeEngId}/timeline_activities/${safeActId}`);
  }
}

export async function insertFile(engagementId: string, file: AuditFile): Promise<void> {
  const safeEngId = sanitizeFirestoreId(engagementId);
  const safeFileId = sanitizeFirestoreId(file.id);
  if (await isSqlPrimaryMode()) {
    invalidateSqlWorkspaceCache();
    await sqlMirrorHelpers.insertFile(safeEngId, { ...file, id: safeFileId });
    return;
  }
  const ref = doc(db, 'engagements', safeEngId, 'files', safeFileId);
  const { uid, memberUids, memberEmails } = getAuthAccessContext();

  try {
    await setDoc(ref, {
      id: safeFileId,
      engagementId: safeEngId,
      name: clampStr(file.name, 200),
      folder: clampStr(file.folder, 120),
      size: clampStr(file.size, 40),
      uploadedBy: clampStr(file.uploadedBy, 160),
      uploadedAt: clampStr(file.uploadedAt, 64),
      ownerId: uid,
      memberUids,
      memberEmails,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });
    await sqlMirrorHelpers.insertFile(safeEngId, { ...file, id: safeFileId });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `engagements/${safeEngId}/files/${safeFileId}`);
  }
}

export async function insertActivityLog(engagementId: string, log: ActivityLogItem): Promise<void> {
  const safeEngId = sanitizeFirestoreId(engagementId);
  const safeLogId = sanitizeFirestoreId(`${log.id}-${Date.now()}`);
  if (await isSqlPrimaryMode()) {
    invalidateSqlWorkspaceCache();
    await sqlMirrorHelpers.insertActivityLog(safeEngId, { ...log, id: safeLogId });
    return;
  }
  const ref = doc(db, 'engagements', safeEngId, 'activity_log', safeLogId);
  const { uid, memberUids, memberEmails } = getAuthAccessContext();

  try {
    await setDoc(ref, {
      id: safeLogId,
      engagementId: safeEngId,
      timestamp: clampStr(log.timestamp, 64),
      actor: clampStr(log.actor, 160),
      action: clampStr(log.action, 400),
      ...(log.detail ? { detail: clampStr(log.detail, 1000) } : {}),
      ownerId: uid,
      memberUids,
      memberEmails,
      createdAt: serverTimestamp(),
    });
    await sqlMirrorHelpers.insertActivityLog(safeEngId, { ...log, id: safeLogId });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `engagements/${safeEngId}/activity_log/${safeLogId}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Issues register
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchIssues(): Promise<IssueRegisterItem[]> {
  if (!auth.currentUser) return [];
  if (await isSqlPrimaryMode()) {
    const ws = await loadSqlWorkspaceShared();
    return ws.issues;
  }
  try {
    const snap = await getDocs(buildCollectionQuery('issues_register'));
    return snap.docs
      .map((d) => {
        const data = d.data();
        rememberMemberEmails(data.memberEmails);
        return docToIssue(d.id, data);
      })
      .sort((a, b) => a.ref.localeCompare(b.ref));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'issues_register');
  }
}

export async function upsertIssue(issue: IssueRegisterItem): Promise<string | null> {
  const actor = getCurrentAccountEmail();
  const safeId = sanitizeFirestoreId(issue.id);
  if (await isSqlPrimaryMode()) {
    invalidateSqlWorkspaceCache();
    await sqlMirrorHelpers.upsertIssue({ ...issue, id: safeId, modifiedBy: actor });
    return null;
  }
  const ref = doc(db, 'issues_register', safeId);
  const { uid, memberUids, memberEmails } = getAuthAccessContext();
  const fields = buildIssueFields({ ...issue, id: safeId }, actor);

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...fields,
        ownerId: uid,
        memberUids,
        memberEmails,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      });
    } else {
      const updatePayload = { ...fields };
      delete updatePayload.id;
      delete updatePayload.addedBy;
      await updateDoc(ref, {
        ...updatePayload,
        modifiedAt: serverTimestamp(),
      });
    }
    await sqlMirrorHelpers.upsertIssue({ ...issue, id: safeId });
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `issues_register/${safeId}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Universe entities
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchUniverse(): Promise<UniverseEntity[]> {
  if (!auth.currentUser) return [];
  if (await isSqlPrimaryMode()) {
    const ws = await loadSqlWorkspaceShared();
    return ws.universe;
  }
  try {
    const snap = await getDocs(buildCollectionQuery('universe_entities'));
    return snap.docs
      .map((d, index) => {
        const data = d.data();
        rememberMemberEmails(data.memberEmails);
        return docToUniverse(d.id, data, index);
      })
      .sort((a, b) => a.code.localeCompare(b.code));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'universe_entities');
  }
}

export async function upsertUniverseEntity(entity: UniverseEntity): Promise<string | null> {
  const actor = getCurrentAccountEmail();
  const safeId = sanitizeFirestoreId(entity.id);
  if (await isSqlPrimaryMode()) {
    invalidateSqlWorkspaceCache();
    await sqlMirrorHelpers.upsertUniverseEntity({ ...entity, id: safeId, modifiedBy: actor });
    return null;
  }
  const ref = doc(db, 'universe_entities', safeId);
  const { uid, memberUids, memberEmails } = getAuthAccessContext();
  const fields = buildUniverseFields({ ...entity, id: safeId }, actor);

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...fields,
        ownerId: uid,
        memberUids,
        memberEmails,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      });
    } else {
      const updatePayload = { ...fields };
      delete updatePayload.id;
      delete updatePayload.addedBy;
      await updateDoc(ref, {
        ...updatePayload,
        modifiedAt: serverTimestamp(),
      });
    }
    await sqlMirrorHelpers.upsertUniverseEntity({ ...entity, id: safeId });
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `universe_entities/${safeId}`);
  }
}

export async function deleteUniverseEntity(id: string): Promise<void> {
  const safeId = sanitizeFirestoreId(id);
  if (await isSqlPrimaryMode()) {
    invalidateSqlWorkspaceCache();
    await sqlMirrorHelpers.deleteUniverseEntity(safeId);
    return;
  }
  try {
    await deleteDoc(doc(db, 'universe_entities', safeId));
    await sqlMirrorHelpers.deleteUniverseEntity(safeId);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `universe_entities/${safeId}`);
  }
}

export async function syncUniverseFromSupabase(): Promise<{ synced: number; error?: string }> {
  const { isAdmin } = getAuthAccessContext();
  if (!auth.currentUser || !isAdmin) {
    return { synced: 0, error: 'Only administrators can sync data from Supabase.' };
  }

  const { data, error } = await supabase
    .from('universe_entities')
    .select('*')
    .order('code', { ascending: true });

  if (error) {
    return { synced: 0, error: `Supabase query failed: ${error.message}` };
  }

  const rows = data ?? [];
  const actor = getCurrentAccountEmail();
  let synced = 0;

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index] as Record<string, unknown>;
    const rawLevel = String(row.risk_level ?? 'Medium');
    const riskLevel: UniverseEntity['riskLevel'] =
      rawLevel === 'Critical' || rawLevel === 'High'
        ? 'High'
        : rawLevel === 'Low'
        ? 'Low'
        : 'Medium';

    const code = normalizeLegacyIdentifier(
      typeof row.code === 'string' ? row.code : undefined,
      'AU',
      index + 1
    );
    const id = sanitizeFirestoreId(
      typeof row.id === 'string' && row.id.trim() ? row.id : code.toLowerCase(),
      `au-${index + 1}`
    );

    const entity: UniverseEntity = {
      id,
      code,
      name: clampStr(row.name, 240, 'Entity'),
      division: clampStr(row.division, 160),
      auditDivisionId: typeof row.audit_division_id === 'string' && row.audit_division_id.trim()
        ? clampStr(row.audit_division_id, 64)
        : undefined,
      category: clampStr(row.category, 120),
      likelihood: clampNum(row.likelihood, 1, 5, 3),
      impact: clampNum(row.impact, 1, 5, 3),
      riskScore: clampNum(row.risk_score, 1, 25, 9),
      riskLevel,
      lastAudited: clampStr(row.last_audited, 64),
      nextDue: clampStr(row.next_due, 64),
      cycleMonths: clampNum(row.cycle_months, 1, 120, 12),
      defaultLead: clampStr(row.default_lead, 160),
      riskNotes: typeof row.risk_notes === 'string' && row.risk_notes.trim()
        ? clampStr(row.risk_notes, 2000)
        : undefined,
      addedBy: typeof row.added_by === 'string' && row.added_by.trim()
        ? clampStr(row.added_by, 160)
        : actor,
      modifiedBy: typeof row.modified_by === 'string' && row.modified_by.trim()
        ? clampStr(row.modified_by, 160)
        : actor,
      modifiedAt: typeof row.modified_at === 'string' && row.modified_at.trim()
        ? row.modified_at
        : new Date().toISOString(),
    };

    await upsertUniverseEntity(entity);
    synced += 1;
  }

  return { synced };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sizing configs
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchSizing(): Promise<SizingConfig[]> {
  return fetchMasterData<SizingConfig[]>('sizing_configs', INITIAL_SIZING);
}

export async function saveSizingConfigs(configs: SizingConfig[]): Promise<void> {
  await saveMasterData('sizing_configs', configs);
}

// ─────────────────────────────────────────────────────────────────────────────
// User profiles (split PII: email stored in user_profiles/{id}/private/contact)
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchUserProfiles(): Promise<UserProfile[]> {
  if (!auth.currentUser) return [];
  if (await isSqlPrimaryMode()) {
    const ws = await loadSqlWorkspaceShared();
    return ws.userProfiles;
  }
  const { isAdmin, email: currentEmail } = getAuthAccessContext();
  try {
    const snap = await getDocs(buildCollectionQuery('user_profiles'));
    const profiles = await Promise.all(
      snap.docs.map(async (pDoc) => {
        let email: string | undefined;
        try {
          const privSnap = await getDoc(doc(db, 'user_profiles', pDoc.id, 'private', 'contact'));
          if (privSnap.exists()) {
            const candidate = String(privSnap.data().email ?? '');
            if (isAdmin || candidate.toLowerCase() === currentEmail) {
              email = candidate;
            }
          }
        } catch {
          // Non-owners cannot read other users' private contact PII
        }
        return docToUserProfile(pDoc.id, pDoc.data(), email);
      })
    );
    return profiles.sort((a, b) => (a.employeeNumber ?? a.id).localeCompare(b.employeeNumber ?? b.id));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'user_profiles');
  }
}

export async function upsertUserProfile(u: UserProfile): Promise<string | null> {
  const actor = getCurrentAccountEmail();
  const safeId = sanitizeFirestoreId(u.id);
  if (await isSqlPrimaryMode()) {
    invalidateSqlWorkspaceCache();
    await sqlMirrorHelpers.upsertUserProfile({ ...u, id: safeId });
    return null;
  }
  const ref = doc(db, 'user_profiles', safeId);
  const privRef = doc(db, 'user_profiles', safeId, 'private', 'contact');
  const { uid, memberUids, memberEmails } = getAuthAccessContext();

  const fields: Record<string, unknown> = {
    id: safeId,
    name: clampStr(u.name, 160, 'User'),
    roleTitle: clampStr(u.roleTitle, 160),
    fullLabel: clampStr(u.fullLabel, 240),
    headerSubtitle: clampStr(u.headerSubtitle, 160),
    department: clampStr(u.department, 160),
    canApproveHead: Boolean(u.canApproveHead),
    canApproveIndependent: Boolean(u.canApproveIndependent),
    canApproveCAE: Boolean(u.canApproveCAE),
    accountStatus: u.accountStatus ?? 'Active',
    failedLoginCount: Math.round(clampNum(u.failedLoginCount ?? 0, 0, 100, 0)),
    isLocked: Boolean(u.isLocked),
    requiresPasswordChange: Boolean(u.requiresPasswordChange),
    mfaEnabled: Boolean(u.mfaEnabled),
    isPrivileged: Boolean(u.isPrivileged),
    addedBy: clampStr(actor, 160),
    modifiedBy: clampStr(actor, 160),
  };
  if (u.employeeNumber) fields.employeeNumber = clampStr(u.employeeNumber, 64);
  if (u.lastLoginDate) fields.lastLoginDate = clampStr(u.lastLoginDate, 64);
  if (u.accountModifiedAt) fields.accountModifiedAt = clampStr(u.accountModifiedAt, 64);
  if (u.passwordLastChanged) fields.passwordLastChanged = clampStr(u.passwordLastChanged, 64);

  try {
    const snap = await getDoc(ref);
    const batch = writeBatch(db);
    if (!snap.exists()) {
      batch.set(ref, {
        ...fields,
        ownerId: uid,
        memberUids,
        memberEmails,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      });
    } else {
      const updatePayload = { ...fields };
      delete updatePayload.id;
      delete updatePayload.addedBy;
      batch.update(ref, {
        ...updatePayload,
        modifiedAt: serverTimestamp(),
      });
    }
    if (u.email) {
      batch.set(privRef, {
        profileId: safeId,
        email: clampStr(u.email.toLowerCase(), 160),
        ownerId: uid,
        updatedAt: serverTimestamp(),
      });
    }
    await batch.commit();
    await sqlMirrorHelpers.upsertUserProfile({ ...u, id: safeId });
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `user_profiles/${safeId}`);
  }
}

export async function deleteUserProfile(id: string): Promise<string | null> {
  const safeId = sanitizeFirestoreId(id);
  if (await isSqlPrimaryMode()) {
    invalidateSqlWorkspaceCache();
    await sqlMirrorHelpers.deleteUserProfile(safeId);
    return null;
  }
  try {
    await deleteDoc(doc(db, 'user_profiles', safeId, 'private', 'contact')).catch(() => {});
    await deleteDoc(doc(db, 'user_profiles', safeId));
    await sqlMirrorHelpers.deleteUserProfile(safeId);
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `user_profiles/${safeId}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Audit frequencies & Division Risk Scales
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchFrequencies(): Promise<AuditFrequencies> {
  if (!auth.currentUser) return { high: 12, medium: 36, low: 48 };
  if (await isSqlPrimaryMode()) {
    const ws = await loadSqlWorkspaceShared();
    return ws.frequencies;
  }
  try {
    const snap = await getDoc(doc(db, 'audit_frequencies', 'global'));
    if (!snap.exists()) return { high: 12, medium: 36, low: 48 };
    const data = snap.data();
    return {
      high: Number(data.high ?? 12),
      medium: Number(data.medium ?? 36),
      low: Number(data.low ?? 48),
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'audit_frequencies/global');
  }
}

export async function saveFrequencies(freq: AuditFrequencies): Promise<void> {
  const actor = getCurrentAccountEmail();
  if (await isSqlPrimaryMode()) {
    invalidateSqlWorkspaceCache();
    await sqlMirrorHelpers.saveFrequencies(freq);
    return;
  }
  try {
    await setDoc(doc(db, 'audit_frequencies', 'global'), {
      id: 'global',
      high: Math.round(clampNum(freq.high, 1, 120, 12)),
      medium: Math.round(clampNum(freq.medium, 1, 120, 36)),
      low: Math.round(clampNum(freq.low, 1, 120, 48)),
      addedBy: clampStr(actor, 160),
      modifiedBy: clampStr(actor, 160),
      updatedAt: serverTimestamp(),
    });
    await sqlMirrorHelpers.saveFrequencies(freq);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'audit_frequencies/global');
  }
}

export async function fetchAuditDivisionRiskScales(): Promise<AuditDivisionRiskScale[]> {
  const savedScales = await fetchMasterData<AuditDivisionRiskScale[] | null>(
    'audit_division_risk_scales',
    null
  );
  if (Array.isArray(savedScales) && savedScales.length > 0) {
    return savedScales;
  }
  return DEFAULT_AUDIT_DIVISION_RISK_SCALES;
}

export async function saveAuditDivisionRiskScales(
  scales: AuditDivisionRiskScale[],
  _sessionToken?: string
): Promise<void> {
  const actor = getCurrentAccountEmail();
  const now = new Date().toISOString();
  const enrichedScales = scales.map((scale) => ({
    ...scale,
    name: scale.name.trim(),
    addedBy: scale.addedBy || actor,
    modifiedBy: actor,
    modifiedAt: now,
  }));
  await saveMasterData('audit_division_risk_scales', enrichedScales);
}

// ─────────────────────────────────────────────────────────────────────────────
// Master data & Setup checklist persistence
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchMasterData<T>(key: string, fallback: T): Promise<T> {
  const safeKey = sanitizeFirestoreId(key);
  const { isAdmin } = getAuthAccessContext();

  if (auth.currentUser && (!ADMIN_ONLY_MASTER_KEYS.has(safeKey) || isAdmin)) {
    if (await isSqlPrimaryMode()) {
      const sqlVal = await fetchSqlMasterData<T>(safeKey);
      return sqlVal === null || sqlVal === undefined ? fallback : sqlVal;
    }
    try {
      const snap = await getDoc(doc(db, 'master_data', safeKey));
      if (snap.exists()) {
        const raw = snap.data()?.data;
        const resolved = raw && typeof raw === 'object' && 'value' in raw ? raw.value : raw;
        if (resolved !== undefined && resolved !== null) {
          try {
            localStorage.setItem(`ams_master_${key}`, JSON.stringify(resolved));
          } catch {
            // ignore
          }
          return resolved as T;
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `master_data/${safeKey}`);
    }
  }

  try {
    const cached = localStorage.getItem(`ams_master_${key}`);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch {
    // ignore
  }

  return fallback;
}

export async function saveMasterData<T>(key: string, value: T): Promise<void> {
  const actor = getCurrentAccountEmail();
  const safeKey = sanitizeFirestoreId(key);

  try {
    localStorage.setItem(`ams_master_${key}`, JSON.stringify(value));
  } catch (err) {
    console.warn('localStorage save failed:', err);
  }

  if (!auth.currentUser) return;
  const { isAdmin } = getAuthAccessContext();
  if (!isAdmin) return;

  if (await isSqlPrimaryMode()) {
    await sqlMirrorHelpers.saveMasterData(safeKey, value);
    return;
  }

  try {
    await setDoc(doc(db, 'master_data', safeKey), {
      id: safeKey,
      data: { value },
      addedBy: clampStr(actor, 160),
      modifiedBy: clampStr(actor, 160),
      updatedAt: serverTimestamp(),
    });
    await sqlMirrorHelpers.saveMasterData(safeKey, value);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `master_data/${safeKey}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Workspace Membership & System User Synchronization
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchActiveMemberEmails(): Promise<string[]> {
  const { email: currentEmail, isBootstrapped, isAdmin } = getAuthAccessContext();
  if (!auth.currentUser) return [BOOTSTRAPPED_ADMIN_EMAIL];
  if (!isAdmin) return Array.from(cachedWorkspaceMemberEmails).slice(0, 100);

  const activeSet = new Set<string>([BOOTSTRAPPED_ADMIN_EMAIL]);
  if (currentEmail) activeSet.add(currentEmail);

  try {
    const regSnap = await getDoc(doc(db, 'master_data', 'access_users_registry'));
    if (regSnap.exists()) {
      const raw = regSnap.data()?.data;
      const list = raw && typeof raw === 'object' && 'value' in raw ? raw.value : raw;
      if (Array.isArray(list)) {
        for (const item of list) {
          const mail = typeof item?.email === 'string' ? item.email.trim().toLowerCase() : '';
          const status = item?.status ?? 'Active';
          const locked = Boolean(item?.isLocked);
          if (mail && status === 'Active' && !locked) {
            activeSet.add(clampStr(mail, 160));
          }
        }
      }
    } else {
      for (const u of USERS) {
        if (u.email && u.accountStatus !== 'Inactive' && u.accountStatus !== 'Deactivated' && !u.isLocked) {
          activeSet.add(clampStr(u.email.toLowerCase(), 160));
        }
      }
    }
  } catch {
    // Ignore registry read error and continue with known emails
  }

  if (isBootstrapped) {
    try {
      const sysSnap = await getDocs(collection(db, 'system_users'));
      for (const d of sysSnap.docs) {
        const data = d.data();
        const mail = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
        if (!mail) continue;
        if (data.isActive !== false && data.isLocked !== true) {
          activeSet.add(clampStr(mail, 160));
        } else if (mail !== BOOTSTRAPPED_ADMIN_EMAIL) {
          activeSet.delete(mail);
        }
      }
    } catch {
      // Ignore secondary system_users scan error
    }
  }

  const finalList = Array.from(activeSet).slice(0, 100);
  cachedWorkspaceMemberEmails.clear();
  for (const m of finalList) cachedWorkspaceMemberEmails.add(m);
  return finalList;
}

type PendingBatchWrite = {
  ref: ReturnType<typeof doc>;
  data: Record<string, unknown>;
};

async function commitChunkedUpdates(writes: PendingBatchWrite[]) {
  const CHUNK_SIZE = 380;
  for (let i = 0; i < writes.length; i += CHUNK_SIZE) {
    const batch = writeBatch(db);
    const slice = writes.slice(i, i + CHUNK_SIZE);
    for (const w of slice) {
      batch.update(w.ref, w.data);
    }
    await batch.commit();
  }
}

export async function syncWorkspaceMembershipForEmail(
  email: string,
  shouldInclude: boolean
): Promise<void> {
  const { isAdmin } = getAuthAccessContext();
  if (!auth.currentUser || !isAdmin) return;

  const target = clampStr(email.trim().toLowerCase(), 160);
  if (!target) return;
  if (target === BOOTSTRAPPED_ADMIN_EMAIL && !shouldInclude) return;

  if (shouldInclude) {
    if (cachedWorkspaceMemberEmails.size < 100) {
      cachedWorkspaceMemberEmails.add(target);
    }
  } else {
    cachedWorkspaceMemberEmails.delete(target);
  }

  const mutation = shouldInclude ? arrayUnion(target) : arrayRemove(target);
  const writes: PendingBatchWrite[] = [];

  try {
    for (const colName of ['universe_entities', 'issues_register', 'user_profiles'] as const) {
      const snap = await getDocs(buildCollectionQuery(colName));
      for (const d of snap.docs) {
        writes.push({
          ref: d.ref,
          data: {
            memberEmails: mutation,
            modifiedAt: serverTimestamp(),
          },
        });
      }
    }

    const engSnap = await getDocs(buildCollectionQuery('engagements'));
    for (const engDoc of engSnap.docs) {
      writes.push({
        ref: engDoc.ref,
        data: {
          memberEmails: mutation,
          modifiedAt: serverTimestamp(),
        },
      });
      const eid = engDoc.id;
      for (const subName of [
        'working_notes',
        'findings',
        'timeline_activities',
        'files',
      ] as const) {
        const subSnap = await getDocs(buildSubcollectionQuery(eid, subName));
        for (const sDoc of subSnap.docs) {
          writes.push({
            ref: sDoc.ref,
            data: {
              memberEmails: mutation,
              modifiedAt: serverTimestamp(),
            },
          });
        }
      }
      const logSnap = await getDocs(buildSubcollectionQuery(eid, 'activity_log'));
      for (const lDoc of logSnap.docs) {
        writes.push({
          ref: lDoc.ref,
          data: {
            memberEmails: mutation,
          },
        });
      }
    }

    if (writes.length > 0) {
      await commitChunkedUpdates(writes);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'workspace_membership_sync');
  }
}

export async function syncAllActiveWorkspaceMembers(activeEmails: string[]): Promise<void> {
  const { isAdmin } = getAuthAccessContext();
  if (!auth.currentUser || !isAdmin) return;

  const targetList = Array.from(
    new Set(
      [BOOTSTRAPPED_ADMIN_EMAIL, ...activeEmails.map((e) => clampStr(e.trim().toLowerCase(), 160))].filter(Boolean)
    )
  ).slice(0, 100);
  const targetSorted = [...targetList].sort();

  const needsUpdate = (currentRaw: unknown) => {
    const current = Array.isArray(currentRaw)
      ? currentRaw.map((v) => String(v).trim().toLowerCase()).filter(Boolean).sort()
      : [];
    if (current.length !== targetSorted.length) return true;
    return targetSorted.some((email, idx) => current[idx] !== email);
  };

  const writes: PendingBatchWrite[] = [];

  try {
    for (const colName of ['universe_entities', 'issues_register', 'user_profiles'] as const) {
      const snap = await getDocs(buildCollectionQuery(colName));
      for (const d of snap.docs) {
        if (needsUpdate(d.data().memberEmails)) {
          writes.push({
            ref: d.ref,
            data: {
              memberEmails: targetList,
              modifiedAt: serverTimestamp(),
            },
          });
        }
      }
    }

    const engSnap = await getDocs(buildCollectionQuery('engagements'));
    for (const engDoc of engSnap.docs) {
      if (needsUpdate(engDoc.data().memberEmails)) {
        writes.push({
          ref: engDoc.ref,
          data: {
            memberEmails: targetList,
            modifiedAt: serverTimestamp(),
          },
        });
      }
      const eid = engDoc.id;
      for (const subName of [
        'working_notes',
        'findings',
        'timeline_activities',
        'files',
      ] as const) {
        const subSnap = await getDocs(buildSubcollectionQuery(eid, subName));
        for (const sDoc of subSnap.docs) {
          if (needsUpdate(sDoc.data().memberEmails)) {
            writes.push({
              ref: sDoc.ref,
              data: {
                memberEmails: targetList,
                modifiedAt: serverTimestamp(),
              },
            });
          }
        }
      }
      const logSnap = await getDocs(buildSubcollectionQuery(eid, 'activity_log'));
      for (const lDoc of logSnap.docs) {
        if (needsUpdate(lDoc.data().memberEmails)) {
          writes.push({
            ref: lDoc.ref,
            data: {
              memberEmails: targetList,
            },
          });
        }
      }
    }

    if (writes.length > 0) {
      await commitChunkedUpdates(writes);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'workspace_membership_repair');
  }
}

export async function ensureWorkspaceMembershipSynced(): Promise<void> {
  const { isAdmin, isBootstrapped } = getAuthAccessContext();
  if (!auth.currentUser || !isAdmin) return;
  if (await isSqlPrimaryMode()) return;

  const actor = getCurrentAccountEmail();
  const sysSeedRef = doc(db, 'master_data', 'system_users_seeded');

  try {
    const sysSeedSnap = await getDoc(sysSeedRef);
    if (!sysSeedSnap.exists()) {
      for (const profile of USERS) {
        if (!profile.email) continue;
        const mail = profile.email.trim().toLowerCase();
        const detRef = doc(db, 'system_users', emailToSystemUserId(mail));
        const detSnap = await getDoc(detRef);
        let exists = detSnap.exists();
        if (!exists && isBootstrapped) {
          const legacySnap = await getDocs(
            query(collection(db, 'system_users'), where('email', '==', mail))
          );
          exists = !legacySnap.empty;
        }
        if (!exists) {
          const appRole = profile.headerSubtitle || profile.roleTitle;
          const isSysAdmin = normalizeRole(appRole) === 'System administrator';
          await createOrSyncSystemUser({
            username: mail.split('@')[0],
            fullName: profile.name,
            email: mail,
            role: isSysAdmin ? 'admin' : 'user',
            appRole,
            scope: profile.department === 'Internal Audit' ? 'Full access' : `${profile.department} operations`,
            employeeNumber: profile.employeeNumber,
            isActive: profile.accountStatus !== 'Inactive' && profile.accountStatus !== 'Deactivated',
            isLocked: Boolean(profile.isLocked),
          });
        }
      }

      const regSnap = await getDoc(doc(db, 'master_data', 'access_users_registry'));
      if (regSnap.exists()) {
        const raw = regSnap.data()?.data;
        const list = raw && typeof raw === 'object' && 'value' in raw ? raw.value : raw;
        if (Array.isArray(list)) {
          for (const item of list) {
            const mail = typeof item?.email === 'string' ? item.email.trim().toLowerCase() : '';
            if (!mail) continue;
            const roleName = Array.isArray(item.roles) && item.roles[0] ? String(item.roles[0]) : 'Assisting Auditor';
            const isSysAdmin = normalizeRole(roleName) === 'System administrator';
            await createOrSyncSystemUser({
              username: mail.split('@')[0],
              fullName: String(item.name || mail.split('@')[0]),
              email: mail,
              role: isSysAdmin ? 'admin' : 'user',
              appRole: roleName,
              scope: typeof item.scope === 'string' ? item.scope : 'Assigned engagements',
              employeeNumber: typeof item.employeeNumber === 'string' ? item.employeeNumber : undefined,
              isActive: (item.status ?? 'Active') === 'Active',
              isLocked: Boolean(item.isLocked),
            });
          }
        }
      }

      await setDoc(sysSeedRef, {
        id: 'system_users_seeded',
        data: { value: true },
        addedBy: clampStr(actor, 160),
        modifiedBy: clampStr(actor, 160),
        updatedAt: serverTimestamp(),
      });
    }

    const activeEmails = await fetchActiveMemberEmails();
    await syncAllActiveWorkspaceMembers(activeEmails);

  } catch (err) {
    console.warn('Workspace membership sync warning:', err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Real-time Firestore Listeners
// ─────────────────────────────────────────────────────────────────────────────

export function subscribeToWorkspaceChanges(handlers: {
  onEngagementsChanged: () => void;
  onIssuesChanged: (issues: IssueRegisterItem[]) => void;
  onUniverseChanged: (universe: UniverseEntity[]) => void;
}): Unsubscribe {
  if (!auth.currentUser) return () => {};

  let cancelled = false;
  let unsubs: Unsubscribe[] = [];

  void isSqlPrimaryMode().then((primary) => {
    if (cancelled || primary || !auth.currentUser) return;

    const unsubEng = onSnapshot(
      buildCollectionQuery('engagements'),
      (snap) => {
        snap.docs.forEach((d) => rememberMemberEmails(d.data().memberEmails));
        handlers.onEngagementsChanged();
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'engagements');
      }
    );

    const unsubIssues = onSnapshot(
      buildCollectionQuery('issues_register'),
      (snap) => {
        const items = snap.docs
          .map((d) => {
            const data = d.data();
            rememberMemberEmails(data.memberEmails);
            return docToIssue(d.id, data);
          })
          .sort((a, b) => a.ref.localeCompare(b.ref));
        handlers.onIssuesChanged(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'issues_register');
      }
    );

    const unsubUniverse = onSnapshot(
      buildCollectionQuery('universe_entities'),
      (snap) => {
        const items = snap.docs
          .map((d, idx) => {
            const data = d.data();
            rememberMemberEmails(data.memberEmails);
            return docToUniverse(d.id, data, idx);
          })
          .sort((a, b) => a.code.localeCompare(b.code));
        handlers.onUniverseChanged(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'universe_entities');
      }
    );

    unsubs = [unsubEng, unsubIssues, unsubUniverse];
  });

  return () => {
    cancelled = true;
    unsubs.forEach((u) => u());
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Reset to baseline
// ─────────────────────────────────────────────────────────────────────────────

export async function resetSystemToBaseline(): Promise<void> {
  const { isAdmin } = getAuthAccessContext();
  if (!isAdmin) {
    throw new Error('Only administrators can reset the system to baseline.');
  }

  const engSnap = await getDocs(buildCollectionQuery('engagements'));
  for (const engDoc of engSnap.docs) {
    const eid = engDoc.id;
    for (const sub of ['working_notes', 'findings', 'timeline_activities', 'files', 'activity_log']) {
      const subSnap = await getDocs(buildSubcollectionQuery(eid, sub));
      for (const sDoc of subSnap.docs) {
        await deleteDoc(doc(db, 'engagements', eid, sub, sDoc.id));
      }
    }
    await deleteDoc(doc(db, 'engagements', eid));
  }

  for (const colName of ['issues_register', 'universe_entities'] as const) {
    const snap = await getDocs(buildCollectionQuery(colName));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, colName, d.id));
    }
  }

  await deleteDoc(doc(db, 'master_data', 'baseline_seeded')).catch(() => {});
  await deleteDoc(doc(db, 'master_data', 'sql_connect_initial_synced')).catch(() => {});

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('ams_') || key?.startsWith('bssc_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));

  await seedBaselineIfNeeded(true);
  await ensureWorkspaceMembershipSynced();
}
