/**
 * SahkarSathi Public Worker Profile Modal
 * Displays accredited craftsman qualifications, reviews, coverage areas, and booking CTA
 * Strict Privacy: Personal identity, banking, and private contact are strictly concealed
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  CheckCircle2,
  Clock,
  Bookmark,
  BookmarkCheck,
  X,
  ArrowRight,
  Info
} from 'lucide-react';
import Badge from '../common/Badge';
import { discoveryService } from '../../services/discoveryService';
import { reviewService } from '../../services/reviewService';
import RatingDistribution from '../reviews/RatingDistribution';

export default function WorkerProfileModal({
  worker,
  isOpen,
  onClose,
  customerId,
  onWorkerSavedChanged,
}) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [realReviews, setRealReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);

  useEffect(() => {
    if (worker?.id) {
      discoveryService.isWorkerSaved(customerId, worker.id).then(setIsSaved);
      reviewService.getWorkerReviews(worker.id).then(setRealReviews);
      reviewService.getWorkerRatingSummary(worker.id).then(setRatingSummary);
    }
  }, [worker, customerId]);

  if (!isOpen || !worker) return null;

  const handleToggleSave = async () => {
    const newState = await discoveryService.toggleSaveWorker(customerId, worker.id);
    setIsSaved(newState);
    if (onWorkerSavedChanged) onWorkerSavedChanged(worker.id, newState);
  };

  const handleProceedBooking = () => {
    onClose();
    // Navigate to customer booking flow with pre-selected worker
    const serviceParam = worker.trade.toLowerCase().includes('electr')
      ? 'electrical'
      : worker.trade.toLowerCase().includes('plumb')
      ? 'plumbing'
      : worker.trade.toLowerCase().includes('carp')
      ? 'carpentry'
      : worker.trade.toLowerCase().includes('paint')
      ? 'painting'
      : 'cleaning';

    navigate(`/customer/book?service=${serviceParam}&worker=${worker.id}`);
  };

  const isVerified = worker.verificationStatus === 'verified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white rounded-3xl border border-brand-border shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="p-6 bg-brand-surface/80 border-b border-brand-border flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-emerald/30 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-brand-teal bg-white px-2 py-0.5 rounded border border-brand-border">
                  {worker.workerCode || worker.id}
                </span>
                {isVerified && (
                  <Badge variant="emerald" size="sm">
                    Verified Craftsman
                  </Badge>
                )}
                <span className="text-xs text-brand-secondary font-mono">
                  {worker.cooperativeUnit}
                </span>
              </div>

              <h2 className="font-display font-bold text-xl sm:text-2xl text-brand-primary">
                {worker.name}
              </h2>
              <p className="text-xs font-semibold text-brand-teal mt-0.5">
                {worker.trade} • {worker.experienceYears} Years Cooperative Experience
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSave}
              className={`p-2.5 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-white border-brand-border text-brand-secondary hover:text-brand-primary'
              }`}
              title={isSaved ? 'Saved to Favorites' : 'Save Worker'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 fill-emerald-600 text-emerald-600" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white border border-brand-border text-brand-secondary hover:text-brand-primary hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-brand-surface/60 border border-brand-border">
              <span className="text-[10px] text-brand-secondary uppercase tracking-wider block font-semibold">
                Client Rating
              </span>
              <span className="font-display font-bold text-base text-amber-700 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>
                  {ratingSummary?.hasReviews
                    ? `${ratingSummary.averageRating} (${ratingSummary.reviewsCount})`
                    : 'No reviews yet'}
                </span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-brand-surface/60 border border-brand-border">
              <span className="text-[10px] text-brand-secondary uppercase tracking-wider block font-semibold">
                Completed Dispatches
              </span>
              <span className="font-display font-bold text-base text-emerald-800 mt-0.5 block">
                {worker.completedJobs} Jobs
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-brand-surface/60 border border-brand-border">
              <span className="text-[10px] text-brand-secondary uppercase tracking-wider block font-semibold">
                Starting Rate
              </span>
              <span className="font-display font-bold text-base text-brand-primary mt-0.5 block font-mono">
                ₹{worker.estimatedBasePrice}
              </span>
            </div>
          </div>

          {/* Bio & Trade Qualifications */}
          <div className="space-y-2">
            <h4 className="font-bold text-brand-primary uppercase tracking-wider text-[11px]">
              Craftsman Profile & Qualifications
            </h4>
            <p className="text-brand-secondary leading-relaxed bg-brand-surface/40 p-3.5 rounded-2xl border border-brand-border/60">
              {worker.bio || 'Accredited trade craftsman with verified on-site experience.'}
            </p>
          </div>

          {/* Certified Skills */}
          <div className="space-y-2">
            <h4 className="font-bold text-brand-primary uppercase tracking-wider text-[11px]">
              Certified Technical Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {worker.skills?.map((sk, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-white border border-brand-border font-medium text-brand-primary flex items-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Service Area Coverage */}
          <div className="space-y-2">
            <h4 className="font-bold text-brand-primary uppercase tracking-wider text-[11px]">
              Service Area Coverage
            </h4>
            <div className="flex items-center gap-2 text-brand-secondary">
              <MapPin className="w-4 h-4 text-brand-emerald flex-shrink-0" />
              <span>
                Based in <strong>{worker.city} ({worker.area})</strong>. Servicing{' '}
                {worker.coverageAreas?.join(', ') || worker.area}.
              </span>
            </div>
          </div>

          {/* Client Reviews & Rating Distribution */}
          <div className="space-y-4">
            <RatingDistribution ratingSummary={ratingSummary} />

            <h4 className="font-bold text-brand-primary uppercase tracking-wider text-[11px] pt-2">
              Verified Client Reviews ({realReviews?.length || 0})
            </h4>

            {realReviews && realReviews.length > 0 ? (
              <div className="space-y-2.5">
                {realReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-2xl bg-brand-surface/40 border border-brand-border/60 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-primary">{rev.customer_name || rev.customerName}</span>
                      <span className="font-mono text-[10px] text-brand-secondary">
                        {new Date(rev.created_at || rev.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-brand-secondary leading-relaxed pt-1">{rev.review_text || rev.comment}</p>
                    {rev.response && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white border border-brand-border/70 text-[11px] text-brand-teal">
                        <strong>Artisan Response:</strong> {rev.response.response_text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-brand-secondary italic">
                Newly verified cooperative artisan. Zero customer disputes.
              </p>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2 text-emerald-900 text-[11px]">
            <Info className="w-4 h-4 text-brand-emerald flex-shrink-0 mt-0.5" />
            <span>
              Direct contact details and payment QR codes are shared securely upon confirmed booking dispatch.
            </span>
          </div>
        </div>

        {/* Modal Footer / CTA */}
        <div className="p-4 sm:p-6 bg-brand-surface border-t border-brand-border flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
              Cooperative Labor Guarantee
            </span>
            <span className="font-mono font-bold text-sm text-brand-primary">
              Starts at ₹{worker.estimatedBasePrice} (0% Middleman Surge)
            </span>
          </div>

          <button
            type="button"
            onClick={handleProceedBooking}
            className="px-6 py-3 rounded-2xl bg-brand-emerald hover:bg-brand-emeraldDark text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>Book This Artisan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
