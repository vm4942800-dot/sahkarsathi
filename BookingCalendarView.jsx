/**
 * Universal Scheduling & Cooperative Calendar View for SahkarSathi
 * Supports Customer, Worker, and Supervisor appointment timelines and conflict alerts
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Wrench,
  User,
  HardHat,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import BookingDetailModal from './BookingDetailModal';
import Badge from '../common/Badge';

export default function BookingCalendarView({ role = 'customer', userId }) {
  const [currentDate, setCurrentDate] = useState(new Date('2026-11-26'));
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load calendar bookings
  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getBookings({ role, userId });
      setBookings(data || []);
    } catch (err) {
      console.warn('Failed to load calendar bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [role, userId]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate calendar days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const formatDayString = (day) => {
    if (!day) return null;
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const getBookingsForDay = (dayStr) => {
    if (!dayStr) return [];
    return bookings.filter((b) => b.scheduled_date === dayStr);
  };

  const handleBookingClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl border border-brand-border shadow-sm p-4 sm:p-6 space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-brand-surface text-brand-teal border border-brand-border">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-brand-primary">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-brand-secondary">
              {role === 'customer'
                ? 'Cooperative service appointments & confirmed technician slots'
                : role === 'worker'
                ? 'Daily field assignments, booked hours & availability'
                : 'Regional supervisor dispatch schedules & milestone walkthroughs'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-xl border border-brand-border hover:bg-brand-surface text-brand-primary transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date('2026-11-26'))}
            className="px-3 py-1.5 rounded-xl border border-brand-border text-xs font-semibold hover:bg-brand-surface text-brand-primary transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-xl border border-brand-border hover:bg-brand-surface text-brand-primary transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-brand-secondary">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                className="min-h-[70px] sm:min-h-[90px] rounded-2xl bg-brand-surface/20 border border-transparent p-1"
              />
            );
          }

          const dayStr = formatDayString(day);
          const dayBookings = getBookingsForDay(dayStr);
          const isToday = dayStr === '2026-11-26';

          return (
            <div
              key={dayStr}
              className={`min-h-[70px] sm:min-h-[90px] rounded-2xl border p-1.5 flex flex-col justify-between transition-colors ${
                isToday
                  ? 'border-brand-teal bg-brand-teal/5'
                  : dayBookings.length > 0
                  ? 'border-brand-border bg-white hover:border-brand-teal/50'
                  : 'border-brand-border/40 bg-brand-surface/10 hover:bg-brand-surface/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-brand-teal text-white'
                      : 'text-brand-primary'
                  }`}
                >
                  {day}
                </span>

                {dayBookings.length > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-brand-teal/10 text-brand-teal font-bold hidden sm:inline-block">
                    {dayBookings.length} {dayBookings.length === 1 ? 'Job' : 'Jobs'}
                  </span>
                )}
              </div>

              {/* Day booking pills */}
              <div className="space-y-1 mt-1 overflow-hidden">
                {dayBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => handleBookingClick(b.id)}
                    className="p-1 rounded-lg bg-brand-surface border border-brand-border hover:bg-brand-teal hover:text-white transition-all cursor-pointer text-[10px] truncate leading-tight flex items-center gap-1 group"
                    title={`${b.service_title} (${b.scheduled_time})`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal group-hover:bg-white shrink-0" />
                    <span className="truncate font-semibold">{b.service_title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Details Modal */}
      <BookingDetailModal
        bookingId={selectedBookingId}
        role={role}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookingUpdated={() => {
          loadBookings();
        }}
      />
    </div>
  );
}
