/**
 * SahkarSathi Worker Verification Center
 * Document review, NSQF verification, approval, rejection, and ID card activation
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Eye,
  Lock,
  Calendar,
  Phone,
  Briefcase,
  X,
  ExternalLink,
  Info
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { adminService } from '../../services/adminService';
import { mockAdminUser } from '../../data/adminMockData';

export default function VerificationManagement() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [decisionModal, setDecisionModal] = useState({ isOpen: false, action: null, app: null });
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingVerifications();
      setVerifications(data);
    } catch (err) {
      console.warn('Failed to load verifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProcessDecision = async () => {
    const { action, app } = decisionModal;
    if (action === 'reject' && !rejectionReason.trim()) {
      setFeedback({ type: 'error', text: 'Documented rejection reason is mandatory.' });
      return;
    }

    setActionLoading(true);
    setFeedback(null);
    try {
      await adminService.processVerification({
        applicationId: app.id,
        workerId: app.workerId,
        action,
        reviewNotes,
        rejectionReason,
        adminId: mockAdminUser.id,
        adminName: mockAdminUser.fullName,
      });

      setFeedback({
        type: 'success',
        text: `Application for ${app.fullName} (${app.workerId}) processed successfully with decision: ${action.toUpperCase()}. Action logged to immutable audit stream.`,
      });
      setDecisionModal({ isOpen: false, action: null, app: null });
      setReviewNotes('');
      setRejectionReason('');
      setSelectedApp(null);
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        <BackendNotice
          title="National Skill Qualification Framework (NSQF) Verification Center"
          message="Artisans cannot receive automated dispatches or verified digital ID cards without formal compliance verification. Documents are stored in encrypted private buckets; access is restricted to verified verification officers."
        />

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Compliance & Quality Desk
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                Reviewer: {mockAdminUser.fullName}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Worker Verification Management
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Examine government identity credentials, trade certifications, and on-site practical test logs prior to granting craftsman accreditation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              {verifications.filter((v) => v.status === 'pending').length} Pending Review
            </span>
          </div>
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

        {/* Verification Applications List */}
        <div className="space-y-4">
          {verifications.map((app) => {
            const isPending = app.status === 'pending';
            const isApproved = app.status === 'approved';

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-6 border border-brand-border shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-primary bg-brand-surface px-2 py-0.5 rounded border border-brand-border">
                      {app.workerId}
                    </span>
                    <Badge
                      variant={isApproved ? 'emerald' : isPending ? 'gold' : 'danger'}
                      size="sm"
                    >
                      {app.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-brand-secondary font-mono">
                      Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-brand-primary">
                    {app.fullName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-brand-secondary">
                    <span>
                      Trade: <strong className="text-brand-primary">{app.trade}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Experience: <strong className="text-brand-primary">{app.experienceYears} Years</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Chapter: <strong className="text-brand-primary">{app.cooperativeUnit}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-brand-secondary max-w-2xl bg-brand-surface/60 p-2.5 rounded-xl border border-brand-border/60">
                    <strong className="text-brand-primary">Field Reviewer Notes: </strong>
                    {app.reviewerNotes}
                  </p>
                </div>

                {/* Document Pill List & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(app)}
                    className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-primary hover:bg-black/5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-brand-emerald" />
                    <span>Inspect {app.documents?.length || 2} Documents</span>
                  </button>

                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDecisionModal({ isOpen: true, action: 'approve', app })
                        }
                        className="px-4 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold shadow-sm transition-colors flex-1 sm:flex-initial"
                      >
                        Approve & Issue ID
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDecisionModal({ isOpen: true, action: 'reject', app })
                        }
                        className="px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-semibold transition-colors"
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDecisionModal({ isOpen: true, action: 'request_resubmission', app })
                        }
                        className="px-3 py-2.5 rounded-xl border border-brand-border text-brand-secondary hover:text-brand-primary hover:bg-brand-surface text-xs font-semibold"
                        title="Request Document Resubmission"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Private Document Viewer Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl bg-white rounded-3xl border border-brand-border shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <div>
                  <Badge variant="emerald" size="sm">
                    Private Vault Document Inspector
                  </Badge>
                  <h3 className="font-display font-bold text-xl text-brand-primary mt-1">
                    {selectedApp.fullName} ({selectedApp.workerId})
                  </h3>
                  <span className="text-xs text-brand-secondary font-mono">
                    {selectedApp.trade} • {selectedApp.cooperativeUnit}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-xl hover:bg-black/5 text-brand-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Confidential Verification Material: </strong>
                  Aadhaar and personal identity numbers are strictly redacted. Document download is tracked in compliance logs under UIDAI and DPDP Act guidelines.
                </span>
              </div>

              {/* Documents List */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary block">
                  Submitted Credentials:
                </span>

                {selectedApp.documents?.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-border flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-brand-border flex items-center justify-center text-brand-primary">
                        <FileText className="w-5 h-5 text-brand-emerald" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-brand-primary">
                          {doc.type}
                        </h4>
                        <span className="text-[11px] text-brand-secondary font-mono block">
                          {doc.fileName} • {doc.fileSize}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        alert(`Opening secure preview for ${doc.fileName} from private bucket worker-verification-docs...`)
                      }
                      className="px-3 py-1.5 rounded-xl border border-brand-border bg-white text-brand-primary hover:bg-black/5 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3 text-brand-emerald" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl border border-brand-border text-xs text-brand-secondary hover:text-brand-primary"
                >
                  Close Vault
                </button>

                {selectedApp.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => {
                      setDecisionModal({ isOpen: true, action: 'approve', app: selectedApp });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    Approve Credentials
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Decision Modal (Approve, Reject, Resubmit) */}
        {decisionModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-white rounded-3xl border border-brand-border shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                {decisionModal.action === 'approve' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : decisionModal.action === 'reject' ? (
                  <XCircle className="w-6 h-6 text-rose-600" />
                ) : (
                  <RotateCcw className="w-6 h-6 text-amber-600" />
                )}
                <h3 className="font-display font-bold text-lg text-brand-primary capitalize">
                  {decisionModal.action.replace('_', ' ')} Verification
                </h3>
              </div>

              <p className="text-xs text-brand-secondary leading-relaxed">
                Applying verification decision for candidate{' '}
                <strong>{decisionModal.app?.fullName}</strong> ({decisionModal.app?.workerId}).
                {decisionModal.action === 'approve' &&
                  ' This will activate the digital craftsman ID card, issue their trade badge, and enable automatic job dispatches.'}
              </p>

              {decisionModal.action === 'reject' && (
                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1">
                    Rejection Reason (Mandatory):
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Expired safety credential, failed practical weld test..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-brand-border text-xs text-brand-primary focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Compliance Officer Notes (Appended to Audit Trail):
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. NSQF Level 5 confirmed with National Skill Development Registry..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-border text-xs text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-emerald/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDecisionModal({ isOpen: false, action: null, app: null })}
                  className="px-4 py-2 rounded-xl border border-brand-border text-xs text-brand-secondary hover:text-brand-primary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleProcessDecision}
                  className={`px-5 py-2 rounded-xl text-white text-xs font-bold transition-colors ${
                    decisionModal.action === 'approve'
                      ? 'bg-brand-emerald hover:bg-brand-emeraldDark'
                      : decisionModal.action === 'reject'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {actionLoading ? 'Recording...' : 'Confirm Decision'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
