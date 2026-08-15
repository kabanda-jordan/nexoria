import React from 'react';
import { useLocaleStore } from '../../store/useLocaleStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldCheck, Phone, Mail, MapPin, Smartphone, CreditCard, Banknote } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  const { t } = useLocaleStore();
  const { setActiveRole } = useAuthStore();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Vision */}
          <FadeIn delay={0} y={16}>
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" />

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Nexora ni isoko rya mbere mu Rwanda rifasha buri muntu wese gushyiraho iduka rye, akagurisha ibicuruzwa bye mu gihugu hose. Kwishyura biraza kuri MTN Mobile Money, Airtel Money no kuri Ikarita!
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Kigali Innovation City, Gasabo District, Kigali, Rwanda</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Support: +250 788 000 111 / WhatsApp: +250 788 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@nexora.rw</span>
              </div>
            </div>
          </div>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn delay={0.1} y={16}>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Ibyiciro by'Ibicuruzwa</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Telefone n'Ibikoresho</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Ibyuma by'Ikoranabuhanga</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Imyenda y'Imikenyero & Kitenge</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Kawa n'Icyayi by'u Rwanda</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Ibikorwa by'Amaboko & Agaseke</a></li>
            </ul>
          </div>
          </FadeIn>

          {/* Sellers & Partners */}
          <FadeIn delay={0.2} y={16}>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Abagurisha (Vendors)</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveRole('seller')} className="hover:text-emerald-400 text-left transition-colors font-semibold text-emerald-400">
                  + Fungura iduka ryawe ku Nexora
                </button>
              </li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Dashboard y'Amaduka</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Amabwiriza y'ubucuruzi</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Kwibutsa Payouts ya MoMo</a></li>
            </ul>
          </div>
          </FadeIn>

          {/* Rwanda Mobile Money Badges */}
          <FadeIn delay={0.3} y={16}>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Kwishyura Mu Rwanda</h4>
            <p className="text-xs text-slate-400 mb-3">Tukwemerera kwishyura mu buryo bwose bwizewe:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
                <div className="w-6 h-6 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">MoMo</div>
                <span className="text-xs text-white font-semibold">MTN Mobile Money (*182#)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
                <div className="w-6 h-6 rounded-md bg-red-600 text-white font-black text-[10px] flex items-center justify-center">Airtel</div>
                <span className="text-xs text-white font-semibold">Airtel Money (*182#)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span className="text-xs text-white font-semibold">Bank Cards (Visa / Mastercard)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
                <Banknote className="w-5 h-5 text-amber-400" />
                <span className="text-xs text-white font-semibold">Cash on Delivery (COD)</span>
              </div>
            </div>
          </div>
          </FadeIn>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Nexora Rwanda Inc. All rights reserved. Designed for Rwanda's digital economy.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Seller Agreement</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
