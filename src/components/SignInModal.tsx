import { useEffect, useState, type FormEvent } from 'react';
import { Check, Lock, X } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [signedInUser, setSignedInUser] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter your registered member email.');
      return;
    }
    if (accessCode.trim().length < 4) {
      setError('Please enter your 4+ character passkey.');
      return;
    }
    setError('');
    setSignedInUser(email.trim());
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202A36]/65 dark:bg-black/75 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-[#161F2B] rounded-3xl shadow-[0_28px_65px_-12px_rgba(15,23,42,0.38)] ring-1 ring-[#202A36]/10 border border-gray-300 dark:border-slate-800 overflow-hidden text-gray-900 dark:text-slate-100">
        <div className="flex items-start justify-between gap-4 px-6 sm:px-8 py-5 bg-gray-50/90 dark:bg-[#111821] border-b border-gray-200 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
              Member Portal
            </p>
            <h2 id="signin-modal-title" className="text-2xl font-semibold tracking-tight text-[#202A36] dark:text-slate-100">
              {signedInUser ? 'Welcome Back' : 'Sign In to SkyElite'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close sign in dialog"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {signedInUser ? (
            <div className="space-y-5">
              <div className="w-11 h-11 rounded-full bg-[#202A36] dark:bg-slate-100 text-white dark:text-[#111821] flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                Signed in as <span className="font-semibold text-[#202A36] dark:text-white">{signedInUser}</span>. Your
                Jet Card flight hours and empty-leg alerts are active for this session.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 min-h-[44px] py-2.5 px-5 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] text-sm font-medium transition-colors cursor-pointer"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSignedInUser(null);
                    setAccessCode('');
                  }}
                  className="min-h-[44px] py-2.5 px-4 rounded-full bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 text-sm font-medium transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="member-email" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Member Email
                </label>
                <input
                  id="member-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@skyelite.com"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="member-passkey" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Access Passkey
                </label>
                <div className="relative">
                  <input
                    id="member-passkey"
                    type="password"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="••••••••"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                  />
                  <Lock className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {error && (
                <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 px-5 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] text-sm font-medium transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
