/**
 * Real-Time Notification Service for SahkarSathi
 * Connects to Supabase Database (public.notifications) and Supabase Realtime
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Role-specific default notifications used when offline or in local demo mode
const DEFAULT_NOTIFICATIONS = {
  customer: [
    {
      id: 'notif-c-1',
      user_id: 'usr-cust-demo',
      title: 'Supervisor Assigned',
      description: 'Senior Coordinator Rajesh Mehta has been assigned to oversee your Electrical Distribution Board Overhaul (BK-2025-0891).',
      notification_type: 'supervisor_assigned',
      related_id: 'BK-2025-0891',
      action_url: '/customer/bookings/active',
      is_read: false,
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif-c-2',
      user_id: 'usr-cust-demo',
      title: 'Escrow Deposit Held Securely',
      description: '₹1,850.00 placed safely into cooperative protection escrow for your active job. Funds release only upon your digital sign-off.',
      notification_type: 'payment_updated',
      related_id: 'BK-2025-0891',
      action_url: '/customer/bookings',
      is_read: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif-c-3',
      user_id: 'usr-cust-demo',
      title: 'Worker Scheduled',
      description: 'Master Electrician Sunil Verma confirmed arrival for tomorrow, 10:00 AM. Identity verified by local cooperative unit.',
      notification_type: 'worker_assigned',
      related_id: 'BK-2025-0891',
      action_url: '/customer/bookings/active',
      is_read: true,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ],
  worker: [
    {
      id: 'notif-w-1',
      user_id: 'usr-wrk-demo',
      title: 'New Emergency Request in Your Area',
      description: 'Commercial MCB Tripping & Earthing Test in Indiranagar Sector 4. ₹2,200 estimated cooperative payout.',
      notification_type: 'job_available',
      related_id: 'JOB-2026-IND-4',
      action_url: '/worker/find-work',
      is_read: false,
      created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif-w-2',
      user_id: 'usr-wrk-demo',
      title: 'Verification Stage 4 Approved',
      description: 'Your NABL Electrician License and Trade Certification have been verified by Lead Supervisor Mehta. Level 5 Artisan Badge unlocked.',
      notification_type: 'verification_updated',
      related_id: 'VERIF-7821',
      action_url: '/worker/verification',
      is_read: false,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif-w-3',
      user_id: 'usr-wrk-demo',
      title: 'Cooperative Escrow Payment Disbursed',
      description: '₹3,400.00 successfully transferred to your verified UPI VPA for completed Job #SS-2025-E882.',
      notification_type: 'payment_updated',
      related_id: 'PAY-8921',
      action_url: '/worker/earnings',
      is_read: true,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  supervisor: [
    {
      id: 'notif-s-1',
      user_id: 'usr-sup-demo',
      title: 'New Booking Awaiting Review',
      description: 'Multi-Room Concealed Sanitary Overhaul in Sector 14 Rohini requires your trade assignment and initial material quote audit.',
      notification_type: 'booking_review',
      related_id: 'BK-2026-9021',
      action_url: '/supervisor/requests',
      is_read: false,
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif-s-2',
      user_id: 'usr-sup-demo',
      title: 'Artisan Verification Pending Your Sign-off',
      description: 'Arjun Das (Plumbing specialist, Central Delhi Guild) has submitted Police Clearance and Aadhaar for Stage 3 validation.',
      notification_type: 'verification_review',
      related_id: 'WRK-512',
      action_url: '/supervisor/workers',
      is_read: false,
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif-s-3',
      user_id: 'usr-sup-demo',
      title: 'Milestone 2 Completed by Worker',
      description: 'Balwinder Singh uploaded site completion photos for Project #PRJ-2026-W01 (Kitchen Cabinets). Ready for client walkthrough.',
      notification_type: 'task_status',
      related_id: 'PRJ-2026-W01',
      action_url: '/supervisor/progress',
      is_read: true,
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

// In-memory cache for offline/local simulation
let localNotifications = [];

export const notificationService = {
  /**
   * Fetch user notifications from Supabase
   */
  async getNotifications(userId, role = 'customer') {
    if (isSupabaseConfigured() && userId) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase notifications fetch error, using fallback:', err.message);
      }
    }

    // Fallback: Return role-specific notifications
    if (localNotifications.length === 0) {
      localNotifications = [...(DEFAULT_NOTIFICATIONS[role] || DEFAULT_NOTIFICATIONS.customer)];
    }
    return localNotifications;
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notificationId)
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Failed to mark notification read in Supabase:', err.message);
      }
    }

    // Local fallback update
    localNotifications = localNotifications.map((n) =>
      n.id === notificationId ? { ...n, is_read: true } : n
    );
    return { id: notificationId, is_read: true };
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    if (isSupabaseConfigured() && userId) {
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', userId)
          .eq('is_read', false);

        if (!error) {
          return true;
        }
      } catch (err) {
        console.warn('Failed to mark all notifications read in Supabase:', err.message);
      }
    }

    localNotifications = localNotifications.map((n) => ({ ...n, is_read: true }));
    return true;
  },

  /**
   * Delete or archive a single notification
   */
  async deleteNotification(notificationId) {
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('notifications')
          .delete()
          .eq('id', notificationId);
      } catch (err) {
        console.warn('Failed to delete notification in Supabase:', err.message);
      }
    }

    localNotifications = localNotifications.filter((n) => n.id !== notificationId);
    return true;
  },

  /**
   * Create a new notification (used by booking, job, or verification events)
   */
  async createNotification({
    userId,
    title,
    description,
    notificationType = 'general',
    relatedId = null,
    actionUrl = null,
  }) {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user_id: userId,
      title,
      description,
      notification_type: notificationType,
      related_id: relatedId,
      action_url: actionUrl,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && userId) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            title,
            description,
            notification_type: notificationType,
            related_id: relatedId,
            action_url: actionUrl,
            is_read: false,
          })
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase createNotification fallback:', err.message);
      }
    }

    localNotifications = [newNotif, ...localNotifications];
    return newNotif;
  },

  /**
   * Subscribe to real-time notification events via Supabase Realtime
   * Returns an unsubscribe function for React useEffect cleanup
   */
  subscribeToNotifications(userId, onNotificationReceived, onNotificationUpdated) {
    if (!isSupabaseConfigured() || !userId) {
      return () => {};
    }

    const channelName = `realtime-notif-${userId}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (onNotificationReceived && payload.new) {
            onNotificationReceived(payload.new);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (onNotificationUpdated && payload.new) {
            onNotificationUpdated(payload.new);
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.warn('Notification channel subscription issue:', err.message);
        }
      });

    // Cleanup function
    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // channel removed
      }
    };
  },
};
