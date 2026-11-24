import React, { useState } from 'react';
import { 
  LifeBuoy, 
  HelpCircle, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck 
} from 'lucide-react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import Button from '../../components/common/Button';
import BackendNotice from '../../components/common/BackendNotice';
import { mockFaqs, mockBookings } from '../../data/customerMockData';
import { BRAND } from '../../config/brand';

export default function CustomerSupport() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [ticketData, setTicketData] = useState({
    category: 'booking',
    bookingId: 'BK-2025-0891',
    subject: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <CustomerLayout title="Customer Support & Helpdesk">
      <div className="max-w-5xl mx-auto space-y-8">
        <BackendNotice
          featureName="Cooperative Helpdesk & Escrow Dispute Mediation"
          details="Phase 1 frontend support console. Submitting an issue dispatches an internal event to your regional chapter supervisor."
        />

        {/* Top Emergency & Helpline Card */}
        <div className="rounded-3xl bg-brand-dark text-white p-6 sm:p-8 border border-white/10 shadow-dark-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-brand-gold">
              Emergency Maintenance & Safety
            </span>
            <h3 className="font-display font-bold text-xl text-white">
              Need immediate supervisor assistance?
            </h3>
            <p className="text-xs text-brand-surface/75 max-w-lg">
              For major electrical hazards or severe active plumbing leaks during scheduled service hours, contact your regional duty supervisor directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={`tel:${BRAND.supportPhone}`}
              className="py-2.5 px-4 rounded-xl bg-brand-gold text-brand-dark text-xs font-bold shadow-md hover:bg-brand-gold-light transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>{BRAND.supportPhone}</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Support Request Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-brand-border p-6 sm:p-8 shadow-subtle space-y-5">
              <h3 className="font-display font-bold text-lg text-brand-primary pb-2 border-b border-brand-border">
                Submit a Support Ticket / Dispute Inquiry
              </h3>

              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-brand-emerald/15 text-brand-emerald flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-brand-primary">
                    Ticket Logged (Simulated)
                  </h4>
                  <p className="text-xs text-brand-secondary max-w-sm mx-auto">
                    Your request has been filed under reference <strong className="font-mono text-brand-primary">TKT-2026-042</strong>. A cooperative resolution lead will review your booking details within 2 business hours.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Issue Category
                    </label>
                    <select
                      value={ticketData.category}
                      onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-border text-xs sm:text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                    >
                      <option value="booking">Active Booking Status or Rescheduling</option>
                      <option value="quality">Workmanship Quality or Material Dispute</option>
                      <option value="escrow">Payment, Escrow Refund, or Billing</option>
                      <option value="feedback">General Cooperative Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Related Booking (Optional)
                    </label>
                    <select
                      value={ticketData.bookingId}
                      onChange={(e) => setTicketData({ ...ticketData, bookingId: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-border text-xs sm:text-sm text-brand-primary font-mono focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                    >
                      <option value="">None / General Inquiry</option>
                      {mockBookings.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id} — {b.taskTitle} ({b.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketData.subject}
                      onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                      placeholder="e.g. Need clarification on distribution board material bill"
                      className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Description of Concern
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={ticketData.description}
                      onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                      placeholder="Provide specific notes so your regional supervisor can resolve the issue promptly..."
                      className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      loading={loading}
                      icon={Send}
                      iconPosition="right"
                      className="font-semibold shadow-sm"
                    >
                      Submit Ticket
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* FAQs Accordion Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-subtle space-y-4">
              <h3 className="font-display font-bold text-base text-brand-primary flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-teal" />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-3">
                {mockFaqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;

                  return (
                    <div
                      key={index}
                      className="rounded-2xl border border-brand-border/70 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full p-3.5 text-left bg-brand-surface/50 hover:bg-brand-surface transition-colors flex items-center justify-between gap-2"
                      >
                        <span className="font-bold text-xs text-brand-primary">
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-brand-secondary shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-brand-secondary shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-3.5 bg-white text-xs text-brand-secondary leading-relaxed border-t border-brand-border/60">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
