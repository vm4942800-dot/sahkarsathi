import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Languages,
  Clock,
  ShieldCheck,
  Edit3,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Lock,
  Camera,
  Sparkles
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { mockWorker } from '../../data/workerMockData';

export default function WorkerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockWorker);
  const [formData, setFormData] = useState({
    name: mockWorker.name,
    role: mockWorker.role,
    mobile: mockWorker.mobile,
    email: mockWorker.email,
    city: mockWorker.city,
    serviceAreas: mockWorker.serviceAreas.join(', '),
    experienceYears: mockWorker.experienceYears,
    bio: mockWorker.bio,
    languages: mockWorker.languages.join(', '),
    dailyHours: mockWorker.dailyHours,
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    // Simulated form validation
    if (!formData.name.trim() || !formData.mobile.trim() || !formData.city.trim()) {
      setFeedback({
        type: 'error',
        message: 'Name, phone number, and city cannot be empty.',
      });
      setSaving(false);
      return;
    }

    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        name: formData.name,
        role: formData.role,
        mobile: formData.mobile,
        email: formData.email,
        city: formData.city,
        serviceAreas: formData.serviceAreas.split(',').map((s) => s.trim()).filter(Boolean),
        experienceYears: Number(formData.experienceYears) || prev.experienceYears,
        bio: formData.bio,
        languages: formData.languages.split(',').map((l) => l.trim()).filter(Boolean),
        dailyHours: formData.dailyHours,
      }));
      setSaving(false);
      setIsEditing(false);
      setFeedback({
        type: 'success',
        message: 'Worker profile details successfully updated and logged in the cooperative directory.',
      });
    }, 600);
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      role: profile.role,
      mobile: profile.mobile,
      email: profile.email,
      city: profile.city,
      serviceAreas: profile.serviceAreas.join(', '),
      experienceYears: profile.experienceYears,
      bio: profile.bio,
      languages: profile.languages.join(', '),
      dailyHours: profile.dailyHours,
    });
    setIsEditing(false);
    setFeedback(null);
  };

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-4xl">
        <BackendNotice
          title="Worker Profile Management"
          message="Worker profile updates are validated by the cooperative directory. Sensitive personal identification documents are isolated behind private secure vaults in compliance with Indian DPDP Act."
        />

        {/* Feedback Alert Banner */}
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
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-brand-border">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative group">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-brand-teal/40 shadow-sm"
                />
                <button
                  type="button"
                  title="Change profile photo"
                  className="absolute bottom-0 right-0 p-1.5 rounded-lg bg-[#202B2B] text-white shadow hover:bg-brand-teal transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-bold text-xl sm:text-2xl text-brand-primary">
                    {profile.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-brand-secondary font-medium mt-0.5">
                  {profile.role}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-brand-secondary">
                  <span className="font-mono bg-brand-bgSecondary px-2 py-0.5 rounded text-brand-primary">
                    {profile.id}
                  </span>
                  <span>• {profile.cooperativeUnit}</span>
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 rounded-xl bg-brand-bgSecondary hover:bg-brand-border text-brand-primary font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all self-stretch sm:self-auto justify-center"
              >
                <Edit3 className="w-4 h-4 text-brand-teal" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Profile Form / View */}
          <form onSubmit={handleSave} className="pt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs sm:text-sm text-brand-primary bg-white outline-none"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-secondary" />
                    <span>{profile.name}</span>
                  </div>
                )}
              </div>

              {/* Trade Title / Specialization */}
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Primary Trade Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs sm:text-sm text-brand-primary bg-white outline-none"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-brand-secondary" />
                    <span>{profile.role}</span>
                  </div>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Mobile Number (Masked to Customers)
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs sm:text-sm text-brand-primary bg-white outline-none"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-secondary" />
                    <span>{profile.mobile}</span>
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs sm:text-sm text-brand-primary bg-white outline-none"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-secondary" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Primary City Base
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs sm:text-sm text-brand-primary bg-white outline-none"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-secondary" />
                    <span>{profile.city}</span>
                  </div>
                )}
              </div>

              {/* Experience Years */}
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Verified Field Experience (Years)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    min="1"
                    max="50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs sm:text-sm text-brand-primary bg-white outline-none"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-secondary" />
                    <span>{profile.experienceYears} Years</span>
                  </div>
                )}
              </div>

              {/* Service Areas */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Active Service Areas (Comma-separated)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="serviceAreas"
                    value={formData.serviceAreas}
                    onChange={handleInputChange}
                    placeholder="e.g. Indiranagar, Koramangala, HSR Layout"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs sm:text-sm text-brand-primary bg-white outline-none"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-brand-bgSecondary/40">
                    {profile.serviceAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-brand-border text-xs text-brand-primary font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Languages Spoken */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Languages Spoken
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs sm:text-sm text-brand-primary bg-white outline-none"
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary flex items-center gap-2">
                    <Languages className="w-4 h-4 text-brand-secondary" />
                    <span>{profile.languages.join(' • ')}</span>
                  </div>
                )}
              </div>

              {/* Professional Introduction */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Short Professional Introduction
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs sm:text-sm text-brand-primary bg-white outline-none resize-none"
                  />
                ) : (
                  <div className="p-4 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary leading-relaxed">
                    {profile.bio}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons in Edit Mode */}
            {isEditing && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl border border-brand-border hover:bg-black/5 text-xs sm:text-sm font-semibold text-brand-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Data Protection & Privacy Notice Card */}
        <div className="bg-brand-bgSecondary/60 rounded-2xl p-5 border border-brand-border text-xs text-brand-secondary flex items-start gap-3">
          <Lock className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-brand-primary">
              Worker Privacy & Safety Guarantee (DPDP Act 2023)
            </h4>
            <p className="leading-relaxed">
              Your exact home address and private mobile number are encrypted and strictly hidden from customers.
              When executing customer assignments, communication is bridged through SahkarSathi's cooperative masked telephone routing.
            </p>
          </div>
        </div>
      </div>
    </WorkerLayout>
  );
}
