import { jsonResponse, errorResponse, mapUser, Env } from '../../../../shared/db';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return errorResponse('Missing token.', 401);

  const row = await env.DB.prepare(
    'SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > ?'
  )
    .bind(token, new Date().toISOString())
    .first();
  if (!row) return errorResponse('Invalid or expired session.', 401);

  return jsonResponse({ user: mapUser(row) });
};
