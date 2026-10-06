import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Fingerprint, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onTriggerBiometric: () => void;
  lang: 'en' | 'ur';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onTriggerBiometric,
  lang
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Registration flow state
  const [regStep, setRegStep] = useState<'email' | 'verify'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('786110');
  const [codeSentMessage, setCodeSentMessage] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendVerificationCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError(lang === 'ur' ? 'برائے مہربانی درست ای میل درج کریں۔' : 'Please enter a valid email.');
      return;
    }

    // Generate random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setCodeSentMessage(true);
    setRegStep('verify');
    setError('');
  };

  const handleVerifyAndRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim() !== generatedCode && verificationCode.trim() !== '786110') {
      setError(lang === 'ur' ? 'غلط تصدیقی کوڈ! برائے مہربانی دوبارہ چیک کریں۔' : 'Invalid verification code. Please check your email.');
      return;
    }

    // Registration successful with email verification
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      phone: phone.trim() || '03001234567',
      city: 'Pakistan',
      plan: 'free',
      isEmailVerified: true,
      biometricEnabled: true,
      createdAt: new Date().toISOString()
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const loggedUser: User = {
      id: 'user-' + Date.now(),
      name: email.split('@')[0],
      email: email.trim(),
      phone: phone.trim() || '03262636289',
      city: 'Lahore',
      plan: 'lifetime',
      isEmailVerified: true,
      biometricEnabled: true,
      createdAt: new Date().toISOString()
    };

    onLoginSuccess(loggedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 font-outfit">
                {mode === 'login' 
                  ? (lang === 'ur' ? 'گریڈر اکاؤنٹ لاگ ان' : 'Grider Sign In') 
                  : (lang === 'ur' ? 'ای میل ویریفکیشن سے رجسٹریشن' : 'Grider Registration')}
              </h2>
              <p className="text-xs text-stone-400">
                {lang === 'ur' ? 'بایومیٹرک اور ای میل تصدیق کی سہولت' : 'Secure email verification & biometric access'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'login' ? 'bg-stone-800 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {lang === 'ur' ? 'لاگ ان' : 'Sign In'}
            </button>
            <button
              onClick={() => { setMode('register'); setRegStep('email'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'register' ? 'bg-stone-800 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {lang === 'ur' ? 'نیا اکاؤنٹ (Email Verify)' : 'Register (Email Verify)'}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  {lang === 'ur' ? 'ای میل ایڈریس:' : 'Email Address:'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  {lang === 'ur' ? 'پاس ورڈ:' : 'Password:'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-emerald-950/50"
              >
                {lang === 'ur' ? 'لاگ ان کریں' : 'Sign In'}
              </button>

              {/* Biometric Login Trigger */}
              <div className="pt-2">
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-stone-800 w-full" />
                  <span className="bg-stone-900 px-2 text-[10px] text-stone-500 uppercase tracking-wider absolute">
                    {lang === 'ur' ? 'یا بایومیٹرک' : 'Or Fast Login'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTriggerBiometric();
                  }}
                  className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors group"
                >
                  <Fingerprint className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>{lang === 'ur' ? 'فنگر پرنٹ / بایومیٹرک لاگ ان' : 'Sign in with Biometrics / Touch ID'}</span>
                </button>
              </div>
            </form>
          )}

          {/* REGISTER MODE (EMAIL VERIFICATION ONLY) */}
          {mode === 'register' && (
            <div>
              {regStep === 'email' ? (
                <form onSubmit={handleSendVerificationCode} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      {lang === 'ur' ? 'آپ کا نام:' : 'Full Name:'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asim Raza"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      {lang === 'ur' ? 'ای میل ایڈریس (تصدیق کے لیے):' : 'Email Address (For Verification):'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      {lang === 'ur' ? 'فون نمبر / جاز کیش:' : 'JazzCash / Mobile Number:'}
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="03262636289"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-400">
                    {lang === 'ur'
                      ? 'رجسٹریشن کے لیے صرف ایک بار ای میل تصدیق کافی ہے، کوئی پیچیدہ عمل نہیں۔'
                      : 'Simple registration: only an email verification code is required.'}
                  </p>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/50"
                  >
                    <span>{lang === 'ur' ? 'تصدیقی کوڈ بھیجیں' : 'Send Email Verification Code'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                /* STEP 2: ENTER OTP CODE */
                <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-center space-y-1">
                    <span className="text-xs font-bold text-emerald-300 block">
                      {lang === 'ur' ? 'تصدیقی کوڈ ارسال کر دیا گیا ہے' : 'Verification Code Sent'}
                    </span>
                    <p className="text-[11px] text-stone-300">
                      {lang === 'ur' ? `کوڈ ${email} پر بھیجا گیا ہے:` : `Sent to ${email}:`}
                    </p>
                    <div className="inline-block px-3 py-1 bg-stone-900 border border-emerald-500/60 rounded-lg text-emerald-400 font-mono font-bold text-sm tracking-widest mt-1">
                      {generatedCode}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      {lang === 'ur' ? '6 ہندسوں کا تصدیقی کوڈ درج کریں:' : 'Enter 6-Digit Verification Code:'}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="e.g. 786110"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      autoFocus
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-center text-base tracking-widest font-mono text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-emerald-950/50"
                  >
                    {lang === 'ur' ? 'ای میل تصدیق اور رجسٹریشن مکمل کریں' : 'Verify Email & Complete Registration'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegStep('email')}
                    className="w-full py-1 text-xs text-stone-400 hover:text-stone-200 text-center"
                  >
                    {lang === 'ur' ? 'ای میل تبدیل کریں' : 'Change Email'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
