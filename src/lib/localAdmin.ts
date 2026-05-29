/**
 * Local-admin credentials (client-only).
 *
 * This is the single place to change the admin ID / password / security code
 * for the "Admin" tab on /login. It bypasses Supabase entirely so the admin
 * can always get into the dashboard even when RLS policies or env vars are
 * misconfigured.
 *
 * NOTE: These values ship in the client bundle — treat this as a front-end
 * gate, not server security. Actual data writes still need the Supabase
 * credentials + RLS to be configured separately.
 */
export const LOCAL_ADMIN = {
  id: 'Admin2020',
  password: 'LegalAssociates2',
  code: '143737',
} as const;

/**
 * Backing Supabase admin account.
 *
 * When the local-admin pair above is entered, the app *also* signs into
 * Supabase with these credentials so that:
 *   - auth.uid() is set on every DB request,
 *   - RLS policies that rely on public.is_admin() return TRUE,
 *   - therefore admin writes (site_content, products, orders) succeed.
 *
 * Required setup (one-time):
 *   1. In Supabase → Authentication → Users → "Add user" → create
 *      admin@legalassociatesodisha.com with the password below.
 *   2. SQL editor → run:
 *        INSERT INTO public.admin_users (user_id, admin_level)
 *        SELECT id, 'super_admin' FROM auth.users
 *        WHERE email = 'admin@legalassociatesodisha.com'
 *        ON CONFLICT (user_id) DO UPDATE SET admin_level = 'super_admin';
 *   3. (Optional) Override these defaults via Vercel env vars
 *        VITE_ADMIN_BACKING_EMAIL, VITE_ADMIN_BACKING_PASSWORD,
 *      then redeploy without cache.
 */
export const ADMIN_BACKING = {
  email:
    (import.meta.env.VITE_ADMIN_BACKING_EMAIL as string | undefined) ||
    'admin@legalassociatesodisha.com',
  password:
    (import.meta.env.VITE_ADMIN_BACKING_PASSWORD as string | undefined) ||
    'LegalAssociates2#Admin',
} as const;

/** localStorage key used to persist the bypass session. */
export const LOCAL_ADMIN_KEY = 'la_local_admin_session';

export interface LocalAdminSession {
  isLocalAdmin: true;
  id: string;
  loggedInAt: string;
}

export function readLocalAdminSession(): LocalAdminSession | null {
  try {
    const raw = localStorage.getItem(LOCAL_ADMIN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LocalAdminSession;
    return parsed?.isLocalAdmin ? parsed : null;
  } catch {
    return null;
  }
}

export function writeLocalAdminSession(id: string): void {
  const session: LocalAdminSession = {
    isLocalAdmin: true,
    id,
    loggedInAt: new Date().toISOString(),
  };
  localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(session));
}

export function clearLocalAdminSession(): void {
  localStorage.removeItem(LOCAL_ADMIN_KEY);
}

/** Validate typed credentials against the configured local admin. */
export function checkLocalAdmin(id: string, password: string, code: string): boolean {
  return (
    id.trim() === LOCAL_ADMIN.id &&
    password === LOCAL_ADMIN.password &&
    code.trim() === LOCAL_ADMIN.code
  );
}
