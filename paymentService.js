/**
 * Complete Direct UPI Payment & Verification Service for SahkarSathi
 * Supports PhonePe, Paytm, and Google Pay direct transfers to Workers and Supervisors
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { isValidUpiId, isValidUtr, buildUpiUri, getAppDeepLink } from '../utils/upiQrGenerator';
import { notificationService } from './notificationService';

// Fallback configured payment settings for demo worker and supervisor
const DEFAULT_USER_PAYMENT_SETTINGS = {
  // Worker (Master Electrician Sunil Verma) has PhonePe & Paytm configured
  'SS-WRK-7821': [
    {
      app_name: 'phonepe',
      upi_id: '9823145670@ybl',
      is_preferred: true,
      is_enabled: true,
      qr_code_url: null,
    },
    {
      app_name: 'paytm',
      upi_id: '9823145670@paytm',
      is_preferred: false,
      is_enabled: true,
      qr_code_url: null,
    },
    {
      app_name: 'gpay',
      upi_id: 'sunil.verma@okhdfcbank',
      is_preferred: false,
      is_enabled: true,
      qr_code_url: null,
    },
  ],
  // Supervisor (Lead Coordinator Rajesh Mehta) has all 3 configured
  'sup-104': [
    {
      app_name: 'phonepe',
      upi_id: 'rajesh.mehta@ybl',
      is_preferred: true,
      is_enabled: true,
      qr_code_url: null,
    },
    {
      app_name: 'paytm',
      upi_id: '9811234567@paytm',
      is_preferred: false,
      is_enabled: true,
      qr_code_url: null,
    },
    {
      app_name: 'gpay',
      upi_id: 'rajesh.mehta@oksbi',
      is_preferred: false,
      is_enabled: true,
      qr_code_url: null,
    },
  ],
};

// Fallback payment records
let localPaymentRecords = [
  {
    id: 'PAY-2026-8911',
    payment_reference: 'PAY-2026-8911',
    booking_id: 'BK-2025-0891',
    booking_code: 'BK-2025-0891',
    service_title: 'Electrical Distribution Board Rewiring & Load Test',
    payer_id: 'usr_customer_409',
    customer_name: 'Priya Sharma',
    recipient_id: 'SS-WRK-7821',
    recipient_name: 'Sunil Verma',
    recipient_role: 'worker',
    amount: 1850.00,
    payment_method: 'Direct UPI QR',
    payment_app: 'phonepe',
    recipient_upi_id: '9823145670@ybl',
    upi_reference: '432190876543',
    status: 'paid', // 'unpaid' | 'payment_initiated' | 'pending_verification' | 'paid' | 'rejected'
    payment_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    verified_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    verified_by: 'SS-WRK-7821',
    notes: 'Verified via PhonePe merchant statement.',
  },
  {
    id: 'PAY-2026-5120',
    payment_reference: 'PAY-2026-5120',
    booking_id: 'BK-2026-0512',
    booking_code: 'BK-2026-0512',
    service_title: 'Concealed Pipe Acoustic Leak Diagnostics',
    payer_id: 'usr_customer_409',
    customer_name: 'Priya Sharma',
    recipient_id: 'SS-WRK-7821',
    recipient_name: 'Sunil Verma',
    recipient_role: 'worker',
    amount: 1450.00,
    payment_method: 'Direct UPI QR',
    payment_app: 'paytm',
    recipient_upi_id: '9823145670@paytm',
    upi_reference: '432198765432',
    status: 'pending_verification',
    payment_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    verified_at: null,
    verified_by: null,
    notes: 'Submitted by homeowner; awaiting artisan bank SMS verification.',
  },
];

let localUserSettings = { ...DEFAULT_USER_PAYMENT_SETTINGS };

export const paymentService = {
  /**
   * Fetch registered payment app settings for a worker or supervisor
   */
  async getUserPaymentSettings(userId) {
    if (!userId) return [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('user_payment_settings')
          .select('*')
          .eq('user_id', userId);

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase getUserPaymentSettings error:', err.message);
      }
    }

    return localUserSettings[userId] || localUserSettings['SS-WRK-7821'] || [];
  },

  /**
   * Save or update payment app settings for PhonePe, Paytm, or Google Pay
   */
  async savePaymentSetting({ userId, appName, upiId, isPreferred = false, isEnabled = true, qrCodeUrl = null }) {
    if (!userId) throw new Error('User identity is required.');
    if (!['phonepe', 'paytm', 'gpay'].includes(appName)) {
      throw new Error('Unsupported payment app. Only PhonePe, Paytm, and Google Pay are supported.');
    }
    if (!isValidUpiId(upiId)) {
      throw new Error(`Invalid UPI ID format "${upiId}". Format must be name@bank or phone@paytm.`);
    }

    const payload = {
      user_id: userId,
      app_name: appName,
      upi_id: upiId.trim(),
      is_preferred: isPreferred,
      is_enabled: isEnabled,
      qr_code_url: qrCodeUrl,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('user_payment_settings')
          .upsert(payload, { onConflict: 'user_id,app_name' })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase savePaymentSetting fallback:', err.message);
      }
    }

    // Local fallback update
    if (!localUserSettings[userId]) {
      localUserSettings[userId] = [];
    }

    const existingIndex = localUserSettings[userId].findIndex((s) => s.app_name === appName);
    if (existingIndex >= 0) {
      localUserSettings[userId][existingIndex] = {
        ...localUserSettings[userId][existingIndex],
        ...payload,
      };
    } else {
      localUserSettings[userId].push(payload);
    }

    // If preferred, unmark others
    if (isPreferred) {
      localUserSettings[userId] = localUserSettings[userId].map((s) => ({
        ...s,
        is_preferred: s.app_name === appName,
      }));
    }

    return payload;
  },

  /**
   * Fetch only active and enabled payment apps configured by the recipient
   * If recipient configured only PhonePe, only PhonePe will be returned.
   */
  async getRecipientPaymentOptions(recipientId, recipientRole = 'worker') {
    const allSettings = await this.getUserPaymentSettings(recipientId);
    const enabled = allSettings.filter((s) => s.is_enabled && s.upi_id);
    return enabled;
  },

  /**
   * Customer submits direct UPI payment details with UTR transaction reference
   */
  async submitUpiPayment({
    bookingId,
    bookingCode,
    serviceTitle,
    customerId,
    customerName,
    recipientId,
    recipientName,
    recipientRole = 'worker',
    amount,
    paymentApp,
    recipientUpiId,
    upiReference,
    notes = '',
  }) {
    if (!bookingId) throw new Error('Booking identification is required.');
    if (!upiReference || !isValidUtr(upiReference)) {
      throw new Error('Please enter a valid 12-digit UPI transaction reference number (UTR).');
    }
    if (!recipientUpiId || !isValidUpiId(recipientUpiId)) {
      throw new Error('Recipient has not configured a valid UPI address.');
    }

    // Check duplicate UTR submission
    const isDuplicate = localPaymentRecords.some(
      (p) => p.upi_reference === upiReference.trim() && p.status !== 'rejected'
    );
    if (isDuplicate) {
      throw new Error(`Transaction reference ${upiReference} has already been submitted.`);
    }

    const paymentRef = `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord = {
      id: paymentRef,
      payment_reference: paymentRef,
      booking_id: bookingId,
      booking_code: bookingCode || bookingId,
      service_title: serviceTitle || 'Cooperative Home Service',
      payer_id: customerId,
      customer_name: customerName || 'Homeowner',
      recipient_id: recipientId,
      recipient_name: recipientName || 'Artisan',
      recipient_role: recipientRole,
      amount: Number(amount) || 1450.00,
      payment_method: 'Direct UPI QR',
      payment_app: paymentApp,
      recipient_upi_id: recipientUpiId,
      upi_reference: upiReference.trim(),
      status: 'pending_verification',
      payment_date: new Date().toISOString(),
      verified_at: null,
      verified_by: null,
      notes: notes || 'Customer submitted UTR reference via direct UPI payment.',
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('payment_records')
          .insert(newRecord)
          .select()
          .single();

        if (error) throw error;
      } catch (err) {
        console.warn('Supabase submitUpiPayment fallback:', err.message);
      }
    }

    localPaymentRecords = [newRecord, ...localPaymentRecords];

    // Real-time notification to the worker/supervisor recipient
    notificationService.createNotification({
      userId: recipientId,
      title: `UPI Payment Awaiting Your Verification: ₹${newRecord.amount}`,
      description: `Homeowner ${newRecord.customer_name} submitted UTR ${newRecord.upi_reference} via ${paymentApp.toUpperCase()}. Check your account statement and verify.`,
      notificationType: 'payment_review',
      relatedId: newRecord.payment_reference,
      actionUrl: recipientRole === 'worker' ? '/worker/earnings' : '/supervisor/payments',
    });

    return newRecord;
  },

  /**
   * Recipient verifies or rejects the submitted UPI payment
   */
  async verifyPayment({
    paymentId,
    verifiedBy,
    verifiedByName,
    action = 'confirm', // 'confirm' | 'reject'
    rejectionReason = '',
    note = '',
  }) {
    const payment = localPaymentRecords.find((p) => p.id === paymentId || p.payment_reference === paymentId);
    if (!payment) throw new Error('Payment record not found.');

    const newStatus = action === 'confirm' ? 'paid' : 'rejected';
    const verifiedAt = action === 'confirm' ? new Date().toISOString() : null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('payment_records')
          .update({
            status: newStatus,
            verified_at: verifiedAt,
            verified_by: verifiedBy,
            notes: note || (action === 'confirm' ? 'Payment independently verified.' : rejectionReason),
            rejection_reason: action === 'reject' ? rejectionReason : null,
          })
          .eq('id', payment.id)
          .select()
          .single();

        if (error) throw error;
      } catch (err) {
        console.warn('Supabase verifyPayment fallback:', err.message);
      }
    }

    // Local update
    localPaymentRecords = localPaymentRecords.map((p) =>
      p.id === payment.id
        ? {
            ...p,
            status: newStatus,
            verified_at: verifiedAt,
            verified_by: verifiedBy,
            notes: note || (action === 'confirm' ? 'Verified in recipient bank/UPI statement.' : rejectionReason),
            rejection_reason: action === 'reject' ? rejectionReason : null,
          }
        : p
    );

    // Notify customer of outcome
    if (payment.payer_id) {
      if (action === 'confirm') {
        notificationService.createNotification({
          userId: payment.payer_id,
          title: `Payment Verified: ₹${payment.amount} Paid Directly`,
          description: `Your payment to ${payment.recipient_name} via ${payment.payment_app?.toUpperCase()} has been confirmed. Receipt generated.`,
          notificationType: 'payment_updated',
          relatedId: payment.booking_code,
          actionUrl: '/customer/bookings/active',
        });
      } else {
        notificationService.createNotification({
          userId: payment.payer_id,
          title: 'Payment Discrepancy: Reference Rejected',
          description: `Recipient could not match UTR ${payment.upi_reference}. Reason: ${rejectionReason || 'Transaction not found in statement'}.`,
          notificationType: 'payment_review',
          relatedId: payment.booking_code,
          actionUrl: '/customer/bookings/active',
        });
      }
    }

    return { ...payment, status: newStatus };
  },

  /**
   * Fetch payment records with role-based filtering
   */
  async getPaymentRecords({
    userId,
    role = 'customer',
    statusFilter = 'all',
    appFilter = 'all',
  }) {
    if (isSupabaseConfigured() && userId) {
      try {
        let query = supabase.from('payment_records').select('*');
        if (role === 'customer') {
          query = query.eq('payer_id', userId);
        } else if (role === 'worker') {
          query = query.eq('recipient_id', userId);
        }

        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        if (appFilter !== 'all') {
          query = query.eq('payment_app', appFilter);
        }

        const { data, error } = await query.order('payment_date', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getPaymentRecords fallback:', err.message);
      }
    }

    // Local filter
    return localPaymentRecords.filter((p) => {
      if (role === 'customer' && userId && p.payer_id !== userId) return false;
      if (role === 'worker' && userId && p.recipient_id !== userId) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (appFilter !== 'all' && p.payment_app !== appFilter) return false;
      return true;
    });
  },
};
