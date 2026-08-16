import { Env, mapShop, jsonResponse, errorResponse } from '../../../../shared/db';

export const onRequestGet = async ({ env }: { env: Env }) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM shops ORDER BY created_at DESC').all();
    const shops = results.map(mapShop);
    return jsonResponse({ total: shops.length, shops });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to load shops', 500);
  }
};
