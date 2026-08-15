import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Parse .env file
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const [key, ...vals] = line.split('=');
        if (key && vals.length > 0) {
          process.env[key.trim()] = vals.join('=').trim();
        }
      });
    }
  } catch (e) {
    console.warn('Could not read .env file:', e);
  }
}

loadEnv();

const PORT = 3001;
const RESEND_API_KEY = process.env.VITE_RESEND_API_KEY || 're_E2LJw4WD_CUP5y3YsoETT9aQfck5Xuz5v';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = path.resolve(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.map': 'application/json',
};

// --- SEED DATA ENGINE FOR BACKEND ---
const CATEGORIES = [
  { id: 'cat-1', name_rw: "Telefone n'Ibikoresho", name_en: 'Phones & Accessories', name_fr: 'Téléphones & Accessoires', icon: 'Smartphone', slug: 'phones-accessories', product_count: 420 },
  { id: 'cat-2', name_rw: "Ibyuma by'Ikoranabuhanga", name_en: 'Electronics & Computers', name_fr: 'Électronique & Informatique', icon: 'Tv', slug: 'electronics-computers', product_count: 380 },
  { id: 'cat-3', name_rw: "Imyenda n'Inkweto", name_en: 'Fashion & Apparel', name_fr: 'Mode & Vêtements', icon: 'Shirt', slug: 'fashion-apparel', product_count: 510 },
  { id: 'cat-4', name_rw: "Kawa n'Icyayi by'u Rwanda", name_en: 'Rwandan Coffee & Tea', name_fr: 'Café & Thé du Rwanda', icon: 'Coffee', slug: 'rwandan-coffee-tea', product_count: 150 },
  { id: 'cat-5', name_rw: "Ibikorwa by'Amaboko & Ubuhanzi", name_en: 'Artisanal Crafts & Decor', name_fr: 'Artisanat & Décoration', icon: 'Palette', slug: 'artisanal-crafts', product_count: 240 },
  { id: 'cat-6', name_rw: "Ibikoresho byo mu Inzu", name_en: 'Home & Kitchen', name_fr: 'Maison & Cuisine', icon: 'Home', slug: 'home-kitchen', product_count: 310 },
  { id: 'cat-7', name_rw: "Iby'Ubwiza n'Ubuzima", name_en: 'Beauty & Personal Care', name_fr: 'Beauté & Soins', icon: 'Sparkles', slug: 'beauty-care', product_count: 290 },
  { id: 'cat-8', name_rw: "Iby'Abana n'Urubyiruko", name_en: 'Baby & Kids', name_fr: 'Bébés & Enfants', icon: 'Baby', slug: 'baby-kids', product_count: 180 },
  { id: 'cat-9', name_rw: "Siporo n'Imyidagaduro", name_en: 'Sports & Fitness', name_fr: 'Sports & Forme', icon: 'Dumbbell', slug: 'sports-fitness', product_count: 160 },
  { id: 'cat-10', name_rw: "Ubuhinzi n'Ibyo Kurya", name_en: 'Fresh Produce & Groceries', name_fr: 'Produits Frais & Épicerie', icon: 'ShoppingBag', slug: 'groceries-produce', product_count: 220 },
];

function generateBackendShops() {
  const shopTemplates = [
    { name: "Kigali Tech Hub", district: "Gasabo", bio: "Original smartphones, laptops, and gaming tech in Rwanda." },
    { name: "Musanze Organic Coffee & Crafts", district: "Musanze", bio: "Direct specialty Arabica coffee beans and gorilla wood carvings." },
    { name: "Rubavu Beach Fashion", district: "Rubavu", bio: "Custom Kitenge dresses, sandals, and stylish summer apparel." },
    { name: "Nyarugenge Fresh Market", district: "Nyarugenge", bio: "Farm-fresh Rwandan avocados, honey, passion fruit, and spices." },
    { name: "Huye Artisanal Weavers", district: "Huye", bio: "Handcrafted Agaseke peace baskets and traditional decor." },
    { name: "Kicukiro Home Essentials", district: "Kicukiro", bio: "Kitchenware, blender sets, and living room furniture." },
    { name: "Gisenyi Gourmet Tea", district: "Rubavu", bio: "Highland Orthodox black & green tea direct from Pfunda estate." },
    { name: "Kimironko Beauty Supply", district: "Gasabo", bio: "Organic shea butter, Rwandan herbal skincare, and cosmetics." },
    { name: "Remera Mobile World", district: "Gasabo", bio: "Samsung, iPhone, Xiaomi, and original chargers." },
    { name: "Gisozi Furniture & Woodwork", district: "Gasabo", bio: "Handmade mahogany dining tables, beds, and office desks." },
  ];

  const shops = [];
  for (let i = 0; i < 50; i++) {
    const t = shopTemplates[i % shopTemplates.length];
    const shopIndex = i + 1;
    const name = i < shopTemplates.length ? t.name : `${t.name} Branch #${Math.floor(i / shopTemplates.length) + 1}`;
    shops.push({
      id: `shop-${shopIndex}`,
      owner_id: `user-${shopIndex}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      logo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
      banner_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
      bio: t.bio,
      phone: `+250 78${Math.floor(1000000 + Math.random() * 8999999)}`,
      whatsapp: `+25078${Math.floor(1000000 + Math.random() * 8999999)}`,
      tin_number: `TIN-109${1000 + shopIndex}`,
      status: i === 4 ? 'pending' : (i === 12 ? 'suspended' : 'approved'),
      rating_avg: parseFloat((4.2 + (Math.random() * 0.75)).toFixed(1)),
      review_count: Math.floor(12 + Math.random() * 240),
      district: t.district,
      verified: true,
      created_at: new Date(Date.now() - Math.random() * 180 * 86400000).toISOString(),
    });
  }
  return shops;
}

const SHOPS = generateBackendShops();

function generateBackendProducts() {
  const templates = [
    { title: "Samsung Galaxy A55 5G (8GB/256GB)", price: 420000, catId: 'cat-1', catSlug: 'phones-accessories', img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop", desc: "Original Samsung Galaxy A55 with 1-year MTN warranty." },
    { title: "iPhone 15 Pro Max 256GB Titanium", price: 1450000, catId: 'cat-1', catSlug: 'phones-accessories', img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop", desc: "Brand new Apple iPhone 15 Pro Max unlocked for MTN & Airtel Rwanda." },
    { title: 'MacBook Pro 14" M3 Chip 16GB RAM', price: 2150000, catId: 'cat-2', catSlug: 'electronics-computers', img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop", desc: "Powerful Apple Silicon M3 laptop ideal for developers." },
    { title: "Gorilla's Coffee Whole Arabica Beans (500g)", price: 8500, catId: 'cat-4', catSlug: 'rwandan-coffee-tea', img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=600&auto=format&fit=crop", desc: "100% Bourbon Arabica grown in Huye & Musanze volcanic soil." },
    { title: "Handwoven Agaseke Peace Basket (Large)", price: 25000, catId: 'cat-5', catSlug: 'artisanal-crafts', img: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=600&auto=format&fit=crop", desc: "Traditional Rwandan peace basket handwoven by women artisans." },
    { title: "Modern Kitenge Tailored Umushanana Set", price: 85000, catId: 'cat-3', catSlug: 'fashion-apparel', img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop", desc: "Elegant ceremonial attire for weddings and cultural events." },
  ];

  const products = [];
  for (let i = 1; i <= 2050; i++) {
    const t = templates[i % templates.length];
    const shop = SHOPS[i % SHOPS.length];
    const basePrice = t.price + Math.floor((Math.random() * 0.2 - 0.1) * t.price);
    const price = Math.round(basePrice / 500) * 500;

    products.push({
      id: `prod-${i}`,
      shop_id: shop.id,
      shop_name: shop.name,
      category_id: t.catId,
      category_slug: t.catSlug,
      title: i > 20 ? `${t.title} - Ed. #${i}` : t.title,
      description: `${t.desc} Sold directly by ${shop.name} in ${shop.district}, Rwanda. Guaranteed fast delivery.`,
      price,
      original_price: Math.random() > 0.6 ? Math.round((price * 1.2) / 500) * 500 : undefined,
      sku: `NXR-SKU-${10000 + i}`,
      stock: Math.floor(5 + Math.random() * 85),
      status: 'active',
      images: [t.img, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"],
      rating_avg: parseFloat((4.1 + Math.random() * 0.85).toFixed(1)),
      review_count: Math.floor(3 + Math.random() * 95),
      tags: ['rwanda', 'nexora', t.catSlug, shop.district.toLowerCase()],
      created_at: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString(),
      featured: i <= 12 || Math.random() > 0.92,
      flash_deal: i % 7 === 0,
    });
  }
  return products;
}

const PRODUCTS = generateBackendProducts();

const USERS = [
  { id: 'user-demo-1', name: 'Jean-Luc Rutaremara', email: 'jeanluc@nexora.rw', phone: '+250 788 554 321', role: 'buyer', verified: true },
  { id: 'user-seller-1', name: 'Kigali Tech Owner', email: 'vendor@nexora.rw', phone: '+250 788 112 233', role: 'seller', verified: true },
  { id: 'user-admin-1', name: 'Nexora Platform Admin', email: 'admin@nexora.rw', phone: '+250 788 000 000', role: 'admin', verified: true },
];

const ORDERS = [
  {
    id: 'ORD-2026-8891',
    buyer_id: 'user-demo-1',
    buyer_name: 'Jean-Luc Rutaremara',
    buyer_phone: '+250 788 554 321',
    shop_id: 'shop-1',
    shop_name: 'Kigali Tech Hub',
    status: 'shipped',
    items: [{ id: 'item-1', product_id: 'prod-1', product_title: 'Samsung Galaxy A55 5G', qty: 1, unit_price: 420000 }],
    subtotal: 420000,
    delivery_fee: 2000,
    total: 422000,
    payment_method: 'momo_mtn',
    payment_status: 'paid',
    district: 'Gasabo',
    sector: 'Kimironko',
    cell: 'Bibare',
    tracking_code: 'NXR-TRK-99201',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  }
];

const PAYOUTS = [
  { id: 'pay-1', shop_id: 'shop-1', shop_name: 'Kigali Tech Hub', amount: 840000, method: 'momo', account_number: '+250788112233', status: 'completed', requested_at: new Date().toISOString() }
];

const DISPUTES = [
  { id: 'disp-1', order_id: 'ORD-2026-7712', buyer_name: 'Claudine Uwase', shop_name: 'Rubavu Beach Fashion', reason: 'Wrong size delivered', status: 'open', amount: 28000 }
];

const HERO_SLIDES = [
  { id: 'slide-1', title_rw: "Ibikorwa by'Amaboko & Kawa y'u Rwanda", title_en: 'Authentic Rwandan Coffee & Handcrafted Arts', subtitle_en: 'Buy directly from local Rwandan farmers and artisans.', image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop', active: true },
  { id: 'slide-2', title_rw: 'Telefone zigezweho & Laptop', title_en: 'Latest Smartphones & Laptops with Warranty', subtitle_en: 'Get 24-hour fast delivery in Kigali.', image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop', active: true }
];

// --- OPENAPI 3.0 COMPLETE SPECIFICATION ---
const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Nexora Rwanda Marketplace REST API',
    description: 'Full Interactive OpenAPI Specification for Nexora Multi-Vendor E-Commerce Platform.',
    version: '1.0.0',
    contact: { name: 'Nexora Engineering Team', email: 'contact@nexora.rw', url: 'https://nexora.rw' },
  },
  servers: [{ url: `http://localhost:${PORT}`, description: 'Local Development Server' }],
  paths: {
    '/api/send-otp': {
      post: {
        summary: 'Send Email Verification Code via Resend API',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'userName', 'code'],
                properties: {
                  email: { type: 'string', example: 'buyer@example.com' },
                  userName: { type: 'string', example: 'Jean-Luc Rutaremara' },
                  code: { type: 'string', example: '482910' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Email sent successfully via Resend' } },
      },
    },
    '/api/v1/auth/register': {
      post: {
        summary: 'Register New Account (Buyer or Seller)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'phone', 'role', 'password', 'captchaToken'],
                properties: {
                  name: { type: 'string', example: 'Jean-Luc Rutaremara' },
                  email: { type: 'string', example: 'jeanluc@nexora.rw' },
                  phone: { type: 'string', example: '+250 788 554 321' },
                  role: { type: 'string', enum: ['buyer', 'seller', 'admin'], example: 'buyer' },
                  password: { type: 'string', example: 'Passw0rd123!' },
                  captchaToken: { type: 'string', example: 'captcha_verified_token' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Registration initiated. OTP code sent via Resend.' } },
      },
    },
    '/api/v1/auth/login': {
      post: {
        summary: 'User Login & Issue JWT Tokens',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['identifier', 'password', 'captchaToken'],
                properties: {
                  identifier: { type: 'string', example: 'jeanluc@nexora.rw' },
                  password: { type: 'string', example: 'Passw0rd123!' },
                  captchaToken: { type: 'string', example: 'captcha_token' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Login successful. Returns JWT Access Token & User details.' } },
      },
    },
    '/api/v1/users': {
      get: {
        summary: 'List All Platform Users (Admin)',
        responses: { '200': { description: 'List of registered platform users' } },
      },
    },
    '/api/v1/products': {
      get: {
        summary: 'List Catalog Products (2,000+ Items)',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'shopId', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { '200': { description: 'Paginated product list' } },
      },
      post: {
        summary: 'Add New Product Listing (Seller)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['shop_id', 'category_id', 'title', 'price', 'sku', 'stock', 'images'],
                properties: {
                  shop_id: { type: 'string', example: 'shop-1' },
                  category_id: { type: 'string', example: 'cat-1' },
                  title: { type: 'string', example: 'Samsung Galaxy S24 Ultra' },
                  price: { type: 'number', example: 1650000 },
                  sku: { type: 'string', example: 'NXR-SKU-99201' },
                  stock: { type: 'integer', example: 15 },
                  images: { type: 'array', items: { type: 'string' }, example: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf'] },
                  description: { type: 'string', example: 'Original S24 Ultra with 1-year warranty.' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Product listing created' } },
      },
    },
    '/api/v1/shops': {
      get: {
        summary: 'List Verified Rwandan Merchant Shops (50+ Shops)',
        responses: { '200': { description: 'List of merchant shops' } },
      },
    },
    '/api/v1/categories': {
      get: {
        summary: 'List Category Taxonomy (RW, EN, FR)',
        responses: { '200': { description: 'List of marketplace categories' } },
      },
      post: {
        summary: 'Create New Category (Admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name_en', 'name_rw', 'name_fr', 'slug'],
                properties: {
                  name_en: { type: 'string', example: 'Gaming & Consoles' },
                  name_rw: { type: 'string', example: 'Imikino n\'Amashusho' },
                  name_fr: { type: 'string', example: 'Jeux Vidéo' },
                  slug: { type: 'string', example: 'gaming-consoles' },
                  icon: { type: 'string', example: 'Gamepad' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Category created' } },
      },
    },
    '/api/v1/orders': {
      get: {
        summary: 'List Buyer / Seller Orders',
        responses: { '200': { description: 'List of orders' } },
      },
      post: {
        summary: 'Create Order & Trigger MTN MoMo Payment',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['buyer_name', 'buyer_phone', 'shop_id', 'district', 'sector', 'cell', 'total', 'payment_method'],
                properties: {
                  buyer_name: { type: 'string', example: 'Jean-Luc Rutaremara' },
                  buyer_phone: { type: 'string', example: '+250 788 554 321' },
                  shop_id: { type: 'string', example: 'shop-1' },
                  district: { type: 'string', example: 'Gasabo' },
                  sector: { type: 'string', example: 'Kimironko' },
                  cell: { type: 'string', example: 'Bibare' },
                  total: { type: 'number', example: 422000 },
                  payment_method: { type: 'string', enum: ['momo_mtn', 'momo_airtel', 'card', 'cod'], example: 'momo_mtn' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Order created & MoMo push initiated' } },
      },
    },
    '/api/v1/payouts': {
      get: {
        summary: 'List Vendor Payout History',
        responses: { '200': { description: 'List of payouts' } },
      },
      post: {
        summary: 'Request MoMo / Bank Payout (Seller)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['shop_id', 'amount', 'method', 'account_number', 'account_name'],
                properties: {
                  shop_id: { type: 'string', example: 'shop-1' },
                  amount: { type: 'number', example: 500000 },
                  method: { type: 'string', enum: ['momo', 'airtel', 'bank'], example: 'momo' },
                  account_number: { type: 'string', example: '+250788112233' },
                  account_name: { type: 'string', example: 'Kigali Tech Hub MTN MoMo Pay' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Payout request registered' } },
      },
    },
    '/api/v1/disputes': {
      get: {
        summary: 'List Customer Disputes (Admin)',
        responses: { '200': { description: 'List of disputes' } },
      },
    },
    '/api/v1/hero-slides': {
      get: {
        summary: 'List Homepage Hero Slides',
        responses: { '200': { description: 'List of hero slides' } },
      },
    },
  },
};

// HTML Template for Swagger UI
const swaggerUiHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nexora REST API — Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <style>
    body { margin: 0; padding: 0; background: #0f172a; color: #fff; font-family: system-ui, sans-serif; }
    .swagger-ui .topbar { background-color: #020617; border-bottom: 1px solid #1e293b; padding: 12px 0; }
    .swagger-ui .topbar .download-url-wrapper { display: none !important; }
    .header-branding { display: flex; align-items: center; gap: 12px; max-width: 1460px; margin: 0 auto; padding: 0 20px; }
    .logo-badge { width: 38px; height: 38px; background: linear-gradient(135deg, #16a34a, #14b8a6); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 20px; color: #fff; }
    .logo-title { font-size: 22px; font-weight: 900; color: #fff; text-decoration: none; }
    .logo-tag { background: #f59e0b; color: #0f172a; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; margin-left: 6px; text-transform: uppercase; }
    .swagger-ui { max-width: 1460px; margin: 20px auto; padding: 0 20px; background: #ffffff; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; }
  </style>
</head>
<body>
  <div class="swagger-ui">
    <div class="topbar">
      <div class="header-branding" style="padding: 16px;">
        <div class="logo-badge">N</div>
        <span class="logo-title">Nexora Rwanda REST API <span class="logo-tag">Swagger UI Docs</span></span>
      </div>
    </div>
    <div id="swagger-ui"></div>
  </div>

  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: '/api/docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>
`;

// Helper to parse query params
function parseUrl(reqUrl) {
  const [pathname, queryString] = (reqUrl || '').split('?');
  const params = {};
  if (queryString) {
    queryString.split('&').forEach(pair => {
      const [k, v] = pair.split('=');
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
  }
  return { pathname, params };
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const { pathname, params } = parseUrl(req.url);

  // --- Swagger UI Documentation Routes ---
  if (pathname === '/api/docs' || pathname === '/api/docs/' || pathname === '/api/docs/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(swaggerUiHtml);
    return;
  }

  if (pathname === '/api/docs/openapi.json') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(openApiSpec, null, 2));
    return;
  }

  // --- AUTH APIS & RESEND PROXY ---
  if (pathname === '/api/send-otp' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { email, userName, code } = JSON.parse(body);

        const emailData = JSON.stringify({
          from: 'Nexora Verification <onboarding@resend.dev>',
          to: [email],
          subject: `${code} is your Nexora Email Verification Code`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background-color: #0f172a; border-radius: 24px; color: #ffffff;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #16a34a, #14b8a6); border-radius: 16px; font-weight: 900; font-size: 24px; color: white; text-align: center; line-height: 48px;">N</div>
                <h1 style="margin: 12px 0 4px 0; font-size: 26px; font-weight: 800; color: #ffffff;">Nexora Rwanda</h1>
                <p style="margin: 0; font-size: 13px; color: #94a3b8;">Premier Multi-Vendor Marketplace</p>
              </div>

              <div style="background-color: #1e293b; border-radius: 20px; padding: 24px; border: 1px solid #334155; margin-bottom: 24px;">
                <h2 style="margin: 0 0 8px 0; font-size: 18px; color: #f8fafc;">Muraho ${userName || 'User'},</h2>
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                  Thank you for signing up for Nexora! Please use the 6-digit verification code below to complete your registration:
                </p>

                <div style="background-color: #0f172a; border: 2px dashed #22c55e; border-radius: 16px; padding: 18px; text-align: center; margin-bottom: 20px;">
                  <span style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #4ade80; font-family: monospace;">${code}</span>
                </div>

                <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                  This code expires in 10 minutes.
                </p>
              </div>

              <div style="text-align: center; font-size: 11px; color: #64748b;">
                © 2026 Nexora Rwanda Inc. • Kigali Innovation City, Rwanda
              </div>
            </div>
          `
        });

        const options = {
          hostname: 'api.resend.com',
          path: '/emails',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(emailData)
          }
        };

        const resendReq = https.request(options, (resendRes) => {
          let resendBody = '';
          resendRes.on('data', d => { resendBody += d; });
          resendRes.on('end', () => {
            console.log(`[Resend API Status ${resendRes.statusCode}]:`, resendBody);
            res.writeHead(resendRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(resendBody);
          });
        });

        resendReq.on('error', (e) => {
          console.error('[Resend Request Error]:', e);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        });

        resendReq.write(emailData);
        resendReq.end();

      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });
    return;
  }

  if (pathname === '/api/v1/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const newUser = { id: `user-${Date.now()}`, name: data.name || 'New User', email: data.email, phone: data.phone, role: data.role || 'buyer', verified: true };
      USERS.push(newUser);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'pending_verification', message: 'User registered. Resend OTP code dispatched.', user: newUser }));
    });
    return;
  }

  if (pathname === '/api/v1/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const user = USERS.find(u => u.email === data.identifier || u.phone === data.identifier) || USERS[0];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'authenticated', user, accessToken: 'jwt_access_token_demo_15m', expiresIn: 900 }));
    });
    return;
  }

  if (pathname === '/api/v1/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: USERS.length, users: USERS }));
    return;
  }

  // --- PRODUCTS REST APIS (2,000+ Items) ---
  if (pathname === '/api/v1/products' && req.method === 'GET') {
    let result = [...PRODUCTS];

    if (params.category) {
      result = result.filter(p => p.category_slug === params.category);
    }
    if (params.shopId) {
      result = result.filter(p => p.shop_id === params.shopId);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    const page = parseInt(params.page || '1', 10);
    const limit = parseInt(params.limit || '20', 10);
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      total: result.length,
      page,
      limit,
      totalPages: Math.ceil(result.length / limit),
      products: paginated,
    }));
    return;
  }

  if (pathname === '/api/v1/products' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const newProd = {
        id: `prod-custom-${Date.now()}`,
        shop_id: data.shop_id || 'shop-1',
        shop_name: 'Kigali Tech Hub',
        category_id: data.category_id || 'cat-1',
        category_slug: 'phones-accessories',
        title: data.title || 'Custom Product',
        description: data.description || 'Description...',
        price: Number(data.price || 10000),
        sku: data.sku || `SKU-${Date.now()}`,
        stock: Number(data.stock || 10),
        status: 'active',
        images: data.images || ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"],
        rating_avg: 5.0,
        review_count: 0,
        tags: ['custom'],
        created_at: new Date().toISOString(),
      };
      PRODUCTS.unshift(newProd);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Product listed successfully', product: newProd }));
    });
    return;
  }

  // --- SHOPS APIS (50+ Merchant Storefronts) ---
  if (pathname === '/api/v1/shops' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: SHOPS.length, shops: SHOPS }));
    return;
  }

  // --- CATEGORIES APIS ---
  if (pathname === '/api/v1/categories' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: CATEGORIES.length, categories: CATEGORIES }));
    return;
  }

  if (pathname === '/api/v1/categories' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const newCat = { id: `cat-${Date.now()}`, name_en: data.name_en, name_rw: data.name_rw, name_fr: data.name_fr, slug: data.slug, icon: 'Tag', product_count: 0 };
      CATEGORIES.push(newCat);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Category created', category: newCat }));
    });
    return;
  }

  // --- ORDERS APIS ---
  if (pathname === '/api/v1/orders' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: ORDERS.length, orders: ORDERS }));
    return;
  }

  if (pathname === '/api/v1/orders' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const newOrder = {
        id: `ORD-2026-${Math.floor(1000 + Math.random() * 8999)}`,
        buyer_id: 'user-demo-1',
        buyer_name: data.buyer_name || 'Jean-Luc Rutaremara',
        buyer_phone: data.buyer_phone || '+250 788 554 321',
        shop_id: data.shop_id || 'shop-1',
        shop_name: 'Kigali Tech Hub',
        status: 'pending',
        subtotal: data.total || 420000,
        delivery_fee: 2000,
        total: (data.total || 420000) + 2000,
        payment_method: data.payment_method || 'momo_mtn',
        payment_status: 'paid',
        district: data.district || 'Gasabo',
        sector: data.sector || 'Kimironko',
        cell: data.cell || 'Bibare',
        tracking_code: `NXR-TRK-${Math.floor(10000 + Math.random() * 89999)}`,
        created_at: new Date().toISOString(),
      };
      ORDERS.unshift(newOrder);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Order created & MTN MoMo push initiated', order: newOrder }));
    });
    return;
  }

  // --- PAYOUTS APIS ---
  if (pathname === '/api/v1/payouts' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: PAYOUTS.length, payouts: PAYOUTS }));
    return;
  }

  if (pathname === '/api/v1/payouts' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const newPayout = { id: `pay-${Date.now()}`, shop_id: data.shop_id || 'shop-1', shop_name: 'Kigali Tech Hub', amount: data.amount || 500000, method: data.method || 'momo', account_number: data.account_number || '+250788112233', status: 'pending', requested_at: new Date().toISOString() };
      PAYOUTS.unshift(newPayout);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Payout request registered', payout: newPayout }));
    });
    return;
  }

  // --- DISPUTES APIS ---
  if (pathname === '/api/v1/disputes' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: DISPUTES.length, disputes: DISPUTES }));
    return;
  }

  // --- HERO SLIDES APIS ---
  if (pathname === '/api/v1/hero-slides' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: HERO_SLIDES.length, hero_slides: HERO_SLIDES }));
    return;
  }

  // --- STATIC FRONTEND (SPA) ---
  if (req.method === 'GET') {
    let urlPath = pathname === '/' ? '/index.html' : pathname;
    try {
      urlPath = decodeURIComponent(urlPath);
    } catch (e) {
      urlPath = '/index.html';
    }

    let filePath = path.join(STATIC_DIR, urlPath);
    if (!filePath.startsWith(STATIC_DIR)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Forbidden' }));
      return;
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(STATIC_DIR, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint Not Found' }));
});

server.listen(PORT, () => {
  console.log(`Nexora server running on http://localhost:${PORT}`);
  console.log(`Swagger UI Documentation available at http://localhost:${PORT}/api/docs`);
});
