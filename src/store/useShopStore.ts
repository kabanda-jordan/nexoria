import { create } from 'zustand';
import { Shop, Payout, Dispute } from '../types';
import { generateShops, INITIAL_PAYOUTS, INITIAL_DISPUTES } from '../data/seed';

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

export const useShopStore = create<ShopState>((set) => ({
  shops: seedShops,
  currentSellerShop: seedShops[0], // Kigali Tech Hub by default
  selectedShopPublic: null,
  payouts: INITIAL_PAYOUTS,
  disputes: INITIAL_DISPUTES,

  setSelectedShopPublic: (shop) => set({ selectedShopPublic: shop }),

  approveShop: (shopId) => set((state) => ({
    shops: state.shops.map((s) => (s.id === shopId ? { ...s, status: 'approved' } : s)),
  })),

  rejectShop: (shopId) => set((state) => ({
    shops: state.shops.filter((s) => s.id !== shopId),
  })),

  suspendShop: (shopId) => set((state) => ({
    shops: state.shops.map((s) => (s.id === shopId ? { ...s, status: 'suspended' } : s)),
  })),

  updateShop: (shopId, updates) => set((state) => ({
    shops: state.shops.map((s) => (s.id === shopId ? { ...s, ...updates } : s)),
    currentSellerShop: state.currentSellerShop.id === shopId ? { ...state.currentSellerShop, ...updates } : state.currentSellerShop,
  })),

  requestPayout: (amount, method, accountNum, accountName) => set((state) => {
    const newPayout: Payout = {
      id: `pay-${Date.now()}`,
      shop_id: state.currentSellerShop.id,
      shop_name: state.currentSellerShop.name,
      amount,
      method,
      account_number: accountNum,
      account_name: accountName,
      status: 'pending',
      requested_at: new Date().toISOString(),
    };
    return { payouts: [newPayout, ...state.payouts] };
  }),

  resolveDispute: (disputeId) => set((state) => ({
    disputes: state.disputes.map((d) => (d.id === disputeId ? { ...d, status: 'resolved' } : d)),
  })),
}));
