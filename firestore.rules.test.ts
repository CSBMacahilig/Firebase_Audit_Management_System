import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import * as fs from 'fs';

let testEnv: RulesTestEnvironment;

const ADMIN_EMAIL = 'christian.macahilig@citysavings.com.ph';
const USER_A_UID = 'user-a-uid';
const USER_A_EMAIL = 'auditor.a@citysavings.com.ph';
const USER_B_UID = 'user-b-uid';
const USER_B_EMAIL = 'auditor.b@citysavings.com.ph';

export async function runSecurityTests() {
  testEnv = await initializeTestEnvironment({
    projectId: 'csb-ams',
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8'),
    },
  });

  const adminCtx = testEnv.authenticatedContext('admin-uid', {
    email: ADMIN_EMAIL,
    email_verified: true,
  });
  const unverifiedSpoofCtx = testEnv.authenticatedContext('spoof-uid', {
    email: ADMIN_EMAIL,
    email_verified: false,
  });
  const userACtx = testEnv.authenticatedContext(USER_A_UID, {
    email: USER_A_EMAIL,
    email_verified: true,
  });
  const userBCtx = testEnv.authenticatedContext(USER_B_UID, {
    email: USER_B_EMAIL,
    email_verified: true,
  });
  const unauthCtx = testEnv.unauthenticatedContext();

  // Seed baseline valid data via rules-disabled admin setup
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'users', USER_A_UID), {
      uid: USER_A_UID,
      username: 'auditor.a',
      fullName: 'Auditor A',
      role: 'user',
      isActive: true,
      isLocked: false,
      failedLoginCount: 0,
      requiresPasswordChange: false,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });
    await setDoc(doc(db, 'users', USER_A_UID, 'private', 'info'), {
      uid: USER_A_UID,
      email: USER_A_EMAIL,
      updatedAt: serverTimestamp(),
    });
    await setDoc(doc(db, 'issues_register', 'is-closed-1'), {
      id: 'is-closed-1',
      ref: 'IS-0001',
      title: 'Closed finding',
      auditRef: 'AE-2026-001',
      auditTitle: 'Test Audit',
      severity: 'High',
      owner: 'R. Bautista',
      ownerUnit: 'Operations',
      originalDue: '30 Jun 2026',
      currentDue: '30 Jun 2026',
      extensionCount: 0,
      daysStatus: 'Closed',
      isOverdue: false,
      isDueSoon: false,
      status: 'Closed',
      actionPlanSummary: 'Completed remediation.',
      ownerId: USER_A_UID,
      memberUids: [USER_A_UID],
      memberEmails: [USER_A_EMAIL],
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });
  });

  // 1. Unauthenticated Read/Write -> FAIL
  await assertFails(getDoc(doc(unauthCtx.firestore(), 'engagements', 'ae-2026-001')));

  // 2. Unverified Email Spoof -> FAIL
  await assertFails(
    setDoc(doc(unverifiedSpoofCtx.firestore(), 'admins', 'spoof-uid'), {
      uid: 'spoof-uid',
      email: ADMIN_EMAIL,
      grantedBy: 'spoof',
      createdAt: serverTimestamp(),
    })
  );

  // 3. Self-Assigned Admin Role on Signup -> FAIL
  await assertFails(
    setDoc(doc(userBCtx.firestore(), 'users', USER_B_UID), {
      uid: USER_B_UID,
      username: 'auditor.b',
      fullName: 'Auditor B',
      role: 'admin',
      isActive: true,
      isLocked: false,
      failedLoginCount: 0,
      requiresPasswordChange: false,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    })
  );

  // 4. Privilege Escalation Update -> FAIL
  await assertFails(
    updateDoc(doc(userACtx.firestore(), 'users', USER_A_UID), {
      role: 'admin',
      modifiedAt: serverTimestamp(),
    })
  );

  // 5. Shadow / Ghost Field Injection -> FAIL
  await assertFails(
    setDoc(doc(userACtx.firestore(), 'universe_entities', 'au-001'), {
      id: 'au-001',
      code: 'AU-0001',
      name: 'Test Entity',
      division: 'IT',
      category: 'IT system',
      likelihood: 4,
      impact: 4,
      riskScore: 16,
      riskLevel: 'High',
      lastAudited: '12 Mar 2026',
      nextDue: '12 Mar 2027',
      cycleMonths: 12,
      defaultLead: 'P. Mendoza',
      ownerId: USER_A_UID,
      memberUids: [USER_A_UID],
      memberEmails: [USER_A_EMAIL],
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
      isVerified: true, // Ghost field!
    })
  );

  // 6. ID Poisoning (1500 chars) -> FAIL
  const longId = 'a'.repeat(1500);
  await assertFails(
    setDoc(doc(adminCtx.firestore(), 'universe_entities', longId), {
      id: longId,
      code: 'AU-0002',
      name: 'Long ID',
      division: 'IT',
      category: 'IT system',
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      riskLevel: 'Medium',
      lastAudited: '12 Mar 2026',
      nextDue: '12 Mar 2027',
      cycleMonths: 24,
      defaultLead: 'P. Mendoza',
      ownerId: 'admin-uid',
      memberUids: ['admin-uid'],
      memberEmails: [ADMIN_EMAIL],
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    })
  );

  // 7. Type & Value Poisoning -> FAIL
  await assertFails(
    setDoc(doc(userACtx.firestore(), 'universe_entities', 'au-003'), {
      id: 'au-003',
      code: 'AU-0003',
      name: 'Poisoned',
      division: 'IT',
      category: 'IT system',
      likelihood: 4,
      impact: 4,
      riskScore: 'high', // Invalid type!
      riskLevel: 'High',
      lastAudited: '12 Mar 2026',
      nextDue: '12 Mar 2027',
      cycleMonths: 12,
      defaultLead: 'P. Mendoza',
      ownerId: USER_A_UID,
      memberUids: [USER_A_UID],
      memberEmails: [USER_A_EMAIL],
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    })
  );

  // 8. Timestamp Tampering -> FAIL
  await assertFails(
    setDoc(doc(userACtx.firestore(), 'issues_register', 'is-tamper'), {
      id: 'is-tamper',
      ref: 'IS-0099',
      title: 'Tampered timestamp',
      auditRef: 'AE-2026-001',
      auditTitle: 'Audit',
      severity: 'Medium',
      owner: 'R. Bautista',
      ownerUnit: 'Ops',
      originalDue: '30 Jun 2026',
      currentDue: '30 Jun 2026',
      extensionCount: 0,
      daysStatus: '10d left',
      isOverdue: false,
      isDueSoon: true,
      status: 'Open',
      actionPlanSummary: 'Summary',
      ownerId: USER_A_UID,
      memberUids: [USER_A_UID],
      memberEmails: [USER_A_EMAIL],
      createdAt: new Date('2020-01-01T00:00:00Z'), // Client-forged timestamp!
      modifiedAt: serverTimestamp(),
    })
  );

  // 9. Unbounded Array -> FAIL
  await assertFails(
    setDoc(doc(userACtx.firestore(), 'universe_entities', 'au-004'), {
      id: 'au-004',
      code: 'AU-0004',
      name: 'Array DoS',
      division: 'IT',
      category: 'IT system',
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      riskLevel: 'Medium',
      lastAudited: '12 Mar 2026',
      nextDue: '12 Mar 2027',
      cycleMonths: 24,
      defaultLead: 'P. Mendoza',
      ownerId: USER_A_UID,
      memberUids: Array.from({ length: 60 }, (_, i) => `u-${i}`), // Exceeds max 50!
      memberEmails: [USER_A_EMAIL],
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    })
  );

  // 10. Terminal State Bypass -> FAIL
  await assertFails(
    updateDoc(doc(userACtx.firestore(), 'issues_register', 'is-closed-1'), {
      status: 'Open',
      modifiedAt: serverTimestamp(),
    })
  );

  // 11. PII Blanket Read -> FAIL
  await assertFails(getDoc(doc(userBCtx.firestore(), 'users', USER_A_UID, 'private', 'info')));

  // 12. Orphaned Subcollection Write & Blanket List -> FAIL
  await assertFails(
    setDoc(doc(userACtx.firestore(), 'engagements', 'nonexistent-eng', 'working_notes', 'wp-001'), {
      id: 'wp-001',
      ref: 'WP-0001',
      title: 'Orphan note',
      controlArea: 'IT',
      author: 'Auditor A',
      status: 'Draft',
      hasException: false,
      updatedAt: '2026-11-23',
      testingProcedure: 'Test',
      conclusion: 'Satisfactory',
      ownerId: USER_A_UID,
      memberUids: [USER_A_UID],
      memberEmails: [USER_A_EMAIL],
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    })
  );
  await assertFails(getDocs(collection(userBCtx.firestore(), 'engagements')));

  // Positive control: Admin & atomic user creation succeed
  const batch = writeBatch(userBCtx.firestore());
  batch.set(doc(userBCtx.firestore(), 'users', USER_B_UID), {
    uid: USER_B_UID,
    username: 'auditor.b',
    fullName: 'Auditor B',
    role: 'user',
    isActive: true,
    isLocked: false,
    failedLoginCount: 0,
    requiresPasswordChange: false,
    createdAt: serverTimestamp(),
    modifiedAt: serverTimestamp(),
  });
  batch.set(doc(userBCtx.firestore(), 'users', USER_B_UID, 'private', 'info'), {
    uid: USER_B_UID,
    email: USER_B_EMAIL,
    updatedAt: serverTimestamp(),
  });
  await assertSucceeds(batch.commit());

  await testEnv.cleanup();
}
