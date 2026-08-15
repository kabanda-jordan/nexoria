import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useLocaleStore } from '../../store/useLocaleStore';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, closeCart, updateQty, removeItem, getSubtotal } = useCartStore();
  const { openCheckout } = useOrderStore();
  const { t } = useLocaleStore();

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 50000 ? 0 : 2000;
  const grandTotal = subtotal + deliveryFee;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Drawer content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-lg">{t('shoppingCart')}</h3>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length} items
              </span>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {items.length > 0 ? (
              items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.variant?.id || 'std'}`}
                  className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{item.product.title}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold">{item.product.shop_name}</p>
                    {item.variant && (
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded mt-1 inline-block">
                        {item.variant.name}
                      </span>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {((item.product.price + (item.variant?.price_delta || 0)) * item.qty).toLocaleString()} RWF
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center rounded-lg border border-slate-300 bg-white">
                        <button
                          onClick={() => updateQty(item.product.id, item.qty - 1, item.variant?.id)}
                          className="px-2 py-0.5 font-bold text-xs hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-xs text-slate-800">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.product.id, item.qty + 1, item.variant?.id)}
                          className="px-2 py-0.5 font-bold text-xs hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id, item.variant?.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <ShoppingBag className="w-16 h-16 text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-900 text-base">{t('cartEmpty')}</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Start shopping now to add authentic Rwandan products from verified shops!
                </p>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              {/* Delivery Progress Bar */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-[11px] text-emerald-900 font-semibold">
                  {subtotal >= 50000
                    ? '🎉 You qualify for FREE Kigali Fast Delivery!'
                    : `Add ${(50000 - subtotal).toLocaleString()} RWF more for FREE Kigali delivery.`}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between font-semibold">
                  <span>{t('subtotal')}</span>
                  <span>{subtotal.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>{t('deliveryFee')}</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `${deliveryFee.toLocaleString()} RWF`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>{t('total')}</span>
                  <span>{grandTotal.toLocaleString()} RWF</span>
                </div>
              </div>

              <button
                onClick={() => {
                  closeCart();
                  openCheckout();
                }}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
              >
                <span>{t('proceedToCheckout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
