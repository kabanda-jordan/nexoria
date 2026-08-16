import { create } from 'zustand';
import { Shop, Payout, Dispute } from '../types';
import { generateShops, INITIAL_PAYOUTS, INITIAL_DISPUTES } from '../data/seed';
import { api } from '../services/api';

const seedShops = generateShops();

interface ShopState {
  shops: Shop[];
  currentSellerShop: Shop;
  selectedShopPublic: Shop | null;
  payouts: Payout[];
  disputes: Dispute[];

  // Actions
  setSelectedShopPublic: (shop: Shop | null) => void;
  approveShop: (shopId: string) => void;
  rejectShop: (shopId: string) => void;
  suspendShop: (shopId: string) => void;
  updateShop: (shopId: string, updates: Partial<Shop>) => void;
  requestPayout: (amount: number, method: 'momo' | 'airtel' | 'bank', accountNum: string, accountName: string) => void;
  resolveDispute: (disputeId: string) => void;
}

export const useShopStore = create<ShopState>((set, get) => ({
  shops: seedShops,
  currentSellerShop: seedShops[0], // Kigali Tech Hub by default
  selectedShopPublic: null,
  payouts: INITIAL_PAYOUTS,
  disputes: INITIAL_DISPUTES,

  setSelectedShopPublic: (shop) => set({ selectedShopPublic: shop }),

  approveShop: (shopId) => {
    set((state) => ({
      shops: state.shops.map((s) => (s.id === shopId ? { ...s, status: 'approved' } : s)),
    }));
    api.updateShop(shopId, { status: 'approved' }).catch((e) => console.warn('[api] approve shop failed', e));
  },

  rejectShop: (shopId) => {
    set((state) => ({
      shops: state.shops.filter((s) => s.id !== shopId),
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
      currentSellerShop: state.currentSellerShop.id === shopId ? { ...state.currentSellerShop, ...updates } : state.currentSellerShop,
    }));
    api.updateShop(shopId, updates).catch((e) => console.warn('[api] update shop failed', e));
  },

  requestPayout: (amount, method, accountNum, accountName) => {
    const newPayout: Payout = {
      id: `pay-${Date.now()}`,
      shop_id: get().currentSellerShop.id,
      shop_name: get().currentSellerShop.name,
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

  resolveDispute: (disputeId) => {
    set((state) => ({
      disputes: state.disputes.map((d) => (d.id === disputeId ? { ...d, status: 'resolved' } : d)),
    }));
    api.resolveDispute(disputeId).catch((e) => console.warn('[api] resolve dispute failed', e));
  },
}));

// Hydrate shops, payouts and disputes from the live D1-backed API.
(async () => {
  try {
    const [shopsRes, payoutsRes, disputesRes] = await Promise.all([
      api.getShops(),
      api.getPayouts(),
      api.getDisputes(),
    ]);
    const shops = shopsRes.shops;
    useShopStore.setState({
      shops,
      currentSellerShop: shops[0] ?? useShopStore.getState().currentSellerShop,
      payouts: payoutsRes.payouts,
      disputes: disputesRes.disputes,
    });
  } catch (e) {
    console.warn('[api] shop hydrate failed, using local seed data', e);
  }
})();
