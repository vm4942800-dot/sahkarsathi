import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Home, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  Check, 
  Briefcase, 
  HeartHandshake,
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function CooperativeEcosystemSection() {
  const [activeTab, setActiveTab] = useState('workers');

  const pillars = [
    {
      id: 'workers',
      title: 'Skilled Workers',
      role: 'Trade Professionals',
      icon: Briefcase,
      color: 'teal',
      summary: 'Verified craftspeople receiving dignified livelihoods, collective bargaining power, and direct equity.',
      benefits: [
        'Guaranteed transparent base pay without predatory aggregator cuts',
        'Annual cooperative surplus dividend distributions',
        'Continuous upskilling programs and formal trade skill credentials',
        'Healthcare and accidental insurance coverage safety net',
      ],
      quote: '“We are not just gig numbers; as cooperative members, we own a stake in the quality we deliver.”',
      interactsWith: {
        customers: 'Delivers audited, respectful craftsmanship with transparent billing.',
        supervisors: 'Receives tooling support, material prep, and site safety briefs.',
        cooperatives: 'Elects chapter board and shares in annual dividend distributions.',
      },
    },
    {
      id: 'customers',
      title: 'Homeowners & Clients',
      role: 'Community Members',
      icon: Home,
      color: 'emerald',
      summary: 'Residents seeking dependable workmanship, transparent rates, and guaranteed project accountability.',
      benefits: [
        'Clear, fixed standardized pricing without surge gouging',
        'Direct connection to thoroughly vetted local technicians',
        'Dedicated supervisor overseeing execution and safety',
        'Satisfaction guarantee backed by cooperative reserve fund',
      ],
      quote: '“Having a supervisor coordinate multi-day projects took all the anxiety away from our home renovation.”',
      interactsWith: {
        workers: 'Provides clear project scope and fair payment without surprise fees.',
        supervisors: 'Signs off on inspection milestones before escrow release.',
        cooperatives: 'Enjoys verified dispute protection and transparent rate standards.',
      },
    },
    {
      id: 'supervisors',
      title: 'Regional Supervisors',
      role: 'Project Coordinators',
      icon: ShieldCheck,
      color: 'gold',
      summary: 'Experienced master craftsmen acting as project liaisons, managing tool inventories, and conducting quality sign-offs.',
      benefits: [
        'Professional on-site project coordination and material planning',
        'Conflict resolution and technical diagnostics',
        'Quality assurance audits prior to final payment milestone',
        'Mentorship and apprentice training guidance',
      ],
      quote: '“We ensure that every worker has the exact tools, instructions, and safety gear required before turning the key.”',
      interactsWith: {
        workers: 'Provides guidance, checks safety gear, and certifies milestone quality.',
        customers: 'Conducts pre-job scoping and joint milestone walkthroughs.',
        cooperatives: 'Maintains regional trade standards and enforces safety protocols.',
      },
    },
    {
      id: 'cooperatives',
      title: 'Cooperative Hubs',
      role: 'Governance & Society',
      icon: Building2,
      color: 'teal',
      summary: 'Democratic cooperative federations ensuring ethical standards, member welfare, and local economic resilience.',
      benefits: [
        'Democratic governance — one member, one vote',
        'Reinvestment of operating profits into local tool libraries',
        'Collective procurement of raw materials at bulk discounts',
        'Sustainable local community economic development',
      ],
      quote: '“A community model where economic value remains with the homes and the hands that build them.”',
      interactsWith: {
        workers: 'Protects labor rights, manages health pools, and distributes equity.',
        customers: 'Guarantees quality escrow and enforces code of conduct.',
        supervisors: 'Accredits regional leads and supplies community tool depots.',
      },
    },
  ];

  const currentPillar = pillars.find((p) => p.id === activeTab) || pillars[0];

  return (
    <section id="ecosystem" className="py-20 md:py-28 bg-brand-dark text-white relative overflow-hidden">
      {/* Background Subtle Chromatic Mesh */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-brand-teal/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-brand-emerald/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Cooperative Synergy"
          badgeIcon={HeartHandshake}
          badgeVariant="dark"
          title="A Connected Ecosystem Where"
          highlight="Everyone Prospers"
          subtitle="Unlike predatory gig platforms that isolate workers and inflate customer fees, SahkarSathi binds homeowners, craftspeople, and supervisors into an aligned cooperative circle."
          align="center"
          dark={true}
          className="mb-14"
        />

        {/* Interactive Pillar Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = activeTab === pillar.id;

            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActiveTab(pillar.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                  isSelected
                    ? 'bg-brand-teal text-white border-brand-teal shadow-lg scale-105'
                    : 'bg-white/5 text-brand-surface/75 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{pillar.title}</span>
              </button>
            );
          })}
        </div>

        {/* Connected Card Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Details Panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPillar.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="h-full rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-10 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-gold">
                      {currentPillar.role}
                    </span>
                    <Badge variant="dark" size="sm">
                      Cooperative Node
                    </Badge>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                    {currentPillar.title}
                  </h3>

                  <p className="text-brand-surface/80 text-sm sm:text-base leading-relaxed mb-6">
                    {currentPillar.summary}
                  </p>

                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-teal">
                      Cooperative Commitments:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentPillar.benefits.map((benefit, bIndex) => (
                        <div
                          key={bIndex}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-brand-surface/90"
                        >
                          <Check className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="italic text-xs sm:text-sm text-brand-surface/60 border-l-2 border-brand-gold pl-3">
                    {currentPillar.quote}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Architecture Map (Ecosystem Relationships) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 backdrop-blur-md space-y-5">
              <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-teal" />
                <span>The Cooperative Value Loop</span>
              </h4>

              <div className="space-y-3.5 text-xs text-brand-surface/80">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-8 h-8 rounded-lg bg-brand-teal/20 text-brand-teal flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Transparent Work Demand</span>
                    Homeowners post projects with fair standardized rate estimates.
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Supervisor Alignment</span>
                    Regional coordinators bundle jobs, prep safety kits, and brief verified workers.
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-8 h-8 rounded-lg bg-brand-emerald/20 text-brand-emerald flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Dignified Remuneration</span>
                    Workers receive fast payouts, performance points, and cooperative equity.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  to="/worker/join"
                  variant="gold"
                  size="md"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="w-full justify-center font-semibold"
                >
                  Join the Cooperative Model
                </Button>
              </div>
            </div>

            {/* Quick Trust Stat Indicator */}
            <div className="rounded-2xl bg-brand-teal/15 border border-brand-teal/30 p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-brand-surface">
                <TrendingUp className="w-4 h-4 text-brand-gold" />
                <span>Community Equity Retention</span>
              </div>
              <span className="font-mono font-bold text-white">Zero Exploitative Cuts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
