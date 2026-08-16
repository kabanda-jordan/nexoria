import { create } from 'zustand';
import { User, UserRole } from '../types';
import { api, AuthUser } from '../services/api';

export type AuthMode = 'login' | 'signup' | 'verify';

const TOKEN_KEY = 'nexora_token';
const USER_KEY = 'nexora_user';

const toUser = (u: AuthUser): User => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  locale: u.locale as User['locale'],
  verified_at: u.verified_at,
  avatar_url: u.avatar_url,
});

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  isAuthModalOpen: boolean;
  authMode: AuthMode;
  pendingUser: { name: string; email: string; phone: string; role: UserRole; password?: string } | null;
  verificationId: string | null;
  isSendingResend: boolean;
  resendCountdown: number;

  // Modal controls
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: AuthMode) => void;
  setActiveRole: (role: UserRole) => void;

  // Actions
  login: (name: string, emailOrPhone: string, password: string) => Promise<{ success: boolean; message: string }>;
  startSignup: (name: string, email: string, phone: string, role: UserRole, password?: string) => Promise<{ success: boolean; message: string }>;
  resendVerificationCode: () => Promise<boolean>;
  verifyEmailCode: (code: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

let countdownTimer: ReturnType<typeof setInterval> | null = null;

const startResendCountdown = () => {
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    const { resendCountdown } = useAuthStore.getState();
    if (resendCountdown <= 1) {
      if (countdownTimer) clearInterval(countdownTimer);
      countdownTimer = null;
      useAuthStore.setState({ resendCountdown: 0 });
    } else {
      useAuthStore.setState({ resendCountdown: resendCountdown - 1 });
    }
  }, 1000);
};

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  activeRole: 'buyer',
  isAuthModalOpen: false,
  authMode: 'login',
  pendingUser: null,
  verificationId: null,
  isSendingResend: false,
  resendCountdown: 0,

  openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthMode: (mode: AuthMode) => set({ authMode: mode }),
  setActiveRole: (role: UserRole) => set({ activeRole: role }),

  login: async (_name, identifier, password) => {
    try {
      const { user, token } = await api.login(identifier, password);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({
        currentUser: toUser(user),
        isAuthenticated: true,
        activeRole: user.role,
        isAuthModalOpen: false,
      });
      return { success: true, message: `Welcome back, ${user.name}!` };
    } catch (e: any) {
      return { success: false, message: e.message || 'Login failed. Please try again.' };
    }
  },

  startSignup: async (name, email, phone, role, password) => {
    set({ isSendingResend: true });
    try {
      const res = await api.register({ name, email, phone, role, password: password ?? '' });
      set({
        isSendingResend: false,
        pendingUser: { name, email, phone, role, password },
        verificationId: res.verificationId,
        authMode: 'verify',
        resendCountdown: 60,
      });
      startResendCountdown();
      return { success: true, message: `A verification code was sent to ${email}. Check your inbox.` };
    } catch (e: any) {
      set({ isSendingResend: false });
      return { success: false, message: e.message || 'Could not start registration. Please try again.' };
    }
  },

  resendVerificationCode: async () => {
    const { pendingUser } = get();
    if (!pendingUser || !pendingUser.password) return false;
    set({ isSendingResend: true });
    try {
      const res = await api.register({
        name: pendingUser.name,
        email: pendingUser.email,
        phone: pendingUser.phone,
        role: pendingUser.role,
        password: pendingUser.password,
      });
      set({
        isSendingResend: false,
        verificationId: res.verificationId,
        resendCountdown: 60,
      });
      startResendCountdown();
      return true;
    } catch (e: any) {
      set({ isSendingResend: false });
      console.warn('[api] resend verification code failed', e);
      return false;
    }
  },

  verifyEmailCode: async (code) => {
    const { verificationId, pendingUser } = get();
    if (!verificationId || !pendingUser) {
      return { success: false, message: 'Verification session missing. Please register again.' };
    }
    try {
      const { user, token } = await api.verifyRegistration(verificationId, code);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({
        currentUser: toUser(user),
        isAuthenticated: true,
        activeRole: user.role,
        isAuthModalOpen: false,
        pendingUser: null,
        verificationId: null,
        resendCountdown: 0,
      });
      return { success: true, message: 'Account verified and created. Welcome to Nexora!' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Verification failed. Please try again.' };
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ currentUser: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const cached = localStorage.getItem(USER_KEY);
    if (cached) {
      try {
        const cachedUser = JSON.parse(cached) as AuthUser;
        set({ currentUser: toUser(cachedUser), isAuthenticated: true, activeRole: cachedUser.role });
      } catch {
        // ignore corrupted cache
      }
    }
    try {
      const { user } = await api.me(token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ currentUser: toUser(user), isAuthenticated: true, activeRole: user.role });
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      set({ currentUser: null, isAuthenticated: false });
    }
  },
}));

// Restore any existing session on app load.
useAuthStore.getState().restoreSession();
