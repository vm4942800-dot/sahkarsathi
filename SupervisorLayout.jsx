import React, { useState } from 'react';
import SupervisorSidebar from './SupervisorSidebar';
import SupervisorTopNav from './SupervisorTopNav';

export default function SupervisorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F3EF] flex">
      {/* Supervisor Sidebar */}
      <SupervisorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-200">
        <SupervisorTopNav onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Supervisor Portal Footer */}
        <footer className="px-6 py-4 border-t border-brand-border text-center text-xs text-brand-secondary bg-[#F4F3EF]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>
              SahkarSathi Cooperative Project Management & Supervisory Audit Terminal
            </span>
            <span className="font-mono text-[11px]">
              Bureau of Indian Standards (BIS) Protocols • Zero-Conflict Escrow Guarantee
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
