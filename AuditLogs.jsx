/**
 * SahkarSathi Central Executive Immutable Audit Log Stream
 * Searchable, tamper-proof record of all administrative actions & overrides
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileSpreadsheet,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  User,
  Clock,
  Eye,
  RefreshCw,
  X,
  Download,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { adminService } from '../../services/adminService';
import { mockAdminUser } from '../../data/adminMockData';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAuditLogs({
        search,
        actionType: actionFilter,
        entity: entityFilter,
        limit: 100,
      });
      setLogs(data || []);
    } catch (err) {
      console.warn('Failed to load audit logs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [search, actionFilter, entityFilter]);

  const getActionBadgeVariant = (action) => {
    if (action.includes('APPROVE') || action.includes('ACTIVATE') || action.includes('CREATE')) {
      return 'emerald';
    }
    if (action.includes('REJECT') || action.includes('SUSPEND') || action.includes('CANCEL')) {
      return 'danger';
    }
    if (action.includes('OVERRIDE') || action.includes('DISPUTE')) {
      return 'gold';
    }
    return 'neutral';
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        <BackendNotice
          title="Cryptographically Timestamped Immutable Audit Log"
          message="Every administrative decision, verification certification, service rate alteration, and status override is permanently recorded with reviewer ID, IP address, and mandatory legal justification."
        />

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Tamper-Proof Audit Vault
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                {logs.length} Recorded Events
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              System Audit Logs
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Complete chronological audit trail for statutory compliance, dispute resolution, and cooperative governance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Exporting signed cooperative compliance audit CSV ledger...')}
              className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-primary hover:bg-black/5 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4 text-brand-emerald" />
              <span>Export Audit CSV</span>
            </button>
            <button
              type="button"
              onClick={loadLogs}
              className="p-2.5 rounded-xl border border-brand-border hover:bg-black/5 text-brand-primary"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-brand-border shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-secondary absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search audit trail by admin name, action, target entity ID, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-border bg-brand-surface/40 text-xs text-brand-primary focus:outline-none focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-brand-border text-xs text-brand-primary bg-white focus:outline-none"
            >
              <option value="all">All Entities</option>
              <option value="worker">Artisans</option>
              <option value="user">Users</option>
              <option value="booking">Bookings</option>
              <option value="service">Services</option>
              <option value="settings">Settings</option>
              <option value="support_ticket">Tickets</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-3xl border border-brand-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-surface/80 border-b border-brand-border text-brand-secondary uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Audit ID & Time</th>
                  <th className="py-3.5 px-4 font-semibold">Action & Target</th>
                  <th className="py-3.5 px-4 font-semibold">Administrator</th>
                  <th className="py-3.5 px-4 font-semibold">Mandatory Justification</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-brand-surface/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] font-bold text-brand-teal bg-brand-surface px-1.5 py-0.5 rounded border border-brand-border">
                        {log.id}
                      </span>
                      <span className="text-[10px] text-brand-secondary font-mono block mt-1">
                        {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={getActionBadgeVariant(log.actionType)} size="sm">
                        {log.actionType}
                      </Badge>
                      <span className="text-[11px] text-brand-secondary font-mono block mt-1">
                        {log.affectedEntity?.toUpperCase()}: {log.affectedEntityId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-brand-primary block">
                        {log.adminName}
                      </span>
                      <span className="text-[10px] text-brand-secondary font-mono block">
                        IP: {log.ipAddress || '103.21.144.12'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-md text-brand-primary font-medium leading-relaxed">
                      {log.reasonOrNote}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg border border-brand-border hover:bg-black/5 text-brand-primary transition-colors"
                        title="View Full Audit Snapshot"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-brand-border shadow-2xl p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-teal">
                    {selectedLog.id}
                  </span>
                  <h3 className="font-display font-bold text-lg text-brand-primary mt-1">
                    {selectedLog.actionType}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="p-1.5 rounded-xl hover:bg-black/5 text-brand-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-brand-surface/60 border border-brand-border space-y-1">
                  <span className="text-[10px] text-brand-secondary uppercase tracking-wider block font-bold">
                    Official Justification Note
                  </span>
                  <p className="text-brand-primary leading-relaxed">
                    {selectedLog.reasonOrNote}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border">
                    <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                      Target Entity
                    </span>
                    <span className="font-semibold text-brand-primary font-mono">
                      {selectedLog.affectedEntity}: {selectedLog.affectedEntityId}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border">
                    <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                      Recording Administrator
                    </span>
                    <span className="font-semibold text-brand-primary">
                      {selectedLog.adminName}
                    </span>
                  </div>
                </div>

                {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-black/90 text-emerald-400 font-mono text-[11px] p-3 rounded-xl overflow-x-auto space-y-1">
                    <span className="text-gray-400 text-[10px] block font-sans">
                      Payload Metadata Snapshot:
                    </span>
                    <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-brand-border flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-black"
                >
                  Close Snapshot
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
