-- ============================================================
-- SIGNUP OTPS — server-only OTP table for email verification.
--
-- The browser must never read or write this. RLS is enabled
-- with NO policies, which means anon + authenticated roles get
-- nothing. Only the service role (used by the API functions)
-- bypasses RLS.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.signup_otps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  otp_hash    TEXT NOT NULL,            -- SHA-256(otp || email)
  attempts    INTEGER NOT NULL DEFAULT 0,
  used        BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_signup_otps_email ON public.signup_otps (email);
CREATE INDEX IF NOT EXISTS idx_signup_otps_created_at ON public.signup_otps (created_at);

ALTER TABLE public.signup_otps ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies first so reruns are clean. We deliberately
-- create NO policies — only the service role bypasses RLS.
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'signup_otps'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.signup_otps', p.policyname);
  END LOOP;
END$$;
