import { create } from 'zustand';

interface WishlistState {
  wishlistIds: string[];
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: [],
  isWishlistOpen: false,
  openWishlist: () => set({ isWishlistOpen: true }),
  closeWishlist: () => set({ isWishlistOpen: false }),
  toggleWishlist: (productId: string) => {
    set((state) => {
      const exists = state.wishlistIds.includes(productId);
      if (exists) {
        return { wishlistIds: state.wishlistIds.filter((id) => id !== productId) };
      } else {
        return { wishlistIds: [...state.wishlistIds, productId] };
      }
    });
  },
  isWishlisted: (productId: string) => get().wishlistIds.includes(productId),
}));
