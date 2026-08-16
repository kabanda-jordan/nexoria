import { jsonResponse, errorResponse, Env } from '../../../../shared/db';
import { hashPassword, randomSalt, generateOtpCode, sendOtpEmail, newId, isoDate, OTP_LIFETIME_MS } from '../../../../shared/auth';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json().catch(() => null);
  if (!body) return errorResponse('Invalid JSON body', 400);

  const { name, email, phone, role, password } = body as Record<string, unknown>;

  if (!name || !email || !phone || !password) {
    return errorResponse('Name, email, phone and password are required.', 400);
  }
  if (typeof password !== 'string' || password.length < 6) {
    return errorResponse('Password must be at least 6 characters.', 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return errorResponse('Please enter a valid email address.', 400);
  }
  const normalizedPhone = String(phone).trim();
  const normalizedRole = role === 'seller' ? 'seller' : 'buyer';
  const normalizedName = String(name).trim();

  const existing = await env.DB.prepare('SELECT id, email, phone FROM users WHERE email = ? OR phone = ? LIMIT 1')
    .bind(normalizedEmail, normalizedPhone)
    .first();
  if (existing) {
    if (existing.email === normalizedEmail) {
      return errorResponse('Email already registered. Please sign in instead.', 409);
    }
    return errorResponse('Phone number already registered. Please sign in instead.', 409);
  }

  await env.DB.prepare('DELETE FROM pending_registrations WHERE email = ?').bind(normalizedEmail).run();

  const salt = randomSalt();
  const passwordHash = await hashPassword(String(password), salt);
  const code = generateOtpCode();
  const id = newId('pend');
  const now = isoDate();

  await env.DB.prepare(
    'INSERT INTO pending_registrations (id, email, code, name, phone, role, password_salt, password_hash, locale, expires_at, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
  )
    .bind(id, normalizedEmail, code, normalizedName, normalizedPhone, normalizedRole, salt, passwordHash, 'rw', isoDate(OTP_LIFETIME_MS), now)
    .run();

  const sent = await sendOtpEmail(env, normalizedEmail, normalizedName, code);
  if (!sent.ok) {
    await env.DB.prepare('DELETE FROM pending_registrations WHERE id = ?').bind(id).run();
    return errorResponse(`Could not send the verification email. ${sent.message}`, 502);
  }

  return jsonResponse({ message: 'Verification code sent to your email.', verificationId: id }, 201);
};
