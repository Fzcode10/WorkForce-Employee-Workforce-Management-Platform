import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ breadcrumbs = [] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content area — offset by sidebar width */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-[250ms]
          ${collapsed ? 'lg:ml-16' : 'lg:ml-60'}`}
      >
        <Header
          onMobileMenuOpen={() => setMobileOpen(true)}
          breadcrumbs={breadcrumbs}
        />
        <main className="flex-1 p-4 md:p-6 max-w-screen-2xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </div>
  );
}
