/**
 * SahkarSathi Saved Workers & Preferred Artisans Page
 * Manages customer bookmarked craftsmen and allows one-click direct bookings
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
  Award,
  Briefcase,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  Star,
  MapPin,
  Eye,
  RefreshCw
} from 'lucide-react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import WorkerProfileModal from '../../components/discovery/WorkerProfileModal';
import { discoveryService } from '../../services/discoveryService';
import { mockCustomer } from '../../data/customerMockData';

export default function SavedWorkers() {
  const navigate = useNavigate();
  const customerId = mockCustomer.id || 'usr_customer_409';
  const [workersList, setWorkersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inspectWorker, setInspectWorker] = useState(null);

  const loadSavedWorkers = async () => {
    setLoading(true);
    try {
      const data = await discoveryService.getSavedWorkers(customerId);
      setWorkersList(data || []);
    } catch (err) {
      console.warn('Failed to load saved workers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedWorkers();
  }, [customerId]);

  const handleToggleSave = async (workerId) => {
    await discoveryService.toggleSaveWorker(customerId, workerId);
    setWorkersList((prev) => prev.filter((w) => w.id !== workerId));
  };

  return (
    <CustomerLayout title="Saved Cooperative Craftsmen">
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-brand-primary">
              Your Preferred Trade Professionals
            </h2>
            <p className="text-xs text-brand-secondary">
              Keep track of verified technicians who have worked on your residence and book them directly for future tasks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/customer/workers"
              className="px-4 py-2 rounded-xl bg-brand-emerald text-white text-xs font-bold hover:bg-brand-emeraldDark shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              <span>Discover More Artisans</span>
            </Link>
          </div>
        </div>

        {/* Worker Cards / Empty State */}
        {loading ? (
          <div className="p-12 text-center text-xs text-brand-secondary">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-teal mb-2" />
            <span>Loading preferred craftsmen...</span>
          </div>
        ) : workersList.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-brand-border space-y-3 shadow-xs">
            <Users className="w-10 h-10 text-brand-secondary mx-auto opacity-40" />
            <h3 className="font-display font-bold text-lg text-brand-primary">
              No saved craftsmen yet
            </h3>
            <p className="text-xs text-brand-secondary max-w-sm mx-auto">
              Bookmark accredited technicians while browsing or after a completed service to easily dispatch them on future appointments.
            </p>
            <Button to="/customer/workers" variant="primary" size="md">
              Find Verified Artisans
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workersList.map((worker) => {
              const isVerified = worker.verificationStatus === 'verified';

              return (
                <div
                  key={worker.id}
                  className="rounded-3xl bg-white border border-brand-border p-6 shadow-subtle hover:shadow-premium transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-emerald/20"
                      />

                      <button
                        type="button"
                        onClick={() => handleToggleSave(worker.id)}
                        className="p-1.5 rounded-xl text-brand-teal hover:bg-brand-surface transition-colors"
                        title="Remove from saved workers"
                      >
                        <BookmarkCheck className="w-5 h-5 fill-brand-teal text-brand-teal" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-base text-brand-primary">
                          {worker.name}
                        </h3>
                        {isVerified && (
                          <ShieldCheck className="w-4 h-4 text-brand-emerald" title="Verified Badge" />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-brand-teal block">
                        {worker.trade}
                      </span>
                      <span className="text-[11px] text-brand-secondary font-mono block">
                        {worker.city} ({worker.area}) • {worker.experienceYears} Yrs Exp.
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-xs text-brand-secondary">
                      <span className="flex items-center gap-1 text-amber-700 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{worker.rating ? worker.rating : 'New'}</span>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-800 font-semibold">
                        {worker.completedJobs} Dispatches
                      </span>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {worker.skills?.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-brand-surface text-[10px] font-medium text-brand-primary border border-brand-border/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-brand-border/60 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setInspectWorker(worker)}
                      className="px-3 py-1.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-primary hover:bg-black/5 transition-colors"
                    >
                      Profile
                    </button>

                    <Button
                      to={`/customer/book?service=${worker.trade.toLowerCase().split(' ')[0]}&worker=${worker.id}`}
                      variant="primary"
                      size="sm"
                      className="text-xs"
                    >
                      Request Booking
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Profile Inspection Modal */}
        {inspectWorker && (
          <WorkerProfileModal
            worker={inspectWorker}
            isOpen={!!inspectWorker}
            customerId={customerId}
            onClose={() => setInspectWorker(null)}
            onWorkerSavedChanged={(id, isSaved) => {
              if (!isSaved) {
                setWorkersList((prev) => prev.filter((w) => w.id !== id));
              }
            }}
          />
        )}
      </div>
    </CustomerLayout>
  );
}
