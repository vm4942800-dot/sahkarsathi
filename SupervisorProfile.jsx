import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ShieldCheck,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  HardHat,
  Lock,
  Camera
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockSupervisor } from '../../data/supervisorMockData';

export default function SupervisorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockSupervisor);
  const [formData, setFormData] = useState({
    name: mockSupervisor.name,
    role: mockSupervisor.role,
    mobile: mockSupervisor.mobile,
    email: mockSupervisor.email,
    cooperativeUnit: mockSupervisor.cooperativeUnit,
    region: mockSupervisor.region,
    serviceAreas: mockSupervisor.serviceAreas.join(', '),
    experienceYears: mockSupervisor.experienceYears,
    bio: mockSupervisor.bio,
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    if (!formData.name.trim() || !formData.mobile.trim() || !formData.email.trim()) {
      setFeedback({
        type: 'error',
        message: 'Name, phone number, and email cannot be empty.',
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
        cooperativeUnit: formData.cooperativeUnit,
        region: formData.region,
        serviceAreas: formData.serviceAreas.split(',').map((s) => s.trim()).filter(Boolean),
        experienceYears: Number(formData.experienceYears) || prev.experienceYears,
        bio: formData.bio,
      }));
      setSaving(false);
      setIsEditing(false);
      setFeedback({
        type: 'success',
        message: 'Supervisor profile and regional jurisdiction successfully updated.',
      });
    }, 600);
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      role: profile.role,
      mobile: profile.mobile,
      email: profile.email,
      cooperativeUnit: profile.cooperativeUnit,
      region: profile.region,
      serviceAreas: profile.serviceAreas.join(', '),
      experienceYears: profile.experienceYears,
      bio: profile.bio,
    });
    setIsEditing(false);
    setFeedback(null);
  };

  return (
    <SupervisorLayout>
      <div className="space-y-6 max-w-4xl">
        <BackendNotice
          title="Supervisor Profile & Field Jurisdiction"
          message="Supervisory credentials certify on-site safety, labor dispute arbitration, and project milestone completion under SahkarSathi bylaws."
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
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-brand-border">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative group">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-brand-emerald/40 shadow-sm"
                />
                <button
                  type="button"
                  title="Change profile photo"
                  className="absolute bottom-0 right-0 p-1.5 rounded-lg bg-[#202B2B] text-white shadow hover:bg-brand-emerald transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-bold text-xl sm:text-2xl text-brand-primary">
                    {profile.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Certified Inspector
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
                <Edit3 className="w-4 h-4 text-brand-emerald" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="pt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-emerald text-xs sm:text-sm text-brand-primary bg-white outline-none"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-secondary" />
                    <span>{profile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Supervisory Role
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-emerald text-xs sm:text-sm text-brand-primary bg-white outline-none"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-brand-secondary" />
                    <span>{profile.role}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Official Mobile Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-emerald text-xs sm:text-sm text-brand-primary bg-white outline-none"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-secondary" />
                    <span>{profile.mobile}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Official Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-emerald text-xs sm:text-sm text-brand-primary bg-white outline-none"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-secondary" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Assigned Cooperative Wing
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="cooperativeUnit"
                    value={formData.cooperativeUnit}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-emerald text-xs sm:text-sm text-brand-primary bg-white outline-none"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary flex items-center gap-2">
                    <HardHat className="w-4 h-4 text-brand-secondary" />
                    <span>{profile.cooperativeUnit}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Years of Engineering / Supervisory Experience
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-emerald text-xs sm:text-sm text-brand-primary bg-white outline-none"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-secondary" />
                    <span>{profile.experienceYears} Years</span>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Active Service Areas Monitored
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="serviceAreas"
                    value={formData.serviceAreas}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-emerald text-xs sm:text-sm text-brand-primary bg-white outline-none"
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

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Professional Supervisory Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-emerald text-xs sm:text-sm text-brand-primary bg-white outline-none resize-none"
                  />
                ) : (
                  <div className="p-4 rounded-xl bg-brand-bgSecondary/40 text-xs sm:text-sm text-brand-primary leading-relaxed">
                    {profile.bio}
                  </div>
                )}
              </div>
            </div>

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
                  className="px-6 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emerald/90 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Updating...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Security & Access Restriction Notice */}
        <div className="bg-brand-bgSecondary/60 rounded-2xl p-5 border border-brand-border text-xs text-brand-secondary flex items-start gap-3">
          <Lock className="w-5 h-5 text-brand-emerald flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-brand-primary">
              Restricted Supervisory Authority
            </h4>
            <p className="leading-relaxed">
              Supervisors only hold access to field logs and inspection data for workers and homeowners registered within their authorized cooperative jurisdiction (East Zone Unit #14).
            </p>
          </div>
        </div>
      </div>
    </SupervisorLayout>
  );
}
