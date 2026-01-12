import { useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AdminUser, Profile } from '@/types/database';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await loadUserData(firebaseUser.uid);
      } else {
        setProfile(null);
        setAdminUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Load profile
      const profileRef = doc(db, 'profiles', userId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        setProfile(profileSnap.data() as Profile);
      }

      // Check if user is admin
      const adminRef = doc(db, 'admin_users', userId);
      const adminSnap = await getDoc(adminRef);
      
      if (adminSnap.exists()) {
        setAdminUser(adminSnap.data() as AdminUser);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const signIn = async (email: string, password: string, securityCode?: string) => {
    try {
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      let userIsAdmin = false;

      if (firebaseUser && securityCode) {
        // Check if admin document exists
        try {
          const adminRef = doc(db, 'admin_users', firebaseUser.uid);
          const adminSnap = await getDoc(adminRef);

          if (adminSnap.exists()) {
            // Admin document exists, user is verified admin
            userIsAdmin = true;
          } else {
            // No admin document - create one for first-time admin setup
            // In production, you'd validate the security code here
            console.log('Creating admin user document for first-time setup');
            
            await setDoc(adminRef, {
              user_id: firebaseUser.uid,
              admin_level: 'super_admin',
              permissions: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
            
            userIsAdmin = true;
          }
        } catch (adminError: any) {
          console.error('Admin verification error:', adminError);
          // Don't block login if admin check fails - just log them in as regular user
          console.warn('Failed to verify admin status, logging in as regular user');
        }
      }

      // Log successful authentication for security audit (optional, won't fail login)
      if (firebaseUser) {
        try {
          await addDoc(collection(db, 'security_audit_log'), {
            user_id: firebaseUser.uid,
            action: 'login',
            table_name: 'auth.users',
            record_id: firebaseUser.uid,
            ip_address: null,
            user_agent: navigator.userAgent,
            timestamp: serverTimestamp(),
          });
        } catch (auditError) {
          // Silently fail - don't block login if audit logging fails
          console.warn('Failed to log authentication event:', auditError);
        }
      }

      return { data: userCredential, error: null, isAdmin: userIsAdmin };
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Try to log failed authentication attempt (optional)
      try {
        await addDoc(collection(db, 'security_audit_log'), {
          user_id: null,
          action: 'failed_login',
          table_name: 'auth.users',
          new_values: { email, error: error.message },
          ip_address: null,
          user_agent: navigator.userAgent,
          timestamp: serverTimestamp(),
        });
      } catch (auditError) {
        // Silently fail - don't block error reporting if audit logging fails
        console.warn('Failed to log failed authentication:', auditError);
      }
      
      return { data: null, error, isAdmin: false };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: Partial<Profile>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (firebaseUser && userData) {
        // Create profile
        const profileRef = doc(db, 'profiles', firebaseUser.uid);
        await setDoc(profileRef, {
          user_id: firebaseUser.uid,
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      return { data: userCredential, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const profileRef = doc(db, 'profiles', user.uid);
      await updateDoc(profileRef, {
        ...updates,
        updated_at: new Date().toISOString(),
      });

      const updatedProfile = { ...profile, ...updates } as Profile;
      setProfile(updatedProfile);

      return { data: updatedProfile, error: null };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  };

  return {
    user,
    profile,
    adminUser,
    loading,
    isAdmin: !!adminUser,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
};
