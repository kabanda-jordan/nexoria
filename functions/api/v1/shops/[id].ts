import { Env, mapShop, jsonResponse, errorResponse } from '../../../../shared/db';
import { getSessionUser } from '../../../../shared/auth';

const SHOP_FIELDS = ['name', 'slug', 'bio', 'phone', 'whatsapp', 'tin_number', 'status', 'logo_url', 'banner_url', 'district', 'verified', 'rating_avg', 'review_count'];

export const onRequestGet = async ({ env, params }: { env: Env; params: { id: string } }) => {
  try {
    const row = await env.DB.prepare('SELECT * FROM shops WHERE id = ?').bind(params.id).first();
    if (!row) return errorResponse('Shop not found', 404);
    return jsonResponse({ shop: mapShop(row) });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to load shop', 500);
  }
};

export const onRequestPatch = async ({ request, env, params }: { request: Request; env: Env; params: { id: string } }) => {
  try {
    const existing: any = await env.DB.prepare('SELECT * FROM shops WHERE id = ?').bind(params.id).first();
    if (!existing) return errorResponse('Shop not found', 404);

    const user = await getSessionUser(env, request);
    if (!user) return errorResponse('Authentication required. Please sign in.', 401);
    const isOwner = user.id === existing.owner_id;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return errorResponse('You do not have permission to edit this shop.', 403);
    }

    const data: any = await request.json();
    const fields = SHOP_FIELDS.filter((f) => data[f] !== undefined);
    if (fields.length === 0) return errorResponse('No updateable fields provided');

    if (!isAdmin && fields.includes('status')) {
      return errorResponse('Only admins can change shop status.', 403);
    }

    const assignments = fields.map((f) => `${f} = ?`);
    const bind = fields.map((f) => {
      const v = data[f];
      if (v === true) return 1;
      if (v === false) return 0;
      return v;
    });
    bind.push(params.id);
    await env.DB.prepare(`UPDATE shops SET ${assignments.join(', ')} WHERE id = ?`).bind(...bind).run();
    const row = await env.DB.prepare('SELECT * FROM shops WHERE id = ?').bind(params.id).first();
    return jsonResponse({ message: 'Shop updated successfully', shop: mapShop(row) });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to update shop', 500);
  }
};
