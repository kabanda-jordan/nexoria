import { Env, mapDispute, jsonResponse, errorResponse } from '../../../../shared/db';

export const onRequestPatch = async ({ request, env, params }: { request: Request; env: Env; params: { id: string } }) => {
  try {
    const existing: any = await env.DB.prepare('SELECT * FROM disputes WHERE id = ?').bind(params.id).first();
    if (!existing) return errorResponse('Dispute not found', 404);

    const data: any = await request.json();
    const status = data.status ?? 'resolved';
    await env.DB.prepare('UPDATE disputes SET status = ? WHERE id = ?').bind(status, params.id).run();
    const row = await env.DB.prepare('SELECT * FROM disputes WHERE id = ?').bind(params.id).first();
    return jsonResponse({ message: 'Dispute updated', dispute: mapDispute(row) });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to update dispute', 500);
  }
};
