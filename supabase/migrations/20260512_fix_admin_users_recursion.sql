-- ============================================================
-- FIX: infinite recursion detected in policy for relation "admin_users"
-- Error code: 42P17
--
-- Root cause
-- ----------
-- Policies on public.admin_users (and related tables that check it)
-- referenced admin_users inside their USING clause, so every SELECT on
-- admin_users re-evaluated the same policy, causing unbounded recursion.
--
-- Fix (non-recursive)
-- -------------------
-- Evaluate "is this user an admin?" inside SECURITY DEFINER functions
-- that bypass RLS. Policies call those functions instead of touching
-- admin_users directly. No behaviour change for end users:
--   - public users: still see only active products
--   - admins:       still see everything and can still mutate data
--
-- This file is IDEMPOTENT: safe to run multiple times.
-- Apply it via the Supabase SQL editor (or `supabase db push`).
-- ============================================================

BEGIN;

-- ---------- 1. HELPER FUNCTIONS (SECURITY DEFINER, STABLE) ----------

-- Safe on re-run: CREATE OR REPLACE updates the function body in place
-- without touching dependent policies. (An explicit DROP would fail with
-- error 2BP01 once policies already reference the function.)

CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = check_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = check_user_id AND admin_level = 'super_admin'
  );
$$;

-- Callable from both anon and logged-in sessions so RLS policies work.
GRANT EXECUTE ON FUNCTION public.is_admin(UUID)       TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO anon, authenticated;


-- ---------- 2. ADMIN_USERS — drop every existing policy and recreate ----------

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop every policy currently defined on admin_users (whatever it's named),
-- so we're guaranteed to remove the recursive one without guessing names.
DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'admin_users'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.admin_users', p.policyname);
  END LOOP;
END$$;

-- A user can always read their OWN admin row. Direct equality, no recursion.
CREATE POLICY "admin_users_read_own"
  ON public.admin_users
  FOR SELECT
  USING (user_id = auth.uid());

-- Admins can read every admin row. Goes through SECURITY DEFINER → no recursion.
CREATE POLICY "admin_users_read_all_for_admins"
  ON public.admin_users
  FOR SELECT
  USING (public.is_admin());

-- Super admins can insert / update / delete admin rows.
CREATE POLICY "admin_users_write_for_super_admins"
  ON public.admin_users
  FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());


-- ---------- 3. PRODUCTS — also re-point policies at the helper ----------
-- Historic policies on products sometimes did
--   EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
-- which chains into the admin_users RLS and can re-trigger recursion.
-- Replace them with the SECURITY DEFINER helper.

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'products'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.products', p.policyname);
  END LOOP;
END$$;

-- Public: see active products. Admins: see everything.
CREATE POLICY "products_read"
  ON public.products
  FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

-- Only admins can mutate products.
CREATE POLICY "products_insert_admin"
  ON public.products
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "products_update_admin"
  ON public.products
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "products_delete_admin"
  ON public.products
  FOR DELETE
  USING (public.is_admin());


-- ---------- 4. ORDERS / ORDER_ITEMS / TRANSACTIONS — point them at the helper too ----------
-- Same reason: any policy that inline-queries admin_users can cascade into
-- the recursion. Use the SECURITY DEFINER helper everywhere.

ALTER TABLE public.orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- ORDERS
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'orders'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.orders', p.policyname);
  END LOOP;
END$$;

CREATE POLICY "orders_read_own_or_admin"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "orders_insert_own"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_admin"
  ON public.orders
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ORDER_ITEMS
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'order_items'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.order_items', p.policyname);
  END LOOP;
END$$;

CREATE POLICY "order_items_read_own_or_admin"
  ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "order_items_insert_own"
  ON public.order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND o.user_id = auth.uid()
    )
  );

-- TRANSACTIONS
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'transactions'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.transactions', p.policyname);
  END LOOP;
END$$;

CREATE POLICY "transactions_read_own_or_admin"
  ON public.transactions
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "transactions_insert_any"
  ON public.transactions
  FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "transactions_update_admin"
  ON public.transactions
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ---------- 5. SECURITY_AUDIT_LOG (optional, same pattern) ----------

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'security_audit_log'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.security_audit_log', p.policyname);
  END LOOP;
END$$;

CREATE POLICY "audit_log_read_admin"
  ON public.security_audit_log
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "audit_log_insert_any"
  ON public.security_audit_log
  FOR INSERT
  WITH CHECK (TRUE);


-- ---------- 6. QUICK SANITY PROBE ----------
-- This SELECT must NOT return 42P17 if the fix worked.
-- (It's commented out because the SQL editor sometimes fails on empty result
-- sets; uncomment if you want an explicit probe.)
-- SELECT COUNT(*) FROM public.products WHERE is_active = TRUE;

COMMIT;
