'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Get the initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Unexpected error during getSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user || null);
        setIsLoading(false);
        
        // Handle auth events
        if (event === 'SIGNED_IN' && pathname === '/login') {
          router.push('/customers');
        } else if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, pathname]);

  // Redirect to login if not authenticated and not on auth pages
  useEffect(() => {
    if (
      !isLoading && 
      !session && 
      pathname !== '/login' && 
      pathname !== '/signup' &&
      pathname !== '/'
    ) {
      router.push('/login');
    }
  }, [session, isLoading, pathname, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
    isAuthenticated: !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 