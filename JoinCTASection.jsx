import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Briefcase, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Coins 
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function JoinCTASection() {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: Customer Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55 }}
            whileHover={{ y: -4 }}
            className="relative rounded-3xl bg-gradient-to-br from-white to-brand-surface/90 border border-brand-border p-8 sm:p-12 shadow-premium flex flex-col justify-between overflow-hidden group transition-all"
          >
            {/* Top decorative gradient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/10 rounded-full filter blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 text-brand-teal flex items-center justify-center shadow-xs">
                  <Home className="w-7 h-7" />
                </div>
                <Badge variant="teal" size="sm">
                  For Homeowners
                </Badge>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-brand-primary mb-3">
                Find the Right Help for Your Home
              </h3>

              <p className="text-sm sm:text-base text-brand-secondary leading-relaxed mb-6">
                Book verified professionals for routine maintenance or comprehensive renovations. Experience transparent itemized billing and supervisor accountability.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-primary font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
                  <span>Itemized quotes with zero hidden markups</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-primary font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
                  <span>Supervisor coordination on multi-trade tasks</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-primary font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
                  <span>100% verified identities and skill credentials</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                to="/services"
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto shadow-md font-semibold"
              >
                Explore Services
              </Button>
            </div>
          </motion.div>

          {/* Card 2: Worker Cooperative Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55 }}
            whileHover={{ y: -4 }}
            className="relative rounded-3xl bg-brand-dark text-white border border-white/10 p-8 sm:p-12 shadow-dark-card flex flex-col justify-between overflow-hidden group transition-all"
          >
            {/* Top decorative gradient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/15 rounded-full filter blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 text-brand-gold flex items-center justify-center shadow-xs">
                  <Briefcase className="w-7 h-7" />
                </div>
                <Badge variant="gold" size="sm">
                  Cooperative Membership
                </Badge>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                Build Your Future with SahkarSathi
              </h3>

              <p className="text-sm sm:text-base text-brand-surface/80 leading-relaxed mb-6">
                Join a self-governed craft cooperative. Enjoy consistent project flow, fair wages, insurance protection, and annual dividend distributions.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-surface/90 font-medium">
                  <Coins className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>Earn direct wages + cooperative equity dividend</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-surface/90 font-medium">
                  <ShieldCheck className="w-4 h-4 text-brand-teal shrink-0" />
                  <span>Accident cover, tool subsidies & skill certificates</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-surface/90 font-medium">
                  <Users className="w-4 h-4 text-brand-emerald shrink-0" />
                  <span>Democratic representation and supervisor mentorship</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                to="/worker/join"
                variant="gold"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto font-semibold shadow-md"
              >
                Join as a Worker
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
