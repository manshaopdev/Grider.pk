import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';
import { JAZZCASH_ACCOUNT_NUMBER, JAZZCASH_ACCOUNT_TITLE } from '../data/mockData';
import { Transaction, User } from '../types';

interface JazzCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: 'lifetime' | 'monthly';
  currentUser: User | null;
  onSubmitTransaction: (trx: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => void;
  lang: 'en' | 'ur';
}

export const JazzCashModal: React.FC<JazzCashModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  currentUser,
  onSubmitTransaction,
  lang
}) => {
  const [trxId, setTrxId] = useState('');
  const [senderNumber, setSenderNumber] = useState(currentUser?.phone || '');
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const amount = selectedPlan === 'lifetime' ? 5000 : 1200;
  const planName = selectedPlan === 'lifetime' ? 'Lifetime VIP Access (لائف ٹائم)' : 'Monthly Pro Subscription (ماہانہ)';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(JAZZCASH_ACCOUNT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim() || !senderNumber.trim()) return;

    onSubmitTransaction({
      userId: currentUser?.id || 'guest-' + Date.now(),
      userName: currentUser?.name || 'Pakistani Designer',
      userPhone: senderNumber.trim(),
      userEmail: currentUser?.email || 'user@example.com',
      planType: selectedPlan,
      amount: amount,
      jazzcashNumber: JAZZCASH_ACCOUNT_NUMBER,
      trxId: trxId.trim(),
      senderNumber: senderNumber.trim(),
      notes: `JazzCash transfer for ${planName}`
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <span className="text-amber-400 font-black font-outfit text-sm">JC</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 font-outfit flex items-center gap-1.5">
                <span>JazzCash Payment (جاز کیش)</span>
              </h2>
              <p className="text-xs text-amber-400 font-medium">
                {planName} — Rs {amount.toLocaleString()} PKR
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
        <div className="p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'ur' ? 'جاز کیش ٹرانزیکشن جمع ہو گئی!' : 'JazzCash Payment Received!'}
              </h3>
              <p className="text-xs text-stone-300 max-w-sm mx-auto leading-relaxed">
                {lang === 'ur'
                  ? `آپ کی ٹرانزیکشن آئی ڈی (${trxId}) موصول ہو گئی ہے۔ لائف ٹائم وی آئی پی فیچرز آپ کے اکاؤنٹ پر فعال کر دیے گئے ہیں۔`
                  : `Your Transaction ID (${trxId}) for Rs ${amount} has been verified and registered. Your account now has VIP access!`}
              </p>
              <div className="p-3 bg-stone-950/60 border border-emerald-900/40 rounded-xl text-xs text-emerald-300 font-mono">
                TID: {trxId} · Rs {amount} PKR · JazzCash
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-950/50"
              >
                {lang === 'ur' ? 'ڈیزائننگ شروع کریں' : 'Start Designing with VIP Access'}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Account Details Box */}
              <div className="p-4 bg-stone-950 border border-amber-600/30 rounded-xl space-y-3">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  {lang === 'ur' ? 'جاز کیش اکاؤنٹ کی تفصیلات' : 'JazzCash Account Details'}
                </span>

                <div className="flex items-center justify-between p-3 bg-stone-900 rounded-lg border border-stone-800">
                  <div>
                    <span className="text-[10px] text-stone-400 block">{lang === 'ur' ? 'جاز کیش نمبر:' : 'JazzCash Mobile Number:'}</span>
                    <span className="text-base font-bold text-white tracking-wider font-mono">
                      {JAZZCASH_ACCOUNT_NUMBER}
                    </span>
                  </div>

                  <button
                    onClick={handleCopyNumber}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-md text-xs font-semibold transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (lang === 'ur' ? 'کاپی ہو گیا' : 'Copied') : (lang === 'ur' ? 'کاپی کریں' : 'Copy')}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-300 px-1">
                  <span className="text-stone-400">{lang === 'ur' ? 'اکاؤنٹ کا نام:' : 'Account Title:'}</span>
                  <span className="font-semibold text-stone-100">{JAZZCASH_ACCOUNT_TITLE}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-300 px-1">
                  <span className="text-stone-400">{lang === 'ur' ? 'رقم:' : 'Amount to Send:'}</span>
                  <span className="font-bold text-emerald-400 text-sm">Rs {amount.toLocaleString()} PKR</span>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2 text-xs text-stone-300">
                <span className="font-bold text-stone-200 block">
                  {lang === 'ur' ? 'ادائیگی کا طریقہ کار:' : 'How to Pay via JazzCash:'}
                </span>
                <ol className="list-decimal list-inside space-y-1 text-stone-400 text-[11px] leading-relaxed">
                  <li>
                    {lang === 'ur'
                      ? `JazzCash ایپ کھولیں یا اپنے فون سے *786# ملائیں۔`
                      : `Open JazzCash App or dial *786# on your mobile phone.`}
                  </li>
                  <li>
                    {lang === 'ur'
                      ? `Send Money منتخب کریں اور نمبر درج کریں: ${JAZZCASH_ACCOUNT_NUMBER}`
                      : `Select Send Money and enter account: ${JAZZCASH_ACCOUNT_NUMBER}`}
                  </li>
                  <li>
                    {lang === 'ur'
                      ? `درست رقم (Rs ${amount}) بھیجیں اور 8558 سے ملنے والا Transaction ID (TID) نوٹ کریں۔`
                      : `Transfer Rs ${amount} and note the TID received in SMS from 8558.`}
                  </li>
                </ol>
              </div>

              {/* Form to submit TID */}
              <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 border-t border-stone-800">
                <div>
                  <label className="text-xs font-semibold text-stone-200 block mb-1">
                    {lang === 'ur' ? 'ٹرانزیکشن آئی ڈی (TID) درج کریں:' : 'Transaction ID (TID from SMS):'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JC982736190 or 8558 TID"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-200 block mb-1">
                    {lang === 'ur' ? 'بھیجنے والے کا جاز کیش نمبر:' : 'Your Sender Mobile Number:'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="03001234567"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold rounded-lg text-xs transition-all shadow-lg shadow-amber-950/50 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'تصدیق اور وی آئی پی ایکٹیویشن' : 'Submit & Activate VIP Access'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
