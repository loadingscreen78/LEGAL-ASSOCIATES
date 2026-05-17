/**
 * POST /api/auth/verify-otp
 *
 * Body: { email, otp }
 *
 * Verifies the 6-digit code against signup_otps. On success:
 *   - flags the OTP row as used,
 *   - admin.updateUserById(..., { email_confirm: true }) so the user can
 *     finally sign in with their password.
 *
 * Limits:
 *   - max 5 attempts per code (counter incremented even on miss),
 *   - 10 minute expiry,
 *   - service-role key never leaves env vars.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'nodejs' };

type VercelRequest = IncomingMessage & { body?: any; method?: string };
type VercelResponse = ServerResponse & {
  status: (n: number) => VercelResponse;
  json: (body: any) => VercelResponse;
};

const MAX_ATTEMPTS = 5;

function hashOtp(otp: string, email: string): string {
  return createHash('sha256').update(`${otp}::${email.toLowerCase()}`).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('[verify-otp] missing env');
    return res.status(500).json({ error: 'Email verification is not configured.' });
  }

  let body: any = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const email = String(body?.email || '').trim().toLowerCase();
  const otp = String(body?.otp || '').trim();

  if (!email) return res.status(400).json({ error: 'Email is required.' });
  if (!/^\d{6}$/.test(otp)) return res.status(400).json({ error: 'Enter the 6-digit code from your email.' });

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Pull the latest unused, non-expired code for this email.
  const { data: rows, error: selErr } = await admin
    .from('signup_otps')
    .select('id, otp_hash, attempts, used, expires_at')
    .eq('email', email)
    .eq('used', false)
    .order('created_at', { ascending: false })
    .limit(1);

  if (selErr) {
    console.error('[verify-otp] select failed', selErr);
    return res.status(500).json({ error: 'Could not verify the code. Please try again.' });
  }

  const row = rows?.[0] as any;
  if (!row) {
    return res.status(400).json({ error: 'No active code for this email. Please request a new one.' });
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    await admin.from('signup_otps').update({ used: true }).eq('id', row.id);
    return res.status(400).json({ error: 'This code has expired. Please request a new one.' });
  }

  if (row.attempts >= MAX_ATTEMPTS) {
    await admin.from('signup_otps').update({ used: true }).eq('id', row.id);
    return res.status(429).json({ error: 'Too many attempts. Please request a new code.' });
  }

  const expectedHash = hashOtp(otp, email);
  if (expectedHash !== row.otp_hash) {
    await admin.from('signup_otps').update({ attempts: row.attempts + 1 }).eq('id', row.id);
    const remaining = Math.max(0, MAX_ATTEMPTS - (row.attempts + 1));
    return res.status(400).json({
      error: remaining > 0
        ? `Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} left.`
        : 'Incorrect code. Please request a new one.',
    });
  }

  // Success — mark code used and confirm the user.
  await admin.from('signup_otps').update({ used: true }).eq('id', row.id);

  const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (listErr) {
    console.error('[verify-otp] listUsers failed', listErr);
    return res.status(500).json({ error: 'Could not finalise your account. Please try again.' });
  }
  const user = (list?.users || []).find((u) => (u.email || '').toLowerCase() === email);
  if (!user) {
    return res.status(404).json({ error: 'No matching account. Please sign up again.' });
  }

  const { error: confirmErr } = await admin.auth.admin.updateUserById(user.id, { email_confirm: true });
  if (confirmErr) {
    console.error('[verify-otp] confirm failed', confirmErr);
    return res.status(500).json({ error: 'Could not finalise verification. Please try again.' });
  }

  return res.status(200).json({ ok: true });
}
