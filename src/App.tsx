import React, { useState, useEffect, useCallback } from 'react';
import { 
  LogoProject, 
  LogoElement, 
  CanvasBackground, 
  User, 
  Transaction, 
  NotificationSettings 
} from './types';
import { 
  getCurrentProject, 
  saveCurrentProjectToStorage, 
  getSavedProjects, 
  saveProjectsToStorage,
  getCurrentUser, 
  saveCurrentUser,
  getAllUsers, 
  saveUsersToStorage,
  getAllTransactions, 
  saveTransactionsToStorage,
  getNotificationSettings, 
  saveNotificationSettings 
} from './utils/syncEngine';
import { PAKISTANI_TEMPLATES } from './data/templates';
import { Navbar } from './components/Navbar';
import { EditorToolbar } from './components/EditorToolbar';
import { EditorSidebar } from './components/EditorSidebar';
import { LogoCanvas } from './components/LogoCanvas';
import { BackgroundRemoverModal } from './components/BackgroundRemoverModal';
import { ExportModal } from './components/ExportModal';
import { TemplatesModal } from './components/TemplatesModal';
import { PricingModal } from './components/PricingModal';
import { JazzCashModal } from './components/JazzCashModal';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { BiometricPrompt } from './components/BiometricPrompt';
import { ProfileModal } from './components/ProfileModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';

export default function App() {
  // Main Project State
  const [project, setProject] = useState<LogoProject>(() => getCurrentProject());
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Undo / Redo History
  const [history, setHistory] = useState<LogoProject[]>([getCurrentProject()]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Online / Offline & Cloud Sync Status
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSynced, setIsSynced] = useState<boolean>(true);

  // User and Admin State
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => getAllUsers());
  const [transactions, setTransactions] = useState<Transaction[]>(() => getAllTransactions());
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => getNotificationSettings());

  // Language preference ('en' = English, 'ur' = Urdu)
  const [lang, setLang] = useState<'en' | 'ur'>('ur');

  // Modals Visibility
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isBgRemoverOpen, setIsBgRemoverOpen] = useState(false);
  const [bgRemoverInitialImage, setBgRemoverInitialImage] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isJazzCashOpen, setIsJazzCashOpen] = useState(false);
  const [selectedPlanForJazzCash, setSelectedPlanForJazzCash] = useState<'lifetime' | 'monthly'>('lifetime');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Online / Offline Listeners (PWA Offline readiness)
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast(lang === 'ur' ? 'انٹرنیٹ بحال: کلاؤڈ سنک فعال ہو گیا!' : 'Back Online: Cloud sync restored!');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast(lang === 'ur' ? 'آف لائن موڈ: پراجیکٹ لوکل میموری میں محفوظ ہو رہا ہے۔' : 'Offline Mode: Changes saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lang, showToast]);

  // Push history step and trigger autosave / cloud sync
  const recordHistory = useCallback((newProject: LogoProject) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newProject].slice(-25); // Keep up to 25 steps
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 24));

    // Save locally
    saveCurrentProjectToStorage(newProject);

    // Simulate real-time cloud sync
    setIsSynced(false);
    const syncTimer = setTimeout(() => {
      setIsSynced(true);
    }, 800);

    return () => clearTimeout(syncTimer);
  }, [historyIndex]);

  // Undo / Redo handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevProject = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setProject(prevProject);
      saveCurrentProjectToStorage(prevProject);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextProject = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setProject(nextProject);
      saveCurrentProjectToStorage(nextProject);
    }
  };

  // Canvas background update
  const handleBackgroundChange = (bg: CanvasBackground) => {
    const updated: LogoProject = {
      ...project,
      background: bg,
      updatedAt: new Date().toISOString()
    };
    setProject(updated);
    recordHistory(updated);
  };

  // Add Element to Canvas
  const handleAddElement = (elementData: Partial<LogoElement>) => {
    const newElement: LogoElement = {
      id: 'el-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name: elementData.name || 'Element',
      type: elementData.type || 'symbol',
      x: elementData.x ?? 300,
      y: elementData.y ?? 300,
      width: elementData.width ?? 200,
      height: elementData.height ?? 200,
      rotation: elementData.rotation ?? 0,
      opacity: elementData.opacity ?? 100,
      zIndex: project.elements.length + 1,
      locked: false,
      isVisible: true,
      fill: elementData.fill || '#FFFFFF',
      ...elementData
    };

    const updated: LogoProject = {
      ...project,
      elements: [...project.elements, newElement],
      updatedAt: new Date().toISOString()
    };

    setProject(updated);
    setSelectedElementId(newElement.id);
    recordHistory(updated);
  };

  // Update Element
  const handleUpdateElement = (id: string, updates: Partial<LogoElement>) => {
    setSelectedElementId(id);
    const updatedElements = project.elements.map((el) => {
      if (el.id === id) {
        return { ...el, ...updates };
      }
      return el;
    });

    const updated: LogoProject = {
      ...project,
      elements: updatedElements,
      updatedAt: new Date().toISOString()
    };

    setProject(updated);
    recordHistory(updated);
  };

  // Delete Element
  const handleDeleteElement = (id: string) => {
    const updatedElements = project.elements.filter((el) => el.id !== id);
    const updated: LogoProject = {
      ...project,
      elements: updatedElements,
      updatedAt: new Date().toISOString()
    };

    setProject(updated);
    if (selectedElementId === id) setSelectedElementId(null);
    recordHistory(updated);
  };

  // Duplicate Element
  const handleDuplicateElement = (id: string) => {
    const target = project.elements.find((el) => el.id === id);
    if (!target) return;

    const dup: LogoElement = {
      ...target,
      id: 'el-' + Date.now(),
      name: `${target.name} (Copy)`,
      x: target.x + 20,
      y: target.y + 20,
      zIndex: project.elements.length + 1
    };

    const updated: LogoProject = {
      ...project,
      elements: [...project.elements, dup],
      updatedAt: new Date().toISOString()
    };

    setProject(updated);
    setSelectedElementId(dup.id);
    recordHistory(updated);
  };

  // Bring Forward / Send Backward
  const handleBringForward = (id: string) => {
    const index = project.elements.findIndex((el) => el.id === id);
    if (index === -1) return;

    const newElements = [...project.elements];
    const target = newElements[index];
    target.zIndex += 2;

    const updated: LogoProject = {
      ...project,
      elements: newElements,
      updatedAt: new Date().toISOString()
    };
    setProject(updated);
    recordHistory(updated);
  };

  const handleSendBackward = (id: string) => {
    const index = project.elements.findIndex((el) => el.id === id);
    if (index === -1) return;

    const newElements = [...project.elements];
    const target = newElements[index];
    target.zIndex = Math.max(1, target.zIndex - 2);

    const updated: LogoProject = {
      ...project,
      elements: newElements,
      updatedAt: new Date().toISOString()
    };
    setProject(updated);
    recordHistory(updated);
  };

  // Create Fresh Blank Project
  const handleNewProject = () => {
    const newProj: LogoProject = {
      id: 'proj-' + Date.now(),
      title: lang === 'ur' ? 'نیا گریڈر لوگو' : 'New Grider Logo',
      canvasWidth: 800,
      canvasHeight: 800,
      background: {
        type: 'solid',
        color: '#01411C'
      },
      elements: [
        {
          id: 'default-star',
          type: 'symbol',
          name: 'Hilal-o-Sitara',
          x: 300,
          y: 240,
          width: 200,
          height: 200,
          rotation: 0,
          opacity: 100,
          zIndex: 1,
          locked: false,
          isVisible: true,
          fill: '#FFFFFF',
          svgPath: 'M50,15 A35,35 0 1,0 85,50 A28,28 0 1,1 50,15 Z M68,26 L72,37 L83,38 L75,46 L77,57 L68,52 L59,57 L61,46 L53,38 L64,37 Z',
          viewBox: '0 0 100 100'
        },
        {
          id: 'default-title',
          type: 'text',
          name: 'Logo Title',
          x: 200,
          y: 480,
          width: 400,
          height: 70,
          rotation: 0,
          opacity: 100,
          zIndex: 2,
          locked: false,
          isVisible: true,
          fill: '#FFFFFF',
          text: 'گریڈر پاکستان',
          fontFamily: 'font-nastaliq',
          fontSize: 48,
          fontWeight: '700',
          textAlign: 'center'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSynced: true
    };

    setProject(newProj);
    setSelectedElementId(null);
    setHistory([newProj]);
    setHistoryIndex(0);
    saveCurrentProjectToStorage(newProj);
    showToast(lang === 'ur' ? 'نیا کینوس تیار ہے!' : 'New logo canvas ready!');
  };

  // Load Pre-Designed Template
  const handleSelectTemplate = (tplProject: LogoProject) => {
    const loadedProj: LogoProject = {
      ...tplProject,
      id: 'proj-' + Date.now(),
      updatedAt: new Date().toISOString()
    };
    setProject(loadedProj);
    setSelectedElementId(null);
    setHistory([loadedProj]);
    setHistoryIndex(0);
    saveCurrentProjectToStorage(loadedProj);
    showToast(lang === 'ur' ? `ٹیمپلیٹ "${tplProject.title}" کینوس پر لوڈ ہو گیا!` : `Loaded ${tplProject.title}!`);
  };

  // Background Remover Insertion
  const handleApplyTransparentImage = (dataUrl: string) => {
    handleAddElement({
      type: 'image',
      name: 'Transparent Asset',
      imageUrl: dataUrl,
      width: 280,
      height: 280,
      x: project.canvasWidth / 2 - 140,
      y: project.canvasHeight / 2 - 140,
      fill: 'transparent'
    });
    showToast(lang === 'ur' ? 'شفاف تصویر کینوس میں شامل کر دی گئی!' : 'Transparent PNG added to canvas!');
  };

  const handleOpenBgRemoverWithImage = (dataUrl: string) => {
    setBgRemoverInitialImage(dataUrl);
    setIsBgRemoverOpen(true);
  };

  // Transactions & JazzCash Submission
  const handleSubmitTransaction = (trxData: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => {
    const newTrx: Transaction = {
      ...trxData,
      id: 'trx-' + Date.now(),
      status: 'approved', // Instant VIP activation for seamless UX, also reflected in Admin queue!
      timestamp: new Date().toISOString()
    };

    const updatedTrx = [newTrx, ...transactions];
    setTransactions(updatedTrx);
    saveTransactionsToStorage(updatedTrx);

    // Upgrade current user
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        plan: trxData.planType
      };
      setCurrentUser(updatedUser);
      saveCurrentUser(updatedUser);

      // Also update in all users list
      const updatedUsersList = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
      setUsers(updatedUsersList);
      saveUsersToStorage(updatedUsersList);
    }

    showToast(lang === 'ur' ? 'مبارک ہو! جاز کیش وی آئی پی پلان فعال ہو گیا ہے!' : 'VIP Lifetime Activated via JazzCash!');
  };

  // Selected element reference
  const selectedElement = project.elements.find((el) => el.id === selectedElementId) || null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-stone-950 text-stone-100 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 border border-emerald-500/80 text-emerald-300 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xl animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Navigation (Branded as Grider) */}
      <Navbar
        project={project}
        onUpdateTitle={(title) => {
          const updated = { ...project, title };
          setProject(updated);
          recordHistory(updated);
        }}
        onNewProject={handleNewProject}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenBgRemover={() => {
          setBgRemoverInitialImage(null);
          setIsBgRemoverOpen(true);
        }}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        isOnline={isOnline}
        isSynced={isSynced}
        lang={lang}
        onToggleLang={() => setLang(lang === 'ur' ? 'en' : 'ur')}
      />

      {/* Top Editor Toolbar (History, Background, Zoom, Grid) */}
      <EditorToolbar
        zoom={zoom}
        onZoomChange={setZoom}
        background={project.background}
        onBackgroundChange={handleBackgroundChange}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        lang={lang}
      />

      {/* Workspace Area: Left Customization Sidebar + Center Drag-and-Drop Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        <EditorSidebar
          project={project}
          selectedElement={selectedElement}
          onAddElement={handleAddElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onOpenBgRemoverWithImage={handleOpenBgRemoverWithImage}
          lang={lang}
        />

        <LogoCanvas
          project={project}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          zoom={zoom}
          showGrid={showGrid}
        />
      </div>

      {/* MODALS */}
      {/* 1. Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        lang={lang}
      />

      {/* 2. Background Remover Modal */}
      <BackgroundRemoverModal
        isOpen={isBgRemoverOpen}
        onClose={() => setIsBgRemoverOpen(false)}
        initialImageUrl={bgRemoverInitialImage}
        onApplyToCanvas={handleApplyTransparentImage}
        lang={lang}
      />

      {/* 3. Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
        currentUser={currentUser}
        onOpenPricing={() => {
          setIsExportOpen(false);
          setIsPricingOpen(true);
        }}
        lang={lang}
      />

      {/* 4. Pricing Modal (Rs 5,000 Lifetime vs Monthly) */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onSelectPlan={(plan) => {
          setSelectedPlanForJazzCash(plan);
          setIsPricingOpen(false);
          setIsJazzCashOpen(true);
        }}
        lang={lang}
      />

      {/* 5. JazzCash Direct Payment Modal (03262636289) */}
      <JazzCashModal
        isOpen={isJazzCashOpen}
        onClose={() => setIsJazzCashOpen(false)}
        selectedPlan={selectedPlanForJazzCash}
        currentUser={currentUser}
        onSubmitTransaction={handleSubmitTransaction}
        lang={lang}
      />

      {/* 6. Admin Panel (Password: mansha123123 & Income Tracker) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        users={users}
        onUpdateUsers={(updated) => {
          setUsers(updated);
          saveUsersToStorage(updated);
        }}
        transactions={transactions}
        onUpdateTransactions={(updated) => {
          setTransactions(updated);
          saveTransactionsToStorage(updated);
        }}
        lang={lang}
      />

      {/* 7. Auth Modal (Email verification & Biometric) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          saveCurrentUser(user);
          showToast(lang === 'ur' ? `خوش آمدید، ${user.name}!` : `Welcome, ${user.name}!`);
        }}
        onTriggerBiometric={() => setIsBiometricOpen(true)}
        lang={lang}
      />

      {/* 8. Biometric Scanner Prompt */}
      <BiometricPrompt
        isOpen={isBiometricOpen}
        onClose={() => setIsBiometricOpen(false)}
        onSuccess={() => {
          const user = users[0] || currentUser;
          if (user) {
            setCurrentUser(user);
            saveCurrentUser(user);
            showToast(lang === 'ur' ? 'بایومیٹرک تصدیق کامیاب!' : 'Biometric unlock successful!');
          }
        }}
        lang={lang}
      />

      {/* 9. Profile & Password Change Modal */}
      {currentUser && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={currentUser}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
            saveCurrentUser(updated);
            const updatedUsers = users.map((u) => (u.id === updated.id ? updated : u));
            setUsers(updatedUsers);
            saveUsersToStorage(updatedUsers);
            showToast(lang === 'ur' ? 'پروفائل محفوظ ہو گئی!' : 'Profile updated!');
          }}
          onLogout={() => {
            setCurrentUser(null);
            saveCurrentUser(null);
            showToast(lang === 'ur' ? 'آپ لاگ آؤٹ ہو چکے ہیں۔' : 'Signed out successfully.');
          }}
          onOpenPricing={() => setIsPricingOpen(true)}
          lang={lang}
        />
      )}

      {/* 10. Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        settings={notificationSettings}
        onUpdateSettings={(updated) => {
          setNotificationSettings(updated);
          saveNotificationSettings(updated);
          showToast(lang === 'ur' ? 'نوٹیفکیشن ترتیبات محفوظ ہو گئیں!' : 'Notification preferences saved!');
        }}
        lang={lang}
      />
    </div>
  );
}
