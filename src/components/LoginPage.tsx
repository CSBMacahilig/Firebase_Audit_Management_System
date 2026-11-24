import React, { useState } from 'react';
import { AuthSession, loginWithGoogle } from '../utils/authStore';

// ─────────────────────────────────────────────────────────────────────────────
// LoginPage — Firebase Authentication (Google Sign-In)
// ─────────────────────────────────────────────────────────────────────────────

interface LoginPageProps {
  onLoginSuccess: (session: AuthSession) => void;
  initialError?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, initialError = '' }) => {
  const [error, setError] = useState(initialError);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setLocked(false);
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);

    if (result.success && result.session) {
      onLoginSuccess(result.session);
    } else {
      setError(result.error ?? 'Google sign-in failed. Please try again.');
      if (result.locked) setLocked(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8E2F4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white rounded-xl px-6 py-4 shadow-lg border border-[#542D84]/10 flex items-center gap-2 mb-6">
            <div className="relative flex items-baseline tracking-tight leading-none">
              <span className="text-[#F37021] font-serif font-bold text-[28px]">City</span>
              <div className="relative inline-flex flex-col ml-0.5">
                <span className="text-[7px] font-bold tracking-wider uppercase text-[#512B81] -mb-1">
                  a UNIONBANK subsidiary
                </span>
                <span className="text-[#512B81] font-serif font-bold text-[28px]">Savings</span>
              </div>
            </div>
          </div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight text-center">
            Audit Management System
          </h1>
          <p className="text-sm text-slate-500 mt-1 text-center">
            CSB · Internal Audit Division
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h2 className="text-[17px] font-bold text-slate-900 mb-1">Sign in</h2>
          <p className="text-xs text-slate-500 mb-6">
            Sign in with your verified Google account to access the Audit Management System.
          </p>

          {(error || initialError) && (
            <div
              className={`flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm border mb-4 ${
                locked
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-8a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0V6a1 1 0 0 0-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error || initialError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-[#492785] hover:bg-[#3b1f6b] disabled:bg-slate-300 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm"
          >
            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.64 0 3.12.56 4.28 1.66l3.2-3.2C17.52 1.68 14.96.6 12 .6 7.46.6 3.55 3.2 1.65 7.01l3.73 2.89C6.28 7.21 8.9 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.17-2 3.71-4.95 3.71-8.7z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.38 14.1a7.02 7.02 0 0 1 0-4.2L1.65 7.01a11.98 11.98 0 0 0 0 9.98l3.73-2.89z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.4c3.24 0 5.95-1.07 7.94-2.91l-3.71-2.88c-1.07.72-2.44 1.15-4.23 1.15-3.1 0-5.72-2.17-6.62-5.06L1.65 16.59C3.55 20.4 7.46 23.4 12 23.4z"
                />
              </svg>
            </span>
            <span>{loading ? 'Signing in with Google…' : 'Sign in with Google'}</span>
          </button>

          <p className="mt-6 text-center text-[11px] text-slate-400">
            Contact your system administrator if you need access or your account is locked.
          </p>
        </div>

        {/* Security notice */}
        <p className="mt-4 text-center text-[11px] text-slate-400">
          Protected by Firebase Auth &amp; OCISO BSSC V3 · TLS 1.2+ · All sessions logged
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ForcePasswordChange — retained for interface compatibility
// ─────────────────────────────────────────────────────────────────────────────

interface ForcePasswordChangeProps {
  session: AuthSession;
  onChanged: (updatedSession: AuthSession) => void;
  onLogout: () => void;
}

export const ForcePasswordChange: React.FC<ForcePasswordChangeProps> = ({
  session,
  onChanged,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-[#E8E2F4] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h2 className="text-[17px] font-bold text-slate-900 mb-2">Session verification</h2>
        <p className="text-xs text-slate-500 mb-6">
          Your account is authenticated via Google Sign-In. Click continue to enter the workspace.
        </p>
        <button
          type="button"
          onClick={() => onChanged({ ...session, requiresPasswordChange: false })}
          className="w-full py-2.5 bg-[#492785] hover:bg-[#3b1f6b] text-white text-sm font-bold rounded-lg cursor-pointer"
        >
          Continue
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 w-full text-center text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};
