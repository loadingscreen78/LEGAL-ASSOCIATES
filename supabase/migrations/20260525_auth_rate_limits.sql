-- ============================================================
-- AUTH RATE LIMITS
--
-- Server-side counter table consumed by /api/auth/login. The
-- browser must NEVER see this table — RLS is enabled with no
-- policies, so anon/authenticated roles get nothing. Only the
-- Supabase service role (used by the API endpoint) bypasses RLS.
--
-- One row per bucket. A "bucket" identifies the dimension we are
-- limiting on, e.g.:
--    ip:1.2.3.4
--    email:foo@bar.com
--    admin-ip:1.2.3.4
--    admin-email:bar@baz.com
--
-- The composite (multi-bucket) check is the recommended 2025
-- pattern: per-account lockout alone is defeated by credential
-- stuffing, per-IP alone is defeated by botnets. Checking both
-- catches both attacks.
--
-- Idempotent.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.auth_rate_limits (
  bucket             TEXT PRIMARY KEY,
  count              INTEGER NOT NULL DEFAULT 0,
  window_started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  blocked_until      TIMESTAMPTZ,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_blocked_until
  ON public.auth_rate_limits (blocked_until);

ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Drop any pre-existing policies before creating none. Safe to re-run.
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'auth_rate_limits'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.auth_rate_limits', p.policyname);
  END LOOP;
END$$;

-- We deliberately create NO policies. Only the service role bypasses RLS.
