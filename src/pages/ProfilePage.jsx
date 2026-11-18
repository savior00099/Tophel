import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  User,
  ShieldCheck,
  Download,
  FileCheck,
  RefreshCw,
  Printer,
  Award,
  Sun,
  Moon,
  Lock,
  Sparkles,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isAdmin } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const {
    sectors,
    dailyLogs,
    resetToMasterRoadmap
  } = useData();

  const totalLogs = Object.keys(dailyLogs).length;
  const passedSectors = sectors.filter((s) => s.status === 'PASSED').length;

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Top Header ──────────────────────────────────────── */}
      <div className="p-6 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Personal Vault
            </span>
            <span className="text-dark-500">•</span>
            <span className="text-xs font-mono text-dark-400">Settings & Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight">
            Challenger Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-dark-400 font-body mt-1">
            Manage your interface appearance, check your performance streak, and generate monthly reports.
          </p>
        </div>

        <button
          onClick={handlePrintSummary}
          className="btn-primary text-xs flex items-center gap-2 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print Progress Summary</span>
        </button>
      </div>

      {/* ── User ID Card ────────────────────────────────────── */}
      <div className="glass-card p-6 border-orange-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email || 'user'}`}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black font-sans">
                  {user?.displayName || 'Active Challenger'}
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                  VERIFIED ACCOUNT
                </span>
              </div>
              <p className="text-xs font-mono text-dark-400 mt-0.5">
                {user?.email}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono text-dark-400">
                <span>Account Status: Active</span>
                <span>•</span>
                <span className="text-orange-600 dark:text-orange-400 font-semibold">Active Window: 2026–2027</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center sm:text-right">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-dark-800">
              <span className="text-[10px] font-mono text-dark-400 uppercase block">Total Logged Days</span>
              <span className="text-xl font-black font-sans">{totalLogs}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-dark-800">
              <span className="text-[10px] font-mono text-dark-400 uppercase block">Cleared Checkpoints</span>
              <span className="text-xl font-black font-sans text-orange-600 dark:text-orange-400">{passedSectors} / {sectors.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Visual Theme & Experience ───────────────────────── */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-base font-bold font-sans flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-dark-800">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <span>Appearance & Theme</span>
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold font-sans">Dark / Light Mode</h4>
            <p className="text-xs text-dark-400 font-body">
              Switch between warm charcoal dark mode and clean off-white light mode.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="btn-secondary text-xs flex items-center gap-2"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-orange-400" />
                <span>Switch to Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span>Switch to Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Privacy & Cloud Sync Status (All Keys Hidden) ───── */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-dark-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-bold font-sans">
              Privacy & Cloud Security
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30">
            ENCRYPTED & PROTECTED
          </span>
        </div>

        <div className="space-y-3 text-xs text-dark-300 font-body leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 flex items-start gap-3">
            <Lock className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <strong className="text-dark-900 dark:text-white block">Anti-Leak Guarantee:</strong>
              Your journal entries, daily metrics, custom goals, and uploaded proofs are strictly private to your account. No other normal user can access or view your personal progress.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <strong className="text-dark-900 dark:text-white block">Automatic Persistence:</strong>
              Every checklist toggle, metric entry, and milestone is saved automatically in real time.
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="pt-3 border-t border-slate-200 dark:border-dark-800 flex justify-end">
            <button
              onClick={() => {
                if (window.confirm('Reset sectors to default 12-Sector PDF Roadmap?')) {
                  resetToMasterRoadmap();
                  toast.success('Reset to Master 12-Sector PDF roadmap');
                }
              }}
              className="px-3.5 py-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-mono font-semibold transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Master PDF Roadmap</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
