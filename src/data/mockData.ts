import { User, Transaction, LogoProject } from '../types';
import { PAKISTANI_TEMPLATES } from './templates';

export const ADMIN_PASSWORD_HASH = 'mansha123123';
export const JAZZCASH_ACCOUNT_NUMBER = '03262636289';
export const JAZZCASH_ACCOUNT_TITLE = 'Mansha / PakLogo Studio';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Muhammad Mansha (Admin)',
    email: 'admin@paklogo.pk',
    phone: '03262636289',
    city: 'Lahore',
    plan: 'lifetime',
    isEmailVerified: true,
    biometricEnabled: true,
    createdAt: '2026-01-10T10:00:00Z',
    isAdmin: true
  },
  {
    id: 'user-1',
    name: 'Ali Raza Khan',
    email: 'aliraza.designer@gmail.com',
    phone: '03001234567',
    city: 'Karachi',
    plan: 'lifetime',
    isEmailVerified: true,
    biometricEnabled: true,
    createdAt: '2026-02-15T14:30:00Z'
  },
  {
    id: 'user-2',
    name: 'Fatima Noor',
    email: 'fatima.noor.fashion@yahoo.com',
    phone: '03217654321',
    city: 'Lahore',
    plan: 'monthly',
    planExpiryDate: '2026-11-06T00:00:00Z',
    isEmailVerified: true,
    biometricEnabled: false,
    createdAt: '2026-03-01T09:15:00Z'
  },
  {
    id: 'user-3',
    name: 'Hamza Tariq',
    email: 'hamza.cricket@outlook.com',
    phone: '03339876543',
    city: 'Islamabad',
    plan: 'lifetime',
    isEmailVerified: true,
    biometricEnabled: true,
    createdAt: '2026-03-12T16:45:00Z'
  },
  {
    id: 'user-4',
    name: 'Zeeshan Butt',
    email: 'zeeshan.dhaba@gmail.com',
    phone: '03124567890',
    city: 'Rawalpindi',
    plan: 'free',
    isEmailVerified: true,
    biometricEnabled: false,
    createdAt: '2026-03-20T11:20:00Z'
  },
  {
    id: 'user-5',
    name: 'Ayesha Siddiqui',
    email: 'ayesha.crafts@gmail.com',
    phone: '03451122334',
    city: 'Peshawar',
    plan: 'lifetime',
    isEmailVerified: true,
    biometricEnabled: true,
    createdAt: '2026-03-28T18:10:00Z'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'trx-101',
    userId: 'user-1',
    userName: 'Ali Raza Khan',
    userPhone: '03001234567',
    userEmail: 'aliraza.designer@gmail.com',
    planType: 'lifetime',
    amount: 5000,
    jazzcashNumber: '03262636289',
    trxId: 'JC948102941',
    senderNumber: '03001234567',
    status: 'approved',
    timestamp: '2026-02-15T14:28:00Z',
    notes: 'JazzCash App transfer verified'
  },
  {
    id: 'trx-102',
    userId: 'user-2',
    userName: 'Fatima Noor',
    userPhone: '03217654321',
    userEmail: 'fatima.noor.fashion@yahoo.com',
    planType: 'monthly',
    amount: 1200,
    jazzcashNumber: '03262636289',
    trxId: 'JC882194820',
    senderNumber: '03217654321',
    status: 'approved',
    timestamp: '2026-03-01T09:12:00Z',
    notes: 'Monthly renewal via JazzCash'
  },
  {
    id: 'trx-103',
    userId: 'user-3',
    userName: 'Hamza Tariq',
    userPhone: '03339876543',
    userEmail: 'hamza.cricket@outlook.com',
    planType: 'lifetime',
    amount: 5000,
    jazzcashNumber: '03262636289',
    trxId: 'JC712958210',
    senderNumber: '03339876543',
    status: 'approved',
    timestamp: '2026-03-12T16:40:00Z',
    notes: 'Lifetime VIP access approved'
  },
  {
    id: 'trx-104',
    userId: 'user-5',
    userName: 'Ayesha Siddiqui',
    userPhone: '03451122334',
    userEmail: 'ayesha.crafts@gmail.com',
    planType: 'lifetime',
    amount: 5000,
    jazzcashNumber: '03262636289',
    trxId: 'JC610928471',
    senderNumber: '03451122334',
    status: 'approved',
    timestamp: '2026-03-28T18:05:00Z',
    notes: 'JazzCash till transfer approved'
  },
  {
    id: 'trx-105',
    userId: 'user-guest-pending',
    userName: 'Bilal Ahmad (Pending)',
    userPhone: '03089988776',
    userEmail: 'bilal.ahmad@gmail.com',
    planType: 'lifetime',
    amount: 5000,
    jazzcashNumber: '03262636289',
    trxId: 'JC441920847',
    senderNumber: '03089988776',
    status: 'pending',
    timestamp: '2026-10-06T04:20:00Z',
    notes: 'Awaiting admin TID approval'
  }
];

export const INITIAL_PROJECT: LogoProject = PAKISTANI_TEMPLATES[0].project;
