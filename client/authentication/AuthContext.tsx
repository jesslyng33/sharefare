import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  hasCompletedOnboarding: boolean;
  signIn: (phone: string) => Promise<void>;
  verifyCode: (phone: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkOnboardingStatus: () => Promise<void>;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check initial auth state
    checkAuthState();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          setUser(session.user);
          // Ensure profile exists and check onboarding status when user signs in
          await ensureProfileExists(session.user.id);
          await checkOnboardingStatus(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUser(null);
          setHasCompletedOnboarding(false);
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
        // Ensure profile exists for existing users
        await ensureProfileExists(session.user.id);
        await checkOnboardingStatus(session.user.id);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkOnboardingStatus = async (userId?: string) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, year, major, instagram, profile_picture_uri, preferences')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error checking onboarding status:', error);
        setHasCompletedOnboarding(false);
        return;
      }

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist yet, user needs to complete onboarding
        console.log('Profile not found, user needs onboarding');
        setHasCompletedOnboarding(false);
        return;
      }

      // Check if user has completed basic profile setup
      const hasProfile = data && data.full_name && data.year && data.major;
      setHasCompletedOnboarding(!!hasProfile);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasCompletedOnboarding(false);
    }
  };

  const signIn = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const verifyCode = async (phone: string, code: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: 'sms',
      });
      if (error) throw error;
      
      // If verification successful, ensure profile exists
      if (data.user) {
        await ensureProfileExists(data.user.id);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      throw error;
    }
  };

  const ensureProfileExists = async (userId: string) => {
    try {
      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // Profile doesn't exist, create a new one
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          console.log('Profile created successfully for user:', userId);
        }
      } else if (checkError) {
        console.error('Error checking profile existence:', checkError);
      }
    } catch (error) {
      console.error('Error ensuring profile exists:', error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    hasCompletedOnboarding,
    signIn,
    verifyCode,
    signOut,
    checkOnboardingStatus: () => checkOnboardingStatus(user?.id)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
