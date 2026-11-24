/**
 * SahkarSathi Admin Direct UPI Payment Audit Ledger
 * PhonePe, Paytm, Google Pay direct settlement inspection & dispute auditing
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  X,
  FileText
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import PaymentHistoryTable from '../../components/payments/PaymentHistoryTable';
import { paymentService } from '../../services/paymentService';
import { adminService } from '../../services/adminService';
import { mockAdminUser } from '../../data/adminMockData';

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const records = await paymentService.getPaymentRecords({ role: 'admin' });
      setPayments(records || []);
    } catch (err) {
      console.warn('Failed to load payment records:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalSettled = payments
    .filter((p) => p.status === 'paid')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const pendingCount = payments.filter((p) => p.status === 'pending_verification').length;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        <BackendNotice
          title="Direct Peer-to-Peer UPI Payment Audit Trail"
          message="Zero platform commission. SahkarSathi does not collect, hold, or escrow customer money. All transactions flow directly between homeowners and registered craftsman/supervisor bank accounts via PhonePe, Paytm, and Google Pay."
        />

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Direct UPI Ledger
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                PhonePe • Paytm • Google Pay
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Payment & UPI Oversight
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Audit direct payment records, 12-digit bank UTR numbers, artisan verification timestamps, and dispute reports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-primary hover:bg-black/5 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Reload Transactions</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-xs">
            <span className="text-xs text-brand-secondary font-medium">
              Verified Direct Settlements
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
              ₹{totalSettled.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              100% directly credited to artisans
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-xs">
            <span className="text-xs text-brand-secondary font-medium">
              Pending Artisan UTR Verification
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
              {pendingCount} Transactions
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              Awaiting worker statement cross-check
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-xs">
            <span className="text-xs text-brand-secondary font-medium">
              Platform Fee Deductions
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-brand-primary mt-1">
              ₹0 (0.00%)
            </p>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
              Non-profit cooperative mandate
            </span>
          </div>
        </div>

        {/* Universal Payment History Table */}
        <div className="space-y-4">
          <PaymentHistoryTable role="admin" />
        </div>
      </div>
    </AdminLayout>
  );
}
