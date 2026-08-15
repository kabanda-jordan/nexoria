import { Shop, Category, Product, Review, Order, HeroSlide, Dispute, Payout } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
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

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title_rw: "Ibikorwa by'Amaboko & Kawa y'u Rwanda",
    title_en: 'Authentic Rwandan Coffee & Handcrafted Arts',
    title_fr: 'Café Authentique du Rwanda & Artisanat',
    subtitle_rw: "Gura bitaziguye ku bahinzi n'abahanzi mu Rwanda hose. Kwishyura kuri MoMo!",
    subtitle_en: 'Buy directly from local Rwandan farmers and artisans. Easy MoMo payment!',
    subtitle_fr: 'Achetez directement auprès des producteurs locaux. Paiement MoMo facile!',
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
    cta_text_rw: 'Tangira kugura ubu',
    cta_text_en: 'Shop Local Now',
    cta_text_fr: 'Explorer les Produits',
    category_slug: 'rwandan-coffee-tea',
    badge: 'IKAHUZA / SPECIAL OFFERS',
    active: true,
  },
  {
    id: 'slide-2',
    title_rw: 'Telefone zigezweho & Laptop ku giciro cyo hasi',
    title_en: 'Latest Smartphones & Laptops with Warranty',
    title_fr: 'Smartphones & Laptops de Pointe Garantie',
    subtitle_rw: "Gura smartphone nshya ikugeraho mu masaha 24 i Kigali n'mu zindi ntara.",
    subtitle_en: 'Get 24-hour fast delivery in Kigali and all provinces with local support.',
    subtitle_fr: 'Livraison express en 24h à Kigali et dans toutes les provinces.',
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop',
    cta_text_rw: 'Reba Telefone',
    cta_text_en: 'Browse Tech Deals',
    cta_text_fr: 'Voir les Offres',
    category_slug: 'phones-accessories',
    badge: 'FLASH SALE 25% OFF',
    active: true,
  },
  {
    id: 'slide-3',
    title_rw: "Imyenda y'Imikenyero, Kitenge & Inkweto",
    title_en: 'Rwandan Kitenge Fashion & Modern Apparel',
    title_fr: 'Mode Kitenge du Rwanda & Style Moderne',
    subtitle_rw: "Amaduka y'ubwiza mu Rwanda azanye imyenda mishya kuri Isoko.",
    subtitle_en: 'Top Rwandan fashion houses listing exclusive summer & ceremonial designs.',
    subtitle_fr: 'Créations exclusives des plus grandes maisons de mode rwandaises.',
    image_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop',
    cta_text_rw: 'Gura Imyenda',
    cta_text_en: 'Explore Fashion',
    cta_text_fr: 'Découvrir la Mode',
    category_slug: 'fashion-apparel',
    badge: 'NEW ARRIVALS',
    active: true,
  }
];

// Generator for 50+ Shops
export function generateShops(): Shop[] {
  const shopNames = [
    { name: "Kigali Tech Hub", district: "Gasabo", category: "Electronics", bio: "Leading seller of original smartphones, laptops, and gaming tech in Rwanda." },
    { name: "Musanze Organic Coffee & Crafts", district: "Musanze", category: "Coffee", bio: "Direct specialty Arabica coffee beans and gorilla wood carvings." },
    { name: "Rubavu Beach Fashion", district: "Rubavu", category: "Fashion", bio: "Custom Kitenge dresses, sandals, and stylish summer apparel." },
    { name: "Nyarugenge Fresh Market", district: "Nyarugenge", category: "Groceries", bio: "Farm-fresh Rwandan avocados, honey, passion fruit, and spices." },
    { name: "Huye Artisanal Weavers", district: "Huye", category: "Crafts", bio: "Handcrafted Agaseke peace baskets and traditional Rwandan decor." },
    { name: "Kicukiro Home Essentials", district: "Kicukiro", category: "Home", bio: "Premium kitchenware, blender sets, and living room furniture." },
    { name: "Gisenyi Gourmet Tea", district: "Rubavu", category: "Tea", bio: "Highland Orthodox black & green tea direct from Pfunda estate." },
    { name: "Kimironko Beauty Supply", district: "Gasabo", category: "Beauty", bio: "Organic shea butter, Rwandan herbal skincare, and hair cosmetics." },
    { name: "Remera Mobile World", district: "Gasabo", category: "Phones", bio: "Fast sales of Samsung, iPhone, Xiaomi, and original chargers." },
    { name: "Gisozi Furniture & Woodwork", district: "Gasabo", category: "Home", bio: "Handmade mahogany dining tables, beds, and office desks." },
    { name: "Kanombe Kidz Store", district: "Kicukiro", category: "Baby", bio: "Safe toys, baby strollers, and clothing for toddlers and infants." },
    { name: "Rwamagana Agri-Supplies", district: "Rwamagana", category: "Agri", bio: "High quality seeds, organic fertilizer, and farm tools." },
    { name: "Rusizi Lake Fish Market", district: "Rusizi", category: "Groceries", bio: "Dried Sambaza fish and fresh Lake Kivu seafood products." },
    { name: "Kacyiru Digital Hub", district: "Gasabo", category: "Electronics", bio: "Monitors, mechanical keyboards, and developer workstation gear." },
    { name: "Nyamirambo Streetwear", district: "Nyarugenge", category: "Fashion", bio: "Urban African street style, hoodies, custom sneakers." },
  ];

  const shops: Shop[] = [];
  const logos = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  ];
  const banners = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&auto=format&fit=crop",
  ];

  for (let i = 0; i < 50; i++) {
    const template = shopNames[i % shopNames.length];
    const shopIndex = i + 1;
    const name = i < shopNames.length ? template.name : `${template.name} Branch #${Math.floor(i / shopNames.length) + 1}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    shops.push({
      id: `shop-${shopIndex}`,
      owner_id: `owner-${shopIndex}`,
      name: name,
      slug: slug,
      logo_url: logos[i % logos.length],
      banner_url: banners[i % banners.length],
      bio: template.bio,
      phone: `+250 78${Math.floor(1000000 + Math.random() * 8999999)}`,
      whatsapp: `+25078${Math.floor(1000000 + Math.random() * 8999999)}`,
      tin_number: `TIN-109${1000 + shopIndex}`,
      status: i === 4 ? 'pending' : (i === 12 ? 'suspended' : 'approved'),
      rating_avg: parseFloat((4.2 + (Math.random() * 0.75)).toFixed(1)),
      review_count: Math.floor(12 + Math.random() * 240),
      district: template.district,
      verified: true,
      created_at: new Date(Date.now() - Math.random() * 180 * 86400000).toISOString(),
    });
  }

  return shops;
}

// Helper product templates across 10 categories
const PRODUCT_TEMPLATES = [
  {
    catId: 'cat-1',
    category_slug: 'phones-accessories',
    items: [
      { title: "Samsung Galaxy A55 5G (8GB/256GB)", price: 420000, img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop", desc: "Original Samsung Galaxy A55 with 1-year MTN warranty. Awesome Camera and long-lasting battery." },
      { title: "iPhone 15 Pro Max 256GB Natural Titanium", price: 1450000, img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop", desc: "Brand new Apple iPhone 15 Pro Max. Unlocked for MTN and Airtel Rwanda SIM cards." },
      { title: "Xiaomi Redmi Note 13 Pro+ 5G", price: 340000, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop", desc: "Fast charging 120W smartphone with 200MP camera sensor." },
      { title: "Anker Fast Charger 65W GaN II Dual Port", price: 45000, img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop", desc: "Super fast charger for smartphones and USB-C laptops." },
      { title: "Oraimo FreePods 4 Noise Cancelling Earbuds", price: 35000, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop", desc: "36-hour battery life with heavy bass tuned for music lovers." }
    ]
  },
  {
    catId: 'cat-2',
    category_slug: 'electronics-computers',
    items: [
      { title: 'MacBook Pro 14" M3 Chip 16GB RAM 512GB', price: 2150000, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop", desc: "Powerful Apple Silicon M3 laptop ideal for software developers and content creators." },
      { title: "Dell XPS 15 Intel Core i7 32GB RAM RTX 4060", price: 1850000, img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop", desc: "Premium OLED touchscreen laptop with heavy graphics processing capability." },
      { title: 'Samsung 55" Crystal UHD 4K Smart TV', price: 680000, img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=600&auto=format&fit=crop", desc: "Smart 4K television with built-in YouTube, Netflix, and AirPlay." },
      { title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones", price: 410000, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop", desc: "Industry-leading noise cancellation headphones with premium sound quality." }
    ]
  },
  {
    catId: 'cat-4',
    category_slug: 'rwandan-coffee-tea',
    items: [
      { title: "Gorilla's Coffee Whole Arabica Beans (500g)", price: 8500, img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=600&auto=format&fit=crop", desc: "100% Bourbon Arabica grown in Huye and Musanze volcanic soil." },
      { title: "Musanze Single Origin Roasted Ground Coffee (1kg)", price: 15000, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop", desc: "Rich floral notes, dark roast ground coffee." },
      { title: "Pfunda Tea Estate Premium Black Tea Leaves (250g)", price: 4500, img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop", desc: "Aromatic highland black tea harvest from Lake Kivu ridge." },
      { title: "Rwanda Organic Herbal Lemongrass Tea (20 bags)", price: 3800, img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop", desc: "Refreshing caffeine-free organic infusion." }
    ]
  },
  {
    catId: 'cat-5',
    category_slug: 'artisanal-crafts',
    items: [
      { title: "Handwoven Agaseke Peace Basket (Large)", price: 25000, img: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=600&auto=format&fit=crop", desc: "Traditional Rwandan peace basket handwoven by women artisans in Huye." },
      { title: "Imigongo Traditional Geometric Wall Art Panel", price: 48000, img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop", desc: "Authentic eastern province Imigongo art made using natural earth pigments." },
      { title: "Carved Wooden Mountain Gorilla Statue (Jacaranda)", price: 32000, img: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop", desc: "Detailed wood carving celebrating Volcanoes National Park gorillas." }
    ]
  },
  {
    catId: 'cat-3',
    category_slug: 'fashion-apparel',
    items: [
      { title: "Modern Kitenge Tailored Umushanana Set", price: 85000, img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop", desc: "Elegant ceremonial attire for weddings and cultural celebrations." },
      { title: "African Print Wax Cotton Shirt (Men)", price: 28000, img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop", desc: "Vibrant custom fit Kitenge shirt." },
      { title: "Handmade Rwandan Leather Sandals", price: 18000, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop", desc: "Durable genuine leather sandals crafted in Kigali." }
    ]
  },
  {
    catId: 'cat-6',
    category_slug: 'home-kitchen',
    items: [
      { title: "Ninja Professional 1000W Blender System", price: 135000, img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=600&auto=format&fit=crop", desc: "Heavy duty smoothie and spice blender for home and commercial use." },
      { title: "Non-Stick Cookware Set (7 Pieces Granite Coating)", price: 82000, img: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=600&auto=format&fit=crop", desc: "Scratch resistant frying pans and pots set." }
    ]
  }
];

// Generator for 2000+ Products
export function generate2000Products(shops: Shop[]): Product[] {
  const products: Product[] = [];
  let counter = 1;

  const totalTarget = 2050;

  while (products.length < totalTarget) {
    const tGroup = PRODUCT_TEMPLATES[counter % PRODUCT_TEMPLATES.length];
    const template = tGroup.items[counter % tGroup.items.length];
    const shop = shops[counter % shops.length];
    
    const uniqueSuffix = counter > 25 ? ` - Ed. #${counter}` : '';
    const basePrice = template.price + Math.floor((Math.random() * 0.2 - 0.1) * template.price);
    const roundedPrice = Math.round(basePrice / 500) * 500;
    
    products.push({
      id: `prod-${counter}`,
      shop_id: shop.id,
      shop_name: shop.name,
      category_id: tGroup.catId,
      category_slug: tGroup.category_slug,
      title: `${template.title}${uniqueSuffix}`,
      description: `${template.desc} Sold directly by ${shop.name} in ${shop.district}, Rwanda. Guaranteed quality with fast delivery.`,
      price: roundedPrice,
      original_price: Math.random() > 0.6 ? Math.round((roundedPrice * 1.2) / 500) * 500 : undefined,
      sku: `NXR-SKU-${10000 + counter}`,
      stock: Math.floor(5 + Math.random() * 85),
      status: 'active',
      images: [
        template.img,
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
      ],
      wholesale_tiers: [
        { min_qty: 5, price_per_unit: Math.round((roundedPrice * 0.9) / 500) * 500 },
        { min_qty: 20, price_per_unit: Math.round((roundedPrice * 0.8) / 500) * 500 }
      ],
      variants: [
        { id: `var-${counter}-1`, product_id: `prod-${counter}`, name: "Standard / Default", price_delta: 0, stock: 40, sku: `SKU-${counter}-STD` },
        { id: `var-${counter}-2`, product_id: `prod-${counter}`, name: "Premium Pack", price_delta: 5000, stock: 20, sku: `SKU-${counter}-PRM` }
      ],
      rating_avg: parseFloat((4.1 + Math.random() * 0.85).toFixed(1)),
      review_count: Math.floor(3 + Math.random() * 95),
      tags: ['rwanda', 'isoko', tGroup.category_slug, shop.district.toLowerCase()],
      created_at: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString(),
      featured: counter <= 12 || Math.random() > 0.92,
      flash_deal: counter % 7 === 0,
    });

    counter++;
  }

  return products;
}

// Sample Reviews
export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    product_id: 'prod-1',
    buyer_id: 'buyer-101',
    buyer_name: 'Jean-Paul Nsengiyumva',
    rating: 5,
    comment: 'Yageze i Remera mu masaha 4 gusa! Telefone ni original 100%, nakoresheje MTN MoMo kwishyura.',
    verified_purchase: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'rev-2',
    product_id: 'prod-1',
    buyer_id: 'buyer-102',
    buyer_name: 'Aline Umutoni',
    rating: 5,
    comment: 'Very fast service from Kigali Tech Hub. The camera quality is outstanding!',
    verified_purchase: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'rev-3',
    product_id: 'prod-6',
    buyer_id: 'buyer-103',
    buyer_name: 'Kevine Habimana',
    rating: 5,
    comment: 'Gorilla Coffee beans are super fresh. Roasted last week in Huye!',
    verified_purchase: true,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  }
];

// Initial Orders for tracking demo
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-8891',
    buyer_id: 'buyer-demo',
    buyer_name: 'Eric Kwizera',
    buyer_phone: '+250 788 123 456',
    shop_id: 'shop-1',
    shop_name: 'Kigali Tech Hub',
    status: 'shipped',
    items: [
      {
        id: 'item-1',
        order_id: 'ORD-2026-8891',
        product_id: 'prod-1',
        product_title: 'Samsung Galaxy A55 5G (8GB/256GB)',
        product_image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop',
        qty: 1,
        unit_price: 420000,
        shop_id: 'shop-1'
      }
    ],
    subtotal: 420000,
    delivery_fee: 2000,
    total: 422000,
    payment_method: 'momo_mtn',
    payment_status: 'paid',
    district: 'Gasabo',
    sector: 'Kimironko',
    cell: 'Kibagabaga',
    street_address: 'KG 123 St, House 14',
    tracking_code: 'NXR-TRK-99201',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// Initial Payouts
export const INITIAL_PAYOUTS: Payout[] = [
  {
    id: 'pay-1',
    shop_id: 'shop-1',
    shop_name: 'Kigali Tech Hub',
    amount: 840000,
    method: 'momo',
    account_number: '+250788112233',
    account_name: 'Kigali Tech Hub MTN MoMo Pay',
    status: 'completed',
    requested_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    processed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

// Initial Disputes
export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'disp-1',
    order_id: 'ORD-2026-7712',
    buyer_name: 'Claudine Uwase',
    shop_name: 'Rubavu Beach Fashion',
    reason: 'Wrong size delivered for Kitenge dress',
    status: 'open',
    amount: 28000,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  }
];
