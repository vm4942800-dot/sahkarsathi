import React, { useState } from 'react';
import { 
  Bell, 
  ShieldCheck, 
  Globe, 
  Lock, 
  Save, 
  CheckCircle2, 
  Smartphone, 
  Mail 
} from 'lucide-react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function CustomerSettings() {
  const [settings, setSettings] = useState({
    smsAlerts: true,
    whatsappUpdates: true,
    emailReceipts: true,
    supervisorCalls: true,
    twoFactor: false,
    language: 'en',
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <CustomerLayout title="Account Settings & Preferences">
      <div className="max-w-4xl mx-auto space-y-8">
        {saved && (
          <div className="p-3.5 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 text-xs font-semibold text-brand-emerald flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences saved successfully.</span>
          </div>
        )}

        {/* Notifications & Dispatch Alerts */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-subtle space-y-6">
          <h3 className="font-display font-bold text-base text-brand-primary pb-3 border-b border-brand-border flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-teal" />
            <span>Cooperative Dispatch & Milestone Notifications</span>
          </h3>

          <div className="space-y-4">
            {[
              {
                key: 'smsAlerts',
                title: 'SMS Milestone Alerts',
                desc: 'Receive instant SMS when technician is dispatched or arrives on premises.',
              },
              {
                key: 'whatsappUpdates',
                title: 'WhatsApp Project Photos & Invoices',
                desc: 'Receive supervisor sign-off photos and itemized material bills directly on WhatsApp.',
              },
              {
                key: 'emailReceipts',
                title: 'Email Invoices & Escrow Confirmations',
                desc: 'Digital PDF tax invoice and escrow deposit receipts sent to your registered email.',
              },
              {
                key: 'supervisorCalls',
                title: 'Direct Supervisor Verification Calls',
                desc: 'Allow regional supervisor lead to call directly for pre-job scope confirmations.',
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-surface/70 border border-brand-border/60"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-brand-primary block">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-brand-secondary">
                    {item.desc}
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={() => handleToggle(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-brand-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Localization */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-subtle space-y-6">
          <h3 className="font-display font-bold text-base text-brand-primary pb-3 border-b border-brand-border flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-teal" />
            <span>Regional Language & Security Controls</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-primary mb-1">
                Portal Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-border text-xs text-brand-primary font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
              >
                <option value="en">English (India)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-primary mb-1">
                Two-Factor Security (2FA)
              </label>
              <div className="p-2.5 rounded-xl bg-brand-surface border border-brand-border text-xs flex items-center justify-between">
                <span className="text-brand-secondary">Mobile OTP Challenge</span>
                <span className="text-brand-teal font-bold">Enabled via SMS</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button onClick={handleSave} variant="primary" size="md" icon={Save}>
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
