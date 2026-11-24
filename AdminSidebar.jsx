import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldCheck,
  HardHat,
  Grid,
  Calendar,
  FolderKanban,
  IndianRupee,
  HelpCircle,
  Settings,
  FileSpreadsheet,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Star,
  X
} from 'lucide-react';
import { mockAdminUser } from '../../data/adminMockData';

const navItems = [
  { path: '/admin/dashboard', label: 'Executive Overview', icon: LayoutDashboard },
  { path: '/admin/users', label: 'User Directory', icon: Users },
  { path: '/admin/workers', label: 'Worker Roster', icon: Briefcase },
  { path: '/admin/verifications', label: 'Verification Center', icon: ShieldCheck, badge: '2 Pending' },
  { path: '/admin/supervisors', label: 'Supervisor Oversight', icon: HardHat },
  { path: '/admin/services', label: 'Service Catalog', icon: Grid },
  { path: '/admin/bookings', label: 'Booking Oversight', icon: Calendar },
  { path: '/admin/projects', label: 'Project Portfolio', icon: FolderKanban },
  { path: '/admin/payments', label: 'Payment & UPI Audits', icon: IndianRupee },
  { path: '/admin/reviews', label: 'Review Moderation', icon: Star },
  { path: '/admin/support', label: 'Support & Grievances', icon: HelpCircle, badgeCount: 2 },
  { path: '/admin/settings', label: 'Platform Bylaws & Settings', icon: Settings },
  { path: '/admin/audit-logs', label: 'Immutable Audit Logs', icon: FileSpreadsheet },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/login?role=admin');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#182020] text-brand-surface border-r border-[#263333] select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#263333] flex items-center justify-between">
        <NavLink to="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-emerald to-brand-teal flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-base text-white tracking-tight">
                SahkarSathi
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              Central Executive Oversight
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

      {/* Admin User Card */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-[#202B2B] border border-[#2d3a3a] flex items-center gap-3">
        <img
          src={mockAdminUser.avatar}
          alt={mockAdminUser.fullName}
          className="w-9 h-9 rounded-xl object-cover border border-emerald-500/30"
        />
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold text-white block truncate">
            {mockAdminUser.fullName}
          </span>
          <span className="text-[10px] text-emerald-400 block truncate">
            {mockAdminUser.roleTitle}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-emerald/25 to-brand-teal/20 text-white font-semibold border-l-3 border-brand-emerald shadow-xs'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}
              {item.badgeCount && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {item.badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-[#263333] space-y-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Session</span>
        </button>

        <p className="text-[10px] text-gray-500 text-center font-mono">
          SahkarSathi v1.1.0 • Admin Terminal
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
