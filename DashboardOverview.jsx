import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  ClipboardCheck,
  FolderKanban,
  CheckCircle2,
  HardHat,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import {
  mockSupervisor,
  mockProjects,
  mockAssignments,
  mockCustomerRequests,
  mockSupervisedWorkers
} from '../../data/supervisorMockData';

export default function DashboardOverview() {
  const activeProjects = mockProjects.filter((p) => p.status === 'Active');

  return (
    <SupervisorLayout>
      <div className="space-y-6">
        {/* Prototype Transparency Notice */}
        <BackendNotice
          title="Supervisor Coordination & Quality Assurance Terminal (Phase 6)"
          message="This dashboard coordinates cooperative workforce dispatches, on-site safety audits, and project milestone ratifications. Metrics reflect Unit #14 field logs."
        />

        {/* Personalized Welcome Banner */}
        <div className="bg-gradient-to-r from-[#202B2B] to-[#2B3B3B] text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald/20 border border-brand-emerald/40 text-brand-emerald text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                Unit #14 Chief Field Inspector
              </span>
              <span className="text-xs text-gray-300 font-mono">
                ID: {mockSupervisor.id}
              </span>
              <span className="text-xs text-brand-gold font-medium">
                ★ {mockSupervisor.rating} Quality Audit Score
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Welcome to Your Supervisor Dashboard, {mockSupervisor.name}
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              Coordinate workers, manage projects, and help your cooperative deliver reliable services.
              Overseeing 6 active service milestones and 3 multi-trade residential infrastructure overhauls in East Bengaluru.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <NavLink
                to="/supervisor/assignments"
                className="px-4 py-2.5 rounded-xl bg-brand-emerald text-white hover:bg-brand-emerald/90 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Assignment</span>
              </NavLink>
              <NavLink
                to="/supervisor/projects"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-all"
              >
                <FolderKanban className="w-4 h-4" />
                <span>View Ongoing Projects</span>
              </NavLink>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
            <HardHat className="w-72 h-72 text-white" />
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Workers Managed */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-brand-secondary font-medium">
                Workers in Cooperative
              </span>
              <div className="w-8 h-8 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-bold text-brand-primary">
                {mockSupervisor.managedWorkersCount}
              </p>
              <NavLink
                to="/supervisor/workers"
                className="text-[11px] text-brand-teal font-medium hover:underline inline-flex items-center gap-1 mt-1"
              >
                <span>5 active on-duty</span>
                <ChevronRight className="w-3 h-3" />
              </NavLink>
            </div>
          </div>

          {/* Active Assignments */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-brand-secondary font-medium">
                Active Assignments
              </span>
              <div className="w-8 h-8 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center">
                <ClipboardCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-bold text-brand-primary">
                {mockSupervisor.activeAssignmentsCount}
              </p>
              <NavLink
                to="/supervisor/assignments"
                className="text-[11px] text-brand-emerald font-medium hover:underline inline-flex items-center gap-1 mt-1"
              >
                <span>Field tasks underway</span>
                <ChevronRight className="w-3 h-3" />
              </NavLink>
            </div>
          </div>

          {/* Ongoing Projects */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-brand-secondary font-medium">
                Ongoing Projects
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-bold text-brand-primary">
                {mockSupervisor.ongoingProjectsCount}
              </p>
              <NavLink
                to="/supervisor/projects"
                className="text-[11px] text-purple-700 font-medium hover:underline inline-flex items-center gap-1 mt-1"
              >
                <span>Multi-day infrastructure</span>
                <ChevronRight className="w-3 h-3" />
              </NavLink>
            </div>
          </div>

          {/* Completed Projects */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-brand-secondary font-medium">
                Completed & Handed Over
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-bold text-brand-primary">
                {mockSupervisor.completedProjectsCount}
              </p>
              <NavLink
                to="/supervisor/reports"
                className="text-[11px] text-brand-secondary font-medium hover:underline inline-flex items-center gap-1 mt-1"
              >
                <span>Zero homeowner disputes</span>
                <ChevronRight className="w-3 h-3" />
              </NavLink>
            </div>
          </div>
        </div>

        {/* Ongoing Projects Spotlight Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
            <div>
              <h3 className="font-display font-bold text-lg text-brand-primary">
                Active Projects Under Supervision
              </h3>
              <p className="text-xs text-brand-secondary">
                Multi-trade residential infrastructure projects requiring supervisory milestone certification
              </p>
            </div>
            <NavLink
              to="/supervisor/projects"
              className="text-xs text-brand-emerald font-semibold hover:underline flex items-center gap-1"
            >
              <span>Manage All Projects</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="p-5 rounded-2xl border border-brand-border hover:border-brand-emerald/40 transition-all bg-brand-bgSecondary/20 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono font-semibold text-brand-primary bg-white px-2 py-0.5 rounded border border-brand-border">
                      {project.id}
                    </span>
                    <Badge variant="emerald" size="sm">
                      {project.status} ({project.progressPercentage}%)
                    </Badge>
                  </div>

                  <h4 className="font-display font-bold text-base text-brand-primary mt-1">
                    {project.projectName}
                  </h4>
                  <p className="text-xs text-brand-secondary mt-1 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-brand-secondary">
                    <span>Progress to Sign-off</span>
                    <span className="font-bold text-brand-primary font-mono">{project.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-brand-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-emerald transition-all duration-500"
                      style={{ width: `${project.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-secondary">
                  <span>Customer: <strong className="text-brand-primary">{project.customerRef.split(' ')[0]}</strong></span>
                  <NavLink
                    to={`/supervisor/projects/${project.id}`}
                    className="text-brand-teal font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Tasks ({project.tasks.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dual Section: Pending Customer Requests & Field Assignments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Requests Requiring Supervisor Review */}
          <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    !
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-brand-primary">
                      Customer Requests (Pending Review)
                    </h3>
                    <p className="text-[11px] text-brand-secondary">
                      Zone dispatches requiring trade feasibility check & worker assignment
                    </p>
                  </div>
                </div>
                <NavLink
                  to="/supervisor/requests"
                  className="text-xs text-brand-teal font-semibold hover:underline"
                >
                  View All
                </NavLink>
              </div>

              <div className="space-y-3">
                {mockCustomerRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl border border-brand-border bg-brand-bgSecondary/30 hover:border-brand-teal/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-xs sm:text-sm text-brand-primary">
                        {req.category}
                      </h4>
                      <span className="text-xs font-bold text-brand-emerald bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                        {req.budgetEstimate}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-secondary mt-1 line-clamp-2">
                      {req.customerRequirement}
                    </p>
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-brand-border/60 text-[11px] text-brand-secondary">
                      <span>{req.generalLocation}</span>
                      <span className="font-mono text-brand-teal">{req.preferredSchedule}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-brand-border">
              <NavLink
                to="/supervisor/requests"
                className="w-full py-2.5 rounded-xl bg-brand-bgSecondary hover:bg-brand-border text-brand-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Process & Assign Workers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </div>

          {/* Quick Worker Roster */}
          <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-brand-primary">
                      Authorized Worker Roster
                    </h3>
                    <p className="text-[11px] text-brand-secondary">
                      Unit #14 certified tradesmen ready for dispatch
                    </p>
                  </div>
                </div>
                <NavLink
                  to="/supervisor/workers"
                  className="text-xs text-brand-teal font-semibold hover:underline"
                >
                  Full Directory
                </NavLink>
              </div>

              <div className="space-y-3">
                {mockSupervisedWorkers.slice(0, 3).map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl border border-brand-border bg-white flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={w.avatar}
                        alt={w.name}
                        className="w-9 h-9 rounded-lg object-cover border border-brand-border flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-brand-primary truncate">{w.name}</p>
                        <p className="text-[11px] text-brand-secondary truncate">{w.role}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          w.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {w.isAvailable ? 'Available' : 'On Site'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-brand-border">
              <NavLink
                to="/supervisor/find-workers"
                className="w-full py-2.5 rounded-xl bg-brand-bgSecondary hover:bg-brand-border text-brand-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Discover & Enlist Craftsmen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </SupervisorLayout>
  );
}
