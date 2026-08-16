import { Env, mapOrder, jsonResponse, errorResponse } from '../../../../shared/db';

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const url = new URL(request.url);
    const shopId = url.searchParams.get('shopId');
    const buyerId = url.searchParams.get('buyerId');
    const where: string[] = [];
    const bind: any[] = [];
    if (shopId) {
      where.push('shop_id = ?');
      bind.push(shopId);
    }
    if (buyerId) {
      where.push('buyer_id = ?');
      bind.push(buyerId);
    }
    const whereSql = where.length ? ` WHERE ${where.join(' AND ')}` : '';
    const { results } = await env.DB.prepare(
      `SELECT * FROM orders${whereSql} ORDER BY created_at DESC`
    ).bind(...bind).all();
    const orders = results.map(mapOrder);
    return jsonResponse({ total: orders.length, orders });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to load orders', 500);
  }
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const data: any = await request.json();
    if (!data.shop_id || !data.items || !data.total) {
      return errorResponse('shop_id, items and total are required');
    }
    const id = data.id || `ORD-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    const now = new Date().toISOString();
    const tracking = data.tracking_code || `NXR-TRK-${Math.floor(10000 + Math.random() * 89999)}`;

    await env.DB.prepare(
      `INSERT INTO orders (id, buyer_id, buyer_name, buyer_phone, shop_id, shop_name, status, items, subtotal, delivery_fee, total, payment_method, payment_status, district, sector, cell, street_address, tracking_code, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        data.buyer_id ?? 'buyer-demo',
        data.buyer_name ?? 'Buyer',
        data.buyer_phone ?? '',
        data.shop_id,
        data.shop_name ?? '',
        data.status ?? 'pending',
        JSON.stringify(data.items),
        Number(data.subtotal ?? data.total),
        Number(data.delivery_fee ?? 0),
        Number(data.total),
        data.payment_method ?? 'momo_mtn',
        data.payment_status ?? 'pending',
        data.district ?? '',
        data.sector ?? '',
        data.cell ?? '',
        data.street_address ?? '',
        tracking,
        now,
        now
      )
      .run();
    const row = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
    return jsonResponse({ message: 'Order created successfully', order: mapOrder(row) }, 201);
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to create order', 500);
  }
};
