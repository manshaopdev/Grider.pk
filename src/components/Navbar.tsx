import React, { useState } from 'react';
import { 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Cloud, 
  CloudOff, 
  User as UserIcon, 
  FolderOpen, 
  Plus, 
  Lock, 
  Layers, 
  Sliders, 
  Crown,
  Bell,
  Settings,
  Globe
} from 'lucide-react';
import { User, LogoProject } from '../types';

interface NavbarProps {
  project: LogoProject;
  onUpdateTitle: (title: string) => void;
  onNewProject: () => void;
  onOpenTemplates: () => void;
  onOpenExport: () => void;
  onOpenBgRemover: () => void;
  onOpenPricing: () => void;
  onOpenAdmin: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  currentUser: User | null;
  isOnline: boolean;
  isSynced: boolean;
  lang: 'en' | 'ur';
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  project,
  onUpdateTitle,
  onNewProject,
  onOpenTemplates,
  onOpenExport,
  onOpenBgRemover,
  onOpenPricing,
  onOpenAdmin,
  onOpenProfile,
  onOpenNotifications,
  onOpenAuth,
  currentUser,
  isOnline,
  isSynced,
  lang,
  onToggleLang
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.title);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-16 bg-stone-900 border-b border-stone-800 px-4 flex items-center justify-between gap-3 select-none z-30">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            {/* Pakistan Crescent and Star SVG Mini */}
            <svg viewBox="0 0 100 100" className="w-6 h-6 text-white fill-current">
              <path d="M50,15 A35,35 0 1,0 85,50 A28,28 0 1,1 50,15 Z M68,26 L72,37 L83,38 L75,46 L77,57 L68,52 L59,57 L61,46 L53,38 L64,37 Z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-outfit font-black tracking-wide text-stone-100 text-lg">
                Grider<span className="text-emerald-400">.pk</span>
              </span>
              <span className="text-[10px] font-nastaliq text-emerald-400/90 hidden sm:inline">
                گریڈر پاکستان لوگو میکر
              </span>
            </div>
            
            {/* Sync & Offline Status */}
            <div className="flex items-center gap-2 text-xs text-stone-400">
              {isOnline ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <Cloud className="w-3 h-3" />
                  {isSynced ? (lang === 'ur' ? 'کلاؤڈ سنکڈ' : 'Cloud Synced') : (lang === 'ur' ? 'سنکنگ...' : 'Syncing...')}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-amber-400">
                  <CloudOff className="w-3 h-3" />
                  {lang === 'ur' ? 'آف لائن موڈ (محفوظ)' : 'Offline (Saved Locally)'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Project Name Editor */}
        <div className="h-6 w-px bg-stone-800 mx-1 hidden md:block" />

        <div className="hidden md:flex items-center">
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit}>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={() => {
                  if (titleInput.trim()) onUpdateTitle(titleInput.trim());
                  setIsEditingTitle(false);
                }}
                autoFocus
                className="bg-stone-800 border border-emerald-500 rounded px-2 py-0.5 text-xs text-stone-100 focus:outline-none w-48"
              />
            </form>
          ) : (
            <button
              onClick={() => {
                setTitleInput(project.title);
                setIsEditingTitle(true);
              }}
              title="Click to rename project"
              className="text-xs font-medium text-stone-300 hover:text-white px-2 py-1 rounded hover:bg-stone-800 transition-colors truncate max-w-[180px]"
            >
              {project.title}
            </button>
          )}
        </div>
      </div>

      {/* Center Actions: Templates, Background Remover */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onNewProject}
          title="Create New Logo"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">{lang === 'ur' ? 'نیا پراجیکٹ' : 'New'}</span>
        </button>

        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-200 bg-stone-800/90 hover:bg-stone-800 border border-stone-700/60 rounded-lg transition-all"
        >
          <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'ur' ? 'ٹیمپلیٹس' : 'Templates'}</span>
        </button>

        <button
          onClick={onOpenBgRemover}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/40 rounded-lg transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">{lang === 'ur' ? 'بیک گراؤنڈ ریموور' : 'BG Remover'}</span>
        </button>
      </div>

      {/* Right Controls: Plan, Export, Admin, Profile, Language */}
      <div className="flex items-center gap-2">
        {/* Language Switch */}
        <button
          onClick={onToggleLang}
          title="Toggle Urdu / English"
          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800/70 hover:bg-stone-800 rounded-lg border border-stone-700/50 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-stone-400" />
          <span>{lang === 'ur' ? 'EN' : 'اردو'}</span>
        </button>

        {/* Pricing / Lifetime VIP Button */}
        {currentUser?.plan === 'lifetime' ? (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-600/50 rounded-lg">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>VIP Lifetime</span>
          </div>
        ) : (
          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-md shadow-amber-950/40 transition-all transform hover:scale-[1.02]"
          >
            <Crown className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
            <span>{lang === 'ur' ? 'لائف ٹائم Rs 5000' : 'Lifetime Rs 5,000'}</span>
          </button>
        )}

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-950/40 transition-all transform hover:scale-[1.02]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{lang === 'ur' ? 'ایکسپورٹ' : 'Export HD'}</span>
        </button>

        {/* Admin Panel Quick Access */}
        <button
          onClick={onOpenAdmin}
          title="Admin Panel (Pass: mansha123123)"
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xl:inline">{lang === 'ur' ? 'ایڈمن' : 'Admin'}</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          title="Notification Settings"
          className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1 right-1" />
        </button>

        {/* User Profile */}
        {currentUser ? (
          <button
            onClick={onOpenProfile}
            title={currentUser.name}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-800 text-emerald-200 font-bold flex items-center justify-center text-[11px]">
              {currentUser.name.charAt(0)}
            </div>
            <span className="hidden md:inline max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? 'لاگ ان' : 'Sign In'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
