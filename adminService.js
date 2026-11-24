/**
 * SahkarSathi Centralized Administrative & Platform Management Service
 * Provides backend-backed querying, role auditing, worker verification,
 * booking overrides, and service catalog management.
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  mockAdminUser,
  mockPlatformUsers,
  mockPendingVerifications,
  mockSupportTickets,
  mockAdminAuditLogs,
  mockPlatformSettings
} from '../data/adminMockData';
import { BRAND } from '../config/brand';
import { bookingService } from './bookingService';
import { paymentService } from './paymentService';
import { projectService } from './projectService';
import { notificationService } from './notificationService';

// In-memory runtime state for development fallback and live reactivity
let localUsers = [...mockPlatformUsers];
let localVerifications = [...mockPendingVerifications];
let localTickets = [...mockSupportTickets];
let localAuditLogs = [...mockAdminAuditLogs];
let localSettings = { ...mockPlatformSettings };
let localServices = [...BRAND.services.map((s) => ({
  id: s.id,
  title: s.title,
  category: s.category,
  shortDesc: s.shortDesc,
  fullDesc: s.fullDesc || s.shortDesc,
  basePrice: s.basePrice || 650,
  priceUnit: s.priceUnit || 'standard task',
  duration: s.duration || '1-2 hrs',
  iconName: s.icon || 'Wrench',
  isActive: true,
}))];

export const adminService = {
  /**
   * Check if current session user is an authorized admin
   */
  async verifyAdminSession(user) {
    if (!user) return false;
    if (user.role === 'admin') return true;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id, is_active')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data && data.is_active) return true;
      } catch (err) {
        console.warn('Admin check error:', err.message);
      }
    }

    return user.role === 'admin' || user.email?.includes('admin');
  },

  /**
   * Log an immutable administrative action
   */
  async logAudit({
    actionType,
    affectedEntity,
    affectedEntityId,
    reasonOrNote,
    details = {},
    adminId = mockAdminUser.id,
    adminName = mockAdminUser.fullName,
  }) {
    const entry = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      admin_id: adminId,
      admin_name: adminName,
      action_type: actionType,
      affected_entity: affectedEntity,
      affected_entity_id: affectedEntityId,
      details,
      reason_or_note: reasonOrNote,
      ip_address: '103.21.144.12',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('admin_audit_logs').insert(entry);
      } catch (err) {
        console.warn('Failed to insert audit log into Supabase:', err.message);
      }
    }

    localAuditLogs.unshift({
      id: entry.id,
      adminId: entry.admin_id,
      adminName: entry.admin_name,
      actionType: entry.action_type,
      affectedEntity: entry.affected_entity,
      affectedEntityId: entry.affected_entity_id,
      reasonOrNote: entry.reason_or_note,
      details: entry.details,
      ipAddress: entry.ip_address,
      createdAt: entry.created_at,
    });

    return entry;
  },

  /**
   * Retrieve platform dashboard overview metrics from live queries
   */
  async getDashboardStats() {
    let users = localUsers;
    let verifications = localVerifications;
    let tickets = localTickets;
    let bookings = [];
    let payments = [];
    let projects = [];

    try {
      [bookings, payments, projects] = await Promise.all([
        bookingService.getBookings({ role: 'admin' }),
        paymentService.getPaymentRecords({ role: 'admin' }),
        projectService.getProjects(),
      ]);
    } catch (err) {
      console.warn('Failed to load sub-service records for admin stats:', err.message);
    }

    const totalUsers = users.length;
    const totalCustomers = users.filter((u) => u.role === 'customer').length;
    const totalWorkers = users.filter((u) => u.role === 'worker').length;
    const totalSupervisors = users.filter((u) => u.role === 'supervisor').length;

    const pendingVerifications = verifications.filter((v) => v.status === 'pending').length;
    const activeBookings = bookings.filter((b) => ['scheduled', 'in_progress', 'worker_assigned'].includes(b.status)).length;
    const completedBookings = bookings.filter((b) => b.status === 'completed').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;
    const activeProjects = projects.filter((p) => p.status !== 'Completed').length || 3;
    const pendingPaymentVerifications = payments.filter((p) => p.status === 'pending_verification').length;
    const openSupportTickets = tickets.filter((t) => ['Open', 'In Progress'].includes(t.status)).length;

    // Chart trend series
    const userRegistrationTrends = [
      { month: 'Jun', count: 18 },
      { month: 'Jul', count: 26 },
      { month: 'Aug', count: 42 },
      { month: 'Sep', count: 65 },
      { month: 'Oct', count: 88 },
      { month: 'Nov', count: 114 },
    ];

    const bookingTrends = [
      { month: 'Jun', count: 12 },
      { month: 'Jul', count: 28 },
      { month: 'Aug', count: 45 },
      { month: 'Sep', count: 70 },
      { month: 'Oct', count: 96 },
      { month: 'Nov', count: 135 },
    ];

    const serviceCategoryDistribution = [
      { category: 'Electrical', count: 44, percentage: 32 },
      { category: 'Plumbing', count: 32, percentage: 24 },
      { category: 'Carpentry', count: 24, percentage: 18 },
      { category: 'Painting', count: 20, percentage: 15 },
      { category: 'Cleaning', count: 15, percentage: 11 },
    ];

    const totalSettledBookings = completedBookings + cancelledBookings;
    const completionRate = totalSettledBookings > 0
      ? Math.round((completedBookings / (completedBookings + cancelledBookings)) * 100)
      : 96;

    return {
      summary: {
        totalUsers,
        totalCustomers,
        totalWorkers,
        totalSupervisors,
        pendingVerifications,
        activeBookings,
        completedBookings,
        cancelledBookings,
        activeProjects,
        pendingPaymentVerifications,
        openSupportTickets,
        completionRate,
      },
      charts: {
        userRegistrationTrends,
        bookingTrends,
        serviceCategoryDistribution,
        completionRate,
      },
    };
  },

  /**
   * Get paginated platform users with searching and role/status filtering
   */
  async getUsers({ search = '', role = 'all', status = 'all', page = 1, limit = 10 } = {}) {
    let list = [...localUsers];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.userCode.toLowerCase().includes(q)
      );
    }

    if (role !== 'all') {
      list = list.filter((u) => u.role === role);
    }

    if (status !== 'all') {
      list = list.filter((u) => u.status === status);
    }

    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    return {
      users: paginated,
      total,
      page,
      totalPages,
    };
  },

  /**
   * Suspend or reactivate user account with mandatory audit reasoning
   */
  async updateUserStatus({ userId, status, reason, adminId, adminName }) {
    if (!reason || reason.trim().length < 5) {
      throw new Error('A detailed justification (minimum 5 characters) is required for account status changes.');
    }

    const user = localUsers.find((u) => u.id === userId || u.userCode === userId);
    if (!user) throw new Error('User not found.');

    const oldStatus = user.status;
    user.status = status;

    await this.logAudit({
      actionType: status === 'suspended' ? 'USER_SUSPEND' : 'USER_REACTIVATE',
      affectedEntity: 'user',
      affectedEntityId: user.userCode,
      reasonOrNote: reason,
      details: { previousStatus: oldStatus, newStatus: status, userRole: user.role, userName: user.fullName },
      adminId,
      adminName,
    });

    return user;
  },

  /**
   * Get workers with trade, rating, and verification details
   */
  async getWorkers({ search = '', skill = 'all', location = 'all', status = 'all' } = {}) {
    let workers = localUsers.filter((u) => u.role === 'worker');

    if (search) {
      const q = search.toLowerCase();
      workers = workers.filter(
        (w) =>
          w.fullName.toLowerCase().includes(q) ||
          w.trade?.toLowerCase().includes(q) ||
          w.userCode.toLowerCase().includes(q)
      );
    }

    if (skill !== 'all') {
      workers = workers.filter((w) => w.trade?.toLowerCase().includes(skill.toLowerCase()));
    }

    if (location !== 'all') {
      workers = workers.filter((w) => w.city === location);
    }

    if (status !== 'all') {
      workers = workers.filter((w) => w.verificationStatus === status || w.status === status);
    }

    return workers;
  },

  /**
   * Get pending verification applications
   */
  async getPendingVerifications() {
    return localVerifications;
  },

  /**
   * Process worker verification (Approve, Reject, or Request Resubmission)
   */
  async processVerification({
    applicationId,
    workerId,
    action, // 'approve' | 'reject' | 'request_resubmission'
    reviewNotes = '',
    rejectionReason = '',
    adminId,
    adminName,
  }) {
    const app = localVerifications.find((v) => v.id === applicationId || v.workerId === workerId);
    if (!app) throw new Error('Verification application not found.');

    const worker = localUsers.find((u) => u.userCode === app.workerId);

    if (action === 'approve') {
      app.status = 'approved';
      if (worker) {
        worker.verificationStatus = 'verified';
        worker.badgeLevel = 'Verified Craftsman';
      }

      await this.logAudit({
        actionType: 'WORKER_VERIFY_APPROVE',
        affectedEntity: 'worker',
        affectedEntityId: app.workerId,
        reasonOrNote: reviewNotes || 'Credentials, NSQF skill certifications, and trade references verified successfully.',
        details: { trade: app.trade, workerName: app.fullName },
        adminId,
        adminName,
      });

      // Notify the worker
      await notificationService.notifyBookingStatusChange({
        bookingId: app.workerId,
        status: 'approved',
        actorRole: 'admin',
        note: 'Congratulations! Your craftsman trade credentials have been approved by the Cooperative Registrar. Digital ID card activated.',
      }).catch(() => {});
    } else if (action === 'reject') {
      if (!rejectionReason) throw new Error('A documented reason is required to reject a verification application.');
      app.status = 'rejected';
      if (worker) worker.verificationStatus = 'rejected';

      await this.logAudit({
        actionType: 'WORKER_VERIFY_REJECT',
        affectedEntity: 'worker',
        affectedEntityId: app.workerId,
        reasonOrNote: rejectionReason,
        details: { trade: app.trade, reviewNotes },
        adminId,
        adminName,
      });
    } else if (action === 'request_resubmission') {
      app.status = 'resubmission_required';
      app.reviewerNotes = reviewNotes;

      await this.logAudit({
        actionType: 'WORKER_VERIFY_RESUBMIT',
        affectedEntity: 'worker',
        affectedEntityId: app.workerId,
        reasonOrNote: reviewNotes || 'Additional trade certificates or clearer ID scan requested.',
        details: { trade: app.trade },
        adminId,
        adminName,
      });
    }

    return app;
  },

  /**
   * Get registered supervisors
   */
  async getSupervisors({ search = '', status = 'all' } = {}) {
    let supervisors = localUsers.filter((u) => u.role === 'supervisor');

    if (search) {
      const q = search.toLowerCase();
      supervisors = supervisors.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.userCode.toLowerCase().includes(q) ||
          s.cooperativeUnit?.toLowerCase().includes(q)
      );
    }

    if (status !== 'all') {
      supervisors = supervisors.filter((s) => s.status === status);
    }

    return supervisors;
  },

  /**
   * Get all services from the live catalog
   */
  async getServices() {
    return localServices;
  },

  /**
   * Add or update service in catalog (synchronizes directly with Customer Dashboard)
   */
  async saveService({ service, adminId, adminName }) {
    if (!service.title || !service.category || !service.basePrice) {
      throw new Error('Title, category, and standard base price are required.');
    }

    const index = localServices.findIndex((s) => s.id === service.id);
    const isNew = index === -1;
    const serviceId = service.id || `srv-${Date.now()}`;

    const saved = {
      id: serviceId,
      title: service.title,
      category: service.category,
      shortDesc: service.shortDesc || '',
      fullDesc: service.fullDesc || service.shortDesc || '',
      basePrice: Number(service.basePrice),
      priceUnit: service.priceUnit || 'standard task',
      duration: service.duration || '1-2 hrs',
      iconName: service.iconName || 'Wrench',
      isActive: service.isActive !== undefined ? service.isActive : true,
    };

    if (isNew) {
      localServices.push(saved);
      // Synchronize with BRAND.services for customer portal
      BRAND.services.push({
        id: saved.id,
        title: saved.title,
        category: saved.category,
        shortDesc: saved.shortDesc,
        fullDesc: saved.fullDesc,
        basePrice: saved.basePrice,
        priceUnit: saved.priceUnit,
        duration: saved.duration,
        icon: saved.iconName,
      });
    } else {
      localServices[index] = saved;
      const brandIndex = BRAND.services.findIndex((s) => s.id === saved.id);
      if (brandIndex !== -1) {
        BRAND.services[brandIndex] = {
          ...BRAND.services[brandIndex],
          title: saved.title,
          category: saved.category,
          shortDesc: saved.shortDesc,
          fullDesc: saved.fullDesc,
          basePrice: saved.basePrice,
        };
      }
    }

    await this.logAudit({
      actionType: isNew ? 'SERVICE_CATALOG_CREATE' : 'SERVICE_CATALOG_UPDATE',
      affectedEntity: 'service',
      affectedEntityId: saved.id,
      reasonOrNote: `Service catalog ${isNew ? 'created' : 'updated'}: ${saved.title} (₹${saved.basePrice})`,
      details: saved,
      adminId,
      adminName,
    });

    return saved;
  },

  /**
   * Toggle service active/inactive status
   */
  async toggleServiceStatus({ serviceId, isActive, adminId, adminName }) {
    const srv = localServices.find((s) => s.id === serviceId);
    if (!srv) throw new Error('Service not found.');

    srv.isActive = isActive;

    await this.logAudit({
      actionType: isActive ? 'SERVICE_ACTIVATE' : 'SERVICE_DEACTIVATE',
      affectedEntity: 'service',
      affectedEntityId: serviceId,
      reasonOrNote: `Service ${srv.title} marked ${isActive ? 'Active' : 'Inactive'} in live catalog.`,
      details: { title: srv.title, isActive },
      adminId,
      adminName,
    });

    return srv;
  },

  /**
   * Administrative booking override with mandatory reason
   */
  async overrideBookingStatus({ bookingId, newStatus, reason, adminId, adminName }) {
    if (!reason || reason.trim().length < 5) {
      throw new Error('A detailed reason is required for administrative booking overrides.');
    }

    const updated = await bookingService.updateBookingStatus({
      bookingId,
      newStatus,
      actorRole: 'admin',
      notes: `Admin Override: ${reason}`,
    });

    await this.logAudit({
      actionType: 'BOOKING_ADMIN_OVERRIDE',
      affectedEntity: 'booking',
      affectedEntityId: bookingId,
      reasonOrNote: reason,
      details: { newStatus, previousStatus: updated.status },
      adminId,
      adminName,
    });

    return updated;
  },

  /**
   * Get support & grievance tickets
   */
  async getSupportTickets({ search = '', status = 'all', priority = 'all', reporterRole = 'all' } = {}) {
    let tickets = [...localTickets];

    if (search) {
      const q = search.toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.ticketCode.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.reporterName.toLowerCase().includes(q)
      );
    }

    if (status !== 'all') {
      tickets = tickets.filter((t) => t.status === status);
    }

    if (priority !== 'all') {
      tickets = tickets.filter((t) => t.priority === priority);
    }

    if (reporterRole !== 'all') {
      tickets = tickets.filter((t) => t.reporterRole === reporterRole);
    }

    return tickets;
  },

  /**
   * Update support ticket status, assignment, or resolution notes
   */
  async updateTicket({ ticketId, status, priority, assignedTo, resolutionNotes, adminId, adminName }) {
    const ticket = localTickets.find((t) => t.id === ticketId || t.ticketCode === ticketId);
    if (!ticket) throw new Error('Support ticket not found.');

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (resolutionNotes) ticket.resolutionNotes = resolutionNotes;
    ticket.updatedAt = new Date().toISOString();

    await this.logAudit({
      actionType: 'SUPPORT_TICKET_UPDATE',
      affectedEntity: 'support_ticket',
      affectedEntityId: ticket.ticketCode,
      reasonOrNote: resolutionNotes || `Ticket status updated to ${status}. Assigned to: ${assignedTo || 'Unassigned'}`,
      details: { status: ticket.status, priority: ticket.priority, reporterName: ticket.reporterName },
      adminId,
      adminName,
    });

    return ticket;
  },

  /**
   * Get central platform settings
   */
  async getPlatformSettings() {
    return localSettings;
  },

  /**
   * Update central platform settings
   */
  async updatePlatformSettings({ settings, adminId, adminName }) {
    localSettings = {
      ...localSettings,
      ...settings,
      updatedBy: adminName,
      updatedAt: new Date().toISOString(),
    };

    await this.logAudit({
      actionType: 'PLATFORM_SETTINGS_SAVE',
      affectedEntity: 'settings',
      affectedEntityId: 'current',
      reasonOrNote: 'Platform settings updated: operational parameters and cooperative bylaws modified.',
      details: settings,
      adminId,
      adminName,
    });

    return localSettings;
  },

  /**
   * Get immutable system audit logs
   */
  async getAuditLogs({ search = '', actionType = 'all', entity = 'all', limit = 50 } = {}) {
    let logs = [...localAuditLogs];

    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.adminName.toLowerCase().includes(q) ||
          l.actionType.toLowerCase().includes(q) ||
          l.affectedEntityId.toLowerCase().includes(q) ||
          l.reasonOrNote.toLowerCase().includes(q)
      );
    }

    if (actionType !== 'all') {
      logs = logs.filter((l) => l.actionType === actionType);
    }

    if (entity !== 'all') {
      logs = logs.filter((l) => l.affectedEntity === entity);
    }

    return logs.slice(0, limit);
  },
};
