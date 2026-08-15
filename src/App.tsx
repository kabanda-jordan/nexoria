import React from 'react';
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

import { SellerDashboard } from './components/seller/SellerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';

import { useAuthStore } from './store/useAuthStore';

export function App() {
  const { activeRole } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Toast Notifications & Auth Modal */}
      <ToastContainer />
      <AuthModal />

      {/* Header with Navigation & Role Toggle */}
      <Header />

      {/* Role View Routing */}
      <AnimatePresence mode="wait">
        {activeRole === 'buyer' && (
          <motion.main
            key="buyer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex-1"
          >
            <HeroCarousel />
            <TrustStrip />
            <ProductGrid />
            <Footer />

            {/* Buyer Drawers & Modals */}
            <ProductDetailModal />
            <CartDrawer />
            <WishlistDrawer />
            <CheckoutModal />
            <MoMoPaymentModal />
            <OrderTrackerModal />
          </motion.main>
        )}

        {activeRole === 'seller' && (
          <motion.main
            key="seller"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex-1"
          >
            <SellerDashboard />
          </motion.main>
        )}

        {activeRole === 'admin' && (
          <motion.main
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex-1"
          >
            <AdminDashboard />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
