import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  signIn: (phone: string) => Promise<void>;
  verifyCode: (phone: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // TEMPORARILY DISABLED AUTHENTICATION - AUTHENTICATION IS TURNED OFF
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Changed from false to true
  const [isLoading, setIsLoading] = useState(false); // Changed from true to false
  const [user, setUser] = useState<any>({ id: '12345678-1234-1234-1234-123456789abc' }); // Mock user

  // Commented out all authentication logic temporarily
  /*
  useEffect(() => {
    // Check initial auth state
    checkAuthState();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthState = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };
  */

  const signIn = async (phone: string) => {
    // Temporarily disabled - just log the phone number
    console.log('Sign in attempted with phone:', phone);
    // No actual authentication happening
  };

  const verifyCode = async (phone: string, code: string) => {
    // Temporarily disabled - just log the verification attempt
    console.log('Verification attempted with phone:', phone, 'code:', code);
    // No actual verification happening
  };

  const signOut = async () => {
    // Temporarily disabled - just log the sign out attempt
    console.log('Sign out attempted');
    // No actual sign out happening
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    signIn,
    verifyCode,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
