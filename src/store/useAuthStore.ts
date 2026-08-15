import { create } from 'zustand';
import { User, UserRole } from '../types';
import { sendVerificationEmail } from '../services/resendService';

export type AuthMode = 'login' | 'signup' | 'verify';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  isAuthModalOpen: boolean;
  authMode: AuthMode;
  pendingUser: { name: string; email: string; phone: string; role: UserRole; password?: string } | null;
  pendingVerificationCode: string | null;
  resendApiNotice: string | null;
  isSendingResend: boolean;
  resendCountdown: number;

  // Modal controls
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: AuthMode) => void;
  setActiveRole: (role: UserRole) => void;

  // Actions
  login: (name: string, emailOrPhone: string, password?: string) => boolean;
  startSignup: (name: string, email: string, phone: string, role: UserRole, password?: string) => Promise<{ success: boolean; message: string; notice?: string }>;
  resendVerificationCode: () => Promise<boolean>;
  verifyEmailCode: (code: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  activeRole: 'buyer',
  isAuthModalOpen: false,
  authMode: 'login',
  pendingUser: null,
  pendingVerificationCode: null,
  resendApiNotice: null,
  isSendingResend: false,
  resendCountdown: 0,

  openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthMode: (mode: AuthMode) => set({ authMode: mode }),
  setActiveRole: (role: UserRole) => set({ activeRole: role }),

  login: (name, emailOrPhone) => {
    const isEmail = emailOrPhone.includes('@');
    const user: User = {
      id: `user-${Date.now()}`,
      name: name.trim() || (isEmail ? emailOrPhone.split('@')[0] : 'Nexora User'),
      email: isEmail ? emailOrPhone.trim() : 'user@nexora.rw',
      phone: isEmail ? '+250 788 000 000' : emailOrPhone.trim(),
      role: 'buyer',
      locale: 'rw',
      verified_at: new Date().toISOString(),
    };
    set({ currentUser: user, isAuthenticated: true, isAuthModalOpen: false });
    return true;
  },

  startSignup: async (name, email, phone, role, password) => {
    set({ isSendingResend: true });
    
    // Call Resend API service to send 6-digit email code
    const res = await sendVerificationEmail(email, name);

    set({
      isSendingResend: false,
      pendingUser: { name, email, phone, role, password },
      pendingVerificationCode: res.code,
      resendApiNotice: res.apiDetails || null,
      authMode: 'verify',
      resendCountdown: 60,
    });

    // Start 60s resend timer
    const interval = setInterval(() => {
      const { resendCountdown } = get();
      if (resendCountdown <= 1) {
        clearInterval(interval);
        set({ resendCountdown: 0 });
      } else {
        set({ resendCountdown: resendCountdown - 1 });
      }
    }, 1000);

    return { success: true, message: res.message, notice: res.apiDetails };
  },

  resendVerificationCode: async () => {
    const { pendingUser } = get();
    if (!pendingUser) return false;
    
    set({ isSendingResend: true });
    const res = await sendVerificationEmail(pendingUser.email, pendingUser.name);
    set({
      isSendingResend: false,
      pendingVerificationCode: res.code,
      resendApiNotice: res.apiDetails || null,
      resendCountdown: 60,
    });
    return true;
  },

  verifyEmailCode: (enteredCode: string) => {
    const { pendingVerificationCode, pendingUser } = get();
    
    // Accept the exact verification code that was dispatched
    if (enteredCode === pendingVerificationCode) {
      if (pendingUser) {
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: pendingUser.name,
          email: pendingUser.email,
          phone: pendingUser.phone,
          role: pendingUser.role,
          locale: 'rw',
          verified_at: new Date().toISOString(),
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        };
        set({
          currentUser: newUser,
          isAuthenticated: true,
          activeRole: pendingUser.role,
          isAuthModalOpen: false,
          pendingUser: null,
          pendingVerificationCode: null,
          resendApiNotice: null,
        });
      }
      return true;
    }
    return false;
  },

  logout: () => set({ currentUser: null, isAuthenticated: false }),
}));
