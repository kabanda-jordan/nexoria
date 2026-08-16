import { Product, Category, Shop, Order, HeroSlide, Payout, Dispute, OrderStatus } from '../types';

const API_BASE = '/api/v1';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body && body.error) detail = body.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(detail);
  }
  return res.json();
}

interface Paginated<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  products: T[];
}

export interface ProductQuery {
  category?: string;
  search?: string;
  shopId?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  flash?: boolean;
}

export const api = {
  getCategories: () => request<{ total: number; categories: Category[] }>('/categories'),
  createCategory: (data: Partial<Category>) =>
    request<{ message: string; category: Category }>('/categories', { method: 'POST', body: JSON.stringify(data) }),

  getHeroSlides: () => request<{ total: number; hero_slides: HeroSlide[] }>('/hero-slides'),
  createHeroSlide: (data: Partial<HeroSlide>) =>
    request<{ message: string; hero_slide: HeroSlide }>('/hero-slides', { method: 'POST', body: JSON.stringify(data) }),
  updateHeroSlide: (id: string, data: Partial<HeroSlide>) =>
    request<{ message: string; hero_slide: HeroSlide }>(`/hero-slides/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getShops: () => request<{ total: number; shops: Shop[] }>('/shops'),
  getShop: (id: string) => request<{ shop: Shop }>(`/shops/${id}`),
  updateShop: (id: string, data: Partial<Shop>) =>
    request<{ message: string; shop: Shop }>(`/shops/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getProducts: (query: ProductQuery = {}) => {
    const params = new URLSearchParams();
    if (query.category) params.set('category', query.category);
    if (query.search) params.set('search', query.search);
    if (query.shopId) params.set('shopId', query.shopId);
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.featured) params.set('featured', '1');
    if (query.flash) params.set('flash', '1');
    const qs = params.toString();
    return request<Paginated<Product>>(`/products${qs ? `?${qs}` : ''}`);
  },
  getProduct: (id: string) => request<{ product: Product }>(`/products/${id}`),
  createProduct: (data: Partial<Product>) =>
    request<{ message: string; product: Product }>('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: Partial<Product>) =>
    request<{ message: string; product: Product }>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProduct: (id: string) =>
    request<{ message: string }>(`/products/${id}`, { method: 'DELETE' }),

  getOrders: (query: { shopId?: string; buyerId?: string } = {}) => {
    const params = new URLSearchParams();
    if (query.shopId) params.set('shopId', query.shopId);
    if (query.buyerId) params.set('buyerId', query.buyerId);
    const qs = params.toString();
    return request<{ total: number; orders: Order[] }>(`/orders${qs ? `?${qs}` : ''}`);
  },
  getOrder: (id: string) => request<{ order: Order }>(`/orders/${id}`),
  createOrder: (data: Partial<Order>) =>
    request<{ message: string; order: Order }>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    request<{ message: string; order: Order }>(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  getPayouts: () => request<{ total: number; payouts: Payout[] }>('/payouts'),
  requestPayout: (data: Partial<Payout>) =>
    request<{ message: string; payout: Payout }>('/payouts', { method: 'POST', body: JSON.stringify(data) }),

  getDisputes: () => request<{ total: number; disputes: Dispute[] }>('/disputes'),
  resolveDispute: (id: string) =>
    request<{ message: string; dispute: Dispute }>(`/disputes/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'resolved' }) }),
};
