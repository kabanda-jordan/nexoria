import { Env, mapDispute, jsonResponse, errorResponse } from '../../../../shared/db';

export const onRequestGet = async ({ env }: { env: Env }) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM disputes ORDER BY created_at DESC').all();
    const disputes = results.map(mapDispute);
    return jsonResponse({ total: disputes.length, disputes });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to load disputes', 500);
  }
};
