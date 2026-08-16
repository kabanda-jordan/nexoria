import { create } from 'zustand';
import { Product, Category, HeroSlide } from '../types';
import { INITIAL_CATEGORIES, INITIAL_HERO_SLIDES, generateShops, generate2000Products } from '../data/seed';
import { api } from '../services/api';

// Initialize data engines once
const seedShops = generateShops();
const seedProducts = generate2000Products(seedShops);

interface ProductState {
  products: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  searchQuery: string;
  selectedCategorySlug: string | null;
  selectedShopId: string | null;
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  selectedProductDetail: Product | null;

  // UI Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategorySlug: (slug: string | null) => void;
  setSelectedShopId: (shopId: string | null) => void;
  setPriceRange: (min: number, max: number) => void;
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest') => void;
  setSelectedProductDetail: (product: Product | null) => void;

  // Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'rating_avg' | 'review_count'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Hero CMS
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  addHeroSlide: (slide: HeroSlide) => void;

  // Category CMS
  addCategory: (category: Category) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: seedProducts,
  categories: INITIAL_CATEGORIES,
  heroSlides: INITIAL_HERO_SLIDES,
  searchQuery: '',
  selectedCategorySlug: null,
  selectedShopId: null,
  minPrice: 0,
  maxPrice: 3000000,
  sortBy: 'featured',
  selectedProductDetail: null,

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedCategorySlug: (slug: string | null) => set({ selectedCategorySlug: slug }),
  setSelectedShopId: (shopId: string | null) => set({ selectedShopId: shopId }),
  setPriceRange: (min: number, max: number) => set({ minPrice: min, maxPrice: max }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setSelectedProductDetail: (product: Product | null) => set({ selectedProductDetail: product }),

  addProduct: (productData) => {
    const newProd: Product = {
      ...productData,
      id: `prod-custom-${Date.now()}`,
      rating_avg: 5.0,
      review_count: 0,
      created_at: new Date().toISOString(),
    };
    set((state) => ({ products: [newProd, ...state.products] }));
    api
      .createProduct(newProd)
      .then(({ product }) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === newProd.id ? { ...p, ...product } : p)),
        }));
      })
      .catch((e) => console.warn('[api] create product failed', e));
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
    api
      .updateProduct(id, updates)
      .then(({ product }) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
        }));
      })
      .catch((e) => console.warn('[api] update product failed', e));
  },

  deleteProduct: (id: string) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
    api.deleteProduct(id).catch((e) => console.warn('[api] delete product failed', e));
  },

  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => {
    set((state) => ({
      heroSlides: state.heroSlides.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
    api.updateHeroSlide(id, updates).catch((e) => console.warn('[api] update hero slide failed', e));
  },

  addHeroSlide: (slide: HeroSlide) => {
    set((state) => ({
      heroSlides: [...state.heroSlides, slide],
    }));
    api.createHeroSlide(slide).catch((e) => console.warn('[api] create hero slide failed', e));
  },

  addCategory: (category: Category) => {
    set((state) => ({
      categories: [...state.categories, category],
    }));
    api.createCategory(category).catch((e) => console.warn('[api] create category failed', e));
  },
}));

// Hydrate catalog from the live D1-backed API, falling back to local seed data.
(async () => {
  try {
    const [cats, slides, prods] = await Promise.all([
      api.getCategories(),
      api.getHeroSlides(),
      api.getProducts({ limit: 10000 }),
    ]);
    useProductStore.setState({
      categories: cats.categories,
      heroSlides: slides.hero_slides,
      products: prods.products,
    });
  } catch (e) {
    console.warn('[api] catalog hydrate failed, using local seed data', e);
  }
})();
