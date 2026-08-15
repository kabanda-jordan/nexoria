/// <reference types="vite/client" />

export interface SendVerificationResult {
  success: boolean;
  code: string;
  resendSent: boolean;
  message: string;
  apiDetails?: string;
}

/**
 * Sends a 6-digit email verification code via Resend Proxy endpoint
 */
export async function sendVerificationEmail(recipientEmail: string, userName: string): Promise<SendVerificationResult> {
  // Generate random 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Call server proxy to avoid browser CORS restrictions
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: recipientEmail,
        userName,
        code,
      }),
    });

    const data = await response.json();

    if (response.ok && data.id) {
      return {
        success: true,
        resendSent: true,
        code,
        message: `Email verification code sent to ${recipientEmail} via Resend. (Resend ID: ${data.id})`,
      };
    } else {
      // Handle Resend free-tier domain restriction notice (e.g., onboarding@resend.dev requires recipient to be account owner)
      const resendErrorMsg = data.message || data.name || JSON.stringify(data);
      console.warn('Resend API Info:', data);

      return {
        success: true,
        resendSent: false,
        code,
        message: `Code generated: ${code}`,
        apiDetails: resendErrorMsg.includes('can only send to your own email')
          ? `Resend Free Sandbox Notice: Resend API requires sending to the account owner email when using onboarding@resend.dev. Your code is: ${code}`
          : `Resend Notice: ${resendErrorMsg}`,
      };
    }
  } catch (err: any) {
    console.error('Fetch error calling Resend backend proxy:', err);
    return {
      success: true,
      resendSent: false,
      code,
      message: `Code generated: ${code}`,
      apiDetails: `Local Server Note: Ensure 'node server.js' is running. Your verification code is: ${code}`,
    };
  }
}
