import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Search,
  Calendar,
  IndianRupee,
  Star,
  ShieldCheck,
  FileText,
  Filter,
  X,
  Eye,
  Download
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockCompletedJobs } from '../../data/workerMockData';

export default function CompletedJobs() {
  const [jobs, setJobs] = useState(mockCompletedJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = jobs.filter((j) => {
    return (
      j.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.customerGeneralArea.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Completed Job Records & Certified Labor History"
          message="All completed jobs preserve tamper-evident digital records including customer feedback, supervisor inspection certificates, and bank settlement UTR references."
        />

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Certified Completions: {jobs.length}
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                100% Escrow Settled
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Completed Service History
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Review your historical service assignments, supervisor approval notes, and customer reviews.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-secondary" />
            <input
              type="text"
              placeholder="Search by job ID, service title, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs text-brand-primary outline-none"
            />
          </div>
        </div>

        {/* Completed Jobs Cards */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              layout
              className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border hover:border-brand-teal/40 transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-brand-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-brand-primary bg-brand-bgSecondary px-2 py-0.5 rounded border border-brand-border">
                      {job.id}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ {job.payoutStatus}
                    </span>
                    <span className="text-xs text-brand-secondary font-mono">
                      Completed: {job.completionDate}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-brand-primary pt-1">
                    {job.service}
                  </h3>
                  <p className="text-xs text-brand-secondary">
                    Location: {job.customerGeneralArea}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-brand-secondary block">Net Credited Payout:</span>
                  <span className="font-display font-bold text-xl text-emerald-700">
                    {job.payout}
                  </span>
                  <span className="text-[10px] text-brand-secondary font-mono block">
                    UTR: {job.utrNumber.slice(0, 16)}...
                  </span>
                </div>
              </div>

              {/* Review Quote & Rating */}
              <div className="py-3 text-xs">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="flex items-center text-brand-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(job.customerRating)
                            ? 'fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-brand-primary text-xs">
                    {job.customerRating} / 5.0
                  </span>
                  <span className="text-brand-secondary text-[11px]">
                    Customer Rating
                  </span>
                </div>
                <p className="italic text-brand-secondary bg-brand-bgSecondary/40 p-3 rounded-xl border border-brand-border/60">
                  "{job.customerReview}"
                </p>
              </div>

              {/* Supervisor Sign-Off & Detail Button */}
              <div className="pt-3 border-t border-brand-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                <span className="text-emerald-800 font-medium flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  {job.supervisorSignOff}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className="px-4 py-2 rounded-xl bg-brand-bgSecondary hover:bg-brand-border text-brand-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-teal" />
                  <span>Inspect Job Certificate</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-brand-border space-y-3">
            <CheckCircle2 className="w-10 h-10 text-brand-secondary mx-auto opacity-40" />
            <h3 className="font-display font-bold text-lg text-brand-primary">
              No Completed Records Found
            </h3>
            <p className="text-xs text-brand-secondary max-w-sm mx-auto">
              No service records match your search criteria.
            </p>
          </div>
        )}

        {/* Job Detail Modal */}
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
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-display font-bold text-lg text-brand-primary">
                      Certified Service Slip
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
                  <div className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-brand-secondary">Job Reference:</span>
                      <strong className="font-mono text-brand-primary">{selectedJob.id}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-brand-secondary">Service Rendered:</span>
                      <strong className="text-brand-primary">{selectedJob.service}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-brand-secondary">Completed On:</span>
                      <span className="text-brand-primary">{selectedJob.completionDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-brand-secondary">Net Labor Disbursed:</span>
                      <strong className="text-emerald-700 font-bold">{selectedJob.payout}</strong>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-brand-border font-mono text-[11px]">
                      <span className="text-brand-secondary">Bank UTR Reference:</span>
                      <span className="text-brand-primary">{selectedJob.utrNumber}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs space-y-1">
                    <h5 className="font-bold">Supervisory Quality Certification:</h5>
                    <p className="text-[11px] leading-relaxed">
                      {selectedJob.supervisorSignOff}. Meets all Bureau of Indian Standards (BIS) and SahkarSathi cooperative safety requirements.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-secondary hover:bg-black/5"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading signed certificate for ${selectedJob.id}...`)}
                    className="px-4 py-2.5 rounded-xl bg-brand-teal text-white text-xs font-semibold hover:bg-brand-teal/90 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Receipt</span>
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
