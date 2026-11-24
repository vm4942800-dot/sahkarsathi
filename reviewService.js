/**
 * Reviews, Ratings, and Customer Feedback Service for SahkarSathi
 * Connects to Supabase Database (public.reviews, public.review_responses, public.review_reports)
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { bookingService } from './bookingService';
import { notificationService } from './notificationService';
import { adminService } from './adminService';

// Initial verified reviews seed (strictly connected to completed bookings)
const INITIAL_REVIEWS = [
  {
    id: 'rev-001',
    booking_id: 'bk-comp-01',
    customer_id: 'usr-cust-demo',
    customer_name: 'Ananya Sharma',
    customer_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    worker_id: 'wrk-001',
    worker_name: 'Rajesh Sharma',
    worker_trade: 'Master Electrician',
    rating: 5,
    category_ratings: {
      service_quality: 5,
      professionalism: 5,
      punctuality: 5,
      communication: 5,
      overall_experience: 5
    },
    review_text: 'Flawless MCB distribution overhaul. Arrived punctually with calibrated multimeter, resolved high-voltage grounding hazard cleanly, and documented all circuits before departure.',
    status: 'published',
    is_edited: false,
    edit_history: [],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    response: {
      id: 'resp-001',
      review_id: 'rev-001',
      worker_id: 'wrk-001',
      response_text: 'Thank you Ananya ji. Proper grounding is critical for home safety. Proud to deliver cooperative standard craftsmanship.',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'rev-002',
    booking_id: 'bk-comp-02',
    customer_id: 'usr-cust-demo',
    customer_name: 'Ananya Sharma',
    customer_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    worker_id: 'wrk-002',
    worker_name: 'Vikram Singh',
    worker_trade: 'Certified Master Plumber',
    rating: 5,
    category_ratings: {
      service_quality: 5,
      professionalism: 5,
      punctuality: 4,
      communication: 5,
      overall_experience: 5
    },
    review_text: 'Hydrostatic pressure testing pinpointed the hidden riser joint leak within 20 minutes without tearing up the bathroom tiles. Outstanding cooperative work.',
    status: 'published',
    is_edited: false,
    edit_history: [],
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    response: {
      id: 'resp-002',
      review_id: 'rev-002',
      worker_id: 'wrk-002',
      response_text: 'Much appreciated! Acoustic leak detection saves both cost and customer property. At your service anytime.',
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'rev-003',
    booking_id: 'bk-comp-03',
    customer_id: 'usr-cust-02',
    customer_name: 'Deepak Verma',
    customer_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    worker_id: 'wrk-003',
    worker_name: 'Sunil Verma',
    worker_trade: 'Senior Joiner & Finish Carpenter',
    rating: 4,
    category_ratings: {
      service_quality: 5,
      professionalism: 4,
      punctuality: 4,
      communication: 4,
      overall_experience: 4
    },
    review_text: 'Teak wardrobe doors fitted smoothly with soft-close hinges. Took slightly longer due to custom bevel alignment, but the craft precision was worth it.',
    status: 'published',
    is_edited: false,
    edit_history: [],
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    response: null
  }
];

const LOCAL_STORAGE_REVIEWS = 'sahkarsathi_reviews_v1';
const LOCAL_STORAGE_REPORTS = 'sahkarsathi_review_reports_v1';

class ReviewService {
  constructor() {
    this._initStorage();
  }

  _initStorage() {
    if (typeof window === 'undefined') return;
    try {
      if (!localStorage.getItem(LOCAL_STORAGE_REVIEWS)) {
        localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      }
      if (!localStorage.getItem(LOCAL_STORAGE_REPORTS)) {
        localStorage.setItem(LOCAL_STORAGE_REPORTS, JSON.stringify([]));
      }
    } catch (e) {
      console.warn('Storage unavailable:', e);
    }
  }

  _getStoredReviews() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_REVIEWS);
      return data ? JSON.parse(data) : [...INITIAL_REVIEWS];
    } catch {
      return [...INITIAL_REVIEWS];
    }
  }

  _saveStoredReviews(reviews) {
    try {
      localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to persist reviews:', e);
    }
  }

  _getStoredReports() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_REPORTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  _saveStoredReports(reports) {
    try {
      localStorage.setItem(LOCAL_STORAGE_REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.warn('Failed to persist reports:', e);
    }
  }

  /**
   * Check if a customer is strictly eligible to review a worker for a specific booking.
   * Eligibility Rules:
   * 1. Booking must exist and have status 'completed'.
   * 2. Customer must own the booking.
   * 3. Worker must be the assigned/completed worker on that booking.
   * 4. Customer cannot review themselves.
   * 5. Customer cannot submit duplicate reviews for the same booking + worker.
   */
  async checkEligibility({ bookingId, customerId, workerId }) {
    if (!bookingId || !customerId) {
      return { eligible: false, reason: 'Missing booking or customer identification.' };
    }

    if (customerId === workerId) {
      return { eligible: false, reason: 'Self-reviews are strictly forbidden by platform integrity rules.' };
    }

    // 1. Fetch booking record
    let booking = null;
    try {
      booking = await bookingService.getBookingById(bookingId);
    } catch {
      // ignore
    }

    if (!booking) {
      // Check in fallback mock completed bookings
      const fallbackBookings = [
        { id: 'bk-comp-01', customer_id: 'usr-cust-demo', worker_id: 'wrk-001', status: 'completed', worker_name: 'Rajesh Sharma' },
        { id: 'bk-comp-02', customer_id: 'usr-cust-demo', worker_id: 'wrk-002', status: 'completed', worker_name: 'Vikram Singh' },
        { id: 'bk-comp-03', customer_id: 'usr-cust-02', worker_id: 'wrk-003', status: 'completed', worker_name: 'Sunil Verma' },
        { id: 'bk-active-01', customer_id: 'usr-cust-demo', worker_id: 'wrk-001', status: 'in_progress', worker_name: 'Rajesh Sharma' },
      ];
      booking = fallbackBookings.find(b => b.id === bookingId);
    }

    if (!booking) {
      return { eligible: false, reason: 'Booking record not found in system.' };
    }

    // Check completion status
    const bStatus = (booking.status || '').toLowerCase();
    if (bStatus !== 'completed') {
      return { 
        eligible: false, 
        reason: `Service is currently '${bStatus}'. Reviews can only be submitted after verified service completion.` 
      };
    }

    // Check customer ownership
    const bookingCustomerId = booking.customer_id || booking.customerId;
    if (bookingCustomerId && bookingCustomerId !== customerId) {
      return { eligible: false, reason: 'You can only review bookings made under your own account.' };
    }

    // Check target worker
    const assignedWorkerId = booking.worker_id || booking.workerId || booking.preferred_worker_id;
    const targetWorkerId = workerId || assignedWorkerId;
    if (assignedWorkerId && targetWorkerId && assignedWorkerId !== targetWorkerId) {
      return { eligible: false, reason: 'You can only review the cooperative artisan who completed this job.' };
    }

    // Check if review already exists
    const existingReviews = await this.getReviewsForBooking(bookingId);
    const alreadyReviewed = existingReviews.some(
      r => (r.customer_id === customerId || r.customerId === customerId) && 
           (r.worker_id === targetWorkerId || r.workerId === targetWorkerId)
    );

    if (alreadyReviewed) {
      return { 
        eligible: false, 
        reason: 'You have already submitted a review for this completed dispatch. You may view or update it under My Reviews.' 
      };
    }

    return { 
      eligible: true, 
      booking, 
      workerId: targetWorkerId,
      workerName: booking.worker_name || booking.workerName || 'Assigned Artisan'
    };
  }

  /**
   * Submit a new review
   */
  async submitReview({
    bookingId,
    customerId,
    customerName,
    customerAvatar,
    workerId,
    workerName,
    workerTrade,
    rating,
    categoryRatings = {},
    reviewText
  }) {
    // 1. Strict Eligibility Check
    const eligibility = await this.checkEligibility({ bookingId, customerId, workerId });
    if (!eligibility.eligible) {
      throw new Error(eligibility.reason);
    }

    // 2. Rating & Input Validation
    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      throw new Error('Overall rating must be between 1 and 5 stars.');
    }

    const cleanText = (reviewText || '').trim();
    if (cleanText.length < 10) {
      throw new Error('Review feedback must contain at least 10 characters.');
    }
    if (cleanText.length > 1000) {
      throw new Error('Review text exceeds 1,000 character maximum limit.');
    }

    const cleanCategoryRatings = {
      service_quality: Math.min(5, Math.max(1, parseInt(categoryRatings.service_quality || parsedRating, 10))),
      professionalism: Math.min(5, Math.max(1, parseInt(categoryRatings.professionalism || parsedRating, 10))),
      punctuality: Math.min(5, Math.max(1, parseInt(categoryRatings.punctuality || parsedRating, 10))),
      communication: Math.min(5, Math.max(1, parseInt(categoryRatings.communication || parsedRating, 10))),
      overall_experience: Math.min(5, Math.max(1, parseInt(categoryRatings.overall_experience || parsedRating, 10)))
    };

    const newReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      booking_id: bookingId,
      customer_id: customerId,
      customer_name: customerName || 'Verified Customer',
      customer_avatar: customerAvatar || '',
      worker_id: workerId || eligibility.workerId,
      worker_name: workerName || eligibility.workerName,
      worker_trade: workerTrade || 'Cooperative Artisan',
      rating: parsedRating,
      category_ratings: cleanCategoryRatings,
      review_text: cleanText,
      status: 'published',
      is_edited: false,
      edit_history: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      response: null
    };

    // Database push if Supabase is active
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .insert({
            booking_id: newReview.booking_id,
            customer_id: newReview.customer_id,
            worker_id: newReview.worker_id,
            rating: newReview.rating,
            category_ratings: newReview.category_ratings,
            review_text: newReview.review_text,
            status: 'published'
          })
          .select()
          .single();

        if (error) {
          console.warn('Supabase review insert failed, using local storage fallback:', error.message);
        } else if (data) {
          newReview.id = data.id;
        }
      } catch (e) {
        console.warn('Supabase review error:', e);
      }
    }

    // Local Storage persistence
    const reviews = this._getStoredReviews();
    reviews.unshift(newReview);
    this._saveStoredReviews(reviews);

    // Send Realtime Notification to Worker
    try {
      await notificationService.notifyUser({
        userId: newReview.worker_id,
        role: 'worker',
        title: 'New Customer Review Received',
        description: `${newReview.customer_name} awarded you ${newReview.rating} stars for booking #${bookingId.slice(-6).toUpperCase()}.`,
        notificationType: 'system_alert',
        relatedId: newReview.id,
        actionUrl: '/worker/profile'
      });
    } catch (e) {
      console.warn('Failed to notify worker of review:', e);
    }

    // Audit log
    try {
      await adminService.logAuditAction({
        action: 'review_submitted',
        performedBy: customerId,
        userRole: 'customer',
        targetId: newReview.id,
        reasonOrNote: `Submitted ${newReview.rating}-star review for worker ${newReview.worker_id}`,
        metadata: { bookingId, rating: newReview.rating }
      });
    } catch (e) {
      console.warn('Audit log review error:', e);
    }

    return newReview;
  }

  /**
   * Edit an existing review (within allowable time window or by author)
   */
  async editReview({ reviewId, customerId, rating, categoryRatings, reviewText }) {
    const reviews = this._getStoredReviews();
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) {
      throw new Error('Review record not found.');
    }

    const review = reviews[reviewIndex];
    if (review.customer_id !== customerId && review.customerId !== customerId) {
      throw new Error('Unauthorized. You can only edit your own reviews.');
    }

    // Input validation
    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      throw new Error('Overall rating must be between 1 and 5 stars.');
    }

    const cleanText = (reviewText || '').trim();
    if (cleanText.length < 10) {
      throw new Error('Review feedback must contain at least 10 characters.');
    }

    // Archive previous version to edit_history
    const historyEntry = {
      previous_rating: review.rating,
      previous_text: review.review_text,
      edited_at: new Date().toISOString()
    };

    review.rating = parsedRating;
    if (categoryRatings) review.category_ratings = categoryRatings;
    review.review_text = cleanText;
    review.is_edited = true;
    review.edit_history = [...(review.edit_history || []), historyEntry];
    review.updated_at = new Date().toISOString();

    reviews[reviewIndex] = review;
    this._saveStoredReviews(reviews);

    // Notify worker of review update
    try {
      await notificationService.notifyUser({
        userId: review.worker_id,
        role: 'worker',
        title: 'Review Updated by Customer',
        description: `Feedback on booking #${(review.booking_id || '').slice(-6).toUpperCase()} was edited. Current rating: ${parsedRating} stars.`,
        notificationType: 'system_alert',
        relatedId: review.id,
        actionUrl: '/worker/profile'
      });
    } catch (e) {
      console.warn('Notification error:', e);
    }

    return review;
  }

  /**
   * Worker responds to a review
   */
  async submitWorkerResponse({ reviewId, workerId, responseText }) {
    const cleanText = (responseText || '').trim();
    if (cleanText.length < 5) {
      throw new Error('Response must contain at least 5 characters.');
    }
    if (cleanText.length > 600) {
      throw new Error('Response exceeds 600 character limit.');
    }

    const reviews = this._getStoredReviews();
    const review = reviews.find(r => r.id === reviewId);
    if (!review) {
      throw new Error('Original review could not be located.');
    }

    if (review.worker_id !== workerId && review.workerId !== workerId) {
      throw new Error('Unauthorized. You can only respond to reviews left for your own service.');
    }

    const responseObj = {
      id: `resp-${Date.now()}`,
      review_id: reviewId,
      worker_id: workerId,
      response_text: cleanText,
      created_at: new Date().toISOString()
    };

    review.response = responseObj;
    review.updated_at = new Date().toISOString();
    this._saveStoredReviews(reviews);

    // Notify Customer of response
    try {
      await notificationService.notifyUser({
        userId: review.customer_id,
        role: 'customer',
        title: 'Artisan Responded to Your Review',
        description: `${review.worker_name || 'Your artisan'} replied: "${cleanText.slice(0, 80)}${cleanText.length > 80 ? '...' : ''}"`,
        notificationType: 'system_alert',
        relatedId: review.id,
        actionUrl: '/customer/reviews'
      });
    } catch (e) {
      console.warn('Failed to notify customer of artisan response:', e);
    }

    return responseObj;
  }

  /**
   * Report a review for violations
   */
  async reportReview({ reviewId, reporterId, reason, description }) {
    if (!reviewId || !reporterId) {
      throw new Error('Missing review or reporter details.');
    }
    if (!reason) {
      throw new Error('Please select a valid report reason.');
    }

    const reports = this._getStoredReports();
    const existing = reports.find(r => r.review_id === reviewId && r.reporter_id === reporterId);
    if (existing) {
      throw new Error('You have already submitted a report for this review. Our moderation team is examining it.');
    }

    const newReport = {
      id: `rep-${Date.now()}`,
      review_id: reviewId,
      reporter_id: reporterId,
      reason,
      description: description || '',
      status: 'pending', // 'pending' | 'resolved_hidden' | 'resolved_dismissed'
      moderation_notes: null,
      created_at: new Date().toISOString()
    };

    reports.unshift(newReport);
    this._saveStoredReports(reports);

    // Audit log report
    try {
      await adminService.logAuditAction({
        action: 'review_reported',
        performedBy: reporterId,
        userRole: 'customer',
        targetId: reviewId,
        reasonOrNote: `Reported for reason: ${reason}`,
        metadata: { description }
      });
    } catch (e) {
      console.warn('Audit error on report:', e);
    }

    return newReport;
  }

  /**
   * Moderate review (Admin action)
   */
  async moderateReview({ reviewId, action, notes, adminId }) {
    // action: 'hide' | 'publish' | 'dismiss_report'
    const reviews = this._getStoredReviews();
    const review = reviews.find(r => r.id === reviewId);
    if (!review) {
      throw new Error('Review not found.');
    }

    if (action === 'hide') {
      review.status = 'hidden';
      review.moderation_notes = notes || 'Hidden by cooperative platform moderator for policy compliance.';
    } else if (action === 'publish' || action === 'restore') {
      review.status = 'published';
      review.moderation_notes = notes || 'Restored by platform moderation review.';
    }

    review.updated_at = new Date().toISOString();
    this._saveStoredReviews(reviews);

    // Update associated reports
    const reports = this._getStoredReports();
    reports.forEach(rep => {
      if (rep.review_id === reviewId) {
        rep.status = action === 'hide' ? 'resolved_hidden' : 'resolved_dismissed';
        rep.moderated_by = adminId;
        rep.moderated_at = new Date().toISOString();
        rep.moderation_notes = notes;
      }
    });
    this._saveStoredReports(reports);

    // Log admin moderation audit record
    try {
      await adminService.logAuditAction({
        action: `review_moderated_${action}`,
        performedBy: adminId || 'admin-system',
        userRole: 'admin',
        targetId: reviewId,
        reasonOrNote: notes || `Review status altered to ${review.status}`,
        metadata: { action, currentStatus: review.status }
      });
    } catch (e) {
      console.warn('Admin audit log error:', e);
    }

    return review;
  }

  /**
   * Get reviews submitted by a specific customer
   */
  async getCustomerReviews(customerId) {
    const reviews = this._getStoredReviews();
    return reviews.filter(r => r.customer_id === customerId || r.customerId === customerId);
  }

  /**
   * Get all reviews for a specific worker
   * Excludes hidden reviews unless requested for admin inspection
   */
  async getWorkerReviews(workerId, { includeHidden = false } = {}) {
    const reviews = this._getStoredReviews();
    return reviews.filter(r => {
      const matchWorker = r.worker_id === workerId || r.workerId === workerId;
      if (!matchWorker) return false;
      return includeHidden ? true : r.status === 'published';
    });
  }

  /**
   * Get reviews for a specific booking
   */
  async getReviewsForBooking(bookingId) {
    const reviews = this._getStoredReviews();
    return reviews.filter(r => r.booking_id === bookingId || r.bookingId === bookingId);
  }

  /**
   * Get all reviews with filters for Admin Panel
   */
  async getAllReviews({ status = 'all', minRating = 0, search = '' } = {}) {
    let reviews = this._getStoredReviews();
    const reports = this._getStoredReports();

    // Map reported status into review preview
    reviews = reviews.map(r => {
      const reviewReports = reports.filter(rep => rep.review_id === r.id);
      return {
        ...r,
        reportCount: reviewReports.length,
        hasPendingReport: reviewReports.some(rep => rep.status === 'pending')
      };
    });

    if (status !== 'all') {
      if (status === 'reported') {
        reviews = reviews.filter(r => r.reportCount > 0);
      } else {
        reviews = reviews.filter(r => r.status === status);
      }
    }

    if (minRating > 0) {
      reviews = reviews.filter(r => r.rating >= minRating);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      reviews = reviews.filter(r => 
        (r.review_text || '').toLowerCase().includes(q) ||
        (r.worker_name || '').toLowerCase().includes(q) ||
        (r.customer_name || '').toLowerCase().includes(q) ||
        (r.booking_id || '').toLowerCase().includes(q)
      );
    }

    return reviews;
  }

  /**
   * Calculate real worker rating metrics strictly from published reviews
   * Never fabricates ratings. Returns { averageRating: 0, reviewsCount: 0, distribution: {1:0,...5:0} } when no reviews exist.
   */
  async getWorkerRatingSummary(workerId) {
    const reviews = await this.getWorkerReviews(workerId, { includeHidden: false });
    
    if (!reviews || reviews.length === 0) {
      return {
        averageRating: null,
        reviewsCount: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        categories: {
          service_quality: 0,
          professionalism: 0,
          punctuality: 0,
          communication: 0,
          overall_experience: 0
        },
        hasReviews: false
      };
    }

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalScore = 0;
    const catTotals = {
      service_quality: 0,
      professionalism: 0,
      punctuality: 0,
      communication: 0,
      overall_experience: 0
    };

    reviews.forEach(r => {
      const stars = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      distribution[stars] = (distribution[stars] || 0) + 1;
      totalScore += r.rating;

      if (r.category_ratings) {
        catTotals.service_quality += (r.category_ratings.service_quality || stars);
        catTotals.professionalism += (r.category_ratings.professionalism || stars);
        catTotals.punctuality += (r.category_ratings.punctuality || stars);
        catTotals.communication += (r.category_ratings.communication || stars);
        catTotals.overall_experience += (r.category_ratings.overall_experience || stars);
      }
    });

    const count = reviews.length;
    const avg = Number((totalScore / count).toFixed(2));

    return {
      averageRating: avg,
      reviewsCount: count,
      distribution,
      categories: {
        service_quality: Number((catTotals.service_quality / count).toFixed(1)),
        professionalism: Number((catTotals.professionalism / count).toFixed(1)),
        punctuality: Number((catTotals.punctuality / count).toFixed(1)),
        communication: Number((catTotals.communication / count).toFixed(1)),
        overall_experience: Number((catTotals.overall_experience / count).toFixed(1))
      },
      hasReviews: true
    };
  }

  /**
   * Get all review reports for Moderation
   */
  async getReviewReports() {
    return this._getStoredReports();
  }
}

export const reviewService = new ReviewService();
export default reviewService;
