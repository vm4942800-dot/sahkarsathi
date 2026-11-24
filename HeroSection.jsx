import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Wrench, 
  Star,
  Award
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Hero3DFallback from './Hero3DFallback';
import { BRAND } from '../../config/brand';

// Lazy-load 3D scene to preserve lightning-fast initial page paint
const Hero3DScene = lazy(() => import('./Hero3DScene'));

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden flex items-center">
      {/* Background Soft Chromatic Gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-brand-teal/15 to-transparent rounded-full filter blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-brand-emerald/15 to-transparent rounded-full filter blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-8 w-80 h-80 bg-brand-gold/10 rounded-full filter blur-3xl pointer-events-none -z-10" />

      {/* Subtle Geometric Drafting Dot Matrix */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(var(--color-text-primary) 1.25px, transparent 1.25px)`,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Mission & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Cooperative Tag Badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <Badge variant="teal" icon={Building2} className="shadow-xs py-1">
                Cooperative Framework
              </Badge>
              <span className="hidden sm:inline-block text-brand-secondary/30">•</span>
              <span className="text-xs font-semibold text-brand-secondary tracking-wide uppercase">
                {BRAND.descriptor}
              </span>
            </div>

            {/* Main Punchy Heading */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brand-primary leading-[1.12]">
              Trusted Services.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-emerald to-brand-primary">
                Stronger Communities.
              </span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-brand-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Connect with verified workers, discover reliable home services, and manage projects through a cooperative platform built for everyone.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Button
                to="/services"
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto shadow-md hover:shadow-premium-hover font-semibold"
              >
                Explore Services
              </Button>
              <Button
                to="/worker/join"
                variant="secondary"
                size="lg"
                icon={Users}
                className="w-full sm:w-auto font-medium"
              >
                Become a Worker
              </Button>
            </div>

            {/* Cooperative Assurance Cards / Metric Strip */}
            <div className="pt-6 border-t border-brand-border/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3 rounded-2xl bg-white/70 border border-brand-border/80 shadow-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-teal/15 text-brand-teal flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-brand-primary">Vetted Trades</div>
                  <div className="text-[10px] text-brand-secondary">Identity & Skill Audit</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 border border-brand-border/80 shadow-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-emerald/15 text-brand-emerald flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-brand-primary">Supervisor Lead</div>
                  <div className="text-[10px] text-brand-secondary">On-Site Quality Check</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 border border-brand-border/80 shadow-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-gold/20 text-[#8B6B23] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-brand-primary">Co-op Escrow</div>
                  <div className="text-[10px] text-brand-secondary">Sign-off Protection</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Premium 3D Visual & Floating Contextual Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Top Orbiting Notification Tag */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-3 -left-3 sm:-left-6 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 border border-brand-border shadow-premium backdrop-blur-md text-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-brand-emerald/15 text-brand-emerald flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-brand-primary block text-[11px]">Direct Remuneration</span>
                <span className="text-[10px] text-brand-secondary">Zero broker cut</span>
              </div>
            </motion.div>

            {/* Bottom Orbiting Notification Tag */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="absolute -bottom-2 -right-2 sm:-right-4 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-brand-dark text-white border border-white/10 shadow-dark-card backdrop-blur-md text-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center">
                <Star className="w-4 h-4 fill-brand-gold" />
              </div>
              <div>
                <span className="font-bold text-white block text-[11px]">Standardized Rates</span>
                <span className="text-[10px] text-brand-surface/70">Milestone payments</span>
              </div>
            </motion.div>

            <Suspense fallback={<Hero3DFallback />}>
              <Hero3DScene />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
