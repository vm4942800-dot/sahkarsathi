import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ShieldCheck, User, Wrench } from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../common/Button';
import { BRAND } from '../../config/brand';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (href, e) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate(`/${href.substring(1)}`);
      } else {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav shadow-subtle py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-brand-surface/75 px-4 py-1.5 rounded-full border border-brand-border/70 backdrop-blur-md shadow-xs">
            {BRAND.navigation.map((item) => {
              const isHash = item.href.startsWith('/#');
              const isActive = !isHash && location.pathname === item.href;

              if (isHash) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(item.href, e)}
                    className="px-3.5 py-1.5 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 text-brand-primary/80 hover:text-brand-teal hover:bg-white/60"
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-3.5 py-1.5 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-brand-teal shadow-xs'
                      : 'text-brand-primary/80 hover:text-brand-teal hover:bg-white/60'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              to="/login"
              variant="ghost"
              size="sm"
              icon={User}
              className="font-medium"
            >
              Sign In
            </Button>
            <Button
              to="/register"
              variant="primary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              className="shadow-sm font-medium"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              to="/book"
              variant="primary"
              size="sm"
              className="text-xs px-3 py-1.5"
            >
              Book
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl text-brand-primary hover:bg-brand-surface border border-brand-border/60 transition-colors focus:ring-2 focus:ring-brand-teal focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden glass-card-dark border-b border-white/10 px-4 pt-3 pb-6 mx-3 mt-2 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              <div className="text-[11px] font-semibold text-brand-gold uppercase tracking-wider px-3 pt-1">
                Navigation
              </div>
              {BRAND.navigation.map((item) => {
                const isHash = item.href.startsWith('/#');

                if (isHash) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNavClick(item.href, e)}
                      className="px-3 py-2 text-sm font-medium rounded-xl text-brand-surface/90 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-medium rounded-xl text-brand-surface/90 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-white/10" />

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  to="/login"
                  variant="dark"
                  size="sm"
                  className="w-full justify-center text-xs"
                >
                  Sign In
                </Button>
                <Button
                  to="/register"
                  variant="gold"
                  size="sm"
                  className="w-full justify-center text-xs font-semibold"
                >
                  Get Started
                </Button>
              </div>

              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-brand-surface/60 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                  Verified Workers
                </span>
                <span className="flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 text-brand-emerald" />
                  Cooperative Platform
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
