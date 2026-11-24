import React, { useState, useEffect, useCallback } from 'react';
import {
  SystemUser,
  AuthSession,
  SystemRole,
  loadUsers,
  adminAddUser,
  adminUnlockUser,
  adminToggleActive,
  adminUpdateUserRole,
} from '../utils/authStore';

/**
 * AdminUserManagement
 *
 * Accessible only when the authenticated session role === 'admin' (LAC-1).
 * Allows admins to:
 *   • View all Firebase-authenticated and pre-provisioned system users
 *   • Pre-authorize new Google accounts with role 'admin' or 'user'
 *   • Promote or demote user roles (synced with Firestore /admins)
 *   • Unlock locked accounts
 *   • Activate / deactivate accounts
 */

interface Props {
  session: AuthSession;
  onClose: () => void;
}

export const AdminUserManagement: React.FC<Props> = ({ session, onClose }) => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Add-user form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<SystemRole>('user');
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const refresh = useCallback(() => {
    loadUsers().then(setUsers);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const notify = (type: 'success' | 'error', msg: string) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice(null), 4500);
  };

  // ── Add user ─────────────────────────────────────────────────────────────
  const handleAddUser = async () => {
    setAddError('');
    if (!newUsername.trim() || !newFullName.trim() || !newEmail.trim()) {
      setAddError('Username, full name, and Google email are required.');
      return;
    }
    setAddLoading(true);
    const result = await adminAddUser(session, {
      username: newUsername.trim(),
      fullName: newFullName.trim(),
      email: newEmail.trim(),
      role: newRole,
    });
    setAddLoading(false);
    if (result.success) {
      notify('success', `User "${newEmail.trim()}" pre-authorized with role "${newRole}".`);
      setNewUsername('');
      setNewFullName('');
      setNewEmail('');
      setNewRole('user');
      setShowAddForm(false);
      refresh();
    } else {
      setAddError(result.error ?? 'Failed to add user.');
    }
  };

  // ── Unlock ───────────────────────────────────────────────────────────────
  const handleUnlock = async (userId: string, name: string) => {
    const result = await adminUnlockUser(session, userId);
    if (result.success) {
      notify('success', `IA-9: Account "${name}" unlocked.`);
      refresh();
    } else {
      notify('error', result.error ?? 'Unlock failed.');
    }
  };

  // ── Toggle active ────────────────────────────────────────────────────────
  const handleToggleActive = async (userId: string, name: string, currentlyActive: boolean) => {
    const result = await adminToggleActive(session, userId);
    if (result.success) {
      notify('success', `Account "${name}" ${currentlyActive ? 'deactivated' : 'reactivated'}.`);
      refresh();
    } else {
      notify('error', result.error ?? 'Operation failed.');
    }
  };

  // ── Role switch ──────────────────────────────────────────────────────────
  const handleRoleChange = async (userId: string, name: string, nextRole: SystemRole) => {
    const result = await adminUpdateUserRole(session, userId, nextRole);
    if (result.success) {
      notify('success', `Role for "${name}" updated to "${nextRole}".`);
      refresh();
    } else {
      notify('error', result.error ?? 'Failed to update role.');
    }
  };

  const lockedCount = users.filter((u) => u.isLocked).length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-[18px] font-bold text-slate-900">User management</h2>
              <span className="text-[10px] font-bold bg-[#E4DDF8] text-[#492785] px-2 py-0.5 rounded-full">
                Admin only · LAC-1
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Signed in as <strong>{session.fullName}</strong> ({session.username}) · {session.role}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Notice ────────────────────────────────────────────────────── */}
        {notice && (
          <div
            className={`mx-6 mt-4 px-4 py-2.5 rounded-lg flex items-center justify-between text-xs font-medium border ${
              notice.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <span>{notice.msg}</span>
            <button type="button" onClick={() => setNotice(null)} className="ml-4 font-bold cursor-pointer">
              ✕
            </button>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* ── KPI strip ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <div className="text-[26px] font-bold text-slate-900 font-mono-tabular">{users.length}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Total users</div>
            </div>
            <div className={`border rounded-xl p-4 text-center ${lockedCount > 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className={`text-[26px] font-bold font-mono-tabular ${lockedCount > 0 ? 'text-red-700' : 'text-slate-900'}`}>{lockedCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Locked (IA-9)</div>
            </div>
            <div className="bg-[#F0EBF9] border border-[#D0C4EF] rounded-xl p-4 text-center">
              <div className="text-[26px] font-bold text-[#492785] font-mono-tabular">{adminCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Admins</div>
            </div>
          </div>

          {/* ── Add user form toggle ─────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-bold text-slate-900">System users</h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm((v) => !v);
                  setAddError('');
                }}
                className="px-3.5 py-1.5 bg-[#492785] hover:bg-[#3b1f6b] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
              >
                {showAddForm ? '✕ Cancel' : '+ Pre-authorize user'}
              </button>
            </div>

            {showAddForm && (
              <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-800 mb-1">Pre-authorize Google user account — IA-1/IA-2</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      value={newUsername}
                      onChange={(e) => {
                        setNewUsername(e.target.value.toLowerCase().replace(/\s/g, ''));
                        setAddError('');
                      }}
                      placeholder="e.g. j.reyes"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#492785]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      placeholder="e.g. J. Reyes"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#492785]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Google Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      autoComplete="off"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="e.g. j.reyes@citysavings.com.ph"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#492785]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as SystemRole)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#492785]"
                    >
                      <option value="user">User — read/write access</option>
                      <option value="admin">Admin — full access + user management</option>
                    </select>
                  </div>
                </div>

                {addError && (
                  <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">{addError}</div>
                )}

                <button
                  type="button"
                  onClick={handleAddUser}
                  disabled={addLoading}
                  className="px-4 py-2 bg-[#492785] hover:bg-[#3b1f6b] disabled:bg-slate-300 text-white text-xs font-bold rounded-lg cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  {addLoading ? 'Saving…' : 'Create user'}
                </button>
              </div>
            )}

            {/* Users table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Last login (AL-4.4)</th>
                    <th className="py-3 px-4">Status (AL-4.7)</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-slate-400">
                        No users found.
                      </td>
                    </tr>
                  )}
                  {users.map((u) => {
                    const isCurrentUser = u.id === session.userId;
                    const lastLogin = u.lastLogin
                      ? new Date(u.lastLogin).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
                      : '—';
                    return (
                      <tr
                        key={u.id}
                        className={`transition-colors ${
                          u.isLocked ? 'bg-red-50/40' : !u.isActive ? 'bg-slate-50' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{u.fullName}</div>
                          <div className="text-xs text-slate-500 font-mono-tabular mt-0.5">@{u.username}</div>
                          {u.email && <div className="text-[11px] text-slate-400 mt-0.5">{u.email}</div>}
                          {isCurrentUser && (
                            <span className="inline-block mt-1 text-[9px] font-bold bg-[#E4DDF8] text-[#492785] px-1.5 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              u.role === 'admin' ? 'bg-[#E4DDF8] text-[#492785]' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${u.role === 'admin' ? 'bg-[#492785]' : 'bg-slate-500'}`} />
                            {u.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600">{lastLogin}</td>
                        <td className="py-3.5 px-4">
                          {u.isLocked ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                              Locked
                            </span>
                          ) : !u.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Inactive
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1.5 justify-end">
                            {u.isLocked && (
                              <button
                                type="button"
                                onClick={() => handleUnlock(u.id, u.fullName)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-md cursor-pointer"
                              >
                                Unlock
                              </button>
                            )}
                            {!isCurrentUser && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRoleChange(u.id, u.fullName, u.role === 'admin' ? 'user' : 'admin')}
                                  className="px-2.5 py-1 bg-white hover:bg-purple-50 text-[#492785] border border-purple-200 text-[10px] font-semibold rounded-md cursor-pointer"
                                >
                                  {u.role === 'admin' ? 'Set User' : 'Set Admin'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleActive(u.id, u.fullName, u.isActive)}
                                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-[10px] font-semibold rounded-md cursor-pointer"
                                >
                                  {u.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security notice */}
          <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 space-y-0.5">
            <strong>Security notes (Firebase Auth &amp; BSSC V3):</strong>
            <div>• Authentication is enforced via verified Google Sign-In tokens.</div>
            <div>• Only admin-role accounts may promote, deactivate, or pre-authorize users (LAC-1).</div>
            <div>• Firestore Security Rules enforce schema validation, PII isolation, and role checks server-side.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
