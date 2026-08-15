import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, CreditCard, Banknote, Smartphone, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { useLocaleStore } from '../../store/useLocaleStore';
import { RWANDA_LOCATIONS } from '../../data/rwandaLocations';
import { PaymentMethod } from '../../types';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, createOrder, openMoMoModal } = useOrderStore();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { addToast } = useToastStore();
  const { t } = useLocaleStore();

  const [district, setDistrict] = useState('Gasabo');
  const [sector, setSector] = useState('Kimironko');
  const [cell, setCell] = useState('Bibare');
  const [streetAddress, setStreetAddress] = useState('KG 124 St, Near Kimironko Market');
  const [buyerName, setBuyerName] = useState('Jean-Luc Rutaremara');
  const [buyerPhone, setBuyerPhone] = useState('+250 788 554 321');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('momo_mtn');

  if (!isCheckoutOpen) return null;

  const districtObj = RWANDA_LOCATIONS[district] || RWANDA_LOCATIONS['Gasabo'];
  const availableSectors = Object.keys(districtObj.sectors);
  const availableCells = districtObj.sectors[sector] || availableSectors.length > 0 ? districtObj.sectors[availableSectors[0]] : ['Cell 1'];

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 50000 ? 0 : 2000;
  const total = subtotal + deliveryFee;

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    const newDistrict = RWANDA_LOCATIONS[d];
    if (newDistrict) {
      const firstSector = Object.keys(newDistrict.sectors)[0];
      setSector(firstSector);
      setCell(newDistrict.sectors[firstSector]?.[0] || 'Cell 1');
    }
  };

  const handleSectorChange = (s: string) => {
    setSector(s);
    setCell(districtObj.sectors[s]?.[0] || 'Cell 1');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      addToast('Cart Empty', 'Please add products before checking out.', 'error');
      return;
    }

    const firstShop = items[0].product.shop_id;
    const firstShopName = items[0].product.shop_name || 'Nexora Verified Shop';

    const orderItems = items.map((i) => ({
      id: `item-${Date.now()}-${Math.random()}`,
      order_id: '',
      product_id: i.product.id,
      product_title: i.product.title,
      product_image: i.product.images[0],
      variant_id: i.variant?.id,
      variant_name: i.variant?.name,
      qty: i.qty,
      unit_price: i.product.price + (i.variant?.price_delta || 0),
      shop_id: i.product.shop_id,
    }));

    const newOrder = createOrder({
      buyer_id: 'buyer-demo',
      buyer_name: buyerName,
      buyer_phone: buyerPhone,
      shop_id: firstShop,
      shop_name: firstShopName,
      status: 'pending',
      items: orderItems,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
      district,
      sector,
      cell,
      street_address: streetAddress,
    });

    clearCart();
    closeCheckout();

    if (paymentMethod === 'momo_mtn' || paymentMethod === 'momo_airtel') {
      openMoMoModal(newOrder);
    } else {
      addToast(
        'Order Placed Successfully! 🎉',
        `Order ${newOrder.id} has been registered. Track status live on Nexora!`,
        'success'
      );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">{t('checkoutTitle')}</h3>
                <p className="text-xs text-slate-500">Fast delivery across all Rwanda provinces</p>
              </div>
            </div>

            <button onClick={closeCheckout} className="p-2 rounded-xl text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Customer Info */}
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-extrabold">1</span>
                Buyer Contact
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('phoneNumber')}</label>
                  <input
                    type="text"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Rwanda Granular Address (District -> Sector -> Cell) */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-extrabold">2</span>
                {t('shippingAddress')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* District */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('district')}</label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                  >
                    {Object.keys(RWANDA_LOCATIONS).map((d) => (
                      <option key={d} value={d}>
                        {RWANDA_LOCATIONS[d].name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('sector')}</label>
                  <select
                    value={sector}
                    onChange={(e) => handleSectorChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                  >
                    {availableSectors.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cell */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('cell')}</label>
                  <select
                    value={cell}
                    onChange={(e) => setCell(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                  >
                    {availableCells.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('streetAddress')}</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. KG 123 St, House #14, Near Kimironko Market"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Step 3: Payment Method Picker */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-extrabold">3</span>
                {t('paymentMethod')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* MTN MoMo */}
                <div
                  onClick={() => setPaymentMethod('momo_mtn')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    paymentMethod === 'momo_mtn'
                      ? 'border-amber-400 bg-amber-50/60 ring-2 ring-amber-400/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    MoMo
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{t('payWithMoMoMTN')}</h5>
                    <p className="text-[11px] text-slate-500">Direct USSD push to phone</p>
                  </div>
                </div>

                {/* Airtel Money */}
                <div
                  onClick={() => setPaymentMethod('momo_airtel')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    paymentMethod === 'momo_airtel'
                      ? 'border-red-500 bg-red-50/60 ring-2 ring-red-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    Airtel
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{t('payWithAirtel')}</h5>
                    <p className="text-[11px] text-slate-500">Airtel Money instant push</p>
                  </div>
                </div>

                {/* Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    paymentMethod === 'card'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <CreditCard className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{t('payWithCard')}</h5>
                    <p className="text-[11px] text-slate-500">Visa / Mastercard</p>
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    paymentMethod === 'cod'
                      ? 'border-slate-900 bg-slate-100 ring-2 ring-slate-900/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Banknote className="w-8 h-8 text-slate-800 shrink-0" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{t('payWithCOD')}</h5>
                    <p className="text-[11px] text-slate-500">Pay when delivered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Total & Submit */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block font-semibold">{t('total')}</span>
                <span className="text-2xl font-black text-slate-900">
                  {total.toLocaleString()} <span className="text-xs text-emerald-600 font-bold">RWF</span>
                </span>
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
              >
                <span>{t('placeOrder')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
