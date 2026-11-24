import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Wrench, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import BackendNotice from '../components/common/BackendNotice';
import { BRAND } from '../config/brand';

export default function BookService() {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('service') || 'electrical';

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(preselected);
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('morning');
  const [jobDescription, setJobDescription] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const selectedServiceObj = BRAND.services.find((s) => s.id === selectedService) || BRAND.services[0];

  const handleComplete = (e) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Transparent Booking Flow"
          badgeIcon={Clock}
          badgeVariant="teal"
          title="Schedule Your"
          highlight="Verified Service"
          subtitle="Fixed standardized cooperative rates, vetted technicians, and designated supervisor oversight on every request."
          align="center"
          className="mb-8"
        />

        <BackendNotice
          featureName="Booking Dispatch System"
          details="This is an interactive step-through workflow. All inputs and steps are fully interactive and simulate live appointment confirmation and supervisor allocation."
        />

        {isBooked ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-white border border-brand-border p-8 sm:p-12 shadow-premium text-center space-y-5"
          >
            <div className="w-16 h-16 rounded-full bg-brand-emerald/15 text-brand-emerald flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-brand-primary">
              Service Request Placed (Simulated)
            </h2>
            <p className="text-sm text-brand-secondary max-w-md mx-auto leading-relaxed">
              Your request for <strong className="text-brand-primary">{selectedServiceObj.title}</strong> has been processed in preview mode. A regional cooperative supervisor will be assigned to review material requirements and confirm your schedule.
            </p>

            <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border/70 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-brand-secondary">Selected Trade:</span>
                <span className="font-semibold text-brand-primary">{selectedServiceObj.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-secondary">Preferred Slot:</span>
                <span className="font-semibold text-brand-primary capitalize">{timeSlot} Slot</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-secondary">Status:</span>
                <span className="font-semibold text-brand-teal">Supervisor Queued</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button to="/" variant="secondary" size="md">
                Return to Homepage
              </Button>
              <Button
                onClick={() => { setIsBooked(false); setStep(1); }}
                variant="primary"
                size="md"
              >
                Book Another Service
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="rounded-3xl bg-white border border-brand-border p-6 sm:p-10 shadow-premium">
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-brand-border/60">
              {[
                { num: 1, label: 'Trade Service' },
                { num: 2, label: 'Details & Schedule' },
                { num: 3, label: 'Review & Confirm' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step >= s.num
                        ? 'bg-brand-teal text-white'
                        : 'bg-brand-surface text-brand-secondary'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:inline-block ${
                      step >= s.num ? 'text-brand-primary' : 'text-brand-secondary/60'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Select Trade */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-lg text-brand-primary">
                  1. Choose the trade you need:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {BRAND.services.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setSelectedService(srv.id)}
                      className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all ${
                        selectedService === srv.id
                          ? 'border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal shadow-xs'
                          : 'border-brand-border hover:border-brand-teal/30 hover:bg-brand-surface/40'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-brand-primary">{srv.title}</div>
                        <div className="text-xs text-brand-secondary mt-1">{srv.shortDesc}</div>
                      </div>
                      {selectedService === srv.id && (
                        <CheckCircle className="w-5 h-5 text-brand-teal shrink-0 ml-2 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    variant="primary"
                    size="md"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Continue to Details
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Details & Schedule */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-display font-bold text-lg text-brand-primary">
                  2. Project location & schedule
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1">
                    Service Address / Landmark
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Green Park Residency, New Delhi"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Time Slot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                    >
                      <option value="morning">Morning (9:00 AM – 1:00 PM)</option>
                      <option value="afternoon">Afternoon (1:00 PM – 5:00 PM)</option>
                      <option value="evening">Evening (5:00 PM – 8:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1">
                    Task Description / Particulars
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe specific repair issues, dimensions, or materials on-site..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button
                    onClick={() => setStep(1)}
                    variant="ghost"
                    size="sm"
                    icon={ArrowLeft}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    variant="primary"
                    size="md"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Review Quote & Terms
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-lg text-brand-primary">
                  3. Cooperative Estimate & Protection Summary
                </h3>

                <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border space-y-3 text-sm">
                  <div className="flex justify-between pb-2 border-b border-brand-border/60">
                    <span className="text-brand-secondary">Selected Trade:</span>
                    <span className="font-bold text-brand-primary">{selectedServiceObj.title}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-brand-border/60">
                    <span className="text-brand-secondary">Scheduled Slot:</span>
                    <span className="font-bold text-brand-primary capitalize">{date || 'Next Available'}, {timeSlot}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-brand-border/60">
                    <span className="text-brand-secondary">Location:</span>
                    <span className="font-bold text-brand-primary">{address || 'Address provided on file'}</span>
                  </div>
                  <div className="flex justify-between text-brand-teal font-semibold pt-1">
                    <span>Supervisor Allocation:</span>
                    <span>Complimentary Cooperative Audit</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-xs text-brand-primary space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-brand-emerald">
                    <ShieldCheck className="w-4 h-4" />
                    <span>SahkarSathi Cooperative Protection</span>
                  </div>
                  <p className="text-brand-secondary">
                    Your appointment is backed by verified technician credentials, clear itemized billing, and satisfaction sign-off prior to escrow payout.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button
                    onClick={() => setStep(2)}
                    variant="ghost"
                    size="sm"
                    icon={ArrowLeft}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    variant="primary"
                    size="lg"
                    icon={CheckCircle}
                    iconPosition="right"
                  >
                    Confirm & Dispatch Supervisor
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
