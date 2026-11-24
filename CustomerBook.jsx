import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  FileText, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Coins,
  Building
} from 'lucide-react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import BackendNotice from '../../components/common/BackendNotice';
import { BRAND } from '../../config/brand';
import { mockAddresses } from '../../data/customerMockData';
import { bookingService } from '../../services/bookingService';
import { emailService } from '../../services/emailService';
import { discoveryService } from '../../services/discoveryService';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function CustomerBook() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const initialServiceId = searchParams.get('service') || 'electrical';
  const initialWorkerId = searchParams.get('worker');

  const [preferredWorker, setPreferredWorker] = useState(null);

  useEffect(() => {
    if (initialWorkerId) {
      discoveryService.getPublicWorkerProfile(initialWorkerId).then(setPreferredWorker);
    }
  }, [initialWorkerId]);

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    serviceId: initialServiceId,
    description: '',
    urgency: 'standard', // 'emergency' | 'standard' | 'flexible'
    date: '2026-11-26',
    timeSlot: 'Morning (10:00 AM – 1:00 PM)',
    addressId: 'addr-1',
    customAddress: '',
    city: 'New Delhi',
    postalCode: '110085',
    instructions: '',
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [generatedBookingId, setGeneratedBookingId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const selectedServiceObj = BRAND.services.find((s) => s.id === bookingData.serviceId) || BRAND.services[0];
  const selectedAddressObj = mockAddresses.find((a) => a.id === bookingData.addressId) || mockAddresses[0];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalConfirm = async () => {
    if (isSubmitting) return; // Prevent duplicate submission clicks
    setIsSubmitting(true);
    setBookingError(null);

    try {
      const res = await bookingService.createBooking({
        customerId: user?.id || 'usr_customer_409',
        serviceTitle: selectedServiceObj.title,
        scheduledDate: bookingData.date,
        scheduledTime: bookingData.timeSlot,
        serviceAddress: `${selectedAddressObj.street}, ${selectedAddressObj.city}`,
        instructions: bookingData.instructions,
        totalAmount: 1450,
        preferredWorkerId: preferredWorker?.id || null,
      });
      const finalId = res.booking_code || res.bookingCode || res.id;
      setGeneratedBookingId(finalId);
      setIsConfirmed(true);

      // Trigger real-time notification
      notify({
        title: 'Booking Confirmed & Escrow Held',
        description: `Your request for ${selectedServiceObj.title} (${finalId}) has been logged. Escrow ₹1,450 safely reserved.`,
        notificationType: 'booking_review',
        relatedId: finalId,
        actionUrl: '/customer/bookings/active',
      });

      // Dispatch transactional email (if configured)
      emailService.sendBookingConfirmation({
        customerEmail: user?.email || 'customer@sahkarsathi.in',
        customerName: user?.user_metadata?.full_name || 'Customer',
        bookingCode: finalId,
        serviceTitle: selectedServiceObj.title,
        scheduledDate: bookingData.date,
      });
    } catch (err) {
      console.error('Booking creation error:', err);
      setBookingError(err.message || 'Failed to confirm booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = [
    'Select Trade',
    'Requirement',
    'Date & Time',
    'Service Address',
    'Review Order',
  ];

  return (
    <CustomerLayout title="Schedule a Cooperative Service">
      <div className="max-w-3xl mx-auto space-y-8">
        <BackendNotice
          featureName="6-Step Booking & Supervisor Dispatch Pipeline"
          details="Simulated end-to-end booking flow. Submitting confirmation queues the request in your local dashboard session."
        />

        {isConfirmed ? (
          /* Step 6: Confirmation Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-12 rounded-3xl bg-white border border-brand-border shadow-premium text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-brand-emerald/15 text-brand-emerald flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="font-mono text-xs font-bold text-brand-teal uppercase tracking-wider">
                Booking ID: {generatedBookingId}
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
                Service Booked Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-brand-secondary max-w-md mx-auto">
                Your request has been routed to the regional cooperative hub. A supervisor lead has been queued to confirm technician schedule and verify tooling requirements.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border/70 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-brand-secondary">Selected Trade:</span>
                <span className="font-bold text-brand-primary">{selectedServiceObj.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-secondary">Scheduled Slot:</span>
                <span className="font-bold text-brand-primary">{bookingData.date}, {bookingData.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-secondary">Escrow Status:</span>
                <span className="font-bold text-brand-emerald">Held in Safe Escrow</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                to="/customer/bookings/active"
                variant="primary"
                size="md"
                className="w-full sm:w-auto font-bold"
              >
                View in Active Bookings
              </Button>
              <Button
                to="/customer/dashboard"
                variant="secondary"
                size="md"
                className="w-full sm:w-auto"
              >
                Return to Dashboard
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="rounded-3xl bg-white border border-brand-border p-6 sm:p-10 shadow-premium">
            {/* Preferred Artisan Notice Banner */}
            {preferredWorker && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={preferredWorker.avatar}
                    alt={preferredWorker.name}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-brand-emerald/30 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-brand-primary">
                        Preferred Artisan: {preferredWorker.name}
                      </span>
                      {preferredWorker.verificationStatus === 'verified' && (
                        <ShieldCheck className="w-4 h-4 text-brand-emerald" title="Verified" />
                      )}
                    </div>
                    <span className="text-[11px] text-brand-secondary block mt-0.5">
                      {preferredWorker.trade} • {preferredWorker.city} ({preferredWorker.area}) • ★ {preferredWorker.rating || 'New'} ({preferredWorker.completedJobs} jobs)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferredWorker(null)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                >
                  Clear Preferred
                </button>
              </div>
            )}

            {/* Step Progress Track */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-brand-border/70">
              {stepLabels.map((label, idx) => {
                const stepNum = idx + 1;
                const isPassed = currentStep > stepNum;
                const isCurrent = currentStep === stepNum;

                return (
                  <div key={label} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-brand-teal text-white ring-2 ring-brand-teal/20 shadow-xs'
                          : isPassed
                          ? 'bg-brand-emerald text-white'
                          : 'bg-brand-surface text-brand-secondary/60'
                      }`}
                    >
                      {stepNum}
                    </div>
                    <span
                      className={`text-xs font-medium hidden md:inline-block ${
                        isCurrent ? 'text-brand-primary font-bold' : 'text-brand-secondary/70'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Step 1: Select Service */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h3 className="font-display font-bold text-lg text-brand-primary">
                  1. Choose the required service trade:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BRAND.services.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setBookingData({ ...bookingData, serviceId: srv.id })}
                      className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all ${
                        bookingData.serviceId === srv.id
                          ? 'border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal shadow-xs'
                          : 'border-brand-border hover:bg-brand-surface/40'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-brand-primary">{srv.title}</div>
                        <div className="text-xs text-brand-secondary mt-1">{srv.shortDesc}</div>
                      </div>
                      {bookingData.serviceId === srv.id && (
                        <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0 ml-2 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={handleNext} variant="primary" size="md" icon={ArrowRight} iconPosition="right">
                    Continue to Details
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Describe Requirement */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h3 className="font-display font-bold text-lg text-brand-primary">
                  2. Describe the issue or project requirement:
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1">
                    Task Particulars & Symptoms
                  </label>
                  <textarea
                    rows={4}
                    value={bookingData.description}
                    onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                    placeholder="Describe specific problems (e.g. breaker tripping, pipe seepage, door hinges sticking, number of rooms)..."
                    className="w-full p-3.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary placeholder:text-brand-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1">
                    Scheduling Urgency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'standard', label: 'Standard (1-2 Days)' },
                      { id: 'flexible', label: 'Flexible (This Week)' },
                      { id: 'emergency', label: 'Urgent (Next Available)' },
                    ].map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, urgency: u.id })}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          bookingData.urgency === u.id
                            ? 'bg-brand-teal text-white border-brand-teal shadow-xs'
                            : 'bg-brand-surface text-brand-secondary border-brand-border'
                        }`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button onClick={handleBack} variant="ghost" size="sm" icon={ArrowLeft}>
                    Back
                  </Button>
                  <Button onClick={handleNext} variant="primary" size="md" icon={ArrowRight} iconPosition="right">
                    Schedule Slot
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Date and Time */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h3 className="font-display font-bold text-lg text-brand-primary">
                  3. Select Preferred Date and Time:
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      className="w-full p-3 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Time Slot
                    </label>
                    <select
                      value={bookingData.timeSlot}
                      onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
                      className="w-full p-3 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                    >
                      <option value="Morning (9:00 AM – 1:00 PM)">Morning (9:00 AM – 1:00 PM)</option>
                      <option value="Afternoon (1:00 PM – 5:00 PM)">Afternoon (1:00 PM – 5:00 PM)</option>
                      <option value="Evening (5:00 PM – 8:00 PM)">Evening (5:00 PM – 8:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-surface border border-brand-border text-xs text-brand-secondary flex items-start gap-2">
                  <Clock className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                  <span>Regional supervisors verify technician workload to guarantee punctual on-site arrivals.</span>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button onClick={handleBack} variant="ghost" size="sm" icon={ArrowLeft}>
                    Back
                  </Button>
                  <Button onClick={handleNext} variant="primary" size="md" icon={ArrowRight} iconPosition="right">
                    Confirm Address
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Address Selection */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <h3 className="font-display font-bold text-lg text-brand-primary">
                  4. Select Delivery Address:
                </h3>

                <div className="space-y-3">
                  {mockAddresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                        bookingData.addressId === addr.id
                          ? 'border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal'
                          : 'border-brand-border bg-white hover:bg-brand-surface'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={bookingData.addressId === addr.id}
                        onChange={() => setBookingData({ ...bookingData, addressId: addr.id })}
                        className="mt-1 text-brand-teal focus:ring-brand-teal"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-brand-primary block">{addr.label}</span>
                        <span className="text-brand-secondary">{addr.street}, {addr.area}, {addr.city} – {addr.postalCode}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1">
                    Special Entry Instructions for Technician & Supervisor (Optional)
                  </label>
                  <input
                    type="text"
                    value={bookingData.instructions}
                    onChange={(e) => setBookingData({ ...bookingData, instructions: e.target.value })}
                    placeholder="e.g. Call upon reaching main security gate; parking in visitor bay..."
                    className="w-full p-3 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button onClick={handleBack} variant="ghost" size="sm" icon={ArrowLeft}>
                    Back
                  </Button>
                  <Button onClick={handleNext} variant="primary" size="md" icon={ArrowRight} iconPosition="right">
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Review & Price Estimate */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-lg text-brand-primary">
                  5. Review Booking & Escrow Terms:
                </h3>

                <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between pb-2 border-b border-brand-border">
                    <span className="text-brand-secondary">Service Trade:</span>
                    <span className="font-bold text-brand-primary">{selectedServiceObj.title}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-brand-border">
                    <span className="text-brand-secondary">Scheduled Date & Slot:</span>
                    <span className="font-bold text-brand-primary">{bookingData.date} ({bookingData.timeSlot})</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-brand-border">
                    <span className="text-brand-secondary">Premises:</span>
                    <span className="font-bold text-brand-primary text-right max-w-xs">{selectedAddressObj.street}, {selectedAddressObj.city}</span>
                  </div>
                  <div className="flex justify-between text-brand-teal font-semibold pt-1">
                    <span>Supervisor Allocation:</span>
                    <span>Complimentary Co-op Lead Assigned</span>
                  </div>
                  <div className="flex justify-between text-brand-emerald font-bold pt-1 text-sm border-t border-brand-border">
                    <span>Estimated Diagnostic Deposit:</span>
                    <span>₹ 1,450.00 (Escrow Protected)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-xs text-brand-primary flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                  <span>Funds remain strictly in escrow. Only released when you sign off after the on-site quality walkthrough.</span>
                </div>

                {bookingError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <span className="font-semibold">{bookingError}</span>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <Button onClick={handleBack} variant="ghost" size="sm" icon={ArrowLeft} disabled={isSubmitting}>
                    Back
                  </Button>
                  <Button
                    onClick={handleFinalConfirm}
                    variant="primary"
                    size="lg"
                    icon={CheckCircle2}
                    iconPosition="right"
                    disabled={isSubmitting}
                    className="font-bold shadow-md"
                  >
                    {isSubmitting ? 'Confirming Dispatch...' : 'Confirm & Deposit to Escrow'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
