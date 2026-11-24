import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Wrench, 
  Zap, 
  Droplets, 
  Hammer, 
  Paintbrush, 
  Sparkles, 
  HardHat, 
  Grid, 
  ShieldCheck, 
  Star 
} from 'lucide-react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { BRAND } from '../../config/brand';
import { adminService } from '../../services/adminService';

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

export default function BrowseServices() {
  const [servicesList, setServicesList] = useState(BRAND.services);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'alpha'

  useEffect(() => {
    adminService.getServices().then((list) => {
      if (list && list.length > 0) {
        setServicesList(list.filter((s) => s.isActive !== false));
      }
    }).catch(() => {});
  }, []);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'Critical Maintenance', label: 'Critical Maintenance' },
    { id: 'Interior & Woodwork', label: 'Interior & Woodwork' },
    { id: 'Finishing & Coating', label: 'Finishing & Painting' },
    { id: 'Hygiene & Care', label: 'Deep Cleaning' },
    { id: 'Infrastructure', label: 'Civil & Construction' },
    { id: 'Specialized Crafts', label: 'Specialized Crafts' },
  ];

  const filteredServices = useMemo(() => {
    let result = servicesList.filter((s) => {
      const matchSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.shortDesc || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || s.category === selectedCategory;
      return matchSearch && matchCat;
    });

    if (sortBy === 'alpha') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return result;
  }, [servicesList, searchQuery, selectedCategory, sortBy]);

  return (
    <CustomerLayout title="Browse Cooperative Services">
      <div className="space-y-6">
        {/* Search, Filter & Sort Controls */}
        <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-subtle space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trades (e.g. electrical wiring, pipe leakage, carpentry, painting)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-xs sm:text-sm text-brand-primary placeholder:text-brand-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-secondary shrink-0 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-brand-surface border border-brand-border text-xs text-brand-primary font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
              >
                <option value="popular">Most Frequent First</option>
                <option value="alpha">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-brand-teal text-white border-brand-teal shadow-2xs'
                    : 'bg-brand-surface/70 text-brand-secondary border-brand-border hover:bg-brand-surface hover:text-brand-primary'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredServices.map((service, index) => {
              const Icon = iconMap[service.icon] || Wrench;

              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="rounded-3xl bg-white border border-brand-border p-5 shadow-subtle hover:shadow-premium hover:border-brand-teal/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors shadow-2xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      {service.popular && (
                        <Badge variant="gold" size="sm">
                          Frequent
                        </Badge>
                      )}
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary/80 block mb-1">
                      {service.category}
                    </span>
                    <h3 className="font-display font-bold text-base text-brand-primary group-hover:text-brand-teal transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-brand-secondary mt-1.5 leading-relaxed line-clamp-3">
                      {service.shortDesc}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-brand-border/60 flex items-center justify-between gap-2">
                    <Link
                      to={`/customer/services/${service.id}`}
                      className="text-xs font-semibold text-brand-secondary hover:text-brand-primary underline"
                    >
                      Details
                    </Link>

                    <Button
                      to={`/customer/book?service=${service.id}`}
                      variant="primary"
                      size="sm"
                      icon={ArrowRight}
                      iconPosition="right"
                      className="text-xs px-3 py-1.5"
                    >
                      Book Now
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </CustomerLayout>
  );
}
