import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  X,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  FileText,
  User,
  Info,
  RefreshCw
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockJobRequests } from '../../data/workerMockData';
import { bookingService } from '../../services/bookingService';
import BookingDetailModal from '../../components/bookings/BookingDetailModal';

export default function JobRequests() {
  const [requests, setRequests] = useState(mockJobRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null); // 'accept' | 'decline'
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [detailModalId, setDetailModalId] = useState(null);

  const handleActionClick = (req, type) => {
    setSelectedRequest(req);
    setActionType(type);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !actionType) return;
    setProcessing(true);

    try {
      if (actionType === 'accept') {
        await bookingService.acceptJobRequest({
          bookingId: selectedRequest.id,
          workerId: 'SS-WRK-7821',
        });
        setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
        setFeedback({
          type: 'success',
          title: 'Direct Dispatch Accepted',
          message: `Request ${selectedRequest.id} has been accepted and committed to your schedule without overlapping conflicts.`,
        });
      } else {
        await bookingService.rejectJobRequest({
          bookingId: selectedRequest.id,
          workerId: 'SS-WRK-7821',
          reason: 'Schedule adjustment',
        });
        setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
        setFeedback({
          type: 'info',
          title: 'Request Declined',
          message: `Request ${selectedRequest.id} was released back to the supervisor pool for reassignment.`,
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        title: 'Action Error',
        message: err.message,
      });
    } finally {
      setProcessing(false);
      setSelectedRequest(null);
      setActionType(null);
      setTimeout(() => setFeedback(null), 6000);
    }
  };

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Direct Customer Job Requests & Dispatches"
          message="Requests listed here were matched to your verified credentials or requested specifically by repeat customers. Accepting locks the booking exclusively to prevent double dispatch."
        />

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm font-medium border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-brand-bgSecondary text-brand-primary border-brand-border'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">{feedback.title}</h4>
                <p className="mt-0.5 text-xs opacity-90">{feedback.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-teal animate-pulse" />
              <Badge variant="teal" size="sm">
                Pending Responses: {requests.length}
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                Exclusive Reserve Timer: 45 min
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Job Requests Received
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Review homeowner service invitations. Please accept or decline promptly so homeowners can plan their service windows.
            </p>
          </div>
        </div>

        {/* Request Cards */}
        <div className="space-y-4">
          {requests.map((req) => (
            <motion.div
              key={req.id}
              layout
              className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border hover:border-brand-teal/40 transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-brand-secondary bg-brand-bgSecondary px-2 py-0.5 rounded border border-brand-border">
                      {req.id}
                    </span>
                    <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
                      {req.status}
                    </span>
                    <span className="text-xs text-brand-secondary font-mono">
                      Received {req.receivedAt}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-brand-primary pt-1">
                    {req.service}
                  </h3>
                  <p className="text-xs text-brand-secondary">
                    Requested by: <strong className="text-brand-primary">{req.customerName}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-brand-secondary block">
                    Estimated Compensation:
                  </span>
                  <span className="font-display font-bold text-lg text-emerald-700">
                    {req.estimatedPay}
                  </span>
                  <span className="text-[10px] text-brand-secondary block font-mono">
                    Escrow Guaranteed
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-brand-secondary mt-3 leading-relaxed">
                {req.description}
              </p>

              {/* Service Meta Details */}
              <div className="mt-4 pt-3 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-3 text-xs text-brand-secondary">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{req.customerArea}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{req.scheduledDate}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{req.scheduledTime}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleActionClick(req, 'decline')}
                    className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick(req, 'accept')}
                    className="px-5 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Request</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-brand-border space-y-3">
            <Bell className="w-10 h-10 text-brand-secondary mx-auto opacity-40" />
            <h3 className="font-display font-bold text-lg text-brand-primary">
              No Pending Job Requests
            </h3>
            <p className="text-xs text-brand-secondary max-w-sm mx-auto">
              You have answered all incoming direct invitations. To find more tasks, explore the open marketplace.
            </p>
          </div>
        )}

        {/* Action Confirmation Modal */}
        <AnimatePresence>
          {selectedRequest && actionType && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedRequest(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border z-10 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <div className="flex items-center gap-2">
                    {actionType === 'accept' ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                    )}
                    <h3 className="font-display font-bold text-lg text-brand-primary">
                      {actionType === 'accept' ? 'Confirm Acceptance' : 'Decline Job Invitation'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xs sm:text-sm space-y-2">
                  <p className="font-semibold text-brand-primary">
                    {selectedRequest.service}
                  </p>
                  <p className="text-brand-secondary text-xs">
                    {selectedRequest.customerArea} • {selectedRequest.scheduledDate} ({selectedRequest.scheduledTime})
                  </p>

                  <div className={`p-3 rounded-xl border text-xs ${
                    actionType === 'accept'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {actionType === 'accept'
                      ? 'Accepting this request reserves the slot on your schedule. You will coordinate with your assigned Supervisor for pre-work safety inspection.'
                      : 'Declining releases this customer request back to the regional cooperative pool without penalty.'}
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    disabled={processing}
                    className="px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-secondary hover:bg-black/5"
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAction}
                    disabled={processing}
                    className={`px-5 py-2.5 rounded-xl text-white text-xs font-semibold shadow-sm transition-all ${
                      actionType === 'accept'
                        ? 'bg-brand-teal hover:bg-brand-teal/90'
                        : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    {processing ? 'Updating...' : actionType === 'accept' ? 'Yes, Accept Booking' : 'Yes, Decline Request'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </WorkerLayout>
  );
}
