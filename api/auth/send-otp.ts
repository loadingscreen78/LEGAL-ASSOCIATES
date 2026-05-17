/**
 * POST /api/auth/send-otp
 *
 * Body: { email, password, fullName }
 *
 * 1. Creates the Supabase user with email_confirm: false (so they can't sign
 *    in until they verify).
 * 2. Generates a 6-digit OTP, stores SHA-256(otp+email) in signup_otps with a
 *    10-min expiry, and dispatches the OTP through Resend with a dark-themed
 *    email matching the website.
 *
 * The Resend key + the Supabase service-role key live exclusively in env vars.
 * The browser only ever talks to this function.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { createHash, randomInt } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { renderOtpEmail } from '../_otpEmailTemplate';

export const config = { runtime: 'nodejs' };

type VercelRequest = IncomingMessage & { body?: any; method?: string };
type VercelResponse = ServerResponse & {
  status: (n: number) => VercelResponse;
  json: (body: any) => VercelResponse;
};

const OTP_TTL_MINUTES = 10;
const SEND_COOLDOWN_SECONDS = 60;

function hashOtp(otp: string, email: string): string {
  return createHash('sha256').update(`${otp}::${email.toLowerCase()}`).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ---- 1. env --------------------------------------------------------------
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_FROM = process.env.RESEND_FROM || 'Legal Associates <onboarding@resend.dev>';
  const SITE_URL = (process.env.SITE_URL || 'https://www.legalassociatesodisha.com').replace(/\/+$/, '');
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!RESEND_API_KEY || !SUPABASE_URL || !SERVICE_ROLE) {
    console.error('[send-otp] missing env', {
      hasResend: !!RESEND_API_KEY, hasUrl: !!SUPABASE_URL, hasServiceRole: !!SERVICE_ROLE,
    });
    return res.status(500).json({ error: 'Email verification is not configured.' });
  }

  // ---- 2. body -------------------------------------------------------------
  let body: any = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const email: string = String(body?.email || '').trim().toLowerCase();
  const password: string = String(body?.password || '');
  const fullName: string | undefined = body?.fullName ? String(body.fullName).trim() : undefined;

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // ---- 3. cooldown — refuse to spam the same address ---------------------
  const cutoff = new Date(Date.now() - SEND_COOLDOWN_SECONDS * 1000).toISOString();
  const { data: recent } = await admin
    .from('signup_otps')
    .select('id, created_at')
    .eq('email', email)
    .gt('created_at', cutoff)
    .order('created_at', { ascending: false })
    .limit(1);

  if (recent && recent.length > 0) {
    const lastSent = new Date((recent[0] as any).created_at).getTime();
    const wait = Math.ceil((SEND_COOLDOWN_SECONDS * 1000 - (Date.now() - lastSent)) / 1000);
    return res.status(429).json({
      error: `Please wait ${wait} second${wait === 1 ? '' : 's'} before requesting another code.`,
      retryAfter: wait,
    });
  }

  // ---- 4. ensure Supabase auth user exists, unconfirmed ------------------
  // Look up user by email (admin API). If they exist AND are already
  // confirmed, refuse — they should sign in instead. If they exist but are
  // unconfirmed, just refresh their password and continue.
  const { data: list, error: listErr } = await admin.auth.admin.listUsers({
    page: 1, perPage: 200,
  });
  if (listErr) {
    console.error('[send-otp] listUsers failed', listErr);
    return res.status(500).json({ error: 'Could not start verification. Please try again.' });
  }
  const existing = (list?.users || []).find(
    (u) => (u.email || '').toLowerCase() === email
  );

  if (existing) {
    if (existing.email_confirmed_at) {
      return res.status(409).json({
        error: 'An account with this email already exists. Please sign in instead.',
        code: 'already_exists',
      });
    }
    // Update password + metadata, keep email unverified.
    const { error: updErr } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      user_metadata: { full_name: fullName ?? existing.user_metadata?.full_name },
      email_confirm: false,
    });
    if (updErr) {
      console.error('[send-otp] update existing user failed', updErr);
      return res.status(500).json({ error: 'Could not refresh signup. Please try again.' });
    }
  } else {
    const { error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: fullName ? { full_name: fullName } : undefined,
    });
    if (createErr) {
      console.error('[send-otp] createUser failed', createErr);
      return res.status(500).json({
        error: createErr.message || 'Could not create account. Please try again.',
      });
    }
  }

  // ---- 5. generate + persist OTP -----------------------------------------
  const otp = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const otpHash = hashOtp(otp, email);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

  // Invalidate previous codes for this email so the latest is the only valid one.
  await admin.from('signup_otps').update({ used: true }).eq('email', email).eq('used', false);

  const { error: insErr } = await admin.from('signup_otps').insert({
    email,
    otp_hash: otpHash,
    expires_at: expiresAt,
  });
  if (insErr) {
    console.error('[send-otp] otp insert failed', insErr);
    return res.status(500).json({ error: 'Could not store verification code. Please try again.' });
  }

  // ---- 6. dispatch through Resend ----------------------------------------
  const html = renderOtpEmail({
    otp,
    recipientName: fullName,
    expiresInMinutes: OTP_TTL_MINUTES,
    siteUrl: SITE_URL,
  });

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [email],
      subject: `Your Legal Associates verification code: ${otp}`,
      html,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error('[send-otp] resend error', resp.status, text);
    return res.status(502).json({ error: 'Could not send the verification email. Please try again.' });
  }

  return res.status(200).json({
    ok: true,
    expiresInMinutes: OTP_TTL_MINUTES,
    cooldownSeconds: SEND_COOLDOWN_SECONDS,
  });
}
