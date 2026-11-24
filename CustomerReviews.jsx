import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import ReviewCard from '../../components/reviews/ReviewCard';
import ReviewModal from '../../components/reviews/ReviewModal';
import ReportReviewModal from '../../components/reviews/ReportReviewModal';
import { reviewService } from '../../services/reviewService';
import { bookingService } from '../../services/bookingService';

export default function CustomerReviews() {
  const currentCustomerId = 'usr-cust-demo';
  const customerName = 'Ananya Sharma';

  const [reviews, setReviews] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReviewForReport, setSelectedReviewForReport] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [revs, bookings] = await Promise.all([
        reviewService.getCustomerReviews(currentCustomerId),
        bookingService.getBookings({ role: 'customer', userId: currentCustomerId })
      ]);
      setReviews(revs || []);

      // Filter bookings that are completed
      const comps = (bookings || []).filter(b => (b.status || '').toLowerCase() === 'completed');
      setCompletedBookings(comps);
    } catch (err) {
      console.warn('Failed to load customer reviews/bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleOpenReviewModal = (booking) => {
    setSelectedBookingForReview(booking);
    setEditingReview(null);
    setReviewModalOpen(true);
  };

  const handleOpenEditModal = (review) => {
    setEditingReview(review);
    setSelectedBookingForReview({
      id: review.booking_id,
      worker_id: review.worker_id,
      worker_name: review.worker_name,
      taskTitle: review.worker_trade
    });
    setReviewModalOpen(true);
  };

  const handleOpenReportModal = (review) => {
    setSelectedReviewForReport(review);
    setReportModalOpen(true);
  };

  // Find bookings eligible for a new review (completed and not yet reviewed)
  const pendingReviewBookings = completedBookings.filter(b => {
    return !reviews.some(r => r.booking_id === b.id || r.bookingId === b.id);
  });

  return (
    <CustomerLayout title="My Service Reviews">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-surface border border-brand-border text-brand-secondary text-xs font-semibold mb-2">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              Verified Cooperative Experience
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              My Service Reviews & Feedback
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary mt-1 max-w-xl leading-relaxed">
              Every completed dispatch on SahkarSathi is backed by transparent customer ratings. View your feedback, read worker responses, and review completed jobs.
            </p>
          </div>

          <Link
            to="/review-guidelines"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-brand-border text-xs font-bold text-brand-teal hover:text-brand-primary transition-colors shadow-2xs self-start"
          >
            <HelpCircle className="w-4 h-4 text-brand-teal" />
            <span>Review Guidelines & Policies</span>
          </Link>
        </div>

        {/* Section: Pending Dispatches Awaiting Feedback */}
        {pendingReviewBookings.length > 0 && (
          <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/60 border border-amber-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-900">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm sm:text-base">
                  Completed Services Awaiting Your Review ({pendingReviewBookings.length})
                </h3>
              </div>
              <span className="text-[11px] text-amber-800 font-medium">
                Helps other households find trustworthy artisans
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {pendingReviewBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-white border border-amber-200/60 shadow-xs flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-primary">
                        {b.taskTitle || b.service_name || 'Home Service'}
                      </span>
                      <span className="font-mono text-[10px] text-brand-secondary">
                        #{b.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-secondary mt-0.5">
                      Artisan:{' '}
                      <strong className="text-brand-primary">
                        {b.worker_name || b.workerName || 'Assigned Artisan'}
                      </strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenReviewModal(b)}
                    className="px-3.5 py-2 rounded-xl bg-brand-primary text-white font-bold hover:bg-[#182020] transition-colors flex items-center gap-1.5 flex-shrink-0 shadow-2xs"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>Leave Review</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Submitted Reviews */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg sm:text-xl text-brand-primary flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-teal" />
              <span>Reviews Submitted By You ({reviews.length})</span>
            </h2>
            <span className="text-xs text-brand-secondary font-medium">
              100% Genuine completed records
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-brand-secondary">
              Loading your verified reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-brand-border text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-brand-border mx-auto flex items-center justify-center text-amber-500">
                <Star className="w-6 h-6 text-zinc-300" />
              </div>
              <h3 className="font-bold text-base text-brand-primary">No Reviews Submitted Yet</h3>
              <p className="text-xs text-brand-secondary max-w-sm mx-auto leading-relaxed">
                When an artisan completes your booking, you can submit star ratings and category feedback directly from this page or your booking records.
              </p>
              <div className="pt-2">
                <Link
                  to="/customer/bookings/history"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-[#182020] transition-colors"
                >
                  <span>View Completed Bookings</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <ReviewCard
                  key={rev.id}
                  review={rev}
                  currentUserId={currentCustomerId}
                  userRole="customer"
                  onEdit={handleOpenEditModal}
                  onReport={handleOpenReportModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        booking={selectedBookingForReview}
        customerId={currentCustomerId}
        customerName={customerName}
        existingReview={editingReview}
        onSuccess={loadData}
      />

      {/* Report Modal */}
      <ReportReviewModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        review={selectedReviewForReport}
        reporterId={currentCustomerId}
      />
    </CustomerLayout>
  );
}
