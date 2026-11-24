/**
 * authStore.ts — Firebase Auth & Firestore-backed Authentication Store
 *
 * Uses Firebase Authentication (Google Sign-In via signInWithPopup) and stores
 * RBAC/account state in Firestore (`/users/{uid}`, `/users/{uid}/private/info`,
 * `/admins/{uid}`, and `/system_users/{id}`).
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

  // 1. Check /admins/{uid}
  let isAdminGrant = isBootstrapped;
  if (!isAdminGrant) {
    try {
      const adminSnap = await getDoc(doc(db, 'admins', uid));
      isAdminGrant = adminSnap.exists();
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `admins/${uid}`);
    }
  }

  // 2. Check /system_users for pre-provisioned role or lock/deactivation
  let preProvisionedRole: SystemRole | null = null;
  let preProvisionedActive = true;
  let preProvisionedLocked = false;
  let preProvisionedName: string | null = null;

  try {
    const sysQ = query(collection(db, 'system_users'), where('email', '==', email));
    const sysSnap = await getDocs(sysQ);
    if (!sysSnap.empty) {
      const sysData = sysSnap.docs[0].data();
      preProvisionedRole = sysData.role === 'admin' ? 'admin' : 'user';
      preProvisionedActive = sysData.isActive !== false;
      preProvisionedLocked = sysData.isLocked === true;
      if (typeof sysData.fullName === 'string' && sysData.fullName.trim()) {
        preProvisionedName = clampString(sysData.fullName, 160);
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'system_users');
  }

  // 3. Read or atomically create /users/{uid} + /users/{uid}/private/info
  const userRef = doc(db, 'users', uid);
  const privateRef = doc(db, 'users', uid, 'private', 'info');
  let userExists = false;
  let userRole: SystemRole = isAdminGrant ? 'admin' : 'user';
  let userActive = preProvisionedActive;
  let userLocked = preProvisionedLocked;
  let resolvedName = preProvisionedName || displayName;

  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      userExists = true;
      const data = userSnap.data();
      userRole = isAdminGrant || data.role === 'admin' ? 'admin' : 'user';
      userActive = data.isActive !== false && preProvisionedActive;
      userLocked = data.isLocked === true || preProvisionedLocked;
      if (typeof data.fullName === 'string' && data.fullName.trim()) {
        resolvedName = clampString(data.fullName, 160);
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

  if (!userExists) {
    // Non-bootstrapped users must always self-register as 'user' per Firestore security rules.
    const initialRole: SystemRole = isBootstrapped ? 'admin' : 'user';
    if (isBootstrapped) {
      userRole = 'admin';
    } else if (isAdminGrant) {
      userRole = 'admin';
    } else if (preProvisionedRole === 'admin') {
      userRole = 'user';
    }

    const batch = writeBatch(db);
    batch.set(userRef, {
      uid,
      username,
      fullName: resolvedName,
      role: initialRole,
      isActive: true,
      isLocked: false,
      failedLoginCount: 0,
      requiresPasswordChange: false,
      createdAt: serverTimestamp(),
      lastLogin: nowIso,
      modifiedAt: serverTimestamp(),
    });
    batch.set(privateRef, {
      uid,
      email,
      updatedAt: serverTimestamp(),
    });
    try {
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
    }
  } else {
    try {
      await updateDoc(userRef, {
        lastLogin: nowIso,
        modifiedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  }

  const token = await firebaseUser.getIdToken();
  const session: AuthSession = {
    userId: uid,
    username,
    email,
    role: isBootstrapped ? 'admin' : userRole,
    fullName: resolvedName,
    token,
    issuedAt: nowIso,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
    requiresPasswordChange: false,
  };
  saveSession(session);
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

  const results: SystemUser[] = [];
  const seenEmails = new Set<string>();

  try {
    const isBootstrapped = current.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL;
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
    const isBootstrapped = emailLower === BOOTSTRAPPED_ADMIN_EMAIL;
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
  data: { username: string; fullName: string; email: string; role: SystemRole; password?: string }
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

  const docId = sanitizeFirestoreId(`sys-${uname}-${Date.now()}`, `sys-${Date.now()}`);
  const nowIso = new Date().toISOString();

  try {
    const existing = await getDocs(query(collection(db, 'system_users'), where('email', '==', mail)));
    if (!existing.empty) {
      return { success: false, error: `A user with email "${mail}" already exists.` };
    }

    await setDoc(doc(db, 'system_users', docId), {
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
    });
    return { success: true };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `system_users/${docId}`);
  }
}

export async function adminUnlockUser(
  session: AuthSession,
  targetUserId: string
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
        isLocked: false,
        failedLoginCount: 0,
        modifiedAt: serverTimestamp(),
      });
      return { success: true };
    }
    await updateDoc(doc(db, 'system_users', safeId), {
      isLocked: false,
      failedLoginCount: 0,
      modifiedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${safeId}`);
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
      await updateDoc(userRef, {
        isActive: !currentActive,
        modifiedAt: serverTimestamp(),
      });
      return { success: true };
    }
    const sysRef = doc(db, 'system_users', safeId);
    const sysSnap = await getDoc(sysRef);
    if (!sysSnap.exists()) return { success: false, error: 'User not found.' };
    await updateDoc(sysRef, {
      isActive: !(sysSnap.data().isActive !== false),
      modifiedAt: serverTimestamp(),
    });
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
      if (newRole === 'admin') {
        const privSnap = await getDoc(doc(db, 'users', safeId, 'private', 'info'));
        const email = privSnap.exists() ? String(privSnap.data().email ?? '') : `${safeId}@citysavings.com.ph`;
        await setDoc(adminRef, {
          uid: safeId,
          email: clampString(email, 160),
          grantedBy: clampString(session.email || session.username, 160),
          createdAt: serverTimestamp(),
        });
      } else {
        await deleteDoc(adminRef).catch(() => {});
      }
      return { success: true };
    }
    await updateDoc(doc(db, 'system_users', safeId), {
      role: newRole,
      modifiedAt: serverTimestamp(),
    });
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
  password?: string;
}): Promise<{ success: boolean; error?: string }> {
  const uid = auth.currentUser?.uid;
  if (!uid) return { success: false, error: 'Not signed in.' };

  const uname = clampString(data.username.toLowerCase(), 80);
  const mail = clampString(data.email.toLowerCase(), 160);
  const fullName = clampString(data.fullName, 160);
  const docId = sanitizeFirestoreId(`sys-${uname}`, `sys-${Date.now()}`);

  try {
    const existing = await getDocs(query(collection(db, 'system_users'), where('email', '==', mail)));
    if (!existing.empty) {
      const targetDoc = existing.docs[0];
      await updateDoc(doc(db, 'system_users', targetDoc.id), {
        fullName,
        role: data.role,
        isActive: true,
        isLocked: false,
        modifiedAt: serverTimestamp(),
      });
      return { success: true };
    }

    await setDoc(doc(db, 'system_users', docId), {
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
      createdAt: new Date().toISOString(),
      lastLogin: null,
      modifiedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `system_users/${docId}`);
  }
}
