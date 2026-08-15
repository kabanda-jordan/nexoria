import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Phone, MessageSquare, Star, ArrowLeft, Store, Package } from 'lucide-react';
import { Shop } from '../../types';
import { useProductStore } from '../../store/useProductStore';
import { ProductCard } from '../buyer/ProductCard';

interface ShopStorefrontViewProps {
  shop: Shop;
  onBack: () => void;
}

export const ShopStorefrontView: React.FC<ShopStorefrontViewProps> = ({ shop, onBack }) => {
  const { products } = useProductStore();

  const shopProducts = products.filter((p) => p.shop_id === shop.id || p.shop_name === shop.name);

  const whatsappMessage = encodeURIComponent(`Muraho ${shop.name}, nshaka kubaza ku ibicuruzwa byanyu kuri Nexora.rw!`);
  const whatsappUrl = `https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-900 overflow-hidden">
        <img src={shop.banner_url} alt={shop.name} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-900 font-extrabold text-xs flex items-center gap-2 shadow-lg backdrop-blur-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Shops</span>
          </button>
        </div>

        {/* Shop Info Card Overlay */}
        <div className="absolute bottom-6 left-6 right-6 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <img
              src={shop.logo_url}
              alt={shop.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-4 border-white object-cover shadow-2xl bg-white shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black">{shop.name}</h1>
                {shop.verified && (
                  <span className="p-1 bg-emerald-500 text-white rounded-full" title="Verified Merchant">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">{shop.bio}</p>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-semibold text-emerald-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {shop.district}, Rwanda
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {shop.rating_avg} ({shop.review_count} reviews)
                </span>
                {shop.tin_number && (
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[10px]">
                    {shop.tin_number}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${shop.phone}`}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Shop</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>

      {/* Published Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <span>Storefront Listings</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing all active products published by {shop.name}
            </p>
          </div>

          <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full">
            {shopProducts.length} Products
          </span>
        </div>

        {shopProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
            {shopProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800">No active products listed yet</h4>
            <p className="text-xs text-slate-500 mt-1">Check back soon for new inventory updates from this vendor.</p>
          </div>
        )}
      </div>
    </div>
  );
};
