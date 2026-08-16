import { json } from '@cloudflare/workers-types';

interface Env {
  RESEND_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const apiKey = env.RESEND_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        message:
          'Server missing RESEND_API_KEY. Set it in the Cloudflare Pages dashboard → Settings → Environment variables.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { email: string; userName?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ message: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email, userName, code } = body;

  const emailData = JSON.stringify({
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
  });

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: emailData,
  });

  const resendBody = await resendRes.text();
  console.log(`[Resend API Status ${resendRes.status}]:`, resendBody);

  return new Response(resendBody, {
    status: resendRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
};
