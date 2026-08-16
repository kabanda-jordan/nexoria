import { jsonResponse, errorResponse, mapUser, Env } from '../../../../shared/db';
import { newId, isoDate, SESSION_LIFETIME_MS } from '../../../../shared/auth';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json().catch(() => null);
  if (!body) return errorResponse('Invalid JSON body', 400);

  const { verificationId, code } = body as Record<string, unknown>;
  if (!verificationId || !code) return errorResponse('verificationId and code are required.', 400);

  const row = await env.DB.prepare('SELECT * FROM pending_registrations WHERE id = ?')
    .bind(String(verificationId))
    .first();
  if (!row) return errorResponse('Verification session not found. Please register again.', 404);

  if (new Date(row.expires_at).getTime() < Date.now()) {
    await env.DB.prepare('DELETE FROM pending_registrations WHERE id = ?').bind(String(verificationId)).run();
    return errorResponse('Verification code expired. Please register again.', 410);
  }

  if (String(row.code) !== String(code)) {
    return errorResponse('Invalid verification code. Please check your inbox and try again.', 401);
  }

  const dup = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(row.email).first();
  if (dup) {
    await env.DB.prepare('DELETE FROM pending_registrations WHERE id = ?').bind(String(verificationId)).run();
    return errorResponse('Email already registered. Please sign in instead.', 409);
  }

  const userId = newId('usr');
  const now = isoDate();
  await env.DB.prepare(
    'INSERT INTO users (id, name, email, phone, role, password_salt, password_hash, locale, verified_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
  )
    .bind(userId, row.name, row.email, row.phone, row.role, row.password_salt, row.password_hash, row.locale ?? 'rw', now, now, now)
    .run();

  await env.DB.prepare('DELETE FROM pending_registrations WHERE id = ?').bind(String(verificationId)).run();

  const token = newId('tok');
  await env.DB.prepare('INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?,?,?,?)')
    .bind(token, userId, isoDate(SESSION_LIFETIME_MS), now)
    .run();

  const user = mapUser({ id: userId, name: row.name, email: row.email, phone: row.phone, role: row.role, locale: row.locale ?? 'rw', verified_at: now });

  return jsonResponse({ message: 'Account verified and created.', user, token }, 201);
};
