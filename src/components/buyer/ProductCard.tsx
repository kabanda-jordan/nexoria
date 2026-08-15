import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useProductStore } from '../../store/useProductStore';
import { useToastStore } from '../../store/useToastStore';
import { useLocaleStore } from '../../store/useLocaleStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { setSelectedProductDetail } = useProductStore();
  const { addToast } = useToastStore();
  const { t } = useLocaleStore();

  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    addToast(t('addToCart'), `${product.title} has been added to your cart.`);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    addToast(
      wishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist',
      product.title,
      wishlisted ? 'info' : 'success'
    );
  };

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      onClick={() => setSelectedProductDetail(product)}
      className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-200"
    >
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <motion.img
          src={product.images[0]}
          alt={product.title}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[11px] font-extrabold shadow">
              -{discountPercent}%
            </span>
          )}

          {product.featured && (
            <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold flex items-center gap-1 shadow">
              <Sparkles className="w-3 h-3" />
              HOT
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
            wishlisted
              ? 'bg-rose-500 text-white shadow-lg scale-110'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500 hover:scale-105'
          }`}
        >
          <motion.div whileTap={{ scale: 1.3 }}>
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
          </motion.div>
        </button>

        {/* Quick Add Button Overlay (fade-in on card hover) */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hidden sm:block">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg backdrop-blur-md transition-all ${
              added
                ? 'bg-emerald-600 text-white scale-100'
                : 'bg-slate-900/90 text-white hover:bg-emerald-600 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                <span>{t('addToCart')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Shop badge & rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-slate-600 truncate flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {product.shop_name}
            </span>

            <div className="flex items-center gap-1 shrink-0 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating_avg}</span>
              <span className="text-slate-400 font-normal">({product.review_count})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price & Mobile Add button */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="text-lg font-black text-slate-900 tracking-tight">
              {product.price.toLocaleString()} <span className="text-xs text-emerald-600 font-bold">RWF</span>
            </div>

            {product.original_price && (
              <span className="text-xs text-slate-400 line-through">
                {product.original_price.toLocaleString()} RWF
              </span>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className="sm:hidden p-2.5 rounded-xl bg-emerald-600 text-white font-bold active:scale-90"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
