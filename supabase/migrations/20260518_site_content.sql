-- ============================================================
-- SITE CONTENT TABLE
-- A single JSONB row keyed by id='landing' that holds every
-- editable bit of copy on the home / landing page. Admin edits
-- it from /admin-dashboard/landing-editor; visitors render it
-- from the same row in real time (postgres_changes subscription
-- already wired in the client).
--
-- Idempotent.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.site_content (
  id          TEXT PRIMARY KEY,
  content     JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Drop any prior policies before recreating, so this script is safe to re-run.
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='site_content'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.site_content', p.policyname);
  END LOOP;
END$$;

-- Anyone (including anon visitors) can read the public site copy.
CREATE POLICY "site_content_read_public"
  ON public.site_content
  FOR SELECT
  USING (TRUE);

-- Only admins can write. Uses the SECURITY DEFINER helper from the earlier
-- migration so we don't recurse through admin_users RLS.
CREATE POLICY "site_content_write_admin"
  ON public.site_content
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Seed the landing row if it does not already exist. Empty content means
-- the client falls back to the hard-coded defaults shipped with the app.
INSERT INTO public.site_content (id, content)
VALUES ('landing', '{}'::JSONB)
ON CONFLICT (id) DO NOTHING;

-- Make sure realtime broadcasts updates to the client.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'site_content'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content';
  END IF;
END$$;
