import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Smartphone, CreditCard, Check } from 'lucide-react';
import { useShopStore } from '../../store/useShopStore';
import { useToastStore } from '../../store/useToastStore';

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PayoutModal: React.FC<PayoutModalProps> = ({ isOpen, onClose }) => {
  const { currentSellerShop, requestPayout } = useShopStore();
  const { addToast } = useToastStore();
  const shop = currentSellerShop;

  const [amount, setAmount] = useState(500000);
  const [method, setMethod] = useState<'momo' | 'airtel' | 'bank'>('momo');
  const [accountNum, setAccountNum] = useState('+250788112233');
  const [accountName, setAccountName] = useState(shop?.name || '');

  if (!isOpen || !shop) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestPayout(Number(amount), method, accountNum, accountName);
    addToast(
      'Payout Requested! 💸',
      `Requested ${amount.toLocaleString()} RWF payout via ${method.toUpperCase()} to ${accountNum}.`,
      'success'
    );
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg">Withdraw Shop Balance</h3>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Withdrawal Amount (RWF)</label>
              <input
                type="number"
                required
                min={5000}
                max={5000000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-black text-slate-900 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('momo')}
                  className={`p-2.5 rounded-xl font-bold text-xs border ${
                    method === 'momo' ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                >
                  MTN MoMo
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('airtel')}
                  className={`p-2.5 rounded-xl font-bold text-xs border ${
                    method === 'airtel' ? 'bg-red-600 text-white border-red-600' : 'bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                >
                  Airtel
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`p-2.5 rounded-xl font-bold text-xs border ${
                    method === 'bank' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                >
                  Bank Wire
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account / Phone Number</label>
              <input
                type="text"
                required
                value={accountNum}
                onChange={(e) => setAccountNum(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Registered Account Holder Name</label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-xs text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30"
              >
                Submit Payout Request
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
