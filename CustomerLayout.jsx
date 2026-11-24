import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomerSidebar from './CustomerSidebar';
import CustomerTopNav from './CustomerTopNav';

export default function CustomerLayout({ title, children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 z-40">
        <CustomerSidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-brand-dark/50 backdrop-blur-xs"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-80 max-w-[85vw] h-full z-10"
            >
              <CustomerSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <CustomerTopNav
          title={title}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
