import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, MapPin, Star, ArrowLeft, ShieldCheck, Package, Search } from 'lucide-react';
import { useShopStore } from '../../store/useShopStore';
import { useProductStore } from '../../store/useProductStore';
import { navigate } from '../../lib/navigate';
import { Shop } from '../../types';

const SHOP_FALLBACK_LOGO = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop';

export const ShopDirectory: React.FC = () => {
  const { shops, loadShops } = useShopStore();
  const { products } = useProductStore();
  const [query, setQuery] = React.useState('');

  useEffect(() => {
    if (shops.length === 0) loadShops();
    window.scrollTo({ top: 0 });
  }, []);

  const filtered = shops.filter(
    (s: Shop) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.bio.toLowerCase().includes(query.toLowerCase()) ||
      s.district.toLowerCase().includes(query.toLowerCase())
  );

  const productCount = (shopId: string) => products.filter((p) => p.shop_id === shopId || p.shop_name === shopId).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-900 text-white py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </button>

          <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
            <Store className="w-8 h-8 text-emerald-400" />
            Browse Shops
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {shops.length} Rwandan vendors selling on Nexora — find a shop and explore its storefront.
          </p>

          <div className="relative mt-5 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shops by name, district or category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700">No shops match "{query}"</h3>
            <p className="text-xs text-slate-500 mt-1">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((shop: Shop, i: number) => (
              <motion.button
                key={shop.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                onClick={() => navigate(`/shop/${shop.slug}`)}
                className="text-left bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden group"
              >
                <div className="h-24 bg-gradient-to-r from-emerald-600 to-teal-500 relative">
                  {shop.banner_url && (
                    <img src={shop.banner_url} alt="" className="w-full h-full object-cover opacity-70" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                </div>

                <div className="px-4 pb-4 relative">
                  <div className="w-14 h-14 rounded-2xl border-4 border-white shadow-md bg-white -mt-7 overflow-hidden">
                    <img
                      src={shop.logo_url || SHOP_FALLBACK_LOGO}
                      alt={shop.name}
                      className="w-full h-full object-cover"
                      onError={(e) => ((e.target as HTMLImageElement).src = SHOP_FALLBACK_LOGO)}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2">
                    <h3 className="font-extrabold text-sm text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                      {shop.name}
                    </h3>
                    {shop.verified && <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 min-h-[32px]">{shop.bio}</p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-slate-500 font-semibold">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      {shop.district}
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {shop.rating_avg}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                    <Package className="w-3.5 h-3.5 text-emerald-600" />
                    {productCount(shop.id)} products
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
