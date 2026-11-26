/**
 * authStore.ts — Firebase Auth & Firebase Data Connect Authentication Store
 *
 * Uses Firebase Authentication (Google Sign-In via signInWithPopup) and resolves
 * RBAC/account state from Firebase Data Connect via Express API routes (/api/sql/*).
 */

import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import {
  clearSqlStatusCache,
  fetchSqlSystemUsers,
  getSqlConnectStatus,
  resolveSqlAuthSession,
  sqlMirrorHelpers,
  unlockSqlSystemUser,
} from './sqlApiClient';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SystemRole = 'admin' | 'user';

export interface SystemUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: SystemRole;
  appRole?: string;
  scope?: string;
  employeeNumber?: string;
  passwordHash: string;
  isActive: boolean;
  isLocked: boolean;
  failedLoginCount: number;
  requiresPasswordChange: boolean;
  createdAt: string;
  lastLogin: string | null;
  modifiedAt: string;
  source?: 'firebase_user' | 'system_user';
}

export interface AuthSession {
  userId: string;
  username: string;
  email?: string;
  role: SystemRole;
  appRole?: string;
  scope?: string;
  employeeNumber?: string;
  fullName: string;
  token: string;
  issuedAt: string;
  expiresAt: string;
  requiresPasswordChange: boolean;
}

export interface LoginResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
  locked?: boolean;
  requiresPasswordChange?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants & Helpers
// ─────────────────────────────────────────────────────────────────────────────

export const BOOTSTRAPPED_ADMIN_EMAIL = 'christian.macahilig@citysavings.com.ph';
const SESSION_KEY = 'csb_auth_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export function sanitizeFirestoreId(raw: string, fallback = 'id'): string {
  const cleaned = raw.trim().replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  return (cleaned || fallback).slice(0, 128);
}

export function emailToInviteKey(email: string): string {
  const cleaned = email.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_');
  return (cleaned || 'user').slice(0, 128);
}

export function emailToSystemUserId(email: string): string {
  return `sys_${emailToInviteKey(email)}`.slice(0, 128);
}

function clampString(val: string | undefined | null, maxLen: number): string {
  return (val ?? '').trim().slice(0, maxLen);
}

// ─────────────────────────────────────────────────────────────────────────────
// Session (sessionStorage — tab-scoped cache for synchronous helpers)
// ─────────────────────────────────────────────────────────────────────────────

export function loadSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    const expiresAt = new Date(session.expiresAt).getTime();
    if (!session.token || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore storage quota errors
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Firebase Auth Session Resolution (via server.ts + Firebase Data Connect)
// ─────────────────────────────────────────────────────────────────────────────

export async function resolveFirebaseUserSession(firebaseUser: FirebaseUser): Promise<AuthSession> {
  const email = clampString(firebaseUser.email, 160).toLowerCase();
  if (!email || !firebaseUser.emailVerified) {
    throw new Error('A verified Google email address is required to access this system.');
  }

  let resolved: Awaited<ReturnType<typeof resolveSqlAuthSession>>;
  try {
    await getSqlConnectStatus();
    resolved = await resolveSqlAuthSession();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Authentication failed.';
    if (
      msg.includes('Access denied') ||
      msg.includes('locked') ||
      msg.includes('deactivated') ||
      msg.includes('verified Google email')
    ) {
      await signOut(auth).catch(() => {});
      clearSession();
    }
    throw err instanceof Error ? err : new Error(msg);
  }

  const nowIso = new Date().toISOString();
  const token = await firebaseUser.getIdToken();
  const displayName = clampString(
    resolved.fullName || firebaseUser.displayName || resolved.username,
    160
  );

  const session: AuthSession = {
    userId: firebaseUser.uid,
    username: clampString(resolved.username || email.split('@')[0], 80),
    email,
    role: resolved.role === 'admin' ? 'admin' : 'user',
    appRole: resolved.appRole,
    scope: resolved.scope,
    ...(resolved.employeeNumber ? { employeeNumber: resolved.employeeNumber } : {}),
    fullName: displayName,
    token,
    issuedAt: nowIso,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
    requiresPasswordChange: false,
  };
  saveSession(session);
  void sqlMirrorHelpers
    .upsertAppSession(firebaseUser.uid, {
      role: session.role,
      appRole: session.appRole,
      issuedAt: session.issuedAt,
      expiresAt: session.expiresAt,
    })
    .catch(() => {});
  return session;
}

export function subscribeAuthSession(
  onSession: (session: AuthSession | null) => void,
  onError?: (message: string) => void
): () => void {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      clearSession();
      onSession(null);
      return;
    }
    try {
      const session = await resolveFirebaseUserSession(firebaseUser);
      onSession(session);
    } catch (err) {
      clearSession();
      onSession(null);
      if (onError) {
        onError(err instanceof Error ? err.message : 'Authentication failed.');
      }
    }
  });
}

export async function loginWithGoogle(): Promise<LoginResult> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const session = await resolveFirebaseUserSession(result.user);
    return { success: true, session, requiresPasswordChange: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Google sign-in failed.';
    const locked = message.toLowerCase().includes('locked');
    return { success: false, error: message, locked };
  }
}

export async function seedDefaultAdmin(): Promise<void> {
  // Bootstrapped admin privilege is enforced on the server via verified email.
}

export async function login(_username: string, _password: string): Promise<LoginResult> {
  return loginWithGoogle();
}

export function logout(): void {
  const uid = auth.currentUser?.uid;
  if (uid) {
    void sqlMirrorHelpers.deleteAppSession(uid).catch(() => {});
  }
  clearSession();
  clearSqlStatusCache();
  void signOut(auth).catch(() => {
    // Ignore sign-out errors
  });
}

export async function changeOwnPassword(
  _session: AuthSession,
  _currentPassword: string,
  _newPassword: string
): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin-only user management (via server.ts Data Connect API)
// ─────────────────────────────────────────────────────────────────────────────

export async function loadUsers(): Promise<SystemUser[]> {
  const current = auth.currentUser;
  if (!current) return [];

  await getSqlConnectStatus();
  const sqlRows = await fetchSqlSystemUsers();
  return sqlRows.map((d) => ({
    id: String(d.id ?? ''),
    username: String(d.username ?? ''),
    fullName: String(d.fullName ?? ''),
    email: String(d.email ?? ''),
    role: d.role === 'admin' ? 'admin' : 'user',
    appRole: typeof d.appRole === 'string' ? d.appRole : undefined,
    scope: typeof d.scope === 'string' ? d.scope : undefined,
    employeeNumber: typeof d.employeeNumber === 'string' ? d.employeeNumber : undefined,
    passwordHash: '',
    isActive: d.isActive !== false,
    isLocked: d.isLocked === true,
    failedLoginCount: 0,
    requiresPasswordChange: false,
    createdAt: '',
    lastLogin: typeof d.lastLogin === 'string' ? d.lastLogin : null,
    modifiedAt: typeof d.modifiedAt === 'string' ? d.modifiedAt : '',
    source: 'system_user',
  }));
}

export async function adminAddUser(
  session: AuthSession,
  data: {
    username: string;
    fullName: string;
    email: string;
    role: SystemRole;
    appRole?: string;
    scope?: string;
    employeeNumber?: string;
    password?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  if (session.role !== 'admin') {
    return { success: false, error: 'Access denied. Admin role required.' };
  }
  if (!auth.currentUser) return { success: false, error: 'Firebase session is not active.' };

  const uname = clampString(data.username.toLowerCase(), 80);
  const mail = clampString(data.email.toLowerCase(), 160);
  const fullName = clampString(data.fullName, 160);
  if (!uname || !fullName || !mail) {
    return { success: false, error: 'Username, full name, and Google email are required.' };
  }

  try {
    const existing = await loadUsers();
    if (existing.some((u) => u.email.trim().toLowerCase() === mail)) {
      return { success: false, error: `A user with email "${mail}" already exists.` };
    }

    const docId = emailToSystemUserId(mail);
    await sqlMirrorHelpers.upsertSystemUser({
      id: docId,
      username: uname,
      fullName,
      email: mail,
      role: data.role,
      appRole: data.appRole,
      scope: data.scope,
      employeeNumber: data.employeeNumber,
      isActive: true,
      isLocked: false,
    });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to add user.',
    };
  }
}

export async function adminUnlockUser(
  session: AuthSession,
  targetUserId: string,
  email?: string
): Promise<{ success: boolean; error?: string }> {
  if (session.role !== 'admin') {
    return { success: false, error: 'Access denied. Admin role required.' };
  }
  const safeId = sanitizeFirestoreId(targetUserId);
  const mail = clampString(email?.toLowerCase(), 160);

  try {
    await unlockSqlSystemUser(safeId, mail || undefined);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to unlock user.',
    };
  }
}

export async function adminToggleActive(
  session: AuthSession,
  targetUserId: string
): Promise<{ success: boolean; error?: string }> {
  if (session.role !== 'admin') {
    return { success: false, error: 'Access denied. Admin role required.' };
  }
  if (targetUserId === session.userId) {
    return { success: false, error: 'You cannot deactivate your own account.' };
  }

  try {
    const users = await loadUsers();
    const target = users.find((u) => u.id === targetUserId || sanitizeFirestoreId(u.id) === targetUserId);
    if (!target) {
      return { success: false, error: 'User not found.' };
    }
    await sqlMirrorHelpers.upsertSystemUser({
      id: target.id,
      username: target.username,
      fullName: target.fullName,
      email: target.email,
      role: target.role,
      appRole: target.appRole,
      scope: target.scope,
      employeeNumber: target.employeeNumber,
      isActive: !target.isActive,
      isLocked: target.isLocked,
    });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update user status.',
    };
  }
}

export async function adminUpdateUserRole(
  session: AuthSession,
  targetUserId: string,
  newRole: SystemRole
): Promise<{ success: boolean; error?: string }> {
  if (session.role !== 'admin') {
    return { success: false, error: 'Access denied. Admin role required.' };
  }

  try {
    const users = await loadUsers();
    const target = users.find((u) => u.id === targetUserId || sanitizeFirestoreId(u.id) === targetUserId);
    if (!target) {
      return { success: false, error: 'User not found.' };
    }
    await sqlMirrorHelpers.upsertSystemUser({
      id: target.id,
      username: target.username,
      fullName: target.fullName,
      email: target.email,
      role: newRole,
      appRole: target.appRole,
      scope: target.scope,
      employeeNumber: target.employeeNumber,
      isActive: target.isActive,
      isLocked: target.isLocked,
    });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update user role.',
    };
  }
}

export async function adminResetPassword(
  _session: AuthSession,
  _targetUserId: string,
  _newPassword: string
): Promise<{ success: boolean; error?: string }> {
  return {
    success: false,
    error: 'Authentication is managed by Google Sign-In; passwords are managed by the user’s Google account.',
  };
}

export async function createOrSyncSystemUser(data: {
  username: string;
  fullName: string;
  email: string;
  role: SystemRole;
  appRole?: string;
  scope?: string;
  employeeNumber?: string;
  isActive?: boolean;
  isLocked?: boolean;
  password?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!auth.currentUser) return { success: false, error: 'Not signed in.' };

  const uname = clampString(data.username.toLowerCase(), 80);
  const mail = clampString(data.email.toLowerCase(), 160);
  const fullName = clampString(data.fullName, 160);
  const docId = emailToSystemUserId(mail);
  const isActive = data.isActive !== false;
  const isLocked = data.isLocked === true;

  try {
    await sqlMirrorHelpers.upsertSystemUser({
      id: docId,
      username: uname,
      fullName,
      email: mail,
      role: data.role,
      appRole: data.appRole,
      scope: data.scope,
      employeeNumber: data.employeeNumber,
      isActive,
      isLocked,
    });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to save user.',
    };
  }
}

export async function adminDeleteSystemUserByEmail(email: string): Promise<{ success: boolean; error?: string }> {
  if (!auth.currentUser) return { success: false, error: 'Not signed in.' };

  const mail = clampString(email.toLowerCase(), 160);
  if (!mail) return { success: false, error: 'Email is required.' };
  if (mail === BOOTSTRAPPED_ADMIN_EMAIL) {
    return { success: false, error: 'Cannot remove the primary system administrator.' };
  }

  try {
    await sqlMirrorHelpers.deleteSystemUser(mail);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete user.',
    };
  }
}
