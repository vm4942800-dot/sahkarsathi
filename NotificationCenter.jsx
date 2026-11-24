/**
 * Real-Time Notification Center Dropdown & Panel for SahkarSathi
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Coins,
  Wrench,
  AlertCircle,
  ExternalLink,
  Trash2,
  CheckCheck,
  Inbox
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationCenter({ role = 'customer' }) {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'worker_assigned':
      case 'supervisor_assigned':
      case 'job_assigned':
        return <Wrench className="w-4 h-4 text-brand-teal" />;
      case 'verification_updated':
      case 'verification_review':
        return <ShieldCheck className="w-4 h-4 text-brand-emerald" />;
      case 'payment_updated':
      case 'payment_review':
        return <Coins className="w-4 h-4 text-amber-600" />;
      case 'booking_review':
      case 'emergency_request':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-brand-teal" />;
    }
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Just now';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return new Date(isoString).toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.action_url) {
      setIsOpen(false);
      navigate(notification.action_url);
    }
  };

  const fullNotificationsPath = `/${role}/notifications`;

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-brand-secondary hover:text-brand-primary hover:bg-black/5 transition-all relative"
        aria-label="View notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5 text-brand-primary" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand-teal text-white text-[10px] font-bold shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-50" />
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-84 sm:w-96 rounded-2xl bg-white border border-brand-border shadow-premium z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-brand-border bg-brand-surface/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-brand-primary">
                  Notifications
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[10px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[11px] font-semibold text-brand-teal hover:text-brand-teal-light transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2 border-b border-brand-border/60 flex items-center gap-2 bg-white text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-brand-primary text-white'
                    : 'text-brand-secondary hover:text-brand-primary hover:bg-brand-surface'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-brand-teal text-white'
                    : 'text-brand-secondary hover:text-brand-primary hover:bg-brand-surface'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-brand-border/50">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center mx-auto mb-3 text-brand-secondary/70">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-brand-primary">You're all caught up!</h4>
                  <p className="text-[11px] text-brand-secondary mt-1">
                    {filter === 'unread'
                      ? 'No unread notifications at this time.'
                      : 'No cooperative notifications to display.'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 hover:bg-brand-surface/70 transition-colors cursor-pointer flex gap-3 items-start relative group ${
                      !notif.is_read ? 'bg-brand-teal/5' : ''
                    }`}
                  >
                    {/* Unread indicator line */}
                    {!notif.is_read && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-brand-teal" />
                    )}

                    {/* Icon container */}
                    <div className="p-2 rounded-xl bg-white border border-brand-border/80 shadow-2xs shrink-0 mt-0.5">
                      {getNotificationIcon(notif.notification_type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4
                          className={`text-xs truncate ${
                            !notif.is_read
                              ? 'font-bold text-brand-primary'
                              : 'font-medium text-brand-secondary'
                          }`}
                        >
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-brand-secondary/80 shrink-0 font-mono">
                          {formatTimeAgo(notif.created_at)}
                        </span>
                      </div>

                      <p className="text-[11px] text-brand-secondary line-clamp-2 leading-relaxed">
                        {notif.description}
                      </p>

                      {notif.action_url && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-brand-teal group-hover:underline">
                          <span>View Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* Quick Delete/Archive button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-brand-secondary/60 hover:text-rose-600 hover:bg-rose-50 transition-all shrink-0"
                      aria-label="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-brand-border bg-brand-surface/40 text-center">
              <Link
                to={fullNotificationsPath}
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-brand-teal hover:text-brand-teal-light transition-colors"
              >
                Open Full Notification Center &rarr;
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
