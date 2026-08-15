import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText, Check } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Terms of Service & Privacy Policy</h3>
                <p className="text-xs text-slate-400">Nexora Rwanda Multi-Vendor Regulations</p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs text-slate-600 max-h-[65vh] overflow-y-auto leading-relaxed">
            <h4 className="font-bold text-slate-900 text-sm">1. Introduction & Acceptance</h4>
            <p>
              Welcome to Nexora.rw. By registering an account, opening a merchant shop, or making a purchase on our platform, you agree to comply with and be bound by these Terms and Conditions governed by the laws of the Republic of Rwanda.
            </p>

            <h4 className="font-bold text-slate-900 text-sm">2. Buyer Rights & Protection</h4>
            <p>
              Buyers in Rwanda are entitled to transparent pricing in Rwandan Francs (RWF), verified products, and fast delivery within 24-48 hours across all districts. Payments made via MTN Mobile Money, Airtel Money, or Card are held in escrow until product verification.
            </p>

            <h4 className="font-bold text-slate-900 text-sm">3. Merchant & Vendor Guidelines</h4>
            <p>
              Merchants registering a storefront must provide valid National ID / TIN numbers. All listed inventory must be original and compliant with Rwandan trade laws. Counterfeit goods result in immediate shop suspension and loss of payouts.
            </p>

            <h4 className="font-bold text-slate-900 text-sm">4. Mobile Money & Escrow Settlements</h4>
            <p>
              MoMo transactions (*182#) are processed through secure telco gateways. Payouts are deposited directly to vendor Mobile Money accounts upon successful order completion.
            </p>

            <h4 className="font-bold text-slate-900 text-sm">5. Privacy & Data Protection</h4>
            <p>
              Nexora collects phone numbers, delivery addresses (District, Sector, Cell), and emails strictly for order fulfillment and account verification via Resend. We do not sell user data to third parties.
            </p>
          </div>

          <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Last updated: August 2026</span>
            <button
              onClick={() => {
                if (onAccept) onAccept();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20"
            >
              I Understand & Accept
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
