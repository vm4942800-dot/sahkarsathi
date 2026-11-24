import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('customer'); // 'customer' | 'worker' | 'supervisor'
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const { session: currentSession, user: currentUser, profile: currentProfile } =
          await authService.getCurrentSession();

        if (mounted) {
          if (currentUser) {
            setUser(currentUser);
            setSession(currentSession);
            setProfile(currentProfile);
            setRole(currentProfile?.role || currentUser?.role || 'customer');
          } else {
            setUser(null);
            setSession(null);
            setProfile(null);
            setRole('customer');
          }
        }
      } catch (err) {
        console.error('Session init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initSession();

    // Listen to Supabase auth state change if configured
    let subscription = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        if (newSession?.user) {
          setUser(newSession.user);
          const p = await authService.getProfile(newSession.user.id);
          setProfile(p);
          setRole(p?.role || newSession.user.user_metadata?.role || 'customer');
        } else {
          setUser(null);
          setProfile(null);
          setRole('customer');
        }
        setLoading(false);
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Sign Up
  const signUp = async (credentials) => {
    setLoading(true);
    try {
      const result = await authService.signUp(credentials);
      if (result.user) {
        setUser(result.user);
        setSession(result.session);
        setRole(credentials.role || 'customer');
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Sign In with email/password
  const signIn = async (credentials) => {
    setLoading(true);
    try {
      const result = await authService.signInWithPassword(credentials);
      if (result.user) {
        setUser(result.user);
        setSession(result.session);
        setProfile(result.profile);
        setRole(result.profile?.role || credentials.requestedRole || 'customer');
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth
  const signInWithGoogle = async () => {
    return await authService.signInWithOAuth('google');
  };

  // Phone OTP
  const signInWithOtp = async (phone) => {
    return await authService.signInWithOtp(phone);
  };

  // Sign Out
  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole('customer');
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (email) => {
    return await authService.resetPasswordForEmail(email);
  };

  // Development convenience: switch active role directly for testing dashboards
  const setDemoRole = (newRole) => {
    setRole(newRole);
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('sahkarsathi_dev_session', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    session,
    profile,
    role,
    loading,
    isAuthenticated: Boolean(user),
    isSupabaseConfigured: isSupabaseConfigured(),
    signUp,
    signIn,
    signInWithGoogle,
    signInWithOtp,
    signOut,
    resetPassword,
    setDemoRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
