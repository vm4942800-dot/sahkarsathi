import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ShieldAlert,
  Star,
  Search,
  Filter,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  CornerDownRight,
  ShieldCheck,
  X,
  Clock,
  Flag
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { reviewService } from '../../services/reviewService';
import { adminService } from '../../services/adminService';

export default function ReviewModeration() {
  const [reviews, setReviews] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'published' | 'hidden' | 'reported'
  const [filterRating, setFilterRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected for Action
  const [moderationModalOpen, setModerationModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [moderationAction, setModerationAction] = useState('hide'); // 'hide' | 'restore'
  const [moderationNotes, setModerationNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [revs, reps] = await Promise.all([
        reviewService.getAllReviews({
          status: filterStatus,
          minRating: filterRating,
          search: searchQuery
        }),
        reviewService.getReviewReports()
      ]);
      setReviews(revs || []);
      setReports(reps || []);
    } catch (err) {
      console.warn('Failed to load admin reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterStatus, filterRating, searchQuery]);

  const handleOpenModeration = (review, action) => {
    setSelectedReview(review);
    setModerationAction(action);
    setModerationNotes('');
    setModerationModalOpen(true);
  };

  const handleExecuteModeration = async (e) => {
    e.preventDefault();
    if (!selectedReview) return;

    setIsSubmitting(true);
    setFeedbackMsg(null);
    try {
      await reviewService.moderateReview({
        reviewId: selectedReview.id,
        action: moderationAction,
        notes: moderationNotes,
        adminId: 'admin-001'
      });
      setFeedbackMsg(`Review successfully ${moderationAction === 'hide' ? 'hidden from public view' : 'restored to published'}.`);
      setModerationModalOpen(false);
      await loadData();
    } catch (err) {
      alert(err.message || 'Moderation action failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;

  return (
    <AdminLayout title="Review Moderation">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-surface border border-brand-border text-brand-secondary text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Community Integrity & Review Governance
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Review Moderation & Feedback Oversight
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary mt-1 max-w-2xl leading-relaxed">
              Maintain cooperative trust without censorship. Moderate content violating privacy or harassment bylaws. Every action is registered in immutable audit logs.
            </p>
          </div>

          {pendingReportsCount > 0 && (
            <div className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 self-start">
              <Flag className="w-4 h-4 text-rose-600" />
              <span>{pendingReportsCount} Grievance Reports Pending</span>
            </div>
          )}
        </div>

        {feedbackMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-3xl bg-white border border-brand-border shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-brand-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search text, artisan, client, or booking..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-brand-primary text-xs focus:border-brand-teal"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-brand-secondary font-semibold text-[11px] whitespace-nowrap">
                Status:
              </span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-border text-brand-primary text-xs font-semibold focus:border-brand-teal"
              >
                <option value="all">All Reviews</option>
                <option value="reported">Flagged / Reported Only</option>
                <option value="published">Published Active</option>
                <option value="hidden">Hidden / Moderated</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-2">
              <span className="text-brand-secondary font-semibold text-[11px] whitespace-nowrap">
                Rating:
              </span>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-border text-brand-primary text-xs font-semibold focus:border-brand-teal"
              >
                <option value={0}>All Star Ratings</option>
                <option value={5}>5 Stars Only</option>
                <option value={4}>4+ Stars</option>
                <option value={3}>3 Stars or below</option>
                <option value={1}>Critical (1 Star)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews Moderation Table / Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-xs text-brand-secondary">
              Querying platform review registers...
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-brand-border text-center space-y-2 text-xs text-brand-secondary">
              <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto" />
              <p className="font-bold text-sm text-brand-primary">No Matching Reviews Found</p>
              <p>Adjust your search filters to inspect published or reported reviews.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {reviews.map((rev) => {
                const isHidden = rev.status === 'hidden';
                const hasReport = rev.reportCount > 0;

                return (
                  <div
                    key={rev.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      isHidden
                        ? 'bg-zinc-50 border-zinc-200'
                        : hasReport
                        ? 'bg-rose-50/50 border-rose-200'
                        : 'bg-white border-brand-border shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-brand-border/60">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-brand-primary text-sm">
                            {rev.customer_name}
                          </span>
                          <span className="text-brand-secondary text-xs">evaluated</span>
                          <span className="font-bold text-brand-teal text-xs">
                            {rev.worker_name} ({rev.worker_trade || 'Artisan'})
                          </span>

                          {/* Status badges */}
                          {isHidden ? (
                            <span className="px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800 text-[10px] font-bold inline-flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              Hidden
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Published
                            </span>
                          )}

                          {hasReport && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 border border-rose-200 text-rose-800 text-[10px] font-bold inline-flex items-center gap-1">
                              <Flag className="w-3 h-3 text-rose-600" />
                              {rev.reportCount} Report(s)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-brand-secondary">
                          <span>Booking ID: <strong className="font-mono text-brand-primary">#{rev.booking_id?.slice(-6).toUpperCase()}</strong></span>
                          <span>•</span>
                          <span>
                            {new Date(rev.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Rating & Moderation CTA */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{rev.rating}.0</span>
                        </div>

                        {isHidden ? (
                          <button
                            type="button"
                            onClick={() => handleOpenModeration(rev, 'restore')}
                            className="px-3 py-1.5 rounded-xl bg-white border border-brand-border text-brand-primary font-bold text-xs hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-800 transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenModeration(rev, 'hide')}
                            className="px-3 py-1.5 rounded-xl bg-white border border-brand-border text-rose-700 font-bold text-xs hover:bg-rose-50 hover:border-rose-200 transition-colors flex items-center gap-1"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Moderate / Hide</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="pt-3 text-xs text-brand-primary leading-relaxed">
                      <p>{rev.review_text}</p>
                    </div>

                    {/* Worker Response Preview if exists */}
                    {rev.response && (
                      <div className="mt-3 p-3 rounded-2xl bg-brand-surface/70 border border-brand-border/70 text-xs text-brand-secondary flex items-start gap-2">
                        <CornerDownRight className="w-3.5 h-3.5 text-brand-teal flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-brand-teal block">
                            Artisan Response:
                          </span>
                          <p className="text-brand-primary mt-0.5">{rev.response.response_text}</p>
                        </div>
                      </div>
                    )}

                    {/* Moderation Notes if recorded */}
                    {rev.moderation_notes && (
                      <div className="mt-2.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span><strong>Moderator Audit Note:</strong> {rev.moderation_notes}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Moderation Action Modal */}
      <AnimatePresence>
        {moderationModalOpen && selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-surface border border-brand-border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-5 border-b border-brand-border bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-base text-brand-primary">
                    {moderationAction === 'hide' ? 'Hide Review Content' : 'Restore Review Content'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModerationModalOpen(false)}
                  className="p-1.5 rounded-xl border border-brand-border bg-white text-brand-secondary hover:text-brand-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleExecuteModeration} className="p-5 space-y-4 text-xs">
                <p className="text-brand-secondary leading-relaxed">
                  {moderationAction === 'hide' ? (
                    <span>
                      Hiding will remove this review from the public worker profile and ratings calculation. A record is logged under Admin Audit Logs.
                    </span>
                  ) : (
                    <span>
                      Restoring will reinstate this review into active calculations and make it visible on the worker profile.
                    </span>
                  )}
                </p>

                <div className="space-y-1.5">
                  <label className="font-bold text-brand-primary">
                    Official Moderation Note (Saved to Immutable Audit Trail) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={moderationNotes}
                    onChange={(e) => setModerationNotes(e.target.value)}
                    placeholder="Enter compliance justification (e.g., DPDP Act section, profanity removal, dispute resolution agreement)..."
                    className="w-full p-3 rounded-xl bg-white border border-brand-border text-brand-primary text-xs resize-none focus:border-brand-teal"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-brand-border">
                  <button
                    type="button"
                    onClick={() => setModerationModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl border border-brand-border bg-white text-brand-secondary hover:text-brand-primary font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-xl text-white font-bold transition-colors ${
                      moderationAction === 'hide'
                        ? 'bg-rose-600 hover:bg-rose-700'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {isSubmitting ? 'Logging Action...' : `Confirm ${moderationAction === 'hide' ? 'Hide Review' : 'Restore Review'}`}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
