import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Loader2 } from 'lucide-react';
import { useShopStore } from '../../store/useShopStore';
import { navigate } from '../../lib/navigate';
import { ShopStorefrontView } from '../seller/ShopStorefrontView';

interface PublicShopPageProps {
  slug: string;
}

export const PublicShopPage: React.FC<PublicShopPageProps> = ({ slug }) => {
  const { shops, loadShops } = useShopStore();
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading');

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setStatus('loading');
    if (shops.length === 0) {
      loadShops().then(() => setStatus('ready'));
    } else {
      setStatus('ready');
    }
  }, [slug]);

  useEffect(() => {
    if (status === 'ready' && !shops.find((s) => s.slug === slug)) {
      setStatus('missing');
    }
  }, [shops, status, slug]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          Loading storefront...
        </div>
      </div>
    );
  }

  const shop = shops.find((s) => s.slug === slug);

  if (!shop) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center"
        >
          <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-black text-slate-900">Shop Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">
            This storefront doesn't exist or is no longer available.
          </p>
          <button
            onClick={() => navigate('/shops')}
            className="mt-5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            Browse All Shops
          </button>
        </motion.div>
      </div>
    );
  }

  return <ShopStorefrontView shop={shop} onBack={() => navigate('/shops')} />;
};
