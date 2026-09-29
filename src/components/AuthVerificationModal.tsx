import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  UserCheck,
  Wrench,
  Building2,
  KeyRound,
  CheckCircle2,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
}

export const AuthVerificationModal: React.FC<AuthVerificationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [phoneOrEmail, setPhoneOrEmail] = useState(currentUser.phone || currentUser.email);
  const [otpCode, setOtpCode] = useState('');
  const [badgeNumber, setBadgeNumber] = useState(currentUser.badgeNumber || 'PW-8819');
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');

  if (!isOpen) return null;

  const handleSelectQuickPersona = (user: UserProfile) => {
    onSwitchUser(user);
    onClose();
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      ...currentUser,
      role: selectedRole,
      phone: phoneOrEmail.includes('@') ? '' : phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : 'verified.citizen@metrocity.org',
      badgeNumber: selectedRole !== 'resident' ? badgeNumber : undefined,
      isVerified: true,
      name:
        selectedRole === 'field_worker'
          ? 'Carlos Mendez (Verified Crew)'
          : selectedRole === 'official'
          ? 'Elena Vance (Director)'
          : 'Sarah Jenkins (Verified Resident)',
    };
    onSwitchUser(newUser);
    setStep('success');
    setTimeout(() => {
      onClose();
      setStep('input');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-base font-bold">Secure Access &amp; Role Verification</h2>
              <p className="text-xs text-slate-400">
                Dual-access control for residents and municipal staff
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Demo Persona Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Instant One-Click Persona Switcher
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {INITIAL_USERS.map((user) => {
                const isSelected = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectQuickPersona(user)}
                    className={`p-3 rounded-xl border text-left transition-all min-h-[64px] ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-600/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {user.role === 'resident' && (
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      {user.role === 'field_worker' && (
                        <Wrench className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      {user.role === 'official' && (
                        <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                      <span className="text-[11px] font-bold text-slate-900 capitalize">
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 truncate">
                      {user.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400">
              OR VERIFY YOUR OWN ACCOUNT
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {step === 'input' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Access Clearance
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('resident')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      selectedRole === 'resident'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Resident
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('field_worker')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      selectedRole === 'field_worker'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Field Worker
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('official')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      selectedRole === 'official'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    City Official
                  </button>
                </div>
              </div>

              {selectedRole === 'resident' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone or Email
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      placeholder="(555) 000-0000 or you@email.com"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    No password required. We send a quick one-time code to verify your neighborhood identity.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Municipal Staff ID / Badge Number
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={badgeNumber}
                        onChange={(e) => setBadgeNumber(e.target.value)}
                        placeholder="e.g. PW-8819 or DIR-014"
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 uppercase font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Official City Email
                    </label>
                    <input
                      type="email"
                      required
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      placeholder="your.name@metrocity.gov"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Continue to Code Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="text-xs text-slate-500">
                  Verification code sent to <strong>{phoneOrEmail}</strong>
                </div>
                <div className="text-xs text-teal-700 font-semibold">
                  (Simulation: enter 6 digits like 123456)
                </div>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="1 2 3 4 5 6"
                  className="w-full py-3 text-center font-mono text-xl font-bold tracking-widest bg-slate-50 border-2 border-teal-500 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl min-h-[44px]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs min-h-[44px]"
                >
                  Confirm &amp; Sign In
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-slate-900">Verification Complete!</h3>
              <p className="text-xs text-slate-500">
                You now have authorized access to your municipal civic portal.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
