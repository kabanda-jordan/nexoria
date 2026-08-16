import { create } from 'zustand';
import { Shop, Payout, Dispute } from '../types';
import { generateShops, INITIAL_PAYOUTS, INITIAL_DISPUTES } from '../data/seed';
import { api } from '../services/api';
import { useAuthStore } from './useAuthStore';

const seedShops = generateShops();

interface ShopState {
  shops: Shop[];
  currentSellerShop: Shop | null;
  selectedShopPublic: Shop | null;
  payouts: Payout[];
  disputes: Dispute[];
  isShopLoading: boolean;

  // Actions
  setSelectedShopPublic: (shop: Shop | null) => void;
  loadShops: () => Promise<void>;
  loadMyShop: () => Promise<void>;
  createShop: (data: Partial<Shop>) => Promise<{ success: boolean; message: string }>;
  approveShop: (shopId: string) => void;
  rejectShop: (shopId: string) => void;
  suspendShop: (shopId: string) => void;
  updateShop: (shopId: string, updates: Partial<Shop>) => void;
  requestPayout: (amount: number, method: 'momo' | 'airtel' | 'bank', accountNum: string, accountName: string) => void;
  processPayout: (payoutId: string, status: 'processed' | 'rejected') => void;
  resolveDispute: (disputeId: string) => void;
}

export const useShopStore = create<ShopState>((set, get) => ({
  shops: seedShops,
  currentSellerShop: null,
  selectedShopPublic: null,
  payouts: INITIAL_PAYOUTS,
  disputes: INITIAL_DISPUTES,
  isShopLoading: false,

  setSelectedShopPublic: (shop) => set({ selectedShopPublic: shop }),

  loadShops: async () => {
    try {
      const res = await api.getShops();
      set({ shops: res.shops });
    } catch (e) {
      console.warn('[api] shops hydrate failed, using local seed data', e);
    }
  },

  loadMyShop: async () => {
    const user = useAuthStore.getState().currentUser;
    if (!user) return;
    set({ isShopLoading: true });
    try {
      const res = await api.getMyShops();
      const myShop = res.shops[0] ?? null;
      set({ currentSellerShop: myShop, shops: res.shops });
    } catch (e) {
      console.warn('[api] load my shop failed', e);
      set({ currentSellerShop: null });
    } finally {
      set({ isShopLoading: false });
    }
  },

  createShop: async (data) => {
    try {
      const { shop } = await api.createShop(data);
      set((state) => ({ shops: [shop, ...state.shops], currentSellerShop: shop }));
      return { success: true, message: 'Shop created! Our team will review and approve it shortly.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Could not create shop.' };
    }
  },

  approveShop: (shopId) => {
    set((state) => ({
      shops: state.shops.map((s) => (s.id === shopId ? { ...s, status: 'approved' } : s)),
    }));
    api.updateShop(shopId, { status: 'approved' }).catch((e) => console.warn('[api] approve shop failed', e));
  },

  rejectShop: (shopId) => {
    set((state) => ({
      shops: state.shops.map((s) => (s.id === shopId ? { ...s, status: 'suspended' } : s)),
    }));
    api.updateShop(shopId, { status: 'suspended' }).catch((e) => console.warn('[api] reject shop failed', e));
  },

  suspendShop: (shopId) => {
    set((state) => ({
      shops: state.shops.map((s) => (s.id === shopId ? { ...s, status: 'suspended' } : s)),
    }));
    api.updateShop(shopId, { status: 'suspended' }).catch((e) => console.warn('[api] suspend shop failed', e));
  },

  updateShop: (shopId, updates) => {
    set((state) => ({
      shops: state.shops.map((s) => (s.id === shopId ? { ...s, ...updates } : s)),
      currentSellerShop: state.currentSellerShop?.id === shopId ? { ...state.currentSellerShop, ...updates } : state.currentSellerShop,
    }));
    api.updateShop(shopId, updates).catch((e) => console.warn('[api] update shop failed', e));
  },

  requestPayout: (amount, method, accountNum, accountName) => {
    const shop = get().currentSellerShop;
    if (!shop) return;
    const newPayout: Payout = {
      id: `pay-${Date.now()}`,
      shop_id: shop.id,
      shop_name: shop.name,
      amount,
      method,
      account_number: accountNum,
      account_name: accountName,
      status: 'pending',
      requested_at: new Date().toISOString(),
    };
    set((state) => ({ payouts: [newPayout, ...state.payouts] }));
    api.requestPayout(newPayout).catch((e) => console.warn('[api] request payout failed', e));
  },

  processPayout: (payoutId, status) => {
    set((state) => ({
      payouts: state.payouts.map((p) =>
        p.id === payoutId ? { ...p, status, processed_at: status === 'processed' ? new Date().toISOString() : undefined } : p
      ),
    }));
    api.updatePayoutStatus(payoutId, status).catch((e) => console.warn('[api] process payout failed', e));
  },

  resolveDispute: (disputeId) => {
    set((state) => ({
      disputes: state.disputes.map((d) => (d.id === disputeId ? { ...d, status: 'resolved' } : d)),
    }));
    api.resolveDispute(disputeId).catch((e) => console.warn('[api] resolve dispute failed', e));
  },
}));

// Hydrate payouts, disputes and the shop directory from the live API.
(async () => {
  try {
    const [payoutsRes, disputesRes] = await Promise.all([api.getPayouts(), api.getDisputes()]);
    useShopStore.setState({
      payouts: payoutsRes.payouts,
      disputes: disputesRes.disputes,
    });
  } catch (e) {
    console.warn('[api] shop hydrate failed, using local seed data', e);
  }
  useShopStore.getState().loadShops();
})();
