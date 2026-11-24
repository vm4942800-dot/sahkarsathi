import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  X,
  ArrowRight,
  Briefcase,
  LayoutGrid
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import {
  mockAssignments,
  mockProjects,
  mockSupervisedWorkers
} from '../../data/supervisorMockData';
import BookingCalendarView from '../../components/bookings/BookingCalendarView';

export default function JobAssignments() {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'calendar'

  // New Assignment Form State
  const [newAssignment, setNewAssignment] = useState({
    service: '',
    projectId: mockProjects[0]?.id || '',
    workerId: mockSupervisedWorkers[0]?.id || '',
    customerRef: 'CUST-409 (Priya Sharma)',
    generalLocation: 'Indiranagar 100ft Road',
    scheduledDate: '28 Nov 2026',
    scheduledTime: '10:00 AM',
    laborPay: '₹2,200',
  });

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newAssignment.service.trim()) return;

    const workerObj = mockSupervisedWorkers.find((w) => w.id === newAssignment.workerId);
    const projectObj = mockProjects.find((p) => p.id === newAssignment.projectId);

    const created = {
      id: `ASN-2026-${Date.now().toString().slice(-3)}`,
      service: newAssignment.service,
      projectId: newAssignment.projectId,
      projectName: projectObj?.projectName || 'Direct Field Service',
      workerId: newAssignment.workerId,
      workerName: workerObj?.name || 'Assigned Artisan',
      workerRole: workerObj?.role || 'Craftsman',
      customerRef: newAssignment.customerRef,
      generalLocation: newAssignment.generalLocation,
      scheduledDate: newAssignment.scheduledDate,
      scheduledTime: newAssignment.scheduledTime,
      status: 'Assigned',
      milestone: 'Awaiting Worker Acceptance',
      laborPay: newAssignment.laborPay,
      escrowStatus: 'Locked in Vault',
    };

    setAssignments([created, ...assignments]);
    setShowCreateModal(false);
    setNewAssignment({
      service: '',
      projectId: mockProjects[0]?.id || '',
      workerId: mockSupervisedWorkers[0]?.id || '',
      customerRef: 'CUST-409 (Priya Sharma)',
      generalLocation: 'Indiranagar 100ft Road',
      scheduledDate: '28 Nov 2026',
      scheduledTime: '10:00 AM',
      laborPay: '₹2,200',
    });

    setFeedback({
      type: 'success',
      title: 'Assignment Created & Dispatched',
      message: `Assignment ${created.id} dispatched to ${created.workerName}. Worker notification delivered.`,
    });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    setSelectedAssignment(null);
    setFeedback({
      type: 'info',
      title: 'Assignment Status Ratified',
      message: `Assignment ${id} updated to status "${newStatus}".`,
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredAssignments = assignments.filter((a) => {
    return (
      a.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.generalLocation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <SupervisorLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Supervisory Job Assignment & Task Dispatch Matrix"
          message="Assign registered workers to project milestones. Assignments are verified against cooperative conflict-of-interest and maximum continuous work-hour safety rules."
        />

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              className={`p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm font-medium border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-brand-bgSecondary text-brand-primary border-brand-border'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">{feedback.title}</h4>
                <p className="mt-0.5 text-xs opacity-90">{feedback.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Active Assignments: {assignments.length}
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                East Bangalore Jurisdiction
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Job Assignment Coordination
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Direct and monitor field execution. Every assignment is backed by customer escrow deposits before work begins.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {/* View Toggle */}
            <div className="bg-brand-surface p-1 rounded-xl border border-brand-border flex items-center text-xs">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-brand-primary shadow-xs'
                    : 'text-brand-secondary hover:text-brand-primary'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-white text-brand-primary shadow-xs'
                    : 'text-brand-secondary hover:text-brand-primary'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendar Matrix</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 rounded-xl bg-brand-emerald text-white hover:bg-brand-emerald/90 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <BookingCalendarView role="supervisor" userId="sup-104" />
        ) : (
          <>
            {/* Search */}
        <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-secondary" />
            <input
              type="text"
              placeholder="Search by assignment ID, service task, worker name, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-emerald text-xs text-brand-primary outline-none"
            />
          </div>
        </div>

        {/* Assignments Table / Cards */}
        <div className="space-y-4">
          {filteredAssignments.map((asn) => (
            <motion.div
              key={asn.id}
              layout
              className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border hover:border-brand-emerald/40 transition-all shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-brand-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-semibold text-brand-primary bg-brand-bgSecondary px-2.5 py-0.5 rounded border border-brand-border">
                      {asn.id}
                    </span>
                    <Badge
                      variant={
                        asn.status === 'Completed'
                          ? 'emerald'
                          : asn.status === 'In Progress'
                          ? 'teal'
                          : 'gold'
                      }
                      size="sm"
                    >
                      {asn.status}
                    </Badge>
                    <span className="text-xs text-brand-secondary font-mono">
                      Project: {asn.projectId}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-brand-primary pt-1">
                    {asn.service}
                  </h3>
                  <p className="text-xs text-brand-secondary">
                    {asn.projectName}
                  </p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <span className="text-xs text-brand-secondary block">Labor Pay:</span>
                  <span className="font-display font-bold text-lg text-brand-primary text-emerald-700">
                    {asn.laborPay}
                  </span>
                  <span className="text-[10px] text-brand-secondary font-mono block">
                    {asn.escrowStatus}
                  </span>
                </div>
              </div>

              {/* Assignment Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-brand-secondary bg-brand-bgSecondary/30 p-3 rounded-xl border border-brand-border">
                <div>
                  <span className="block text-[11px] text-brand-secondary">Assigned Artisan:</span>
                  <strong className="text-brand-primary">{asn.workerName}</strong>
                  <span className="block text-[10px] font-mono">{asn.workerRole}</span>
                </div>

                <div>
                  <span className="block text-[11px] text-brand-secondary">Customer & Site:</span>
                  <strong className="text-brand-primary">{asn.customerRef}</strong>
                  <span className="block text-[10px]">{asn.generalLocation}</span>
                </div>

                <div>
                  <span className="block text-[11px] text-brand-secondary">Scheduled Slot:</span>
                  <strong className="text-brand-primary">{asn.scheduledDate}</strong>
                  <span className="block text-[10px]">{asn.scheduledTime}</span>
                </div>
              </div>

              {/* Actions & Milestone */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                <span className="text-brand-emerald font-medium flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                  <span>Milestone: {asn.milestone}</span>
                </span>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedAssignment(asn)}
                    className="px-4 py-2 rounded-xl bg-brand-bgSecondary hover:bg-brand-border text-brand-primary font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Update Status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </>
        )}

        {/* Create Assignment Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateModal(false)}
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
                    <ClipboardCheck className="w-5 h-5 text-brand-emerald" />
                    <h3 className="font-display font-bold text-lg text-brand-primary">
                      Create Project Job Assignment
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Service Task Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Master distribution box rewiring & busbar installation"
                      value={newAssignment.service}
                      onChange={(e) => setNewAssignment({ ...newAssignment, service: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs outline-none focus:ring-2 focus:ring-brand-emerald"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1">
                        Parent Project *
                      </label>
                      <select
                        value={newAssignment.projectId}
                        onChange={(e) => setNewAssignment({ ...newAssignment, projectId: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-xs outline-none focus:ring-2 focus:ring-brand-emerald bg-white"
                      >
                        {mockProjects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.id}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1">
                        Select Authorized Worker *
                      </label>
                      <select
                        value={newAssignment.workerId}
                        onChange={(e) => setNewAssignment({ ...newAssignment, workerId: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-xs outline-none focus:ring-2 focus:ring-brand-emerald bg-white"
                      >
                        {mockSupervisedWorkers.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name} ({w.role.split(' ')[0]})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1">
                        Scheduled Date *
                      </label>
                      <input
                        type="date"
                        value={newAssignment.scheduledDate}
                        onChange={(e) => setNewAssignment({ ...newAssignment, scheduledDate: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-xs outline-none focus:ring-2 focus:ring-brand-emerald bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1">
                        Labor Compensation *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹2,400"
                        value={newAssignment.laborPay}
                        onChange={(e) => setNewAssignment({ ...newAssignment, laborPay: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-xs outline-none focus:ring-2 focus:ring-brand-emerald"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-secondary hover:bg-black/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-brand-emerald text-white text-xs font-semibold hover:bg-brand-emerald/90 shadow-sm"
                    >
                      Dispatch Assignment
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Update Status Modal */}
        <AnimatePresence>
          {selectedAssignment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedAssignment(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border z-10 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <h3 className="font-display font-bold text-lg text-brand-primary">
                    Update Assignment Status
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedAssignment(null)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xs space-y-2">
                  <p className="font-bold text-brand-primary">{selectedAssignment.service}</p>
                  <p className="text-brand-secondary">Worker: {selectedAssignment.workerName}</p>
                </div>

                <div className="space-y-2 pt-2">
                  {['Assigned', 'Accepted', 'In Progress', 'Completed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedAssignment.id, st)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                        selectedAssignment.status === st
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white border-brand-border hover:bg-brand-bgSecondary text-brand-primary'
                      }`}
                    >
                      <span>Mark as {st}</span>
                      {selectedAssignment.status === st && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </SupervisorLayout>
  );
}
