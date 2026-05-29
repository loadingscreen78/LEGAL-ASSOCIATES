import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { AdminUser, Profile } from '@/types/database';
import {
  readLocalAdminSession,
  writeLocalAdminSession,
  clearLocalAdminSession,
  checkLocalAdmin,
  LOCAL_ADMIN,
  ADMIN_BACKING,
  LocalAdminSession,
} from '@/lib/localAdmin';

/**
 * Synthetic user object we hand to React when the user has logged in via the
 * local admin bypass (no Supabase auth). Shape matches the subset of the
 * Supabase User that the app actually reads.
 */
const makeLocalAdminUser = (session: LocalAdminSession): User =>
  ({
    id: 'local-admin',
    email: `${session.id}@local.admin`,
    aud: 'authenticated',
    role: 'authenticated',
    email_confirmed_at: session.loggedInAt,
    created_at: session.loggedInAt,
    updated_at: session.loggedInAt,
    user_metadata: { full_name: 'Administrator', local_admin: true },
    app_metadata: { provider: 'local', local_admin: true },
    identities: [],
  } as unknown as User);

const makeLocalAdminProfile = (session: LocalAdminSession): Profile =>
  ({
    id: 'local-admin',
    user_id: 'local-admin',
    full_name: 'Administrator',
    phone: '',
    address: '',
    pincode: '',
    email_verified: true,
    created_at: session.loggedInAt,
    updated_at: session.loggedInAt,
  } as unknown as Profile);

const makeLocalAdminRecord = (session: LocalAdminSession): AdminUser =>
  ({
    id: 'local-admin',
    user_id: 'local-admin',
    admin_level: 'super_admin',
    permissions: { local: true },
    created_at: session.loggedInAt,
    updated_at: session.loggedInAt,
  } as unknown as AdminUser);

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Local admin bypass — if a previous local-admin session exists in
    // localStorage, hydrate the auth state immediately so protected routes
    // (admin dashboard) don't bounce us back to /login.
    const local = readLocalAdminSession();
    if (local) {
      setUser(makeLocalAdminUser(local));
      setProfile(makeLocalAdminProfile(local));
      setAdminUser(makeLocalAdminRecord(local));
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Ignore Supabase auth changes while a local admin session is active
      if (readLocalAdminSession()) return;

      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setProfile(null);
        setAdminUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError);
      } else if (profileData) {
        setProfile(profileData as Profile);
      }

      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (adminError && adminError.code !== 'PGRST116') {
        console.error('Error loading admin data:', adminError);
      } else if (adminData) {
        setAdminUser(adminData as AdminUser);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string, securityCode?: string) => {
    try {
      setLoading(true);

      // Local admin bypass — if ID/password/securityCode all match the
      // compile-time LOCAL_ADMIN, log the user in without Supabase.
      // This keeps the admin dashboard reachable even when the database
      // is unreachable (missing envs, RLS misconfig, etc.).
      if (
        securityCode !== undefined &&
        checkLocalAdmin(email, password, securityCode)
      ) {
        writeLocalAdminSession(LOCAL_ADMIN.id);
        const localSession = readLocalAdminSession()!;
        const localUser = makeLocalAdminUser(localSession);

        // Also sign into Supabase with the BACKING admin account so that
        // auth.uid() is set on every subsequent request and RLS policies
        // that call public.is_admin() return TRUE. If the backing account
        // doesn't exist or the password is wrong we still let the local
        // admin in (so the UI is usable), but writes will be blocked by
        // RLS until the backing account is created — that's the intended
        // behaviour: the front-end gate works regardless, the database
        // gate stays strict.
        try {
          const { error: backingError } = await supabase.auth.signInWithPassword({
            email: ADMIN_BACKING.email,
            password: ADMIN_BACKING.password,
          });
          if (backingError) {
            console.warn(
              '[admin] Backing Supabase login failed — admin can browse but writes will hit RLS until the backing account exists. Reason:',
              backingError.message
            );
          }
        } catch (e) {
          console.warn('[admin] Backing Supabase login threw, continuing as local admin only:', e);
        }

        // Hydrate React state with the synthetic admin record so the rest
        // of the app sees isAdmin=true regardless of whether the backing
        // login above succeeded.
        setUser(localUser);
        setProfile(makeLocalAdminProfile(localSession));
        setAdminUser(makeLocalAdminRecord(localSession));
        setLoading(false);
        return { data: { user: localUser, session: null }, error: null, isAdmin: true };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Supabase returns the generic "Invalid login credentials" for both
        // wrong-password AND unconfirmed-email. Rewrite the message so the UI
        // can show something accurate instead of confusing the user.
        const raw = (error.message || '').toLowerCase();
        if (raw.includes('email not confirmed') || raw.includes('not confirmed')) {
          const friendly: any = new Error(
            'Your email is not verified yet. Please check your inbox for the verification link.'
          );
          friendly.code = 'email_not_confirmed';
          throw friendly;
        }
        throw error;
      }

      let userIsAdmin = false;

      if (data.user && securityCode) {
        // Check if admin document exists
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (adminError && adminError.code !== 'PGRST116') {
          console.error('Admin verification error:', adminError);
        } else if (adminData) {
          userIsAdmin = true;
        } else {
          // Create admin user for first-time setup
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({
              user_id: data.user.id,
              admin_level: 'super_admin',
              permissions: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (!insertError) {
            userIsAdmin = true;
          }
        }
      }

      // Log authentication event
      try {
        await supabase.from('security_audit_log').insert({
          user_id: data.user?.id,
          action: 'login',
          table_name: 'auth.users',
          record_id: data.user?.id,
          ip_address: null,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        });
      } catch (auditError) {
        console.warn('Failed to log authentication event:', auditError);
      }

      return { data, error: null, isAdmin: userIsAdmin };
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Log failed authentication
      try {
        await supabase.from('security_audit_log').insert({
          user_id: null,
          action: 'failed_login',
          table_name: 'auth.users',
          new_values: { email, error: error.message },
          ip_address: null,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        });
      } catch (auditError) {
        console.warn('Failed to log failed authentication:', auditError);
      }
      
      return { data: null, error, isAdmin: false };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: Partial<Profile>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) throw error;

      // Create profile if user data provided
      if (data.user && userData) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            ...userData,
            email_verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      // If the Supabase project has "Confirm email" disabled, signUp returns
      // a live session → user is logged in immediately. No verify-email step.
      if (data.session) {
        return { data, error: null, needsVerification: false };
      }

      // If "Confirm email" is OFF but no session came back (edge case on some
      // projects), try to sign the user in right now so they land inside the
      // site instead of on the verify-email page.
      try {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (!signInError && signInData.session) {
          return { data: signInData, error: null, needsVerification: false };
        }
      } catch {
        // ignored — fall through to needsVerification = true
      }

      return { data, error: null, needsVerification: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { data: null, error, needsVerification: false };
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) return { error: new Error('No user email') };
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      
      return { error };
    } catch (error: any) {
      console.error('Resend verification error:', error);
      return { error };
    }
  };

  const checkEmailVerification = async () => {
    if (!user) return false;
    
    try {
      const { data: { user: refreshedUser } } = await supabase.auth.getUser();
      return refreshedUser?.email_confirmed_at != null;
    } catch (error) {
      console.error('Error checking email verification:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      // Clear any local-admin bypass session first
      const hadLocal = !!readLocalAdminSession();
      clearLocalAdminSession();
      if (hadLocal) {
        setUser(null);
        setProfile(null);
        setAdminUser(null);
      }
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data as Profile);
      return { data, error: null };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  };

  return {
    user,
    session,
    profile,
    adminUser,
    loading,
    isAdmin: !!adminUser,
    isEmailVerified: user?.email_confirmed_at != null,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resendVerificationEmail,
    checkEmailVerification,
  };
};
