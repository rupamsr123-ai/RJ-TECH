import React, { useState } from 'react';
import { Lock, User, Key, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Button, Card, Badge, Modal } from '../common/UIComponents';

export const PublicLoginPage: React.FC<{ initialRole?: UserRole }> = ({ initialRole = 'STUDENT' }) => {
  const { login, loginAsStudent, setActiveView, settings, students } = useApp();

  const [role, setRole] = useState<UserRole>(initialRole);
  const [identifier, setIdentifier] = useState(
    initialRole === 'ADMIN' ? 'admin' : initialRole === 'STAFF' ? 'staff' : 'RJT-1001'
  );
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'ADMIN') {
      setIdentifier('admin');
    } else if (newRole === 'STAFF') {
      setIdentifier('staff');
    } else {
      setIdentifier('RJT-1001');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    if (role === 'STUDENT') {
      loginAsStudent(identifier);
    } else {
      login(identifier, role);
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
                      ? 'e.g. RJT-1001 or rahul.das'
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
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              1-Click Demo Accounts
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
                Admin (Full Access)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('STAFF');
                  login('staff', 'STAFF');
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 rounded-lg text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
              >
                Staff (Instructor)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('STUDENT');
                  loginAsStudent('RJT-1001');
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
              >
                Student (Rahul Das)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('STUDENT');
                  loginAsStudent('RJT-1002');
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
              >
                Student (Priya Jana)
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

