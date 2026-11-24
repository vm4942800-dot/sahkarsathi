import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F3EF] flex">
      {/* Admin Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-200">
        <AdminTopNav onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Admin Terminal Footer */}
        <footer className="px-6 py-4 border-t border-brand-border text-center text-xs text-brand-secondary bg-[#F4F3EF]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>
              SahkarSathi Central Executive Administration & Cooperative Registry
            </span>
            <span className="font-mono text-[11px]">
              Every Worker Matters. Every Home Counts. • Multi-State Cooperative Society Act 2002
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
