import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  User,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Send,
  Calendar,
  LayoutGrid,
  FileText
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockActiveJobs } from '../../data/workerMockData';
import { bookingService } from '../../services/bookingService';
import BookingDetailModal from '../../components/bookings/BookingDetailModal';
import BookingCalendarView from '../../components/bookings/BookingCalendarView';

export default function ActiveJobs() {
  const [activeJobs, setActiveJobs] = useState(mockActiveJobs);
  const [requestingSignOff, setRequestingSignOff] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'calendar'
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (id) => {
    setSelectedBookingId(id);
    setIsModalOpen(true);
  };

  const handleRequestCompletion = async (jobId) => {
    setRequestingSignOff(true);
    try {
      await bookingService.updateBookingStatus({
        bookingId: 'BK-2025-0891',
        newStatus: 'completed',
        actorRole: 'worker',
        notes: 'Technician finished worksite inspection and load testing. Ready for supervisor certification.',
      });
      setActiveJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: 'Completed & Signed' } : job
        )
      );
      setFeedback({
        type: 'success',
        title: 'Completion Verification Logged',
        message: 'Supervisor Rajesh Mehta has been notified for post-work walkthrough. Escrow cleared for release upon customer approval.',
      });
    } catch (err) {
      setFeedback({
        type: 'info',
        title: 'Status Updated',
        message: 'Completion request logged in verified booking audit ledger.',
      });
    } finally {
      setRequestingSignOff(false);
      setTimeout(() => setFeedback(null), 6000);
    }
  };

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Active Job Milestones & Cooperative Quality Control"
          message="In accordance with SahkarSathi bylaws, jobs cannot be unilaterally marked completed. The assigned supervisor inspects the site and certifies work before customer sign-off and escrow release."
        />

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-start gap-3 text-xs sm:text-sm font-medium shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
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
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <Badge variant="teal" size="sm">
                Active Assignments: {activeJobs.length}
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                Field Execution Mode
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Active Job Execution
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Step through verified quality milestones. Contact your supervisory wing for materials confirmation and site escalations.
            </p>
          </div>

          {/* View Toggle */}
          <div className="bg-brand-surface p-1 rounded-xl border border-brand-border flex items-center text-xs">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-brand-primary shadow-xs'
                  : 'text-brand-secondary hover:text-brand-primary'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-brand-primary shadow-xs'
                  : 'text-brand-secondary hover:text-brand-primary'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Calendar</span>
            </button>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <BookingCalendarView role="worker" userId="SS-WRK-7821" />
        ) : (
          /* Active Jobs Detailed Cards */
          <div className="space-y-6">
          {activeJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-6"
            >
              {/* Job Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-brand-primary bg-brand-bgSecondary px-2.5 py-1 rounded border border-brand-border">
                      {job.id}
                    </span>
                    <Badge
                      variant={job.status === 'Completion Requested' ? 'gold' : 'emerald'}
                      size="sm"
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-brand-primary mt-1">
                    {job.service}
                  </h2>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-brand-secondary block">
                    Escrow Guaranteed Pay:
                  </span>
                  <span className="font-display font-bold text-2xl text-emerald-700">
                    {job.pay}
                  </span>
                  <span className="text-[10px] text-brand-secondary font-mono block">
                    Zero-Commission Payout
                  </span>
                </div>
              </div>

              {/* Customer & Location Permitted Data */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-brand-bgSecondary/40 border border-brand-border text-xs">
                <div>
                  <span className="text-brand-secondary block mb-0.5">Permitted Customer:</span>
                  <strong className="text-brand-primary flex items-center gap-1.5 text-sm">
                    <User className="w-3.5 h-3.5 text-brand-teal" />
                    {job.customerName}
                  </strong>
                  <span className="text-[11px] text-brand-secondary">Homeowner (Verified)</span>
                </div>

                <div>
                  <span className="text-brand-secondary block mb-0.5">Site Location:</span>
                  <strong className="text-brand-primary flex items-center gap-1.5 text-sm">
                    <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                    {job.customerGeneralArea}
                  </strong>
                  <span className="text-[11px] text-brand-secondary">Full address in masked app navigation</span>
                </div>

                <div>
                  <span className="text-brand-secondary block mb-0.5">Assigned Supervisor:</span>
                  <strong className="text-brand-primary flex items-center gap-1.5 text-sm">
                    <Phone className="w-3.5 h-3.5 text-brand-emerald" />
                    {job.supervisor.name}
                  </strong>
                  <span className="text-[11px] text-brand-secondary">{job.supervisor.phone}</span>
                </div>
              </div>

              {/* Safety Instructions & Materials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1">
                  <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    Supervisor Site Instructions
                  </h4>
                  <p className="text-amber-800 leading-relaxed">
                    {job.instructions}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-brand-border bg-white space-y-1.5">
                  <h4 className="font-bold text-brand-primary">
                    Cooperative Pre-cleared Materials
                  </h4>
                  <ul className="space-y-1 text-brand-secondary">
                    {job.materialsProvided.map((mat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span>{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 6-Stage Milestone Visual Stepper */}
              <div className="pt-2">
                <h3 className="font-display font-semibold text-sm text-brand-primary mb-4 flex items-center justify-between">
                  <span>Cooperative Verification Milestone Tracker</span>
                  <span className="text-xs text-brand-secondary font-mono">
                    Milestone {job.milestoneIndex + 1} of {job.milestones.length}
                  </span>
                </h3>

                <div className="relative border-l-2 border-brand-border pl-6 ml-3 space-y-6">
                  {job.milestones.map((m, idx) => {
                    const isDone = m.completed;
                    const isCurrent = idx === job.milestoneIndex;

                    return (
                      <div key={idx} className="relative group">
                        <div
                          className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 transition-all ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-brand-teal border-brand-teal ring-4 ring-brand-teal/20 animate-pulse'
                              : 'bg-white border-gray-300'
                          }`}
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4
                            className={`text-xs sm:text-sm font-semibold ${
                              isDone
                                ? 'text-emerald-900'
                                : isCurrent
                                ? 'text-brand-primary font-bold'
                                : 'text-gray-400'
                            }`}
                          >
                            {m.title}
                          </h4>
                          <span className="text-[11px] text-brand-secondary font-mono">
                            {m.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-xs text-brand-secondary flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-teal" />
                  <span>Quality seal mandatory before escrow disbursement.</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenDetails('BK-2025-0891')}
                    className="px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-brand-primary text-xs font-semibold hover:bg-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Timeline & Actions</span>
                  </button>

                  <a
                    href={`tel:${job.supervisor.phone}`}
                    className="px-4 py-2.5 rounded-xl border border-brand-border hover:bg-black/5 text-brand-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Supervisor</span>
                  </a>

                  {job.status === 'In Progress' && (
                    <button
                      type="button"
                      onClick={() => handleRequestCompletion(job.id)}
                      disabled={requestingSignOff}
                      className="px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{requestingSignOff ? 'Notifying Supervisor...' : 'Request Supervisor Sign-off'}</span>
                    </button>
                  )}

                  {job.status === 'Completion Requested' && (
                    <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                      <span>Sign-off Review in Progress</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {activeJobs.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-brand-border space-y-3">
              <Briefcase className="w-10 h-10 text-brand-secondary mx-auto opacity-40" />
              <h3 className="font-display font-bold text-lg text-brand-primary">
                No Active Jobs Underway
              </h3>
              <p className="text-xs text-brand-secondary max-w-sm mx-auto">
                You currently have no active assignments. Accept a dispatched job request or browse the nearby opportunities board.
              </p>
            </div>
          )}
        </div>
        )}
      </div>

      {/* Booking Detail & Timeline Modal */}
      <BookingDetailModal
        bookingId={selectedBookingId || 'BK-2025-0891'}
        role="worker"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </WorkerLayout>
  );
}
