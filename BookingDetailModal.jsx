/**
 * Comprehensive Booking Detail & Timeline Modal for SahkarSathi
 * Supports Customer, Worker, and Supervisor lifecycle actions, rescheduling, and timeline audit
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Wrench,
  User,
  HardHat,
  ShieldCheck,
  Coins,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Send,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Phone,
  FileText,
  ChevronRight,
  QrCode,
  IndianRupee
} from 'lucide-react';
import { bookingService, COOP_TIME_SLOTS } from '../../services/bookingService';
import Button from '../common/Button';
import Badge from '../common/Badge';
import UpiQrPaymentModal from '../payments/UpiQrPaymentModal';

export default function BookingDetailModal({
  bookingId,
  role = 'customer',
  isOpen,
  onClose,
  onBookingUpdated,
}) {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState(COOP_TIME_SLOTS[0]);
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Supervisor assignment state
  const [isAssigningWorker, setIsAssigningWorker] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState('SS-WRK-7821');

  // Direct UPI Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!bookingId || !isOpen) return;

    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setFeedbackMessage({ type: '', text: '' });
      try {
        const data = await bookingService.getBookingDetails(bookingId);
        if (isMounted) setBooking(data);
      } catch (err) {
        console.warn('Failed to load booking details:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [bookingId, isOpen]);

  if (!isOpen) return null;

  const refreshDetails = async () => {
    try {
      const data = await bookingService.getBookingDetails(bookingId);
      setBooking(data);
      if (onBookingUpdated) onBookingUpdated(data);
    } catch (err) {
      console.warn('Failed to refresh:', err.message);
    }
  };

  // Status transition handlers
  const handleStatusChange = async (newStatus, notes = '') => {
    setActionLoading(true);
    setFeedbackMessage({ type: '', text: '' });
    try {
      await bookingService.updateBookingStatus({
        bookingId: booking.id,
        newStatus,
        actorRole: role,
        notes,
      });
      setFeedbackMessage({
        type: 'success',
        text: `Booking status successfully updated to "${newStatus.replace('_', ' ').toUpperCase()}".`,
      });
      await refreshDetails();
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Reschedule submission
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate) {
      setFeedbackMessage({ type: 'error', text: 'Please select a preferred new date.' });
      return;
    }

    setActionLoading(true);
    setFeedbackMessage({ type: '', text: '' });
    try {
      await bookingService.requestReschedule({
        bookingId: booking.id,
        requestedBy: booking.customer_id || 'usr_customer_409',
        requestedRole: role,
        requestedDate: newDate,
        requestedTime: newTimeSlot,
        reason: rescheduleReason,
      });
      setIsRescheduling(false);
      setFeedbackMessage({
        type: 'success',
        text: `Reschedule request submitted for ${newDate} (${newTimeSlot}). Awaiting response.`,
      });
      await refreshDetails();
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Supervisor assigns worker
  const handleAssignWorkerSubmit = async () => {
    setActionLoading(true);
    setFeedbackMessage({ type: '', text: '' });
    try {
      await bookingService.assignWorker({
        bookingId: booking.id,
        workerId: selectedWorkerId,
        workerName: 'Sunil Verma (Master Electrician)',
        supervisorId: 'sup-104',
        notes: 'Assigned verified Grade-A wireman.',
      });
      setIsAssigningWorker(false);
      setFeedbackMessage({
        type: 'success',
        text: 'Worker assigned successfully. Overlap validation passed.',
      });
      await refreshDetails();
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Supervisor or Worker responds to reschedule
  const handleRescheduleResponse = async (approved) => {
    setActionLoading(true);
    setFeedbackMessage({ type: '', text: '' });
    try {
      await bookingService.respondToReschedule({
        bookingId: booking.id,
        approved,
        responderRole: role,
        note: approved ? 'Confirmed by team' : 'Schedule unavailable',
      });
      setFeedbackMessage({
        type: 'success',
        text: approved ? 'Reschedule request approved.' : 'Reschedule request declined.',
      });
      await refreshDetails();
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'scheduled':
        return <Badge variant="neutral">Scheduled</Badge>;
      case 'worker_assigned':
        return <Badge variant="secondary">Worker Assigned</Badge>;
      case 'completed':
        return <Badge variant="success">Completed & Certified</Badge>;
      case 'reschedule_requested':
        return <Badge variant="danger">Reschedule Pending</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status || 'Requested'}</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl bg-white rounded-3xl border border-brand-border shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-brand-surface border-b border-brand-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-teal">
                {booking?.booking_code || booking?.id}
              </span>
              {booking && getStatusBadge(booking.status)}
            </div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-brand-primary mt-1">
              {booking?.service_title || 'Booking Details'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-brand-secondary hover:text-brand-primary hover:bg-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Banner */}
        {feedbackMessage.text && (
          <div
            className={`p-3 text-xs font-medium px-6 flex items-center gap-2 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center text-xs text-brand-secondary">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-teal" />
            Loading booking record & audit timeline...
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Key Service Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-border space-y-2.5">
                <div className="flex items-center gap-2 text-brand-primary font-bold">
                  <Calendar className="w-4 h-4 text-brand-teal" />
                  <span>Scheduled Appointment</span>
                </div>
                <div className="space-y-1 pl-6">
                  <p className="text-brand-primary font-semibold">
                    {booking.scheduled_date}
                  </p>
                  <p className="text-brand-secondary">{booking.scheduled_time}</p>
                </div>

                <div className="pt-2 border-t border-brand-border/60 flex items-center gap-2 text-brand-primary font-bold">
                  <MapPin className="w-4 h-4 text-brand-teal" />
                  <span>Service Location</span>
                </div>
                <p className="text-brand-secondary pl-6 leading-relaxed">
                  {booking.service_address}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-border space-y-2.5">
                <div className="flex items-center gap-2 text-brand-primary font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Assigned Cooperative Team</span>
                </div>
                <div className="space-y-2 pl-6">
                  <div>
                    <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                      Lead Field Supervisor
                    </span>
                    <span className="font-semibold text-brand-primary">
                      {booking.supervisor?.name || 'Rajesh Mehta (Regional Lead)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                      Assigned Artisan
                    </span>
                    <span className="font-semibold text-brand-primary">
                      {booking.worker?.name || (
                        <span className="text-amber-700 font-medium">Pending Supervisor Dispatch</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                      Direct Settlement Amount
                    </span>
                    <span className="font-mono font-bold text-brand-primary">
                      ₹{booking.total_amount || 1450} (Zero Markup)
                    </span>
                  </div>
                  {role === 'customer' && booking.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(true)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <QrCode className="w-3 h-3 text-emerald-600" />
                      <span>UPI QR Pay</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {booking.instructions && (
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs">
                <span className="font-bold text-amber-900 block mb-1">
                  Customer Worksite Instructions:
                </span>
                <p className="text-amber-800 leading-relaxed">{booking.instructions}</p>
              </div>
            )}

            {/* Reschedule Request Notification Box */}
            {booking.status === 'reschedule_requested' && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reschedule Request Pending</span>
                </div>
                <p className="text-rose-700">
                  A new appointment time has been requested for this booking. Confirm or decline below.
                </p>
                {(role === 'supervisor' || role === 'worker') && (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleRescheduleResponse(true)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                    >
                      Approve New Schedule
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleRescheduleResponse(false)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-brand-border text-brand-primary font-medium text-xs hover:bg-brand-surface transition-colors"
                    >
                      Decline Request
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Booking Audit Timeline */}
            <div>
              <h3 className="font-display font-bold text-sm text-brand-primary mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-teal" />
                <span>Verified Booking Timeline & Events</span>
              </h3>

              <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-border">
                {booking.timeline && booking.timeline.length > 0 ? (
                  booking.timeline.map((event) => (
                    <div key={event.id} className="relative">
                      <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-brand-teal ring-4 ring-white" />
                      <div className="p-3 rounded-xl bg-brand-surface/40 border border-brand-border/60 text-xs">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-bold text-brand-primary">{event.title}</span>
                          <span className="text-[10px] text-brand-secondary font-mono">
                            {new Date(event.created_at).toLocaleString([], {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-secondary leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-brand-secondary">No timeline events recorded.</p>
                )}
              </div>
            </div>

            {/* Rescheduling Drawer Form */}
            {isRescheduling && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-5 rounded-2xl bg-brand-surface border border-brand-border space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-brand-primary">
                    Request New Appointment Slot
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsRescheduling(false)}
                    className="text-xs text-brand-secondary hover:text-brand-primary"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-brand-primary block mb-1">
                      New Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-primary focus:outline-none focus:border-brand-teal"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-brand-primary block mb-1">
                      New Time Slot
                    </label>
                    <select
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-primary focus:outline-none focus:border-brand-teal"
                    >
                      {COOP_TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-brand-primary block mb-1">
                      Reason for Reschedule
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Worksite unavailable or emergency travel"
                      value={rescheduleReason}
                      onChange={(e) => setRescheduleReason(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-primary focus:outline-none focus:border-brand-teal"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-2.5 rounded-xl bg-brand-teal text-white font-bold hover:bg-brand-teal-light transition-colors"
                  >
                    {actionLoading ? 'Submitting...' : 'Submit Reschedule Request'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Supervisor Assign Worker Drawer Form */}
            {isAssigningWorker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-5 rounded-2xl bg-brand-surface border border-brand-border space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-brand-primary">
                    Assign Verified Trade Artisan
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAssigningWorker(false)}
                    className="text-xs text-brand-secondary hover:text-brand-primary"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="font-semibold text-brand-primary block">
                    Available Verified Artisans (Checked for Overlaps):
                  </label>
                  <select
                    value={selectedWorkerId}
                    onChange={(e) => setSelectedWorkerId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-primary focus:outline-none focus:border-brand-teal"
                  >
                    <option value="SS-WRK-7821">Sunil Verma (Master Electrician - 4.92 ★)</option>
                    <option value="wrk-512">Arjun Das (Certified Plumber - 4.88 ★)</option>
                    <option value="wrk-339">Balwinder Singh (Artisan Woodworker - 4.95 ★)</option>
                  </select>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleAssignWorkerSubmit}
                    className="w-full py-2.5 rounded-xl bg-brand-emerald text-white font-bold hover:bg-emerald-700 transition-colors"
                  >
                    {actionLoading ? 'Validating...' : 'Confirm Dispatch & Lock Schedule'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Role-Based Action Controls */}
            <div className="pt-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-3">
              {/* Direct Messages Link */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/${role}/messages`);
                }}
                className="px-4 py-2 rounded-xl bg-brand-surface hover:bg-brand-border text-brand-primary font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-brand-teal" />
                <span>Open Project Chat Channel</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Customer actions */}
                {role === 'customer' && booking.status !== 'cancelled' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Pay via UPI</span>
                    </button>
                    {booking.status !== 'completed' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsRescheduling(true)}
                          className="px-3.5 py-2 rounded-xl bg-white border border-brand-border text-brand-primary hover:bg-brand-surface font-semibold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-brand-teal" />
                          <span>Reschedule</span>
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleStatusChange('cancelled', 'Homeowner cancelled booking.')}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold text-xs transition-colors"
                        >
                          Cancel Booking
                        </button>
                      </>
                    )}
                  </>
                )}

                {/* Worker actions */}
                {role === 'worker' && (
                  <>
                    {booking.status === 'worker_assigned' && (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => bookingService.acceptJobRequest({ bookingId: booking.id, workerId: 'SS-WRK-7821' }).then(refreshDetails)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                      >
                        Accept Dispatch
                      </button>
                    )}
                    {booking.status === 'scheduled' && (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleStatusChange('in_progress', 'Technician arrived on site and started service.')}
                        className="px-4 py-2 rounded-xl bg-brand-teal text-white font-bold text-xs hover:bg-brand-teal-light transition-colors"
                      >
                        Start Work On Site
                      </button>
                    )}
                    {booking.status === 'in_progress' && (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleStatusChange('completed', 'Technician finished all checklist items. Site cleaned.')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                      >
                        Mark Completed & Sign Off
                      </button>
                    )}
                  </>
                )}

                {/* Supervisor actions */}
                {role === 'supervisor' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsAssigningWorker(true)}
                      className="px-3.5 py-2 rounded-xl bg-brand-emerald text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                    >
                      {booking.assigned_worker_id ? 'Reassign Artisan' : 'Assign Worker'}
                    </button>
                    {booking.status === 'in_progress' && (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleStatusChange('completed', 'Supervisor quality audit passed. Escrow funds cleared for release.')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors"
                      >
                        Certify & Complete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Direct PhonePe / Paytm / GPay UPI Payment Modal */}
      {showPaymentModal && booking && (
        <UpiQrPaymentModal
          isOpen={showPaymentModal}
          booking={booking}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSubmitted={() => {
            setShowPaymentModal(false);
            setFeedbackMessage({
              type: 'success',
              text: 'Direct UPI payment reference submitted! Artisan has been notified for confirmation.',
            });
            refreshDetails();
          }}
        />
      )}
    </div>
  );
}
