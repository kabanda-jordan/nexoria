import { Env, mapOrder, jsonResponse, errorResponse } from '../../../../shared/db';

export const onRequestGet = async ({ env, params }: { env: Env; params: { id: string } }) => {
  try {
    const row = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(params.id).first();
    if (!row) return errorResponse('Order not found', 404);
    return jsonResponse({ order: mapOrder(row) });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to load order', 500);
  }
};

export const onRequestPatch = async ({ request, env, params }: { request: Request; env: Env; params: { id: string } }) => {
  try {
    const existing: any = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(params.id).first();
    if (!existing) return errorResponse('Order not found', 404);

    const data: any = await request.json();
    const fields: (keyof any)[] = ['status', 'payment_status', 'tracking_code'];
    const updates = fields.filter((f) => data[f] !== undefined);
    if (updates.length === 0) return errorResponse('No updateable fields provided');

    const assignments = updates.map((f) => `${f} = ?`);
    const bind = updates.map((f) => data[f]);
    bind.push(new Date().toISOString(), params.id);

    await env.DB.prepare(`UPDATE orders SET ${assignments.join(', ')}, updated_at = ? WHERE id = ?`).bind(...bind).run();
    const row = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(params.id).first();
    return jsonResponse({ message: 'Order updated successfully', order: mapOrder(row) });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to update order', 500);
  }
};
