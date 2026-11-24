import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-brand-surface text-brand-primary flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-lg w-full p-8 sm:p-12 rounded-3xl bg-white border border-brand-border shadow-xl text-center space-y-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-surface border border-brand-border text-brand-secondary text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
            SahkarSathi Portal Verification
          </div>

          <div className="space-y-2">
            <span className="font-mono text-6xl sm:text-7xl font-extrabold text-brand-teal block tracking-tight">
              404
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed max-w-sm mx-auto">
              The cooperative dispatch, service page, or document you requested does not exist or has been relocated.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-border text-xs text-brand-secondary flex items-center justify-center gap-3">
            <span>Looking for trusted trades?</span>
            <Link
              to="/customer/services"
              className="text-brand-teal font-bold hover:text-brand-primary transition-colors flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse Services</span>
            </Link>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              to="/"
              variant="primary"
              size="md"
              icon={Home}
              className="w-full sm:w-auto font-bold shadow-xs"
            >
              Return Home
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="secondary"
              size="md"
              icon={ArrowLeft}
              className="w-full sm:w-auto font-semibold"
            >
              Go Back
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
