export type ElementType = 'symbol' | 'text' | 'shape' | 'badge' | 'calligraphy' | 'image';

export interface LogoElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  isVisible: boolean;
  
  // Style properties
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;

  // Text specific
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;

  // Symbol / Shape specific
  svgPath?: string;
  viewBox?: string;
  iconName?: string;

  // Image specific
  imageUrl?: string;

  // Filter properties
  brightness?: number; // 0 to 200 (100 normal)
  contrast?: number;   // 0 to 200 (100 normal)
  saturation?: number; // 0 to 200 (100 normal)
  hueRotate?: number;  // 0 to 360
  sepia?: number;      // 0 to 100
  grayscale?: number;  // 0 to 100
  invert?: number;     // 0 to 100
  blur?: number;       // 0 to 20 px
}

export interface CanvasBackground {
  type: 'transparent' | 'solid' | 'gradient';
  color: string;
  gradient?: {
    type: 'linear' | 'radial';
    colors: [string, string];
    angle: number;
  };
}

export interface LogoProject {
  id: string;
  title: string;
  category?: string;
  canvasWidth: number;
  canvasHeight: number;
  background: CanvasBackground;
  elements: LogoElement[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  isSynced: boolean;
}

export type PlanType = 'free' | 'monthly' | 'lifetime';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  city?: string;
  plan: PlanType;
  planExpiryDate?: string;
  isEmailVerified: boolean;
  biometricEnabled: boolean;
  createdAt: string;
  isAdmin?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  planType: 'lifetime' | 'monthly';
  amount: number;
  jazzcashNumber: string;
  trxId: string;
  senderNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  notes?: string;
}

export interface NotificationSettings {
  pushAlerts: boolean;
  emailAlerts: boolean;
  projectBackupAlerts: boolean;
  templateAlerts: boolean;
}
