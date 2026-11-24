/**
 * Customer UPI Payment History & Direct Settlement Ledger for SahkarSathi
 * Supports PhonePe, Paytm, and Google Pay direct settlements
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import PaymentHistoryTable from '../../components/payments/PaymentHistoryTable';
import { paymentService } from '../../services/paymentService';
import { mockCustomer } from '../../data/customerMockData';

export default function CustomerPayments() {
  const customerId = mockCustomer.id || 'CUST-BLR-4091';
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const records = await paymentService.getPaymentRecords({
        userId: customerId,
        role: 'customer',
      });
      setPayments(records || []);
    } catch (err) {
      console.warn('Failed to load customer payment history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const pendingVerificationCount = payments.filter(
    (p) => p.status === 'pending_verification'
  ).length;

  return (
    <CustomerLayout>
      <div className="space-y-6 max-w-6xl">
        <BackendNotice
          title="Direct UPI Payment Settlement (PhonePe • Paytm • Google Pay)"
          message="SahkarSathi charges zero platform middleman fees. Your service payments are transferred directly to your assigned cooperative worker or supervisor via PhonePe, Paytm, or Google Pay UPI."
        />

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Direct UPI Ledger
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                {customerId}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Payment History & UPI Receipts
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Track direct payments sent to trade artisans via PhonePe, Paytm, and Google Pay, along with your 12-digit bank UTR numbers and verification status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert('Downloading official customer cooperative payment receipt statement...')}
            className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-primary hover:bg-black/5 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors self-stretch sm:self-auto justify-center"
          >
            <Download className="w-4 h-4 text-brand-emerald" />
            <span>Download Statement</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">
              Verified Direct Settlements
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
              ₹{totalPaid.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              100% directly credited to artisans
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">
              Pending Artisan Verification
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
              {pendingVerificationCount} Transactions
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              Awaiting worker statement cross-check
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">
              Cooperative Model
            </span>
            <p className="font-display text-xl sm:text-2xl font-bold text-brand-primary mt-1">
              Zero Platform Commission
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              Direct PhonePe, Paytm & GPay UPI
            </span>
          </div>
        </div>

        {/* Direct Payment Guide Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-brand-surface/70 border border-brand-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <QrCode className="w-5 h-5 text-brand-teal" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-brand-primary">
                How direct UPI payments work in SahkarSathi
              </h4>
              <p className="text-xs text-brand-secondary mt-0.5 leading-relaxed">
                When you book a service, open the booking and tap <strong>Pay via UPI</strong>. Select your preferred app (PhonePe, Paytm, or Google Pay), scan the generated NPCI QR code, and enter your 12-digit UTR reference. The artisan verifies it directly against their bank statement.
              </p>
            </div>
          </div>
        </div>

        {/* Payment History Records Table */}
        <div className="space-y-4">
          <PaymentHistoryTable userId={customerId} role="customer" />
        </div>
      </div>
    </CustomerLayout>
  );
}
