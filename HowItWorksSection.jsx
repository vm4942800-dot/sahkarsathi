import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  FileCheck, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';

export default function HowItWorksSection() {
  const [selectedStep, setSelectedStep] = useState(1);

  const steps = [
    {
      number: '01',
      title: 'Discover a Service',
      description: 'Select your trade from our verified catalog, define your task or maintenance schedule, and get transparent, standardized cooperative rate estimates.',
      icon: Search,
      badge: 'Step 1: Scoping',
      details: [
        'Clear price guidelines without surge gouging',
        'Transparent itemized material vs. labor rates',
        'Automatic regional supervisor notification',
      ],
      milestone: 'Scoping & Estimate Lock',
    },
    {
      number: '02',
      title: 'Connect with a Worker',
      description: 'Match with certified local craftspeople accompanied by a dedicated cooperative supervisor who aligns tools, materials, and safety protocols.',
      icon: UserCheck,
      badge: 'Step 2: Assignment',
      details: [
        'Multi-point ID check and trade qualification verified',
        'Dedicated supervisor ensures correct tools & safety equipment',
        'Real-time supervisor dispatch with arrival tracking',
      ],
      milestone: 'Technician & Supervisor Dispatch',
    },
    {
      number: '03',
      title: 'Complete the Work',
      description: 'Execution with milestone approvals, quality sign-offs, and fair, prompt worker payouts through our secure cooperative escrow system.',
      icon: CheckCircle2,
      badge: 'Step 3: Verification',
      details: [
        'Joint supervisor quality audit before sign-off',
        'Customer satisfaction approval triggers escrow release',
        'Direct fair-wage payout + cooperative equity dividend',
      ],
      milestone: 'Quality Sign-off & Escrow Release',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-teal/5 rounded-full filter blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Structured & Transparent"
          badgeIcon={Clock}
          badgeVariant="emerald"
          title="How SahkarSathi Delivers"
          highlight="Cooperative Excellence"
          subtitle="A structured, transparent workflow designed to protect homeowners while ensuring workers receive fair wages and full respect."
          align="center"
          className="mb-14"
        />

        {/* 3 Step Cards with visual connectors */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {/* Animated Gradient Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-brand-teal/40 via-brand-emerald/40 to-brand-gold/40 -z-10 rounded-full" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isSelected = selectedStep === index + 1;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                onClick={() => setSelectedStep(index + 1)}
                className={`cursor-pointer relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 border ${
                  isSelected
                    ? 'bg-white border-brand-teal shadow-premium ring-2 ring-brand-teal/20 scale-[1.02]'
                    : 'bg-white/70 border-brand-border hover:bg-white hover:border-brand-teal/40 shadow-subtle'
                }`}
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-xl shadow-xs transition-colors ${
                      isSelected
                        ? 'bg-brand-teal text-white'
                        : 'bg-brand-surface text-brand-teal'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-3xl font-bold text-brand-secondary/25">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-brand-teal mb-2">
                    {step.badge}
                  </span>
                  <h3 className="font-display text-xl font-bold text-brand-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-brand-secondary leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Bullet Highlights */}
                  <ul className="space-y-2 pt-4 border-t border-brand-border/60">
                    {step.details.map((detail, dIndex) => (
                      <li key={dIndex} className="flex items-start gap-2 text-xs text-brand-primary/80 font-medium">
                        <FileCheck className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Milestone Pill */}
                <div className="mt-8 pt-4 border-t border-brand-border/60 flex items-center justify-between text-xs">
                  <span className="text-brand-secondary/80 font-mono text-[11px]">Milestone</span>
                  <span className="font-semibold text-brand-teal">{step.milestone}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-14 text-center">
          <Button
            to="/book"
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            className="shadow-sm font-semibold"
          >
            Schedule Your First Service
          </Button>
        </div>
      </div>
    </section>
  );
}
