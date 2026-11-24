import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Wrench, 
  Zap, 
  Droplets, 
  Hammer, 
  Paintbrush, 
  Sparkles, 
  HardHat, 
  Grid, 
  ShieldCheck, 
  ArrowRight,
  Filter
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import BackendNotice from '../components/common/BackendNotice';
import { BRAND } from '../config/brand';

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

export default function Services() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'Critical Maintenance', label: 'Critical Maintenance' },
    { id: 'Interior & Woodwork', label: 'Interior & Woodwork' },
    { id: 'Finishing & Coating', label: 'Finishing & Coating' },
    { id: 'Hygiene & Care', label: 'Hygiene & Care' },
    { id: 'Infrastructure', label: 'Infrastructure' },
    { id: 'Specialized Crafts', label: 'Specialized Crafts' },
  ];

  const filteredServices = useMemo(() => {
    return BRAND.services.filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' ||
        service.category === selectedCategory ||
        service.id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Cooperative Trade Directory"
          badgeIcon={Wrench}
          badgeVariant="teal"
          title="Verified Crafts &"
          highlight="Home Services"
          subtitle="Discover transparently priced, high-standard maintenance, electrical, civil, and specialized artisan services for your residence or commercial premises."
          align="center"
          className="mb-10"
        />

        {/* Search & Category Filter Bar */}
        <div className="max-w-3xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-brand-secondary absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by trade (e.g., electrical, plumbing, carpentry, painting)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-brand-border text-brand-primary placeholder:text-brand-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 shadow-subtle text-sm"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Filter className="w-4 h-4 text-brand-secondary shrink-0 ml-1" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                  selectedCategory === cat.id
                    ? 'bg-brand-teal text-white border-brand-teal shadow-xs'
                    : 'bg-white text-brand-secondary border-brand-border hover:bg-brand-surface'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <BackendNotice
          featureName="Service Catalog & Booking Dispatch"
          details="Browse verified trades and pricing frameworks. Clicking 'Schedule Service' opens the interactive booking flow with live price calculation mockups."
        />

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-brand-border p-8">
            <Wrench className="w-10 h-10 text-brand-secondary mx-auto mb-3 opacity-40" />
            <h3 className="font-display font-bold text-lg text-brand-primary">No services found</h3>
            <p className="text-sm text-brand-secondary mt-1">Try refining your search keyword or clearing the category filter.</p>
            <Button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => {
              const Icon = iconMap[service.icon] || Wrench;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="rounded-2xl bg-white border border-brand-border p-6 shadow-subtle hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-surface flex items-center justify-center text-brand-teal shadow-xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="teal" size="sm">
                        {service.category}
                      </Badge>
                    </div>

                    <h3 className="font-display text-lg font-bold text-brand-primary">
                      {service.title}
                    </h3>
                    <p className="text-sm text-brand-secondary mt-2 leading-relaxed">
                      {service.shortDesc}
                    </p>

                    <div className="mt-4 pt-4 border-t border-brand-border/60 space-y-2 text-xs text-brand-secondary">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                        <span>Background & skill vetted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-gold" />
                        <span>Fixed cooperative rate card available</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-primary">
                      Standardized Rate
                    </span>
                    <Button
                      to={`/book?service=${service.id}`}
                      variant="primary"
                      size="sm"
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      Schedule Service
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
