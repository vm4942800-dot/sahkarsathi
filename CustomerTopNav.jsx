import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Plus, 
  ShieldCheck, 
  User, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  MessageSquare,
  X 
} from 'lucide-react';
import NotificationCenter from '../notifications/NotificationCenter';
import { mockCustomer } from '../../data/customerMockData';

export default function CustomerTopNav({ onOpenMobileSidebar, title = 'Customer Dashboard' }) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-md border-b border-brand-border px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu Button & Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-brand-primary hover:bg-brand-surface border border-brand-border/60"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-display font-bold text-sm sm:text-base text-brand-primary">
            {title}
          </h1>
          <span className="text-[10px] text-brand-secondary hidden sm:inline-block">
            {mockCustomer.membershipTier}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Cooperative Escrow Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-xs font-semibold text-brand-emerald">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Escrow Protected</span>
        </div>

        {/* Quick New Booking Button */}
        <Link
          to="/customer/book"
          className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-brand-teal text-white text-xs font-bold shadow-xs hover:bg-brand-teal-light transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book Service</span>
        </Link>

        {/* Global Search Shortcut */}
        <Link
          to="/customer/workers"
          className="p-2 rounded-xl text-brand-secondary hover:text-brand-primary hover:bg-brand-surface transition-colors"
          title="Search Artisans & Services"
        >
          <Search className="w-5 h-5 text-brand-primary" />
        </Link>

        {/* Messages Shortcut */}
        <Link
          to="/customer/messages"
          className="p-2 rounded-xl text-brand-secondary hover:text-brand-primary hover:bg-brand-surface transition-colors relative"
          aria-label="View messages"
          title="Direct Project Communication"
        >
          <MessageSquare className="w-5 h-5 text-brand-primary" />
        </Link>

        {/* Real-Time Notification Center */}
        <NotificationCenter role="customer" />

        {/* Profile Avatar & Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-brand-surface transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-teal text-white flex items-center justify-center font-bold text-xs shadow-xs">
              PS
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-brand-border shadow-premium p-2 z-40 text-xs space-y-1">
              <div className="px-3 py-2 border-b border-brand-border/60">
                <span className="font-bold text-brand-primary block">{mockCustomer.fullName}</span>
                <span className="text-[10px] text-brand-secondary block font-mono">{mockCustomer.email}</span>
              </div>

              <Link
                to="/customer/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-brand-primary hover:bg-brand-surface font-medium"
              >
                <User className="w-3.5 h-3.5 text-brand-secondary" />
                <span>My Profile</span>
              </Link>

              <Link
                to="/customer/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-brand-primary hover:bg-brand-surface font-medium"
              >
                <Settings className="w-3.5 h-3.5 text-brand-secondary" />
                <span>Account Settings</span>
              </Link>

              <div className="my-1 border-t border-brand-border/60" />

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
