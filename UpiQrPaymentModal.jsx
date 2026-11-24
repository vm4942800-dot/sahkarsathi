/**
 * Customer UPI QR Payment & App Selection Modal for SahkarSathi
 * Supports direct payment to Workers/Supervisors via PhonePe, Paytm, and Google Pay
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Download,
  AlertCircle,
  Smartphone,
  IndianRupee,
  RefreshCw,
  Send,
  Info
} from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import {
  buildUpiUri,
  getAppDeepLink,
  generateUpiQrSvg,
  generateUpiQrDataUri,
  isValidUtr
} from '../../utils/upiQrGenerator';

export default function UpiQrPaymentModal({
  booking,
  isOpen,
  onClose,
  onPaymentSubmitted,
}) {
  const [recipientOptions, setRecipientOptions] = useState([]);
  const [selectedApp, setSelectedApp] = useState('phonepe');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [utrInput, setUtrInput] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [isSuccessView, setIsSuccessView] = useState(false);

  const recipientId = booking?.assigned_worker_id || booking?.assigned_supervisor_id || 'SS-WRK-7821';
  const recipientName = booking?.worker?.name || booking?.supervisor?.name || 'Sunil Verma';
  const recipientRole = booking?.assigned_worker_id ? 'worker' : 'supervisor';
  const amount = Number(booking?.total_amount) || 1450.00;

  useEffect(() => {
    if (!isOpen || !recipientId) return;

    let isMounted = true;
    async function loadOptions() {
      setLoading(true);
      setFeedback({ type: '', text: '' });
      setIsSuccessView(false);
      try {
        const options = await paymentService.getRecipientPaymentOptions(recipientId, recipientRole);
        if (isMounted) {
          setRecipientOptions(options);
          // Set preferred or first available app
          const preferred = options.find((o) => o.is_preferred) || options[0];
          if (preferred) {
            setSelectedApp(preferred.app_name);
          }
        }
      } catch (err) {
        console.warn('Failed to load recipient payment options:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOptions();
    return () => {
      isMounted = false;
    };
  }, [isOpen, recipientId, recipientRole]);

  if (!isOpen) return null;

  const currentAppOption = recipientOptions.find((o) => o.app_name === selectedApp) || recipientOptions[0];
  const activeUpiId = currentAppOption?.upi_id || '';

  // Generate UPI URI & Deep link
  const upiUri = buildUpiUri({
    upiId: activeUpiId,
    recipientName,
    amount,
    bookingRef: booking?.booking_code || booking?.id || '',
  });

  const deepLink = getAppDeepLink({
    appName: selectedApp,
    upiId: activeUpiId,
    recipientName,
    amount,
    bookingRef: booking?.booking_code || booking?.id || '',
  });

  const qrDataUri = generateUpiQrDataUri({
    upiUri,
    appName: selectedApp,
    size: 260,
  });

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleOpenApp = () => {
    // Attempt deep link
    window.location.href = deepLink;
  };

  const handleSubmitUtr = async (e) => {
    e.preventDefault();
    if (!isValidUtr(utrInput)) {
      setFeedback({
        type: 'error',
        text: 'Please enter a valid 12-digit numeric UPI reference number (UTR).',
      });
      return;
    }

    setSubmitting(true);
    setFeedback({ type: '', text: '' });
    try {
      await paymentService.submitUpiPayment({
        bookingId: booking?.id || 'BK-2025-0891',
        bookingCode: booking?.booking_code || booking?.id || 'BK-2025-0891',
        serviceTitle: booking?.service_title || 'Cooperative Service',
        customerId: booking?.customer_id || 'usr_customer_409',
        customerName: booking?.customer?.name || 'Priya Sharma',
        recipientId,
        recipientName,
        recipientRole,
        amount,
        paymentApp: selectedApp,
        recipientUpiId: activeUpiId,
        upiReference: utrInput.trim(),
        notes: `Paid ₹${amount} via ${selectedApp.toUpperCase()}`,
      });

      setIsSuccessView(true);
      if (onPaymentSubmitted) onPaymentSubmitted();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const getAppBadge = (appName) => {
    switch (appName) {
      case 'phonepe':
        return { label: 'PhonePe', color: 'bg-[#5f259f] text-white' };
      case 'paytm':
        return { label: 'Paytm UPI', color: 'bg-[#002970] text-white' };
      case 'gpay':
        return { label: 'Google Pay', color: 'bg-[#0F9D58] text-white' };
      default:
        return { label: 'UPI App', color: 'bg-brand-primary text-white' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-brand-border shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-brand-surface border-b border-brand-border flex items-center justify-between">
          <div>
            <span className="font-mono text-xs font-bold text-brand-teal">
              Direct Peer-to-Peer Payment
            </span>
            <h2 className="font-display font-bold text-lg sm:text-xl text-brand-primary">
              Pay {recipientName} Directly
            </h2>
            <p className="text-xs text-brand-secondary mt-0.5">
              100% of your money goes straight to your craftsman. SahkarSathi charges zero commission.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-brand-secondary hover:text-brand-primary hover:bg-white transition-colors"
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

        {loading ? (
          <div className="p-16 text-center text-xs text-brand-secondary">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-teal" />
            Loading recipient payment profiles...
          </div>
        ) : isSuccessView ? (
          /* Verification Pending Success View */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-display font-bold text-xl text-brand-primary">
              Payment Reference Submitted
            </h3>
            <p className="text-xs text-brand-secondary max-w-md mx-auto leading-relaxed">
              Your 12-digit reference <strong>{utrInput}</strong> has been logged as <strong>Pending Verification</strong>. {recipientName} will verify the deposit against their {selectedApp.toUpperCase()} statement.
            </p>

            <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border/80 max-w-sm mx-auto text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-brand-secondary">Recipient:</span>
                <span className="font-bold text-brand-primary">{recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-secondary">Amount:</span>
                <span className="font-bold text-emerald-700">₹{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-secondary">Payment App:</span>
                <span className="font-bold text-brand-primary capitalize">{selectedApp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-secondary">Status:</span>
                <span className="font-bold text-amber-700">Pending Verification</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-black transition-colors"
            >
              Done & View Booking
            </button>
          </div>
        ) : recipientOptions.length === 0 ? (
          /* Recipient Incomplete State */
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
            <h3 className="font-display font-bold text-base text-brand-primary">
              Recipient Payment Setup Incomplete
            </h3>
            <p className="text-xs text-brand-secondary max-w-sm mx-auto">
              {recipientName} has not yet registered their PhonePe, Paytm, or Google Pay UPI account. Please coordinate with your field supervisor to complete payment.
            </p>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Payment App Selector Tabs (Only shows recipient configured apps) */}
            <div>
              <label className="text-xs font-bold text-brand-primary block mb-2">
                Select Your Payment App:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {recipientOptions.map((opt) => {
                  const isSelected = opt.app_name === selectedApp;
                  const info = getAppBadge(opt.app_name);

                  return (
                    <button
                      key={opt.app_name}
                      type="button"
                      onClick={() => setSelectedApp(opt.app_name)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'border-brand-teal bg-brand-teal/10 shadow-xs ring-2 ring-brand-teal/20'
                          : 'border-brand-border bg-brand-surface/40 hover:bg-brand-surface'
                      }`}
                    >
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${info.color}`}>
                        {info.label}
                      </span>
                      <span className="block text-xs font-bold text-brand-primary truncate">
                        {opt.app_name.toUpperCase()}
                      </span>
                      {opt.is_preferred && (
                        <span className="text-[9px] text-brand-teal font-semibold block mt-0.5">
                          Recipient Preferred
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount Due Pill */}
            <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                  Total Payable to Artisan
                </span>
                <span className="font-display font-bold text-2xl text-brand-primary">
                  ₹{amount.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(amount.toFixed(2), 'amount')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-brand-border text-xs font-semibold text-brand-secondary hover:text-brand-primary transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedField === 'amount' ? 'Copied!' : 'Copy Amount'}</span>
              </button>
            </div>

            {/* QR Code Presentation Panel */}
            <div className="p-6 rounded-3xl bg-brand-surface/60 border border-brand-border flex flex-col items-center text-center space-y-4">
              <div className="w-56 h-56 p-3 bg-white rounded-2xl border border-brand-border shadow-sm flex items-center justify-center">
                <img
                  src={qrDataUri}
                  alt={`UPI QR Code for ${recipientName}`}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-brand-primary block">
                  Scan with {selectedApp.toUpperCase()}, GPay, Paytm, or any UPI App
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-teal bg-brand-surface px-2.5 py-1 rounded-lg border border-brand-border">
                    {activeUpiId}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeUpiId, 'upi')}
                    className="p-1.5 rounded-lg border border-brand-border text-brand-secondary hover:text-brand-primary hover:bg-white"
                    title="Copy UPI ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                {copiedField === 'upi' && (
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    UPI ID copied to clipboard!
                  </span>
                )}
              </div>

              {/* Mobile Deep Link Button */}
              <button
                type="button"
                onClick={handleOpenApp}
                className="w-full max-w-xs py-2.5 px-4 rounded-xl bg-brand-primary text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xs"
              >
                <Smartphone className="w-4 h-4 text-brand-teal" />
                <span>Open {selectedApp.toUpperCase()} on this Device</span>
              </button>
            </div>

            {/* UPI Reference (UTR) Submission Form */}
            <form onSubmit={handleSubmitUtr} className="space-y-3 pt-2 border-t border-brand-border text-xs">
              <div>
                <label className="font-bold text-brand-primary block mb-1">
                  Enter 12-Digit UPI Transaction Reference (UTR / UPI Ref No) *
                </label>
                <input
                  type="text"
                  maxLength={12}
                  required
                  placeholder="e.g. 432190876543 (Find in your app payment receipt)"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full p-3 rounded-xl border border-brand-border bg-white text-xs font-mono text-brand-primary focus:outline-none focus:border-brand-teal tracking-widest"
                />
                <span className="text-[10px] text-brand-secondary mt-1 block">
                  Found in your PhonePe / Paytm / GPay payment history as "UTR", "UPI Ref No", or "Transaction ID".
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting || utrInput.length !== 12}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {submitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Payment for Recipient Verification</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
