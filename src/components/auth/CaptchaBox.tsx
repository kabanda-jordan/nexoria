import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, Check } from 'lucide-react';

interface CaptchaBoxProps {
  verified: boolean;
  onVerify: (isVerified: boolean) => void;
}

export const CaptchaBox: React.FC<CaptchaBoxProps> = ({ verified, onVerify }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (verified || loading) return;
    setLoading(true);

    // Simulate anti-bot challenge check (1.2s delay)
    setTimeout(() => {
      setLoading(false);
      onVerify(true);
    }, 1200);
  };

  return (
    <div
      onClick={handleClick}
      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
        verified
          ? 'bg-emerald-50 border-emerald-500 shadow-sm'
          : loading
          ? 'bg-slate-100 border-slate-400'
          : 'bg-white border-slate-300 hover:border-slate-400 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox Icon */}
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
            verified
              ? 'bg-emerald-600 text-white scale-105'
              : loading
              ? 'bg-slate-200 text-slate-500'
              : 'border-2 border-slate-400 bg-white'
          }`}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-600" />}
          {verified && <Check className="w-4 h-4 stroke-[3]" />}
        </div>

        <div>
          <span className="font-extrabold text-xs text-slate-900 block">
            {verified ? 'Human verified' : loading ? 'Verifying security challenges...' : 'Verify you are human'}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            Protected by Cloudflare Turnstile & Anti-Bot Security
          </span>
        </div>
      </div>

      {/* Cloudflare Style Shield Logo */}
      <div className="flex flex-col items-end shrink-0 pl-2">
        <ShieldCheck className={`w-5 h-5 ${verified ? 'text-emerald-600' : 'text-slate-400'}`} />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Privacy</span>
      </div>
    </div>
  );
};
