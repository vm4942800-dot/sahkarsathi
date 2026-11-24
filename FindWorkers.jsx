import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Briefcase,
  Star,
  X,
  Send,
  AlertCircle
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import {
  mockSupervisedWorkers,
  mockProjects
} from '../../data/supervisorMockData';

export default function FindWorkers() {
  const [workers, setWorkers] = useState(mockSupervisedWorkers);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0]?.id || '');
  const [roleDescription, setRoleDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const categories = [
    'All',
    'Electrical Services',
    'Plumbing & Hydraulics',
    'Carpentry & Woodwork',
    'Masonry & Waterproofing',
    'HVAC & Air Treatment',
  ];

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      categoryFilter === 'All' || w.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSendInvitation = (e) => {
    e.preventDefault();
    if (!selectedWorker) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setFeedback({
        type: 'success',
        title: 'Project Invitation Dispatched',
        message: `Invitation to join ${selectedProjectId} sent to ${selectedWorker.name}. The worker must review and accept via their terminal.`,
      });
      setSelectedWorker(null);
      setRoleDescription('');
      setTimeout(() => setFeedback(null), 5000);
    }, 650);
  };

  return (
    <SupervisorLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Cooperative Craftsman Discovery & Project Enlistment"
          message="Supervisors can scout verified artisans across East Bengaluru. Project invitations dispatched here require worker mutual confirmation prior to formal milestone assignment."
        />

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-start gap-3 text-xs sm:text-sm font-medium shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">{feedback.title}</h4>
                <p className="mt-0.5 text-xs opacity-90">{feedback.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="teal" size="sm">
                Craftsman Network
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                East Bengaluru Regional Pool
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Find & Enlist Workers
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Search by specialized competencies such as solar inverters, high-pressure piping, and structural waterproofing.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-secondary" />
            <input
              type="text"
              placeholder="Search skill, equipment, or trade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-emerald text-xs text-brand-primary outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-brand-border text-xs text-brand-primary bg-white outline-none focus:ring-2 focus:ring-brand-emerald"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Workers List */}
        <div className="space-y-4">
          {filteredWorkers.map((w) => (
            <motion.div
              key={w.id}
              layout
              className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border hover:border-brand-emerald/40 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={w.avatar}
                  alt={w.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-brand-border flex-shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-base text-brand-primary">
                      {w.name}
                    </h3>
                    <span className="text-xs font-mono text-brand-secondary bg-brand-bgSecondary px-2 py-0.5 rounded border border-brand-border">
                      {w.id}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ {w.badgeLevel}
                    </span>
                  </div>

                  <p className="text-xs text-brand-secondary font-medium">
                    {w.role} • {w.experienceYears} Years Field Experience
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-secondary pt-1">
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-brand-emerald" />
                      {w.generalArea}
                    </span>
                    <span className="text-brand-gold font-medium text-[11px]">
                      ★ {w.rating} Quality Score
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {w.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-brand-bgSecondary text-brand-primary border border-brand-border"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center sm:flex-col items-end gap-2 flex-shrink-0 self-stretch sm:self-auto justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedWorker(w)}
                  className="px-4 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emerald/90 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request for Project</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enlistment Modal */}
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
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-border z-10 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-brand-emerald" />
                    <h3 className="font-display font-bold text-lg text-brand-primary">
                      Enlist Worker on Project
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

                <form onSubmit={handleSendInvitation} className="space-y-4 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-brand-bgSecondary border border-brand-border flex items-center gap-3">
                    <img
                      src={selectedWorker.avatar}
                      alt={selectedWorker.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <strong className="text-brand-primary">{selectedWorker.name}</strong>
                      <p className="text-xs text-brand-secondary">{selectedWorker.role}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Target Project *
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-xs outline-none focus:ring-2 focus:ring-brand-emerald"
                      required
                    >
                      {mockProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.id} — {p.projectName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Assigned Scope & Trade Responsibility *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Lead phase 2 distribution box rewiring, thermal imaging inspection, and earth pit testing..."
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs outline-none focus:ring-2 focus:ring-brand-emerald resize-none"
                      required
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                    Cooperative Notice: The worker receives an invitation card on their terminal and must accept before assignments take effect.
                  </div>

                  <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedWorker(null)}
                      disabled={sending}
                      className="px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-secondary hover:bg-black/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="px-5 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emerald/90 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                    >
                      {sending ? 'Dispatching Invitation...' : 'Dispatch Project Invitation'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </SupervisorLayout>
  );
}
