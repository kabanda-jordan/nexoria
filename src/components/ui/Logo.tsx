import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'dark';
}

export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <defs>
      <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0E8F5B" />
        <stop offset="100%" stopColor="#095E3C" />
      </linearGradient>
    </defs>
    {/* Background */}
    <rect width="1024" height="1024" rx="220" fill="url(#logoBgGrad)" />
    {/* Geometric N — left pillar */}
    <rect x="300" y="260" width="86" height="504" rx="43" fill="#FFFFFF" />
    {/* Geometric N — right pillar */}
    <rect x="638" y="260" width="86" height="504" rx="43" fill="#FFFFFF" />
    {/* Geometric N — diagonal stroke */}
    <line x1="343" y1="300" x2="681" y2="724" stroke="#FFFFFF" strokeWidth="112" strokeLinecap="round" />
    {/* Connection-node amber accent */}
    <circle cx="681" cy="300" r="58" fill="#F5A623" />
  </svg>
);

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full' }) => {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon badge */}
      <LogoIcon size={42} />

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Nexora
          </span>
          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-[10px] uppercase shadow-sm">
            RW
          </span>
        </div>
        <span className="text-[9px] font-extrabold tracking-[0.2em] text-emerald-700 uppercase mt-0.5">
          RWANDA MARKETPLACE
        </span>
      </div>
    </div>
  );
};
