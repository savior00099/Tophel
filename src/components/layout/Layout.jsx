import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div className="min-h-screen bg-offwhite-100 dark:bg-dark-950 text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-200 selection:bg-orange-500 selection:text-white">
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#f8fafc',
            border: '1px solid #27272a',
            fontSize: '13px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          },
          success: {
            iconTheme: {
              primary: '#ea580c',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Main Top Navbar */}
      <Navbar />

      {/* Content Area with Optional Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex gap-8">
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
        <Sidebar />
      </div>

      {/* Bottom Footer */}
      <footer className="border-t border-slate-200 dark:border-dark-900 bg-white/60 dark:bg-dark-950/80 py-6 text-center text-xs font-mono text-slate-500 dark:text-dark-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
            <span className="text-slate-800 dark:text-dark-400 font-bold">TOPHEL</span>
            <span>— Multi-Disciplinary Execution & Checkpoint Engine</span>
          </div>
          <div>
            <span>Nov 18, 2026 – Nov 18, 2027 • 85% Clearance Rule Enforced</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
