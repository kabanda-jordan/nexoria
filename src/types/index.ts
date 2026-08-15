export type UserRole = 'buyer' | 'seller' | 'admin';
export type Locale = 'rw' | 'en' | 'fr';

export interface User {
  id: string;
  phone: string;
  email: string;
  name: string;
  role: UserRole;
  locale: Locale;
  verified_at?: string;
  avatar_url?: string;
}

export type ShopStatus = 'pending' | 'approved' | 'suspended';

export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo_url: string;
  banner_url: string;
  bio: string;
  phone: string;
  whatsapp: string;
  tin_number?: string;
  status: ShopStatus;
  rating_avg: number;
  review_count: number;
  district: string;
  verified: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name_rw: string;
  name_en: string;
  name_fr: string;
  parent_id?: string | null;
  icon: string;
  slug: string;
  product_count?: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price_delta: number;
  stock: number;
  sku: string;
}

export interface WholesaleTier {
  min_qty: number;
  price_per_unit: number;
}

export type ProductStatus = 'active' | 'draft' | 'out_of_stock';

export interface Product {
  id: string;
  shop_id: string;
  shop_name?: string;
  category_id: string;
  category_slug?: string;
  title: string;
  description: string;
  price: number; // in RWF
  original_price?: number; // for discount badges
  wholesale_tiers?: WholesaleTier[];
  sku: string;
  stock: number;
  status: ProductStatus;
  images: string[];
  variants?: ProductVariant[];
  rating_avg: number;
  review_count: number;
  tags: string[];
  created_at: string;
  featured?: boolean;
  flash_deal?: boolean;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'momo_mtn' | 'momo_airtel' | 'card' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_title: string;
  product_image: string;
  variant_id?: string;
  variant_name?: string;
  qty: number;
  unit_price: number;
  shop_id: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_phone: string;
  shop_id: string;
  shop_name: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  district: string;
  sector: string;
  cell: string;
  street_address: string;
  tracking_code: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  buyer_id: string;
  buyer_name: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
}

export type PayoutMethod = 'momo' | 'airtel' | 'bank';
export type PayoutStatus = 'pending' | 'completed' | 'rejected';

export interface Payout {
  id: string;
  shop_id: string;
  shop_name: string;
  amount: number;
  method: PayoutMethod;
  account_number: string;
  account_name: string;
  status: PayoutStatus;
  requested_at: string;
  processed_at?: string;
}

export interface HeroSlide {
  id: string;
  title_rw: string;
  title_en: string;
  title_fr: string;
  subtitle_rw: string;
  subtitle_en: string;
  subtitle_fr: string;
  image_url: string;
  cta_text_rw: string;
  cta_text_en: string;
  cta_text_fr: string;
  category_slug?: string;
  badge?: string;
  active: boolean;
}

export interface Dispute {
  id: string;
  order_id: string;
  buyer_name: string;
  shop_name: string;
  reason: string;
  status: 'open' | 'resolved' | 'rejected';
  amount: number;
  created_at: string;
}
