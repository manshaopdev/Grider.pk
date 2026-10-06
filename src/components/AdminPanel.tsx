import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Check, 
  XCircle, 
  Search, 
  UserPlus, 
  Download, 
  Lock, 
  Key, 
  AlertCircle,
  Clock,
  Sparkles,
  TrendingUp,
  CreditCard,
  Crown
} from 'lucide-react';
import { ADMIN_PASSWORD_HASH, JAZZCASH_ACCOUNT_NUMBER } from '../data/mockData';
import { User, Transaction } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  transactions: Transaction[];
  onUpdateTransactions: (transactions: Transaction[]) => void;
  lang: 'en' | 'ur';
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  users,
  onUpdateUsers,
  transactions,
  onUpdateTransactions,
  lang
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'income' | 'users' | 'add_user'>('income');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPlan, setNewUserPlan] = useState<'free' | 'monthly' | 'lifetime'>('lifetime');

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD_HASH) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError(lang === 'ur' ? 'غلط پاس ورڈ! برائے مہربانی درست پاس ورڈ درج کریں۔' : 'Incorrect password! Please try again.');
    }
  };

  // Income calculations
  const approvedTransactions = transactions.filter(t => t.status === 'approved');
  const totalIncome = approvedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const lifetimeCount = approvedTransactions.filter(t => t.planType === 'lifetime').length;
  const monthlyCount = approvedTransactions.filter(t => t.planType === 'monthly').length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  const handleApproveTransaction = (trxId: string) => {
    const updatedTrx = transactions.map(t => {
      if (t.id === trxId) {
        return { ...t, status: 'approved' as const };
      }
      return t;
    });
    onUpdateTransactions(updatedTrx);

    // Also upgrade the user
    const targetTrx = transactions.find(t => t.id === trxId);
    if (targetTrx) {
      const updatedUsers = users.map(u => {
        if (u.id === targetTrx.userId || u.phone === targetTrx.userPhone) {
          return { ...u, plan: targetTrx.planType };
        }
        return u;
      });
      onUpdateUsers(updatedUsers);
    }
  };

  const handleRejectTransaction = (trxId: string) => {
    const updated = transactions.map(t => {
      if (t.id === trxId) {
        return { ...t, status: 'rejected' as const };
      }
      return t;
    });
    onUpdateTransactions(updated);
  };

  const handleUserPlanChange = (userId: string, newPlan: 'free' | 'monthly' | 'lifetime') => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, plan: newPlan };
      }
      return u;
    });
    onUpdateUsers(updated);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm(lang === 'ur' ? 'کیا آپ اس صارف کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this user?')) {
      onUpdateUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleAddNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: User = {
      id: 'user-' + Date.now(),
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '03000000000',
      plan: newUserPlan,
      isEmailVerified: true,
      biometricEnabled: false,
      createdAt: new Date().toISOString()
    };

    onUpdateUsers([...users, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setActiveTab('users');
  };

  const handleDownloadCsv = () => {
    let csv = 'ID,Name,Email,Phone,Plan,Created\n';
    users.forEach(u => {
      csv += `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.plan}","${u.createdAt}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paklogo_users_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered users
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-5xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 font-outfit">
                {lang === 'ur' ? 'ایڈمن کنٹرول پینل و آمدنی ٹریکر' : 'Admin Management & Income Suite'}
              </h2>
              <p className="text-xs text-stone-400">
                {lang === 'ur' ? 'جاز کیش آمدنی، لائف ٹائم پلانز اور صارفین کا مکمل انتظام' : 'Track JazzCash revenue, lifetime sales, and user accounts'}
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
        {!isAuthenticated ? (
          /* Password Authentication Gate */
          <div className="p-8 flex flex-col items-center justify-center min-h-[380px] max-w-md mx-auto text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-emerald-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-outfit">
                {lang === 'ur' ? 'ایڈمن پاس ورڈ درج کریں' : 'Admin Security Verification'}
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {lang === 'ur'
                  ? 'اس پینل تک رسائی کے لیے مقرر کردہ ایڈمن پاس ورڈ درج کریں۔'
                  : 'Enter the master password to access the financial and user dashboard.'}
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="w-full space-y-3">
              <div className="relative">
                <input
                  type="password"
                  placeholder={lang === 'ur' ? 'ایڈمن پاس ورڈ لکھیں...' : 'Enter admin password...'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500 text-center tracking-widest font-mono"
                />
              </div>

              {authError && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-950/50"
              >
                {lang === 'ur' ? 'لاگ ان کریں' : 'Unlock Admin Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* Main Authenticated Admin Area */
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Top Navigation Tabs */}
            <div className="px-6 py-3 border-b border-stone-800 bg-stone-950/40 flex items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('income')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'income'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{lang === 'ur' ? 'آمدنی ڈیش بورڈ' : 'Income Dashboard'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'users'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{lang === 'ur' ? 'صارفین کا کنٹرول' : 'User Management'}</span>
                  <span className="ml-1 px-1.5 py-0.2 bg-stone-900/60 rounded text-[10px]">{users.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('add_user')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'add_user'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{lang === 'ur' ? 'نیا صارف شامل کریں' : 'Add User'}</span>
                </button>
              </div>

              <button
                onClick={handleDownloadCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium border border-stone-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'ur' ? 'رپورٹ (CSV)' : 'Export CSV'}</span>
              </button>
            </div>

            {/* TAB 1: INCOME DASHBOARD */}
            {activeTab === 'income' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Income */}
                  <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-400 block font-medium">
                        {lang === 'ur' ? 'کل آمدنی (جاز کیش)' : 'Total Gross Income'}
                      </span>
                      <span className="text-2xl font-black text-emerald-400 font-outfit mt-1 block">
                        Rs {totalIncome.toLocaleString()} <span className="text-xs text-stone-400 font-normal">PKR</span>
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Lifetime Purchases */}
                  <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-400 block font-medium">
                        {lang === 'ur' ? 'لائف ٹائم وی آئی پی (5000)' : 'Lifetime VIP Purchases'}
                      </span>
                      <span className="text-2xl font-black text-amber-400 font-outfit mt-1 block">
                        {lifetimeCount} <span className="text-xs text-stone-400 font-normal">Sales (Rs {(lifetimeCount * 5000).toLocaleString()})</span>
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Crown className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Monthly Subscriptions */}
                  <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-400 block font-medium">
                        {lang === 'ur' ? 'ماہانہ سبسکرپشنز (1200)' : 'Monthly Subscriptions'}
                      </span>
                      <span className="text-2xl font-black text-blue-400 font-outfit mt-1 block">
                        {monthlyCount} <span className="text-xs text-stone-400 font-normal">Active (Rs {(monthlyCount * 1200).toLocaleString()})</span>
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Pending Transactions */}
                  <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-400 block font-medium">
                        {lang === 'ur' ? 'زیر التواء ادائیگیاں' : 'Pending Approvals'}
                      </span>
                      <span className="text-2xl font-black text-rose-400 font-outfit mt-1 block">
                        {pendingCount} <span className="text-xs text-stone-400 font-normal">Awaiting Review</span>
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                      <span>{lang === 'ur' ? 'جاز کیش ٹرانزیکشنز کی فہرست' : 'JazzCash Payment Transactions'}</span>
                      <span className="text-xs font-normal text-stone-400">({JAZZCASH_ACCOUNT_NUMBER})</span>
                    </h3>
                  </div>

                  <div className="border border-stone-800 rounded-xl overflow-hidden bg-stone-950/60">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-900 border-b border-stone-800 text-stone-400 font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">TID</th>
                          <th className="py-2.5 px-3">{lang === 'ur' ? 'صارف' : 'User'}</th>
                          <th className="py-2.5 px-3">{lang === 'ur' ? 'فون نمبر' : 'Sender Phone'}</th>
                          <th className="py-2.5 px-3">{lang === 'ur' ? 'پلان' : 'Plan'}</th>
                          <th className="py-2.5 px-3">{lang === 'ur' ? 'رقم' : 'Amount'}</th>
                          <th className="py-2.5 px-3">{lang === 'ur' ? 'حیثیت' : 'Status'}</th>
                          <th className="py-2.5 px-3 text-right">{lang === 'ur' ? 'ایکشن' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/60 text-stone-300">
                        {transactions.map((trx) => (
                          <tr key={trx.id} className="hover:bg-stone-900/50 transition-colors">
                            <td className="py-3 px-3 font-mono font-medium text-emerald-400">
                              {trx.trxId}
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-stone-200">{trx.userName}</div>
                              <div className="text-[10px] text-stone-500">{trx.userEmail}</div>
                            </td>
                            <td className="py-3 px-3 font-mono text-stone-300">
                              {trx.senderNumber}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                trx.planType === 'lifetime' ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40' : 'bg-blue-950/60 text-blue-400 border border-blue-800/40'
                              }`}>
                                {trx.planType}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-stone-100">
                              Rs {trx.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                                trx.status === 'approved' ? 'text-emerald-400' : trx.status === 'pending' ? 'text-amber-400' : 'text-rose-400'
                              }`}>
                                {trx.status === 'approved' && <Check className="w-3 h-3" />}
                                {trx.status === 'pending' && <Clock className="w-3 h-3" />}
                                {trx.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                <span className="capitalize">{trx.status}</span>
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {trx.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleApproveTransaction(trx.id)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold transition-colors"
                                  >
                                    {lang === 'ur' ? 'منظور' : 'Approve'}
                                  </button>
                                  <button
                                    onClick={() => handleRejectTransaction(trx.id)}
                                    className="px-2.5 py-1 bg-stone-800 hover:bg-rose-900/60 text-stone-300 hover:text-rose-300 rounded text-[11px] font-bold transition-colors"
                                  >
                                    {lang === 'ur' ? 'رد' : 'Reject'}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-stone-500 italic">
                                  {lang === 'ur' ? 'مکمل' : 'Processed'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: USER MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Search Bar */}
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={lang === 'ur' ? 'نام، ای میل یا فون نمبر تلاش کریں...' : 'Search users by name, email, phone...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <span className="text-xs text-stone-400 font-mono">
                    {filteredUsers.length} {lang === 'ur' ? 'صارفین' : 'Registered Users'}
                  </span>
                </div>

                {/* Users Table */}
                <div className="border border-stone-800 rounded-xl overflow-hidden bg-stone-950/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900 border-b border-stone-800 text-stone-400 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">{lang === 'ur' ? 'نام و ای میل' : 'User Name & Email'}</th>
                        <th className="py-2.5 px-3">{lang === 'ur' ? 'فون نمبر' : 'Phone'}</th>
                        <th className="py-2.5 px-3">{lang === 'ur' ? 'شہر' : 'City'}</th>
                        <th className="py-2.5 px-3">{lang === 'ur' ? 'فعال پلان' : 'Plan'}</th>
                        <th className="py-2.5 px-3">{lang === 'ur' ? 'بایومیٹرک' : 'Biometric'}</th>
                        <th className="py-2.5 px-3 text-right">{lang === 'ur' ? 'کنٹرول' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60 text-stone-300">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-stone-900/50 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-stone-200 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {u.isAdmin && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 text-[9px] uppercase font-bold">
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-stone-500">{u.email}</div>
                          </td>
                          <td className="py-3 px-3 font-mono text-stone-300">{u.phone}</td>
                          <td className="py-3 px-3 text-stone-400">{u.city || 'Pakistan'}</td>
                          <td className="py-3 px-3">
                            <select
                              value={u.plan}
                              onChange={(e) => handleUserPlanChange(u.id, e.target.value as any)}
                              className="bg-stone-800 border border-stone-700 rounded px-2 py-1 text-[11px] text-stone-200 focus:outline-none"
                            >
                              <option value="free">Free</option>
                              <option value="monthly">Monthly Pro</option>
                              <option value="lifetime">Lifetime VIP</option>
                            </select>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`text-[11px] font-medium ${u.biometricEnabled ? 'text-emerald-400' : 'text-stone-500'}`}>
                              {u.biometricEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {!u.isAdmin && (
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-stone-500 hover:text-rose-400 p-1 rounded"
                                title="Delete user"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: ADD USER MANUALLY */}
            {activeTab === 'add_user' && (
              <div className="flex-1 overflow-y-auto p-6 max-w-lg mx-auto w-full">
                <form onSubmit={handleAddNewUser} className="space-y-4 bg-stone-950/60 p-6 rounded-2xl border border-stone-800">
                  <h3 className="text-sm font-bold text-white mb-2">
                    {lang === 'ur' ? 'نیا صارف دستی طور پر شامل کریں' : 'Add New User Account'}
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      {lang === 'ur' ? 'صارف کا پورا نام:' : 'Full Name:'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asad Qureshi"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      {lang === 'ur' ? 'ای میل ایڈریس:' : 'Email Address:'}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="asad@example.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      {lang === 'ur' ? 'جاز کیش / موبائل نمبر:' : 'JazzCash / Phone Number:'}
                    </label>
                    <input
                      type="tel"
                      placeholder="03001234567"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      {lang === 'ur' ? 'پلان تفویض کریں:' : 'Assign Plan:'}
                    </label>
                    <select
                      value={newUserPlan}
                      onChange={(e) => setNewUserPlan(e.target.value as any)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none"
                    >
                      <option value="lifetime">Lifetime VIP (Rs 5,000)</option>
                      <option value="monthly">Monthly Pro (Rs 1,200)</option>
                      <option value="free">Free Standard</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-md shadow-emerald-950/50"
                  >
                    {lang === 'ur' ? 'صارف اکاؤنٹ بنائیں' : 'Create User Account'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
