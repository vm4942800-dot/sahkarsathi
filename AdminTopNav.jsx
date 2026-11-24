import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ShieldAlert,
  LogOut,
  ChevronDown,
  User,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { mockAdminUser } from '../../data/adminMockData';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

export default function AdminTopNav({ onMenuClick }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login?role=admin');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-brand-border h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between select-none">
      {/* Left Area: Mobile menu & Current Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-brand-secondary hover:text-brand-primary hover:bg-black/5 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="sm">
            Executive Terminal
          </Badge>
          <span className="hidden sm:inline-block text-xs font-mono text-brand-secondary">
            Zero-Commission Oversight
          </span>
        </div>
      </div>

      {/* Right Area: Status, Admin Profile & Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live System Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Core Services Operational</span>
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl hover:bg-black/5 border border-transparent hover:border-brand-border transition-all"
          >
            <img
              src={mockAdminUser.avatar}
              alt={mockAdminUser.fullName}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-brand-emerald/30"
            />
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-brand-primary block leading-tight">
                {mockAdminUser.fullName}
              </span>
              <span className="text-[10px] text-brand-secondary block font-mono">
                {mockAdminUser.adminCode}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-brand-secondary hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-brand-border shadow-xl p-2 z-50 text-xs space-y-1">
              <div className="p-3 border-b border-brand-border/60">
                <span className="font-bold text-brand-primary block">
                  {mockAdminUser.fullName}
                </span>
                <span className="text-[11px] text-brand-secondary block">
                  {mockAdminUser.roleTitle}
                </span>
                <span className="text-[10px] text-emerald-700 font-mono mt-1 block">
                  {mockAdminUser.department}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/admin/settings');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-brand-primary hover:bg-black/5 flex items-center justify-between"
              >
                <span>Platform Settings</span>
                <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center justify-between font-semibold"
              >
                <span>Sign Out of Admin</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
