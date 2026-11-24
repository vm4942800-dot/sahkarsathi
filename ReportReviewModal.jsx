import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, X, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { reviewService } from '../../services/reviewService';

const REPORT_REASONS = [
  { id: 'abusive_language', label: 'Profanity, Harassment, or Abusive Language' },
  { id: 'personal_information', label: 'Contains Private Personal Information / Phone / Address' },
  { id: 'fake_misleading', label: 'Fraudulent, Misleading, or Non-Existent Dispatch Claims' },
  { id: 'spam', label: 'Spam, Commercial Advertising, or Promotion' },
  { id: 'conflict_of_interest', label: 'Competitor Defamation or Conflict of Interest' },
  { id: 'policy_violation', label: 'Other Cooperative Policy Violation' },
];

export default function ReportReviewModal({
  isOpen,
  onClose,
  review,
  reporterId = 'usr-cust-demo',
  onSuccess
}) {
  const [reason, setReason] = useState(REPORT_REASONS[0].id);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !review) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await reviewService.reportReview({
        reviewId: review.id,
        reporterId,
        reason,
        description
      });
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-brand-surface border border-brand-border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-5 border-b border-brand-border/60 bg-white/70 flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-700">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h3 className="font-display font-bold text-base text-brand-primary">
                Report Feedback to Platform Moderators
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white border border-brand-border text-brand-secondary hover:text-brand-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">Grievance Report Filed</p>
                <p className="text-[11px] text-emerald-700">
                  Our neutral cooperative moderation committee will inspect the flagged content within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <p className="text-brand-secondary leading-relaxed">
                  Help maintain respectful and trustworthy standards across SahkarSathi. Reports are confidential and reviewed by authorized administrators.
                </p>

                {/* Report Reason */}
                <div className="space-y-1.5">
                  <label className="font-bold text-brand-primary">Select Primary Violation Reason</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-brand-border text-brand-primary focus:border-brand-teal text-xs"
                  >
                    {REPORT_REASONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Details */}
                <div className="space-y-1.5">
                  <label className="font-bold text-brand-primary">
                    Additional Context / Evidence <span className="font-normal text-brand-secondary">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific lines, context, or reasons why this violates community guidelines..."
                    className="w-full p-3 rounded-xl bg-white border border-brand-border text-brand-primary placeholder:text-brand-secondary/60 text-xs resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-brand-border/60">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 rounded-xl border border-brand-border bg-white text-brand-secondary hover:text-brand-primary font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Filing Report...' : 'Submit Report'}</span>
                  </button>
                </div>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
