import { Env, mapPayout, jsonResponse, errorResponse } from '../../../../shared/db';

export const onRequestGet = async ({ env }: { env: Env }) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM payouts ORDER BY requested_at DESC').all();
    const payouts = results.map(mapPayout);
    return jsonResponse({ total: payouts.length, payouts });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to load payouts', 500);
  }
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const data: any = await request.json();
    if (!data.shop_id || !data.amount) {
      return errorResponse('shop_id and amount are required');
    }
    const id = data.id || `pay-${Date.now()}`;
    const now = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO payouts (id, shop_id, shop_name, amount, method, account_number, account_name, status, requested_at, processed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        data.shop_id,
        data.shop_name ?? '',
        Number(data.amount),
        data.method ?? 'momo',
        data.account_number ?? '',
        data.account_name ?? '',
        data.status ?? 'pending',
        now,
        null
      )
      .run();
    const row = await env.DB.prepare('SELECT * FROM payouts WHERE id = ?').bind(id).first();
    return jsonResponse({ message: 'Payout request registered', payout: mapPayout(row) }, 201);
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to create payout', 500);
  }
};
