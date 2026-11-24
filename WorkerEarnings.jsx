import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Download,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Filter
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockEarnings, mockWorker } from '../../data/workerMockData';

export default function WorkerEarnings() {
  const [filterPeriod, setFilterPeriod] = useState('All');

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Worker Cooperative Payout & Escrow Ledger"
          message="Under the SahkarSathi cooperative model, 100% of agreed customer labor fees are transferred to workers with zero commission deductions. Payments are held safely in escrow until customer & supervisor sign-off."
        />

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" size="sm">
                Direct Bank / UPI Settlement
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                {mockEarnings.payoutSchedule}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Earnings & Settlement Ledger
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Real-time audit log of customer deposits, supervisor milestone sign-offs, and automatic bank credits.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert('Generating annual cooperative dividend & GST statement...')}
            className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-primary hover:bg-black/5 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors self-stretch sm:self-auto justify-center"
          >
            <Download className="w-4 h-4 text-brand-teal" />
            <span>Download Annual Slip</span>
          </button>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Lifetime Earnings */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">
              Total Lifetime Earned
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-brand-primary mt-1">
              {mockEarnings.totalEarnings}
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              Across {mockEarnings.completedJobsCount} verified assignments
            </span>
          </div>

          {/* This Month's Payouts */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">
              This Month's Income
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
              {mockEarnings.thisMonth}
            </p>
            <span className="text-[11px] text-emerald-800 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% from last month</span>
            </span>
          </div>

          {/* Held in Escrow */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">
              Held in Customer Escrow
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
              {mockEarnings.escrowPending}
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              1 job in progress
            </span>
          </div>

          {/* Welfare Dividend */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">
              Cooperative Dividend
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-brand-gold mt-1">
              {mockEarnings.coopBenefitDividend}
            </p>
            <span className="text-[11px] text-brand-secondary mt-1 block">
              Quarterly profit share pool
            </span>
          </div>
        </div>

        {/* Transaction History Ledger */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
            <div>
              <h3 className="font-display font-bold text-lg text-brand-primary">
                Settlement History & Transactions
              </h3>
              <p className="text-xs text-brand-secondary">
                Direct NEFT / UPI settlement records from the cooperative clearing house.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-brand-secondary">Show:</span>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-brand-border text-xs text-brand-primary bg-white outline-none"
              >
                <option value="All">All Transactions</option>
                <option value="Credits">Credits Only</option>
                <option value="Deductions">Cooperative Pool</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-brand-border">
            {mockEarnings.transactions.map((tx) => (
              <div
                key={tx.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      tx.status === 'Credited'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {tx.status === 'Credited' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-primary text-xs sm:text-sm">
                      {tx.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-brand-secondary mt-0.5">
                      <span className="font-mono">{tx.id}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span
                    className={`font-display font-bold text-base ${
                      tx.status === 'Credited' ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {tx.amount}
                  </span>
                  <span className="text-[10px] text-brand-secondary block font-mono">
                    {tx.status === 'Credited' ? 'Settled to UPI' : 'Welfare Shield'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WorkerLayout>
  );
}
