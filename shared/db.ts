export interface Env {
  DB: any;
  RESEND_API_KEY?: string;
}

export const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const errorResponse = (message: string, status = 400) =>
  jsonResponse({ error: message }, status);

const parseJson = (v: unknown, fallback: unknown = null) => {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'string') {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  }
  return v;
};

const optional = (v: unknown) => (v === null || v === undefined ? undefined : String(v));
const toBool = (v: unknown) => Boolean(v);

export const mapUser = (r: any) => ({
  id: r.id,
  name: r.name,
  email: r.email,
  phone: r.phone,
  role: r.role,
  locale: r.locale,
  avatar_url: optional(r.avatar_url),
  verified_at: optional(r.verified_at),
});

export const mapCategory = (r: any) => ({
  id: r.id,
  name_rw: r.name_rw,
  name_en: r.name_en,
  name_fr: r.name_fr,
  parent_id: optional(r.parent_id),
  icon: r.icon,
  slug: r.slug,
  product_count: r.product_count,
});

export const mapHeroSlide = (r: any) => ({
  id: r.id,
  title_rw: r.title_rw,
  title_en: r.title_en,
  title_fr: r.title_fr,
  subtitle_rw: r.subtitle_rw,
  subtitle_en: r.subtitle_en,
  subtitle_fr: r.subtitle_fr,
  cta_text_rw: r.cta_text_rw,
  cta_text_en: r.cta_text_en,
  cta_text_fr: r.cta_text_fr,
  image_url: r.image_url,
  category_slug: optional(r.category_slug),
  badge: optional(r.badge),
  active: toBool(r.active),
});

export const mapShop = (r: any) => ({
  id: r.id,
  owner_id: r.owner_id,
  name: r.name,
  slug: r.slug,
  logo_url: r.logo_url,
  banner_url: r.banner_url,
  bio: r.bio,
  phone: r.phone,
  whatsapp: r.whatsapp,
  tin_number: optional(r.tin_number),
  status: r.status,
  rating_avg: r.rating_avg,
  review_count: r.review_count,
  district: r.district,
  verified: toBool(r.verified),
  created_at: r.created_at,
});

export const mapProduct = (r: any) => ({
  id: r.id,
  shop_id: r.shop_id,
  shop_name: optional(r.shop_name),
  category_id: r.category_id,
  category_slug: optional(r.category_slug),
  title: r.title,
  description: r.description,
  price: r.price,
  original_price: r.original_price === null || r.original_price === undefined ? undefined : r.original_price,
  wholesale_tiers: parseJson(r.wholesale_tiers, undefined),
  sku: r.sku,
  stock: r.stock,
  status: r.status,
  images: parseJson(r.images, []),
  variants: parseJson(r.variants, undefined),
  rating_avg: r.rating_avg,
  review_count: r.review_count,
  tags: parseJson(r.tags, []),
  created_at: r.created_at,
  featured: toBool(r.featured),
  flash_deal: toBool(r.flash_deal),
});

export const mapOrder = (r: any) => ({
  id: r.id,
  buyer_id: r.buyer_id,
  buyer_name: r.buyer_name,
  buyer_phone: r.buyer_phone,
  shop_id: r.shop_id,
  shop_name: r.shop_name,
  status: r.status,
  items: parseJson(r.items, []),
  subtotal: r.subtotal,
  delivery_fee: r.delivery_fee,
  total: r.total,
  payment_method: r.payment_method,
  payment_status: r.payment_status,
  district: r.district,
  sector: r.sector,
  cell: r.cell,
  street_address: r.street_address,
  tracking_code: r.tracking_code,
  created_at: r.created_at,
  updated_at: r.updated_at,
});

export const mapPayout = (r: any) => ({
  id: r.id,
  shop_id: r.shop_id,
  shop_name: r.shop_name,
  amount: r.amount,
  method: r.method,
  account_number: r.account_number,
  account_name: r.account_name,
  status: r.status,
  requested_at: r.requested_at,
  processed_at: optional(r.processed_at),
});

export const mapDispute = (r: any) => ({
  id: r.id,
  order_id: r.order_id,
  buyer_name: r.buyer_name,
  shop_name: r.shop_name,
  reason: r.reason,
  status: r.status,
  amount: r.amount,
  created_at: r.created_at,
});
