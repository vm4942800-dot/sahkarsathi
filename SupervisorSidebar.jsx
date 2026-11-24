import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  Users,
  UserPlus,
  ClipboardCheck,
  FolderKanban,
  BarChart3,
  Inbox,
  IndianRupee,
  FileSpreadsheet,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  HardHat,
  MessageSquare,
  Bell,
  X
} from 'lucide-react';
import { mockSupervisor } from '../../data/supervisorMockData';

const navItems = [
  { path: '/supervisor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/supervisor/profile', label: 'My Profile', icon: User },
  { path: '/supervisor/workers', label: 'Worker Management', icon: Users, badge: `${mockSupervisor.managedWorkersCount}` },
  { path: '/supervisor/find-workers', label: 'Find Workers', icon: UserPlus },
  { path: '/supervisor/assignments', label: 'Job Assignments', icon: ClipboardCheck, badge: `${mockSupervisor.activeAssignmentsCount}` },
  { path: '/supervisor/projects', label: 'Projects', icon: FolderKanban, badge: `${mockSupervisor.ongoingProjectsCount}` },
  { path: '/supervisor/progress', label: 'Project Progress', icon: BarChart3 },
  { path: '/supervisor/requests', label: 'Customer Requests', icon: Inbox, badgeCount: 2 },
  { path: '/supervisor/messages', label: 'Messages', icon: MessageSquare },
  { path: '/supervisor/notifications', label: 'Notifications', icon: Bell },
  { path: '/supervisor/payments', label: 'Payment Records', icon: IndianRupee },
  { path: '/supervisor/reports', label: 'Reports', icon: FileSpreadsheet },
  { path: '/supervisor/support', label: 'Support', icon: HelpCircle },
  { path: '/supervisor/settings', label: 'Settings', icon: Settings },
];

export default function SupervisorSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/login?role=supervisor');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#202B2B] text-brand-surface border-r border-[#2d3a3a] select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#2d3a3a] flex items-center justify-between">
        <NavLink to="/supervisor/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-emerald to-brand-teal flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-base text-white tracking-tight">
                SahkarSathi
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30">
                Supervisor
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              Workforce & Project Ops
            </p>
          </div>
        </NavLink>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Supervisor Credentials Summary Card */}
      <div className="p-4 mx-3 my-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
        <div className="relative">
          <img
            src={mockSupervisor.avatar}
            alt={mockSupervisor.name}
            className="w-11 h-11 rounded-lg object-cover border border-white/20"
          />
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-brand-emerald border-2 border-[#202B2B]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h4 className="text-sm font-semibold text-white truncate">
              {mockSupervisor.name}
            </h4>
            <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald flex-shrink-0" />
          </div>
          <p className="text-[11px] text-gray-400 font-mono truncate">
            {mockSupervisor.id}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] text-brand-gold font-medium">
              ★ {mockSupervisor.rating}
            </span>
            <span className="text-[10px] text-gray-400">• Unit #14</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-emerald text-white shadow-sm font-semibold'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-gray-300 font-mono">
                        {item.badge}
                      </span>
                    )}
                    {item.badgeCount && (
                      <span className="w-5 h-5 rounded-full bg-brand-teal text-white text-[10px] font-bold flex items-center justify-center">
                        {item.badgeCount}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isActive ? 'opacity-100 translate-x-0.5' : 'opacity-0'
                      }`}
                    />
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Quick Ops Indicator */}
      <div className="p-3 mx-3 mb-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span>Cooperative Zone Safety:</span>
          <strong className="text-brand-emerald font-mono">{mockSupervisor.qualityScore}%</strong>
        </div>
        <p className="text-[10px] text-gray-400">
          6 active sites monitored in East Zone
        </p>
      </div>

      {/* Footer Sign Out */}
      <div className="p-4 border-t border-[#2d3a3a]">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Terminal</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 h-screen fixed top-0 left-0 z-30">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-[85vw] h-full z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
