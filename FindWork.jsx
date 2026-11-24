import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  X,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockAvailableJobs, skillCategories } from '../../data/workerMockData';

export default function FindWork() {
  const [jobs, setJobs] = useState(mockAvailableJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');

  // Apply / Accept Confirmation Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.generalLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || job.category === selectedCategory;
    const matchesUrgency =
      selectedUrgency === 'All' || job.urgency === selectedUrgency;
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const handleConfirmAccept = () => {
    if (!selectedJob) return;
    setSubmitting(true);

    setTimeout(() => {
      // Remove job from marketplace and simulate assignment
      setJobs(jobs.filter((j) => j.id !== selectedJob.id));
      setSubmitting(false);
      setSuccessNotice({
        title: 'Job Request Accepted & Locked',
        message: `Opportunity ${selectedJob.id} has been registered to your terminal. Your assigned supervisor will initiate the pre-service checklist.`,
      });
      setSelectedJob(null);
      setTimeout(() => setSuccessNotice(null), 6000);
    }, 700);
  };

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Nearby Service Job Marketplace (Worker Dispatch)"
          message="Jobs displayed here are open for cooperative craftsmen bidding or direct acceptance. To protect customer safety, exact residential street numbers are locked until supervisor confirmation."
        />

        {/* Success Alert */}
        <AnimatePresence>
          {successNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-start gap-3 text-xs sm:text-sm font-medium shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">{successNotice.title}</h4>
                <p className="mt-0.5 text-emerald-800 text-xs">
                  {successNotice.message}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <Badge variant="teal" size="sm">
                Live Opportunities: {jobs.length} Available
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                East Bengaluru Region
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Find Cooperative Work
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Browse pre-screened home service tasks. Fair labor pricing guaranteed by the SahkarSathi escrow vault.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-brand-bgSecondary border border-brand-border text-xs text-brand-primary flex items-center gap-2 font-mono">
            <Lock className="w-3.5 h-3.5 text-brand-teal" />
            <span>DPDP Customer Address Shield Active</span>
          </div>
        </div>

        {/* Search & Multi-Filters */}
        <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-secondary" />
              <input
                type="text"
                placeholder="Search job title, task scope, or general locality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs text-brand-primary outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-brand-border text-xs text-brand-primary bg-white outline-none focus:ring-2 focus:ring-brand-teal"
              >
                <option value="All">All Categories</option>
                {skillCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-brand-border text-xs text-brand-primary bg-white outline-none focus:ring-2 focus:ring-brand-teal"
              >
                <option value="All">All Timelines</option>
                <option value="Immediate">Immediate / Emergency</option>
                <option value="Urgent">Urgent (Today)</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              layout
              className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border hover:border-brand-teal/50 transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-secondary px-2 py-0.5 rounded bg-brand-bgSecondary border border-brand-border">
                      {job.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        job.urgency === 'Immediate'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : job.urgency === 'Urgent'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {job.urgency}
                    </span>
                    <span className="text-xs text-brand-secondary font-mono">
                      {job.id}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-brand-primary pt-1">
                    {job.title}
                  </h3>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <span className="text-[11px] text-brand-secondary block">
                    Labor Wage Offer:
                  </span>
                  <span className="font-display font-bold text-lg sm:text-xl text-brand-primary text-emerald-700">
                    {job.estimatedPay}
                  </span>
                  <span className="text-[10px] text-brand-secondary block font-mono">
                    Escrow Guaranteed
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-brand-secondary mt-3 leading-relaxed">
                {job.description}
              </p>

              {/* Requirements & Info Tags */}
              <div className="mt-4 pt-3 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-3 text-xs text-brand-secondary">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{job.generalLocation}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{job.preferredDate}</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-brand-secondary" />
                    Posted {job.postedTime}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-teal font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors self-stretch sm:self-auto justify-center"
                >
                  <span>Accept Opportunity</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Prerequisites Pills */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-brand-secondary font-semibold">
                  Required:
                </span>
                {job.requirements.map((req, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-brand-bgSecondary text-brand-primary border border-brand-border font-medium"
                  >
                    ✓ {req}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-brand-border space-y-3">
            <Search className="w-10 h-10 text-brand-secondary mx-auto opacity-40" />
            <h3 className="font-display font-bold text-lg text-brand-primary">
              No Work Opportunities Found
            </h3>
            <p className="text-xs text-brand-secondary max-w-sm mx-auto">
              No service dispatches currently match your filters. Broaden your category selection or check back shortly.
            </p>
          </div>
        )}

        {/* Confirmation Modal */}
        <AnimatePresence>
          {selectedJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedJob(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-border z-10 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-brand-teal" />
                    <h3 className="font-display font-bold text-lg text-brand-primary">
                      Confirm Assignment Acceptance
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-brand-bgSecondary border border-brand-border space-y-1">
                    <p className="font-bold text-brand-primary">{selectedJob.title}</p>
                    <p className="text-xs text-brand-secondary">{selectedJob.generalLocation}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-brand-border text-xs">
                      <span>Rate: <strong className="text-emerald-700">{selectedJob.estimatedPay}</strong></span>
                      <span>Schedule: <strong>{selectedJob.preferredDate}</strong></span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs space-y-1">
                    <h5 className="font-bold">Cooperative Commitment Notice:</h5>
                    <p className="leading-relaxed">
                      Accepting this job reserves it exclusively for you and notifies the area Supervisor.
                      Cancellations without 2-hour notice may impact your reliability score.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    disabled={submitting}
                    className="px-4 py-2.5 rounded-xl border border-brand-border hover:bg-black/5 text-xs font-semibold text-brand-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAccept}
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Locking Assignment...' : 'Confirm & Accept Job'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </WorkerLayout>
  );
}
