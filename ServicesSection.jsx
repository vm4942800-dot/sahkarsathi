import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Droplets, 
  Hammer, 
  Paintbrush, 
  Sparkles, 
  Wrench, 
  HardHat, 
  Grid, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag
} from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { BRAND } from '../../config/brand';

const iconMap = {
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Sparkles,
  Wrench,
  HardHat,
  Grid,
};

export default function ServicesSection() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All Essential Trades' },
    { id: 'Critical Maintenance', label: 'Critical Maintenance' },
    { id: 'Interior & Woodwork', label: 'Interior & Woodwork' },
    { id: 'Finishing & Coating', label: 'Finishing' },
    { id: 'Infrastructure', label: 'Infrastructure & Civil' },
  ];

  const displayedServices = BRAND.services.filter((s) => {
    if (activeFilter === 'all') return true;
    return s.category === activeFilter;
  });

  return (
    <section id="services" className="py-20 md:py-28 bg-brand-surface/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <SectionHeading
          badge="Essential Trades & Craftsmanship"
          badgeIcon={Wrench}
          badgeVariant="teal"
          title="Comprehensive Services for"
          highlight="Every Home & Project"
          subtitle="From minor electrical repairs to multi-trade renovation management, every service is delivered by verified workers and backed by cooperative standards."
          align="center"
          className="mb-10"
        />

        {/* Quick Filter Bar */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                activeFilter === tab.id
                  ? 'bg-brand-teal text-white border-brand-teal shadow-xs scale-105'
                  : 'bg-white text-brand-secondary border-brand-border hover:bg-brand-surface hover:text-brand-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 8 Modern Service Cards Grid with Framer Motion Stagger */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {displayedServices.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Wrench;

              return (
                <motion.div
                  layout
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col justify-between rounded-3xl bg-white border border-brand-border p-6 shadow-subtle hover:shadow-premium-hover hover:border-brand-teal/40 transition-all duration-300"
                >
                  {/* Top: Icon & Category */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors duration-300 shadow-xs">
                        <IconComponent className="w-6 h-6" />
                      </div>

                      {service.popular && (
                        <Badge variant="gold" size="sm">
                          Frequent
                        </Badge>
                      )}
                    </div>

                    {/* Title & Category Tag */}
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-secondary/80 mb-1">
                      {service.category}
                    </div>
                    <h3 className="font-display text-lg font-bold text-brand-primary group-hover:text-brand-teal transition-colors">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2.5 text-xs sm:text-sm text-brand-secondary leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  {/* Bottom: Explore / Book Action */}
                  <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-brand-secondary group-hover:text-brand-primary transition-colors">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
                      <span>Co-op Standard</span>
                    </div>

                    <Button
                      to={`/book?service=${service.id}`}
                      variant="ghost"
                      size="sm"
                      icon={ArrowRight}
                      iconPosition="right"
                      className="text-xs p-0 text-brand-teal hover:bg-transparent font-semibold group-hover:translate-x-1 transition-transform"
                    >
                      Book
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* View All Services Footer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-subtle"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-brand-emerald/10 text-brand-emerald items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base sm:text-lg text-brand-primary">
                Need customized multi-trade project coordination?
              </h4>
              <p className="text-xs sm:text-sm text-brand-secondary">
                Our cooperative supervisors handle civil renovations, complex maintenance schedules, and commercial projects.
              </p>
            </div>
          </div>

          <Button
            to="/projects"
            variant="dark"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            className="shrink-0 w-full sm:w-auto font-medium"
          >
            Manage a Project
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
