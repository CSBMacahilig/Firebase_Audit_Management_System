# Security Specification — CSB Audit Management System (Firestore)

## Phase 0: Data Invariants & Access Laws

1. **Identity & Email Verification Law**:
   - No unauthenticated or unverified user (`request.auth == null || request.auth.token.email_verified != true`) may read or write any document in Firestore.
   - `request.auth.token.email` is only trusted when `request.auth.token.email_verified == true`.
2. **Privilege & Role Escalation Prevention Law**:
   - Users creating their own `/users/{userId}` document are restricted to `role == 'user'`, `isActive == true`, `isLocked == false`, and `uid == request.auth.uid`, EXCEPT when a verified admin-authored `/admin_invites/{emailKey}` document (`isActive == true`) exists for their verified Google email and `/admins/{userId}` is created atomically in the same batch (`existsAfter`).
   - Non-admin users cannot modify `isActive`, `isLocked`, `uid`, or `createdAt` on `/users/{userId}`, and cannot elevate `role` to `'admin'` without an active `/admin_invites/{emailKey}` grant.
   - Only verified admins (`/admins/{request.auth.uid}` or bootstrapped admin `christian.macahilig@citysavings.com.ph`) may write `/admin_invites/{emailKey}`, `/system_users/{userId}`, or privileged `master_data` keys.
3. **PII Isolation Law**:
   - User email PII in `/users/{userId}/private/info` and `/user_profiles/{profileId}/private/contact` is readable ONLY by the matching owner or an admin (`isOwner` / `isAdmin`).
   - Sensitive `master_data` keys (`access_users_registry`, `auditors`, `auditee_directory`) containing staff emails are strictly admin-only.
4. **Master Gate & Relational Sync Law**:
   - Engagement subcollections (`/engagements/{engagementId}/working_notes`, `findings`, `timeline_activities`, `files`, `activity_log`) require the parent engagement document to exist and the caller to be an engagement member (`ownerId` / `memberUids` / `memberEmails`) or admin.
   - Creating `/users/{userId}` and `/users/{userId}/private/info` requires atomic batch consistency (`existsAfter`).
5. **Path Hardening, Strict Keys & Volumetric Bounds Law**:
   - Every document ID path parameter must match `^[a-zA-Z0-9_-]+$` and length `<= 128`.
   - Every write invokes `isValid[Entity](incoming())` enforcing `hasAll` + `hasOnly` (no shadow/ghost fields), type checks, string `.size()` bounds, and bounded arrays (`<= 100` members).
6. **Temporal Integrity & Terminal State Law**:
   - Server timestamps (`request.time`) are enforced on `createdAt` / `updatedAt` / `modifiedAt`.
   - Closed engagements (`status == 'Closed'`) and closed issues (`status == 'Closed'`) are locked against non-admin mutations.
7. **Secure List Queries Law**:
   - Every `allow list` rule evaluates `resource.data` against `request.auth.uid` / verified `request.auth.token.email` (or `isBootstrappedAdmin()`), with zero `get()` or `exists()` lookups inside `allow list`.

---

## The "Dirty Dozen" Adversarial Payloads

| # | Attack Vector | Target Path | Expected Result |
|---|---------------|-------------|-----------------|
| 1 | **Unauthenticated Read/Write** | `/engagements/ae-2026-001` | `PERMISSION_DENIED` |
| 2 | **Unverified Email Spoof** (`email_verified: false`, email set to admin) | `/admins/attacker_uid` | `PERMISSION_DENIED` |
| 3 | **Self-Assigned Admin Role on Signup** (`role: 'admin'` without `/admin_invites` grant) | `/users/attacker_uid` | `PERMISSION_DENIED` |
| 4 | **Privilege Escalation Update** (user updates own `role` to `'admin'` without invite) | `/users/user_uid` | `PERMISSION_DENIED` |
| 5 | **Shadow / Ghost Field Injection** (`isVerified: true` on engagement) | `/engagements/ae-2026-001` | `PERMISSION_DENIED` |
| 6 | **ID Poisoning** (1,500-char or invalid-char document ID `../evil`) | `/engagements/<1500 chars>` | `PERMISSION_DENIED` |
| 7 | **Type & Value Poisoning** (`riskScore: "high"` or 100KB title string) | `/universe_entities/au-001` | `PERMISSION_DENIED` |
| 8 | **Timestamp Tampering** (`createdAt` backdated instead of `request.time`) | `/issues_register/is-001` | `PERMISSION_DENIED` |
| 9 | **Unbounded Array / DoS** (`memberUids` with 110 items > max 100) | `/engagements/ae-2026-002` | `PERMISSION_DENIED` |
| 10 | **Terminal State Bypass** (non-admin updating `Closed` issue/engagement) | `/issues_register/is-closed-1` | `PERMISSION_DENIED` |
| 11 | **PII Blanket Read** (non-owner reading `/users/other_uid/private/info`) | `/users/other_uid/private/info` | `PERMISSION_DENIED` |
| 12 | **Orphaned Subcollection Write & Blanket List** (working note under nonexistent engagement or unfiltered `list` by non-member) | `/engagements/missing-eng/working_notes/wp-001` | `PERMISSION_DENIED` |
