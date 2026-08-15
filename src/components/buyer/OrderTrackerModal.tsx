import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Clock, Truck, Package, MapPin, Phone } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { useLocaleStore } from '../../store/useLocaleStore';
import { OrderStatus } from '../../types';

export const OrderTrackerModal: React.FC = () => {
  const { activeTrackingOrder, setActiveTrackingOrder } = useOrderStore();
  const { t } = useLocaleStore();

  if (!activeTrackingOrder) return null;

  const order = activeTrackingOrder;

  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'pending', label: 'Order Placed', desc: 'Order received & MoMo confirmed' },
    { status: 'processing', label: 'Shop Processing', desc: 'Vendor preparing & packaging items' },
    { status: 'shipped', label: 'Shipped / In Transit', desc: 'On the road to your Rwanda district' },
    { status: 'delivered', label: 'Delivered', desc: 'Handed over to buyer' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(order.status);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                LIVE TRACKING
              </span>
              <h3 className="font-black text-xl mt-1">Order #{order.id}</h3>
              <p className="text-xs text-slate-400">Tracking Code: {order.tracking_code}</p>
            </div>

            <button
              onClick={() => setActiveTrackingOrder(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Pipeline Step Progress */}
            <div className="space-y-6">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={st.status} className="flex gap-4 relative">
                    {/* Connecting line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-px ${
                          idx < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    <div
                      className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 z-10 transition-all ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-slate-100 text-slate-400 border border-slate-300'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>

                    <div>
                      <h4 className={`text-sm font-extrabold ${isCurrent ? 'text-emerald-700' : isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {st.label}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery address details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Destination: {order.district}, {order.sector}, {order.cell}</span>
              </h5>
              <p className="text-slate-600 font-medium pl-5 text-[11px]">{order.street_address}</p>
              <div className="flex items-center gap-1.5 text-slate-500 pl-5 text-[11px]">
                <Phone className="w-3.5 h-3.5" />
                <span>Recipient: {order.buyer_name} ({order.buyer_phone})</span>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">Order Items:</h5>
              <div className="space-y-2">
                {order.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold">
                    <div className="flex items-center gap-3">
                      <img src={it.product_image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <h6 className="font-bold text-slate-900">{it.product_title}</h6>
                        <span className="text-[11px] text-slate-500">Qty: {it.qty}</span>
                      </div>
                    </div>
                    <span className="font-black text-slate-900">{(it.unit_price * it.qty).toLocaleString()} RWF</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500">Total Paid via {order.payment_method.toUpperCase()}</span>
              <span className="text-lg font-black text-slate-900">{order.total.toLocaleString()} RWF</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
