import React, { useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban,
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldCheck,
  Plus,
  X,
  User,
  AlertCircle
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockProjects, mockSupervisedWorkers } from '../../data/supervisorMockData';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Find project or fallback to first
  const initialProject = mockProjects.find((p) => p.id === projectId) || mockProjects[0];
  const [project, setProject] = useState(initialProject);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskWorker, setNewTaskWorker] = useState(mockSupervisedWorkers[0]?.name || '');
  const [newTaskDate, setNewTaskDate] = useState('29 Nov 2026');
  const [feedback, setFeedback] = useState(null);

  const handleCertifyTask = (taskId) => {
    const updatedTasks = project.tasks.map((t) =>
      t.id === taskId ? { ...t, status: 'Completed', progress: 100 } : t
    );
    const completedCount = updatedTasks.filter((t) => t.status === 'Completed').length;
    const newProgress = Math.round((completedCount / updatedTasks.length) * 100);

    setProject({
      ...project,
      tasks: updatedTasks,
      progressPercentage: newProgress,
    });

    setFeedback({
      type: 'success',
      message: `Task ${taskId} certified by Supervisor Vikramaditya Rao. Quality seal logged in escrow vault.`,
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const newTask = {
      id: `TSK-${Date.now().toString().slice(-3)}`,
      name: newTaskName,
      worker: newTaskWorker,
      dueDate: newTaskDate,
      status: 'In Progress',
      progress: 25,
    };

    setProject({
      ...project,
      tasks: [...project.tasks, newTask],
    });
    setShowAddTaskModal(false);
    setNewTaskName('');
    setFeedback({
      type: 'info',
      message: `Task ${newTask.name} assigned to ${newTask.worker}.`,
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <SupervisorLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Supervisory Engineering Audit & Task Breakdown"
          message={`Viewing verified project record for ${project.id}. Milestones certified by the supervisor authorize proportional release of funds from the customer escrow vault.`}
        />

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-3 text-xs sm:text-sm font-medium shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Link */}
        <button
          onClick={() => navigate('/supervisor/projects')}
          className="text-xs text-brand-secondary hover:text-brand-primary flex items-center gap-1.5 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Overview</span>
        </button>

        {/* Project Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-brand-border">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold text-brand-primary bg-brand-bgSecondary px-2.5 py-1 rounded border border-brand-border">
                  {project.id}
                </span>
                <Badge variant={project.status === 'Completed' ? 'emerald' : 'teal'} size="sm">
                  {project.status}
                </Badge>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
                {project.projectName}
              </h1>
              <p className="text-xs sm:text-sm text-brand-secondary mt-1">
                Customer Reference: <strong className="text-brand-primary">{project.customerRef}</strong> • Location: {project.generalLocation}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-brand-secondary block">Escrow Contract Value:</span>
              <span className="font-display font-bold text-2xl text-emerald-700">
                {project.totalBudget}
              </span>
              <span className="text-xs text-brand-secondary font-mono block">
                Disbursed: {project.escrowDisbursed}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed">
            {project.description}
          </p>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-brand-secondary">
              <span>Overall Certified Completion</span>
              <span className="font-bold text-brand-primary font-mono">{project.progressPercentage}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-brand-border overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-emerald transition-all duration-500"
                style={{ width: `${project.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Task Breakdown & Milestones */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
            <div>
              <h3 className="font-display font-bold text-lg text-brand-primary">
                Task Milestones & On-Site Audits
              </h3>
              <p className="text-xs text-brand-secondary">
                Certify artisan deliverables to trigger escrow releases
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddTaskModal(true)}
              className="px-4 py-2 rounded-xl bg-brand-emerald text-white hover:bg-brand-emerald/90 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subtask</span>
            </button>
          </div>

          <div className="space-y-3">
            {project.tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-2xl border border-brand-border bg-brand-bgSecondary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-brand-secondary bg-white px-2 py-0.5 rounded border border-brand-border">
                      {task.id}
                    </span>
                    <h4 className="font-bold text-sm text-brand-primary">{task.name}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-brand-secondary text-[11px]">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-brand-teal" />
                      {task.worker}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-secondary" />
                      Due: {task.dueDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      task.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {task.status} ({task.progress}%)
                  </span>

                  {task.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => handleCertifyTask(task.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-emerald text-white hover:bg-brand-emerald/90 font-semibold text-xs flex items-center gap-1 shadow-sm transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Certify Milestone</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Task Modal */}
        <AnimatePresence>
          {showAddTaskModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddTaskModal(false)}
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
                    Add Project Task
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddTask} className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Task Description *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Copper conduit pull & acoustic testing"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs outline-none focus:ring-2 focus:ring-brand-emerald"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Assign Worker
                    </label>
                    <select
                      value={newTaskWorker}
                      onChange={(e) => setNewTaskWorker(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs outline-none focus:ring-2 focus:ring-brand-emerald bg-white"
                    >
                      {mockSupervisedWorkers.map((w) => (
                        <option key={w.id} value={w.name}>
                          {w.name} ({w.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Due Date
                    </label>
                    <input
                      type="text"
                      value={newTaskDate}
                      onChange={(e) => setNewTaskDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs outline-none"
                    />
                  </div>

                  <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddTaskModal(false)}
                      className="px-4 py-2 rounded-xl border border-brand-border text-xs font-semibold text-brand-secondary hover:bg-black/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-brand-emerald text-white text-xs font-semibold hover:bg-brand-emerald/90 shadow-sm"
                    >
                      Save Task
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
