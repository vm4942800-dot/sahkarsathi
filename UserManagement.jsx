/**
 * SahkarSathi Admin User Management
 * Directory, Role filtering, Status toggling with mandatory audit justification
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  AlertTriangle,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Lock
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { adminService } from '../../services/adminService';
import { mockAdminUser } from '../../data/adminMockData';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspendModalUser, setSuspendModalUser] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        search,
        role: roleFilter,
        status: statusFilter,
        page,
        limit: 8,
      });
      setUsers(res.users);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.warn('Failed to load users:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter, page]);

  const handleStatusChange = async (targetUser, newStatus) => {
    if (!suspendReason || suspendReason.trim().length < 5) {
      setFeedback({ type: 'error', text: 'Please enter a detailed reason (minimum 5 characters) for audit logging.' });
      return;
    }

    setActionLoading(true);
    setFeedback(null);
    try {
      await adminService.updateUserStatus({
        userId: targetUser.id,
        status: newStatus,
        reason: suspendReason,
        adminId: mockAdminUser.id,
        adminName: mockAdminUser.fullName,
      });

      setFeedback({
        type: 'success',
        text: `User ${targetUser.fullName} (${targetUser.userCode}) status updated to ${newStatus.toUpperCase()}. Action recorded in immutable audit logs.`,
      });
      setSuspendModalUser(null);
      setSuspendReason('');
      fetchUsers();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        <BackendNotice
          title="Central User Directory & Identity Management"
          message="Inspect all registered customer, worker, and supervisory accounts. Account suspensions require documented audit justifications in accordance with cooperative bylaws. Passwords and raw tokens are cryptographically isolated."
        />

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                User Registry
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                {total} Total Accounts
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Platform User Directory
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Search, inspect, and manage accounts across all 3 cooperative tiers and executive oversight staff.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchUsers}
            className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-primary hover:bg-black/5 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload Directory</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between gap-3 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-brand-border shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-secondary absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by member name, account ID (e.g. SS-CUST, SS-WRK), or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-border bg-brand-surface/40 text-xs text-brand-primary focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-emerald/20"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-brand-border text-xs text-brand-primary bg-white focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers Only</option>
              <option value="worker">Artisans Only</option>
              <option value="supervisor">Supervisors Only</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-brand-border text-xs text-brand-primary bg-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-brand-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-surface/80 border-b border-brand-border text-brand-secondary uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">User & Identifier</th>
                  <th className="py-3.5 px-4 font-semibold">Role</th>
                  <th className="py-3.5 px-4 font-semibold">Contact & Location</th>
                  <th className="py-3.5 px-4 font-semibold">Registered</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {users.map((u) => {
                  const roleVariant =
                    u.role === 'customer' ? 'teal' : u.role === 'worker' ? 'emerald' : 'gold';
                  const isSuspended = u.status === 'suspended';

                  return (
                    <tr key={u.id} className="hover:bg-brand-surface/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-brand-primary text-xs sm:text-sm block">
                            {u.fullName}
                          </span>
                          <span className="font-mono text-[11px] text-brand-secondary bg-brand-surface px-1.5 py-0.5 rounded border border-brand-border inline-block">
                            {u.userCode}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant={roleVariant} size="sm">
                          {u.role.toUpperCase()}
                        </Badge>
                        {u.trade && (
                          <span className="text-[10px] text-brand-secondary block mt-0.5">
                            {u.trade}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-brand-secondary space-y-0.5">
                        <span className="block">{u.email}</span>
                        <span className="text-[10px] font-mono block">{u.phone} • {u.city}</span>
                      </td>

                      <td className="py-3.5 px-4 text-brand-secondary font-mono text-[11px]">
                        {u.joinedDate}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant={isSuspended ? 'danger' : 'success'} size="sm">
                          {isSuspended ? 'Suspended' : 'Active'}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 rounded-lg border border-brand-border hover:bg-black/5 text-brand-primary transition-colors"
                            title="Inspect Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {isSuspended ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSuspendModalUser(u);
                                setSuspendReason('');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold text-[11px] transition-colors"
                            >
                              Reactivate
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSuspendModalUser(u);
                                setSuspendReason('');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold text-[11px] transition-colors"
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-brand-border flex items-center justify-between text-xs text-brand-secondary">
            <span>
              Showing Page {page} of {totalPages} ({total} Users)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-brand-border hover:bg-brand-surface disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-brand-border hover:bg-brand-surface disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* User Detail Inspection Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-brand-border shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <div>
                  <Badge variant="emerald" size="sm">
                    {selectedUser.role.toUpperCase()}
                  </Badge>
                  <h3 className="font-display font-bold text-lg text-brand-primary mt-1">
                    {selectedUser.fullName}
                  </h3>
                  <span className="text-xs font-mono text-brand-secondary">
                    Member ID: {selectedUser.userCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 rounded-xl hover:bg-black/5 text-brand-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border">
                    <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                      Email Address
                    </span>
                    <span className="font-semibold text-brand-primary">{selectedUser.email}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border">
                    <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                      Phone Number
                    </span>
                    <span className="font-semibold text-brand-primary">{selectedUser.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border">
                    <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                      Registered City
                    </span>
                    <span className="font-semibold text-brand-primary">{selectedUser.city}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border">
                    <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                      Account Status
                    </span>
                    <span className="font-semibold text-emerald-800 capitalize">
                      {selectedUser.status}
                    </span>
                  </div>
                </div>

                {selectedUser.role === 'customer' && (
                  <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border">
                    <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                      Service Activity
                    </span>
                    <span className="font-semibold text-brand-primary block">
                      {selectedUser.totalBookings} Completed Bookings • ₹{selectedUser.totalSpent} Settled
                    </span>
                  </div>
                )}

                {selectedUser.role === 'worker' && (
                  <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border space-y-1">
                    <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                      Artisan Accreditations
                    </span>
                    <span className="font-semibold text-brand-primary block">
                      {selectedUser.trade} • {selectedUser.badgeLevel}
                    </span>
                    <span className="text-brand-secondary block">
                      {selectedUser.completedJobs} Completed Jobs • Rating: ★ {selectedUser.rating}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-brand-border flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Suspend / Reactivate Reason Modal */}
        {suspendModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-white rounded-3xl border border-brand-border shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <h3 className="font-display font-bold text-base text-brand-primary">
                  {suspendModalUser.status === 'suspended' ? 'Reactivate User Account' : 'Suspend User Account'}
                </h3>
              </div>

              <p className="text-xs text-brand-secondary leading-relaxed">
                You are modifying the account status of{' '}
                <strong>{suspendModalUser.fullName}</strong> ({suspendModalUser.userCode}). In accordance with cooperative governance protocols, a documented justification is mandatory and will be appended to the immutable system audit trail.
              </p>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Documented Justification (Mandatory):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Investigation of safety policy violation, or resolution of reported dispute #TCK-2026..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-brand-border text-xs text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-emerald/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSuspendModalUser(null)}
                  className="px-4 py-2 rounded-xl border border-brand-border text-xs text-brand-secondary hover:text-brand-primary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() =>
                    handleStatusChange(
                      suspendModalUser,
                      suspendModalUser.status === 'suspended' ? 'active' : 'suspended'
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition-colors ${
                    suspendModalUser.status === 'suspended'
                      ? 'bg-brand-emerald hover:bg-brand-emeraldDark'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {actionLoading
                    ? 'Recording...'
                    : suspendModalUser.status === 'suspended'
                    ? 'Confirm Reactivation'
                    : 'Confirm Suspension'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
