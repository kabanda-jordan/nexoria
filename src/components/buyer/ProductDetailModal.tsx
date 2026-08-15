import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Heart, ShieldCheck, MessageSquare, Check, Truck, Share2, Tag, ArrowRight } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useToastStore } from '../../store/useToastStore';
import { useLocaleStore } from '../../store/useLocaleStore';
import { INITIAL_REVIEWS } from '../../data/seed';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductDetail, setSelectedProductDetail } = useProductStore();
  const { addItem } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { openCheckout } = useOrderStore();
  const { addToast } = useToastStore();
  const { t } = useLocaleStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'wholesale' | 'reviews'>('details');

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, qty);
    addToast(t('addToCart'), `${qty}x ${product.title} added to cart.`);
  };

  const handleBuyNow = () => {
    addItem(product, selectedVariant, qty);
    setSelectedProductDetail(null);
    openCheckout();
  };

  const whatsappMessage = encodeURIComponent(
    `Bwire iduka ${product.shop_name}, nshaka kugura ${product.title} kuri Nexora.rw! Igiciro: ${product.price.toLocaleString()} RWF`
  );
  const whatsappUrl = `https://wa.me/250788123456?text=${whatsappMessage}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedProductDetail(null)}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Column */}
            <div className="p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
              <div className="space-y-4">
                <div className="relative aspect-square w-full rounded-2xl bg-white overflow-hidden shadow-inner border border-slate-200">
                  <img
                    src={product.images[activeImageIndex] || product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover object-center"
                  />
                  {product.flash_deal && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full shadow">
                      FLASH DEAL
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-500/20 scale-105' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Seller info card */}
              <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                      {product.shop_name}
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-extrabold">VERIFIED</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">Fast responder • Direct WhatsApp seller</p>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Product Details Column */}
            <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div>
                {/* Title & Rating */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] tracking-wider text-slate-700">
                    SKU: {product.sku}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{product.rating_avg}</span>
                    <span className="text-slate-400 font-normal">({product.review_count} reviews)</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {product.title}
                </h2>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900">
                    {product.price.toLocaleString()} <span className="text-sm text-emerald-600 font-bold">RWF</span>
                  </span>

                  {product.original_price && (
                    <span className="text-sm text-slate-400 line-through font-semibold">
                      {product.original_price.toLocaleString()} RWF
                    </span>
                  )}
                </div>

                {/* Stock status pill */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    {t('inStock')} ({product.stock} available)
                  </span>

                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    Delivered in 24h
                  </span>
                </div>

                {/* Variants Picker */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mt-5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Select Variant:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                            selectedVariant?.id === v.id
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {v.name} {v.price_delta > 0 && `(+${v.price_delta.toLocaleString()} RWF)`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tabs: Description / Wholesale / Reviews */}
                <div className="mt-6 border-b border-slate-200 flex gap-4 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 transition-colors border-b-2 ${activeTab === 'details' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                  >
                    Details & Bio
                  </button>
                  <button
                    onClick={() => setActiveTab('wholesale')}
                    className={`pb-2 transition-colors border-b-2 flex items-center gap-1 ${activeTab === 'wholesale' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    Wholesale Tiers
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 transition-colors border-b-2 ${activeTab === 'reviews' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                  >
                    Reviews ({INITIAL_REVIEWS.length})
                  </button>
                </div>

                {/* Tab Content */}
                <div className="py-4 text-xs text-slate-600 leading-relaxed min-h-[100px]">
                  {activeTab === 'details' && (
                    <p>{product.description}</p>
                  )}

                  {activeTab === 'wholesale' && (
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-800">Buy in bulk and get automated tiered discount:</p>
                      {product.wholesale_tiers?.map((tier, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="font-bold text-slate-900">Buy {tier.min_qty}+ units</span>
                          <span className="font-black text-emerald-600">{tier.price_per_unit.toLocaleString()} RWF / unit</span>
                        </div>
                      )) || <p className="text-slate-400">Standard single-unit price applies.</p>}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-3">
                      {INITIAL_REVIEWS.map((rev) => (
                        <div key={rev.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                            <span>{rev.buyer_name}</span>
                            <div className="flex items-center text-amber-400">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span className="text-xs ml-1 text-slate-800">{rev.rating}.0</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-600">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 p-1">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold text-sm shadow-sm"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-slate-900">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold text-sm shadow-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 rounded-xl border transition-colors ml-auto ${
                      wishlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <ShoppingCart className="w-4 h-4 text-emerald-400" />
                    <span>{t('addToCart')}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <span>{t('buyNow')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
