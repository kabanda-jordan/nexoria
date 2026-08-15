import { create } from 'zustand';
import { Product, ProductVariant } from '../types';

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, variant?: ProductVariant, qty?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQty: (productId: string, qty: number, variantId?: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  addItem: (product: Product, variant?: ProductVariant, qty = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.variant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex].qty += qty;
        return { items: updated, isCartOpen: true };
      } else {
        return { items: [...state.items, { product, variant, qty }], isCartOpen: true };
      }
    });
  },

  removeItem: (productId: string, variantId?: string) => {
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.product.id === productId && item.variant?.id === variantId)
      ),
    }));
  },

  updateQty: (productId: string, qty: number, variantId?: string) => {
    if (qty <= 0) {
      get().removeItem(productId, variantId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) => {
        if (item.product.id === productId && item.variant?.id === variantId) {
          return { ...item, qty };
        }
        return item;
      }),
    }));
  },

  clearCart: () => set({ items: [] }),

  getSubtotal: () => {
    return get().items.reduce((total, item) => {
      let price = item.product.price;
      if (item.variant) {
        price += item.variant.price_delta;
      }
      // Check wholesale pricing tier if quantity matches min_qty
      if (item.product.wholesale_tiers && item.product.wholesale_tiers.length > 0) {
        const applicableTier = [...item.product.wholesale_tiers]
          .sort((a, b) => b.min_qty - a.min_qty)
          .find((t) => item.qty >= t.min_qty);
        if (applicableTier) {
          price = applicableTier.price_per_unit;
        }
      }
      return total + price * item.qty;
    }, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.qty, 0);
  },
}));
