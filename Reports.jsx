import React from 'react';
import { motion } from 'framer-motion';
import {
  FileSpreadsheet,
  Download,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  AlertTriangle,
  Users,
  Award
} from 'lucide-react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockReportsData, mockSupervisor } from '../../data/supervisorMockData';

export default function Reports() {
  return (
    <SupervisorLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Supervisory Workforce & Project Quality Intelligence"
          message="Aggregated quality assurance metrics for Unit #14. Data is compiled from physical field audits, homeowner feedback slips, and safety inspections."
        />

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="teal" size="sm">
                Quality Audit Score: {mockSupervisor.qualityScore}%
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                East Bangalore Regional Directorate
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Reports & Quality Analytics
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Inspection records, dispute resolution rates, and monthly cooperative project volume.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert('Generating supervisory monthly audit report in PDF...')}
            className="px-4 py-2.5 rounded-xl bg-brand-emerald text-white hover:bg-brand-emerald/90 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all self-stretch sm:self-auto justify-center"
          >
            <Download className="w-4 h-4" />
            <span>Export Executive Audit PDF</span>
          </button>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">Completion Rate</span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-brand-primary mt-1">
              {mockReportsData.completionRate}
            </p>
            <span className="text-[11px] text-emerald-800 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Above state benchmark</span>
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">On-Time Delivery</span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-brand-primary mt-1">
              {mockReportsData.onTimeDeliveryRate}
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              Within scheduled target window
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">Inspected Projects</span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
              {mockReportsData.totalInspectedProjects}
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              100% Passed safety audit
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">Mean Artisan Rating</span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-brand-gold mt-1">
              ★ {mockReportsData.averageArtisanScore}
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              Across 142 customer reviews
            </span>
          </div>
        </div>

        {/* Monthly Project Volume & Budget Bar Visualization */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-5">
          <div>
            <h3 className="font-display font-bold text-lg text-brand-primary">
              Monthly Project Volume & Escrow Throughput
            </h3>
            <p className="text-xs text-brand-secondary">
              Summary of completed multi-trade infrastructure jobs certified under Unit #14
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {mockReportsData.monthlyTrend.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-brand-primary font-semibold">{item.month}</span>
                  <div className="flex items-center gap-4 text-brand-secondary">
                    <span>{item.completed} Projects Handed Over</span>
                    <strong className="text-emerald-700 font-mono">{item.budget}</strong>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-brand-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-emerald"
                    style={{ width: `${item.completed * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Compliance & Safety Audits Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-display font-bold text-base text-brand-primary">
              Bureau of Indian Standards (BIS) Safety Audit Log
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-brand-secondary">
            <div className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border space-y-1">
              <strong className="text-brand-primary block text-sm">IS 732 Electrical Wiring Compliance</strong>
              <p className="text-[11px]">Zero insulation leakage incidents recorded across 24 inspected residential installations.</p>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded inline-block mt-1">
                ✓ 100% Conforming
              </span>
            </div>

            <div className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border space-y-1">
              <strong className="text-brand-primary block text-sm">IS 3043 Ground Earthing Verification</strong>
              <p className="text-[11px]">All copper earthing rods tested with 3-terminal earth resistance tester (under 2 Ohms verified).</p>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded inline-block mt-1">
                ✓ 100% Conforming
              </span>
            </div>
          </div>
        </div>
      </div>
    </SupervisorLayout>
  );
}
