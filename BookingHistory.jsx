import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Star
} from 'lucide-react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { mockBookings } from '../../data/customerMockData';
import ReviewModal from '../../components/reviews/ReviewModal';

export default function BookingHistory() {
  const [filter, setFilter] = useState('all'); // 'all' | 'completed' | 'cancelled'
  const [search, setSearch] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const pastBookings = useMemo(() => {
    return mockBookings
      .filter((b) => b.status === 'completed' || b.status === 'cancelled')
      .filter((b) => {
        const matchFilter = filter === 'all' || b.status === filter;
        const matchSearch =
          b.taskTitle.toLowerCase().includes(search.toLowerCase()) ||
          b.id.toLowerCase().includes(search.toLowerCase()) ||
          b.serviceName.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
      });
  }, [filter, search]);

  return (
    <CustomerLayout title="Booking History">
      <div className="space-y-6">
        {/* Header & Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-brand-primary">
              Completed & Past Services
            </h2>
            <p className="text-xs text-brand-secondary">
              Review your cooperative invoices, completed craft sign-offs, and service records.
            </p>
          </div>

          <Link
            to="/customer/bookings/active"
            className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1"
          >
            <span>View Active Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-brand-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-subtle">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID (BK-...), trade, or task title..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-brand-surface border border-brand-border text-xs text-brand-primary placeholder:text-brand-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-brand-surface border border-brand-border/60">
            {[
              { id: 'all', label: 'All Records' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? 'bg-white text-brand-primary shadow-xs'
                    : 'text-brand-secondary hover:text-brand-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Records List / Empty State */}
        {pastBookings.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-brand-border space-y-3">
            <History className="w-10 h-10 text-brand-secondary mx-auto opacity-40" />
            <h3 className="font-display font-bold text-lg text-brand-primary">
              No matching records found
            </h3>
            <p className="text-xs text-brand-secondary max-w-sm mx-auto">
              No historical services match your active filter. Try resetting search parameters.
            </p>
            <Button
              onClick={() => { setFilter('all'); setSearch(''); }}
              variant="outline"
              size="sm"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {pastBookings.map((b) => (
              <div
                key={b.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-brand-border shadow-subtle hover:shadow-premium transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-secondary">
                      {b.id}
                    </span>
                    {b.status === 'completed' ? (
                      <Badge variant="emerald" size="sm" icon={CheckCircle2}>
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="neutral" size="sm" icon={XCircle}>
                        Cancelled
                      </Badge>
                    )}
                    <span className="text-xs text-brand-secondary">•</span>
                    <span className="text-xs font-semibold text-brand-primary">{b.serviceName}</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-brand-primary">
                    {b.taskTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-brand-secondary pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                      <span>{b.scheduledDate}</span>
                    </span>
                    {b.worker && (
                      <span>Worker: <strong className="text-brand-primary">{b.worker.name}</strong></span>
                    )}
                    <span className="text-brand-teal font-medium">{b.paymentStatus}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-brand-border/60">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-brand-secondary block uppercase tracking-wider">Amount</span>
                    <span className="text-sm font-bold text-brand-primary">₹{b.estimatedCost.toLocaleString()}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Itemized Invoice for ${b.id}\nService: ${b.taskTitle}\nStatus: ${b.paymentStatus}\nAmount: ₹${b.estimatedCost}\n\nCooperative guarantee audit passed.`)}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-surface border border-brand-border text-xs font-semibold text-brand-primary hover:bg-white flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-secondary" />
                    <span>Invoice</span>
                  </button>

                  {b.status === 'completed' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBookingForReview({
                          id: b.id,
                          worker_id: b.worker?.id || 'wrk-001',
                          worker_name: b.worker?.name || 'Assigned Artisan',
                          taskTitle: b.taskTitle
                        });
                        setReviewModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-[#182020] flex items-center gap-1.5 shadow-2xs"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>Review Artisan</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        booking={selectedBookingForReview}
        customerId="usr-cust-demo"
        customerName="Ananya Sharma"
      />
    </CustomerLayout>
  );
}
