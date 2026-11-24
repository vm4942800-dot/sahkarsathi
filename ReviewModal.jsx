import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Info, 
  Sparkles,
  Clock,
  MessageSquare,
  ThumbsUp,
  Award
} from 'lucide-react';
import { reviewService } from '../../services/reviewService';

const CATEGORIES = [
  { key: 'service_quality', label: 'Service Quality', icon: Award, desc: 'Technical craft standards and finish' },
  { key: 'professionalism', label: 'Professionalism', icon: ShieldCheck, desc: 'Conduct, respect, and site care' },
  { key: 'punctuality', label: 'Punctuality', icon: Clock, desc: 'Adherence to agreed schedule' },
  { key: 'communication', label: 'Communication', icon: MessageSquare, desc: 'Clarity on scope, costs, and timeline' },
  { key: 'overall_experience', label: 'Overall Experience', icon: ThumbsUp, desc: 'Satisfaction with cooperative service' },
];

export default function ReviewModal({
  isOpen,
  onClose,
  booking,
  customerId = 'usr-cust-demo',
  customerName = 'Ananya Sharma',
  customerAvatar = '',
  existingReview = null,
  onSuccess
}) {
  const isEditing = Boolean(existingReview);
  
  const [overallRating, setOverallRating] = useState(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState(
    existingReview?.category_ratings || {
      service_quality: 5,
      professionalism: 5,
      punctuality: 5,
      communication: 5,
      overall_experience: 5
    }
  );
  const [reviewText, setReviewText] = useState(existingReview?.review_text || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen || !booking) return null;

  const handleCategoryChange = (key, val) => {
    setCategoryRatings(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (reviewText.trim().length < 10) {
      setError('Please provide at least 10 characters of detailed feedback.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await reviewService.editReview({
          reviewId: existingReview.id,
          customerId,
          rating: overallRating,
          categoryRatings,
          reviewText
        });
        setSuccessMsg('Your review has been successfully updated.');
      } else {
        await reviewService.submitReview({
          bookingId: booking.id,
          customerId,
          customerName,
          customerAvatar,
          workerId: booking.worker_id || booking.workerId || booking.preferred_worker_id,
          workerName: booking.worker_name || booking.workerName || 'Cooperative Artisan',
          workerTrade: booking.worker_trade || booking.taskTitle || 'Master Craftsman',
          rating: overallRating,
          categoryRatings,
          reviewText
        });
        setSuccessMsg('Thank you! Your feedback has been verified and published.');
      }

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1400);
    } catch (err) {
      setError(err.message || 'Failed to submit review. Please try again.');
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
          transition={{ duration: 0.2 }}
          className="bg-brand-surface border border-brand-border rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-brand-border/60 bg-white/70 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Completed Dispatch #{booking.id.slice(-6).toUpperCase()}
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-brand-primary">
                {isEditing ? 'Edit Your Service Review' : 'Rate & Review Your Cooperative Artisan'}
              </h2>
              <p className="text-xs text-brand-secondary mt-0.5">
                Artisan:{' '}
                <strong className="text-brand-primary">
                  {booking.worker_name || booking.workerName || 'Assigned Artisan'}
                </strong>{' '}
                • {booking.taskTitle || booking.service_name || 'Home Service'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-brand-border text-brand-secondary hover:text-brand-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs flex-1">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Overall Star Rating */}
            <div className="p-4 rounded-2xl bg-white border border-brand-border space-y-2 text-center">
              <label className="block font-bold text-brand-primary text-sm">
                Overall Craft & Service Satisfaction
              </label>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || overallRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setOverallRating(star)}
                      className="p-1 focus:outline-hidden transform transition-transform hover:scale-115 active:scale-95"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          active
                            ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                            : 'text-zinc-300 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] font-semibold text-brand-teal">
                {overallRating === 5 && 'Outstanding cooperative craftsmanship'}
                {overallRating === 4 && 'Good quality service with minor suggestions'}
                {overallRating === 3 && 'Average service; room for improvement'}
                {overallRating === 2 && 'Below expectation; had noticeable issues'}
                {overallRating === 1 && 'Unacceptable service standard'}
              </p>
            </div>

            {/* Detailed Category Ratings */}
            <div className="space-y-3">
              <h3 className="font-bold text-brand-primary uppercase tracking-wider text-[11px] flex items-center justify-between">
                <span>Category Evaluation (1 to 5 Stars)</span>
                <span className="text-[10px] text-brand-secondary font-normal lowercase">optional details</span>
              </h3>

              <div className="space-y-2">
                {CATEGORIES.map(({ key, label, icon: Icon, desc }) => (
                  <div
                    key={key}
                    className="p-3 rounded-2xl bg-brand-surface/70 border border-brand-border flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white border border-brand-border flex items-center justify-center text-brand-teal">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-brand-primary block">{label}</span>
                        <span className="text-[10px] text-brand-secondary block">{desc}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleCategoryChange(key, star)}
                          className="p-0.5 focus:outline-hidden hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              categoryRatings[key] >= star
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-zinc-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Written Feedback Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-brand-primary">
                  Detailed Experience & Observations <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-brand-secondary">
                  {reviewText.length} / 1,000 characters
                </span>
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                maxLength={1000}
                rows={4}
                required
                placeholder="Share your genuine experience with this artisan: technical competency, site cleanliness, adherence to safety, and honest cooperative value..."
                className="w-full p-3.5 rounded-2xl bg-white border border-brand-border focus:border-brand-teal focus:ring-1 focus:ring-brand-teal text-brand-primary placeholder:text-brand-secondary/60 resize-none text-xs leading-relaxed"
              />
              <p className="text-[10px] text-brand-secondary flex items-center gap-1">
                <Info className="w-3 h-3 text-brand-teal" />
                Honest positive or critical reviews are welcomed. Never post private phone numbers or personal insults.
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-brand-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-brand-border bg-white text-brand-secondary hover:text-brand-primary font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-[#182020] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-xs"
              >
                {isSubmitting ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{isEditing ? 'Save Changes' : 'Submit Review'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
