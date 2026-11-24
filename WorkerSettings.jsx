import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Bell,
  MapPin,
  Clock,
  Globe,
  Shield,
  Save,
  CheckCircle2,
  Phone,
  Moon,
  Lock
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';

export default function WorkerSettings() {
  const [dispatchRadius, setDispatchRadius] = useState('8 km');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emergencyPhone, setEmergencyPhone] = useState('+91 94481 00219');
  const [language, setLanguage] = useState('English (Indian)');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-4xl">
        <BackendNotice
          title="Worker Application Preferences & Dispatch Limits"
          message="Configure dispatch geofencing, notification channels, and emergency family contact info. Settings take effect immediately in the cooperative dispatch queue."
        />

        {/* Feedback Alert */}
        <AnimatePresence>
          {savedNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-3 text-xs sm:text-sm font-medium shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Worker preferences updated successfully.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="teal" size="sm">
                Terminal Config
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                Worker App v1.4.2
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Worker Account Settings
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Customize job alert radii, notifications, and workplace safety preferences.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Dispatch Geofence Radius */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-border">
              <MapPin className="w-5 h-5 text-brand-teal" />
              <div>
                <h3 className="font-display font-bold text-base text-brand-primary">
                  Job Dispatch Travel Radius
                </h3>
                <p className="text-xs text-brand-secondary">
                  Maximum distance from your base city area you are willing to travel
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {['3 km', '5 km', '8 km', '15 km'].map((radius) => (
                <button
                  type="button"
                  key={radius}
                  onClick={() => setDispatchRadius(radius)}
                  className={`p-3 rounded-2xl border text-center transition-all text-xs font-semibold ${
                    dispatchRadius === radius
                      ? 'bg-brand-teal text-white border-brand-teal shadow-sm'
                      : 'bg-brand-bgSecondary/40 border-brand-border text-brand-primary hover:bg-brand-bgSecondary'
                  }`}
                >
                  {radius}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-brand-secondary">
              Selected radius: <strong>{dispatchRadius}</strong>. Opportunities outside this zone will not trigger push alerts.
            </p>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-border">
              <Bell className="w-5 h-5 text-brand-teal" />
              <div>
                <h3 className="font-display font-bold text-base text-brand-primary">
                  Job Dispatch & Payout Notifications
                </h3>
                <p className="text-xs text-brand-secondary">
                  Manage real-time notifications for incoming requests
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-bgSecondary/30 border border-brand-border cursor-pointer">
                <div>
                  <h4 className="text-xs font-bold text-brand-primary">
                    Instant WhatsApp Job Alerts
                  </h4>
                  <p className="text-[11px] text-brand-secondary">
                    Receive one-click job acceptance links directly on WhatsApp.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-4 h-4 accent-brand-teal rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-bgSecondary/30 border border-brand-border cursor-pointer">
                <div>
                  <h4 className="text-xs font-bold text-brand-primary">
                    SMS Escrow & Payout Confirmations
                  </h4>
                  <p className="text-[11px] text-brand-secondary">
                    Receive statutory bank UTR settlement numbers via SMS.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-brand-teal rounded"
                />
              </label>
            </div>
          </div>

          {/* Language & Emergency Support */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Interface Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-primary outline-none focus:ring-2 focus:ring-brand-teal"
                >
                  <option>English (Indian)</option>
                  <option>हिन्दी (Hindi)</option>
                  <option>ಕನ್ನಡ (Kannada)</option>
                  <option>தமிழ் (Tamil)</option>
                  <option>తెలుగు (Telugu)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Emergency Family Contact (Mutual Aid Shield)
                </label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-primary outline-none focus:ring-2 focus:ring-brand-teal"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Application Preferences</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </WorkerLayout>
  );
}
