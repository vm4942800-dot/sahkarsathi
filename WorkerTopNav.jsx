import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  ShieldCheck,
  CheckCircle,
  IndianRupee,
  User,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import NotificationCenter from '../notifications/NotificationCenter';
import { mockWorker } from '../../data/workerMockData';

export default function WorkerTopNav({ onMenuClick }) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-[#F4F3EF]/90 backdrop-blur-md border-b border-brand-border h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-brand-primary hover:bg-black/5 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Artisan</span>
          </span>
          <span className="text-xs text-brand-secondary font-mono">
            {mockWorker.cooperativeUnit}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Earnings / Escrow Pill */}
        <NavLink
          to="/worker/earnings"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-brand-border hover:border-brand-teal/50 shadow-sm transition-all"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
            ₹
          </div>
          <div className="text-left">
            <p className="text-[10px] text-brand-secondary leading-tight">Escrow Balance</p>
            <p className="text-xs font-bold text-brand-primary font-mono leading-tight">₹2,400 in holding</p>
          </div>
        </NavLink>

        {/* Messages Shortcut */}
        <Link
          to="/worker/messages"
          className="p-2 rounded-xl bg-white border border-brand-border hover:bg-black/5 text-brand-primary transition-colors shadow-sm"
          aria-label="Direct Messages"
          title="Customer & Supervisor Messages"
        >
          <MessageSquare className="w-4 h-4" />
        </Link>

        {/* Real-Time Notification Center */}
        <NotificationCenter role="worker" />

        {/* Worker Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-white border border-brand-border hover:bg-black/5 transition-all shadow-sm"
          >
            <img
              src={mockWorker.avatar}
              alt={mockWorker.name}
              className="w-7 h-7 rounded-lg object-cover border border-brand-border"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-brand-primary leading-tight">
                {mockWorker.name.split(' ')[0]} {mockWorker.name.split(' ')[1]?.[0]}.
              </p>
              <p className="text-[10px] text-brand-secondary font-mono leading-tight">
                {mockWorker.id}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-brand-secondary" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-brand-border p-1.5 z-50 text-xs"
              >
                <div className="p-2.5 border-b border-brand-border mb-1">
                  <p className="font-semibold text-brand-primary truncate">{mockWorker.name}</p>
                  <p className="text-[11px] text-brand-secondary truncate">{mockWorker.role}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>NABL Grade-A Wireman</span>
                  </div>
                </div>

                <NavLink
                  to="/worker/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-brand-primary hover:bg-brand-bgSecondary transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>My Profile</span>
                </NavLink>

                <NavLink
                  to="/worker/id-card"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-brand-primary hover:bg-brand-bgSecondary transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>Digital Worker ID</span>
                </NavLink>

                <NavLink
                  to="/worker/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-brand-primary hover:bg-brand-bgSecondary transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>Account Settings</span>
                </NavLink>

                <div className="my-1 border-t border-brand-border" />

                <button
                  onClick={() => navigate('/login?role=worker')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
