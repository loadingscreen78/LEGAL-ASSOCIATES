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
