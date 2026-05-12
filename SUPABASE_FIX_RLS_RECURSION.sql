-- ============================================================
-- FIX: "Failed to fetch products" (HTTP 500)
-- ============================================================
-- Root cause: RLS policies on public.products (and others) call
--   EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
-- But public.admin_users has an RLS SELECT policy that itself does
-- the same EXISTS on admin_users → infinite recursion → Postgres
-- aborts with error "infinite recursion detected in policy" → 500.
--
-- Fix: Move the admin check into a SECURITY DEFINER function that
-- bypasses RLS, and rewrite every dependent policy to call it.
--
-- Run this entire script in Supabase SQL Editor.
-- It is idempotent — safe to run more than once.
-- ============================================================

-- ---- 1. Helper functions (SECURITY DEFINER bypasses RLS safely) ----

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

GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO anon, authenticated;

-- ---- 2. admin_users policies ----

DROP POLICY IF EXISTS "Admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Users can view own admin row" ON public.admin_users;

CREATE POLICY "Users can view own admin row"
  ON public.admin_users FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all admin users"
  ON public.admin_users FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Super admins can manage admin users"
  ON public.admin_users FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- ---- 3. products policies ----

DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- ---- 4. orders policies ----

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- ---- 5. order_items policies ----

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;

CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

-- ---- 6. transactions policies ----

DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON public.transactions;

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can update transactions"
  ON public.transactions FOR UPDATE
  USING (public.is_admin());

-- ---- 7. security_audit_log policies ----

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.security_audit_log;

CREATE POLICY "Admins can view audit logs"
  ON public.security_audit_log FOR SELECT
  USING (public.is_admin());

-- ---- 8. Sanity check (must succeed without recursion errors) ----
-- SELECT id, title, is_active FROM public.products LIMIT 1;
