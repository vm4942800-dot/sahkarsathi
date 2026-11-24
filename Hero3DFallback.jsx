import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wrench, Users, CheckCircle, Home, Star } from 'lucide-react';

export default function Hero3DFallback({ className = '' }) {
  return (
    <div className={`relative w-full aspect-square max-w-[540px] mx-auto flex items-center justify-center p-6 ${className}`}>
      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal/20 via-brand-emerald/10 to-brand-gold/15 rounded-3xl filter blur-2xl -z-10" />

      {/* Main Container Card */}
      <div className="relative w-full h-full rounded-3xl bg-gradient-to-b from-white/80 to-white/40 border border-white/90 p-8 shadow-premium backdrop-blur-xl flex flex-col justify-between overflow-hidden">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(#243332 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Top Badges */}
        <div className="flex items-center justify-between z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface/90 border border-brand-border shadow-xs text-xs font-medium text-brand-primary"
          >
            <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
            <span>Cooperative Verified Hub</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-xs font-semibold text-[#8B6B23]"
          >
            <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
            <span>Standardized Quality</span>
          </motion.div>
        </div>

        {/* Center Isometric Architectural House Representation */}
        <div className="relative my-auto flex items-center justify-center py-6">
          <div className="relative w-64 h-56 sm:w-72 sm:h-64 flex items-center justify-center">
            {/* Geometric House Base */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-48 h-44 sm:w-56 sm:h-52 bg-gradient-to-br from-[#202B2B] to-[#2E3D3C] rounded-2xl shadow-2xl p-5 border border-white/10 text-white flex flex-col justify-between"
            >
              {/* Roof Line Accent */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[28px] border-b-brand-teal drop-shadow-md" />
              
              <div className="flex items-center justify-between text-brand-surface/80 pt-2">
                <Home className="w-6 h-6 text-brand-teal" />
                <span className="text-[11px] font-mono tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded">
                  EST. 2025
                </span>
              </div>

              {/* Architectural Windows and Door */}
              <div className="grid grid-cols-2 gap-3 my-auto">
                <div className="h-12 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                  <div className="w-2/3 h-2/3 bg-brand-teal/30 rounded border border-brand-teal/40" />
                </div>
                <div className="h-12 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                  <div className="w-2/3 h-2/3 bg-brand-gold/30 rounded border border-brand-gold/40" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-brand-surface/70">
                <span>Multi-Trade Home</span>
                <span className="text-brand-emerald font-medium">Inspected</span>
              </div>
            </motion.div>

            {/* Orbiting Worker Tag (Top Right) */}
            <motion.div
              animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="absolute -top-2 -right-2 sm:-right-4 px-3 py-2 rounded-xl bg-white/95 border border-brand-border shadow-premium flex items-center gap-2 text-xs font-semibold text-brand-primary"
            >
              <div className="p-1.5 rounded-lg bg-brand-teal/15 text-brand-teal">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-brand-secondary font-normal">Active Trade</span>
                <span className="text-xs">Certified Electrician</span>
              </div>
            </motion.div>

            {/* Orbiting Supervisor Tag (Bottom Left) */}
            <motion.div
              animate={{ y: [0, 6, 0], x: [0, -3, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
              className="absolute -bottom-3 -left-2 sm:-left-4 px-3 py-2 rounded-xl bg-white/95 border border-brand-border shadow-premium flex items-center gap-2 text-xs font-semibold text-brand-primary"
            >
              <div className="p-1.5 rounded-lg bg-brand-emerald/15 text-brand-emerald">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-brand-secondary font-normal">Coordination</span>
                <span className="text-xs">Supervisor On-Site</span>
              </div>
            </motion.div>

            {/* Orbiting Community Node (Bottom Right) */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-2 -right-3 px-3 py-1.5 rounded-xl bg-brand-dark text-white border border-white/10 shadow-lg flex items-center gap-2 text-[11px]"
            >
              <Users className="w-3 h-3 text-brand-gold" />
              <span>Cooperative Trust</span>
            </motion.div>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-brand-border/60 text-center">
          <div className="p-1.5">
            <div className="text-xs sm:text-sm font-bold text-brand-primary">100%</div>
            <div className="text-[10px] text-brand-secondary uppercase tracking-wider">Document Vetted</div>
          </div>
          <div className="p-1.5 border-x border-brand-border/60">
            <div className="text-xs sm:text-sm font-bold text-brand-teal">Direct</div>
            <div className="text-[10px] text-brand-secondary uppercase tracking-wider">Worker Equity</div>
          </div>
          <div className="p-1.5">
            <div className="text-xs sm:text-sm font-bold text-brand-emerald">Co-op</div>
            <div className="text-[10px] text-brand-secondary uppercase tracking-wider">Supervised</div>
          </div>
        </div>
      </div>
    </div>
  );
}
