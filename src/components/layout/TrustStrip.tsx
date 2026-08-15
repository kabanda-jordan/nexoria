import React from 'react';
import { Truck, ShieldCheck, Headphones, Gift } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';
import { useLocaleStore } from '../../store/useLocaleStore';

export const TrustStrip: React.FC = () => {
  const { t } = useLocaleStore();

  const features = [
    {
      icon: Truck,
      title: t('fastDeliveryTitle'),
      desc: t('fastDeliveryDesc'),
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      icon: ShieldCheck,
      title: t('securePaymentTitle'),
      desc: t('securePaymentDesc'),
      color: 'text-amber-600 bg-amber-100',
    },
    {
      icon: Headphones,
      title: t('customerCareTitle'),
      desc: t('customerCareDesc'),
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Gift,
      title: t('referFriendTitle'),
      desc: t('referFriendDesc'),
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <section className="bg-white border-y border-slate-200 py-6 my-6 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <FadeIn key={idx} delay={idx * 0.08}>
                <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className={`p-3.5 rounded-2xl ${item.color} shrink-0`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
