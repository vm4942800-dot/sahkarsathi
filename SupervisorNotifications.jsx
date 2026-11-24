import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  ExternalLink, 
  Wrench, 
  ShieldCheck, 
  Coins, 
  AlertCircle,
  Inbox,
  HardHat
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import Button from '../../components/common/Button';
import { useNotifications } from '../../context/NotificationContext';

export default function SupervisorNotifications() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'booking_review':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'verification_review':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'task_status':
        return <HardHat className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-brand-teal" />;
    }
  };

  return (
    <SupervisorLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-brand-primary">
              Supervisor Action Alerts
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary mt-1">
              Live updates on bookings requiring review, technician assignments, field milestones, and artisan verifications.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="self-start sm:self-auto flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-brand-teal" />
              <span>Mark All as Read</span>
            </Button>
          )}
        </div>

        {/* Notifications Card List */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-sm divide-y divide-brand-border overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-brand-surface flex items-center justify-center mx-auto mb-3 text-brand-secondary">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-base text-brand-primary">
                Queue Clear
              </h3>
              <p className="text-xs text-brand-secondary mt-1 max-w-sm mx-auto">
                No pending alerts. Any incoming bookings or worker verification tasks will appear here in real time.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors hover:bg-brand-surface/40 ${
                  !notif.is_read ? 'bg-brand-teal/5' : ''
                }`}
              >
                <div className="p-2.5 rounded-xl bg-white border border-brand-border shadow-xs shrink-0">
                  {getIcon(notif.notification_type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h3 className={`text-sm ${!notif.is_read ? 'font-bold text-brand-primary' : 'font-medium text-brand-secondary'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[11px] text-brand-secondary/80 font-mono">
                      {new Date(notif.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  <p className="text-xs text-brand-secondary leading-relaxed">
                    {notif.description}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    {notif.action_url && (
                      <button
                        type="button"
                        onClick={() => {
                          markAsRead(notif.id);
                          navigate(notif.action_url);
                        }}
                        className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1"
                      >
                        <span>Take Action</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!notif.is_read && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notif.id)}
                        className="text-xs text-brand-secondary hover:text-brand-primary font-medium"
                      >
                        Mark as read
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteNotification(notif.id)}
                      className="text-xs text-brand-secondary/60 hover:text-rose-600 transition-colors ml-auto flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SupervisorLayout>
  );
}
