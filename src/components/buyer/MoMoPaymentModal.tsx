import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, CheckCircle2, AlertCircle, Loader2, X, ArrowRight } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { useToastStore } from '../../store/useToastStore';

export const MoMoPaymentModal: React.FC = () => {
  const { isMoMoModalOpen, closeMoMoModal, pendingMoMoOrder, updateOrderStatus } = useOrderStore();
  const { addToast } = useToastStore();

  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'prompt' | 'processing' | 'success'>('prompt');

  useEffect(() => {
    if (isMoMoModalOpen) {
      setStep('prompt');
      setPin('');
    }
  }, [isMoMoModalOpen]);

  if (!isMoMoModalOpen || !pendingMoMoOrder) return null;

  const handleApproveMoMo = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      addToast('Invalid PIN', 'Please enter a 4 or 5 digit MoMo PIN.', 'warning');
      return;
    }

    setStep('processing');

    setTimeout(() => {
      setStep('success');
      updateOrderStatus(pendingMoMoOrder.id, 'processing');
      addToast(
        'MoMo Payment Confirmed! 💛',
        `Txn ID: MOMO-RW-${Math.floor(100000 + Math.random() * 899999)}. Total: ${pendingMoMoOrder.total.toLocaleString()} RWF`,
        'success'
      );
    }, 2200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden"
        >
          {/* Top Yellow MoMo Header */}
          <div className="bg-amber-400 p-6 text-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 font-black text-sm flex items-center justify-center shadow">
                MoMo
              </div>
              <div>
                <h3 className="font-black text-lg leading-none">MTN Mobile Money</h3>
                <span className="text-[11px] font-bold opacity-85">Rwanda Direct Payment (*182#)</span>
              </div>
            </div>

            <button onClick={closeMoMoModal} className="p-2 rounded-xl hover:bg-slate-950/10 text-slate-950">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {step === 'prompt' && (
              <form onSubmit={handleApproveMoMo} className="space-y-5">
                {/* Simulated Phone Screen */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Smartphone className="w-4 h-4 animate-bounce" />
                    <span>USSD Prompt Push Sent</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Emeza kwishyura <strong className="text-white font-bold">{pendingMoMoOrder.total.toLocaleString()} RWF</strong> kuri iduka <strong className="text-emerald-400">{pendingMoMoOrder.shop_name}</strong> kuri Nexora.rw.
                  </p>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      Shyiramo MoMo PIN yawe (Enter 5-digit PIN):
                    </label>
                    <input
                      type="password"
                      maxLength={5}
                      autoFocus
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="•••••"
                      className="w-full text-center tracking-[0.5em] text-2xl font-black py-3 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeMoMoModal}
                    className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-300"
                  >
                    Hagarika
                  </button>

                  <button
                    type="submit"
                    className="w-2/3 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
                  >
                    <span>Emeza Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 'processing' && (
              <div className="py-12 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto" />
                <h4 className="text-lg font-bold">Kumenyesha MTN MoMo...</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Processing Mobile Money push request with MTN Rwanda gateway...
                </p>
              </div>
            )}

            {step === 'success' && (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h4 className="text-xl font-black text-white">Amafaranga Yashyowe!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Your order <span className="text-amber-400 font-bold">{pendingMoMoOrder.id}</span> has been confirmed. The vendor is now preparing your items for delivery!
                </p>

                <button
                  onClick={closeMoMoModal}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-extrabold text-sm text-slate-950 shadow-lg"
                >
                  Track Order Live
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
