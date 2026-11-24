import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import Logo from '../common/Logo';
import { BRAND } from '../../config/brand';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-brand-surface pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" variant="dark" />
            <p className="text-brand-surface/80 text-sm max-w-sm leading-relaxed mt-3">
              {BRAND.tagline}
            </p>
            <p className="text-brand-surface/60 text-xs max-w-sm leading-relaxed">
              {BRAND.descriptor} — a decentralized cooperative platform empowering skilled craftspeople with equity, steady work, and community governance.
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-brand-teal">
                <ShieldCheck className="w-4 h-4" />
                <span>Worker Verification Protocol</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-brand-gold">
                <HeartHandshake className="w-4 h-4" />
                <span>Cooperative Equity</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-white tracking-wide uppercase text-xs">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-brand-surface/70">
              <li>
                <Link to="/" className="hover:text-brand-teal transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-teal transition-colors">
                  Explore Services
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-brand-teal transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#ecosystem" className="hover:text-brand-teal transition-colors">
                  Cooperative Ecosystem
                </a>
              </li>
              <li>
                <Link to="/verify" className="hover:text-brand-teal transition-colors">
                  Verification System
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-brand-teal transition-colors">
                  Project Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-white tracking-wide uppercase text-xs">
              Skilled Services
            </h4>
            <ul className="space-y-2 text-sm text-brand-surface/70">
              {BRAND.services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services?category=${service.id}`}
                    className="hover:text-brand-teal transition-colors flex items-center justify-between group"
                  >
                    <span>{service.title}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cooperative & Contact */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-white tracking-wide uppercase text-xs">
              Contact & Hubs
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-surface/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                <span>{BRAND.location}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-teal shrink-0" />
                <a href={`mailto:${BRAND.supportEmail}`} className="hover:text-brand-teal transition-colors">
                  {BRAND.supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-teal shrink-0" />
                <a href={`tel:${BRAND.supportPhone}`} className="hover:text-brand-teal transition-colors">
                  {BRAND.supportPhone}
                </a>
              </li>
            </ul>

            <div className="pt-3">
              <Link
                to="/worker/join"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-brand-gold-light transition-colors"
              >
                <span>Worker Cooperative Enrollment</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-surface/60">
          <p>
            &copy; {currentYear} {BRAND.name} Cooperative Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-brand-surface transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-brand-surface transition-colors">
              Contact
            </Link>
            <span className="hover:text-brand-surface cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-brand-surface cursor-pointer">
              Terms & Conditions
            </span>
            <span className="text-brand-teal/80">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
