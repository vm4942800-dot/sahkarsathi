import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  HeartHandshake, 
  ShieldCheck, 
  Users, 
  Target, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { BRAND } from '../config/brand';

export default function About() {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Our Origin & Philosophy"
          badgeIcon={HeartHandshake}
          badgeVariant="teal"
          title="Empowering Workers."
          highlight="Elevating Homes."
          subtitle={BRAND.tagline}
          align="center"
          className="mb-12"
        />

        {/* Narrative Section */}
        <div className="rounded-3xl bg-white border border-brand-border p-8 sm:p-12 shadow-premium mb-12 space-y-6 text-sm sm:text-base text-brand-secondary leading-relaxed">
          <p className="text-lg font-medium text-brand-primary">
            {BRAND.name} was founded to resolve a deep, pervasive contradiction in the modern service economy: homeowners struggle to find trustworthy craftspeople, while skilled workers struggle with irregular wages and predatory platform commissions.
          </p>

          <p>
            By reorganizing home and project maintenance around a <strong>cooperative model</strong>, SahkarSathi converts workers from exploited gig labor into vested co-owners of their craft. When workers own the outcome, quality ceases to be an enforcement problem—it becomes an innate point of pride.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-brand-border/60">
            <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border/60">
              <span className="font-display font-bold text-2xl text-brand-teal block mb-1">0%</span>
              <span className="text-xs text-brand-secondary font-medium">Predatory middleman markups on worker labor</span>
            </div>
            <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border/60">
              <span className="font-display font-bold text-2xl text-brand-emerald block mb-1">100%</span>
              <span className="text-xs text-brand-secondary font-medium">Verified identities and vetted skill credentials</span>
            </div>
            <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border/60">
              <span className="font-display font-bold text-2xl text-brand-gold block mb-1">Co-op</span>
              <span className="text-xs text-brand-secondary font-medium">Democratic dividend sharing and local governance</span>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {BRAND.cooperativePillars.map((p) => (
            <div key={p.title} className="p-6 rounded-2xl bg-white border border-brand-border shadow-subtle">
              <h3 className="font-display font-bold text-base text-brand-primary mb-2">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="text-center p-8 rounded-3xl bg-brand-dark text-white border border-white/10 shadow-dark-card">
          <h3 className="font-display font-bold text-2xl mb-2">
            Be a Part of the Cooperative Movement
          </h3>
          <p className="text-xs sm:text-sm text-brand-surface/75 max-w-lg mx-auto mb-6">
            Whether you need reliable home maintenance or want to build a career with trade equity, SahkarSathi welcomes you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button to="/services" variant="primary" size="md">
              Explore Services
            </Button>
            <Button to="/worker/join" variant="gold" size="md">
              Join as a Worker
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
