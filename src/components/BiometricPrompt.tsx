import React, { useState, useEffect } from 'react';
import { Fingerprint, CheckCircle2, X, Shield, Lock } from 'lucide-react';
import { authenticateWithBiometrics } from '../utils/syncEngine';

interface BiometricPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: 'en' | 'ur';
}

export const BiometricPrompt: React.FC<BiometricPromptProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [usePin, setUsePin] = useState(false);
  const [pinInput, setPinInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setIsVerified(false);
      setUsePin(false);
      setPinInput('');

      // Trigger WebAuthn and simulated biometric scanner
      authenticateWithBiometrics().then(() => {
        const timer = setTimeout(() => {
          setIsScanning(false);
          setIsVerified(true);
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 700);
        }, 1200);
        return () => clearTimeout(timer);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length >= 4) {
      setIsVerified(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center space-y-5 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-2">
          <h3 className="text-base font-bold text-white font-outfit">
            {lang === 'ur' ? 'بایومیٹرک سیکیورٹی تصدیق' : 'Biometric Security Access'}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            {lang === 'ur' ? 'فنگر پرنٹ یا ٹچ آئی ڈی کی تصدیق کی جا رہی ہے...' : 'Touch sensor or scan face to unlock Grider'}
          </p>
        </div>

        {!usePin ? (
          <div className="py-4 flex flex-col items-center">
            {/* Sensor graphic with scanning beam */}
            <div className="relative w-28 h-28 rounded-full bg-stone-950 border-2 border-stone-800 flex items-center justify-center overflow-hidden shadow-inner group">
              {/* Scan laser */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce pointer-events-none" />
              )}

              {isVerified ? (
                <CheckCircle2 className="w-14 h-14 text-emerald-400 scale-110 transition-transform" />
              ) : (
                <Fingerprint
                  className={`w-14 h-14 transition-colors ${
                    isScanning ? 'text-emerald-400 animate-pulse' : 'text-stone-500'
                  }`}
                />
              )}
            </div>

            <span className="text-xs font-semibold text-emerald-400 mt-4">
              {isVerified
                ? (lang === 'ur' ? 'تصدیق کامیاب!' : 'Verified Successfully!')
                : (lang === 'ur' ? 'سینسر کو چھوئیں...' : 'Scanning fingerprint sensor...')}
            </span>

            <button
              onClick={() => setUsePin(true)}
              className="mt-5 text-xs text-stone-400 hover:text-stone-200 underline"
            >
              {lang === 'ur' ? 'سیکیورٹی PIN کے ذریعے ان لاک کریں' : 'Use Security PIN instead'}
            </button>
          </div>
        ) : (
          <form onSubmit={handlePinSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                {lang === 'ur' ? '4 ہندسوں کا سیکیورٹی PIN:' : 'Enter 4-Digit PIN:'}
              </label>
              <input
                type="password"
                maxLength={6}
                required
                placeholder="••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-center text-lg tracking-widest font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors"
            >
              {lang === 'ur' ? 'تصدیق کریں' : 'Verify PIN'}
            </button>

            <button
              type="button"
              onClick={() => setUsePin(false)}
              className="text-xs text-stone-400 hover:text-stone-200 block mx-auto"
            >
              {lang === 'ur' ? 'فنگر پرنٹ پر واپس جائیں' : 'Back to Fingerprint'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
