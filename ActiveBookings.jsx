import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  PlusCircle, 
  ChevronRight,
  RotateCcw,
  FileText,
  LayoutGrid,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import BookingDetailModal from '../../components/bookings/BookingDetailModal';
import BookingCalendarView from '../../components/bookings/BookingCalendarView';

export default function ActiveBookings() {
  const { user } = useAuth();
  const userId = user?.id || 'usr_customer_409';

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'calendar'
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getBookings({ role: 'customer', userId });
      // Active filter: not completed or cancelled
      const active = (data || []).filter(
        (b) => !['completed', 'cancelled', 'rejected'].includes(b.status)
      );
      setBookings(active);
    } catch (err) {
      console.warn('Failed to load active customer bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  const handleOpenDetails = (id) => {
    setSelectedBookingId(id);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="warning" size="sm">In Progress</Badge>;
      case 'scheduled':
        return <Badge variant="neutral" size="sm">Scheduled</Badge>;
      case 'worker_assigned':
        return <Badge variant="secondary" size="sm">Worker Dispatched</Badge>;
      case 'reschedule_requested':
        return <Badge variant="danger" size="sm">Reschedule Pending</Badge>;
      case 'confirmed':
        return <Badge variant="success" size="sm">Confirmed</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status || 'Requested'}</Badge>;
    }
  };

  return (
    <CustomerLayout title="Active Bookings">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-brand-primary">
              Live & Scheduled Services
            </h2>
            <p className="text-xs text-brand-secondary">
              Monitor active work progress, manage appointments, and inspect verified escrow security.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-brand-surface p-1 rounded-xl border border-brand-border flex items-center text-xs">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-brand-primary shadow-xs'
                    : 'text-brand-secondary hover:text-brand-primary'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-white text-brand-primary shadow-xs'
                    : 'text-brand-secondary hover:text-brand-primary'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendar</span>
              </button>
            </div>

            <Button to="/customer/book" variant="primary" size="sm" icon={PlusCircle}>
              New Request
            </Button>
          </div>
        </div>

        {/* View Switching */}
        {viewMode === 'calendar' ? (
          <BookingCalendarView role="customer" userId={userId} />
        ) : loading ? (
          <div className="p-16 text-center text-xs text-brand-secondary">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-teal" />
            Loading active cooperative bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-brand-border space-y-3">
            <Clock className="w-10 h-10 text-brand-secondary mx-auto opacity-40" />
            <h3 className="font-display font-bold text-lg text-brand-primary">
              No active bookings found
            </h3>
            <p className="text-xs text-brand-secondary max-w-sm mx-auto">
              You currently have no services in progress. Book a verified craftsman whenever your home needs maintenance.
            </p>
            <Button to="/customer/book" variant="primary" size="md">
              Book a Service
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="rounded-3xl bg-white border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6 hover:border-brand-teal/40 transition-colors"
              >
                {/* Header & Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-brand-secondary">
                        {b.booking_code || b.id}
                      </span>
                      {getStatusBadge(b.status)}
                    </div>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-brand-primary">
                      {b.service_title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-brand-emerald bg-brand-emerald/10 px-3 py-1.5 rounded-full border border-brand-emerald/20 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>₹{(b.total_amount || 1450).toLocaleString()} (Escrow Funded)</span>
                    </span>
                  </div>
                </div>

                {/* Personnel & Site Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border text-xs space-y-1">
                    <span className="font-bold text-brand-secondary text-[10px] uppercase tracking-wider block">
                      Assigned Craftsman
                    </span>
                    <div className="font-bold text-brand-primary text-sm">
                      {b.worker?.name || (b.assigned_worker_id ? 'Assigned Wireman' : 'Pending Supervisor Dispatch')}
                    </div>
                    <span className="text-brand-teal font-mono block">
                      {b.worker?.badgeId ? `Badge: ${b.worker.badgeId}` : 'Cooperative Union Vetted'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border text-xs space-y-1">
                    <span className="font-bold text-brand-secondary text-[10px] uppercase tracking-wider block">
                      Responsible Supervisor Lead
                    </span>
                    <div className="font-bold text-brand-primary text-sm">
                      {b.supervisor?.name || 'Rajesh Mehta'}
                    </div>
                    <span className="text-brand-secondary block">
                      {b.supervisor?.role || 'Regional Lead Coordinator'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border text-xs space-y-1">
                    <span className="font-bold text-brand-secondary text-[10px] uppercase tracking-wider block">
                      Scheduled Window
                    </span>
                    <div className="font-bold text-brand-primary text-sm">
                      {b.scheduled_date}
                    </div>
                    <span className="text-brand-secondary block">
                      {b.scheduled_time}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-brand-border/60">
                  <div className="flex items-center gap-2 text-xs text-brand-secondary">
                    <MapPin className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                    <span className="truncate max-w-xs sm:max-w-md">{b.service_address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(b.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-surface border border-brand-border text-xs font-semibold text-brand-primary hover:bg-white flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-teal" />
                      <span>Timeline & Actions</span>
                    </button>

                    <Link
                      to="/customer/messages"
                      className="px-3.5 py-1.5 rounded-xl bg-brand-teal text-white text-xs font-semibold hover:bg-brand-teal-light flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        bookingId={selectedBookingId}
        role="customer"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookingUpdated={() => fetchBookings()}
      />
    </CustomerLayout>
  );
}
