import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile, UserRole } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ error: Error | null; needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist yet (e.g., email confirmation flow where INSERT failed)
        // This will be resolved when the user completes onboarding or admin seeds data
        console.warn('Profile not found for user:', userId);
        setProfile(null);
        setRole(null);
        return;
      }

      if (error) throw error;

      setProfile(data as Profile);
      setRole((data as Profile).role);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, name: string, userRole: UserRole) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role: userRole },
        },
      });
      if (error) return { error };

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          role: userRole,
          email,
        });
        if (profileError) return { error: profileError as unknown as Error };

        // If registering as a vet, also create the vets table entry
        if (userRole === 'veterinarian') {
          const { error: vetError } = await supabase.from('vets').insert({
            user_id: data.user.id,
            name,
            specialty: 'General Practice',
            bio: null,
            rating: 0,
            image_url: null,
          });
          if (vetError) {
            console.error('Error creating vet record:', vetError);
            // Non-fatal: profile was created, vet record can be fixed later
          }
        }

        // If session exists (email confirmation disabled), fetch profile immediately
        if (data.session) {
          await fetchProfile(data.user.id);
        }
      }

      // Return whether email confirmation is needed
      const needsConfirmation = !!(data.user && !data.session);
      return { error: null, needsConfirmation };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };

      // After successful login, check if profile exists
      // (It might not if signup failed to insert due to RLS during email confirmation flow)
      if (data.user) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (!existingProfile) {
          // Profile missing — create it now (user is authenticated, RLS will allow)
          const userName = data.user.user_metadata?.name || email.split('@')[0];
          const userRole = (data.user.user_metadata?.role as UserRole) || 'pet_owner';

          await supabase.from('profiles').insert({
            id: data.user.id,
            name: userName,
            role: userRole,
            email,
          });

          // Also create vet record if role is veterinarian
          if (userRole === 'veterinarian') {
            await supabase.from('vets').insert({
              user_id: data.user.id,
              name: userName,
              specialty: 'General Practice',
              bio: null,
              rating: 0,
              image_url: null,
            });
          }
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    setRole(null);
  }

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user.id);
    }
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, role, loading, refreshProfile, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
