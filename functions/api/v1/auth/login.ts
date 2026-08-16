import { jsonResponse, errorResponse, mapUser, Env } from '../../../../shared/db';
import { verifyPassword, newId, isoDate, SESSION_LIFETIME_MS } from '../../../../shared/auth';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json().catch(() => null);
  if (!body) return errorResponse('Invalid JSON body', 400);

  const { identifier, password } = body as Record<string, unknown>;
  if (!identifier || !password) return errorResponse('Email/phone and password are required.', 400);

  const normalizedIdentifier = String(identifier).trim().toLowerCase();

  const row = await env.DB.prepare('SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1')
    .bind(normalizedIdentifier, normalizedIdentifier)
    .first();
  if (!row) return errorResponse('No account found with that email or phone.', 404);

  const ok = await verifyPassword(String(password), row.password_salt, row.password_hash);
  if (!ok) return errorResponse('Incorrect password. Please try again.', 401);

  const now = isoDate();
  const token = newId('tok');
  await env.DB.prepare('INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?,?,?,?)')
    .bind(token, row.id, isoDate(SESSION_LIFETIME_MS), now)
    .run();

  return jsonResponse({ user: mapUser(row), token });
};
