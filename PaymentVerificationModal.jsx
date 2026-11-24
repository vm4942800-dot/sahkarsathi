/**
 * Payment Verification Modal for Workers and Supervisors
 * Allows independent verification of customer UTR reference against bank/app statements
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  IndianRupee,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { paymentService } from '../../services/paymentService';

export default function PaymentVerificationModal({
  payment,
  isOpen,
  onClose,
  onVerified,
}) {
  const [loading, setLoading] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [copiedUtr, setCopiedUtr] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  if (!isOpen || !payment) return null;

  const handleCopyUtr = () => {
    navigator.clipboard.writeText(payment.upi_reference);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const handleVerify = async (action) => {
    if (action === 'reject' && !rejectionReason.trim()) {
      setFeedback({ type: 'error', text: 'Please specify a reason for rejecting the reference.' });
      return;
    }

    setLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      await paymentService.verifyPayment({
        paymentId: payment.id,
        verifiedBy: payment.recipient_id || 'SS-WRK-7821',
        action,
        rejectionReason: action === 'reject' ? rejectionReason : '',
        note: action === 'confirm' ? 'Verified in recipient bank/app statement.' : rejectionReason,
      });

      if (onVerified) onVerified();
      onClose();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-3xl border border-brand-border shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-brand-surface border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-display font-bold text-base sm:text-lg text-brand-primary">
              Verify Direct UPI Deposit
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-brand-secondary hover:text-brand-primary hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Banner */}
        {feedback.text && (
          <div
            className={`p-3 text-xs font-medium px-6 flex items-center gap-2 ${
              feedback.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-b border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.text}</span>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-5 text-xs">
          {/* Verification Advisory */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 leading-relaxed">
            <strong>Verification Protocol:</strong> Please open your <strong>{payment.payment_app?.toUpperCase()}</strong> or linked bank SMS history. Confirm that you received <strong>₹{payment.amount?.toFixed(2)}</strong> from <strong>{payment.customer_name}</strong> under reference <strong>{payment.upi_reference}</strong> before confirming.
          </div>

          {/* Payment Info Card */}
          <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-brand-border/60">
              <span className="text-brand-secondary">Submitted UTR Reference:</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-brand-primary">
                <span>{payment.upi_reference}</span>
                <button
                  type="button"
                  onClick={handleCopyUtr}
                  className="p-1 rounded text-brand-secondary hover:text-brand-primary"
                  title="Copy UTR"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-brand-secondary">Customer:</span>
              <span className="font-bold text-brand-primary">{payment.customer_name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-brand-secondary">Amount Claimed:</span>
              <span className="font-bold text-emerald-700 font-mono text-sm">
                ₹{payment.amount?.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-brand-secondary">Payment App:</span>
              <span className="font-bold text-brand-primary capitalize">{payment.payment_app}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-brand-secondary">Submitted At:</span>
              <span className="font-mono text-brand-secondary">
                {new Date(payment.payment_date).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Rejection Note Drawer */}
          {rejecting && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <label className="font-bold text-rose-900 block">
                Reason for Rejection (Customer will be notified to correct):
              </label>
              <input
                type="text"
                placeholder="e.g. UTR not found in bank statement, or amount mismatch"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-rose-300 bg-white text-xs text-rose-900 focus:outline-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
            {!rejecting ? (
              <>
                <button
                  type="button"
                  onClick={() => setRejecting(true)}
                  className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold transition-colors"
                >
                  Reject Reference
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleVerify('confirm')}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Mark Paid</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setRejecting(false)}
                  className="px-4 py-2 rounded-xl border border-brand-border text-brand-secondary hover:text-brand-primary"
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleVerify('reject')}
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
                >
                  Confirm Rejection
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
