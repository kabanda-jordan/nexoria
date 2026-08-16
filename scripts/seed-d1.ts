import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  INITIAL_CATEGORIES,
  INITIAL_HERO_SLIDES,
  generateShops,
  generate2000Products,
  INITIAL_ORDERS,
  INITIAL_PAYOUTS,
  INITIAL_DISPUTES,
} from '../src/data/seed';

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
Math.random = rand;

const lines: string[] = [];
const sql = (s: string) => lines.push(s);
const esc = (v: unknown) => String(v).replace(/'/g, "''");
const q = (v: unknown) => `'${esc(v)}'`;
const num = (v: unknown) => (v === null || v === undefined ? 'NULL' : Number(v));
const bool = (v: unknown) => (v ? 1 : 0);
const json = (v: unknown) => (v === null || v === undefined ? 'NULL' : q(JSON.stringify(v)));

sql(`CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name_rw TEXT, name_en TEXT, name_fr TEXT,
  parent_id TEXT, icon TEXT, slug TEXT, product_count INTEGER
);`);
sql(`CREATE TABLE IF NOT EXISTS hero_slides (
  id TEXT PRIMARY KEY,
  title_rw TEXT, title_en TEXT, title_fr TEXT,
  subtitle_rw TEXT, subtitle_en TEXT, subtitle_fr TEXT,
  cta_text_rw TEXT, cta_text_en TEXT, cta_text_fr TEXT,
  image_url TEXT, category_slug TEXT, badge TEXT, active INTEGER
);`);
sql(`CREATE TABLE IF NOT EXISTS shops (
  id TEXT PRIMARY KEY, owner_id TEXT, name TEXT, slug TEXT,
  logo_url TEXT, banner_url TEXT, bio TEXT, phone TEXT, whatsapp TEXT,
  tin_number TEXT, status TEXT, rating_avg REAL, review_count INTEGER,
  district TEXT, verified INTEGER, created_at TEXT
);`);
sql(`CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, shop_id TEXT, shop_name TEXT, category_id TEXT, category_slug TEXT,
  title TEXT, description TEXT, price INTEGER, original_price INTEGER,
  wholesale_tiers TEXT, sku TEXT, stock INTEGER, status TEXT,
  images TEXT, variants TEXT, rating_avg REAL, review_count INTEGER,
  tags TEXT, created_at TEXT, featured INTEGER, flash_deal INTEGER
);`);
sql(`CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, buyer_id TEXT, buyer_name TEXT, buyer_phone TEXT,
  shop_id TEXT, shop_name TEXT, status TEXT, items TEXT,
  subtotal INTEGER, delivery_fee INTEGER, total INTEGER,
  payment_method TEXT, payment_status TEXT, district TEXT, sector TEXT, cell TEXT,
  street_address TEXT, tracking_code TEXT, created_at TEXT, updated_at TEXT
);`);
sql(`CREATE TABLE IF NOT EXISTS payouts (
  id TEXT PRIMARY KEY, shop_id TEXT, shop_name TEXT, amount INTEGER,
  method TEXT, account_number TEXT, account_name TEXT, status TEXT,
  requested_at TEXT, processed_at TEXT
);`);
sql(`CREATE TABLE IF NOT EXISTS disputes (
  id TEXT PRIMARY KEY, order_id TEXT, buyer_name TEXT, shop_name TEXT,
  reason TEXT, status TEXT, amount INTEGER, created_at TEXT
);`);

['categories', 'hero_slides', 'shops', 'products', 'orders', 'payouts', 'disputes'].forEach((t) =>
  sql(`DELETE FROM ${t};`)
);

function insertBatch(table: string, columns: string[], rows: (string | number | null)[][]) {
  const BATCH = 50;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    sql(`INSERT INTO ${table} (${columns.join(',')}) VALUES ${chunk.map((r) => `(${r.join(',')})`).join(',')};`);
  }
}

const catRows = INITIAL_CATEGORIES.map((c) => [
  q(c.id),
  q(c.name_rw),
  q(c.name_en),
  q(c.name_fr),
  c.parent_id ? q(c.parent_id) : 'NULL',
  q(c.icon),
  q(c.slug),
  num(c.product_count),
]);
insertBatch('categories', ['id', 'name_rw', 'name_en', 'name_fr', 'parent_id', 'icon', 'slug', 'product_count'], catRows);

const slideRows = INITIAL_HERO_SLIDES.map((s) => [
  q(s.id),
  q(s.title_rw),
  q(s.title_en),
  q(s.title_fr),
  q(s.subtitle_rw),
  q(s.subtitle_en),
  q(s.subtitle_fr),
  q(s.cta_text_rw),
  q(s.cta_text_en),
  q(s.cta_text_fr),
  q(s.image_url),
  s.category_slug ? q(s.category_slug) : 'NULL',
  s.badge ? q(s.badge) : 'NULL',
  bool(s.active),
]);
insertBatch(
  'hero_slides',
  ['id', 'title_rw', 'title_en', 'title_fr', 'subtitle_rw', 'subtitle_en', 'subtitle_fr', 'cta_text_rw', 'cta_text_en', 'cta_text_fr', 'image_url', 'category_slug', 'badge', 'active'],
  slideRows
);

const shops = generateShops();
const shopRows = shops.map((s) => [
  q(s.id),
  q(s.owner_id),
  q(s.name),
  q(s.slug),
  q(s.logo_url),
  q(s.banner_url),
  q(s.bio),
  q(s.phone),
  q(s.whatsapp),
  s.tin_number ? q(s.tin_number) : 'NULL',
  q(s.status),
  num(s.rating_avg),
  num(s.review_count),
  q(s.district),
  bool(s.verified),
  q(s.created_at),
]);
insertBatch(
  'shops',
  ['id', 'owner_id', 'name', 'slug', 'logo_url', 'banner_url', 'bio', 'phone', 'whatsapp', 'tin_number', 'status', 'rating_avg', 'review_count', 'district', 'verified', 'created_at'],
  shopRows
);

const products = generate2000Products(shops);
const prodRows = products.map((p) => [
  q(p.id),
  q(p.shop_id),
  p.shop_name ? q(p.shop_name) : 'NULL',
  q(p.category_id),
  p.category_slug ? q(p.category_slug) : 'NULL',
  q(p.title),
  q(p.description),
  num(p.price),
  p.original_price ? num(p.original_price) : 'NULL',
  json(p.wholesale_tiers ?? null),
  q(p.sku),
  num(p.stock),
  q(p.status),
  json(p.images),
  json(p.variants ?? null),
  num(p.rating_avg),
  num(p.review_count),
  json(p.tags),
  q(p.created_at),
  bool(p.featured),
  bool(p.flash_deal),
]);
insertBatch(
  'products',
  ['id', 'shop_id', 'shop_name', 'category_id', 'category_slug', 'title', 'description', 'price', 'original_price', 'wholesale_tiers', 'sku', 'stock', 'status', 'images', 'variants', 'rating_avg', 'review_count', 'tags', 'created_at', 'featured', 'flash_deal'],
  prodRows
);

const orderRows = INITIAL_ORDERS.map((o) => [
  q(o.id),
  q(o.buyer_id),
  q(o.buyer_name),
  q(o.buyer_phone),
  q(o.shop_id),
  q(o.shop_name),
  q(o.status),
  json(o.items),
  num(o.subtotal),
  num(o.delivery_fee),
  num(o.total),
  q(o.payment_method),
  q(o.payment_status),
  q(o.district),
  q(o.sector),
  q(o.cell),
  q(o.street_address),
  q(o.tracking_code),
  q(o.created_at),
  q(o.updated_at),
]);
insertBatch(
  'orders',
  ['id', 'buyer_id', 'buyer_name', 'buyer_phone', 'shop_id', 'shop_name', 'status', 'items', 'subtotal', 'delivery_fee', 'total', 'payment_method', 'payment_status', 'district', 'sector', 'cell', 'street_address', 'tracking_code', 'created_at', 'updated_at'],
  orderRows
);

const payoutRows = INITIAL_PAYOUTS.map((p) => [
  q(p.id),
  q(p.shop_id),
  q(p.shop_name),
  num(p.amount),
  q(p.method),
  q(p.account_number),
  q(p.account_name),
  q(p.status),
  q(p.requested_at),
  p.processed_at ? q(p.processed_at) : 'NULL',
]);
insertBatch(
  'payouts',
  ['id', 'shop_id', 'shop_name', 'amount', 'method', 'account_number', 'account_name', 'status', 'requested_at', 'processed_at'],
  payoutRows
);

const disputeRows = INITIAL_DISPUTES.map((d) => [
  q(d.id),
  q(d.order_id),
  q(d.buyer_name),
  q(d.shop_name),
  q(d.reason),
  q(d.status),
  num(d.amount),
  q(d.created_at),
]);
insertBatch('disputes', ['id', 'order_id', 'buyer_name', 'shop_name', 'reason', 'status', 'amount', 'created_at'], disputeRows);

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(__dirname, '..', 'seed.sql');
writeFileSync(outFile, lines.join('\n') + '\n', 'utf8');
console.log(`Seeded SQL written to ${outFile} (${lines.length} statements)`);
