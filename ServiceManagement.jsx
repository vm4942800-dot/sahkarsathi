/**
 * SahkarSathi Service Catalog Management
 * Add, edit, activate, deactivate services with live sync to Customer Dashboard
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid,
  Plus,
  Search,
  Edit,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Clock,
  Wrench,
  AlertTriangle,
  RefreshCw,
  X,
  Layers,
  Save,
  Check
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { adminService } from '../../services/adminService';
import { mockAdminUser } from '../../data/adminMockData';

const SERVICE_CATEGORIES = [
  'Critical Maintenance',
  'Interior & Woodwork',
  'Finishing & Coating',
  'Hygiene & Care',
  'Infrastructure',
  'Specialized Crafts',
  'Plumbing',
  'Electrical Services',
  'Carpentry',
  'Painting',
  'Cleaning',
  'Home Maintenance',
  'Construction Support',
  'Other Skilled Services'
];

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'Critical Maintenance',
    shortDesc: '',
    fullDesc: '',
    basePrice: 650,
    priceUnit: 'standard task',
    duration: '1-2 hrs',
    iconName: 'Wrench',
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await adminService.getServices();
      setServices(data);
    } catch (err) {
      console.warn('Failed to load services:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      id: '',
      title: '',
      category: 'Critical Maintenance',
      shortDesc: '',
      fullDesc: '',
      basePrice: 650,
      priceUnit: 'standard task',
      duration: '1-2 hrs',
      iconName: 'Wrench',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setFormData({
      id: srv.id,
      title: srv.title,
      category: srv.category,
      shortDesc: srv.shortDesc || '',
      fullDesc: srv.fullDesc || srv.shortDesc || '',
      basePrice: srv.basePrice,
      priceUnit: srv.priceUnit || 'standard task',
      duration: srv.duration || '1-2 hrs',
      iconName: srv.iconName || 'Wrench',
      isActive: srv.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category || !formData.basePrice) {
      setFeedback({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const saved = await adminService.saveService({
        service: formData,
        adminId: mockAdminUser.id,
        adminName: mockAdminUser.fullName,
      });

      setFeedback({
        type: 'success',
        text: `Service "${saved.title}" saved successfully. Synchronized live with the Customer Dashboard service catalog.`,
      });
      setIsModalOpen(false);
      loadServices();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (srv) => {
    try {
      const updated = await adminService.toggleServiceStatus({
        serviceId: srv.id,
        isActive: !srv.isActive,
        adminId: mockAdminUser.id,
        adminName: mockAdminUser.fullName,
      });

      setFeedback({
        type: 'success',
        text: `Service "${srv.title}" marked ${updated.isActive ? 'Active' : 'Inactive'}.`,
      });
      loadServices();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  const filteredServices = services.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.shortDesc?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || s.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        <BackendNotice
          title="Live Service Catalog & Cooperative Rate Card Governance"
          message="Modifications made here update the Customer Dashboard service catalog in real-time. Cooperative pricing follows non-surge itemized labor rate cards ratified by Craftsmen Chapter assemblies."
        />

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Service Catalog Engine
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                {services.length} Standardized Trades
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Service Management
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Manage trade disciplines, cooperative benchmark pricing, descriptions, and customer visibility.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between gap-3 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-brand-border shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-secondary absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search service title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-border bg-brand-surface/40 text-xs text-brand-primary focus:outline-none focus:bg-white"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-brand-border text-xs text-brand-primary bg-white focus:outline-none"
          >
            <option value="all">All Categories</option>
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((srv) => {
            const isActive = srv.isActive !== false;

            return (
              <div
                key={srv.id}
                className="bg-white rounded-3xl p-6 border border-brand-border shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary bg-brand-surface px-2.5 py-1 rounded-lg border border-brand-border">
                      {srv.category}
                    </span>
                    <Badge variant={isActive ? 'emerald' : 'neutral'} size="sm">
                      {isActive ? 'Active in Catalog' : 'Hidden'}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-brand-primary">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-brand-secondary mt-1 line-clamp-2 leading-relaxed">
                      {srv.shortDesc}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                        Base Rate
                      </span>
                      <span className="font-mono font-bold text-base text-brand-primary">
                        ₹{srv.basePrice}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-brand-secondary uppercase tracking-wider block">
                        Duration
                      </span>
                      <span className="font-semibold text-brand-secondary">
                        {srv.duration || '1-2 hrs'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-border flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(srv)}
                    className="flex-1 py-2 px-3 rounded-xl border border-brand-border text-brand-primary hover:bg-black/5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(srv)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add / Edit Service Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-brand-border shadow-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <h3 className="font-display font-bold text-lg text-brand-primary">
                  {editingService ? 'Edit Service Details' : 'Add New Cooperative Service'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 text-brand-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-brand-primary mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Automation Inverter Installation"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border text-brand-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-emerald/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-brand-primary mb-1">
                      Trade Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-brand-border text-brand-primary text-xs bg-white focus:outline-none"
                    >
                      {SERVICE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-brand-primary mb-1">
                      Cooperative Base Rate (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-brand-border text-brand-primary text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-emerald/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-brand-primary mb-1">
                      Standard Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1-2 hrs, 3-4 hrs"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-brand-border text-brand-primary text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-brand-primary mb-1">
                      Price Unit
                    </label>
                    <input
                      type="text"
                      placeholder="standard task, per point, sqft"
                      value={formData.priceUnit}
                      onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-brand-border text-brand-primary text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-brand-primary mb-1">
                    Short Description (For Cards)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief overview shown on browsing cards..."
                    value={formData.shortDesc}
                    onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border text-brand-primary text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-primary mb-1">
                    Full Description & Inclusions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Comprehensive breakdown of service steps, safety protocols, and warranty..."
                    value={formData.fullDesc}
                    onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border text-brand-primary text-xs focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-brand-primary block">
                      Active Customer Visibility
                    </span>
                    <span className="text-brand-secondary text-[11px]">
                      Show in the Customer Dashboard service catalog
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-brand-emerald rounded border-brand-border"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-brand-border text-brand-secondary hover:text-brand-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save to Catalog</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
