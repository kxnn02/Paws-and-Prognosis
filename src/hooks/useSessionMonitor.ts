import { useEffect, useRef, useCallback } from 'react';
import { Alert, AppState } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

/**
 * Monitors the auth session and prompts re-login if the token expires.
 * Also refreshes the session when the app comes back to the foreground.
 */
export function useSessionMonitor() {
  const { session, signOut } = useAuth();
  const appState = useRef(AppState.currentState);

  const handleSessionExpired = useCallback(() => {
    Alert.alert(
      'Session Expired',
      'Your session has expired. Please log in again.',
      [
        {
          text: 'Log In',
          onPress: () => signOut(),
        },
      ],
      { cancelable: false }
    );
  }, [signOut]);

  useEffect(() => {
    // Check on app foreground
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground — try refreshing the session
        if (session) {
          const { error } = await supabase.auth.refreshSession();
          if (error) {
            handleSessionExpired();
          }
        }
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [session, handleSessionExpired]);

  useEffect(() => {
    // Listen for TOKEN_REFRESHED failures
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'TOKEN_REFRESHED') {
        // Session successfully refreshed — no action needed
      }
      if (event === 'SIGNED_OUT') {
        // User was signed out (possibly due to expired session)
      }
    });

    return () => subscription.unsubscribe();
  }, []);
}
