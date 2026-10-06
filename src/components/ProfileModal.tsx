import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Key, 
  Check, 
  Fingerprint, 
  Crown, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { User } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  onOpenPricing: () => void;
  lang: 'en' | 'ur';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  onOpenPricing,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  
  // Profile fields
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [city, setCity] = useState(user.city || 'Lahore');
  const [biometricEnabled, setBiometricEnabled] = useState(user.biometricEnabled ?? true);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      biometricEnabled
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword.trim()) {
      setPasswordError(lang === 'ur' ? 'موجودہ پاس ورڈ درج کریں۔' : 'Please enter current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(lang === 'ur' ? 'نیا پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے۔' : 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(lang === 'ur' ? 'پاس ورڈز مطابقت نہیں رکھتے۔' : 'Passwords do not match.');
      return;
    }

    setPasswordError('');
    setPasswordSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-emerald-200 font-bold flex items-center justify-center text-sm shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-100 font-outfit">{user.name}</h2>
                {user.plan === 'lifetime' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-600/50 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-amber-400" />
                    <span>Lifetime VIP</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 py-2 border-b border-stone-800 bg-stone-950/40 flex gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? 'پروفائل میں ترمیم' : 'Edit Profile'}</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'password'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? 'پاس ورڈ تبدیل کریں' : 'Change Password'}</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {/* TAB 1: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {profileSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'پروفائل کامیابی سے اپ ڈیٹ ہو گئی ہے!' : 'Profile updated successfully!'}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  {lang === 'ur' ? 'پورا نام:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  {lang === 'ur' ? 'ای میل:' : 'Email:'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    {lang === 'ur' ? 'فون نمبر / جاز کیش:' : 'JazzCash / Phone:'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    {lang === 'ur' ? 'شہر:' : 'City:'}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Biometric Security Setting */}
              <div className="pt-2 border-t border-stone-800">
                <div className="flex items-center justify-between p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                  <div className="flex items-center gap-2.5">
                    <Fingerprint className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold text-stone-200 block">
                        {lang === 'ur' ? 'بایومیٹرک سیکیورٹی لاگ ان' : 'Biometric Security Access'}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {lang === 'ur' ? 'فنگر پرنٹ اور فیس آئی ڈی فعال کریں' : 'Enable Touch ID / Face recognition'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={biometricEnabled}
                    onChange={(e) => setBiometricEnabled(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-emerald-950/50"
              >
                {lang === 'ur' ? 'پروفائل محفوظ کریں' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* TAB 2: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'پاس ورڈ کامیابی سے تبدیل ہو گیا ہے!' : 'Password changed successfully!'}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  {lang === 'ur' ? 'موجودہ پاس ورڈ:' : 'Current Password:'}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  {lang === 'ur' ? 'نیا پاس ورڈ:' : 'New Password:'}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  {lang === 'ur' ? 'نئے پاس ورڈ کی تصدیق:' : 'Confirm New Password:'}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-emerald-950/50"
              >
                {lang === 'ur' ? 'پاس ورڈ تبدیل کریں' : 'Update Password'}
              </button>
            </form>
          )}

          {/* Logout Action */}
          <div className="pt-4 mt-4 border-t border-stone-800 flex items-center justify-between">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'ur' ? 'اکاؤنٹ سے لاگ آؤٹ' : 'Sign Out'}</span>
            </button>

            {user.plan === 'free' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{lang === 'ur' ? 'لائف ٹائم وی آئی پی میں اپ گریڈ کریں' : 'Upgrade to Lifetime VIP'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
