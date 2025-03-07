import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These environment variables are set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);
  return error?.message || 'An unexpected error occurred';
};

// Initialize authentication on client side
let authInitialized = false;

// Ensure user is signed in anonymously to satisfy RLS policies
export const ensureAnonymousSession = async () => {
  if (typeof window === 'undefined') {
    console.log('Server-side execution, skipping auth check');
    return;
  }
  
  if (authInitialized) {
    return;
  }
  
  try {
    const { data } = await supabase.auth.getSession();
    
    // If no session exists, sign in anonymously
    if (!data.session) {
      console.log('No session found, signing in anonymously...');
      const { error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        console.error('Error signing in anonymously:', error);
        throw error;
      }
      
      console.log('Anonymous sign-in complete');
    } else {
      console.log('Session found, using existing session');
    }
    
    authInitialized = true;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}; 