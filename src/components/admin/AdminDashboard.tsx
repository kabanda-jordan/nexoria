import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Store,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Tag,
  Image,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  MessageCircleQuestion,
} from 'lucide-react';
import { useShopStore } from '../../store/useShopStore';
import { useProductStore } from '../../store/useProductStore';
import { useToastStore } from '../../store/useToastStore';
import { Category, HeroSlide } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { shops, approveShop, rejectShop, suspendShop, disputes, resolveDispute } = useShopStore();
  const { categories, addCategory, heroSlides, addHeroSlide, updateHeroSlide, products } = useProductStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'gmv' | 'shops' | 'categories' | 'hero' | 'disputes'>('gmv');

  // Category modal states
  const [newCatNameRw, setNewCatNameRw] = useState('');
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatNameFr, setNewCatNameFr] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [showCatModal, setShowCatModal] = useState(false);

  // Hero CMS states
  const [newHeroTitleRw, setNewHeroTitleRw] = useState('');
  const [newHeroTitleEn, setNewHeroTitleEn] = useState('');
  const [newHeroTitleFr, setNewHeroTitleFr] = useState('');
  const [newHeroImg, setNewHeroImg] = useState('');
  const [showHeroModal, setShowHeroModal] = useState(false);

  const totalGMV = 428000000; // 428 Million RWF GMV
  const platformFeeCommission = totalGMV * 0.05; // 5% marketplace commission
  const pendingShops = shops.filter((s) => s.status === 'pending');
  const approvedShops = shops.filter((s) => s.status === 'approved');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name_rw: newCatNameRw,
      name_en: newCatNameEn,
      name_fr: newCatNameFr,
      slug: newCatSlug || newCatNameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: 'Tag',
      product_count: 0,
    };
    addCategory(newCat);
    addToast('Category Created! 🏷️', `Added category ${newCatNameEn}`);
    setShowCatModal(false);
  };

  const handleAddHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      title_rw: newHeroTitleRw || 'Nexora Promo',
      title_en: newHeroTitleEn || 'Nexora Special Offer',
      title_fr: newHeroTitleFr || 'Promotion Nexora',
      subtitle_rw: 'Gura ku igiciro cyo hasi',
      subtitle_en: 'Exclusive Rwanda marketplace deal',
      subtitle_fr: 'Offres exclusives au Rwanda',
      image_url: newHeroImg || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
      cta_text_rw: 'Tangira kugura',
      cta_text_en: 'Shop Now',
      cta_text_fr: 'Acheter',
      active: true,
    };
    addHeroSlide(newSlide);
    addToast('Hero Banner Added! 🖼️', 'Homepage slider updated.');
    setShowHeroModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-16">
      {/* Header Bar */}
      <div className="bg-slate-950 py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black flex items-center gap-2">
                  Nexora Platform Admin
                  <span className="text-xs bg-amber-500/20 text-amber-300 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-400/40">
                    SUPER-ADMIN MODE
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Platform Moderation • Shop Approvals • Category CMS • Disputes
                </p>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="mt-8 flex gap-3 border-t border-slate-800 pt-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('gmv')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'gmv' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              GMV Analytics
            </button>
            <button
              onClick={() => setActiveTab('shops')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'shops' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Shop Approvals</span>
              {pendingShops.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {pendingShops.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'categories' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Category Manager ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'hero' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hero Banners CMS ({heroSlides.length})
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'disputes' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dispute Resolution ({disputes.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* GMV ANALYTICS TAB */}
        {activeTab === 'gmv' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-3xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase">Platform GMV</span>
                <div className="text-2xl font-black text-white mt-2">{totalGMV.toLocaleString()} RWF</div>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">↑ +24.8% growth</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase">Marketplace Revenue (5%)</span>
                <div className="text-2xl font-black text-amber-400 mt-2">{platformFeeCommission.toLocaleString()} RWF</div>
                <p className="text-[11px] text-slate-400 mt-1">Commission earned</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase">Active Shops</span>
                <div className="text-2xl font-black text-white mt-2">{approvedShops.length} Vendors</div>
                <p className="text-[11px] text-slate-400 mt-1">Across 8 Rwanda districts</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Catalog Items</span>
                <div className="text-2xl font-black text-white mt-2">{products.length.toLocaleString()} Listings</div>
                <p className="text-[11px] text-slate-400 mt-1">Indexed in search</p>
              </div>
            </div>
          </div>
        )}

        {/* SHOP APPROVALS TAB */}
        {activeTab === 'shops' && (
          <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden space-y-6 p-6">
            <h3 className="text-lg font-extrabold">Shop Verification & Moderation Queue</h3>

            <div className="divide-y divide-slate-700">
              {shops.map((s) => (
                <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={s.logo_url} alt="" className="w-12 h-12 rounded-xl object-cover bg-white" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-white">{s.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          s.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : s.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">District: {s.district} • TIN: {s.tin_number || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {s.status !== 'approved' && (
                      <button
                        onClick={() => {
                          approveShop(s.id);
                          addToast('Shop Approved! ✅', `${s.name} is now approved on Nexora.`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                    )}

                    {s.status !== 'suspended' && (
                      <button
                        onClick={() => {
                          suspendShop(s.id);
                          addToast('Shop Suspended', `${s.name} suspended.`, 'warning');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORY MANAGER TAB */}
        {activeTab === 'categories' && (
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Taxonomy & Categories</h3>
              <button
                onClick={() => setShowCatModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add New Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-700">
                  <h4 className="font-bold text-sm text-white">{c.name_en}</h4>
                  <p className="text-xs text-amber-400 font-medium">RW: {c.name_rw}</p>
                  <p className="text-xs text-slate-400 font-medium">FR: {c.name_fr}</p>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded mt-2 inline-block font-mono">
                    slug: {c.slug}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HERO BANNER CMS TAB */}
        {activeTab === 'hero' && (
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Homepage Hero Slider CMS</h3>
              <button
                onClick={() => setShowHeroModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Banner Slide
              </button>
            </div>

            <div className="space-y-4">
              {heroSlides.map((slide) => (
                <div key={slide.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-700 flex gap-4 items-center">
                  <img src={slide.image_url} alt="" className="w-24 h-16 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-white truncate">{slide.title_en}</h4>
                    <p className="text-xs text-slate-400 truncate">{slide.subtitle_rw}</p>
                  </div>
                  <button
                    onClick={() => updateHeroSlide(slide.id, { active: !slide.active })}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                      slide.active ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {slide.active ? 'Active' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DISPUTES TAB */}
        {activeTab === 'disputes' && (
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 space-y-6">
            <h3 className="text-lg font-extrabold">Customer Disputes & Refund Requests</h3>

            <div className="divide-y divide-slate-700">
              {disputes.map((d) => (
                <div key={d.id} className="py-4 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-white">Order {d.order_id} • {d.buyer_name} vs {d.shop_name}</h5>
                    <p className="text-slate-400 mt-0.5">Reason: {d.reason}</p>
                    <span className="font-black text-amber-400 mt-1 block">{d.amount.toLocaleString()} RWF</span>
                  </div>

                  {d.status === 'open' ? (
                    <button
                      onClick={() => {
                        resolveDispute(d.id);
                        addToast('Dispute Resolved! ⚖️', `Refund of ${d.amount.toLocaleString()} RWF processed.`);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                    >
                      Resolve & Refund
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                      RESOLVED
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleAddCategory} className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="font-bold text-lg">Add New Category</h3>

            <div>
              <label className="block text-xs text-slate-400 mb-1">English Name</label>
              <input
                type="text"
                required
                value={newCatNameEn}
                onChange={(e) => setNewCatNameEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Kinyarwanda Name</label>
              <input
                type="text"
                required
                value={newCatNameRw}
                onChange={(e) => setNewCatNameRw(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">French Name</label>
              <input
                type="text"
                required
                value={newCatNameFr}
                onChange={(e) => setNewCatNameFr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowCatModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs">
                Create Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Hero Modal */}
      {showHeroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleAddHeroSlide} className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="font-bold text-lg">Add Hero Banner</h3>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Title (EN)</label>
              <input
                type="text"
                required
                value={newHeroTitleEn}
                onChange={(e) => setNewHeroTitleEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Title (RW)</label>
              <input
                type="text"
                required
                value={newHeroTitleRw}
                onChange={(e) => setNewHeroTitleRw(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Image URL</label>
              <input
                type="url"
                required
                value={newHeroImg}
                onChange={(e) => setNewHeroImg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowHeroModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs">
                Add Slide
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
