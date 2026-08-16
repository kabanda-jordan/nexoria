import { Env, mapProduct, jsonResponse, errorResponse } from '../../../../shared/db';
import { getSessionUser } from '../../../../shared/auth';

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const shopId = url.searchParams.get('shopId');
    const featured = url.searchParams.get('featured');
    const flash = url.searchParams.get('flash');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(10000, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10) || 20));

    const where: string[] = ["status = 'active'"];
    const bind: any[] = [];
    if (category) {
      where.push('category_slug = ?');
      bind.push(category);
    }
    if (shopId) {
      where.push('shop_id = ?');
      bind.push(shopId);
    }
    if (featured === '1' || featured === 'true') {
      where.push('featured = 1');
    }
    if (flash === '1' || flash === 'true') {
      where.push('flash_deal = 1');
    }
    if (search) {
      where.push('(title LIKE ? OR description LIKE ? OR tags LIKE ?)');
      const q = `%${search}%`;
      bind.push(q, q, q);
    }

    const whereSql = where.length ? ` WHERE ${where.join(' AND ')}` : '';
    const countRow: any = await env.DB.prepare(`SELECT COUNT(*) AS total FROM products${whereSql}`).bind(...bind).first();
    const total = Number(countRow?.total || 0);

    const { results } = await env.DB.prepare(
      `SELECT * FROM products${whereSql} ORDER BY featured DESC, created_at DESC LIMIT ? OFFSET ?`
    )
      .bind(...bind, limit, (page - 1) * limit)
      .all();

    const products = results.map(mapProduct);
    return jsonResponse({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to load products', 500);
  }
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const data: any = await request.json();
    if (!data.shop_id || !data.title || !data.price) {
      return errorResponse('shop_id, title and price are required');
    }

    const user = await getSessionUser(env, request);
    if (!user) return errorResponse('Authentication required. Please sign in.', 401);
    if (user.role !== 'admin') {
      const shop: any = await env.DB.prepare('SELECT owner_id, status FROM shops WHERE id = ?').bind(data.shop_id).first();
      if (!shop) return errorResponse('Shop not found', 404);
      if (shop.owner_id !== user.id) {
        return errorResponse('You can only list products in your own shop.', 403);
      }
      if (shop.status !== 'approved') {
        return errorResponse('Your shop must be approved before listing products.', 403);
      }
    }

    const id = data.id || `prod-custom-${Date.now()}`;
    const now = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO products (id, shop_id, shop_name, category_id, category_slug, title, description, price, original_price, wholesale_tiers, sku, stock, status, images, variants, rating_avg, review_count, tags, created_at, featured, flash_deal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        data.shop_id,
        data.shop_name ?? null,
        data.category_id ?? 'cat-1',
        data.category_slug ?? 'phones-accessories',
        data.title,
        data.description ?? '',
        Number(data.price),
        data.original_price ?? null,
        data.wholesale_tiers ? JSON.stringify(data.wholesale_tiers) : null,
        data.sku ?? `SKU-${Date.now()}`,
        Number(data.stock ?? 10),
        data.status ?? 'active',
        JSON.stringify(data.images || []),
        data.variants ? JSON.stringify(data.variants) : null,
        5.0,
        0,
        JSON.stringify(data.tags || []),
        now,
        data.featured ? 1 : 0,
        data.flash_deal ? 1 : 0
      )
      .run();
    const row = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
    return jsonResponse({ message: 'Product listed successfully', product: mapProduct(row) }, 201);
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to create product', 500);
  }
};
