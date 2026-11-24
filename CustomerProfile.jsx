import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Plus, 
  Edit2, 
  Save, 
  CheckCircle2, 
  Trash2 
} from 'lucide-react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { mockCustomer, mockAddresses } from '../../data/customerMockData';
import { validateEmail, validatePhone } from '../../config/auth';

export default function CustomerProfile() {
  const [profile, setProfile] = useState({
    fullName: mockCustomer.fullName,
    email: mockCustomer.email,
    phone: mockCustomer.phone,
  });
  const [addresses, setAddresses] = useState(mockAddresses);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: '',
    street: '',
    area: '',
    city: 'New Delhi',
    postalCode: '',
    instructions: '',
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!profile.fullName.trim()) newErrors.fullName = 'Name cannot be empty';
    const emailErr = validateEmail(profile.email);
    if (emailErr) newErrors.email = emailErr;
    const phoneErr = validatePhone(profile.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.label || !newAddr.street || !newAddr.postalCode) return;

    const created = {
      id: `addr-${Date.now()}`,
      ...newAddr,
      isDefault: false,
    };

    setAddresses([...addresses, created]);
    setShowAddAddress(false);
    setNewAddr({ label: '', street: '', area: '', city: 'New Delhi', postalCode: '', instructions: '' });
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <CustomerLayout title="Customer Profile & Address Book">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-brand-teal text-white flex items-center justify-center font-display font-bold text-xl shadow-xs">
              PS
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display font-bold text-xl text-brand-primary">
                  {profile.fullName}
                </h2>
                <Badge variant="teal" size="sm">
                  Verified Resident
                </Badge>
              </div>
              <span className="text-xs text-brand-secondary font-mono block">
                Member ID: {mockCustomer.memberCode} • Joined {mockCustomer.joinedDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-brand-surface border border-brand-border text-xs font-semibold text-brand-primary hover:bg-white flex items-center gap-2 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-brand-secondary" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 text-xs font-semibold text-brand-emerald flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile information updated successfully.</span>
          </div>
        )}

        {/* Profile Form / Details View */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-subtle space-y-6">
          <h3 className="font-display font-bold text-base text-brand-primary pb-3 border-b border-brand-border">
            Personal & Account Information
          </h3>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                  />
                  {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                  />
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Button type="submit" variant="primary" size="sm" icon={Save}>
                  Save Changes
                </Button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-secondary hover:text-brand-primary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-brand-surface/70 border border-brand-border/60">
                <span className="text-brand-secondary block mb-0.5">Full Legal Name</span>
                <span className="font-bold text-brand-primary text-sm">{profile.fullName}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-brand-surface/70 border border-brand-border/60">
                <span className="text-brand-secondary block mb-0.5">Verified Email</span>
                <span className="font-bold text-brand-primary text-sm">{profile.email}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-brand-surface/70 border border-brand-border/60">
                <span className="text-brand-secondary block mb-0.5">Primary Mobile</span>
                <span className="font-bold text-brand-primary text-sm">{profile.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Saved Delivery Addresses */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <h3 className="font-display font-bold text-base text-brand-primary">
              Saved Property & Service Addresses
            </h3>
            <button
              type="button"
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="px-3 py-1.5 rounded-xl bg-brand-teal text-white text-xs font-bold hover:bg-brand-teal-light flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Add Address Form Drawer */}
          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="p-5 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
              <h4 className="font-bold text-xs text-brand-primary uppercase tracking-wider">
                Add Delivery Property
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Address Label (e.g. Vacation Villa, Parents' Home)"
                  value={newAddr.label}
                  onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                  className="p-2.5 rounded-xl bg-white border border-brand-border text-xs text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                />
                <input
                  type="text"
                  required
                  placeholder="Postal PIN Code"
                  value={newAddr.postalCode}
                  onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                  className="p-2.5 rounded-xl bg-white border border-brand-border text-xs text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                />
              </div>

              <input
                type="text"
                required
                placeholder="Street address / apartment flat / tower"
                value={newAddr.street}
                onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white border border-brand-border text-xs text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-secondary hover:text-brand-primary"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" size="sm">
                  Save Address
                </Button>
              </div>
            </form>
          )}

          {/* Address Cards List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-2xl bg-brand-surface/70 border border-brand-border flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-brand-primary">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <Badge variant="teal" size="sm">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-brand-secondary leading-relaxed">
                    {addr.street}, {addr.area}, {addr.city} – {addr.postalCode}
                  </p>
                  {addr.instructions && (
                    <span className="text-[10px] text-brand-secondary/80 block mt-2 italic">
                      Note: {addr.instructions}
                    </span>
                  )}
                </div>

                {!addr.isDefault && (
                  <div className="pt-3 mt-3 border-t border-brand-border/60 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
