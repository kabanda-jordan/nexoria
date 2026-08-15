import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Heart,
  Globe,
  Store,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Phone,
  LogIn,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useLocaleStore } from '../../store/useLocaleStore';
import { useProductStore } from '../../store/useProductStore';
import { Locale } from '../../types';
import { Logo } from '../ui/Logo';

const LANGUAGE_NAMES: Record<Locale, string> = {
  rw: 'Kinyarwanda',
  en: 'English',
  fr: 'Français',
};

export const Header: React.FC = () => {
  const { getItemCount, openCart } = useCartStore();
  const { wishlistIds, openWishlist } = useWishlistStore();
  const { activeRole, setActiveRole, currentUser, isAuthenticated } = useAuthStore();
  const { locale, setLocale, t } = useLocaleStore();
  const { searchQuery, setSearchQuery, categories, selectedCategorySlug, setSelectedCategorySlug, products, setSelectedProductDetail } = useProductStore();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const suggestions = searchQuery.trim()
    ? products
        .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
        .slice(0, 5)
    : [];

  const cartCount = getItemCount();
  const wishlistCount = wishlistIds.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Murakaza neza
            </span>
            <span className="hidden sm:inline">
              Fast delivery across Kigali &amp; all Rwanda districts via MTN MoMo / Airtel Money!
            </span>
            <span className="sm:hidden">Fast MoMo Delivery in Rwanda</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold">+250 788 000 111</span>
            </div>
            {/* Seller CTA in top bar — only shown when NOT a seller/admin */}
            {(!isAuthenticated || currentUser?.role === 'buyer') && (
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    useAuthStore.getState().openAuthModal('signup');
                  } else {
                    setActiveRole('seller');
                  }
                }}
                className="hidden md:flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold text-xs transition-colors"
              >
                <Store className="w-3.5 h-3.5" />
                Sell on Nexora
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <a href="#" onClick={() => { setSelectedCategorySlug(null); setSearchQuery(''); setActiveRole('buyer'); }} className="group">
              <Logo />
            </a>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative hidden sm:block">
            <div className={`relative flex items-center rounded-2xl border bg-slate-50 transition-all ${
              isSearchFocused ? 'border-emerald-500 ring-4 ring-emerald-500/15 bg-white' : 'border-slate-300 hover:border-slate-400'
            }`}>
              <select
                value={selectedCategorySlug || ''}
                onChange={(e) => setSelectedCategorySlug(e.target.value || null)}
                className="pl-3.5 pr-8 py-3 bg-transparent text-xs font-semibold text-slate-700 border-r border-slate-200 outline-none cursor-pointer hidden lg:block"
              >
                <option value="">{t('allCategories')}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {locale === 'rw' ? c.name_rw : locale === 'fr' ? c.name_fr : c.name_en}
                  </option>
                ))}
              </select>

              <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />

              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-3 pr-4 py-3 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            <AnimatePresence>
              {isSearchFocused && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 p-2"
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Suggested Products
                  </div>
                  {suggestions.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => { setSelectedProductDetail(p); setIsSearchFocused(false); }}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <img src={p.images[0]} alt={p.title} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{p.title}</h5>
                        <p className="text-[11px] text-emerald-600 font-bold">{p.price.toLocaleString()} RWF</p>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                        {p.shop_name}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>{LANGUAGE_NAMES[locale]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-200 py-1 z-50">
                  {(['rw', 'en', 'fr'] as Locale[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLocale(l); setIsLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 flex items-center gap-2 ${locale === l ? 'text-emerald-600 bg-emerald-50' : 'text-slate-700'}`}
                    >
                      <span className={`w-6 text-[10px] font-black tracking-wider ${locale === l ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {l.toUpperCase()}
                      </span>
                      {LANGUAGE_NAMES[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Account — Role-aware Profile Button */}
            {currentUser && isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-2xl border border-slate-200 cursor-pointer transition-colors"
                >
                  <img
                    src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-xl object-cover"
                  />
                  <span className="text-xs font-bold text-slate-800 hidden lg:inline max-w-[90px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-extrabold text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                        <span className={`mt-1 inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          currentUser.role === 'admin' ? 'bg-amber-100 text-amber-700' :
                          currentUser.role === 'seller' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {currentUser.role === 'admin' ? '🛡️ Admin' : currentUser.role === 'seller' ? '🏪 Seller' : '🛍️ Buyer'}
                        </span>
                      </div>

                      {/* Role-based Dashboard Links */}
                      {(currentUser.role === 'seller' || currentUser.role === 'admin') && (
                        <button
                          onClick={() => {
                            setActiveRole(currentUser.role);
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {currentUser.role === 'admin' ? 'Admin Panel' : 'My Seller Dashboard'}
                        </button>
                      )}

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setActiveRole('seller');
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <Store className="w-4 h-4" />
                          View as Seller
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setActiveRole('buyer');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        My Orders & Purchases
                      </button>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => { useAuthStore.getState().logout(); setIsProfileOpen(false); }}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => useAuthStore.getState().openAuthModal('login')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">{t('login')}</span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={openWishlist}
              className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
              title={t('wishlist')}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-5 h-5 bg-amber-400 text-slate-900 text-[11px] font-extrabold rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline font-bold">{t('cart')}</span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 sm:hidden relative">
          <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent text-xs text-slate-900 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
          <button
            onClick={() => setSelectedCategorySlug(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategorySlug === null
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            ✨ {t('allCategories')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategorySlug === cat.slug
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {locale === 'rw' ? cat.name_rw : locale === 'fr' ? cat.name_fr : cat.name_en}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
