/**
 * POST /api/auth/login
 *
 * Server-mediated sign-in for both regular users and the admin portal.
 *
 * Body: {
 *   email: string,
 *   password: string,
 *   asAdmin?: boolean,        // true when called from the admin login form
 *   honeypot?: string,        // CSS-hidden form field, must be empty
 *   formStartedAt?: number,   // epoch ms when the form was rendered
 * }
 *
 * Behaviour:
 *   - Composite rate limit: per-IP + per-email, two-tiered for admin.
 *   - Bot signals: non-empty honeypot OR sub-second submit time → silent fail.
 *   - On success, returns the Supabase session so the browser can install it.
 *   - All failure responses are intentionally identical and time-padded so
 *     attackers can't fingerprint between "wrong password", "rate limited",
 *     "no such email", or "honeypot tripped".
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from '@supabase/supabase-js';
import { peek, recordFailure, recordSuccess, clientIp } from '../_rateLimit';

export const config = { runtime: 'nodejs' };

type VercelRequest = IncomingMessage & { body?: any; method?: string };
type VercelResponse = ServerResponse & {
  status: (n: number) => VercelResponse;
  json: (body: any) => VercelResponse;
};

const USER_LIMIT = 5;
const USER_WINDOW = 15 * 60;  // seconds
const USER_BLOCK = 15 * 60;

const ADMIN_LIMIT = 3;
const ADMIN_WINDOW = 15 * 60;
const ADMIN_BLOCK = 30 * 60;

const MIN_FORM_AGE_MS = 800;  // legitimate humans take > 0.8s to fill the form
const MIN_RESPONSE_MS = 350;  // pad responses so timing leaks nothing

const GENERIC_ERROR =
  'We could not sign you in. Please check your email and password and try again.';

async function pad(start: number) {
  const elapsed = Date.now() - start;
  const wait = Math.max(0, MIN_RESPONSE_MS - elapsed);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startedAt = Date.now();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ---- env -----------------------------------------------------------------
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SERVICE_ROLE) {
    console.error('[login] missing env');
    await pad(startedAt);
    return res.status(500).json({ error: GENERIC_ERROR });
  }

  // ---- body ----------------------------------------------------------------
  let body: any = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');
  const asAdmin = Boolean(body?.asAdmin);
  const honeypot = String(body?.honeypot || '').trim();
  const formStartedAt = Number(body?.formStartedAt || 0);

  if (!email || !password) {
    await pad(startedAt);
    return res.status(401).json({ error: GENERIC_ERROR });
  }

  // ---- bot signals (silent) -----------------------------------------------
  // 1. Honeypot field must be empty. If a script blindly fills every input,
  //    this catches it without affecting real users (the field is hidden).
  // 2. Form must be at least ~0.8s old. Auto-submission is faster than humans.
  // We log nothing user-facing — bots just see the same generic error.
  const isLikelyBot =
    honeypot.length > 0 ||
    (formStartedAt > 0 && Date.now() - formStartedAt < MIN_FORM_AGE_MS);

  if (isLikelyBot) {
    console.warn('[login] bot signals tripped', {
      ipMasked: clientIp(req).split('.').slice(0, 3).join('.') + '.x',
      hadHoneypot: honeypot.length > 0,
      tooFast: formStartedAt > 0 && Date.now() - formStartedAt < MIN_FORM_AGE_MS,
    });
    await pad(startedAt);
    return res.status(401).json({ error: GENERIC_ERROR });
  }

  // ---- composite rate-limit gate ------------------------------------------
  const ip = clientIp(req);

  const ipBucket = {
    key: asAdmin ? `admin-ip:${ip}` : `ip:${ip}`,
    limit: asAdmin ? ADMIN_LIMIT : USER_LIMIT,
    windowSec: asAdmin ? ADMIN_WINDOW : USER_WINDOW,
    blockSec: asAdmin ? ADMIN_BLOCK : USER_BLOCK,
  };
  const emailBucket = {
    key: asAdmin ? `admin-email:${email}` : `email:${email}`,
    limit: asAdmin ? ADMIN_LIMIT : USER_LIMIT,
    windowSec: asAdmin ? ADMIN_WINDOW : USER_WINDOW,
    blockSec: asAdmin ? ADMIN_BLOCK : USER_BLOCK,
  };

  // Peek (don't increment) — we only count failures from Supabase.
  const [ipPeek, emailPeek] = await Promise.all([peek(ipBucket), peek(emailBucket)]);
  if (!ipPeek.allowed || !emailPeek.allowed) {
    await pad(startedAt);
    return res.status(401).json({ error: GENERIC_ERROR, locked: true });
  }

  // ---- attempt sign-in -----------------------------------------------------
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await sb.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    // Increment both buckets in parallel.
    await Promise.all([recordFailure(ipBucket), recordFailure(emailBucket)]);
    await pad(startedAt);
    return res.status(401).json({ error: GENERIC_ERROR });
  }

  // ---- (optional) admin guard ---------------------------------------------
  // For asAdmin requests, check the admin_users table BEFORE returning the
  // session. If the user exists in auth but is not an admin, treat it as a
  // failure and count it against the buckets so people can't probe the
  // admin form to enumerate accounts.
  if (asAdmin) {
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: adminRow } = await adminClient
      .from('admin_users')
      .select('id')
      .eq('user_id', data.user!.id)
      .maybeSingle();
    if (!adminRow) {
      await Promise.all([recordFailure(ipBucket), recordFailure(emailBucket)]);
      await sb.auth.signOut().catch(() => {});
      await pad(startedAt);
      return res.status(401).json({ error: GENERIC_ERROR });
    }
  }

  // ---- success -------------------------------------------------------------
  await Promise.all([
    recordSuccess(ipBucket.key),
    recordSuccess(emailBucket.key),
  ]);

  await pad(startedAt);
  return res.status(200).json({
    ok: true,
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
      expires_at: data.session.expires_at,
      token_type: data.session.token_type,
    },
    user: { id: data.user?.id, email: data.user?.email },
  });
}
