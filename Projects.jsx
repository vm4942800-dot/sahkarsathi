import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  IndianRupee,
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockProjects, mockSupervisedWorkers } from '../../data/supervisorMockData';

export default function Projects() {
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    projectName: '',
    customerRef: 'Ananya Deshmukh (CUST-520)',
    generalLocation: 'Indiranagar 100ft Road',
    description: '',
    startDate: '2026-11-28',
    expectedCompletionDate: '2026-12-10',
    totalBudget: '₹35,000',
    status: 'Active',
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.projectName.trim() || !newProject.description.trim()) return;

    const created = {
      id: `PRJ-2026-00${projects.length + 1}`,
      projectName: newProject.projectName,
      description: newProject.description,
      customerRef: newProject.customerRef,
      generalLocation: newProject.generalLocation,
      startDate: newProject.startDate,
      expectedCompletionDate: newProject.expectedCompletionDate,
      status: newProject.status,
      progressPercentage: 10,
      assignedWorkers: ['Ramesh Kumar Verma (Electrician)'],
      totalBudget: newProject.totalBudget,
      escrowDisbursed: '₹0',
      tasks: [
        { id: `TSK-${Date.now().toString().slice(-3)}`, name: 'Site Preparation & Safety Audit', worker: 'Ramesh Kumar Verma', dueDate: newProject.startDate, status: 'In Progress', progress: 30 },
      ],
    };

    setProjects([created, ...projects]);
    setShowCreateModal(false);
    setFeedback({
      type: 'success',
      title: 'New Cooperative Project Created',
      message: `Project ${created.id} initialized. Escrow vault agreement generated for ${created.customerRef}.`,
    });
    setTimeout(() => setFeedback(null), 5000);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerRef.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <SupervisorLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Multi-Trade Residential Projects Portfolio"
          message="Supervisors coordinate multi-day home overhauls involving multiple trade disciplines (electrical, plumbing, masonry, carpentry). Payments are locked in cooperative escrow."
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
                Project Portfolio: {projects.length} Total
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                {projects.filter((p) => p.status === 'Active').length} Active in Field
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Project Management
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Oversee multi-artisan home upgrades, track milestones, and ensure zero-compromise building code compliance.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-emerald text-white hover:bg-brand-emerald/90 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all self-stretch sm:self-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-secondary" />
            <input
              type="text"
              placeholder="Search projects by ID, title, or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-emerald text-xs text-brand-primary outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-brand-border text-xs text-brand-primary bg-white outline-none focus:ring-2 focus:ring-brand-emerald"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Planning">Planning</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Projects Cards List */}
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-border hover:border-brand-emerald/50 transition-all shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-brand-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-brand-primary bg-brand-bgSecondary px-2.5 py-0.5 rounded border border-brand-border">
                      {project.id}
                    </span>
                    <Badge
                      variant={
                        project.status === 'Completed'
                          ? 'emerald'
                          : project.status === 'Active'
                          ? 'teal'
                          : 'gold'
                      }
                      size="sm"
                    >
                      {project.status}
                    </Badge>
                    <span className="text-xs text-brand-secondary font-mono">
                      Location: {project.generalLocation}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-brand-primary pt-1">
                    {project.projectName}
                  </h3>
                  <p className="text-xs text-brand-secondary">
                    Customer: <strong className="text-brand-primary">{project.customerRef}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <span className="text-xs text-brand-secondary block">Total Escrow Budget:</span>
                  <span className="font-display font-bold text-xl text-emerald-700">
                    {project.totalBudget}
                  </span>
                  <span className="text-[10px] text-brand-secondary font-mono block">
                    Disbursed: {project.escrowDisbursed}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed">
                {project.description}
              </p>

              {/* Progress Slider */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-brand-secondary">
                  <span>Overall Milestone Completion</span>
                  <span className="font-bold text-brand-primary font-mono">{project.progressPercentage}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-brand-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-emerald transition-all duration-500"
                    style={{ width: `${project.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Footer Meta & Inspect Link */}
              <div className="pt-3 border-t border-brand-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs text-brand-secondary">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-emerald" />
                    <span>Target: {project.expectedCompletionDate}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{project.assignedWorkers.length} Artisans Assigned</span>
                  </span>
                </div>

                <NavLink
                  to={`/supervisor/projects/${project.id}`}
                  className="px-4 py-2 rounded-xl bg-brand-bgSecondary hover:bg-brand-border text-brand-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Project Tasks & Milestones</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </NavLink>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Project Modal */}
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
                    <FolderKanban className="w-5 h-5 text-brand-emerald" />
                    <h3 className="font-display font-bold text-lg text-brand-primary">
                      Initialize Cooperative Project
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

                <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Whitefield Luxury Villa Solar & Grid Stabilization"
                      value={newProject.projectName}
                      onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs outline-none focus:ring-2 focus:ring-brand-emerald"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1">
                        Customer Reference
                      </label>
                      <input
                        type="text"
                        value={newProject.customerRef}
                        onChange={(e) => setNewProject({ ...newProject, customerRef: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-brand-border text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1">
                        Total Escrow Budget
                      </label>
                      <input
                        type="text"
                        value={newProject.totalBudget}
                        onChange={(e) => setNewProject({ ...newProject, totalBudget: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-brand-border text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      General Locality
                    </label>
                    <input
                      type="text"
                      value={newProject.generalLocation}
                      onChange={(e) => setNewProject({ ...newProject, generalLocation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Project Scope & Engineering Overview *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detailed engineering scope, trades required, and safety precautions..."
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs outline-none focus:ring-2 focus:ring-brand-emerald resize-none"
                      required
                    />
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
                      Register Project
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
