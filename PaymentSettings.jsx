/**
 * Worker UPI Payment Configuration for SahkarSathi
 * Supports PhonePe, Paytm, and Google Pay direct customer settlement
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Save,
  AlertCircle,
  IndianRupee,
  Smartphone,
  Check,
  RefreshCw,
  Copy,
  Info
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { paymentService } from '../../services/paymentService';
import { isValidUpiId, buildUpiUri, generateUpiQrDataUri } from '../../utils/upiQrGenerator';
import PaymentHistoryTable from '../../components/payments/PaymentHistoryTable';
import PaymentVerificationModal from '../../components/payments/PaymentVerificationModal';

export default function PaymentSettings() {
  const workerId = 'SS-WRK-7821';
  const workerName = 'Sunil Verma';

  const [paymentApps, setPaymentApps] = useState({
    phonepe: { upiId: '9823145670@ybl', isEnabled: true, isPreferred: true },
    paytm: { upiId: '9823145670@paytm', isEnabled: true, isPreferred: false },
    gpay: { upiId: 'sunil.verma@okhdfcbank', isEnabled: true, isPreferred: false },
  });

  const [activeTab, setActiveTab] = useState('phonepe');
  const [payments, setPayments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [verifyModalPayment, setVerifyModalPayment] = useState(null);

  // Load existing settings and payment records
  const loadData = async () => {
    try {
      const [settings, records] = await Promise.all([
        paymentService.getUserPaymentSettings(workerId),
        paymentService.getPaymentRecords({ userId: workerId, role: 'worker' }),
      ]);

      if (settings && settings.length > 0) {
        const mapped = { ...paymentApps };
        settings.forEach((s) => {
          if (mapped[s.app_name]) {
            mapped[s.app_name] = {
              upiId: s.upi_id,
              isEnabled: s.is_enabled,
              isPreferred: s.is_preferred,
            };
          }
        });
        setPaymentApps(mapped);
      }
      setPayments(records || []);
    } catch (err) {
      console.warn('Failed to load payment settings:', err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveApp = async (appName) => {
    const config = paymentApps[appName];
    if (config.isEnabled && !isValidUpiId(config.upiId)) {
      setFeedback({
        type: 'error',
        message: `Please enter a valid UPI Virtual Payment Address for ${appName.toUpperCase()} (e.g. mobile@ybl, name@okhdfcbank).`,
      });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      await paymentService.savePaymentSetting({
        userId: workerId,
        appName,
        upiId: config.upiId,
        isPreferred: config.isPreferred,
        isEnabled: config.isEnabled,
      });

      setFeedback({
        type: 'success',
        message: `${appName.toUpperCase()} direct settlement account updated. Customers can now pay you directly using this address.`,
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const handleSetPreferred = (appName) => {
    setPaymentApps((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key].isPreferred = key === appName;
      });
      return updated;
    });
  };

  const currentConfig = paymentApps[activeTab];
  const sampleUri = buildUpiUri({
    upiId: currentConfig.upiId || 'artisan@upi',
    recipientName: workerName,
    amount: 1450,
    bookingRef: 'SS-SAMPLE',
  });

  const previewQrDataUri = generateUpiQrDataUri({
    upiUri: sampleUri,
    appName: activeTab,
    size: 200,
  });

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Direct Peer-to-Peer UPI Settlement"
          message="Homeowners pay you directly via PhonePe, Paytm, or Google Pay. SahkarSathi collects zero commissions. You verify incoming deposits independently using your bank/app SMS statements."
        />

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-medium ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="teal" size="sm">
                Direct UPI Autopay
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                Zero-Fee Direct Settlement
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              UPI Payment Accounts
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Configure your registered PhonePe, Paytm, and Google Pay handles. Customers can only select payment apps you have explicitly enabled.
            </p>
          </div>
        </div>

        {/* Payment App Configuration Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-6">
          {/* App Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-brand-border pb-4">
            {[
              { id: 'phonepe', label: 'PhonePe', color: 'text-[#5f259f]' },
              { id: 'paytm', label: 'Paytm UPI', color: 'text-[#002970]' },
              { id: 'gpay', label: 'Google Pay', color: 'text-[#0F9D58]' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const isEnabled = paymentApps[tab.id]?.isEnabled;
              const isPref = paymentApps[tab.id]?.isPreferred;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl border font-bold text-xs flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                      : 'bg-brand-surface/40 hover:bg-brand-surface text-brand-primary border-brand-border'
                  }`}
                >
                  <span className={isActive ? 'text-white' : tab.color}>{tab.label}</span>
                  {isEnabled && (
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                  )}
                  {isPref && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
                      Preferred
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active App Detail & Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-brand-surface border border-brand-border">
                <div>
                  <h4 className="font-bold text-sm text-brand-primary capitalize">
                    {activeTab === 'gpay' ? 'Google Pay' : activeTab} Direct Settlement
                  </h4>
                  <p className="text-[11px] text-brand-secondary">
                    {currentConfig.isEnabled
                      ? 'Enabled: Homeowners will see this payment option on confirmed bookings.'
                      : 'Disabled: This app will not be presented as a payment option.'}
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentConfig.isEnabled}
                    onChange={(e) =>
                      setPaymentApps((prev) => ({
                        ...prev,
                        [activeTab]: { ...prev[activeTab], isEnabled: e.target.checked },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              {currentConfig.isEnabled && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-brand-primary block mb-1">
                      {activeTab.toUpperCase()} Virtual Payment Address (UPI ID) *
                    </label>
                    <input
                      type="text"
                      placeholder={`e.g. ${activeTab === 'phonepe' ? '9823145670@ybl' : activeTab === 'paytm' ? '9823145670@paytm' : 'sunil.verma@okhdfcbank'}`}
                      value={currentConfig.upiId}
                      onChange={(e) =>
                        setPaymentApps((prev) => ({
                          ...prev,
                          [activeTab]: { ...prev[activeTab], upiId: e.target.value.trim() },
                        }))
                      }
                      className="w-full p-3 rounded-xl border border-brand-border bg-white text-xs font-mono text-brand-primary focus:outline-none focus:border-brand-teal"
                    />
                    <span className="text-[10px] text-brand-secondary mt-1 block">
                      Must match the mobile or bank handle registered in your {activeTab.toUpperCase()} app.
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-brand-border bg-brand-surface/40">
                    <span className="font-medium text-brand-primary">
                      Set as Primary Preferred Payment Option
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSetPreferred(activeTab)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
                        currentConfig.isPreferred
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-brand-border text-brand-secondary hover:text-brand-primary'
                      }`}
                    >
                      {currentConfig.isPreferred ? 'Preferred Default' : 'Make Preferred'}
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSaveApp(activeTab)}
                    className="px-6 py-2.5 rounded-xl bg-brand-teal text-white font-bold text-xs hover:bg-brand-teal-light transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save {activeTab.toUpperCase()} Configuration</span>
                  </button>
                </div>
              )}
            </div>

            {/* Live QR Matrix Preview */}
            <div className="p-5 rounded-2xl bg-brand-surface/60 border border-brand-border flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-secondary">
                Live Customer QR Preview
              </span>

              <div className="w-40 h-40 p-2 bg-white rounded-2xl border border-brand-border shadow-xs flex items-center justify-center">
                <img
                  src={previewQrDataUri}
                  alt={`QR Preview for ${activeTab}`}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-0.5">
                <span className="font-mono text-xs font-bold text-brand-teal block">
                  {currentConfig.upiId || 'not configured'}
                </span>
                <span className="text-[10px] text-brand-secondary block">
                  Scannable by {activeTab.toUpperCase()} and all NPCI apps
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Incoming Payment Records & Verification Audit */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl text-brand-primary">
                Direct Deposit Records
              </h2>
              <p className="text-xs text-brand-secondary">
                Review homeowner UTR submissions and confirm direct payment arrivals into your bank statement.
              </p>
            </div>
          </div>

          <PaymentHistoryTable
            payments={payments}
            role="worker"
            onVerifyClick={(payment) => setVerifyModalPayment(payment)}
          />
        </div>
      </div>

      {/* Verification Action Modal */}
      <PaymentVerificationModal
        payment={verifyModalPayment}
        isOpen={Boolean(verifyModalPayment)}
        onClose={() => setVerifyModalPayment(null)}
        onVerified={() => loadData()}
      />
    </WorkerLayout>
  );
}
