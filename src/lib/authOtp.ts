/**
 * Client-side wrappers around the OTP API endpoints.
 * Returns plain { ok, error } shapes so UI doesn't have to duplicate fetch noise.
 */

export async function requestSignupOtp(input: {
  email: string;
  password: string;
  fullName?: string;
}): Promise<{ ok: boolean; error?: string; retryAfter?: number; expiresInMinutes?: number; cooldownSeconds?: number; code?: string }> {
  try {
    const resp = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return {
        ok: false,
        error: json?.error || 'Could not send the verification code.',
        retryAfter: json?.retryAfter,
        code: json?.code,
      };
    }
    return {
      ok: true,
      expiresInMinutes: json?.expiresInMinutes ?? 10,
      cooldownSeconds: json?.cooldownSeconds ?? 60,
    };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Network error. Please try again.' };
  }
}

export async function verifySignupOtp(input: {
  email: string;
  otp: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const resp = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return { ok: false, error: json?.error || 'Could not verify the code.' };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Network error. Please try again.' };
  }
}
