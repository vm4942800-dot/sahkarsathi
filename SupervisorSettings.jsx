import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Bell,
  MapPin,
  ShieldCheck,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  Sliders,
  AlertCircle
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';

export default function SupervisorSettings() {
  const [safetyThreshold, setSafetyThreshold] = useState('98%');
  const [autoReassign, setAutoReassign] = useState(true);
  const [instantAlerts, setInstantAlerts] = useState(true);
  const [language, setLanguage] = useState('English (Indian)');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <SupervisorLayout>
      <div className="space-y-6 max-w-4xl">
        <BackendNotice
          title="Supervisor Operational Parameters & Zone Settings"
          message="Adjust automated dispatch thresholds and escalation rules for East Zone Unit #14 field teams."
        />

        {/* Feedback Alert */}
        <AnimatePresence>
          {savedNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-3 text-xs sm:text-sm font-medium shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Supervisory preferences updated successfully.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Directorate Config
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                Supervisor Terminal v2.1.0
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Supervisor Terminal Settings
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Configure automated quality thresholds, dispatch triggers, and regional notification preferences.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Quality Audit Thresholds */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-border">
              <Sliders className="w-5 h-5 text-brand-emerald" />
              <div>
                <h3 className="font-display font-bold text-base text-brand-primary">
                  Quality Audit Pass Minimums
                </h3>
                <p className="text-xs text-brand-secondary">
                  Minimum inspection score required before milestone auto-disbursement
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {['95%', '98%', '99%', '100% Strict'].map((thresh) => (
                <button
                  type="button"
                  key={thresh}
                  onClick={() => setSafetyThreshold(thresh)}
                  className={`p-3 rounded-2xl border text-center transition-all text-xs font-semibold ${
                    safetyThreshold === thresh
                      ? 'bg-brand-emerald text-white border-brand-emerald shadow-sm'
                      : 'bg-brand-bgSecondary/40 border-brand-border text-brand-primary hover:bg-brand-bgSecondary'
                  }`}
                >
                  {thresh}
                </button>
              ))}
            </div>
          </div>

          {/* Automated Dispatch & Notification Preferences */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-border">
              <Bell className="w-5 h-5 text-brand-emerald" />
              <div>
                <h3 className="font-display font-bold text-base text-brand-primary">
                  Supervisory Escalation Alerts
                </h3>
                <p className="text-xs text-brand-secondary">
                  Channels for critical milestone requests and on-site incidents
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-bgSecondary/30 border border-brand-border cursor-pointer">
                <div>
                  <h4 className="text-xs font-bold text-brand-primary">
                    Auto-reroute Unaccepted Dispatches
                  </h4>
                  <p className="text-[11px] text-brand-secondary">
                    Automatically release job assignments if worker does not accept within 45 minutes.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoReassign}
                  onChange={(e) => setAutoReassign(e.target.checked)}
                  className="w-4 h-4 accent-brand-emerald rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-bgSecondary/30 border border-brand-border cursor-pointer">
                <div>
                  <h4 className="text-xs font-bold text-brand-primary">
                    Urgent Incident SMS & WhatsApp Direct Pings
                  </h4>
                  <p className="text-[11px] text-brand-secondary">
                    Receive high-priority alerts when a worker triggers an emergency safety halt.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={instantAlerts}
                  onChange={(e) => setInstantAlerts(e.target.checked)}
                  className="w-4 h-4 accent-brand-emerald rounded"
                />
              </label>
            </div>
          </div>

          {/* Language & Save */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-primary mb-1">
                Interface Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full sm:w-72 px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-primary outline-none focus:ring-2 focus:ring-brand-emerald"
              >
                <option>English (Indian)</option>
                <option>हिन्दी (Hindi)</option>
                <option>ಕನ್ನಡ (Kannada)</option>
                <option>தமிழ் (Tamil)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-brand-border flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emerald/90 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Supervisory Settings</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </SupervisorLayout>
  );
}
