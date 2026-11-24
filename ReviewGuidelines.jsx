import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Scale, 
  HeartHandshake, 
  ArrowLeft,
  Lock,
  MessageSquare
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function ReviewGuidelines() {
  return (
    <div className="min-h-screen bg-brand-surface text-brand-primary flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Back Link */}
        <Link
          to="/customer/reviews"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-teal hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reviews</span>
        </Link>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            Fair, Transparent & Cooperative Standards
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-primary tracking-tight">
            SahkarSathi Community Review Guidelines & Policy
          </h1>
          <p className="text-sm text-brand-secondary leading-relaxed max-w-2xl">
            SahkarSathi is built on mutual dignity between homeowners and cooperative artisans. Our review system ensures authentic, constructive feedback while protecting workers from unjustified harassment.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What We Encourage */}
          <div className="p-6 rounded-3xl bg-white border border-emerald-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3>What We Encourage</h3>
            </div>
            <ul className="space-y-3 text-xs text-brand-secondary leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span><strong>Authentic Service Details:</strong> Mention technical accuracy, site clean-up, adherence to safety standards, and punctuality.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span><strong>Honest Critical Feedback:</strong> If a job had delays or required rework, describe it respectfully. Honest criticism helps artisans improve and is never deleted.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span><strong>Professional Worker Responses:</strong> Artisans are encouraged to thank customers or constructively explain any technical site challenges.</span>
              </li>
            </ul>
          </div>

          {/* Prohibited Content */}
          <div className="p-6 rounded-3xl bg-white border border-rose-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
              <XCircle className="w-5 h-5 text-rose-600" />
              <h3>Strictly Prohibited</h3>
            </div>
            <ul className="space-y-3 text-xs text-brand-secondary leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <span><strong>Profanity & Personal Insults:</strong> Abusive language, derogatory remarks on caste/religion/community, or character attacks violate cooperative bylaws.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <span><strong>Private Information (DPDP Act):</strong> Do not publish phone numbers, residential addresses, Aadhaar numbers, or personal banking credentials.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <span><strong>Fabricated or Competitor Reviews:</strong> Reviews must be strictly tied to genuine, completed cooperative dispatches. Incomplete or unverified bookings are blocked.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Review Verification & Moderation Policy */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border space-y-5">
          <div className="flex items-center gap-2.5 text-brand-primary">
            <ShieldCheck className="w-6 h-6 text-brand-teal" />
            <h2 className="font-display font-bold text-xl">How Review Moderation Works</h2>
          </div>

          <div className="space-y-3 text-xs text-brand-secondary leading-relaxed">
            <p>
              1. <strong>Verification Gate:</strong> You can only review an artisan if you have a verified, completed booking in the system. Cancelled, rejected, or ongoing bookings cannot receive reviews.
            </p>
            <p>
              2. <strong>One Review Per Dispatch:</strong> Each customer can submit only one review per artisan per completed booking, preventing duplicate score inflation or brigading.
            </p>
            <p>
              3. <strong>Neutral Grievance Committee:</strong> If a review or worker response contains explicit policy violations, either party or an administrator can submit a confidential report.
            </p>
            <p>
              4. <strong>Immutable Audit Trails:</strong> Platform administrators cannot silently alter star ratings or manipulate rankings. Any moderation action (such as temporarily hiding a review that violates privacy) is recorded in immutable audit logs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-surface/70 border border-brand-border flex items-center justify-between text-xs">
            <span className="text-brand-secondary">
              Questions regarding cooperative bylaws or review disputes?
            </span>
            <Link
              to="/customer/support"
              className="text-brand-teal font-bold hover:text-brand-primary transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
