import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  FileCheck2, 
  Award, 
  Users2, 
  CheckCircle, 
  Sparkles,
  ClipboardList,
  Eye,
  Lock,
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function TrustVerificationSection() {
  const [selectedProtocol, setSelectedProtocol] = useState(0);

  const verificationProtocols = [
    {
      id: 'identity',
      title: 'Worker Identity Verification',
      label: 'Multi-Point Vetting Protocol',
      icon: Fingerprint,
      color: 'teal',
      description: 'Comprehensive identity verification through government-issued identification records, residential confirmation, and civil background audits.',
      features: [
        'National ID & biometric registry verification',
        'Civil record and court background screening',
        'Physical residential footprint check by field supervisor',
        'Active mobile biometric authentication',
      ],
      auditDetail: 'Cross-referenced against verified public identity databases prior to issuing any dispatch credentials.',
    },
    {
      id: 'document',
      title: 'Document & Skill Assessment',
      label: 'Competence Validation System',
      icon: FileCheck2,
      color: 'emerald',
      description: 'Evaluation of vocational diplomas, apprenticeship certificates, and practical trade testing overseen by certified master craftsmen.',
      features: [
        'Trade licensing and vocational certification checks',
        'Practical skills audition with master craftsman committee',
        'Tool condition and electrical safety gear compliance audit',
        'Mandatory cooperative code of conduct adherence training',
      ],
      auditDetail: 'Scored on a rigorous 100-point trade rubric; only tradespeople meeting 85%+ benchmarks are certified.',
    },
    {
      id: 'coordination',
      title: 'Reliable Project Coordination',
      label: 'On-Site Quality Oversight',
      icon: ClipboardList,
      color: 'gold',
      description: 'Designated cooperative supervisors ensure material authenticity, track milestone schedules, and perform pre-handover quality checks.',
      features: [
        'Clear milestone breakdown with documented photo updates',
        'On-site safety protocols and hazard reduction checks',
        'Material quality audit and transparent invoice verification',
        'Formal joint customer sign-off protocol before completion',
      ],
      auditDetail: 'Supervisors remain physically accessible for on-site quality resolution throughout the job.',
    },
    {
      id: 'confidence',
      title: 'Customer Confidence & Fair Escrow',
      label: 'Protected Transaction Framework',
      icon: Lock,
      color: 'teal',
      description: 'Payments remain safely in cooperative escrow until customer satisfaction and supervisor validation milestones are confirmed.',
      features: [
        'No advance demands for uncommenced labor',
        'Itemized material vs. labor fee receipts',
        'Rapid cooperative dispute mediation panel',
        'Platform service guarantee coverage pool',
      ],
      auditDetail: 'Escrow release requires dual confirmation from the homeowner and supervisor.',
    },
  ];

  return (
    <section id="verification" className="py-20 md:py-28 bg-brand-surface/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Standardized Governance"
          badgeIcon={ShieldCheck}
          badgeVariant="teal"
          title="The SahkarSathi"
          highlight="Worker Verification System"
          subtitle="A comprehensive four-pillar verification system establishing authentic trust, technical competence, and transparent accountability on every single job."
          align="center"
          className="mb-14"
        />

        {/* 4 Protocol Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {verificationProtocols.map((protocol, index) => {
            const Icon = protocol.icon;
            const isSelected = selectedProtocol === index;

            return (
              <motion.div
                key={protocol.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedProtocol(index)}
                className={`cursor-pointer rounded-3xl p-7 sm:p-9 transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-white border-brand-teal shadow-premium ring-1 ring-brand-teal/20'
                    : 'bg-white/80 border-brand-border hover:bg-white hover:border-brand-teal/30 shadow-subtle'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-brand-border/70 flex items-center justify-center text-brand-teal shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={protocol.color} size="sm">
                      {protocol.label}
                    </Badge>
                  </div>

                  <h3 className="font-display text-xl font-bold text-brand-primary mb-3">
                    {protocol.title}
                  </h3>

                  <p className="text-sm text-brand-secondary leading-relaxed mb-6">
                    {protocol.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-brand-border/60">
                    {protocol.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-2.5 text-xs text-brand-primary/90 font-medium">
                        <CheckCircle className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-brand-surface/60 border border-brand-border/50 text-[11px] text-brand-secondary">
                    <span className="font-semibold text-brand-primary">Audit Rule: </span>
                    {protocol.auditDetail}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs text-brand-secondary">
                  <span className="font-mono text-[11px] uppercase tracking-wider">
                    Protocol Spec 0{index + 1}
                  </span>
                  <span className="text-brand-teal font-semibold">Active Standard</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Informative Assurance Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-brand-border shadow-xs text-xs text-brand-secondary">
            <span className="flex items-center gap-1.5 font-semibold text-brand-primary">
              <Eye className="w-4 h-4 text-brand-teal" />
              Public Verification Registry
            </span>
            <span className="hidden sm:inline-block text-brand-border">•</span>
            <span>Homeowners can inspect technician badge IDs and supervisor assignments prior to service delivery.</span>
            <Button
              to="/verify"
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              className="text-xs p-0 text-brand-teal font-semibold hover:bg-transparent"
            >
              Verify a Badge
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
