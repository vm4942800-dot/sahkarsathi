/**
 * SahkarSathi Unified Global Search Bar with Autocomplete & Recent Searches
 * Supports service and artisan multi-entity search with debounced typing
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Clock,
  Wrench,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { discoveryService } from '../../services/discoveryService';

export default function GlobalSearchBar({
  placeholder = 'Search services, trades, skills, or verified artisans (e.g. Electrician, Leakage, Sunil)...',
  className = '',
  initialQuery = '',
  onSearchSubmit,
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState({ services: [], workers: [], suggestions: [] });
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef(null);

  // Load recent searches
  useEffect(() => {
    setRecentSearches(discoveryService.getRecentSearches());
  }, [isOpen]);

  // Handle outside clicks to close autocomplete
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions({ services: [], workers: [], suggestions: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await discoveryService.searchGlobal(query);
        setSuggestions(res);
      } catch (err) {
        console.warn('Search autocomplete error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    discoveryService.addRecentSearch(query.trim());
    setIsOpen(false);

    if (onSearchSubmit) {
      onSearchSubmit(query.trim());
    } else {
      navigate(`/customer/workers?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectRecent = (term) => {
    setQuery(term);
    discoveryService.addRecentSearch(term);
    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(term);
    } else {
      navigate(`/customer/workers?q=${encodeURIComponent(term)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions({ services: [], workers: [], suggestions: [] });
    if (onSearchSubmit) onSearchSubmit('');
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="w-4 h-4 text-brand-secondary absolute left-4 pointer-events-none" />

        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-11 pr-24 py-3 sm:py-3.5 rounded-2xl bg-white border border-brand-border text-xs sm:text-sm text-brand-primary placeholder:text-brand-secondary/70 shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-emerald/25 focus:border-brand-emerald transition-all"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg text-brand-secondary hover:text-brand-primary hover:bg-black/5 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-brand-emerald text-white text-xs font-bold hover:bg-brand-emeraldDark shadow-xs transition-colors flex items-center gap-1"
          >
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Autocomplete & Recent Dropdown Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl border border-brand-border shadow-2xl overflow-hidden z-50 text-xs divide-y divide-brand-border"
          >
            {/* When typing: Matched Services */}
            {query.trim() && suggestions.services.length > 0 && (
              <div className="p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary px-2 mb-1.5 block">
                  Matching Trade Services ({suggestions.services.length})
                </span>
                <div className="space-y-1">
                  {suggestions.services.slice(0, 3).map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/customer/services/${srv.id}`);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-brand-surface flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-brand-teal">
                          <Wrench className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-brand-primary block leading-tight">
                            {srv.title}
                          </span>
                          <span className="text-[10px] text-brand-secondary">
                            {srv.category} • Starts ₹{srv.basePrice || 650}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-secondary group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* When typing: Matched Workers */}
            {query.trim() && suggestions.workers.length > 0 && (
              <div className="p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary px-2 mb-1.5 block">
                  Accredited Craftsmen ({suggestions.workers.length})
                </span>
                <div className="space-y-1">
                  {suggestions.workers.slice(0, 3).map((wrk) => (
                    <button
                      key={wrk.id}
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/customer/workers?q=${encodeURIComponent(wrk.name)}`);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-brand-surface flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={wrk.avatar}
                          alt={wrk.name}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-brand-emerald/30"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-brand-primary block leading-tight">
                              {wrk.name}
                            </span>
                            {wrk.verificationStatus === 'verified' && (
                              <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
                            )}
                          </div>
                          <span className="text-[10px] text-brand-secondary">
                            {wrk.trade} • {wrk.city} ({wrk.area}) • ★ {wrk.rating || 'New'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        View Profile
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Zero results state */}
            {query.trim() && suggestions.services.length === 0 && suggestions.workers.length === 0 && !isSearching && (
              <div className="p-6 text-center text-brand-secondary">
                <Search className="w-6 h-6 mx-auto mb-1.5 opacity-30" />
                <p className="font-bold text-brand-primary">No exact matches found for "{query}"</p>
                <p className="text-[11px] mt-0.5">
                  Try searching for a broader discipline like "Electrical", "Plumbing", "Carpentry", or city name.
                </p>
              </div>
            )}

            {/* Recent Searches (Shown when input is empty or focused) */}
            {recentSearches.length > 0 && (
              <div className="p-3 bg-brand-surface/30">
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>Recent Searches</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      discoveryService.clearRecentSearches();
                      setRecentSearches([]);
                    }}
                    className="text-[10px] text-brand-secondary hover:text-rose-600 transition-colors"
                  >
                    Clear History
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 px-1">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectRecent(term)}
                      className="px-2.5 py-1 rounded-xl bg-white border border-brand-border text-brand-primary hover:border-brand-emerald text-[11px] font-medium transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
