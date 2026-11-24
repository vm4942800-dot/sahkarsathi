/**
 * Centralized Real-Time Notification Context for SahkarSathi
 * Manages live Supabase subscriptions, unread badges, and user notification history.
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentLiveAlert, setRecentLiveAlert] = useState(null);

  const userId = user?.id || profile?.id;
  const userRole = profile?.role || 'customer';

  // Load user notifications
  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications(userId, userRole);
      setNotifications(data || []);
    } catch (err) {
      console.warn('Failed to load notifications:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, userRole]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Real-time Supabase subscription
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = notificationService.subscribeToNotifications(
      userId,
      // onNotificationReceived
      (newNotification) => {
        setNotifications((prev) => {
          // Avoid duplicate inserts
          if (prev.some((n) => n.id === newNotification.id)) {
            return prev;
          }
          return [newNotification, ...prev];
        });

        // Trigger subtle live banner/toast
        setRecentLiveAlert(newNotification);
        setTimeout(() => {
          setRecentLiveAlert((current) => (current?.id === newNotification.id ? null : current));
        }, 5000);
      },
      // onNotificationUpdated
      (updatedNotification) => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === updatedNotification.id ? updatedNotification : n))
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);

  // Mark single as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.warn('Failed to mark read:', err.message);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.warn('Failed to mark all read:', err.message);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err) {
      console.warn('Failed to delete notification:', err.message);
    }
  };

  // Manual dispatch helper
  const notify = async (notifData) => {
    const created = await notificationService.createNotification({
      userId: notifData.userId || userId,
      title: notifData.title,
      description: notifData.description,
      notificationType: notifData.notificationType || 'general',
      relatedId: notifData.relatedId || null,
      actionUrl: notifData.actionUrl || null,
    });
    setNotifications((prev) => [created, ...prev]);
    return created;
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        recentLiveAlert,
        dismissAlert: () => setRecentLiveAlert(null),
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        notify,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
