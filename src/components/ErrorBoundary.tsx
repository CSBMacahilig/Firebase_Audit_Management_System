import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { clearSession } from '../utils/authStore';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
  detail?: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let message = error.message || 'An unexpected application error occurred.';
    let detail: string | undefined;

    try {
      const parsed = JSON.parse(error.message);
      if (parsed && typeof parsed === 'object' && parsed.operationType) {
        message = parsed.error || 'Missing or insufficient Firestore permissions.';
        detail = `Operation: ${parsed.operationType} · Path: ${parsed.path ?? 'unknown'}`;
      }
    } catch {
      // Not JSON-encoded FirestoreErrorInfo
    }

    return { hasError: true, message, detail };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Application ErrorBoundary caught error:', error, info);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    clearSession();
    window.location.reload();
  };

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-[#E8E2F4] flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-lg">
              !
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Unable to complete request</h2>
              <p className="text-xs text-slate-500">Firebase security or connectivity error</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-900 mb-4 break-words">
            {this.state.message}
          </div>

          {this.state.detail && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono-tabular text-slate-600 mb-6 break-all">
              {this.state.detail}
            </div>
          )}

          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={this.handleSignOut}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Sign out
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="px-4 py-2 rounded-lg bg-[#492785] hover:bg-[#3b1f6b] text-white text-xs font-semibold cursor-pointer"
            >
              Reload app
            </button>
          </div>
        </div>
      </div>
    );
  }
}
