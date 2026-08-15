import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { FadeIn } from '../ui/FadeIn';
import { useProductStore } from '../../store/useProductStore';
import { useLocaleStore } from '../../store/useLocaleStore';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    products,
    searchQuery,
    selectedCategorySlug,
    selectedShopId,
    minPrice,
    maxPrice,
    sortBy,
    setSortBy,
    setSelectedCategorySlug,
    setSelectedShopId,
    setSearchQuery,
    categories,
  } = useProductStore();

  const { t } = useLocaleStore();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Filter & Sort Pipeline across 2,000+ items
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesShop = p.shop_name?.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTag = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesShop && !matchesDesc && !matchesTag) return false;
      }

      // Category
      if (selectedCategorySlug && p.category_slug !== selectedCategorySlug) {
        return false;
      }

      // Shop
      if (selectedShopId && p.shop_id !== selectedShopId) {
        return false;
      }

      // Price
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating_avg - a.rating_avg;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      // default 'featured'
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, searchQuery, selectedCategorySlug, selectedShopId, minPrice, maxPrice, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 450, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Filter Bar */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <span>{selectedCategorySlug ? categories.find(c => c.slug === selectedCategorySlug)?.name_en : 'All Marketplace Products'}</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full">
              {filteredProducts.length.toLocaleString()} items
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified listings from independent vendors across Kigali and Rwanda districts.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Active Filter Clear */}
          {(selectedCategorySlug || selectedShopId || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategorySlug(null);
                setSelectedShopId(null);
                setSearchQuery('');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
            >
              <option value="featured">✨ Featured Offers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
          </div>
          </div>
        </FadeIn>

      {/* Grid Container */}
      {paginatedProducts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6"
        >
          <AnimatePresence mode="popLayout">
            {paginatedProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State with Flat Illustration styling */
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border-2 border-emerald-200">
            <Filter className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Nta bicuruzwa bihabanye n'ibyo ushaka</h3>
          <p className="text-sm text-slate-500 max-w-md mt-1">
            No products match your current search query or filter. Try searching for different keywords or clear your category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategorySlug(null);
              setSelectedShopId(null);
            }}
            className="mt-6 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20"
          >
            Show All 2,000+ Products
          </button>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6">
          <div className="text-xs text-slate-500 font-semibold">
            Showing Page <span className="text-slate-900 font-bold">{currentPage}</span> of{' '}
            <span className="text-slate-900 font-bold">{totalPages}</span> ({filteredProducts.length.toLocaleString()} items)
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent text-slate-700 font-bold text-xs flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (currentPage > 3 && totalPages > 5) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                      currentPage === pageNum
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent text-slate-700 font-bold text-xs flex items-center gap-1 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
