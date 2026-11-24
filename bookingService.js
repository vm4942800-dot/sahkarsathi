/**
 * Complete Booking Lifecycle & Scheduling Service for SahkarSathi
 * Unifies Customer, Worker, and Supervisor booking operations with PostgreSQL & Supabase Realtime
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BRAND } from '../config/brand';
import { notificationService } from './notificationService';
import { emailService } from './emailService';

// Valid Lifecycle Status Transitions
export const VALID_STATUS_TRANSITIONS = {
  requested: ['accepted', 'confirmed', 'rejected', 'cancelled'],
  accepted: ['confirmed', 'worker_assigned', 'cancelled'],
  confirmed: ['worker_assigned', 'scheduled', 'cancelled'],
  worker_assigned: ['scheduled', 'in_progress', 'cancelled', 'requested'], // 'requested' if worker rejects and returns to pool
  scheduled: ['in_progress', 'reschedule_requested', 'cancelled'],
  reschedule_requested: ['scheduled', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
  rejected: [],
};

// Available time slots across the cooperative network
export const COOP_TIME_SLOTS = [
  'Morning (9:00 AM – 12:00 PM)',
  'Afternoon (1:00 PM – 4:00 PM)',
  'Evening (4:30 PM – 7:30 PM)',
  'Emergency Immediate (Within 90 Mins)',
];

// Unified in-memory fallback state for offline & development resilience
let sharedBookings = [
  {
    id: 'BK-2025-0891',
    booking_code: 'BK-2025-0891',
    service_id: 'electrical',
    service_title: 'Electrical Distribution Board Rewiring & Load Test',
    scheduled_date: '2026-11-26',
    scheduled_time: 'Morning (9:00 AM – 12:00 PM)',
    service_address: 'Flat 402, Tower B, Green Park Residency, Sector 14, Rohini, New Delhi',
    city: 'New Delhi',
    instructions: 'Main MCB tripping under air conditioner load. Comprehensive distribution box check.',
    status: 'in_progress',
    total_amount: 1850,
    escrow_status: 'held_in_escrow',
    customer_id: 'usr_customer_409',
    customer: {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      address: 'Flat 402, Green Park Residency, Sector 14, New Delhi',
    },
    assigned_worker_id: 'SS-WRK-7821',
    worker: {
      id: 'SS-WRK-7821',
      name: 'Sunil Verma',
      badgeId: 'SS-2025-E882',
      trade: 'Master Electrician',
      rating: 4.92,
      phone: '+91 98231 45670',
    },
    assigned_supervisor_id: 'sup-104',
    supervisor: {
      id: 'sup-104',
      name: 'Rajesh Mehta',
      badgeId: 'SS-SUP-104',
      role: 'Regional Lead Coordinator',
      phone: '+91 98112 34567',
    },
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'BK-2026-0512',
    booking_code: 'BK-2026-0512',
    service_id: 'plumbing',
    service_title: 'Concealed Pipe Acoustic Leak Diagnostics',
    scheduled_date: '2026-11-28',
    scheduled_time: 'Afternoon (1:00 PM – 4:00 PM)',
    service_address: 'Unit 304, Apex Business Hub, Barakhamba Road, Connaught Place, New Delhi',
    city: 'New Delhi',
    instructions: 'Moisture seep behind guest bathroom floor tiles. Acoustic sensor scan required.',
    status: 'scheduled',
    total_amount: 1450,
    escrow_status: 'held_in_escrow',
    customer_id: 'usr_customer_409',
    customer: {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      address: 'Unit 304, Apex Business Hub, New Delhi',
    },
    assigned_worker_id: 'wrk-512',
    worker: {
      id: 'wrk-512',
      name: 'Arjun Das',
      badgeId: 'SS-2025-P512',
      trade: 'Certified Plumber',
      rating: 4.88,
      phone: '+91 98765 11223',
    },
    assigned_supervisor_id: 'sup-104',
    supervisor: {
      id: 'sup-104',
      name: 'Rajesh Mehta',
      badgeId: 'SS-SUP-104',
      role: 'Regional Lead Coordinator',
      phone: '+91 98112 34567',
    },
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'BK-2026-9041',
    booking_code: 'BK-2026-9041',
    service_id: 'carpentry',
    service_title: 'Teak Door Hydraulic Damper Fitting',
    scheduled_date: '2026-11-29',
    scheduled_time: 'Morning (9:00 AM – 12:00 PM)',
    service_address: 'Sector 15, Rohini, New Delhi',
    city: 'New Delhi',
    instructions: 'Main entrance heavy teak frame damper installation.',
    status: 'requested',
    total_amount: 1200,
    escrow_status: 'held_in_escrow',
    customer_id: 'usr_customer_409',
    customer: {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      address: 'Sector 15, Rohini, New Delhi',
    },
    assigned_worker_id: null,
    worker: null,
    assigned_supervisor_id: 'sup-104',
    supervisor: {
      id: 'sup-104',
      name: 'Rajesh Mehta',
      badgeId: 'SS-SUP-104',
      role: 'Regional Lead Coordinator',
    },
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let sharedTimelineEvents = {
  'BK-2025-0891': [
    {
      id: 'evt-1',
      booking_id: 'BK-2025-0891',
      event_type: 'booking_requested',
      title: 'Booking Order Created',
      description: 'Homeowner created booking requirement with ₹1,850 deposit placed into escrow.',
      actor_role: 'customer',
      created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'evt-2',
      booking_id: 'BK-2025-0891',
      event_type: 'supervisor_assigned',
      title: 'Supervisor Rajesh Mehta Assigned',
      description: 'Regional cooperative field lead assigned to coordinate trade requirements and verify safety specs.',
      actor_role: 'supervisor',
      created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'evt-3',
      booking_id: 'BK-2025-0891',
      event_type: 'worker_assigned',
      title: 'Master Electrician Sunil Verma Dispatched',
      description: 'Skill matched: Grade-A NABL license wireman dispatched with calibrated load testing equipment.',
      actor_role: 'supervisor',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'evt-4',
      booking_id: 'BK-2025-0891',
      event_type: 'work_started',
      title: 'Work In Progress',
      description: 'Technician arrived on site. Distribution board circuit load analysis initiated.',
      actor_role: 'worker',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
  'BK-2026-0512': [
    {
      id: 'evt-101',
      booking_id: 'BK-2026-0512',
      event_type: 'booking_requested',
      title: 'Booking Order Created',
      description: 'Plumbing leak audit order placed.',
      actor_role: 'customer',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'evt-102',
      booking_id: 'BK-2026-0512',
      event_type: 'worker_assigned',
      title: 'Artisan Arjun Das Assigned',
      description: 'Certified acoustic leak inspector assigned by Supervisor Mehta.',
      actor_role: 'supervisor',
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'evt-103',
      booking_id: 'BK-2026-0512',
      event_type: 'schedule_confirmed',
      title: 'Schedule Confirmed',
      description: 'Worker confirmed arrival for Nov 28, Afternoon slot.',
      actor_role: 'worker',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

let sharedRescheduleRequests = {
  'BK-2026-0512': [],
  'BK-2025-0891': [],
};

export const bookingService = {
  /**
   * Validate if a transition from currentStatus to newStatus is permissible
   */
  isValidTransition(currentStatus, newStatus) {
    if (currentStatus === newStatus) return true;
    const allowed = VALID_STATUS_TRANSITIONS[currentStatus] || [];
    return allowed.includes(newStatus);
  },

  /**
   * Fetch services catalog
   */
  async getServices() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*, service_categories(name, slug)');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getServices fallback:', err.message);
      }
    }
    return BRAND.services;
  },

  /**
   * Check if a worker is available for a given date and time slot
   */
  async checkWorkerAvailability({ workerId, scheduledDate, scheduledTime, excludeBookingId = null }) {
    if (!workerId || !scheduledDate || !scheduledTime) return true;

    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('bookings')
          .select('id, booking_code, service_title')
          .eq('assigned_worker_id', workerId)
          .eq('scheduled_date', scheduledDate)
          .eq('scheduled_time', scheduledTime)
          .not('status', 'in', '("cancelled","rejected","completed")');

        if (excludeBookingId) {
          query = query.neq('id', excludeBookingId);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return false; // Worker has conflict
        }
      } catch (err) {
        console.warn('Conflict check error:', err.message);
      }
    }

    // Local state conflict check
    const conflict = sharedBookings.find(
      (b) =>
        b.assigned_worker_id === workerId &&
        b.scheduled_date === scheduledDate &&
        b.scheduled_time === scheduledTime &&
        b.id !== excludeBookingId &&
        !['cancelled', 'rejected', 'completed'].includes(b.status)
    );

    return !conflict;
  },

  /**
   * Create a new booking
   */
  async createBooking(booking) {
    const bookingCode = `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Validate past dates are not permitted for new bookings
    if (booking.scheduledDate) {
      const todayStr = new Date().toISOString().split('T')[0];
      if (booking.scheduledDate < todayStr) {
        throw new Error('Bookings cannot be scheduled on past dates.');
      }
    }

    // Verify worker availability if worker was explicitly chosen
    if (booking.preferredWorkerId) {
      const isAvailable = await this.checkWorkerAvailability({
        workerId: booking.preferredWorkerId,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
      });

      if (!isAvailable) {
        throw new Error(
          'Selected artisan is already booked for this specific time slot. Please choose another slot or leave worker selection to cooperative dispatch.'
        );
      }
    }

    const payload = {
      booking_code: bookingCode,
      customer_id: booking.customerId,
      service_title: booking.serviceTitle,
      scheduled_date: booking.scheduledDate,
      scheduled_time: booking.scheduledTime,
      service_address: booking.serviceAddress,
      city: booking.city || 'Bengaluru',
      instructions: booking.instructions || '',
      status: booking.preferredWorkerId ? 'confirmed' : 'requested',
      assigned_worker_id: booking.preferredWorkerId || null,
      assigned_supervisor_id: booking.assignedSupervisorId || null,
      total_amount: booking.totalAmount || 1450,
      escrow_status: 'held_in_escrow',
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase createBooking fallback:', err.message);
      }
    }

    // Local fallback
    const newBooking = {
      id: bookingCode,
      ...payload,
      customer: {
        name: 'Priya Sharma',
        phone: '+91 98765 43210',
        address: booking.serviceAddress,
      },
      worker: booking.preferredWorkerId
        ? {
            id: booking.preferredWorkerId,
            name: 'Sunil Verma',
            badgeId: 'SS-2025-E882',
            trade: 'Master Electrician',
          }
        : null,
      supervisor: {
        id: 'sup-104',
        name: 'Rajesh Mehta',
        badgeId: 'SS-SUP-104',
        role: 'Regional Lead Coordinator',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    sharedBookings = [newBooking, ...sharedBookings];

    // Initialize timeline
    sharedTimelineEvents[bookingCode] = [
      {
        id: `evt-${Date.now()}`,
        booking_id: bookingCode,
        event_type: 'booking_requested',
        title: 'Booking Order Created',
        description: `Customer scheduled ${booking.serviceTitle} for ${booking.scheduledDate} (${booking.scheduledTime}).`,
        actor_role: 'customer',
        created_at: new Date().toISOString(),
      },
    ];

    return newBooking;
  },

  /**
   * Get list of bookings filtered by role or query
   */
  async getBookings({ role = 'customer', userId, status = null, date = null }) {
    if (isSupabaseConfigured() && userId) {
      try {
        let query = supabase
          .from('bookings')
          .select(`
            *,
            customer:profiles!bookings_customer_id_fkey(full_name, phone, avatar_url),
            worker:profiles!bookings_assigned_worker_id_fkey(full_name, phone, avatar_url),
            supervisor:profiles!bookings_assigned_supervisor_id_fkey(full_name, phone)
          `)
          .order('scheduled_date', { ascending: false });

        if (role === 'customer') {
          query = query.eq('customer_id', userId);
        } else if (role === 'worker') {
          query = query.eq('assigned_worker_id', userId);
        } else if (role === 'supervisor') {
          // Supervisors see all bookings in their jurisdiction or assigned
          if (userId) query = query.or(`assigned_supervisor_id.eq.${userId},assigned_supervisor_id.is.null`);
        }

        if (status) {
          query = query.eq('status', status);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getBookings fallback:', err.message);
      }
    }

    // Local fallback filter
    return sharedBookings.filter((b) => {
      if (status && b.status !== status) return false;
      if (date && b.scheduled_date !== date) return false;
      return true;
    });
  },

  /**
   * Get single booking details with full timeline and participants
   */
  async getBookingDetails(bookingId) {
    if (!bookingId) return null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            customer:profiles!bookings_customer_id_fkey(full_name, email, phone, avatar_url),
            worker:profiles!bookings_assigned_worker_id_fkey(full_name, email, phone, avatar_url),
            supervisor:profiles!bookings_assigned_supervisor_id_fkey(full_name, email, phone)
          `)
          .or(`id.eq.${bookingId},booking_code.eq.${bookingId}`)
          .single();

        if (!error && data) {
          const [timeline, reschedules] = await Promise.all([
            this.getBookingTimeline(data.id),
            this.getRescheduleRequests(data.id),
          ]);

          return {
            ...data,
            timeline,
            reschedules,
          };
        }
      } catch (err) {
        console.warn('Supabase getBookingDetails fallback:', err.message);
      }
    }

    // Local fallback
    const found = sharedBookings.find(
      (b) => b.id === bookingId || b.booking_code === bookingId
    ) || sharedBookings[0];

    const timeline = sharedTimelineEvents[found.id] || sharedTimelineEvents[found.booking_code] || [];
    const reschedules = sharedRescheduleRequests[found.id] || sharedRescheduleRequests[found.booking_code] || [];

    return {
      ...found,
      timeline,
      reschedules,
    };
  },

  /**
   * Get timeline events for a booking
   */
  async getBookingTimeline(bookingId) {
    if (isSupabaseConfigured() && bookingId) {
      try {
        const { data, error } = await supabase
          .from('booking_timeline_events')
          .select('*')
          .eq('booking_id', bookingId)
          .order('created_at', { ascending: true });

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getBookingTimeline fallback:', err.message);
      }
    }

    return sharedTimelineEvents[bookingId] || [];
  },

  /**
   * Get reschedule history for a booking
   */
  async getRescheduleRequests(bookingId) {
    if (isSupabaseConfigured() && bookingId) {
      try {
        const { data, error } = await supabase
          .from('booking_reschedule_requests')
          .select('*')
          .eq('booking_id', bookingId)
          .order('created_at', { ascending: false });

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getRescheduleRequests fallback:', err.message);
      }
    }

    return sharedRescheduleRequests[bookingId] || [];
  },

  /**
   * Transition booking status safely with audit logging
   */
  async updateBookingStatus({ bookingId, newStatus, actorId, actorRole = 'system', notes = '' }) {
    const booking = await this.getBookingDetails(bookingId);
    if (!booking) throw new Error('Booking not found.');

    if (!this.isValidTransition(booking.status, newStatus)) {
      throw new Error(
        `Invalid status transition: Cannot transition booking from "${booking.status}" to "${newStatus}".`
      );
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', booking.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase updateBookingStatus fallback:', err.message);
      }
    }

    // Local update
    sharedBookings = sharedBookings.map((b) =>
      b.id === booking.id ? { ...b, status: newStatus, updated_at: new Date().toISOString() } : b
    );

    // Append to timeline
    const newEvent = {
      id: `evt-${Date.now()}`,
      booking_id: booking.id,
      event_type: `status_${newStatus}`,
      title: `Status: ${newStatus.replace('_', ' ').toUpperCase()}`,
      description: notes || `Booking moved to ${newStatus.replace('_', ' ')}.`,
      actor_role: actorRole,
      created_at: new Date().toISOString(),
    };

    if (!sharedTimelineEvents[booking.id]) sharedTimelineEvents[booking.id] = [];
    sharedTimelineEvents[booking.id].push(newEvent);

    // Trigger real-time notifications
    if (booking.customer_id) {
      notificationService.createNotification({
        userId: booking.customer_id,
        title: `Booking Update: ${newStatus.replace('_', ' ').toUpperCase()}`,
        description: `Your service ${booking.service_title} is now marked as ${newStatus.replace('_', ' ')}.`,
        notificationType: 'booking_review',
        relatedId: booking.booking_code,
        actionUrl: '/customer/bookings/active',
      });
    }

    return { ...booking, status: newStatus };
  },

  /**
   * Assign a worker to a booking (Supervisor action)
   */
  async assignWorker({ bookingId, workerId, workerName, supervisorId, notes = '' }) {
    const booking = await this.getBookingDetails(bookingId);
    if (!booking) throw new Error('Booking not found.');

    // Check worker overlap
    const isAvailable = await this.checkWorkerAvailability({
      workerId,
      scheduledDate: booking.scheduled_date,
      scheduledTime: booking.scheduled_time,
      excludeBookingId: booking.id,
    });

    if (!isAvailable) {
      throw new Error(
        `Scheduling Conflict: Worker is already booked on ${booking.scheduled_date} during ${booking.scheduled_time}.`
      );
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .update({
            assigned_worker_id: workerId,
            assigned_supervisor_id: supervisorId,
            status: 'worker_assigned',
            updated_at: new Date().toISOString(),
          })
          .eq('id', booking.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase assignWorker fallback:', err.message);
      }
    }

    // Local update
    sharedBookings = sharedBookings.map((b) =>
      b.id === booking.id
        ? {
            ...b,
            assigned_worker_id: workerId,
            assigned_supervisor_id: supervisorId,
            status: 'worker_assigned',
            worker: {
              id: workerId,
              name: workerName || 'Sunil Verma',
              badgeId: 'SS-2025-E882',
              trade: 'Master Artisan',
            },
            updated_at: new Date().toISOString(),
          }
        : b
    );

    // Timeline event
    const event = {
      id: `evt-${Date.now()}`,
      booking_id: booking.id,
      event_type: 'worker_assigned',
      title: 'Artisan Assigned',
      description: `${workerName || 'Verified Technician'} was assigned to this job by Field Supervisor.`,
      actor_role: 'supervisor',
      created_at: new Date().toISOString(),
    };
    if (!sharedTimelineEvents[booking.id]) sharedTimelineEvents[booking.id] = [];
    sharedTimelineEvents[booking.id].push(event);

    // Notify worker
    notificationService.createNotification({
      userId: workerId,
      title: 'New Service Dispatch Assigned',
      description: `You have been assigned to ${booking.service_title} on ${booking.scheduled_date} (${booking.scheduled_time}).`,
      notificationType: 'job_assigned',
      relatedId: booking.booking_code,
      actionUrl: '/worker/requests',
    });

    // Notify customer
    notificationService.createNotification({
      userId: booking.customer_id,
      title: 'Artisan Assigned to Your Booking',
      description: `${workerName || 'A verified technician'} has been assigned to oversee your service.`,
      notificationType: 'worker_assigned',
      relatedId: booking.booking_code,
      actionUrl: '/customer/bookings/active',
    });

    return { ...booking, assigned_worker_id: workerId, status: 'worker_assigned' };
  },

  /**
   * Worker accepts a job request
   */
  async acceptJobRequest({ bookingId, workerId }) {
    return this.updateBookingStatus({
      bookingId,
      newStatus: 'scheduled',
      actorId: workerId,
      actorRole: 'worker',
      notes: 'Artisan confirmed assignment and committed to schedule.',
    });
  },

  /**
   * Worker declines/rejects a job request
   */
  async rejectJobRequest({ bookingId, workerId, reason = 'Schedule conflict' }) {
    const booking = await this.getBookingDetails(bookingId);
    if (!booking) throw new Error('Booking not found.');

    // Reset assigned worker so supervisor can reassign
    sharedBookings = sharedBookings.map((b) =>
      b.id === booking.id
        ? {
            ...b,
            assigned_worker_id: null,
            worker: null,
            status: 'requested',
            updated_at: new Date().toISOString(),
          }
        : b
    );

    // Add timeline log
    const event = {
      id: `evt-${Date.now()}`,
      booking_id: booking.id,
      event_type: 'worker_rejected',
      title: 'Worker Declined Assignment',
      description: `Technician declined assignment: ${reason}. Queued for supervisor reassignment.`,
      actor_role: 'worker',
      created_at: new Date().toISOString(),
    };
    if (!sharedTimelineEvents[booking.id]) sharedTimelineEvents[booking.id] = [];
    sharedTimelineEvents[booking.id].push(event);

    // Notify supervisor
    if (booking.assigned_supervisor_id) {
      notificationService.createNotification({
        userId: booking.assigned_supervisor_id,
        title: 'Worker Declined Dispatch - Action Required',
        description: `Booking ${booking.booking_code} was declined (${reason}). Please assign another verified artisan.`,
        notificationType: 'booking_review',
        relatedId: booking.booking_code,
        actionUrl: '/supervisor/requests',
      });
    }

    return { ...booking, assigned_worker_id: null, status: 'requested' };
  },

  /**
   * Request rescheduling for an existing booking
   */
  async requestReschedule({
    bookingId,
    requestedBy,
    requestedRole = 'customer',
    requestedDate,
    requestedTime,
    reason = '',
  }) {
    const booking = await this.getBookingDetails(bookingId);
    if (!booking) throw new Error('Booking not found.');

    const newRequest = {
      id: `resched-${Date.now()}`,
      booking_id: booking.id,
      requested_by: requestedBy,
      requested_role: requestedRole,
      original_date: booking.scheduled_date,
      original_time: booking.scheduled_time,
      requested_date: requestedDate,
      requested_time: requestedTime,
      reason,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('booking_reschedule_requests').insert(newRequest);
        await supabase
          .from('bookings')
          .update({ status: 'reschedule_requested' })
          .eq('id', booking.id);
      } catch (err) {
        console.warn('Supabase requestReschedule fallback:', err.message);
      }
    }

    // Local fallback
    if (!sharedRescheduleRequests[booking.id]) sharedRescheduleRequests[booking.id] = [];
    sharedRescheduleRequests[booking.id] = [newRequest, ...sharedRescheduleRequests[booking.id]];

    sharedBookings = sharedBookings.map((b) =>
      b.id === booking.id ? { ...b, status: 'reschedule_requested' } : b
    );

    // Timeline event
    const event = {
      id: `evt-${Date.now()}`,
      booking_id: booking.id,
      event_type: 'reschedule_requested',
      title: 'Reschedule Requested',
      description: `New slot requested: ${requestedDate} (${requestedTime}). Reason: ${reason || 'Schedule adjustment'}.`,
      actor_role: requestedRole,
      created_at: new Date().toISOString(),
    };
    if (!sharedTimelineEvents[booking.id]) sharedTimelineEvents[booking.id] = [];
    sharedTimelineEvents[booking.id].push(event);

    return newRequest;
  },

  /**
   * Approve or decline a reschedule request
   */
  async respondToReschedule({
    requestId,
    bookingId,
    approved,
    responderId,
    responderRole = 'supervisor',
    note = '',
  }) {
    const booking = await this.getBookingDetails(bookingId);
    if (!booking) throw new Error('Booking not found.');

    const reschedList = sharedRescheduleRequests[booking.id] || [];
    const request = reschedList.find((r) => r.id === requestId) || reschedList[0];

    if (!request) throw new Error('Reschedule request not found.');

    if (approved) {
      // Check worker overlap on the new slot
      if (booking.assigned_worker_id) {
        const isFree = await this.checkWorkerAvailability({
          workerId: booking.assigned_worker_id,
          scheduledDate: request.requested_date,
          scheduledTime: request.requested_time,
          excludeBookingId: booking.id,
        });

        if (!isFree) {
          throw new Error('Assigned worker is unavailable on the newly requested date/time slot.');
        }
      }

      // Update booking date & time
      sharedBookings = sharedBookings.map((b) =>
        b.id === booking.id
          ? {
              ...b,
              scheduled_date: request.requested_date,
              scheduled_time: request.requested_time,
              status: 'scheduled',
              updated_at: new Date().toISOString(),
            }
          : b
      );

      request.status = 'approved';

      // Timeline log
      const event = {
        id: `evt-${Date.now()}`,
        booking_id: booking.id,
        event_type: 'reschedule_approved',
        title: 'Reschedule Approved',
        description: `Service confirmed for new schedule: ${request.requested_date} (${request.requested_time}).`,
        actor_role: responderRole,
        created_at: new Date().toISOString(),
      };
      if (!sharedTimelineEvents[booking.id]) sharedTimelineEvents[booking.id] = [];
      sharedTimelineEvents[booking.id].push(event);
    } else {
      // Declined: Keep original schedule
      sharedBookings = sharedBookings.map((b) =>
        b.id === booking.id ? { ...b, status: 'scheduled' } : b
      );
      request.status = 'declined';

      const event = {
        id: `evt-${Date.now()}`,
        booking_id: booking.id,
        event_type: 'reschedule_declined',
        title: 'Reschedule Declined',
        description: `Requested adjustment was declined. Original slot remains: ${booking.scheduled_date} (${booking.scheduled_time}). Note: ${note}`,
        actor_role: responderRole,
        created_at: new Date().toISOString(),
      };
      if (!sharedTimelineEvents[booking.id]) sharedTimelineEvents[booking.id] = [];
      sharedTimelineEvents[booking.id].push(event);
    }

    return { approved, bookingId };
  },

  /**
   * Cancel an active booking
   */
  async cancelBooking({ bookingId, actorId, actorRole = 'customer', reason = '' }) {
    const booking = await this.getBookingDetails(bookingId);
    if (!booking) throw new Error('Booking not found.');

    if (booking.status === 'completed') {
      throw new Error('Completed services cannot be cancelled.');
    }

    sharedBookings = sharedBookings.map((b) =>
      b.id === booking.id
        ? {
            ...b,
            status: 'cancelled',
            escrow_status: 'refunded',
            updated_at: new Date().toISOString(),
          }
        : b
    );

    const event = {
      id: `evt-${Date.now()}`,
      booking_id: booking.id,
      event_type: 'booking_cancelled',
      title: 'Booking Cancelled',
      description: `Cancelled by ${actorRole}. Escrow deposit of ₹${booking.total_amount || 1450} refunded. Reason: ${reason || 'User cancelled'}.`,
      actor_role: actorRole,
      created_at: new Date().toISOString(),
    };
    if (!sharedTimelineEvents[booking.id]) sharedTimelineEvents[booking.id] = [];
    sharedTimelineEvents[booking.id].push(event);

    return { ...booking, status: 'cancelled' };
  },

  /**
   * Real-time subscription to a specific booking
   */
  subscribeToBooking(bookingId, onUpdate) {
    if (!isSupabaseConfigured() || !bookingId) return () => {};

    const channelName = `realtime-booking-${bookingId}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${bookingId}`,
        },
        (payload) => {
          if (onUpdate && payload.new) onUpdate(payload.new);
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // channel removed
      }
    };
  },
};
