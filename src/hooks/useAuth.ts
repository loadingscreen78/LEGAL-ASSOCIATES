import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { AdminUser, Profile } from '@/types/database';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

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
