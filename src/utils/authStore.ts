/**
 * authStore.ts — Firebase Auth & Firestore-backed Authentication Store
 *
 * Uses Firebase Authentication (Google Sign-In via signInWithPopup) and stores
 * RBAC/account state in Firestore (`/users/{uid}`, `/users/{uid}/private/info`,
 * `/admins/{uid}`, `/admin_invites/{emailKey}`, and `/system_users/{id}`).
 */

import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { handleFirestoreError, OperationType } from './firestoreError';
import {
  clearSqlStatusCache,
  fetchSqlSystemUsers,
  getSqlConnectStatus,
  sqlMirrorHelpers,
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

async function syncAdminInvite(email: string, grantAdmin: boolean, grantedBy: string): Promise<void> {
  const mail = clampString(email.toLowerCase(), 160);
  if (!mail) return;
  const emailKey = emailToInviteKey(mail);
  const inviteRef = doc(db, 'admin_invites', emailKey);

  try {
    if (grantAdmin) {
      await setDoc(inviteRef, {
        emailKey,
        email: mail,
        isActive: true,
        grantedBy: clampString(grantedBy || BOOTSTRAPPED_ADMIN_EMAIL, 160),
        updatedAt: serverTimestamp(),
      });
    } else {
      await deleteDoc(inviteRef).catch(() => {});
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `admin_invites/${emailKey}`);
  }
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
// Firebase Auth Session Resolution
// ─────────────────────────────────────────────────────────────────────────────

export async function resolveFirebaseUserSession(firebaseUser: FirebaseUser): Promise<AuthSession> {
  const email = clampString(firebaseUser.email, 160).toLowerCase();
  if (!email || !firebaseUser.emailVerified) {
    throw new Error('A verified Google email address is required to access this system.');
  }

  const uid = firebaseUser.uid;
  const isBootstrapped = email === BOOTSTRAPPED_ADMIN_EMAIL;
  const username = clampString(email.split('@')[0] || uid, 80);
  const displayName = clampString(firebaseUser.displayName || username, 160);
  const nowIso = new Date().toISOString();

  // 1. Verify account registration in /system_users (allowlist check)
  let preProvisionedRole: SystemRole | null = null;
  let preProvisionedActive = true;
  let preProvisionedLocked = false;
  let preProvisionedName: string | null = null;
  let preProvisionedAppRole: string | undefined;
  let preProvisionedScope: string | undefined;
  let preProvisionedEmpNo: string | undefined;
  let hasSystemUserRecord = false;

  try {
    const sysQ = query(collection(db, 'system_users'), where('email', '==', email));
    const sysSnap = await getDocs(sysQ);
    if (!sysSnap.empty) {
      hasSystemUserRecord = true;
      const preferredId = emailToSystemUserId(email);
      const preferredDoc = sysSnap.docs.find((d) => d.id === preferredId) ?? sysSnap.docs[0];
      const sysData = preferredDoc.data();
      preProvisionedRole = sysData.role === 'admin' ? 'admin' : 'user';
      preProvisionedActive = sysData.isActive !== false;
      preProvisionedLocked = sysData.isLocked === true;
      if (typeof sysData.fullName === 'string' && sysData.fullName.trim()) {
        preProvisionedName = clampString(sysData.fullName, 160);
      }
      if (typeof sysData.appRole === 'string' && sysData.appRole.trim()) {
        preProvisionedAppRole = clampString(sysData.appRole, 80);
      }
      if (typeof sysData.scope === 'string' && sysData.scope.trim()) {
        preProvisionedScope = clampString(sysData.scope, 240);
      }
      if (typeof sysData.employeeNumber === 'string' && sysData.employeeNumber.trim()) {
        preProvisionedEmpNo = clampString(sysData.employeeNumber, 64);
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'system_users');
  }

  if (!isBootstrapped && !hasSystemUserRecord) {
    await signOut(auth);
    clearSession();
    throw new Error(
      `Access denied. Your Google account (${email}) is not registered in User accounts & role assignments. Contact your System Administrator.`
    );
  }

  // 2. Check /admin_invites/{emailKey} and /admins/{uid}
  const inviteKey = emailToInviteKey(email);
  let hasActiveInvite = false;
  if (!isBootstrapped) {
    try {
      const inviteSnap = await getDoc(doc(db, 'admin_invites', inviteKey));
      hasActiveInvite = inviteSnap.exists() && inviteSnap.data()?.isActive === true;
    } catch {
      hasActiveInvite = false;
    }
  }

  let hasAdminDoc = false;
  if (!isBootstrapped) {
    try {
      const adminSnap = await getDoc(doc(db, 'admins', uid));
      hasAdminDoc = adminSnap.exists();
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `admins/${uid}`);
    }
  }

  // 3. Read /users/{uid}
  const userRef = doc(db, 'users', uid);
  const privateRef = doc(db, 'users', uid, 'private', 'info');
  const adminRef = doc(db, 'admins', uid);

  let userExists = false;
  let existingUserAppRole: string | undefined;
  let existingUserScope: string | undefined;
  let existingUserEmpNo: string | undefined;
  let userActive = preProvisionedActive;
  let userLocked = preProvisionedLocked;
  let resolvedName = preProvisionedName || displayName;

  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      userExists = true;
      const data = userSnap.data();
      userActive = hasSystemUserRecord
        ? preProvisionedActive
        : data.isActive !== false;
      userLocked = hasSystemUserRecord
        ? preProvisionedLocked
        : data.isLocked === true;
      if (!preProvisionedName && typeof data.fullName === 'string' && data.fullName.trim()) {
        resolvedName = clampString(data.fullName, 160);
      }
      if (typeof data.appRole === 'string' && data.appRole.trim()) {
        existingUserAppRole = clampString(data.appRole, 80);
      }
      if (typeof data.scope === 'string' && data.scope.trim()) {
        existingUserScope = clampString(data.scope, 240);
      }
      if (typeof data.employeeNumber === 'string' && data.employeeNumber.trim()) {
        existingUserEmpNo = clampString(data.employeeNumber, 64);
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}`);
  }

  if (!isBootstrapped && (!userActive || userLocked)) {
    await signOut(auth);
    clearSession();
    throw new Error(
      userLocked
        ? 'Your account has been locked. Please contact your system administrator.'
        : 'Your account is deactivated. Please contact your system administrator.'
    );
  }

  const resolvedAppRole = clampString(
    preProvisionedAppRole ||
      (isBootstrapped ? 'System administrator' : existingUserAppRole) ||
      (hasActiveInvite || preProvisionedRole === 'admin' ? 'System administrator' : 'Assisting Auditor'),
    80
  );
  const resolvedScope = clampString(preProvisionedScope || existingUserScope || 'Assigned engagements', 240);
  const resolvedEmpNo = clampString(preProvisionedEmpNo || existingUserEmpNo || '', 64);

  const shouldBeAdmin =
    isBootstrapped ||
    hasActiveInvite ||
    (hasAdminDoc && preProvisionedRole !== 'user' && !resolvedAppRole.toLowerCase().includes('auditee'));
  const targetSystemRole: SystemRole = shouldBeAdmin ? 'admin' : 'user';

  // 4. Atomically sync /users/{uid}, /users/{uid}/private/info, and /admins/{uid}
  const batch = writeBatch(db);
  if (shouldBeAdmin && !isBootstrapped && !hasAdminDoc) {
    batch.set(adminRef, {
      uid,
      email,
      grantedBy: BOOTSTRAPPED_ADMIN_EMAIL,
      createdAt: serverTimestamp(),
    });
  } else if (!shouldBeAdmin && !isBootstrapped && hasAdminDoc) {
    batch.delete(adminRef);
  }

  if (!userExists) {
    const userPayload: Record<string, unknown> = {
      uid,
      username,
      fullName: resolvedName,
      role: targetSystemRole,
      appRole: resolvedAppRole,
      scope: resolvedScope,
      isActive: true,
      isLocked: false,
      failedLoginCount: 0,
      requiresPasswordChange: false,
      createdAt: serverTimestamp(),
      lastLogin: nowIso,
      modifiedAt: serverTimestamp(),
    };
    if (resolvedEmpNo) userPayload.employeeNumber = resolvedEmpNo;

    batch.set(userRef, userPayload);
    batch.set(privateRef, {
      uid,
      email,
      updatedAt: serverTimestamp(),
    });
  } else {
    const updatePayload: Record<string, unknown> = {
      username,
      fullName: resolvedName,
      role: targetSystemRole,
      appRole: resolvedAppRole,
      scope: resolvedScope,
      lastLogin: nowIso,
      modifiedAt: serverTimestamp(),
    };
    if (resolvedEmpNo) updatePayload.employeeNumber = resolvedEmpNo;
    batch.update(userRef, updatePayload);
  }

  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
  }

  const token = await firebaseUser.getIdToken();
  const session: AuthSession = {
    userId: uid,
    username,
    email,
    role: targetSystemRole,
    appRole: resolvedAppRole,
    scope: resolvedScope,
    ...(resolvedEmpNo ? { employeeNumber: resolvedEmpNo } : {}),
    fullName: resolvedName,
    token,
    issuedAt: nowIso,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
    requiresPasswordChange: false,
  };
  saveSession(session);
  void sqlMirrorHelpers
    .upsertAppSession(uid, {
      role: targetSystemRole,
      appRole: resolvedAppRole,
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
  // Bootstrapped admin privilege is enforced in Firestore security rules via verified email.
}

export async function login(_username: string, _password: string): Promise<LoginResult> {
  return loginWithGoogle();
}

export function logout(): void {
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
// Admin-only user management
// ─────────────────────────────────────────────────────────────────────────────

export async function loadUsers(): Promise<SystemUser[]> {
  const current = auth.currentUser;
  if (!current) return [];

  const sqlStatus = await getSqlConnectStatus();
  if (sqlStatus.configured && sqlStatus.mode === 'primary') {
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

  const results: SystemUser[] = [];
  const seenEmails = new Set<string>();
  const isBootstrapped = current.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL;

  try {
    const usersSnap = isBootstrapped
      ? await getDocs(collection(db, 'users'))
      : await getDocs(query(collection(db, 'users'), where('uid', '==', current.uid)));

    for (const userDoc of usersSnap.docs) {
      const d = userDoc.data();
      let email = '';
      try {
        const privSnap = await getDoc(doc(db, 'users', userDoc.id, 'private', 'info'));
        if (privSnap.exists()) {
          email = String(privSnap.data().email ?? '');
        }
      } catch {
        // Ignore private info read failures for non-admin queries
      }
      if (email) seenEmails.add(email.toLowerCase());
      results.push({
        id: userDoc.id,
        username: String(d.username ?? ''),
        fullName: String(d.fullName ?? ''),
        email,
        role: d.role === 'admin' ? 'admin' : 'user',
        appRole: typeof d.appRole === 'string' ? d.appRole : undefined,
        scope: typeof d.scope === 'string' ? d.scope : undefined,
        employeeNumber: typeof d.employeeNumber === 'string' ? d.employeeNumber : undefined,
        passwordHash: '',
        isActive: d.isActive !== false,
        isLocked: d.isLocked === true,
        failedLoginCount: Number(d.failedLoginCount ?? 0),
        requiresPasswordChange: false,
        createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : String(d.createdAt ?? ''),
        lastLogin: d.lastLogin ? String(d.lastLogin) : null,
        modifiedAt: d.modifiedAt?.toDate ? d.modifiedAt.toDate().toISOString() : String(d.modifiedAt ?? ''),
        source: 'firebase_user',
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'users');
  }

  try {
    const emailLower = (current.email ?? '').toLowerCase();
    const sysSnap = isBootstrapped
      ? await getDocs(collection(db, 'system_users'))
      : await getDocs(query(collection(db, 'system_users'), where('email', '==', emailLower)));

    for (const sysDoc of sysSnap.docs) {
      const d = sysDoc.data();
      const mail = String(d.email ?? '').toLowerCase();
      if (mail && seenEmails.has(mail)) continue;
      results.push({
        id: sysDoc.id,
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
        failedLoginCount: Number(d.failedLoginCount ?? 0),
        requiresPasswordChange: d.requiresPasswordChange === true,
        createdAt: String(d.createdAt ?? ''),
        lastLogin: d.lastLogin ? String(d.lastLogin) : null,
        modifiedAt: d.modifiedAt?.toDate ? d.modifiedAt.toDate().toISOString() : String(d.modifiedAt ?? ''),
        source: 'system_user',
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'system_users');
  }

  return results;
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
  const uid = auth.currentUser?.uid;
  if (!uid) return { success: false, error: 'Firebase session is not active.' };

  const uname = clampString(data.username.toLowerCase(), 80);
  const mail = clampString(data.email.toLowerCase(), 160);
  const fullName = clampString(data.fullName, 160);
  if (!uname || !fullName || !mail) {
    return { success: false, error: 'Username, full name, and Google email are required.' };
  }

  const docId = emailToSystemUserId(mail);
  const nowIso = new Date().toISOString();
  const isBootstrapped = (auth.currentUser?.email ?? '').toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL;

  try {
    const detSnap = await getDoc(doc(db, 'system_users', docId));
    if (detSnap.exists()) {
      return { success: false, error: `A user with email "${mail}" already exists.` };
    }
    if (isBootstrapped) {
      const legacySnap = await getDocs(query(collection(db, 'system_users'), where('email', '==', mail)));
      if (!legacySnap.empty) {
        return { success: false, error: `A user with email "${mail}" already exists.` };
      }
    }

    const payload: Record<string, unknown> = {
      id: docId,
      username: uname,
      fullName,
      email: mail,
      role: data.role,
      isActive: true,
      isLocked: false,
      failedLoginCount: 0,
      requiresPasswordChange: false,
      ownerId: uid,
      createdAt: nowIso,
      lastLogin: null,
      modifiedAt: serverTimestamp(),
    };
    if (data.appRole) payload.appRole = clampString(data.appRole, 80);
    if (data.scope) payload.scope = clampString(data.scope, 240);
    if (data.employeeNumber) payload.employeeNumber = clampString(data.employeeNumber, 64);

    await setDoc(doc(db, 'system_users', docId), payload);
    await syncAdminInvite(mail, data.role === 'admin', session.email || session.username);
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
    handleFirestoreError(err, OperationType.CREATE, `system_users/${docId}`);
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
  const isBootstrapped = (auth.currentUser?.email ?? '').toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL;

  try {
    const userRef = doc(db, 'users', safeId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        isLocked: false,
        failedLoginCount: 0,
        modifiedAt: serverTimestamp(),
      });
    }
    const sysId = mail ? emailToSystemUserId(mail) : safeId;
    const sysRef = doc(db, 'system_users', sysId);
    const sysSnap = await getDoc(sysRef);
    if (sysSnap.exists()) {
      await updateDoc(sysRef, {
        isLocked: false,
        failedLoginCount: 0,
        modifiedAt: serverTimestamp(),
      });
    } else if (mail && isBootstrapped) {
      const legacySnap = await getDocs(query(collection(db, 'system_users'), where('email', '==', mail)));
      for (const d of legacySnap.docs) {
        await updateDoc(d.ref, {
          isLocked: false,
          failedLoginCount: 0,
          modifiedAt: serverTimestamp(),
        });
      }
    }
    return { success: true };
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `system_users/${safeId}`);
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
  const safeId = sanitizeFirestoreId(targetUserId);

  try {
    const userRef = doc(db, 'users', safeId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentActive = userSnap.data().isActive !== false;
      const nextActive = !currentActive;
      await updateDoc(userRef, {
        isActive: nextActive,
        modifiedAt: serverTimestamp(),
      });
      try {
        const privSnap = await getDoc(doc(db, 'users', safeId, 'private', 'info'));
        const mail = privSnap.exists() ? String(privSnap.data().email ?? '').toLowerCase() : '';
        if (mail) {
          const sysRef = doc(db, 'system_users', emailToSystemUserId(mail));
          const sysSnap = await getDoc(sysRef);
          if (sysSnap.exists()) {
            await updateDoc(sysRef, { isActive: nextActive, modifiedAt: serverTimestamp() });
          }
          if (!nextActive) {
            await syncAdminInvite(mail, false, session.email || session.username);
          } else if (userSnap.data().role === 'admin') {
            await syncAdminInvite(mail, true, session.email || session.username);
          }
          await sqlMirrorHelpers.upsertSystemUser({
            id: emailToSystemUserId(mail),
            username: String(userSnap.data().username ?? mail.split('@')[0]),
            fullName: String(userSnap.data().fullName ?? mail.split('@')[0]),
            email: mail,
            role: userSnap.data().role === 'admin' ? 'admin' : 'user',
            appRole: typeof userSnap.data().appRole === 'string' ? userSnap.data().appRole : undefined,
            isActive: nextActive,
            isLocked: userSnap.data().isLocked === true,
          });
        }
      } catch {
        // Ignore secondary sync failures
      }
      return { success: true };
    }
    const sysRef = doc(db, 'system_users', safeId);
    const sysSnap = await getDoc(sysRef);
    if (!sysSnap.exists()) return { success: false, error: 'User not found.' };
    const nextActive = !(sysSnap.data().isActive !== false);
    await updateDoc(sysRef, {
      isActive: nextActive,
      modifiedAt: serverTimestamp(),
    });
    const mail = String(sysSnap.data().email ?? '').toLowerCase();
    if (mail) {
      await syncAdminInvite(mail, nextActive && sysSnap.data().role === 'admin', session.email || session.username);
      await sqlMirrorHelpers.upsertSystemUser({
        id: safeId,
        username: String(sysSnap.data().username ?? mail.split('@')[0]),
        fullName: String(sysSnap.data().fullName ?? mail.split('@')[0]),
        email: mail,
        role: sysSnap.data().role === 'admin' ? 'admin' : 'user',
        appRole: typeof sysSnap.data().appRole === 'string' ? sysSnap.data().appRole : undefined,
        isActive: nextActive,
        isLocked: sysSnap.data().isLocked === true,
      });
    }
    return { success: true };
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${safeId}`);
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
  const safeId = sanitizeFirestoreId(targetUserId);
  try {
    const userRef = doc(db, 'users', safeId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        role: newRole,
        modifiedAt: serverTimestamp(),
      });
      const adminRef = doc(db, 'admins', safeId);
      const privSnap = await getDoc(doc(db, 'users', safeId, 'private', 'info'));
      const email = privSnap.exists() ? String(privSnap.data().email ?? '').toLowerCase() : '';
      if (newRole === 'admin') {
        await setDoc(adminRef, {
          uid: safeId,
          email: clampString(email || `${safeId}@citysavings.com.ph`, 160),
          grantedBy: clampString(session.email || session.username, 160),
          createdAt: serverTimestamp(),
        });
      } else {
        await deleteDoc(adminRef).catch(() => {});
      }
      if (email) {
        await syncAdminInvite(email, newRole === 'admin', session.email || session.username);
        const sysRef = doc(db, 'system_users', emailToSystemUserId(email));
        const sysSnap = await getDoc(sysRef);
        if (sysSnap.exists()) {
          await updateDoc(sysRef, {
            role: newRole,
            modifiedAt: serverTimestamp(),
          });
        }
        await sqlMirrorHelpers.upsertSystemUser({
          id: emailToSystemUserId(email),
          username: String(userSnap.data().username ?? email.split('@')[0]),
          fullName: String(userSnap.data().fullName ?? email.split('@')[0]),
          email,
          role: newRole,
          isActive: userSnap.data().isActive !== false,
          isLocked: userSnap.data().isLocked === true,
        });
      }
      return { success: true };
    }
    const sysRef = doc(db, 'system_users', safeId);
    const sysSnap = await getDoc(sysRef);
    if (!sysSnap.exists()) return { success: false, error: 'User not found.' };
    await updateDoc(sysRef, {
      role: newRole,
      modifiedAt: serverTimestamp(),
    });
    const mail = String(sysSnap.data().email ?? '').toLowerCase();
    if (mail) {
      await syncAdminInvite(mail, newRole === 'admin', session.email || session.username);
      await sqlMirrorHelpers.upsertSystemUser({
        id: safeId,
        username: String(sysSnap.data().username ?? mail.split('@')[0]),
        fullName: String(sysSnap.data().fullName ?? mail.split('@')[0]),
        email: mail,
        role: newRole,
        isActive: sysSnap.data().isActive !== false,
        isLocked: sysSnap.data().isLocked === true,
      });
    }
    return { success: true };
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${safeId}`);
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
  const uid = auth.currentUser?.uid;
  const actorEmail = (auth.currentUser?.email ?? BOOTSTRAPPED_ADMIN_EMAIL).toLowerCase();
  if (!uid) return { success: false, error: 'Not signed in.' };

  const uname = clampString(data.username.toLowerCase(), 80);
  const mail = clampString(data.email.toLowerCase(), 160);
  const fullName = clampString(data.fullName, 160);
  const docId = emailToSystemUserId(mail);
  const isActive = data.isActive !== false;
  const isLocked = data.isLocked === true;
  const isBootstrapped = actorEmail === BOOTSTRAPPED_ADMIN_EMAIL;

  try {
    const detRef = doc(db, 'system_users', docId);
    const detSnap = await getDoc(detRef);

    const updateFields: Record<string, unknown> = {
      fullName,
      role: data.role,
      isActive,
      isLocked,
      modifiedAt: serverTimestamp(),
    };
    if (data.appRole !== undefined) updateFields.appRole = clampString(data.appRole, 80);
    if (data.scope !== undefined) updateFields.scope = clampString(data.scope, 240);
    if (data.employeeNumber !== undefined) updateFields.employeeNumber = clampString(data.employeeNumber, 64);

    if (detSnap.exists()) {
      await updateDoc(detRef, updateFields);
    } else if (isBootstrapped) {
      const legacySnap = await getDocs(query(collection(db, 'system_users'), where('email', '==', mail)));
      if (!legacySnap.empty) {
        for (const d of legacySnap.docs) {
          await updateDoc(d.ref, updateFields);
        }
      } else {
        const createPayload: Record<string, unknown> = {
          id: docId,
          username: uname,
          fullName,
          email: mail,
          role: data.role,
          isActive,
          isLocked,
          failedLoginCount: 0,
          requiresPasswordChange: false,
          ownerId: uid,
          createdAt: new Date().toISOString(),
          lastLogin: null,
          modifiedAt: serverTimestamp(),
        };
        if (data.appRole) createPayload.appRole = clampString(data.appRole, 80);
        if (data.scope) createPayload.scope = clampString(data.scope, 240);
        if (data.employeeNumber) createPayload.employeeNumber = clampString(data.employeeNumber, 64);
        await setDoc(detRef, createPayload);
      }
    } else {
      const createPayload: Record<string, unknown> = {
        id: docId,
        username: uname,
        fullName,
        email: mail,
        role: data.role,
        isActive,
        isLocked,
        failedLoginCount: 0,
        requiresPasswordChange: false,
        ownerId: uid,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        modifiedAt: serverTimestamp(),
      };
      if (data.appRole) createPayload.appRole = clampString(data.appRole, 80);
      if (data.scope) createPayload.scope = clampString(data.scope, 240);
      if (data.employeeNumber) createPayload.employeeNumber = clampString(data.employeeNumber, 64);
      await setDoc(detRef, createPayload);
    }

    await syncAdminInvite(mail, data.role === 'admin' && isActive && !isLocked, actorEmail);
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
    handleFirestoreError(err, OperationType.WRITE, `system_users/${docId}`);
  }
}

export async function adminDeleteSystemUserByEmail(email: string): Promise<{ success: boolean; error?: string }> {
  const current = auth.currentUser;
  if (!current) return { success: false, error: 'Not signed in.' };

  const mail = clampString(email.toLowerCase(), 160);
  if (!mail) return { success: false, error: 'Email is required.' };
  if (mail === BOOTSTRAPPED_ADMIN_EMAIL) {
    return { success: false, error: 'Cannot remove the primary system administrator.' };
  }

  const docId = emailToSystemUserId(mail);
  const isBootstrapped = (current.email ?? '').toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL;

  try {
    await deleteDoc(doc(db, 'system_users', docId)).catch(() => {});
    if (isBootstrapped) {
      const legacySnap = await getDocs(query(collection(db, 'system_users'), where('email', '==', mail)));
      for (const d of legacySnap.docs) {
        await deleteDoc(d.ref).catch(() => {});
      }
    }
    await syncAdminInvite(mail, false, current.email || BOOTSTRAPPED_ADMIN_EMAIL);
    await sqlMirrorHelpers.deleteSystemUser(mail);
    return { success: true };
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `system_users/${docId}`);
  }
}
