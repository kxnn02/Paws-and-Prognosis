import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (__DEV__) {
  if (!supabaseUrl) {
    console.warn(
      '[Supabase] EXPO_PUBLIC_SUPABASE_URL is not set. ' +
      'Copy .env.example to .env and fill in your Supabase credentials.'
    );
  }
  if (!supabaseAnonKey) {
    console.warn(
      '[Supabase] EXPO_PUBLIC_SUPABASE_ANON_KEY is not set. ' +
      'Copy .env.example to .env and fill in your Supabase credentials.'
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
