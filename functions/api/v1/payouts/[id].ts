import { Env, mapPayout, jsonResponse, errorResponse } from '../../../../shared/db';
import { getSessionUser, isoDate } from '../../../../shared/auth';

export const onRequestPatch = async ({ request, env, params }: { request: Request; env: Env; params: { id: string } }) => {
  try {
    const existing: any = await env.DB.prepare('SELECT * FROM payouts WHERE id = ?').bind(params.id).first();
    if (!existing) return errorResponse('Payout not found', 404);

    const user = await getSessionUser(env, request);
    if (!user) return errorResponse('Authentication required. Please sign in.', 401);
    if (user.role !== 'admin') return errorResponse('Only admins can process payouts.', 403);

    const data: any = await request.json();
    const status = data.status;
    if (status !== 'processed' && status !== 'rejected') {
      return errorResponse('status must be "processed" or "rejected"', 400);
    }

    await env.DB.prepare('UPDATE payouts SET status = ?, processed_at = ? WHERE id = ?')
      .bind(status, isoDate(), params.id)
      .run();

    const row = await env.DB.prepare('SELECT * FROM payouts WHERE id = ?').bind(params.id).first();
    return jsonResponse({ message: `Payout ${status === 'processed' ? 'approved' : 'rejected'}`, payout: mapPayout(row) });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to process payout', 500);
  }
};
