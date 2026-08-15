import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Phone, User as UserIcon, ShieldCheck, ArrowRight, CheckCircle2, RefreshCw, KeyRound, AlertCircle, Info } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { CaptchaBox } from './CaptchaBox';
import { TermsModal } from './TermsModal';
import { UserRole } from '../../types';
import { Logo } from '../ui/Logo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    login,
    startSignup,
    verifyEmailCode,
    resendVerificationCode,
    pendingUser,
    pendingVerificationCode,
    resendApiNotice,
    isSendingResend,
    resendCountdown,
  } = useAuthStore();

  const { addToast } = useToastStore();

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('+250 788 ');
  const [signupRole, setSignupRole] = useState<UserRole>('buyer');
  const [signupPassword, setSignupPassword] = useState('');

  // Security checkboxes
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // OTP 6-Digit Code inputs
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCaptchaVerified) {
      addToast('Human Verification Required', 'Please complete the "Verify you are human" check.', 'warning');
      return;
    }

    login(loginIdentifier, loginPassword);
    addToast('Welcome back to Nexora! 👋', `Logged in as ${loginIdentifier}`);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCaptchaVerified) {
      addToast('Human Verification Required', 'Please check the "Verify you are human" box.', 'warning');
      return;
    }

    if (!agreedToTerms) {
      addToast('Terms Agreement Required', 'You must agree to the Terms of Service to proceed.', 'warning');
      return;
    }

    const res = await startSignup(signupName, signupEmail, signupPhone, signupRole, signupPassword);
    addToast('Verification Triggered! ✉️', res.message, 'info');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.substring(value.length - 1);
    setOtpDigits(newDigits);

    // Auto-focus next input box
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');

    if (enteredCode.length < 6) {
      addToast('Incomplete Code', 'Please enter all 6 digits of your verification code.', 'warning');
      return;
    }

    const verified = verifyEmailCode(enteredCode);
    if (verified) {
      addToast('Account Verified & Created! 🎉', 'Welcome to Nexora Rwanda Marketplace.');
    } else {
      addToast('Invalid Verification Code', 'The code you entered is incorrect. Please check your inbox and try again.', 'error');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        >
          {/* Top Brand Banner */}
          <div className="p-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
            <Logo variant="dark" />

            <button onClick={closeAuthModal} className="p-2 rounded-xl text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          {authMode !== 'verify' && (
            <div className="p-2 bg-slate-100 border-b border-slate-200 grid grid-cols-2 text-xs font-bold">
              <button
                onClick={() => setAuthMode('login')}
                className={`py-2 rounded-xl transition-all ${
                  authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`py-2 rounded-xl transition-all ${
                  authMode === 'signup' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Register Account
              </button>
            </div>
          )}

          <div className="p-6">
            {/* LOGIN MODE */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email or Phone Number</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. jeanluc@nexora.rw or +250 788..."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Human Verification Captcha Box */}
                <div className="pt-2">
                  <CaptchaBox verified={isCaptchaVerified} onVerify={setIsCaptchaVerified} />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                >
                  Sign In to Nexora
                </button>
              </form>
            )}

            {/* SIGN UP MODE */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative flex items-center">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Jean-Luc Rutaremara"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. jeanluc@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (MTN / Airtel)</label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="text"
                      required
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+250 788 123 456"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-500"
                  >
                    <option value="buyer">🛍️ Buyer (Browse & Buy Products)</option>
                    <option value="seller">🏪 Vendor / Seller (Open Your Own Shop)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Human Verification Captcha Box */}
                <div className="pt-1">
                  <CaptchaBox verified={isCaptchaVerified} onVerify={setIsCaptchaVerified} />
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms-check"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="terms-check" className="text-xs text-slate-600 leading-tight cursor-pointer">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="font-bold text-emerald-600 underline hover:text-emerald-700"
                    >
                      Terms of Service & Privacy Policy
                    </button>{' '}
                    of Nexora Rwanda.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSendingResend}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>{isSendingResend ? 'Sending Verification Code...' : 'Register & Verify Email'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* VERIFICATION STEP (OTP 6-DIGIT CODE FROM RESEND API) */}
            {authMode === 'verify' && pendingUser && (
              <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <KeyRound className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="font-extrabold text-base text-slate-900">Email Verification Code</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Resend API verification code for{' '}
                    <span className="font-bold text-emerald-600">{pendingUser.email}</span>:
                  </p>
                </div>

                {/* Resend Free Tier Notice Banner if applicable */}
                {resendApiNotice && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] text-left flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Resend API Key Status:</span>
                      <span className="opacity-90">{resendApiNotice}</span>
                    </div>
                  </div>
                )}

                {/* 6 Individual Code Inputs */}
                <div className="flex justify-center gap-2 my-4">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-xl font-black rounded-xl border-2 border-slate-300 text-slate-900 bg-slate-50 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  ))}
                </div>

                {pendingVerificationCode && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    🔑 Verification Code: <span className="font-mono text-base text-emerald-700 tracking-wider ml-1">{pendingVerificationCode}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    disabled={resendCountdown > 0 || isSendingResend}
                    onClick={async () => {
                      await resendVerificationCode();
                      addToast('Code Resent! ✉️', `Resent code to ${pendingUser.email}`);
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-bold disabled:opacity-40 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSendingResend ? 'animate-spin' : ''}`} />
                    <span>{resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Edit Email
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                >
                  Verify Code & Complete Registration
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      {/* Terms & Conditions Full Modal */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} onAccept={() => setAgreedToTerms(true)} />
    </AnimatePresence>
  );
};
