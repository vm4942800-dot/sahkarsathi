import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Phone,
  MessageSquare,
  ChevronDown,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  Users
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockWorkerFaqs, mockWorker } from '../../data/workerMockData';

export default function WorkerSupport() {
  const [openFaq, setOpenFaq] = useState(0);
  const [ticketCategory, setTicketCategory] = useState('Payment / Escrow Inquiry');
  const [jobId, setJobId] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setFeedback({
        id: `TKT-WRK-${Date.now().toString().slice(-4)}`,
        category: ticketCategory,
      });
      setDescription('');
      setJobId('');
    }, 700);
  };

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Worker Cooperative Mutual Aid & Supervisory Helpdesk"
          message="Support requests submitted through this terminal are routed directly to your local Cooperative Zone Officer and the Regional Grievance Redressal Committee."
        />

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="teal" size="sm">
                Worker Helpline Active
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                {mockWorker.cooperativeUnit}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Craftsman Support & Grievance Cell
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Find answers regarding cooperative wage guarantees, safety standards, or dispatch a dispute ticket.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:18002008890"
              className="px-4 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Phone className="w-4 h-4 text-brand-teal" />
              <span>Toll-Free Aid: 1800-200-8890</span>
            </a>
          </div>
        </div>

        {/* Dual Column: FAQs & Support Ticket Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FAQ Accordion */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
              <FileQuestion className="w-5 h-5 text-brand-teal" />
              <h3 className="font-display font-bold text-base text-brand-primary">
                Frequently Asked Worker Questions
              </h3>
            </div>

            <div className="space-y-3">
              {mockWorkerFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-brand-border overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-brand-primary flex items-center justify-between gap-3 bg-brand-bgSecondary/20 hover:bg-brand-bgSecondary/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-brand-secondary flex-shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180 text-brand-teal' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4 pt-1 text-xs text-brand-secondary leading-relaxed bg-white border-t border-brand-border/60">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Dispute / Ticket Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
              <MessageSquare className="w-5 h-5 text-brand-teal" />
              <h3 className="font-display font-bold text-base text-brand-primary">
                Raise an Incident / Dispute Ticket
              </h3>
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs space-y-1"
                >
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Ticket Logged: {feedback.id}</span>
                  </div>
                  <p className="text-[11px] opacity-90">
                    Your request under category "{feedback.category}" has been registered. An on-duty supervisor will review this within 2 hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Issue Classification *
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-primary outline-none focus:ring-2 focus:ring-brand-teal"
                >
                  <option>Payment / Escrow Inquiry</option>
                  <option>Customer Site Dispute / Unsafe Environment</option>
                  <option>Supervisor Assessment Review</option>
                  <option>Tool Loan / Material Advance</option>
                  <option>Cooperative Mutual Welfare Claim</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Related Job ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ACT-WRK-5041"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-primary outline-none focus:ring-2 focus:ring-brand-teal font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Incident Description & Details *
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain what happened at the site or with payment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-primary outline-none focus:ring-2 focus:ring-brand-teal resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Registering Ticket...' : 'Dispatch Ticket to Supervisory Wing'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </WorkerLayout>
  );
}
