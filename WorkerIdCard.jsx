import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  ShieldCheck,
  QrCode,
  Download,
  Share2,
  Lock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Award,
  Wrench
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockWorker } from '../../data/workerMockData';

export default function WorkerIdCard() {
  // Allow toggling between Verified state and Pending state for testing & demonstration
  const [isVerified, setIsVerified] = useState(mockWorker.verificationStatus === 'Approved');
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <BackendNotice
          title="Digital Worker ID & Tamper-Evident QR Credential"
          message="In accordance with project security instructions, unverified workers cannot view an approved badge. Use the prototype toggle below to evaluate both the locked state and the verified digital pass."
        />

        {/* State Toggle Controller (Development & Demonstration) */}
        <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant={isVerified ? 'emerald' : 'gold'} size="sm">
              Current Simulation: {isVerified ? 'Verified & Approved' : 'Pending Verification'}
            </Badge>
            <span className="text-xs text-brand-secondary">
              (Interactive Prototype Switcher)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsVerified(!isVerified)}
            className="px-3.5 py-1.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-primary hover:bg-black/5 transition-colors flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5 text-brand-teal" />
            <span>Switch to {isVerified ? 'Unverified / Pending' : 'Approved Pass'}</span>
          </button>
        </div>

        {/* UNVERIFIED STATE */}
        {!isVerified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-border text-center max-w-lg mx-auto shadow-sm space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-brand-primary">
                Worker ID Currently Locked
              </h2>
              <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed">
                Your Worker ID will be available after verification approval.
                Please ensure your profile is complete and all government documents are ratified by your assigned verification officer.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-brand-bgSecondary/60 border border-brand-border text-xs text-brand-secondary text-left space-y-1">
              <p className="font-semibold text-brand-primary">Why is this card locked?</p>
              <p>
                SahkarSathi prevents the generation of unauthorized credentials. Verified IDs are cryptographically signed to protect homeowner trust.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="/worker/verification"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-teal text-white hover:bg-brand-teal/90 text-xs font-semibold shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Go to Verification Center</span>
              </a>
            </div>
          </motion.div>
        )}

        {/* VERIFIED STATE — PREMIUM DIGITAL PASS */}
        {isVerified && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h1 className="font-display font-bold text-2xl text-brand-primary">
                Digital Cooperative Artisan Pass
              </h1>
              <p className="text-xs text-brand-secondary">
                Present this tamper-evident credential to homeowners upon arriving at the service site.
              </p>
            </div>

            {/* Interactive 3D Card Container */}
            <div className="flex justify-center py-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-gold/60 bg-gradient-to-br from-[#202B2B] via-[#243332] to-[#1C2525] text-white p-6 sm:p-7 relative select-none"
              >
                {/* Holographic Watermark / Seal */}
                <div className="absolute top-0 right-0 p-5 opacity-15 pointer-events-none">
                  <ShieldCheck className="w-36 h-36 text-brand-gold" />
                </div>

                {/* Card Top: Branding & Chip */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-brand-teal flex items-center justify-center text-white font-bold shadow-md">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-white tracking-wide">
                        SahkarSathi
                      </h3>
                      <p className="text-[10px] text-brand-gold font-sans font-medium uppercase tracking-widest">
                        Cooperative ID Pass
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30 font-semibold">
                    ✓ ACTIVE
                  </span>
                </div>

                {/* Card Middle: Photo, Name & Details */}
                <div className="py-5 flex items-center gap-4 relative z-10">
                  <div className="relative flex-shrink-0">
                    <img
                      src={mockWorker.avatar}
                      alt={mockWorker.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-gold shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#202B2B] flex items-center justify-center text-[10px]">
                      ✓
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-lg text-white truncate">
                      {mockWorker.name}
                    </h2>
                    <p className="text-xs text-brand-gold font-medium truncate">
                      {mockWorker.role}
                    </p>
                    <p className="text-[11px] font-mono text-gray-400 mt-1">
                      ID: {mockWorker.id}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-gray-300 mt-0.5">
                      <span>★ {mockWorker.rating}</span>
                      <span className="text-gray-500">•</span>
                      <span>{mockWorker.badgeLevel.split(' ')[0]} Artisan</span>
                    </div>
                  </div>
                </div>

                {/* Approved Trade Categories */}
                <div className="py-3 border-y border-white/10 relative z-10 space-y-1">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    Approved Trade Competencies:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-200 border border-white/10">
                      Electrical Services (Grade A)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-200 border border-white/10">
                      Solar Micro-Grid
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-200 border border-white/10">
                      Smart Automation
                    </span>
                  </div>
                </div>

                {/* Card Bottom: QR Code & Cryptographic Stamp */}
                <div className="pt-4 flex items-center justify-between relative z-10 text-[11px]">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400">Issue Date: <strong>15 Mar 2024</strong></p>
                    <p className="text-[10px] text-gray-400">Valid Through: <strong>31 Mar 2027</strong></p>
                    <p className="text-[9px] text-brand-teal font-mono">Unit #14 East Bangalore</p>
                  </div>

                  {/* Tamper-Evident QR Code Placeholder */}
                  <div className="p-1.5 rounded-xl bg-white flex items-center justify-center shadow">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://sahkarsathi.coop/verify/SS-WRK-7821"
                      alt="Verification QR"
                      className="w-14 h-14"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Actions: Download / Print / Share */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => alert(`Exporting cryptographically signed PDF pass for ${mockWorker.name}...`)}
                className="px-5 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Printable Card (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => alert('Cooperative public verification link copied to clipboard.')}
                className="px-5 py-2.5 rounded-xl bg-white border border-brand-border text-brand-primary hover:bg-brand-bgSecondary text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                <Share2 className="w-4 h-4 text-brand-teal" />
                <span>Share Verification Link</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </WorkerLayout>
  );
}
