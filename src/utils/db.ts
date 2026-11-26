/**
 * db.ts — Firebase Data Connect (via Express API) data layer for all audit app entities.
 *
 * All reads and writes go through server.ts (/api/sql/*) to Firebase Data Connect
 * (`csb-ams-2-service`, location `asia-southeast1`, connector `example`).
 */

import { auth } from '../firebase';
import { supabase } from './supabaseClient';
import {
  ActivityLogItem,
  AuditDivisionRiskScale,
  AuditEngagement,
  AuditFile,
  AuditFinding,
  INITIAL_SIZING,
  IssueRegisterItem,
  SizingConfig,
  TimelineActivity,
  UniverseEntity,
  UserProfile,
  WorkingNote,
} from '../data/auditData';
import { getCurrentAccountEmail } from './auditMetadata';
import {
  BOOTSTRAPPED_ADMIN_EMAIL,
  loadSession,
  sanitizeFirestoreId,
} from './authStore';
import { normalizeLegacyIdentifier } from './identifiers';
import { DEFAULT_AUDIT_DIVISION_RISK_SCALES } from './riskScale';
import {
  fetchSqlMasterData,
  fetchSqlSystemUsers,
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
  const email = clampStr((current?.email ?? BOOTSTRAPPED_ADMIN_EMAIL).toLowerCase(), 160);
  const isBootstrapped = email === BOOTSTRAPPED_ADMIN_EMAIL;
  const isAdmin = isBootstrapped || loadSession()?.role === 'admin';
  return { email, isBootstrapped, isAdmin };
}

let sqlWorkspaceInflight: Promise<Awaited<ReturnType<typeof fetchSqlWorkspace>>> | null = null;
let sqlWorkspaceLastFetchedAt = 0;
let sqlWorkspaceCache: Awaited<ReturnType<typeof fetchSqlWorkspace>> | null = null;

async function ensureSqlReady(): Promise<void> {
  const status = await getSqlConnectStatus();
  if (!status.configured || status.mode !== 'primary') {
    throw new Error('Firebase Data Connect is not configured as the primary data store.');
  }
}

async function loadSqlWorkspaceShared() {
  await ensureSqlReady();
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

function invalidateSqlWorkspaceCache() {
  sqlWorkspaceCache = null;
  sqlWorkspaceLastFetchedAt = 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Seeding Guard (existing Firebase Data Connect tables are preserved as-is)
// ─────────────────────────────────────────────────────────────────────────────

export async function seedBaselineIfNeeded(_force = false): Promise<void> {
  if (!auth.currentUser) return;
  await ensureSqlReady();
}

// ─────────────────────────────────────────────────────────────────────────────
// Engagements
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchEngagements(): Promise<AuditEngagement[]> {
  if (!auth.currentUser) return [];
  const ws = await loadSqlWorkspaceShared();
  return ws.engagements;
}

export async function upsertEngagement(eng: AuditEngagement): Promise<string | null> {
  const actor = getCurrentAccountEmail();
  const safeId = sanitizeFirestoreId(eng.id);
  await sqlMirrorHelpers.upsertEngagement({ ...eng, id: safeId, modifiedBy: actor });
  invalidateSqlWorkspaceCache();
  return null;
}

export async function upsertWorkingNote(engagementId: string, note: WorkingNote): Promise<string | null> {
  const actor = getCurrentAccountEmail();
  const safeEngId = sanitizeFirestoreId(engagementId);
  const safeNoteId = sanitizeFirestoreId(note.id);
  await sqlMirrorHelpers.upsertWorkingNote(safeEngId, { ...note, id: safeNoteId, modifiedBy: actor });
  invalidateSqlWorkspaceCache();
  return null;
}

export async function upsertFinding(engagementId: string, finding: AuditFinding): Promise<string | null> {
  const actor = getCurrentAccountEmail();
  const safeEngId = sanitizeFirestoreId(engagementId);
  const safeFindingId = sanitizeFirestoreId(finding.id);
  await sqlMirrorHelpers.upsertFinding(safeEngId, { ...finding, id: safeFindingId, modifiedBy: actor });
  invalidateSqlWorkspaceCache();
  return null;
}

export async function upsertTimelineActivity(engagementId: string, activity: TimelineActivity): Promise<void> {
  const safeEngId = sanitizeFirestoreId(engagementId);
  const safeActId = sanitizeFirestoreId(activity.id);
  await sqlMirrorHelpers.upsertTimelineActivity(safeEngId, { ...activity, id: safeActId });
  invalidateSqlWorkspaceCache();
}

export async function insertFile(engagementId: string, file: AuditFile): Promise<void> {
  const safeEngId = sanitizeFirestoreId(engagementId);
  const safeFileId = sanitizeFirestoreId(file.id);
  await sqlMirrorHelpers.insertFile(safeEngId, { ...file, id: safeFileId });
  invalidateSqlWorkspaceCache();
}

export async function insertActivityLog(engagementId: string, log: ActivityLogItem): Promise<void> {
  const safeEngId = sanitizeFirestoreId(engagementId);
  const safeLogId = sanitizeFirestoreId(`${log.id}-${Date.now()}`);
  await sqlMirrorHelpers.insertActivityLog(safeEngId, { ...log, id: safeLogId });
  invalidateSqlWorkspaceCache();
}

// ─────────────────────────────────────────────────────────────────────────────
// Issues register
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchIssues(): Promise<IssueRegisterItem[]> {
  if (!auth.currentUser) return [];
  const ws = await loadSqlWorkspaceShared();
  return ws.issues;
}

export async function upsertIssue(issue: IssueRegisterItem): Promise<string | null> {
  const actor = getCurrentAccountEmail();
  const safeId = sanitizeFirestoreId(issue.id);
  await sqlMirrorHelpers.upsertIssue({ ...issue, id: safeId, modifiedBy: actor });
  invalidateSqlWorkspaceCache();
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Universe entities
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchUniverse(): Promise<UniverseEntity[]> {
  if (!auth.currentUser) return [];
  const ws = await loadSqlWorkspaceShared();
  return ws.universe;
}

export async function upsertUniverseEntity(entity: UniverseEntity): Promise<string | null> {
  const actor = getCurrentAccountEmail();
  const safeId = sanitizeFirestoreId(entity.id);
  await sqlMirrorHelpers.upsertUniverseEntity({ ...entity, id: safeId, modifiedBy: actor });
  invalidateSqlWorkspaceCache();
  return null;
}

export async function deleteUniverseEntity(id: string): Promise<void> {
  const safeId = sanitizeFirestoreId(id);
  await sqlMirrorHelpers.deleteUniverseEntity(safeId);
  invalidateSqlWorkspaceCache();
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
      auditDivisionId:
        typeof row.audit_division_id === 'string' && row.audit_division_id.trim()
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
      riskNotes:
        typeof row.risk_notes === 'string' && row.risk_notes.trim()
          ? clampStr(row.risk_notes, 2000)
          : undefined,
      addedBy:
        typeof row.added_by === 'string' && row.added_by.trim()
          ? clampStr(row.added_by, 160)
          : actor,
      modifiedBy:
        typeof row.modified_by === 'string' && row.modified_by.trim()
          ? clampStr(row.modified_by, 160)
          : actor,
      modifiedAt:
        typeof row.modified_at === 'string' && row.modified_at.trim()
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
// User profiles
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchUserProfiles(): Promise<UserProfile[]> {
  if (!auth.currentUser) return [];
  const ws = await loadSqlWorkspaceShared();
  return ws.userProfiles;
}

export async function upsertUserProfile(u: UserProfile): Promise<string | null> {
  const safeId = sanitizeFirestoreId(u.id);
  await sqlMirrorHelpers.upsertUserProfile({ ...u, id: safeId });
  invalidateSqlWorkspaceCache();
  return null;
}

export async function deleteUserProfile(id: string): Promise<string | null> {
  const safeId = sanitizeFirestoreId(id);
  await sqlMirrorHelpers.deleteUserProfile(safeId);
  invalidateSqlWorkspaceCache();
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Audit frequencies & Division Risk Scales
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchFrequencies(): Promise<AuditFrequencies> {
  if (!auth.currentUser) return { high: 12, medium: 36, low: 48 };
  const ws = await loadSqlWorkspaceShared();
  return ws.frequencies;
}

export async function saveFrequencies(freq: AuditFrequencies): Promise<void> {
  await sqlMirrorHelpers.saveFrequencies(freq);
  invalidateSqlWorkspaceCache();
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
    await ensureSqlReady();
    const sqlVal = await fetchSqlMasterData<T>(safeKey);
    if (sqlVal !== null && sqlVal !== undefined) {
      try {
        localStorage.setItem(`ams_master_${key}`, JSON.stringify(sqlVal));
      } catch {
        // ignore
      }
      return sqlVal;
    }
    return fallback;
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
  if (!auth.currentUser) {
    throw new Error('Authentication required to save configuration data.');
  }
  const { isAdmin } = getAuthAccessContext();
  if (!isAdmin) {
    throw new Error('Administrator privileges required to modify system configuration.');
  }

  const safeKey = sanitizeFirestoreId(key);
  await ensureSqlReady();
  await sqlMirrorHelpers.saveMasterData(safeKey, value);

  try {
    localStorage.setItem(`ams_master_${key}`, JSON.stringify(value));
  } catch (err) {
    console.warn('localStorage save failed:', err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Workspace Membership (Data Connect backed)
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchActiveMemberEmails(): Promise<string[]> {
  const { email: currentEmail, isAdmin } = getAuthAccessContext();
  if (!auth.currentUser) return [BOOTSTRAPPED_ADMIN_EMAIL];
  if (!isAdmin) return currentEmail ? [currentEmail] : [];

  const activeSet = new Set<string>([BOOTSTRAPPED_ADMIN_EMAIL]);
  if (currentEmail) activeSet.add(currentEmail);

  try {
    const users = await fetchSqlSystemUsers();
    for (const u of users) {
      const mail = typeof u.email === 'string' ? u.email.trim().toLowerCase() : '';
      if (!mail) continue;
      if (u.isActive !== false && u.isLocked !== true) {
        activeSet.add(clampStr(mail, 160));
      } else if (mail !== BOOTSTRAPPED_ADMIN_EMAIL) {
        activeSet.delete(mail);
      }
    }
  } catch {
    // Ignore scan failure
  }

  return Array.from(activeSet).slice(0, 100);
}

export async function syncWorkspaceMembershipForEmail(
  _email: string,
  _shouldInclude: boolean
): Promise<void> {
  // No-op in Firebase Data Connect mode (server enforces membership via system_users).
}

export async function syncAllActiveWorkspaceMembers(_activeEmails: string[]): Promise<void> {
  // No-op in Firebase Data Connect mode.
}

export async function ensureWorkspaceMembershipSynced(): Promise<void> {
  if (!auth.currentUser) return;
  await ensureSqlReady();
}

export function subscribeToWorkspaceChanges(_handlers: {
  onEngagementsChanged: () => void;
  onIssuesChanged: (issues: IssueRegisterItem[]) => void;
  onUniverseChanged: (universe: UniverseEntity[]) => void;
}): () => void {
  // Data is fetched and mutated via Express Data Connect endpoints.
  return () => {};
}

export async function resetSystemToBaseline(): Promise<void> {
  throw new Error(
    'Reset to baseline is disabled to protect existing records in Firebase Data Connect.'
  );
}
