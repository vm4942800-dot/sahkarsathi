/**
 * SahkarSathi Worker & Service Discovery Engine
 * Provides multi-entity search, match scoring, availability cross-checks,
 * saved craftsmen management, and privacy-first public profiles.
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BRAND } from '../config/brand';
import { adminService } from './adminService';
import { bookingService } from './bookingService';

const RECENT_SEARCHES_KEY = 'sahkarsathi_recent_searches';
const LOCAL_SAVED_WORKERS_KEY = 'sahkarsathi_saved_workers';

// Comprehensive public worker database with certified trade skills and coverage areas
const PUBLIC_WORKER_ROSTER = [
  {
    id: 'SS-WRK-7821',
    workerCode: 'SS-WRK-7821',
    name: 'Sunil Verma',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250',
    trade: 'Electrical Services',
    category: 'Critical Maintenance',
    city: 'Bengaluru',
    area: 'Indiranagar',
    coverageAreas: ['Indiranagar', 'Koramangala', 'Domlur', 'HAL Airport Road', 'Old Airport Road'],
    skills: ['Three-Phase Wiring', 'Distribution Board Repair', 'Solar Inverter Diagnostics', 'MCB Tripping Load Test', 'Home Automation'],
    experienceYears: 11,
    rating: 4.94,
    completedJobs: 142,
    verificationStatus: 'verified',
    badgeLevel: 'Master Artisan',
    estimatedBasePrice: 650,
    cooperativeUnit: 'East Bangalore Craftsmen Union (Unit #14)',
    bio: 'Government licensed Grade-A wireman and NSQF Level 5 certified electrician with 11+ years in residential load optimization and distribution box overhauls.',
    isAvailableNow: true,
    reviews: [
      { id: 'rev-1', customerName: 'Priya Sharma', rating: 5, date: '2026-11-18', comment: 'Sunil fixed our tripping MCB swiftly and explained the phase load distribution with zero fuss. Very polite and professional.' },
      { id: 'rev-2', customerName: 'Rohan Mehra', rating: 5, date: '2026-11-04', comment: 'Arrived promptly on time with full safety gear. Excellent cooperative craftsman.' }
    ]
  },
  {
    id: 'SS-WRK-3392',
    workerCode: 'SS-WRK-3392',
    name: 'Balwinder Singh',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    trade: 'Carpentry & Woodwork',
    category: 'Interior & Woodwork',
    city: 'New Delhi',
    area: 'Sector 14, Rohini',
    coverageAreas: ['Rohini', 'Pitampura', 'Punjabi Bagh', 'Model Town', 'Shalimar Bagh'],
    skills: ['Modular Kitchen Fitting', 'Teak Wood Restoration', 'High-Security Mortise Locks', 'Veneer Edge Banding', 'Custom Wardrobes'],
    experienceYears: 14,
    rating: 4.96,
    completedJobs: 198,
    verificationStatus: 'verified',
    badgeLevel: 'Master Artisan',
    estimatedBasePrice: 750,
    cooperativeUnit: 'West Delhi Timber Guild',
    bio: 'Third-generation wood artisan specializing in precision joinery, modular kitchen hardware alignment, and acoustic door weatherstripping.',
    isAvailableNow: true,
    reviews: [
      { id: 'rev-3', customerName: 'Amitabh Sen', rating: 5, date: '2026-11-15', comment: 'Flawless hinge alignment and custom teak cabinet repair. Left the workspace spotless.' }
    ]
  },
  {
    id: 'SS-WRK-5120',
    workerCode: 'SS-WRK-5120',
    name: 'Arjun Das',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    trade: 'Plumbing & Sanitary',
    category: 'Critical Maintenance',
    city: 'Bengaluru',
    area: 'Koramangala',
    coverageAreas: ['Koramangala', 'HSR Layout', 'BTM Layout', 'Bellandur', 'Sarjapur Road'],
    skills: ['Concealed Leak Acoustic Audit', 'Pressure Booster Pumps', 'CPVC & PPR Fusion Pipe', 'Drain Jetting & De-clogging', 'Water Tank Float Valves'],
    experienceYears: 8,
    rating: 4.88,
    completedJobs: 87,
    verificationStatus: 'verified',
    badgeLevel: 'Certified Artisan',
    estimatedBasePrice: 550,
    cooperativeUnit: 'Central Bangalore Sanitary Chapter',
    bio: 'Certified hydraulic technician with non-invasive acoustic leak detection equipment. Specialist in high-rise residential water pressure optimization.',
    isAvailableNow: false,
    reviews: [
      { id: 'rev-4', customerName: 'Sangeeta Nair', rating: 5, date: '2026-10-29', comment: 'Identified a concealed bathroom wall seepage without drilling multiple tiles. Saved us massive repair costs.' }
    ]
  },
  {
    id: 'SS-WRK-1980',
    workerCode: 'SS-WRK-1980',
    name: 'Kavita Devi & Team',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    trade: 'Deep Cleaning & Sanitization',
    category: 'Hygiene & Care',
    city: 'New Delhi',
    area: 'Connaught Place',
    coverageAreas: ['Connaught Place', 'Barakhamba Road', 'Green Park', 'Hauz Khas', 'Defence Colony'],
    skills: ['Single-Disc Machine Scrubbing', 'Tile Grout Steam Degreasing', 'Upholstery Shampooing', 'Balcony Moss Removal', 'Kitchen Exhaust Degreasing'],
    experienceYears: 7,
    rating: 4.91,
    completedJobs: 64,
    verificationStatus: 'verified',
    badgeLevel: 'Specialized Team Lead',
    estimatedBasePrice: 1200,
    cooperativeUnit: 'Central Delhi Sanitation Cooperative',
    bio: 'Cooperative cleaning team equipped with industrial single-disc floor scrubbers and eco-friendly enzymatic degreasers.',
    isAvailableNow: true,
    reviews: [
      { id: 'rev-5', customerName: 'Priya Sharma', rating: 5, date: '2026-11-04', comment: 'Deep cleaned our residence post-festival. The floor polish and balcony grouting looked brand new.' }
    ]
  },
  {
    id: 'SS-WRK-8812',
    workerCode: 'SS-WRK-8812',
    name: 'Deepak Mohan Salve',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    trade: 'Plumbing & Sanitary',
    category: 'Critical Maintenance',
    city: 'Bengaluru',
    area: 'HSR Layout',
    coverageAreas: ['HSR Layout', 'Koramangala', 'Electronic City', 'Bommanahalli'],
    skills: ['Sanitary Ware Fitting', 'Water Heater Setup', 'Overhead Tank Cleaning', 'Kitchen Sink Traps'],
    experienceYears: 4,
    rating: 4.72,
    completedJobs: 14,
    verificationStatus: 'verified',
    badgeLevel: 'Artisan Craftsman',
    estimatedBasePrice: 500,
    cooperativeUnit: 'South Bangalore Water Works Guild',
    bio: 'Prompt residential sanitary technician focusing on fixture replacements, sink siphon repairs, and geyser plumbing connections.',
    isAvailableNow: true,
    reviews: []
  },
  {
    id: 'SS-WRK-9041',
    workerCode: 'SS-WRK-9041',
    name: 'Manoj Kumar Sharma',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    trade: 'Painting & Finishes',
    category: 'Finishing & Coating',
    city: 'Bengaluru',
    area: 'Indiranagar',
    coverageAreas: ['Indiranagar', 'Ulsoor', 'CV Raman Nagar'],
    skills: ['Interior Acrylic Emulsion', 'Waterproofing Base Coat', 'Wood Polish & PU Finish', 'Texture Accent Walls'],
    experienceYears: 6,
    rating: 0,
    completedJobs: 0,
    verificationStatus: 'pending',
    badgeLevel: 'Candidate Apprentice',
    estimatedBasePrice: 900,
    cooperativeUnit: 'Indiranagar Finishes Guild',
    bio: 'Experienced wall applicator undergoing final NSQF Level 4 trade union evaluation. Dedicated to dustless sanding and surface priming.',
    isAvailableNow: false,
    reviews: []
  }
];

export const discoveryService = {
  /**
   * Global Search across Services and Worker Profiles
   * Supports case-insensitive partial keyword matching
   */
  async searchGlobal(query = '') {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { services: [], workers: [], suggestions: [] };
    }

    // Save to recent searches
    this.addRecentSearch(query.trim());

    // 1. Search Services (from live admin catalog / BRAND.services)
    let catalog = [];
    try {
      catalog = await adminService.getServices();
    } catch {
      catalog = BRAND.services;
    }

    const matchedServices = catalog.filter((s) => {
      if (s.isActive === false) return false;
      const titleMatch = s.title.toLowerCase().includes(q);
      const catMatch = s.category.toLowerCase().includes(q);
      const descMatch = (s.shortDesc || '').toLowerCase().includes(q);
      return titleMatch || catMatch || descMatch;
    });

    // 2. Search Workers
    const matchedWorkers = PUBLIC_WORKER_ROSTER.filter((w) => {
      const nameMatch = w.name.toLowerCase().includes(q);
      const tradeMatch = w.trade.toLowerCase().includes(q);
      const catMatch = w.category.toLowerCase().includes(q);
      const skillMatch = w.skills.some((sk) => sk.toLowerCase().includes(q));
      const cityMatch = w.city.toLowerCase().includes(q) || w.area.toLowerCase().includes(q);
      return nameMatch || tradeMatch || catMatch || skillMatch || cityMatch;
    });

    // 3. Generate Autocomplete Suggestions
    const suggestions = [];
    matchedServices.slice(0, 3).forEach((s) => {
      suggestions.push({ type: 'service', label: s.title, id: s.id });
    });
    matchedWorkers.slice(0, 3).forEach((w) => {
      suggestions.push({ type: 'worker', label: `${w.name} (${w.trade})`, id: w.id });
    });

    return {
      services: matchedServices,
      workers: matchedWorkers,
      suggestions,
    };
  },

  /**
   * Advanced Worker Discovery with Filters, Availability, Matching Score & Sorting
   */
  async discoverWorkers({
    query = '',
    category = 'all',
    skill = 'all',
    city = 'all',
    area = '',
    date = '',
    timeSlot = '',
    verifiedOnly = false,
    minRating = 0,
    minCompletedJobs = 0,
    minPrice = 0,
    maxPrice = 10000,
    sortBy = 'relevant', // 'relevant' | 'rating' | 'jobs' | 'price_asc' | 'price_desc' | 'available_soonest'
    page = 1,
    limit = 6,
  } = {}) {
    let list = [...PUBLIC_WORKER_ROSTER];

    // Filter by query string
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((w) =>
        w.name.toLowerCase().includes(q) ||
        w.trade.toLowerCase().includes(q) ||
        w.skills.some((sk) => sk.toLowerCase().includes(q)) ||
        w.area.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (category !== 'all') {
      list = list.filter((w) => w.category === category || w.trade.toLowerCase().includes(category.toLowerCase()));
    }

    // Filter by Skill
    if (skill !== 'all') {
      list = list.filter((w) => w.skills.some((sk) => sk.toLowerCase().includes(skill.toLowerCase())));
    }

    // Filter by City
    if (city !== 'all') {
      list = list.filter((w) => w.city === city);
    }

    // Filter by Area / Locality
    if (area.trim()) {
      const a = area.trim().toLowerCase();
      list = list.filter((w) =>
        w.area.toLowerCase().includes(a) ||
        w.coverageAreas.some((ca) => ca.toLowerCase().includes(a))
      );
    }

    // Filter by Verification Status
    if (verifiedOnly) {
      list = list.filter((w) => w.verificationStatus === 'verified');
    }

    // Filter by Rating
    if (minRating > 0) {
      list = list.filter((w) => (w.rating || 0) >= minRating);
    }

    // Filter by Completed Jobs
    if (minCompletedJobs > 0) {
      list = list.filter((w) => (w.completedJobs || 0) >= minCompletedJobs);
    }

    // Filter by Price
    list = list.filter((w) => w.estimatedBasePrice >= minPrice && w.estimatedBasePrice <= maxPrice);

    // Availability Cross-Check (Connects to bookingService to check confirmed slots)
    if (date && timeSlot) {
      const checkedList = [];
      for (const worker of list) {
        const isFree = await bookingService.checkWorkerAvailability({
          workerId: worker.id,
          date,
          timeSlot,
        });
        checkedList.push({
          ...worker,
          isSlotAvailable: isFree,
        });
      }
      list = checkedList;
    } else {
      list = list.map((w) => ({ ...w, isSlotAvailable: w.isAvailableNow }));
    }

    // Transparent Worker Matching Logic
    list = list.map((worker) => {
      let score = 50;

      // Category match
      if (category !== 'all' && (worker.category === category || worker.trade.includes(category))) {
        score += 25;
      }

      // Area match
      if (area && worker.coverageAreas.some((ca) => ca.toLowerCase().includes(area.toLowerCase()))) {
        score += 20;
      }

      // Verified status
      if (worker.verificationStatus === 'verified') {
        score += 15;
      }

      // Rating quality
      if (worker.rating >= 4.8) {
        score += 10;
      }

      // Availability on requested slot
      if (worker.isSlotAvailable) {
        score += 15;
      }

      return {
        ...worker,
        matchScore: score,
        isRecommended: score >= 85,
      };
    });

    // Sorting Options
    switch (sortBy) {
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'jobs':
        list.sort((a, b) => (b.completedJobs || 0) - (a.completedJobs || 0));
        break;
      case 'price_asc':
        list.sort((a, b) => a.estimatedBasePrice - b.estimatedBasePrice);
        break;
      case 'price_desc':
        list.sort((a, b) => b.estimatedBasePrice - a.estimatedBasePrice);
        break;
      case 'available_soonest':
        list.sort((a, b) => (b.isSlotAvailable ? 1 : 0) - (a.isSlotAvailable ? 1 : 0));
        break;
      case 'relevant':
      default:
        list.sort((a, b) => b.matchScore - a.matchScore);
        break;
    }

    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    return {
      workers: paginated,
      total,
      page,
      totalPages,
    };
  },

  /**
   * Get public worker profile safe for public viewing (No Aadhaar or personal contact)
   */
  async getPublicWorkerProfile(workerId) {
    const worker = PUBLIC_WORKER_ROSTER.find((w) => w.id === workerId || w.workerCode === workerId);
    if (!worker) {
      return PUBLIC_WORKER_ROSTER[0];
    }

    return {
      id: worker.id,
      workerCode: worker.workerCode,
      name: worker.name,
      avatar: worker.avatar,
      trade: worker.trade,
      category: worker.category,
      city: worker.city,
      area: worker.area,
      coverageAreas: worker.coverageAreas,
      skills: worker.skills,
      experienceYears: worker.experienceYears,
      rating: worker.rating,
      completedJobs: worker.completedJobs,
      verificationStatus: worker.verificationStatus,
      badgeLevel: worker.badgeLevel,
      estimatedBasePrice: worker.estimatedBasePrice,
      cooperativeUnit: worker.cooperativeUnit,
      bio: worker.bio,
      reviews: worker.reviews || [],
      isAvailableNow: worker.isAvailableNow,
    };
  },

  /**
   * Saved Workers & Favorites Management
   */
  async getSavedWorkers(customerId) {
    if (isSupabaseConfigured() && customerId) {
      try {
        const { data, error } = await supabase
          .from('saved_workers')
          .select('worker_id')
          .eq('customer_id', customerId);

        if (!error && data && data.length > 0) {
          const ids = data.map((d) => d.worker_id);
          return PUBLIC_WORKER_ROSTER.filter((w) => ids.includes(w.id));
        }
      } catch (err) {
        console.warn('Failed to load saved workers from Supabase:', err.message);
      }
    }

    // LocalStorage fallback
    try {
      const raw = localStorage.getItem(LOCAL_SAVED_WORKERS_KEY);
      const savedIds = raw ? JSON.parse(raw) : ['SS-WRK-7821', 'SS-WRK-3392'];
      return PUBLIC_WORKER_ROSTER.filter((w) => savedIds.includes(w.id));
    } catch {
      return PUBLIC_WORKER_ROSTER.slice(0, 2);
    }
  },

  async toggleSaveWorker(customerId, workerId) {
    let savedIds = [];
    try {
      const raw = localStorage.getItem(LOCAL_SAVED_WORKERS_KEY);
      savedIds = raw ? JSON.parse(raw) : ['SS-WRK-7821', 'SS-WRK-3392'];
    } catch {
      savedIds = ['SS-WRK-7821'];
    }

    const isCurrentlySaved = savedIds.includes(workerId);
    let updated = [];

    if (isCurrentlySaved) {
      updated = savedIds.filter((id) => id !== workerId);
      if (isSupabaseConfigured() && customerId) {
        await supabase
          .from('saved_workers')
          .delete()
          .eq('customer_id', customerId)
          .eq('worker_id', workerId)
          .catch(() => {});
      }
    } else {
      updated = [...savedIds, workerId];
      if (isSupabaseConfigured() && customerId) {
        await supabase
          .from('saved_workers')
          .insert({ customer_id: customerId, worker_id: workerId })
          .catch(() => {});
      }
    }

    localStorage.setItem(LOCAL_SAVED_WORKERS_KEY, JSON.stringify(updated));
    return !isCurrentlySaved;
  },

  async isWorkerSaved(customerId, workerId) {
    try {
      const raw = localStorage.getItem(LOCAL_SAVED_WORKERS_KEY);
      const savedIds = raw ? JSON.parse(raw) : ['SS-WRK-7821', 'SS-WRK-3392'];
      return savedIds.includes(workerId);
    } catch {
      return false;
    }
  },

  /**
   * Recent searches management in localStorage
   */
  getRecentSearches() {
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
      return raw ? JSON.parse(raw) : ['Electrician Indiranagar', 'Leakage detection', 'Modular Kitchen carpentry'];
    } catch {
      return ['Electrician', 'Plumber'];
    }
  },

  addRecentSearch(term) {
    if (!term || term.length < 2) return;
    try {
      const current = this.getRecentSearches().filter((t) => t.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...current].slice(0, 6);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {}
  },

  clearRecentSearches() {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  },
};
