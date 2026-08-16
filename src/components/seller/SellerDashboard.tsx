import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  ExternalLink,
  Edit,
  Trash2,
  Wallet,
  Clock,
  ShieldCheck,
  Loader2,
  Store,
  MessageSquare,
} from 'lucide-react';
import { useShopStore } from '../../store/useShopStore';
import { useProductStore } from '../../store/useProductStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useToastStore } from '../../store/useToastStore';
import { ProductFormModal } from './ProductFormModal';
import { PayoutModal } from './PayoutModal';
import { ShopOnboarding } from './ShopOnboarding';
import { navigate } from '../../lib/navigate';
import { Product } from '../../types';

export const SellerDashboard: React.FC = () => {
  const { currentSellerShop, payouts, loadMyShop, isShopLoading } = useShopStore();
  const { products, deleteProduct } = useProductStore();
  const { orders, updateOrderStatus } = useOrderStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'payouts'>('overview');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  useEffect(() => {
    if (!currentSellerShop) loadMyShop();
  }, []);

  if (!currentSellerShop) {
    if (isShopLoading) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            Loading your shop...
          </div>
        </div>
      );
    }
    return <ShopOnboarding />;
  }

  if (currentSellerShop.status === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Your shop is under review</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            <strong className="text-slate-700">{currentSellerShop.name}</strong> has been submitted for approval.
            Our team verifies vendor details (usually within 24 hours). You'll be able to list products the moment your
            shop is approved.
          </p>
          <div className="mt-5 text-left p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <p className="font-bold text-slate-800 mb-1.5">Status checklist</p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> TIN details verified
            </p>
            <p className="flex items-center gap-2 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Shop info reviewed
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mt-4">
            Questions? Contact support at <a href="mailto:support@nexora.rw" className="text-emerald-600 font-bold">support@nexora.rw</a>
          </p>
        </motion.div>
      </div>
    );
  }

  if (currentSellerShop.status === 'suspended') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Shop suspended</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            <strong className="text-slate-700">{currentSellerShop.name}</strong> has been suspended by Nexora.
            Contact our team if you believe this is a mistake.
          </p>
          <a
            href="mailto:support@nexora.rw"
            className="mt-6 inline-block px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    );
  }

  const shop = currentSellerShop;
  const shopProducts = products.filter((p) => p.shop_id === shop.id || p.shop_name === shop.name);
  const shopOrders = orders.filter((o) => o.shop_id === shop.id || o.shop_name === shop.name);
  const totalRevenue = shopOrders.reduce((sum, o) => sum + o.total, 0);
  const processedPayouts = payouts
    .filter((p) => p.shop_id === shop.id && p.status === 'processed')
    .reduce((sum, p) => sum + p.amount, 0);
  const availableBalance = Math.max(0, totalRevenue - processedPayouts);
  const lowStockCount = shopProducts.filter((p) => p.stock <= 10).length;
  const categoryCount = new Set(shopProducts.map((p) => p.category_id)).size;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={shop.logo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop'}
                alt=""
                className="w-16 h-16 rounded-2xl border-2 border-emerald-500 object-cover bg-white shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black">{shop.name}</h1>
                  {shop.verified ? (
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/40 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Vendor
                    </span>
                  ) : (
                    <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-400/40">
                      Approved Vendor
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {shop.district} {shop.tin_number && `• TIN: ${shop.tin_number}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/shop/${shop.slug}`)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>View Public Storefront</span>
              </button>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Listing</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex gap-3 border-t border-slate-800 pt-4 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview & Analytics
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'products' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Product Inventory ({shopProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'orders' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Order Queue ({shopOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'payouts' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Payouts & MoMo Earnings
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{totalRevenue.toLocaleString()} RWF</div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">{shopOrders.length} orders to date</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Orders</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{shopOrders.length} orders</div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  {shopOrders.filter((o) => o.status === 'pending').length} awaiting action
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Products</span>
                  <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{shopProducts.length} items</div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  Across {categoryCount} categor{categoryCount === 1 ? 'y' : 'ies'}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Low Stock Alerts</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-600">{lowStockCount} items</div>
                <p className="text-[11px] text-amber-600 font-semibold mt-1">Restock soon</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  Available Shop Balance: {availableBalance.toLocaleString()} RWF
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Ready to withdraw directly to your MTN Mobile Money, Airtel Money or Bank Account.
                </p>
              </div>

              <button
                onClick={() => setIsPayoutModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shrink-0 shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
              >
                Withdraw to MoMo
              </button>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg">Shop Listings ({shopProducts.length})</h3>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {shopProducts.length === 0 ? (
              <div className="py-16 text-center">
                <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800">No listings yet</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Add your first product to start selling on your storefront.
                </p>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                      <th className="p-4">Product</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Price (RWF)</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {shopProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                          <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-xl" />
                          <span className="truncate max-w-xs">{p.title}</span>
                        </td>
                        <td className="p-4 font-mono text-slate-600">{p.sku}</td>
                        <td className="p-4 font-black text-slate-900">{p.price.toLocaleString()} RWF</td>
                        <td className="p-4 font-bold">
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              p.stock <= 10 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {p.stock} in stock
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-amber-500">★ {p.rating_avg}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsProductModalOpen(true);
                            }}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              deleteProduct(p.id);
                              addToast('Product Deleted', `${p.title} removed from shop.`, 'warning');
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:bg-rose-100 hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-lg">Incoming Buyer Orders</h3>
            </div>

            {shopOrders.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800">No orders yet</h4>
                <p className="text-xs text-slate-500 mt-1">Orders from buyers will appear here once you start selling.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {shopOrders.map((ord) => (
                  <div key={ord.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{ord.id}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            ord.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Buyer: <strong className="text-slate-900">{ord.buyer_name}</strong> ({ord.buyer_phone}) •
                        Address: {ord.district}, {ord.sector}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Items: {ord.items.map((i) => i.product_title).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900 block">{ord.total.toLocaleString()} RWF</span>
                        <span className="text-[11px] text-emerald-600 font-semibold">MoMo Paid</span>
                      </div>

                      {ord.status === 'pending' && (
                        <button
                          onClick={() => {
                            updateOrderStatus(ord.id, 'processing');
                            addToast('Order Accepted! 📦', `Preparing ${ord.id} for delivery.`);
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                        >
                          Accept & Process
                        </button>
                      )}

                      {ord.status === 'processing' && (
                        <button
                          onClick={() => {
                            updateOrderStatus(ord.id, 'shipped');
                            addToast('Order Shipped! 🚚', `Order ${ord.id} is now in transit.`);
                          }}
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                        >
                          Mark Shipped
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PAYOUTS TAB */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">MoMo & Bank Withdrawal History</h3>
                <p className="text-xs text-slate-500">Track payouts sent to your Mobile Money wallet</p>
              </div>

              <button
                onClick={() => setIsPayoutModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md"
              >
                + Request Payout
              </button>
            </div>

            {payouts.length === 0 ? (
              <div className="py-14 text-center">
                <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800">No payouts yet</h4>
                <p className="text-xs text-slate-500 mt-1">Request your first payout from your shop balance.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 border-t border-slate-200">
                {payouts.map((p) => (
                  <div key={p.id} className="py-4 flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-slate-900">{p.amount.toLocaleString()} RWF</h5>
                      <p className="text-slate-500">
                        Method: {p.method.toUpperCase()} ({p.account_number})
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full font-bold uppercase ${
                        p.status === 'processed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        productToEdit={editingProduct}
        onClose={() => setIsProductModalOpen(false)}
      />

      <PayoutModal isOpen={isPayoutModalOpen} onClose={() => setIsPayoutModalOpen(false)} />
    </div>
  );
};
