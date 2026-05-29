/**
 * Composite rate-limit primitive backed by Supabase.
 *
 * One DB call per bucket (CHECK_AND_INCR pattern). On block, the bucket's
 * blocked_until is set forward and the function returns { allowed: false }
 * with the seconds remaining; the caller treats every bucket result and
 * blocks if ANY of them are blocked.
 *
 * Why a Postgres counter, not Redis:
 *   - Zero new infrastructure for the Vercel project.
 *   - Strongly consistent across regions (Vercel functions are stateless).
 *   - Service role key bypasses RLS so the table is invisible to clients.
 *
 * Buckets are intentionally string-keyed so we can compose any dimension
 * later (per-ASN, per-geo, etc.) without schema changes.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfter: number };

interface BucketSpec {
  key: string;          // unique bucket identifier
  limit: number;        // max attempts within the window
  windowSec: number;    // window duration in seconds
  blockSec: number;     // lockout duration once limit is exceeded
}

let cachedAdmin: SupabaseClient | null = null;
function admin() {
  if (cachedAdmin) return cachedAdmin;
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Rate limiter is not configured (missing Supabase env vars).');
  }
  cachedAdmin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedAdmin;
}

/**
 * Inspect one bucket without mutating it. Used at the start of a request
 * to decide whether to even try the underlying operation.
 */
export async function peek(bucket: BucketSpec): Promise<RateLimitResult> {
  const sb = admin();
  const { data, error } = await sb
    .from('auth_rate_limits')
    .select('blocked_until')
    .eq('bucket', bucket.key)
    .maybeSingle();

  if (error || !data) return { allowed: true };
  if (data.blocked_until && new Date(data.blocked_until).getTime() > Date.now()) {
    const retryAfter = Math.ceil(
      (new Date(data.blocked_until).getTime() - Date.now()) / 1000
    );
    return { allowed: false, retryAfter };
  }
  return { allowed: true };
}

/**
 * Record a failed attempt against the bucket and return whether the
 * resulting state is still under-limit. The window slides automatically
 * once it's older than `windowSec`.
 */
export async function recordFailure(bucket: BucketSpec): Promise<RateLimitResult> {
  const sb = admin();
  const now = new Date();
  const windowMs = bucket.windowSec * 1000;

  const { data: row } = await sb
    .from('auth_rate_limits')
    .select('count, window_started_at, blocked_until')
    .eq('bucket', bucket.key)
    .maybeSingle();

  if (!row) {
    await sb.from('auth_rate_limits').insert({
      bucket: bucket.key,
      count: 1,
      window_started_at: now.toISOString(),
      blocked_until: null,
      updated_at: now.toISOString(),
    });
    return { allowed: true };
  }

  // Already locked out — push retry-after.
  if (row.blocked_until && new Date(row.blocked_until).getTime() > now.getTime()) {
    const retryAfter = Math.ceil(
      (new Date(row.blocked_until).getTime() - now.getTime()) / 1000
    );
    return { allowed: false, retryAfter };
  }

  const windowStart = new Date(row.window_started_at).getTime();
  const expired = now.getTime() - windowStart > windowMs;
  const nextCount = expired ? 1 : (row.count ?? 0) + 1;
  const nextWindowStart = expired ? now : new Date(windowStart);

  let blockedUntil: Date | null = null;
  if (nextCount >= bucket.limit) {
    blockedUntil = new Date(now.getTime() + bucket.blockSec * 1000);
  }

  await sb.from('auth_rate_limits').update({
    count: nextCount,
    window_started_at: nextWindowStart.toISOString(),
    blocked_until: blockedUntil ? blockedUntil.toISOString() : null,
    updated_at: now.toISOString(),
  }).eq('bucket', bucket.key);

  if (blockedUntil) {
    return { allowed: false, retryAfter: bucket.blockSec };
  }
  return { allowed: true };
}

/**
 * Reset a bucket on success. Keeps abusers from accumulating across
 * legitimate logins.
 */
export async function recordSuccess(bucketKey: string) {
  const sb = admin();
  await sb.from('auth_rate_limits')
    .delete()
    .eq('bucket', bucketKey);
}

/**
 * Best-effort client IP extraction.
 *  • Vercel sets `x-forwarded-for` and `x-real-ip` for us.
 *  • The leftmost forwarded entry is the original client.
 *  • If everything fails we fall back to "unknown" — the caller should
 *    treat this as a single bucket so we still rate-limit blanket abuse.
 */
export function clientIp(req: { headers: Record<string, any> }): string {
  const xff = (req.headers['x-forwarded-for'] || '') as string;
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return (req.headers['x-real-ip'] as string) || 'unknown';
}
