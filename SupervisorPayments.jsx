/**
 * Supervisor Payment Management & Direct UPI Configuration for SahkarSathi
 * Supports PhonePe, Paytm, and Google Pay direct customer settlement
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IndianRupee,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Landmark,
  ShieldCheck,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Smartphone,
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Copy,
  Info
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockSupervisorPayments, mockSupervisor } from '../../data/supervisorMockData';
import { paymentService } from '../../services/paymentService';
import { isValidUpiId, buildUpiUri, generateUpiQrDataUri } from '../../utils/upiQrGenerator';
import PaymentHistoryTable from '../../components/payments/PaymentHistoryTable';
import PaymentVerificationModal from '../../components/payments/PaymentVerificationModal';

export default function SupervisorPayments() {
  const supervisorId = mockSupervisor.id || 'SUP-BLR-104';
  const supervisorName = mockSupervisor.name || 'Vikramaditya Rao';

  const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'verification', 'ledger'
  const [activeApp, setActiveApp] = useState('phonepe');
  const [payments, setPayments] = useState(mockSupervisorPayments);
  const [directPaymentRecords, setDirectPaymentRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [verifyModalPayment, setVerifyModalPayment] = useState(null);

  const [paymentApps, setPaymentApps] = useState({
    phonepe: { upiId: '9448122301@ybl', isEnabled: true, isPreferred: true },
    paytm: { upiId: '9448122301@paytm', isEnabled: true, isPreferred: false },
    gpay: { upiId: 'vikramaditya.rao@okaxis', isEnabled: true, isPreferred: false },
  });

  // Load existing settings and payment records
  const loadData = async () => {
    try {
      const [settings, records] = await Promise.all([
        paymentService.getUserPaymentSettings(supervisorId),
        paymentService.getPaymentRecords({ userId: supervisorId, role: 'supervisor' }),
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
      setDirectPaymentRecords(records || []);
    } catch (err) {
      console.warn('Failed to load supervisor payment settings:', err.message);
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
        userId: supervisorId,
        appName,
        upiId: config.upiId,
        isPreferred: config.isPreferred,
        isEnabled: config.isEnabled,
      });

      setFeedback({
        type: 'success',
        message: `${appName.toUpperCase()} direct settlement account updated. Homeowners can now pay supervisory milestone fees directly using this address.`,
      });
      loadData();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to update payment setting.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSetPreferred = async (appName) => {
    const updated = { ...paymentApps };
    Object.keys(updated).forEach((k) => {
      updated[k].isPreferred = k === appName;
    });
    setPaymentApps(updated);

    try {
      await paymentService.savePaymentSetting({
        userId: supervisorId,
        appName,
        upiId: updated[appName].upiId,
        isPreferred: true,
        isEnabled: updated[appName].isEnabled,
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleEnable = (appName) => {
    setPaymentApps((prev) => ({
      ...prev,
      [appName]: {
        ...prev[appName],
        isEnabled: !prev[appName].isEnabled,
      },
    }));
  };

  const currentConfig = paymentApps[activeApp];
  const sampleUri = buildUpiUri({
    payeeVpa: currentConfig.upiId || 'supervisor@upi',
    payeeName: supervisorName,
    amount: 1500,
    transactionNote: 'SahkarSathi Inspection Fee Sample',
  });
  const sampleQrDataUri = generateUpiQrDataUri(sampleUri, 220);

  const filteredPayments = payments.filter((p) => {
    return statusFilter === 'All' || p.status === statusFilter;
  });

  const totalAuditFees = payments
    .filter((p) => p.status === 'Completed')
    .reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, ''), 10), 0);

  const pendingVerificationCount = directPaymentRecords.filter(
    (p) => p.status === 'pending_verification'
  ).length;

  return (
    <SupervisorLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Direct UPI Settlement & Supervisory Fee Ledger"
          message="In accordance with cooperative bylaws, homeowners pay supervisory engineering inspection fees directly to you via PhonePe, Paytm, or Google Pay. Zero platform commission or escrow deductions."
        />

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Supervisory Direct Settlements
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                {mockSupervisor.cooperativeUnit}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Supervisor Payments & UPI Settings
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Configure your genuine PhonePe, Paytm, and Google Pay UPI IDs for direct project payments and audit customer UTR submissions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert('Downloading official supervisory tax and fee ledger...')}
            className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-primary hover:bg-black/5 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors self-stretch sm:self-auto justify-center"
          >
            <Download className="w-4 h-4 text-brand-emerald" />
            <span>Download Fee Statement</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">
              Settled Supervisory Fees
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
              ₹{totalAuditFees.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              Direct NEFT & UPI disbursements
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">
              Pending Customer UTR Verification
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
              {pendingVerificationCount} Records
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              Requires bank/UPI statement cross-check
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">
              Configured Direct UPI Apps
            </span>
            <p className="font-display text-xl sm:text-2xl font-bold text-brand-primary mt-1">
              {Object.values(paymentApps).filter((a) => a.isEnabled).length} of 3 Active
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              Zero Customer Markup • Direct Payout
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-brand-border gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-brand-emerald text-brand-primary'
                : 'border-transparent text-brand-secondary hover:text-brand-primary'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Direct UPI Settings (PhonePe / Paytm / GPay)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'verification'
                ? 'border-brand-emerald text-brand-primary'
                : 'border-transparent text-brand-secondary hover:text-brand-primary'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Payment Records & UTR Verification
            {pendingVerificationCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {pendingVerificationCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'ledger'
                ? 'border-brand-emerald text-brand-primary'
                : 'border-transparent text-brand-secondary hover:text-brand-primary'
            }`}
          >
            <Landmark className="w-4 h-4" />
            Cooperative Quality Ledger
          </button>
        </div>

        {/* Tab Content: UPI Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {feedback && (
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form & Apps */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-sm space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-brand-primary">
                      Direct UPI Channels
                    </h3>
                    <p className="text-xs text-brand-secondary mt-1">
                      Customers will scan this QR to send supervisory inspection and project sign-off fees directly to your bank account.
                    </p>
                  </div>

                  {/* App Selector Pills */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'phonepe', name: 'PhonePe', color: 'bg-indigo-50 border-indigo-200 text-indigo-900' },
                      { id: 'paytm', name: 'Paytm', color: 'bg-sky-50 border-sky-200 text-sky-900' },
                      { id: 'gpay', name: 'Google Pay', color: 'bg-blue-50 border-blue-200 text-blue-900' },
                    ].map((app) => {
                      const isSelected = activeApp === app.id;
                      const config = paymentApps[app.id];
                      return (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setActiveApp(app.id)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-brand-emerald ring-2 ring-brand-emerald/20 bg-white'
                              : 'border-brand-border bg-brand-bgSecondary/40 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-brand-primary">
                              {app.name}
                            </span>
                            {config.isPreferred && (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                Preferred
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[10px] block mt-1 ${
                              config.isEnabled ? 'text-emerald-700 font-medium' : 'text-zinc-600'
                            }`}
                          >
                            {config.isEnabled ? 'Active' : 'Disabled'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* App Configuration Panel */}
                  <div className="p-4 rounded-2xl bg-brand-bgSecondary/50 border border-brand-border space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary">
                        {activeApp.toUpperCase()} Configuration
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-brand-primary">
                        <input
                          type="checkbox"
                          checked={currentConfig.isEnabled}
                          onChange={() => handleToggleEnable(activeApp)}
                          className="w-4 h-4 text-brand-emerald rounded border-brand-border focus:ring-brand-emerald"
                        />
                        <span>Enable for Customers</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-brand-primary mb-1">
                        UPI ID / Virtual Payment Address (VPA)
                      </label>
                      <input
                        type="text"
                        value={currentConfig.upiId}
                        onChange={(e) => {
                          const val = e.target.value.trim().toLowerCase();
                          setPaymentApps((prev) => ({
                            ...prev,
                            [activeApp]: { ...prev[activeApp], upiId: val },
                          }));
                        }}
                        placeholder={
                          activeApp === 'phonepe'
                            ? 'mobile@ybl or mobile@ibl'
                            : activeApp === 'paytm'
                            ? 'mobile@paytm'
                            : 'name@okhdfcbank or mobile@okaxis'
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-xs sm:text-sm text-brand-primary font-mono focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald"
                      />
                      <span className="text-[11px] text-brand-secondary mt-1 block">
                        Must end with bank handle (e.g., @ybl, @paytm, @okaxis, @okhdfcbank).
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSetPreferred(activeApp)}
                        disabled={currentConfig.isPreferred || !currentConfig.isEnabled}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-brand-border text-brand-primary hover:bg-white disabled:opacity-40 transition-colors"
                      >
                        {currentConfig.isPreferred ? '★ Default Choice' : 'Make Default Choice'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveApp(activeApp)}
                        disabled={saving}
                        className="px-5 py-2 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
                      >
                        {saving ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>Save {activeApp.toUpperCase()}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
                    <Info className="w-4 h-4 text-brand-emerald flex-shrink-0 mt-0.5" />
                    <span>
                      Disabled apps are automatically hidden from customer payment options. Only actively configured accounts are presented to homeowners.
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live QR Preview */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-sm text-center space-y-4">
                  <div className="flex items-center justify-between text-left">
                    <div>
                      <h4 className="font-display font-bold text-sm text-brand-primary">
                        Live Scannable QR Preview
                      </h4>
                      <p className="text-[11px] text-brand-secondary">
                        Standard NPCI Specification
                      </p>
                    </div>
                    <Badge variant={currentConfig.isEnabled ? 'emerald' : 'neutral'} size="sm">
                      {currentConfig.isEnabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>

                  <div className="p-4 rounded-2xl bg-brand-bgSecondary/60 border border-brand-border inline-block mx-auto">
                    {sampleQrDataUri ? (
                      <img
                        src={sampleQrDataUri}
                        alt="UPI QR Code"
                        className="w-48 h-48 mx-auto rounded-lg shadow-inner bg-white p-2"
                      />
                    ) : (
                      <div className="w-48 h-48 mx-auto flex items-center justify-center text-xs text-brand-secondary">
                        Enter a valid UPI ID to generate QR
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-brand-primary block">
                      Payee: {supervisorName}
                    </span>
                    <span className="text-xs font-mono text-brand-secondary block">
                      {currentConfig.upiId || 'No UPI ID Set'}
                    </span>
                  </div>

                  <p className="text-[11px] text-brand-secondary leading-relaxed max-w-xs mx-auto">
                    Test by scanning with PhonePe, Paytm, or Google Pay. It will open direct transfer to your bank without intermediary fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Payment Records & Verification */}
        {activeTab === 'verification' && (
          <div className="space-y-4">
            <PaymentHistoryTable
              userId={supervisorId}
              role="supervisor"
              onVerifyClick={(record) => setVerifyModalPayment(record)}
            />
          </div>
        )}

        {/* Tab Content: Cooperative Quality Ledger */}
        {activeTab === 'ledger' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
              <h3 className="font-display font-bold text-lg text-brand-primary">
                Audit Settlement Transactions
              </h3>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-brand-secondary">Filter:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-brand-border text-xs text-brand-primary bg-white outline-none"
                >
                  <option value="All">All Transactions</option>
                  <option value="Completed">Completed Only</option>
                  <option value="Processing">Processing</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-brand-border">
              {filteredPayments.map((pay) => (
                <div
                  key={pay.reference}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-brand-primary bg-brand-bgSecondary px-2 py-0.5 rounded border border-brand-border">
                        {pay.reference}
                      </span>
                      <Badge
                        variant={pay.status === 'Completed' ? 'emerald' : 'gold'}
                        size="sm"
                      >
                        {pay.status}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-brand-primary text-xs sm:text-sm">
                      {pay.type}
                    </h4>
                    <p className="text-[11px] text-brand-secondary">
                      Project: {pay.projectRef} • {pay.date}
                    </p>
                  </div>

                  <div className="text-left sm:text-right flex-shrink-0">
                    <span className="font-display font-bold text-lg text-emerald-700">
                      +{pay.amount}
                    </span>
                    <span className="text-[10px] text-brand-secondary block font-mono">
                      {pay.channel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification Modal */}
        {verifyModalPayment && (
          <PaymentVerificationModal
            isOpen={!!verifyModalPayment}
            payment={verifyModalPayment}
            onClose={() => setVerifyModalPayment(null)}
            onVerified={() => {
              setVerifyModalPayment(null);
              loadData();
            }}
          />
        )}
      </div>
    </SupervisorLayout>
  );
}
