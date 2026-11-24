import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Local storage key for fallback development sessions when Supabase env vars are pending
const DEV_SESSION_KEY = 'sahkarsathi_dev_session';

export const authService = {
  /**
   * Register a new user with email, password, and role metadata
   */
  async signUp({ email, password, role = 'customer', fullName, phone }) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            full_name: fullName,
            phone,
          },
        },
      });

      if (error) throw error;
      return data;
    } else {
      // Local development fallback
      const mockUser = {
        id: `usr_${role}_${Date.now()}`,
        email,
        role,
        full_name: fullName || email.split('@')[0],
        phone: phone || '+91 98000 00000',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(mockUser));
      return { user: mockUser, session: { access_token: 'mock-jwt-token', user: mockUser } };
    }
  },

  /**
   * Sign in with email and password
   */
  async signInWithPassword({ email, password, requestedRole = 'customer' }) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch user profile from database
      const profile = await this.getProfile(data.user.id);
      return { user: data.user, session: data.session, profile };
    } else {
      // Local development fallback
      const mockUser = {
        id: `usr_${requestedRole}_409`,
        email,
        role: requestedRole,
        full_name:
          requestedRole === 'worker'
            ? 'Ramesh Kumar Verma'
            : requestedRole === 'supervisor'
            ? 'Vikramaditya Rao'
            : requestedRole === 'admin'
            ? 'Arvind Swaminathan'
            : 'Priya Sharma',
        phone: '+91 98231 45670',
      };
      localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(mockUser));
      return {
        user: mockUser,
        session: { access_token: 'mock-jwt-token', user: mockUser },
        profile: mockUser,
      };
    }
  },

  /**
   * Sign in with OAuth (Google)
   */
  async signInWithOAuth(provider = 'google') {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/customer/dashboard`,
        },
      });
      if (error) throw error;
      return data;
    } else {
      alert('Google OAuth requires configuring Google Cloud Console client ID in your Supabase dashboard.');
      return null;
    }
  },

  /**
   * Sign in with mobile OTP
   */
  async signInWithOtp(phone) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
      });
      if (error) throw error;
      return data;
    } else {
      alert('Mobile OTP requires configuring SMS gateway (Twilio/MessageBird) in your Supabase dashboard.');
      return null;
    }
  },

  /**
   * Send password reset email
   */
  async resetPasswordForEmail(email) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      return data;
    } else {
      return { message: 'Password reset link dispatched in development mode.' };
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    localStorage.removeItem(DEV_SESSION_KEY);
  },

  /**
   * Get user profile by user id
   */
  async getProfile(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Could not fetch profile from Supabase:', error.message);
        return null;
      }
      return data;
    } else {
      const dev = localStorage.getItem(DEV_SESSION_KEY);
      return dev ? JSON.parse(dev) : null;
    }
  },

  /**
   * Update profile
   */
  async updateProfile(userId, updates) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const dev = localStorage.getItem(DEV_SESSION_KEY);
      const current = dev ? JSON.parse(dev) : {};
      const updated = { ...current, ...updates };
      localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(updated));
      return updated;
    }
  },

  /**
   * Get current session and user
   */
  async getCurrentSession() {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        const profile = await this.getProfile(data.session.user.id);
        return { session: data.session, user: data.session.user, profile };
      }
      return { session: null, user: null, profile: null };
    } else {
      const dev = localStorage.getItem(DEV_SESSION_KEY);
      if (dev) {
        const user = JSON.parse(dev);
        return {
          session: { access_token: 'mock-token', user },
          user,
          profile: user,
        };
      }
      return { session: null, user: null, profile: null };
    }
  },
};
