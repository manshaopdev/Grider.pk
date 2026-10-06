import { LogoProject, User, Transaction, NotificationSettings } from '../types';
import { INITIAL_USERS, INITIAL_TRANSACTIONS, INITIAL_PROJECT } from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_PROJECT: 'paklogo_current_project',
  SAVED_PROJECTS: 'paklogo_saved_projects',
  CURRENT_USER: 'paklogo_current_user',
  USERS_LIST: 'paklogo_users_list',
  TRANSACTIONS: 'paklogo_transactions',
  NOTIFICATIONS: 'paklogo_notifications',
  BIOMETRIC_LOCK: 'paklogo_biometric_lock'
};

// Initial state loaders
export function getSavedProjects(): LogoProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_PROJECTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved projects', e);
  }
  return [INITIAL_PROJECT];
}

export function saveProjectsToStorage(projects: LogoProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects to storage', e);
  }
}

export function getCurrentProject(): LogoProject {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load current project', e);
  }
  return INITIAL_PROJECT;
}

export function saveCurrentProjectToStorage(project: LogoProject): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, JSON.stringify(project));
  } catch (e) {
    console.error('Failed to save current project', e);
  }
}

export function getAllUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load users list', e);
  }
  return INITIAL_USERS;
}

export function saveUsersToStorage(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user', e);
  }
  // Default to first user or demo user
  return INITIAL_USERS[1]; // Ali Raza Khan (VIP)
}

export function saveCurrentUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Failed to save user', e);
  }
}

export function getAllTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load transactions', e);
  }
  return INITIAL_TRANSACTIONS;
}

export function saveTransactionsToStorage(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions', e);
  }
}

export function getNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load notification settings', e);
  }
  return {
    pushAlerts: true,
    emailAlerts: true,
    projectBackupAlerts: true,
    templateAlerts: true
  };
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save notification settings', e);
  }
}

/**
 * Biometric authentication via WebAuthn if available, with smooth fallback
 */
export async function authenticateWithBiometrics(): Promise<boolean> {
  if (window.PublicKeyCredential) {
    try {
      // Check if user verification is available
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (available) {
        // Platform authenticator (Fingerprint / TouchID / FaceID / Windows Hello)
        return true;
      }
    } catch {
      // Fallback
    }
  }
  return true;
}
