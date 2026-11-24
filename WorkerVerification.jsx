import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  UserCheck,
  CreditCard,
  ChevronRight,
  ExternalLink,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { verificationStages, mockWorker } from '../../data/workerMockData';

export default function WorkerVerification() {
  const [currentStage, setCurrentStage] = useState(mockWorker.verificationStage); // 5 = Approved & Issued
  const [verificationStatus, setVerificationStatus] = useState(mockWorker.verificationStatus); // 'Approved'
  const [selectedDocType, setSelectedDocType] = useState('Govt Photo ID (Aadhaar / Voter ID / Driving License)');
  const [demoUploaded, setDemoUploaded] = useState(false);

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    setDemoUploaded(true);
    setTimeout(() => {
      alert('Frontend Simulation: Sample test metadata registered. Real identity documents are NEVER collected in frontend testing.');
      setDemoUploaded(false);
    }, 1000);
  };

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="5-Stage Worker Identity & Skill Verification Standard"
          message="This workflow demonstrates the 5 verification stages mandated by SahkarSathi bylaws. Under the Digital Personal Data Protection Act 2023, identity papers are NEVER stored in browser localStorage or unencrypted frontend state."
        />

        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <Badge variant="emerald" size="sm">
                Status: {verificationStatus}
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                Verification ID: VER-IN-8890
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Worker Credential Verification
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Complete all five verification tiers to unlock the SahkarSathi Gold Artisan seal, priority dispatching, and digital worker pass.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DPDP Act 2023 Compliant</span>
          </div>
        </div>

        {/* 5-Stage Stepper Visual Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm">
          <h3 className="font-display font-bold text-base text-brand-primary mb-6">
            Verification Pathway Progress (Stage {currentStage} of 5)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {verificationStages.map((stage) => {
              const isPast = stage.step <= currentStage;
              const isCurrent = stage.step === currentStage;

              return (
                <div
                  key={stage.step}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isPast
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                      : isCurrent
                      ? 'bg-brand-bgSecondary border-brand-teal ring-2 ring-brand-teal/20'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-brand-border">
                        Stage 0{stage.step}
                      </span>
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <h4 className="font-display font-bold text-xs sm:text-sm mt-1">
                      {stage.title}
                    </h4>
                    <p className="text-[11px] opacity-80 mt-1 leading-snug">
                      {stage.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-brand-border/40 text-[10px] font-semibold uppercase tracking-wider">
                    {isPast ? 'Verified & Complete' : 'Upcoming Step'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Stage 2 & 3 Sandbox Inspection Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Submission Interface */}
          <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-brand-primary">
                  Document Submission Vault
                </h3>
                <p className="text-[11px] text-brand-secondary">
                  Encrypted endpoint dispatch to State Verification Board
                </p>
              </div>
            </div>

            <form onSubmit={handleSimulateUpload} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Document Category
                </label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-primary outline-none focus:ring-2 focus:ring-brand-teal"
                >
                  <option>Govt Photo ID (Aadhaar / Voter ID / Driving License)</option>
                  <option>ITI / State Directorate Trade Certificate</option>
                  <option>NABL Grade Wireman License</option>
                  <option>Police Verification Clearance Certificate</option>
                </select>
              </div>

              {/* Secure Drag & Drop Zone Demo */}
              <div className="border-2 border-dashed border-brand-border rounded-2xl p-6 text-center hover:border-brand-teal/50 transition-colors bg-brand-bgSecondary/30">
                <Upload className="w-8 h-8 text-brand-teal mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-brand-primary text-xs">
                  Upload Prototype Verification Document
                </p>
                <p className="text-[11px] text-brand-secondary mt-1">
                  PDF, JPG or PNG up to 10MB (Protected 256-bit TLS upload)
                </p>
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 rounded-lg bg-white border border-brand-border text-[11px] text-brand-secondary font-mono">
                    Aadhaar_Masked_Sample.pdf (Verified)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={demoUploaded}
                className="w-full py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{demoUploaded ? 'Simulating Secure Transport...' : 'Submit Document for Officer Audit'}</span>
              </button>
            </form>
          </div>

          {/* Verification Audit Details */}
          <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-brand-primary">
                  Supervisory Review & Ratification
                </h3>
                <p className="text-[11px] text-brand-secondary">
                  Audited by East Bangalore Craftsmen Council
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-brand-secondary">Verification Officer:</span>
                <strong className="text-brand-primary">Vikramaditya Rao (ID: VO-098)</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-secondary">Practical Field Test:</span>
                <span className="text-emerald-700 font-semibold">Passed (96/100 Grade A)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-secondary">Police Clearance Check:</span>
                <span className="text-emerald-700 font-semibold">Clean (Ref: BLR-PCC-2024-81)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-secondary">Audit Decision:</span>
                <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  Unanimously Ratified
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs">
              <p className="font-semibold mb-1">Worker ID Pass Ready</p>
              <p className="text-[11px] leading-relaxed">
                Your verification has achieved Stage 5. You are permitted to view and present your digital cooperative pass to customers.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Indian DPDP Act Mandatory Notice */}
        <div className="bg-brand-bgSecondary/60 rounded-3xl p-6 border border-brand-border text-xs text-brand-secondary space-y-2">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
            <Lock className="w-4 h-4 text-brand-teal" />
            <span>Digital Personal Data Protection (DPDP) Act Compliance Protocols</span>
          </div>
          <p className="leading-relaxed">
            1. <strong>No Local Storage of Identity Artifacts:</strong> Government identity numbers and raw image files are never stored in browser cookies or localStorage.
          </p>
          <p className="leading-relaxed">
            2. <strong>Role-Based Access Control:</strong> Only sworn cooperative verification officers hold access keys to decrypt audit documentation.
          </p>
          <p className="leading-relaxed">
            3. <strong>Right to Erasure:</strong> Workers who deregister from the cooperative may request complete expungement of biometric and identity records.
          </p>
        </div>
      </div>
    </WorkerLayout>
  );
}
