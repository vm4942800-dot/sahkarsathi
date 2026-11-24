import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Building2 
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import Button from '../components/common/Button';
import BackendNotice from '../components/common/BackendNotice';
import { BRAND } from '../config/brand';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'general',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Cooperative Support"
          badgeIcon={Phone}
          badgeVariant="teal"
          title="Reach Our Regional"
          highlight="Cooperative Hubs"
          subtitle="Have questions about service dispatch, worker enrollment, or project oversight? Our regional liaison teams are here to assist."
          align="center"
          className="mb-8"
        />

        <BackendNotice
          featureName="Customer & Worker Helpdesk"
          details="Simulated message dispatcher. In Phase 2, this routes support tickets directly to the regional cooperative chapter supervisor on duty."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-8">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl bg-white border border-brand-border p-6 sm:p-8 shadow-premium space-y-6">
              <h3 className="font-display font-bold text-lg text-brand-primary">
                Cooperative Headquarters
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-brand-secondary">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-brand-primary block">Central Hub Location</strong>
                    {BRAND.location}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-brand-primary block">Support Desk</strong>
                    <a href={`mailto:${BRAND.supportEmail}`} className="text-brand-teal hover:underline">
                      {BRAND.supportEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-brand-primary block">Toll-Free Helpline</strong>
                    <a href={`tel:${BRAND.supportPhone}`} className="text-brand-primary hover:text-brand-teal">
                      {BRAND.supportPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-brand-primary block">Working Hours</strong>
                    Monday – Saturday: 8:00 AM – 8:00 PM
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border text-xs text-brand-secondary">
              <span className="font-semibold text-brand-primary block mb-1">
                Emergency Maintenance Dispatch
              </span>
              For critical electrical hazards or major water leaks, active subscribers receive expedited supervisor routing through their booking dashboard.
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-brand-border p-6 sm:p-8 shadow-premium">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-3"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-emerald/15 text-brand-emerald flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-brand-primary">
                    Message Dispatched (Preview)
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-secondary max-w-md mx-auto">
                    Thank you, <strong className="text-brand-primary">{formData.name}</strong>. Your inquiry regarding <strong className="capitalize">{formData.topic}</strong> has been logged in prototype mode.
                  </p>
                  <Button
                    onClick={() => setSent(false)}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-display font-bold text-base text-brand-primary pb-2 border-b border-brand-border/60">
                    Send an Inquiry to Cooperative Hub
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="priya@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                    >
                      <option value="service">Service Request or Rate Inquiry</option>
                      <option value="worker">Worker Cooperative Enrollment</option>
                      <option value="supervisor">Supervisor / Contractor Accreditation</option>
                      <option value="society">Housing Society / Multi-Unit AMC</option>
                      <option value="feedback">General Cooperative Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Message Details
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please specify your question, address details, or cooperative inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      icon={Send}
                      iconPosition="right"
                      className="w-full sm:w-auto"
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
