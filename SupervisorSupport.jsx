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
  AlertTriangle,
  FileQuestion,
  HardHat
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockSupervisorFaqs, mockSupervisor } from '../../data/supervisorMockData';

export default function SupervisorSupport() {
  const [openFaq, setOpenFaq] = useState(0);
  const [issueCategory, setIssueCategory] = useState('On-Site Safety Hazard');
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setFeedback({
        id: `ESC-SUP-${Date.now().toString().slice(-4)}`,
        category: issueCategory,
      });
      setDescription('');
      setProjectId('');
    }, 600);
  };

  return (
    <SupervisorLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Supervisor Escalation Desk & Regional Directorate Support"
          message="This portal allows field supervisors to submit urgent on-site safety halts, material defect disputes, and contractor insurance notifications directly to the Cooperative Executive Board."
        />

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Supervisory Escalation Desk
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                {mockSupervisor.cooperativeUnit}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Supervisor Support & Conciliation Cell
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Access cooperative engineering protocols or dispatch urgent on-site escalation reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:18002008899"
              className="px-4 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Phone className="w-4 h-4 text-brand-emerald" />
              <span>Directorate Hotline: 1800-200-8899</span>
            </a>
          </div>
        </div>

        {/* Dual Column: FAQs & Escalation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FAQ Accordion */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
              <FileQuestion className="w-5 h-5 text-brand-emerald" />
              <h3 className="font-display font-bold text-base text-brand-primary">
                Supervisory Governance FAQs
              </h3>
            </div>

            <div className="space-y-3">
              {mockSupervisorFaqs.map((faq, index) => (
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
                        openFaq === index ? 'rotate-180 text-brand-emerald' : ''
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

          {/* Incident / Escalation Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
              <MessageSquare className="w-5 h-5 text-brand-emerald" />
              <h3 className="font-display font-bold text-base text-brand-primary">
                File a Supervisory Escalation / Halt Order
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
                    <span>Escalation Logged: {feedback.id}</span>
                  </div>
                  <p className="text-[11px] opacity-90">
                    Your report under category "{feedback.category}" has been forwarded to the Directorate Conciliation Officer.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Escalation Nature *
                </label>
                <select
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-primary outline-none focus:ring-2 focus:ring-brand-emerald"
                >
                  <option>On-Site Safety Hazard (Work Halt Order)</option>
                  <option>Homeowner Unreasonable Scope Expansion</option>
                  <option>Defective Merchant Material Seizure</option>
                  <option>Craftsman Severe Absenteeism / Breach</option>
                  <option>Mutual Aid Insurance Claim</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Project ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. PRJ-2026-001"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-primary outline-none focus:ring-2 focus:ring-brand-emerald font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Detailed Field Evidence & Incident Log *
                </label>
                <textarea
                  rows={4}
                  placeholder="Specify measurements, safety violations, or customer statements observed on site..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-primary outline-none focus:ring-2 focus:ring-brand-emerald resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emerald/90 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Transmitting to Board...' : 'Dispatch Escalation Order'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </SupervisorLayout>
  );
}
