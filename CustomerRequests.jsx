import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox,
  Check,
  X,
  MapPin,
  Calendar,
  IndianRupee,
  UserCheck,
  Clock,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Send,
  Lock
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import {
  mockCustomerRequests,
  mockSupervisedWorkers
} from '../../data/supervisorMockData';
import { bookingService } from '../../services/bookingService';
import BookingDetailModal from '../../components/bookings/BookingDetailModal';

export default function CustomerRequests() {
  const [requests, setRequests] = useState(mockCustomerRequests);
  const [selectedReq, setSelectedReq] = useState(null);
  const [assignWorkerId, setAssignWorkerId] = useState(mockSupervisedWorkers[0]?.id || '');
  const [actionType, setActionType] = useState('assign'); // 'assign' | 'decline'
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [detailModalId, setDetailModalId] = useState(null);

  const handleOpenModal = (req, type) => {
    setSelectedReq(req);
    setActionType(type);
  };

  const handleConfirmAction = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;

    setProcessing(true);
    try {
      const workerObj = mockSupervisedWorkers.find((w) => w.id === assignWorkerId);

      if (actionType === 'assign') {
        await bookingService.assignWorker({
          bookingId: selectedReq.id,
          workerId: assignWorkerId,
          workerName: workerObj?.name || 'Verified Artisan',
          supervisorId: 'sup-104',
          notes: 'Supervisor assigned technician after skills and territory matching.',
        });

        setRequests((prev) => prev.filter((r) => r.id !== selectedReq.id));
        setFeedback({
          type: 'success',
          title: 'Request Assigned & Overlap Checked',
          message: `Request ${selectedReq.id} assigned to ${workerObj?.name}. Worker schedule validated without time conflicts.`,
        });
      } else {
        await bookingService.updateBookingStatus({
          bookingId: selectedReq.id,
          newStatus: 'cancelled',
          actorRole: 'supervisor',
          notes: 'Request rerouted to regional queue.',
        });

        setRequests((prev) => prev.filter((r) => r.id !== selectedReq.id));
        setFeedback({
          type: 'info',
          title: 'Request Rerouted',
          message: `Request ${selectedReq.id} released back to regional queue.`,
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        title: 'Scheduling Conflict Detected',
        message: err.message,
      });
    } finally {
      setProcessing(false);
      setSelectedReq(null);
      setTimeout(() => setFeedback(null), 6000);
    }
  };

  return (
    <SupervisorLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Incoming Homeowner Service Requests (Supervisor Intake)"
          message="Requests received from customers in your zone are screened for feasibility, safety scope, and budget alignment before assigning cooperative craftsmen."
        />

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              className={`p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm font-medium border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-brand-bgSecondary text-brand-primary border-brand-border'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">{feedback.title}</h4>
                <p className="mt-0.5 text-xs opacity-90">{feedback.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald animate-pulse" />
              <Badge variant="teal" size="sm">
                Pending Intake: {requests.length} Requests
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                East Zone Dispatch Queue
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Customer Service Requests
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Evaluate requirements, review customer schedules, and dispatch authorized workers to open jobs.
            </p>
          </div>
        </div>

        {/* Request Cards */}
        <div className="space-y-4">
          {requests.map((req) => (
            <motion.div
              key={req.id}
              layout
              className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border hover:border-brand-emerald/40 transition-all shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-brand-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-semibold text-brand-primary bg-brand-bgSecondary px-2.5 py-0.5 rounded border border-brand-border">
                      {req.id}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {req.status}
                    </span>
                    <span className="text-xs text-brand-secondary font-mono">
                      Received {req.receivedTime}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-brand-primary pt-1">
                    {req.category}
                  </h3>
                  <p className="text-xs text-brand-secondary">
                    Homeowner: <strong className="text-brand-primary">{req.customerName}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <span className="text-xs text-brand-secondary block">Customer Budget:</span>
                  <span className="font-display font-bold text-lg text-emerald-700">
                    {req.budgetEstimate}
                  </span>
                  <span className="text-[10px] text-brand-secondary font-mono block">
                    Escrow Guaranteed
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed">
                {req.customerRequirement}
              </p>

              <div className="pt-3 border-t border-brand-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs text-brand-secondary">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-brand-emerald" />
                    <span>{req.generalLocation}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{req.preferredSchedule}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(req, 'decline')}
                    className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
                  >
                    Reroute
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenModal(req, 'assign')}
                    className="px-5 py-2 rounded-xl bg-brand-emerald text-white hover:bg-brand-emerald/90 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Assign Worker</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {requests.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-brand-border space-y-3">
            <Inbox className="w-10 h-10 text-brand-secondary mx-auto opacity-40" />
            <h3 className="font-display font-bold text-lg text-brand-primary">
              All Zone Requests Assigned
            </h3>
            <p className="text-xs text-brand-secondary max-w-sm mx-auto">
              There are no pending customer requests waiting for supervisor intake.
            </p>
          </div>
        )}

        {/* Assign Worker Modal */}
        <AnimatePresence>
          {selectedReq && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedReq(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border z-10 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <h3 className="font-display font-bold text-lg text-brand-primary">
                    {actionType === 'assign' ? 'Assign Worker to Request' : 'Confirm Reroute Request'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedReq(null)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleConfirmAction} className="space-y-4 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-brand-bgSecondary border border-brand-border space-y-1">
                    <p className="font-bold text-brand-primary">{selectedReq.category}</p>
                    <p className="text-xs text-brand-secondary">{selectedReq.customerRequirement}</p>
                    <p className="text-[11px] text-emerald-800 font-semibold pt-1">
                      Budget: {selectedReq.budgetEstimate}
                    </p>
                  </div>

                  {actionType === 'assign' ? (
                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1">
                        Select Authorized Worker *
                      </label>
                      <select
                        value={assignWorkerId}
                        onChange={(e) => setAssignWorkerId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-xs outline-none focus:ring-2 focus:ring-brand-emerald"
                      >
                        {mockSupervisedWorkers.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name} — {w.role} ({w.isAvailable ? 'Available' : 'Busy'})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 text-xs">
                      Rerouting returns this request to the regional queue for reassignment to another supervisor.
                    </div>
                  )}

                  <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedReq(null)}
                      disabled={processing}
                      className="px-4 py-2 rounded-xl border border-brand-border text-xs font-semibold text-brand-secondary hover:bg-black/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className={`px-5 py-2 rounded-xl text-white text-xs font-semibold shadow-sm transition-all ${
                        actionType === 'assign'
                          ? 'bg-brand-emerald hover:bg-brand-emerald/90'
                          : 'bg-rose-600 hover:bg-rose-700'
                      }`}
                    >
                      {processing ? 'Processing...' : actionType === 'assign' ? 'Confirm & Dispatch Worker' : 'Confirm Reroute'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Booking Detail Modal */}
        <BookingDetailModal
          bookingId={detailModalId || 'BK-2026-9041'}
          role="supervisor"
          isOpen={Boolean(detailModalId)}
          onClose={() => setDetailModalId(null)}
        />
      </div>
    </SupervisorLayout>
  );
}
