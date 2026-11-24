import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  FolderKanban,
  ArrowRight
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockProjects } from '../../data/supervisorMockData';

export default function ProjectProgress() {
  const [projectsList, setProjectsList] = useState(mockProjects);
  const [feedback, setFeedback] = useState(null);

  const handleUpdateTaskProgress = (projId, taskId, newProg) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id === projId) {
          const updatedTasks = p.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  progress: newProg,
                  status: newProg === 100 ? 'Completed' : 'In Progress',
                }
              : t
          );
          const totalTasks = updatedTasks.length;
          const avgProgress = Math.round(
            updatedTasks.reduce((acc, curr) => acc + curr.progress, 0) / totalTasks
          );
          return {
            ...p,
            tasks: updatedTasks,
            progressPercentage: avgProgress,
            status: avgProgress === 100 ? 'Completed' : p.status,
          };
        }
        return p;
      })
    );

    setFeedback({
      type: 'success',
      message: `Task ${taskId} progress updated to ${newProg}%. Recalculated project progress.`,
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <SupervisorLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Field Task Progression & Supervisory Milestone Sign-Offs"
          message="Progress sliders and milestone certifications directly authorize stage-based escrow disbursements to workers. Only authorized supervisors can certify completed milestones."
        />

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-3 text-xs sm:text-sm font-medium shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Active Projects Monitored: {projectsList.length}
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                East Zone Quality Assurance
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Project Progress & Task Timelines
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Track subtask velocity, verify artisan completions, and adjust on-site progress sliders in real-time.
            </p>
          </div>
        </div>

        {/* Projects Timeline & Sliders */}
        <div className="space-y-6">
          {projectsList.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-brand-primary bg-brand-bgSecondary px-2 py-0.5 rounded border border-brand-border">
                      {project.id}
                    </span>
                    <Badge variant={project.status === 'Completed' ? 'emerald' : 'teal'} size="sm">
                      {project.status}
                    </Badge>
                  </div>
                  <h3 className="font-display font-bold text-lg text-brand-primary">
                    {project.projectName}
                  </h3>
                  <p className="text-xs text-brand-secondary">
                    Customer: {project.customerRef} • Target Date: {project.expectedCompletionDate}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-brand-secondary block">Overall Certified:</span>
                  <span className="font-display font-bold text-2xl text-brand-emerald">
                    {project.progressPercentage}%
                  </span>
                </div>
              </div>

              {/* Master Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-3 rounded-full bg-brand-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-emerald transition-all duration-500"
                    style={{ width: `${project.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Task Cards & Progress Sliders */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                  Subtask Milestones & Field Verification ({project.tasks.length} Tasks)
                </h4>

                <div className="space-y-2.5">
                  {project.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl bg-brand-bgSecondary/30 border border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1 min-w-[240px]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-brand-secondary bg-white px-2 py-0.5 rounded border border-brand-border">
                            {task.id}
                          </span>
                          <strong className="text-brand-primary text-xs sm:text-sm">{task.name}</strong>
                        </div>
                        <div className="flex items-center gap-3 text-brand-secondary text-[11px]">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-brand-teal" />
                            {task.worker}
                          </span>
                          <span>•</span>
                          <span>Due: {task.dueDate}</span>
                        </div>
                      </div>

                      {/* Interactive Progress Slider */}
                      <div className="flex-1 flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={task.progress}
                          onChange={(e) =>
                            handleUpdateTaskProgress(
                              project.id,
                              task.id,
                              Number(e.target.value)
                            )
                          }
                          className="w-full accent-brand-emerald cursor-pointer"
                        />
                        <span className="font-mono font-bold text-xs text-brand-primary w-12 text-right">
                          {task.progress}%
                        </span>
                      </div>

                      <div className="flex-shrink-0">
                        {task.progress === 100 ? (
                          <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Certified</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateTaskProgress(project.id, task.id, 100)
                            }
                            className="px-3 py-1 rounded-lg bg-brand-emerald/10 hover:bg-brand-emerald text-brand-emerald hover:text-white border border-brand-emerald/30 text-xs font-semibold transition-all"
                          >
                            Mark 100% Certified
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SupervisorLayout>
  );
}
