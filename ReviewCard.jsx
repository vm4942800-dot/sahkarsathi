import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ShieldCheck, 
  CornerDownRight, 
  MessageSquare, 
  Flag, 
  Edit3, 
  Clock, 
  Send, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle
} from 'lucide-react';

export default function ReviewCard({
  review,
  currentUserId,
  userRole = 'customer',
  onEdit,
  onReport,
  onRespond,
  showBookingLink = true
}) {
  const [showCategories, setShowCategories] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [responseError, setResponseError] = useState(null);

  const isCustomerOwner = currentUserId === review.customer_id || currentUserId === review.customerId;
  const isWorkerTarget = currentUserId === review.worker_id || currentUserId === review.workerId;
  const canRespond = userRole === 'worker' && isWorkerTarget && !review.response;
  const isHidden = review.status === 'hidden';

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!responseText.trim() || !onRespond) return;

    setResponseError(null);
    setIsSubmittingResponse(true);
    try {
      await onRespond(review.id, responseText);
      setIsResponding(false);
      setResponseText('');
    } catch (err) {
      setResponseError(err.message || 'Failed to submit response.');
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  return (
    <div
      className={`p-5 rounded-3xl border transition-all ${
        isHidden
          ? 'bg-amber-50/60 border-amber-200/80 opacity-80'
          : 'bg-white border-brand-border/80 shadow-xs hover:border-brand-teal/40'
      }`}
    >
      {/* Moderation Banner if Hidden */}
      {isHidden && (
        <div className="mb-3 p-2.5 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
          <span>
            <strong>Content Moderated:</strong> This review is temporarily hidden from public pages pending review moderation.
          </span>
        </div>
      )}

      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center font-bold text-brand-teal text-sm overflow-hidden flex-shrink-0">
            {review.customer_avatar ? (
              <img
                src={review.customer_avatar}
                alt={review.customer_name}
                className="w-full h-full object-cover"
              />
            ) : (
              (review.customer_name || 'Customer').slice(0, 2).toUpperCase()
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-brand-primary text-sm">
                {review.customer_name || 'Verified Customer'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Service
              </span>
              {review.is_edited && (
                <span className="text-[10px] text-brand-secondary italic">
                  (edited)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-brand-secondary mt-0.5">
              <span>Artisan: <strong className="text-brand-primary">{review.worker_name || 'Cooperative Artisan'}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-brand-secondary/70" />
                {new Date(review.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Rating and Actions */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1 text-amber-500 bg-amber-50/70 border border-amber-200/60 px-2.5 py-1 rounded-xl">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="font-bold text-xs text-amber-900">{review.rating}.0</span>
          </div>

          <div className="flex items-center gap-1">
            {isCustomerOwner && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(review)}
                className="p-1 text-brand-secondary hover:text-brand-primary transition-colors"
                title="Edit Review"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}

            {onReport && (
              <button
                type="button"
                onClick={() => onReport(review)}
                className="p-1 text-brand-secondary hover:text-rose-600 transition-colors"
                title="Report Violation"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review Text */}
      <div className="mt-3.5 text-xs text-brand-primary leading-relaxed pl-1">
        <p>{review.review_text}</p>
      </div>

      {/* Category Breakdown Toggle */}
      {review.category_ratings && Object.keys(review.category_ratings).length > 0 && (
        <div className="mt-3 pt-2 border-t border-brand-border/60">
          <button
            type="button"
            onClick={() => setShowCategories(!showCategories)}
            className="flex items-center gap-1.5 text-[11px] text-brand-secondary font-semibold hover:text-brand-primary transition-colors"
          >
            <span>{showCategories ? 'Hide category breakdown' : 'View detailed category scores'}</span>
            {showCategories ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <AnimatePresence>
            {showCategories && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2.5 overflow-hidden"
              >
                {Object.entries(review.category_ratings).map(([catKey, val]) => (
                  <div
                    key={catKey}
                    className="p-2 rounded-xl bg-brand-surface/70 border border-brand-border/70 flex items-center justify-between"
                  >
                    <span className="capitalize text-[10px] text-brand-secondary">
                      {catKey.replace(/_/g, ' ')}
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold text-[10px]">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {val}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Worker Response Section */}
      {review.response ? (
        <div className="mt-4 p-3.5 rounded-2xl bg-brand-surface/60 border border-brand-border/80 ml-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-brand-teal">
              <CornerDownRight className="w-3.5 h-3.5 text-brand-teal" />
              <span>Response from Artisan ({review.worker_name || 'Artisan'})</span>
            </div>
            <span className="text-[10px] text-brand-secondary">
              {new Date(review.response.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
          <p className="text-xs text-brand-primary pl-5 leading-relaxed">
            {review.response.response_text}
          </p>
        </div>
      ) : canRespond ? (
        <div className="mt-4 ml-4">
          {!isResponding ? (
            <button
              type="button"
              onClick={() => setIsResponding(true)}
              className="inline-flex items-center gap-1.5 text-xs text-brand-teal font-bold hover:text-brand-primary transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Respond to this Customer Review</span>
            </button>
          ) : (
            <form onSubmit={handleResponseSubmit} className="p-3.5 rounded-2xl bg-brand-surface border border-brand-border space-y-2.5">
              {responseError && (
                <p className="text-[11px] text-rose-600">{responseError}</p>
              )}
              <textarea
                rows={2}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                maxLength={600}
                required
                placeholder="Write a courteous, professional response thanking the customer or clarifying craft measures..."
                className="w-full p-2.5 rounded-xl bg-white border border-brand-border text-brand-primary text-xs resize-none focus:border-brand-teal"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-brand-secondary">
                  {responseText.length} / 600 characters
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsResponding(false);
                      setResponseText('');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-brand-border bg-white text-xs text-brand-secondary hover:text-brand-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingResponse}
                    className="px-3.5 py-1.5 rounded-lg bg-brand-teal text-white text-xs font-bold hover:bg-brand-primary flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    <span>{isSubmittingResponse ? 'Posting...' : 'Post Response'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
}
