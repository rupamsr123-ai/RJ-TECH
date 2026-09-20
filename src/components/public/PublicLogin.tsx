import React, { useState, useEffect } from 'react';
import { Lock, User, Key, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Button, Card, Badge, Modal } from '../common/UIComponents';
import { auth } from '../../firebase/config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const PublicLoginPage: React.FC<{ initialRole?: UserRole }> = ({ initialRole = 'STUDENT' }) => {
  const { login, loginAsStudent, setActiveView, settings, students } = useApp();

  const [role, setRole] = useState<UserRole>(initialRole);
  const [identifier, setIdentifier] = useState(
    initialRole === 'ADMIN' ? 'admin' : initialRole === 'STAFF' ? 'staff' : ''
  );
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    setRole(initialRole);
    if (initialRole === 'ADMIN') {
      setIdentifier('admin');
    } else if (initialRole === 'STAFF') {
      setIdentifier('staff');
    } else {
      setIdentifier('');
    }
  }, [initialRole]);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setLoginError(null);
    if (newRole === 'ADMIN') {
      setIdentifier('admin');
    } else if (newRole === 'STAFF') {
      setIdentifier('staff');
    } else {
      setIdentifier('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!identifier.trim()) return;

    if (role === 'STUDENT') {
      const ok = loginAsStudent(identifier, password);
      if (!ok) {
        setLoginError('Student ID / Username or Password incorrect. Check credentials or contact institute administration.');
      }
    } else {
      const ok = login(identifier, role);
      if (!ok) {
        setLoginError(`Invalid credentials for ${role}. Try default account '${role === 'ADMIN' ? 'admin' : 'staff'}'.`);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setLoginError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.warn('Google sign-in:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setLoginError('Could not complete Google Sign-In. You can use standard ID/Username login below.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50/50 via-[#F5F7FB] to-white">
      <div className="w-full max-w-md space-y-6">
        {/* Return to website */}
        <button
          onClick={() => setActiveView('public_home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to RJ TECH Website
        </button>

        <Card className="p-6 sm:p-8 shadow-xl border-slate-200">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md mx-auto flex items-center justify-center p-1">
              <img
                src={settings.logoUrl || '/rj_tech_logo.jpg'}
                alt="RJ TECH Logo"
                className="w-full h-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
              RJ TECH
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {settings.tagline}
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-6 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => handleRoleChange('STUDENT')}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                role === 'STUDENT' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('STAFF')}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                role === 'STAFF' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('ADMIN')}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                role === 'ADMIN' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Error Banner if any */}
          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {role === 'STUDENT' ? 'Student ID / Username / Mobile' : 'Username or Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    role === 'STUDENT'
                      ? 'Enter Student ID, Roll No, or Mobile'
                      : role === 'ADMIN'
                      ? 'admin'
                      : 'staff'
                  }
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me on this computer</span>
              </label>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full mt-2" icon={ArrowRight} iconPosition="right">
              {role === 'STUDENT' ? 'Enter Student Portal' : `Sign In as ${role}`}
            </Button>

            {/* Google Sign In option */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-2 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Or Continue With
              </span>
            </div>

            <button
              type="button"
              disabled={googleLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-3 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{googleLoading ? 'Signing in with Google...' : 'Sign In with Google Account'}</span>
            </button>
          </form>

          {/* Quick Staff & Admin access */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Staff Portal Access
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              <button
                type="button"
                onClick={() => {
                  setRole('ADMIN');
                  login('admin', 'ADMIN');
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
              >
                Director / Admin Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('STAFF');
                  login('staff', 'STAFF');
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 rounded-lg text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
              >
                Staff Instructor Login
              </button>
            </div>
          </div>
        </Card>

        {/* Security badge */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Protected Session • RJ TECH Computer Training Center</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <Modal
          isOpen={forgotModalOpen}
          onClose={() => {
            setForgotModalOpen(false);
            setForgotSent(false);
          }}
          title="Account Password Recovery"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            {forgotSent ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Recovery Instructions Sent</h4>
                <p className="text-xs text-slate-500">
                  Password reset link has been dispatched to your registered contact number. You can also contact RJ TECH administration at <strong>9635302734</strong> for instant credential reset.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSent(false);
                  }}
                >
                  Return to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-slate-600">
                  Enter your registered Student ID, Email, or Mobile Number. We will verify your academic enrollment and send recovery instructions.
                </p>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registered Identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RJT-1001 or 9635302734"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setForgotModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Send Reset Link
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export const PublicLogin = PublicLoginPage;

