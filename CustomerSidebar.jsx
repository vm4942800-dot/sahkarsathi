import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Grid, 
  Calendar, 
  Clock, 
  History, 
  Users, 
  LifeBuoy, 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  PlusCircle,
  ShieldCheck,
  MessageSquare,
  Bell,
  X,
  QrCode,
  Search,
  Star
} from 'lucide-react';
import Logo from '../common/Logo';
import { mockCustomer } from '../../data/customerMockData';

export default function CustomerSidebar({ onCloseMobile }) {
  const navigate = useNavigate();

  const primaryNavItems = [
    { label: 'Dashboard', to: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'Browse Services', to: '/customer/services', icon: Grid },
    { label: 'Find Artisans', to: '/customer/workers', icon: Search },
    { label: 'My Bookings', to: '/customer/bookings', icon: Calendar, end: true },
    { label: 'Active Bookings', to: '/customer/bookings/active', icon: Clock },
    { label: 'Booking History', to: '/customer/bookings/history', icon: History },
    { label: 'Payments & UPI', to: '/customer/payments', icon: QrCode },
    { label: 'My Reviews', to: '/customer/reviews', icon: Star },
    { label: 'Saved Workers', to: '/customer/saved-workers', icon: Users },
    { label: 'Messages', to: '/customer/messages', icon: MessageSquare },
  ];

  const utilityNavItems = [
    { label: 'Notifications', to: '/customer/notifications', icon: Bell },
    { label: 'Support & FAQs', to: '/customer/support', icon: LifeBuoy },
    { label: 'Customer Profile', to: '/customer/profile', icon: User },
    { label: 'Settings', to: '/customer/settings', icon: Settings },
  ];

  const handleSignOut = () => {
    navigate('/login');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-72 h-full flex flex-col justify-between bg-white border-r border-brand-border py-6 px-4 select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between px-2 mb-6">
          <Logo size="md" />
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl text-brand-secondary hover:bg-brand-surface"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Action: Book Service */}
        <div className="px-1 mb-6">
          <button
            type="button"
            onClick={() => {
              navigate('/customer/book');
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-teal text-white text-xs font-bold shadow-sm hover:bg-brand-teal-light active:scale-[0.99] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book a New Service</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6">
          {/* Main Services Navigation */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary/70 px-3 mb-2 block">
              Cooperative Services
            </span>
            <nav className="space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-brand-teal/10 text-brand-teal font-bold'
                          : 'text-brand-primary/80 hover:bg-brand-surface hover:text-brand-primary'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-brand-teal' : 'text-brand-secondary'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && (
                          <motion.div
                            layoutId="active-nav-dot"
                            className="w-1.5 h-1.5 rounded-full bg-brand-teal"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Account & Help */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary/70 px-3 mb-2 block">
              Account & Help
            </span>
            <nav className="space-y-1">
              {utilityNavItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-brand-teal/10 text-brand-teal font-bold'
                          : 'text-brand-primary/80 hover:bg-brand-surface hover:text-brand-primary'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-brand-teal' : 'text-brand-secondary'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Profile & Sign Out Bar */}
      <div className="pt-4 border-t border-brand-border space-y-3">
        {/* User Card */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-brand-surface border border-brand-border/60">
          <div className="w-9 h-9 rounded-xl bg-brand-teal text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            PS
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-brand-primary truncate block leading-tight">
              {mockCustomer.fullName}
            </span>
            <span className="text-[10px] text-brand-secondary truncate block font-mono">
              {mockCustomer.memberCode}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-brand-secondary" />
            <span>Sign Out</span>
          </div>
          <span className="text-[10px] text-brand-secondary/60">Session</span>
        </button>
      </div>
    </aside>
  );
}
