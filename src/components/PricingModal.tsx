import React from 'react';
import { 
  X, 
  Check, 
  Crown, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Layers,
  Infinity
} from 'lucide-react';
import { JAZZCASH_ACCOUNT_NUMBER } from '../data/mockData';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: 'lifetime' | 'monthly') => void;
  lang: 'en' | 'ur';
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  lang
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg">
              <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-100 font-outfit">
                {lang === 'ur' ? 'لائف ٹائم اور ماہانہ وی آئی پی پلانز' : 'Choose Your VIP Plan'}
              </h2>
              <p className="text-xs text-stone-400">
                {lang === 'ur' 
                  ? 'سبسکرپشن کے جھنجھٹ کے بغیر ایک بار 5,000 ادا کریں اور ہمیشہ کے لیے استعمال کریں' 
                  : 'Pay once for lifetime VIP access or choose flexible monthly billing'}
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

        {/* Plan Cards Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          {/* Card 1: ONE-TIME LIFETIME VIP (Highlighted) */}
          <div className="relative rounded-2xl bg-gradient-to-b from-stone-800 to-stone-900 border-2 border-amber-500/80 p-6 flex flex-col justify-between shadow-xl shadow-amber-950/30">
            {/* Best Value Badge */}
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full shadow-md">
              {lang === 'ur' ? 'بہترین انتخاب (ایک بار ادائیگی)' : '★ Best Value — One-Time Only'}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Infinity className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {lang === 'ur' ? 'لائف ٹائم وی آئی پی (VIP)' : 'Lifetime VIP Pass'}
                </h3>
              </div>
              <p className="text-xs text-stone-400 mb-4">
                {lang === 'ur' ? 'کوئی بار بار کی فیس نہیں! مکمل زندگی کا پیکیج۔' : 'No recurring monthly charges. Pay once, own forever.'}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-white font-outfit">Rs 5,000</span>
                <span className="text-xs text-amber-400 font-semibold uppercase">
                  {lang === 'ur' ? 'ایک بار (PKR)' : 'PKR (One-Time)'}
                </span>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 text-xs text-stone-300">
                {[
                  lang === 'ur' ? 'لامحدود 4K الٹرا ایچ ڈی اور ویکٹر SVG ایکسپورٹ' : 'Unlimited 4K Ultra HD & Vector SVG Exports',
                  lang === 'ur' ? 'مکمل بیک گراؤنڈ ریموور ٹول (لامحدود تصاویر)' : 'Full Background Remover Tool (Magic Wand & Brush)',
                  lang === 'ur' ? 'تمام پاکستانی مونوگرامز، ٹرک آرٹ اور خطاطی' : 'All Pakistani Emblems, Truck Art & Calligraphy',
                  lang === 'ur' ? 'ریئل ٹائم کلاؤڈ سنک اور 100٪ آف لائن رسائی' : 'Real-time Cloud Sync & Offline PWA Access',
                  lang === 'ur' ? 'بایومیٹرک فنگر پرنٹ لاگ ان سیکورٹی' : 'Biometric Fingerprint & Face Security',
                  lang === 'ur' ? `جاز کیش (${JAZZCASH_ACCOUNT_NUMBER}) فوری ادائیگی` : `Instant JazzCash to ${JAZZCASH_ACCOUNT_NUMBER}`
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onSelectPlan('lifetime')}
              className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
            >
              <Crown className="w-4 h-4 fill-stone-950" />
              <span>{lang === 'ur' ? 'جاز کیش سے 5000 ادا کریں' : 'Buy Lifetime Pass (Rs 5,000)'}</span>
            </button>
          </div>

          {/* Card 2: MONTHLY PRO SUBSCRIPTION */}
          <div className="rounded-2xl bg-stone-800/60 border border-stone-700/70 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  {lang === 'ur' ? 'ماہانہ سبسکرپشن' : 'Monthly Pro Plan'}
                </h3>
              </div>
              <p className="text-xs text-stone-400 mb-4">
                {lang === 'ur' ? 'ماہانہ بنیاد پر استعمال کریں اور کسی بھی وقت کینسل کریں۔' : 'Flexible monthly renewal for short-term projects.'}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-white font-outfit">Rs 1,200</span>
                <span className="text-xs text-stone-400 font-semibold uppercase">
                  {lang === 'ur' ? 'فی مہینہ' : '/ Month'}
                </span>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 text-xs text-stone-300">
                {[
                  lang === 'ur' ? '2K اور فل ایچ ڈی ایکسپورٹ' : '2K HD Logo Exports',
                  lang === 'ur' ? 'بیک گراؤنڈ ریموور ٹول کی بنیادی سہولت' : 'Standard Background Remover Tool',
                  lang === 'ur' ? 'بنیادی ٹیمپلیٹس اور نشانات' : 'Standard Templates & Symbols',
                  lang === 'ur' ? 'کلاؤڈ سنک اور آف لائن رسائی' : 'Cloud Sync & Offline Access',
                  lang === 'ur' ? 'ماہانہ جاز کیش ادائیگی' : 'Monthly JazzCash Payment'
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onSelectPlan('monthly')}
              className="mt-6 w-full py-3 bg-stone-700 hover:bg-stone-600 text-stone-100 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <span>{lang === 'ur' ? 'ماہانہ پلان منتخب کریں (1200)' : 'Select Monthly Plan (Rs 1,200)'}</span>
            </button>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="px-6 py-3.5 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ur' ? `ادائیگی کا جاز کیش اکاؤنٹ: ${JAZZCASH_ACCOUNT_NUMBER}` : `JazzCash Direct Till/Number: ${JAZZCASH_ACCOUNT_NUMBER}`}</span>
          </span>
          <span className="text-emerald-400 font-medium">
            {lang === 'ur' ? '100٪ محفوظ پاکستانی گیٹ وے' : '100% Secure & Instant Activation'}
          </span>
        </div>
      </div>
    </div>
  );
};
