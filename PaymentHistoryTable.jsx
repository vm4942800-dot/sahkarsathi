/**
 * Universal UPI Payment Records & History Table for SahkarSathi
 * Supports Customer, Worker, and Supervisor roles with filters & status badges
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Coins,
  Smartphone
} from 'lucide-react';
import Badge from '../common/Badge';

export default function PaymentHistoryTable({
  payments = [],
  role = 'customer',
  onVerifyClick,
}) {
  const [search, setSearch] = useState('');
  const [appFilter, setAppFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedUtr, setCopiedUtr] = useState(null);

  const handleCopy = (utr) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const filtered = payments.filter((p) => {
    if (appFilter !== 'all' && p.payment_app !== appFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchRef = p.payment_reference?.toLowerCase().includes(q);
      const matchBooking = p.booking_code?.toLowerCase().includes(q);
      const matchUtr = p.upi_reference?.toLowerCase().includes(q);
      const matchCustomer = p.customer_name?.toLowerCase().includes(q);
      const matchWorker = p.recipient_name?.toLowerCase().includes(q);
      return matchRef || matchBooking || matchUtr || matchCustomer || matchWorker;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" size="sm">Verified & Paid</Badge>;
      case 'pending_verification':
        return <Badge variant="warning" size="sm">Pending Verification</Badge>;
      case 'rejected':
        return <Badge variant="danger" size="sm">Discrepancy / Rejected</Badge>;
      case 'payment_initiated':
        return <Badge variant="neutral" size="sm">App Opened</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status || 'Unpaid'}</Badge>;
    }
  };

  const getAppPill = (app) => {
    switch (app) {
      case 'phonepe':
        return <span className="px-2 py-0.5 rounded-md bg-[#5f259f]/10 text-[#5f259f] font-bold text-[10px] border border-[#5f259f]/20">PhonePe</span>;
      case 'paytm':
        return <span className="px-2 py-0.5 rounded-md bg-[#002970]/10 text-[#002970] font-bold text-[10px] border border-[#002970]/20">Paytm</span>;
      case 'gpay':
        return <span className="px-2 py-0.5 rounded-md bg-[#0F9D58]/10 text-[#0F9D58] font-bold text-[10px] border border-[#0F9D58]/20">Google Pay</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-brand-surface text-brand-primary font-bold text-[10px] border border-brand-border">UPI</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-secondary absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by UTR, Booking ID, or Member Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-brand-border bg-brand-surface/40 text-xs focus:outline-none focus:border-brand-teal text-brand-primary placeholder:text-brand-secondary/60"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* App filter */}
          <select
            value={appFilter}
            onChange={(e) => setAppFilter(e.target.value)}
            className="p-1.5 rounded-xl border border-brand-border bg-white text-xs text-brand-primary focus:outline-none focus:border-brand-teal"
          >
            <option value="all">All UPI Apps</option>
            <option value="phonepe">PhonePe</option>
            <option value="paytm">Paytm</option>
            <option value="gpay">Google Pay</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 rounded-xl border border-brand-border bg-white text-xs text-brand-primary focus:outline-none focus:border-brand-teal"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Verified Paid</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table / Card List */}
      <div className="bg-white rounded-3xl border border-brand-border shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-brand-secondary space-y-2">
            <Coins className="w-10 h-10 text-brand-secondary/40 mx-auto" />
            <h4 className="font-bold text-brand-primary">No payment records match filters</h4>
            <p>Direct payments between customers and verified artisans will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-surface/70 border-b border-brand-border font-bold text-brand-secondary text-[11px]">
                <tr>
                  <th className="py-3 px-4">Booking / Reference</th>
                  <th className="py-3 px-4">{role === 'customer' ? 'Recipient Artisan' : 'Homeowner'}</th>
                  <th className="py-3 px-4">UPI App</th>
                  <th className="py-3 px-4">UTR Reference</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  {(role === 'worker' || role === 'supervisor') && (
                    <th className="py-3 px-4 text-right">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-brand-surface/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-brand-primary">
                        {record.booking_code || record.booking_id}
                      </div>
                      <span className="text-[10px] text-brand-secondary truncate block max-w-[140px]">
                        {record.service_title}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-brand-primary">
                      {role === 'customer' ? record.recipient_name : record.customer_name}
                      <span className="text-[10px] text-brand-secondary font-mono block">
                        {record.recipient_upi_id}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {getAppPill(record.payment_app)}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-1">
                        <span>{record.upi_reference || 'N/A'}</span>
                        {record.upi_reference && (
                          <button
                            type="button"
                            onClick={() => handleCopy(record.upi_reference)}
                            className="p-1 rounded text-brand-secondary hover:text-brand-primary"
                            title="Copy UTR"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      {copiedUtr === record.upi_reference && (
                        <span className="text-[9px] text-emerald-600 block">Copied</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-800 text-sm">
                      ₹{record.amount?.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      {getStatusBadge(record.status)}
                    </td>

                    <td className="py-3 px-4 text-brand-secondary font-mono text-[11px]">
                      {new Date(record.payment_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>

                    {(role === 'worker' || role === 'supervisor') && (
                      <td className="py-3 px-4 text-right">
                        {record.status === 'pending_verification' && (
                          <button
                            type="button"
                            onClick={() => onVerifyClick && onVerifyClick(record)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors shadow-2xs"
                          >
                            Verify Deposit
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
