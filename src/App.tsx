import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { HeroCarousel } from './components/layout/HeroCarousel';
import { TrustStrip } from './components/layout/TrustStrip';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/layout/ToastContainer';

import { ProductGrid } from './components/buyer/ProductGrid';
import { ProductDetailModal } from './components/buyer/ProductDetailModal';
import { CartDrawer } from './components/buyer/CartDrawer';
import { WishlistDrawer } from './components/buyer/WishlistDrawer';
import { CheckoutModal } from './components/buyer/CheckoutModal';
import { MoMoPaymentModal } from './components/buyer/MoMoPaymentModal';
import { OrderTrackerModal } from './components/buyer/OrderTrackerModal';
import { ShopDirectory } from './components/buyer/ShopDirectory';
import { PublicShopPage } from './components/buyer/PublicShopPage';

import { SellerDashboard } from './components/seller/SellerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';

import { useAuthStore } from './store/useAuthStore';
import { getPath } from './lib/navigate';

function parsePath(path: string): { view: 'shop' | 'shops' | 'app'; slug?: string } {
  const shopMatch = path.match(/^\/shop\/([^/]+)\/?$/);
  if (shopMatch) return { view: 'shop', slug: decodeURIComponent(shopMatch[1]) };
  if (path === '/shops') return { view: 'shops' };
  return { view: 'app' };
}

export function App() {
  const { activeRole } = useAuthStore();
  const [path, setPath] = useState<string>(getPath());

  useEffect(() => {
    const onPop = () => setPath(getPath());
    const syncModalWithUrl = () => {
      const p = getPath();
      const { isAuthModalOpen, authMode, openAuthModal, closeAuthModal, setAuthMode } = useAuthStore.getState();
      const isLogin = p === '/api/auth/login';
      const isRegister = p === '/api/auth/signin';
      if (isLogin || isRegister) {
        if (!isAuthModalOpen) {
          openAuthModal(isLogin ? 'login' : 'signup');
        } else if (isLogin && authMode !== 'login') {
          setAuthMode('login');
        } else if (isRegister && authMode === 'login') {
          setAuthMode('signup');
        }
      } else if (isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('popstate', syncModalWithUrl);
    syncModalWithUrl();
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('popstate', syncModalWithUrl);
    };
  }, []);

  const route = parsePath(path);
  const showShopPages = route.view === 'shops' || route.view === 'shop';

  const renderMain = () => {
    if (route.view === 'shops') {
      return (
        <motion.main
          key="shops"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex-1"
        >
          <ShopDirectory />
          <Footer />
          <ProductDetailModal />
          <CartDrawer />
          <WishlistDrawer />
          <CheckoutModal />
          <MoMoPaymentModal />
        </motion.main>
      );
    }

    if (route.view === 'shop' && route.slug) {
      return (
        <motion.main
          key={`shop-${route.slug}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex-1"
        >
          <PublicShopPage slug={route.slug} />
          <Footer />
          <ProductDetailModal />
          <CartDrawer />
          <WishlistDrawer />
          <CheckoutModal />
          <MoMoPaymentModal />
        </motion.main>
      );
    }

    return (
      <motion.main
        key={activeRole}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex-1"
      >
        {activeRole === 'buyer' && (
          <>
            <HeroCarousel />
            <TrustStrip />
            <ProductGrid />
            <Footer />
            <ProductDetailModal />
            <CartDrawer />
            <WishlistDrawer />
            <CheckoutModal />
            <MoMoPaymentModal />
            <OrderTrackerModal />
          </>
        )}

        {activeRole === 'seller' && <SellerDashboard />}
        {activeRole === 'admin' && <AdminDashboard />}
      </motion.main>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Toast Notifications & Auth Modal */}
      <ToastContainer />
      <AuthModal />

      {/* Header with Navigation & Role Toggle */}
      <Header />

      {/* Role + Path View Routing */}
      <AnimatePresence mode="wait">{renderMain()}</AnimatePresence>
    </div>
  );
}

export default App;
