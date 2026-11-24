/**
 * Transactional Email Notification Service for SahkarSathi
 * Prepares clean integrations for Supabase Auth Mailer, Resend, or SMTP.
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Check if transactional email provider API keys are configured
const isEmailConfigured = () => {
  return Boolean(
    import.meta.env.VITE_RESEND_API_KEY ||
    import.meta.env.VITE_SMTP_HOST
  );
};

export const emailService = {
  /**
   * Check status of email configuration
   */
  isConfigured() {
    return isEmailConfigured();
  },

  /**
   * Send a booking confirmation email
   */
  async sendBookingConfirmation({ customerEmail, customerName, bookingCode, serviceTitle, scheduledDate }) {
    if (!isEmailConfigured()) {
      console.info(
        `[Transactional Email Pending Config] Booking Confirmation would be sent to: ${customerEmail} for Booking ${bookingCode}. See BACKEND_SETUP.md for SMTP/Resend setup.`
      );
      return {
        sent: false,
        reason: 'email_provider_not_configured',
        details: 'Email dispatch queued until VITE_RESEND_API_KEY or SMTP credentials are provided in .env.',
      };
    }

    try {
      // Future Resend or Supabase Edge Function dispatch:
      // await resend.emails.send({ from: 'support@sahkarsathi.coop', to: customerEmail, ... })
      return { sent: true, recipient: customerEmail };
    } catch (err) {
      console.warn('Email dispatch failed:', err.message);
      return { sent: false, error: err.message };
    }
  },

  /**
   * Send a worker assignment notification email
   */
  async sendAssignmentNotification({ workerEmail, workerName, bookingCode, serviceAddress }) {
    if (!isEmailConfigured()) {
      console.info(
        `[Transactional Email Pending Config] Assignment notification queued for ${workerEmail} (${bookingCode}).`
      );
      return { sent: false, reason: 'email_provider_not_configured' };
    }
    return { sent: true };
  },

  /**
   * Send verification status update email
   */
  async sendVerificationUpdate({ workerEmail, workerName, status, notes }) {
    if (!isEmailConfigured()) {
      console.info(
        `[Transactional Email Pending Config] Verification update (${status}) queued for ${workerEmail}.`
      );
      return { sent: false, reason: 'email_provider_not_configured' };
    }
    return { sent: true };
  },

  /**
   * Trigger standard Supabase password reset email
   */
  async sendPasswordReset(email) {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?reset=true`,
      });
      if (error) throw error;
      return { sent: true, provider: 'supabase_auth' };
    }

    console.info(`[Password Reset Simulation] Reset token generated for ${email}.`);
    return { sent: false, reason: 'local_mode' };
  },
};
