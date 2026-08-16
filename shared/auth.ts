const encoder = new TextEncoder();

export const OTP_ITERATIONS = 100_000;
export const OTP_LIFETIME_MS = 10 * 60 * 1000;
export const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

export async function hashPassword(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(salt), iterations: OTP_ITERATIONS },
    key,
    256
  );
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, salt: string, expectedHash: string): Promise<boolean> {
  const actual = await hashPassword(password, salt);
  return actual === expectedHash;
}

export function randomSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function isoDate(offsetMs = 0): string {
  return new Date(Date.now() + offsetMs).toISOString();
}

export function slugify(text: string): string {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'shop';
}

export async function getSessionUser(
  env: { DB: any },
  request: Request
): Promise<{ id: string; name: string; email: string; phone: string; role: string } | null> {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  const row = await env.DB.prepare(
    'SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > ?'
  )
    .bind(token, new Date().toISOString())
    .first();
  return row ?? null;
}

export async function sendOtpEmail(
  env: { RESEND_API_KEY?: string },
  email: string,
  userName: string,
  code: string
): Promise<{ ok: boolean; message?: string }> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, message: 'Server missing RESEND_API_KEY.' };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Nexora Verification <onboarding@resend.dev>',
      to: [email],
      subject: `${code} is your Nexora Email Verification Code`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background-color: #0f172a; border-radius: 24px; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #16a34a, #14b8a6); border-radius: 16px; font-weight: 900; font-size: 24px; color: white; text-align: center; line-height: 48px;">N</div>
          <h1 style="margin: 12px 0 4px 0; font-size: 26px; font-weight: 800; color: #ffffff;">Nexora Rwanda</h1>
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">Premier Multi-Vendor Marketplace</p>
        </div>
        <div style="background-color: #1e293b; border-radius: 20px; padding: 24px; border: 1px solid #334155; margin-bottom: 24px;">
          <h2 style="margin: 0 0 8px 0; font-size: 18px; color: #f8fafc;">Muraho ${userName || 'User'},</h2>
          <p style="margin: 0 0 20px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
            Thank you for signing up for Nexora! Please use the 6-digit verification code below to complete your registration:
          </p>
          <div style="background-color: #0f172a; border: 2px dashed #22c55e; border-radius: 16px; padding: 18px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #4ade80; font-family: monospace;">${code}</span>
          </div>
          <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
            This code expires in 10 minutes.
          </p>
        </div>
        <div style="text-align: center; font-size: 11px; color: #64748b;">
          © 2026 Nexora Rwanda Inc. • Kigali Innovation City, Rwanda
        </div>
      </div>
    `,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    return { ok: false, message: text };
  }
  return { ok: true };
}
