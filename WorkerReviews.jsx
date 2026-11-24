import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Clock,
  ThumbsUp
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import ReviewCard from '../../components/reviews/ReviewCard';
import RatingDistribution from '../../components/reviews/RatingDistribution';
import ReportReviewModal from '../../components/reviews/ReportReviewModal';
import { reviewService } from '../../services/reviewService';

export default function WorkerReviews() {
  const currentWorkerId = 'wrk-001'; // Master Electrician Rajesh Sharma
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Report Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReviewForReport, setSelectedReviewForReport] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [revs, summary] = await Promise.all([
        reviewService.getWorkerReviews(currentWorkerId),
        reviewService.getWorkerRatingSummary(currentWorkerId)
      ]);
      setReviews(revs || []);
      setRatingSummary(summary);
    } catch (err) {
      console.warn('Failed to load worker reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRespond = async (reviewId, responseText) => {
    await reviewService.submitWorkerResponse({
      reviewId,
      workerId: currentWorkerId,
      responseText
    });
    await loadData();
  };

  const handleOpenReportModal = (review) => {
    setSelectedReviewForReport(review);
    setReportModalOpen(true);
  };

  return (
    <WorkerLayout title="Client Reviews">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-surface border border-brand-border text-brand-secondary text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Verified Cooperative Artisan Quality
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Client Feedback & Star Ratings
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary mt-1 max-w-xl leading-relaxed">
              Transparent client evaluations from completed home service dispatches. You can respond professionally to client feedback to build community trust.
            </p>
          </div>

          <Link
            to="/review-guidelines"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-brand-border text-xs font-bold text-brand-teal hover:text-brand-primary transition-colors shadow-2xs self-start"
          >
            <HelpCircle className="w-4 h-4 text-brand-teal" />
            <span>Community Guidelines</span>
          </Link>
        </div>

        {/* Rating Metrics & Distribution Strip */}
        <RatingDistribution ratingSummary={ratingSummary} />

        {/* Reviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg sm:text-xl text-brand-primary flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-teal" />
              <span>Customer Reviews Received ({reviews.length})</span>
            </h2>
            <span className="text-xs text-brand-secondary font-medium">
              Verified dispatches only
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-brand-secondary">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-brand-border text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-brand-border mx-auto flex items-center justify-center text-amber-500">
                <Star className="w-6 h-6 text-zinc-300" />
              </div>
              <h3 className="font-bold text-base text-brand-primary">No Customer Reviews Yet</h3>
              <p className="text-xs text-brand-secondary max-w-sm mx-auto leading-relaxed">
                As you complete active cooperative dispatches and clients sign off, verified reviews and category ratings will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <ReviewCard
                  key={rev.id}
                  review={rev}
                  currentUserId={currentWorkerId}
                  userRole="worker"
                  onRespond={handleRespond}
                  onReport={handleOpenReportModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <ReportReviewModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        review={selectedReviewForReport}
        reporterId={currentWorkerId}
      />
    </WorkerLayout>
  );
}
