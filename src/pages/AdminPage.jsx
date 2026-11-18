import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { ADMIN_EMAIL } from '../config/constants';
import {
  ShieldCheck,
  Users,
  Search,
  Lock,
  Target,
  BarChart2
} from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const { getAdminStats } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  if (!isAdmin) {
    return (
      <div className="glass-card p-12 text-center space-y-4">
        <Lock className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Restricted Admin Command Deck</h2>
        <p className="text-xs font-mono text-slate-500 dark:text-dark-400">
          This command center is strictly restricted to {ADMIN_EMAIL}.
        </p>
      </div>
    );
  }

  const stats = getAdminStats() || {
    totalRegisteredUsers: 0,
    activeToday: 0,
    totalQuotasLogged: 0,
    platformClearanceAverage: 0,
    usersList: []
  };

  const filteredUsers = stats.usersList.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Top Header ──────────────────────────────────────── */}
      <div className="p-6 rounded-2xl glass-card border border-teal-500/30 glow-teal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Admin Oversight Deck
            </span>
            <span className="text-slate-400 dark:text-dark-600">•</span>
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">Master Deck for {ADMIN_EMAIL}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-900 dark:text-white tracking-tight">
            Platform Users & Progress Oversight
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 font-body mt-1">
            High-level overview of active challengers on Tophel. Normal users cannot view each other's progress.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 dark:bg-dark-950 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-dark-800 text-teal-700 dark:text-teal-400 font-bold shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>AUTHENTICATED ARCHITECT</span>
        </div>
      </div>

      {/* ── Key Analytics Cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <span className="text-xs font-mono uppercase text-slate-500 dark:text-dark-400 font-semibold">Total Challengers</span>
          <div className="text-2xl font-black font-sans text-slate-900 dark:text-white mt-1">
            {stats.totalRegisteredUsers}
          </div>
          <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 mt-1 block">+3 this week</span>
        </div>

        <div className="glass-card p-4">
          <span className="text-xs font-mono uppercase text-slate-500 dark:text-dark-400 font-semibold">Active Today</span>
          <div className="text-2xl font-black font-sans text-teal-600 dark:text-teal-400 mt-1">
            {stats.activeToday}
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-dark-400 mt-1 block">Logged today's quotas</span>
        </div>

        <div className="glass-card p-4">
          <span className="text-xs font-mono uppercase text-slate-500 dark:text-dark-400 font-semibold">Total Quotas Cleared</span>
          <div className="text-2xl font-black font-sans text-slate-900 dark:text-white mt-1">
            {stats.totalQuotasLogged}
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-dark-400 mt-1 block">Across all active pillars</span>
        </div>

        <div className="glass-card p-4">
          <span className="text-xs font-mono uppercase text-slate-500 dark:text-dark-400 font-semibold">Average 85% Clearance</span>
          <div className="text-2xl font-black font-sans text-teal-600 dark:text-teal-400 mt-1">
            {stats.platformClearanceAverage}%
          </div>
          <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 mt-1 block">High discipline standard</span>
        </div>
      </div>

      {/* ── Users Directory Table ───────────────────────────── */}
      <div className="glass-card p-6 border-slate-200 dark:border-dark-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Registered Challengers Directory</span>
          </h3>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 dark:text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field text-xs pl-9 py-2"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-900/80 text-slate-500 dark:text-dark-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">User</th>
                <th className="py-3 px-4 font-bold">Role</th>
                <th className="py-3 px-4 font-bold">Joined</th>
                <th className="py-3 px-4 font-bold">Streak</th>
                <th className="py-3 px-4 font-bold">Clearance Rate</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-800/60 font-body">
              {filteredUsers.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-dark-900/40 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-900 dark:text-white block font-sans">{u.name}</span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-dark-400">{u.email}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                      u.role === 'Admin' ? 'bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/40' : 'bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-dark-400 whitespace-nowrap">
                    {u.joined}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-600 dark:text-teal-400 whitespace-nowrap">
                    {u.currentStreak} Days
                  </td>
                  <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                    <span className="text-slate-900 dark:text-white font-bold">{u.completionRate}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 text-slate-700 dark:text-dark-200 hover:text-teal-600 dark:hover:text-teal-400 text-xs font-mono transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── User Inspection Modal ───────────────────────────── */}
      {selectedUser && (
        <div className="glass-card p-6 border-teal-500/40 glow-teal animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-dark-800 mb-4">
            <div>
              <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white">
                Challenger Oversight: {selectedUser.name}
              </h3>
              <p className="text-xs font-mono text-slate-500 dark:text-dark-400">{selectedUser.email}</p>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-xs font-mono text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800">
              <span className="text-slate-500 dark:text-dark-400 block mb-1">Consistency Metric</span>
              <span className="text-lg font-bold text-teal-600 dark:text-teal-400">{selectedUser.completionRate}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800">
              <span className="text-slate-500 dark:text-dark-400 block mb-1">Current Unbroken Streak</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{selectedUser.currentStreak} Days</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800">
              <span className="text-slate-500 dark:text-dark-400 block mb-1">Privacy Status</span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Vault Encrypted</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
