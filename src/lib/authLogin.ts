/**
 * Client wrapper around /api/auth/login.
 *
 * Returns a normalized result the UI can branch on. The wrapper:
 *  - generates an empty `honeypot` and a `formStartedAt` timestamp captured
 *    by the form (so bot heuristics work),
 *  - tracks consecutive failure count in sessionStorage so the page can
 *    auto-redirect after 5 tries (server is the real authority — this is
 *    purely client UX as requested by the spec),
 *  - installs the returned Supabase session via supabase.auth.setSession on
 *    success so the rest of the app behaves identically to the old flow.
 */

import { supabase } from '@/lib/supabaseClient';

const FAIL_KEY = 'la_loginFailCount';
const ADMIN_FAIL_KEY = 'la_adminLoginFailCount';
export const CLIENT_FAIL_LIMIT = 5;

export type LoginInput = {
  email: string;
  password: string;
  asAdmin?: boolean;
  honeypot: string;
  formStartedAt: number;
};

export type LoginOutcome =
  | { ok: true; user: { id?: string; email?: string } }
  | { ok: false; error: string; shouldRedirectHome: boolean; locked: boolean };

function readFailCount(asAdmin?: boolean): number {
  try {
    const raw = sessionStorage.getItem(asAdmin ? ADMIN_FAIL_KEY : FAIL_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch { return 0; }
}

function writeFailCount(n: number, asAdmin?: boolean) {
  try {
    sessionStorage.setItem(asAdmin ? ADMIN_FAIL_KEY : FAIL_KEY, String(n));
  } catch { /* ignore quota errors */ }
}

export function clearFailCount(asAdmin?: boolean) {
  try {
    sessionStorage.removeItem(asAdmin ? ADMIN_FAIL_KEY : FAIL_KEY);
  } catch { /* noop */ }
}

export async function login(input: LoginInput): Promise<LoginOutcome> {
  const asAdmin = !!input.asAdmin;

  let resp: Response;
  try {
    resp = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  } catch (e: any) {
    return {
      ok: false,
      error: 'Network error. Please try again.',
      shouldRedirectHome: false,
      locked: false,
    };
  }

  let json: any = {};
  try { json = await resp.json(); } catch { /* ignore */ }

  if (resp.ok && json?.ok && json?.session) {
    const { error: setErr } = await supabase.auth.setSession({
      access_token: json.session.access_token,
      refresh_token: json.session.refresh_token,
    });
    if (setErr) {
      return {
        ok: false,
        error: 'Signed in, but the session could not be installed. Please try again.',
        shouldRedirectHome: false,
        locked: false,
      };
    }
    clearFailCount(asAdmin);
    return { ok: true, user: json.user || {} };
  }

  // Failure — increment the silent client counter.
  const next = readFailCount(asAdmin) + 1;
  writeFailCount(next, asAdmin);
  const shouldRedirectHome = next >= CLIENT_FAIL_LIMIT;
  if (shouldRedirectHome) clearFailCount(asAdmin);

  return {
    ok: false,
    error: typeof json?.error === 'string'
      ? json.error
      : 'We could not sign you in. Please check your email and password and try again.',
    shouldRedirectHome,
    locked: !!json?.locked,
  };
}
