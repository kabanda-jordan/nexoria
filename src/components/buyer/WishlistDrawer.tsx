import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';

export const WishlistDrawer: React.FC = () => {
  const { wishlistIds, isWishlistOpen, closeWishlist, toggleWishlist } = useWishlistStore();
  const { products, setSelectedProductDetail } = useProductStore();
  const { addItem } = useCartStore();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeWishlist}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10"
        >
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h3 className="font-extrabold text-slate-900 text-lg">Your Wishlist</h3>
              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {wishlistedProducts.length} items
              </span>
            </div>

            <button onClick={closeWishlist} className="p-2 rounded-xl text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {wishlistedProducts.length > 0 ? (
              wishlistedProducts.map((product) => (
                <div key={product.id} className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-xl shrink-0 cursor-pointer"
                    onClick={() => {
                      closeWishlist();
                      setSelectedProductDetail(product);
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{product.title}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold">{product.shop_name}</p>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {product.price.toLocaleString()} RWF
                      </span>

                      <button
                        onClick={() => {
                          addItem(product);
                          toggleWishlist(product.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <Heart className="w-16 h-16 text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-900 text-base">Wishlist is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Save items you love by tapping the heart icon on any product card.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
