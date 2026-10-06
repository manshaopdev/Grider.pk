import React, { useState } from 'react';
import { X, Bell, Check, ShieldCheck, Smartphone, Mail, Cloud, Sparkles } from 'lucide-react';
import { NotificationSettings } from '../types';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
  lang: 'en' | 'ur';
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  lang
}) => {
  const [pushAlerts, setPushAlerts] = useState(settings.pushAlerts);
  const [emailAlerts, setEmailAlerts] = useState(settings.emailAlerts);
  const [backupAlerts, setBackupAlerts] = useState(settings.projectBackupAlerts);
  const [templateAlerts, setTemplateAlerts] = useState(settings.templateAlerts);
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleTogglePush = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setPushAlerts(checked);

    if (checked && 'Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch (err) {
        console.warn('Notification permission error', err);
      }
    }
  };

  const handleSave = () => {
    onUpdateSettings({
      pushAlerts,
      emailAlerts,
      projectBackupAlerts: backupAlerts,
      templateAlerts
    });
    onClose();
  };

  const handleSendTestAlert = () => {
    setTestSent(true);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Grider Logo Studio', {
        body: lang === 'ur' ? 'آپ کے تمام لوگو پراجیکٹس کلاؤڈ اور آف لائن پر محفوظ ہیں۔' : 'Your Pakistan logo designs are synced & protected offline!',
        icon: '/favicon.ico'
      });
    }
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 font-outfit">
                {lang === 'ur' ? 'نوٹیفکیشن اور پش الرٹس' : 'Notification & Push Alerts'}
              </h2>
              <p className="text-xs text-stone-400">
                {lang === 'ur' ? 'پش الرٹس، کلاؤڈ بیک اپ اور جاز کیش کی اطلاعات' : 'Configure push alerts and cloud sync notifications'}
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
        <div className="p-6 space-y-4">
          {/* Push Alerts Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-stone-950/60 rounded-xl border border-stone-800">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-stone-200 block">
                  {lang === 'ur' ? 'موبائل اور ڈیسک ٹاپ پش الرٹس' : 'Push Alerts & Instant Notifications'}
                </span>
                <span className="text-[11px] text-stone-400">
                  {lang === 'ur' ? 'بروزر میں براہ راست پاپ اپ الرٹ موصول کریں' : 'Receive instant alerts on project save & exports'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={pushAlerts}
              onChange={handleTogglePush}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Email Alerts Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-stone-950/60 rounded-xl border border-stone-800">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-stone-200 block">
                  {lang === 'ur' ? 'ای میل نوٹیفکیشنز' : 'Email Receipts & Summaries'}
                </span>
                <span className="text-[11px] text-stone-400">
                  {lang === 'ur' ? 'جاز کیش کی رسیدیں اور تصدیقی کوڈز' : 'JazzCash payment receipts & verification codes'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Project Backup Alerts */}
          <div className="flex items-center justify-between p-3.5 bg-stone-950/60 rounded-xl border border-stone-800">
            <div className="flex items-center gap-3">
              <Cloud className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-stone-200 block">
                  {lang === 'ur' ? 'کلاؤڈ سنک اور بیک اپ الرٹ' : 'Cloud Sync & Offline Backup Status'}
                </span>
                <span className="text-[11px] text-stone-400">
                  {lang === 'ur' ? 'آف لائن اور آن لائن ڈیٹا محفوظ ہونے کی اطلاع' : 'Notify when projects are synchronized across devices'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={backupAlerts}
              onChange={(e) => setBackupAlerts(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Test Push Button */}
          <div className="pt-2">
            <button
              onClick={handleSendTestAlert}
              className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-700"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {testSent 
                  ? (lang === 'ur' ? 'الرٹ ارسال ہو گیا!' : 'Test Alert Triggered!') 
                  : (lang === 'ur' ? 'ٹیسٹ پش الرٹ بھیجیں' : 'Send Test Push Alert')}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/70 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white"
          >
            {lang === 'ur' ? 'منسوخ' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-md shadow-emerald-950/50"
          >
            {lang === 'ur' ? 'ترتیبات محفوظ کریں' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
