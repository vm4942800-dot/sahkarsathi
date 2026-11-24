/**
 * SahkarSathi Admin Booking Oversight & Dispute Mediation
 * Comprehensive booking monitoring, timeline audit, and recorded administrative overrides
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Search,
  Filter,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  RefreshCw,
  X,
  MapPin,
  User,
  HardHat,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { bookingService } from '../../services/bookingService';
import { adminService } from '../../services/adminService';
import { mockAdminUser } from '../../data/adminMockData';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [overrideModal, setOverrideModal] = useState({ isOpen: false, booking: null, newStatus: 'completed' });
  const [overrideReason, setOverrideReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getBookings({ role: 'admin' });
      setBookings(data || []);
    } catch (err) {
      console.warn('Failed to load bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleAdminOverride = async (e) => {
    e.preventDefault();
    if (!overrideReason || overrideReason.trim().length < 5) {
      setFeedback({ type: 'error', text: 'Documented justification (minimum 5 characters) is required for overrides.' });
      return;
    }

    setActionLoading(true);
    setFeedback(null);
    try {
      await adminService.overrideBookingStatus({
        bookingId: overrideModal.booking.id,
        newStatus: overrideModal.newStatus,
        reason: overrideReason,
        adminId: mockAdminUser.id,
        adminName: mockAdminUser.fullName,
      });

      setFeedback({
        type: 'success',
        text: `Booking ${overrideModal.booking.booking_code || overrideModal.booking.id} status overridden to ${overrideModal.newStatus.toUpperCase()}. Audit entry generated.`,
      });
      setOverrideModal({ isOpen: false, booking: null, newStatus: 'completed' });
      setOverrideReason('');
      setSelectedBooking(null);
      loadBookings();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const code = (b.booking_code || b.id || '').toLowerCase();
    const service = (b.service_title || b.serviceName || '').toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = code.includes(q) || service.includes(q);
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'scheduled':
        return <Badge variant="neutral">Scheduled</Badge>;
      case 'worker_assigned':
        return <Badge variant="secondary">Worker Assigned</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'reschedule_requested':
        return <Badge variant="danger">Reschedule Pending</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status || 'Requested'}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        <BackendNotice
          title="Platform Booking Lifecycle & Conflict Oversight"
          message="Inspect all customer service dispatches across stages. Arbitrary status modifications are blocked; any executive override requires explicit justification recorded in the immutable audit log."
        />

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Lifecycle Oversight
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                {bookings.length} Bookings Audited
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Booking Management
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Review booking schedules, dispatch conflicts, on-site progress, and mediate trade disputes.
            </p>
          </div>

          <button
            type="button"
            onClick={loadBookings}
            className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-primary hover:bg-black/5 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload Bookings</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between gap-3 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-brand-border shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-secondary absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by booking code (e.g. BK-2025), service title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-border bg-brand-surface/40 text-xs text-brand-primary focus:outline-none focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-brand-border text-xs text-brand-primary bg-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="worker_assigned">Worker Assigned</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl border border-brand-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-surface/80 border-b border-brand-border text-brand-secondary uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Reference & Service</th>
                  <th className="py-3.5 px-4 font-semibold">Scheduled Window</th>
                  <th className="py-3.5 px-4 font-semibold">Direct Fee</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Team</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-brand-surface/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] font-bold text-brand-teal block">
                        {b.booking_code || b.id}
                      </span>
                      <span className="font-bold text-brand-primary text-xs sm:text-sm block mt-0.5">
                        {b.service_title || b.serviceName || 'Cooperative Service'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-brand-secondary space-y-0.5 font-mono text-[11px]">
                      <span className="block font-semibold text-brand-primary">
                        {b.scheduled_date || b.scheduledDate}
                      </span>
                      <span className="block text-[10px]">
                        {b.scheduled_time || b.scheduledTime}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-sm text-brand-primary block">
                        ₹{b.total_amount || b.estimatedCost || 1450}
                      </span>
                      <span className="text-[10px] text-emerald-700 block">
                        Zero Markup
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-brand-secondary space-y-0.5">
                      <span className="block font-medium text-brand-primary">
                        Artisan: {b.worker?.name || 'Sunil Verma'}
                      </span>
                      <span className="block text-[10px]">
                        Supervisor: {b.supervisor?.name || 'Rajesh Mehta'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(b.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 rounded-lg border border-brand-border hover:bg-black/5 text-brand-primary transition-colors"
                          title="Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOverrideModal({
                              isOpen: true,
                              booking: b,
                              newStatus: b.status === 'completed' ? 'cancelled' : 'completed',
                            });
                            setOverrideReason('');
                          }}
                          className="px-2.5 py-1 rounded-lg border border-brand-border bg-brand-surface text-brand-primary hover:bg-black/5 font-semibold text-[11px] transition-colors"
                        >
                          Override
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Inspection Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-brand-border shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-teal">
                    {selectedBooking.booking_code || selectedBooking.id}
                  </span>
                  <h3 className="font-display font-bold text-lg text-brand-primary mt-1">
                    {selectedBooking.service_title || selectedBooking.serviceName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 rounded-xl hover:bg-black/5 text-brand-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-brand-surface/60 border border-brand-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-secondary">Status:</span>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-secondary">Service Date:</span>
                    <span className="font-mono font-semibold text-brand-primary">
                      {selectedBooking.scheduled_date || selectedBooking.scheduledDate} ({selectedBooking.scheduled_time || selectedBooking.scheduledTime})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-secondary">Direct Settlement Fee:</span>
                    <span className="font-mono font-bold text-brand-primary">
                      ₹{selectedBooking.total_amount || selectedBooking.estimatedCost || 1450}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-brand-surface/60 border border-brand-border space-y-1">
                  <span className="text-[10px] text-brand-secondary uppercase tracking-wider block font-bold">
                    Worksite Location
                  </span>
                  <p className="text-brand-primary">
                    {selectedBooking.service_address || selectedBooking.address || 'Standard Registered Homeowner Address'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-border flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOverrideModal({
                      isOpen: true,
                      booking: selectedBooking,
                      newStatus: selectedBooking.status === 'completed' ? 'cancelled' : 'completed',
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 text-xs font-semibold"
                >
                  Administrative Override
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-black"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Administrative Override Modal */}
        {overrideModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-white rounded-3xl border border-brand-border shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-amber-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <h3 className="font-display font-bold text-base text-brand-primary">
                  Administrative Booking Override
                </h3>
              </div>

              <p className="text-xs text-brand-secondary leading-relaxed">
                You are executing an executive status override for booking{' '}
                <strong>{overrideModal.booking?.booking_code || overrideModal.booking?.id}</strong>. Overrides bypass normal client-worker sign-off rules and are permanently recorded in the immutable audit log.
              </p>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Target Status:
                </label>
                <select
                  value={overrideModal.newStatus}
                  onChange={(e) => setOverrideModal({ ...overrideModal, newStatus: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-border text-xs text-brand-primary bg-white focus:outline-none"
                >
                  <option value="completed">Completed & Certified</option>
                  <option value="cancelled">Cancelled (Refund Due)</option>
                  <option value="in_progress">Force In Progress</option>
                  <option value="scheduled">Reset to Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Documented Mediation Justification (Mandatory):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Field inspection by senior supervisor confirmed work completion after customer travel..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-border text-xs text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-emerald/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOverrideModal({ isOpen: false, booking: null, newStatus: 'completed' })}
                  className="px-4 py-2 rounded-xl border border-brand-border text-xs text-brand-secondary hover:text-brand-primary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleAdminOverride}
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-black transition-colors"
                >
                  {actionLoading ? 'Recording...' : 'Apply Executive Override'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
