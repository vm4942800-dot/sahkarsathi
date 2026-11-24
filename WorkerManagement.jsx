import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  Eye,
  X,
  MapPin,
  Briefcase,
  AlertCircle,
  HardHat,
  Lock
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockSupervisedWorkers } from '../../data/supervisorMockData';

export default function WorkerManagement() {
  const [workers, setWorkers] = useState(mockSupervisedWorkers);
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [selectedWorker, setSelectedWorker] = useState(null);

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAvailability =
      availabilityFilter === 'All' ||
      (availabilityFilter === 'Available' && w.isAvailable) ||
      (availabilityFilter === 'OnSite' && !w.isAvailable);

    const matchesVerification =
      verificationFilter === 'All' || w.verificationStatus === verificationFilter;

    return matchesSearch && matchesAvailability && matchesVerification;
  });

  return (
    <SupervisorLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Authorized Cooperative Worker Roster Management"
          message="Supervisors can inspect skills, dispatch readiness, and safety qualifications for Unit #14 artisans. In adherence with DPDP Act, private identity documents remain confidential in the State Registry."
        />

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Roster: {workers.length} Unit #14 Tradesmen
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                {workers.filter((w) => w.isAvailable).length} Available for Deployment
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Worker Management & Deployment
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Audit worker credentials, check active site commitments, and review quality ratings before project dispatch.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-brand-bgSecondary border border-brand-border text-xs text-brand-primary flex items-center gap-2 font-mono">
            <Lock className="w-3.5 h-3.5 text-brand-emerald" />
            <span>DPDP Privacy Protocol Active</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-secondary" />
            <input
              type="text"
              placeholder="Search by worker name, trade role, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-emerald text-xs text-brand-primary outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-brand-border text-xs text-brand-primary bg-white outline-none focus:ring-2 focus:ring-brand-emerald"
            >
              <option value="All">All Availabilities</option>
              <option value="Available">Available Only</option>
              <option value="OnSite">Currently on Site</option>
            </select>

            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-brand-border text-xs text-brand-primary bg-white outline-none focus:ring-2 focus:ring-brand-emerald"
            >
              <option value="All">All Verification States</option>
              <option value="Approved">Approved (Master / Skilled)</option>
              <option value="Under Review">Under Review (Apprentice)</option>
            </select>
          </div>
        </div>

        {/* Worker Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWorkers.map((worker) => (
            <motion.div
              key={worker.id}
              layout
              className="bg-white rounded-2xl p-5 border border-brand-border hover:border-brand-emerald/40 transition-all shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-12 h-12 rounded-xl object-cover border border-brand-border"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        worker.isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-base text-brand-primary">
                        {worker.name}
                      </h3>
                      {worker.verificationStatus === 'Approved' ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-brand-secondary font-medium">{worker.role}</p>
                    <p className="text-[11px] font-mono text-gray-400 mt-0.5">{worker.id}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      worker.isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {worker.isAvailable ? 'Ready for Jobs' : 'On Active Site'}
                  </span>
                  <div className="text-[10px] text-brand-gold mt-1">★ {worker.rating} Rating</div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5">
                {worker.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-brand-bgSecondary text-brand-primary border border-brand-border font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Meta & View Action */}
              <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs text-brand-secondary">
                <span className="flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-brand-emerald" />
                  {worker.generalArea}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedWorker(worker)}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-bgSecondary hover:bg-brand-border text-brand-primary font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-emerald" />
                  <span>Inspect Credentials</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkers.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-brand-border space-y-3">
            <Users className="w-10 h-10 text-brand-secondary mx-auto opacity-40" />
            <h3 className="font-display font-bold text-lg text-brand-primary">
              No Workers Found
            </h3>
            <p className="text-xs text-brand-secondary max-w-sm mx-auto">
              No workers match your active search or availability filter.
            </p>
          </div>
        )}

        {/* Worker Credentials Modal */}
        <AnimatePresence>
          {selectedWorker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedWorker(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-border z-10 space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-display font-bold text-lg text-brand-primary">
                      Authorized Worker File
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedWorker(null)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-bgSecondary border border-brand-border">
                    <img
                      src={selectedWorker.avatar}
                      alt={selectedWorker.name}
                      className="w-14 h-14 rounded-xl object-cover border border-brand-border"
                    />
                    <div>
                      <h4 className="font-bold text-base text-brand-primary">
                        {selectedWorker.name}
                      </h4>
                      <p className="text-xs text-brand-secondary">{selectedWorker.role}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
                        <span>{selectedWorker.id}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">{selectedWorker.badgeLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-brand-bgSecondary/40 border border-brand-border">
                      <span className="text-brand-secondary block">Experience:</span>
                      <strong className="text-brand-primary">{selectedWorker.experienceYears} Years</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-brand-bgSecondary/40 border border-brand-border">
                      <span className="text-brand-secondary block">Active Commitments:</span>
                      <strong className="text-brand-primary">{selectedWorker.activeJobsCount} Active Sites</strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs space-y-1">
                    <h5 className="font-bold">Supervisory Safety Assessment:</h5>
                    <p className="text-[11px] leading-relaxed">
                      All practical field safety tests and background clearances have been ratified by Unit #14 council. Authorized for high-voltage and independent structural execution.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedWorker(null)}
                    className="px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-secondary hover:bg-black/5"
                  >
                    Close File
                  </button>
                  <a
                    href={`/supervisor/assignments?workerId=${selectedWorker.id}`}
                    className="px-4 py-2.5 rounded-xl bg-brand-emerald text-white text-xs font-semibold hover:bg-brand-emerald/90 flex items-center gap-1.5"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Assign to Project</span>
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </SupervisorLayout>
  );
}
