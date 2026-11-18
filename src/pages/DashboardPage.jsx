import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useQuotaCalculator } from '../hooks/useQuotaCalculator';
import { useStreakDetection } from '../hooks/useStreakDetection';
import CountdownTimer from '../components/shared/CountdownTimer';
import ChecklistItem from '../components/shared/ChecklistItem';
import StreakBanner from '../components/shared/StreakBanner';
import MotivationalQuote from '../components/shared/MotivationalQuote';
import {
  Target,
  Flame,
  CheckCircle2,
  TrendingUp,
  Scale,
  Calendar,
  Save,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const {
    sectors,
    dailyLogs,
    toggleDailyItem,
    updateDailyLog,
    updateTaskNote,
    getCommunityPulse
  } = useData();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs[todayStr] || {
    checklist: {},
    notes: '',
    weight: '',
    waist: ''
  };

  // Find active sector
  const activeSector = sectors.find((s) => s.status === 'ACTIVE') || sectors[0] || {};

  // Custom hooks
  const {
    currentDayName,
    todayQuotas,
    weeklyConsistencyPct,
    isPassing85Percent
  } = useQuotaCalculator(dailyLogs, activeSector.id);

  const {
    currentStreak,
    hasStreakViolation,
    violatedPillars
  } = useStreakDetection(dailyLogs);

  // Local state for daily notes and metrics form
  const [dailyNotes, setDailyNotes] = useState(todayLog.notes || '');
  const [dailyWeight, setDailyWeight] = useState(todayLog.weight || '');
  const [dailyWaist, setDailyWaist] = useState(todayLog.waist || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDailyMetrics = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateDailyLog(todayStr, {
      notes: dailyNotes,
      weight: dailyWeight ? parseFloat(dailyWeight) : null,
      waist: dailyWaist ? parseFloat(dailyWaist) : null
    });
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Daily metrics & notes locked in!');
    }, 200);
  };

  const handleToggle = (itemId) => {
    toggleDailyItem(todayStr, itemId);
    toast.success('Quota updated');
  };

  const communityPulse = getCommunityPulse();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Top Header Bar (Theme Adaptive) ────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-card border border-orange-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Personal Command Center
            </span>
            <span className="text-slate-400 dark:text-dark-600">•</span>
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-900 dark:text-white tracking-tight">
            Welcome, {user?.displayName || 'Grinder'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 font-body mt-1">
            Currently executing <strong className="text-orange-600 dark:text-orange-400">{activeSector.sectorNumber}: {activeSector.name}</strong> ({activeSector.tierLabel || activeSector.tier})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NavLink
            to={`/sectors/${activeSector.id}`}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <span>View Active Sector</span>
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      </div>

      {/* ── Streak Violation Alert (Never Miss Twice) ───────── */}
      <StreakBanner
        streak={currentStreak}
        hasStreakViolation={hasStreakViolation}
        violatedPillars={violatedPillars}
      />

      {/* ── Hero Stats Row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Countdown Timer to Sector Deadline */}
        <div className="md:col-span-2">
          <CountdownTimer
            targetDate={activeSector.deadline}
            title={`${activeSector.sectorNumber} Checkpoint Cutoff`}
          />
        </div>

        {/* 85% Weekly Consistency Meter */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-500 dark:text-dark-400 font-semibold">
                85% Sector Clearance Meter
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isPassing85Percent
                    ? 'bg-orange-50 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/40'
                    : 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/40'
                }`}
              >
                {isPassing85Percent ? 'ON TRACK (≥85%)' : 'NEEDS FOCUS (<85%)'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-black font-sans text-slate-900 dark:text-white tracking-tight">
                {weeklyConsistencyPct}%
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-dark-400">7-Day Consistency</span>
            </div>

            {/* Threshold progress bar */}
            <div className="w-full h-3 bg-slate-200 dark:bg-dark-800 rounded-full mt-3 overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  weeklyConsistencyPct >= 85
                    ? 'bg-orange-500 shadow-[0_0_12px_rgba(234,88,12,0.8)]'
                    : weeklyConsistencyPct >= 60
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, weeklyConsistencyPct)}%` }}
              />
              {/* 85% Marker Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-900 dark:bg-white shadow-sm z-10"
                style={{ left: '85%' }}
                title="85% Pass Line"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-dark-800 text-[11px] font-mono text-slate-500 dark:text-dark-400 flex items-center justify-between">
            <span>Pass Threshold: 85%</span>
            <span className="text-orange-600 dark:text-orange-400 font-semibold">18th Checkpoint Rule</span>
          </div>
        </div>
      </div>

      {/* ── Today's Smart Day-Aware Quota Checklist ─────────── */}
      <div className="glass-card p-6 border-orange-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping inline-block" />
              <h2 className="text-lg font-black font-sans text-slate-900 dark:text-white tracking-tight">
                Today's Active Quotas ({currentDayName})
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-dark-400 font-body mt-0.5">
              Grade your day by clearing quotas before bedtime.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">
              Completed today:
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30">
              {Object.values(todayLog.checklist || {}).filter(Boolean).length} / 5
            </span>
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-3">
          {todayQuotas.map((quota) => (
            <ChecklistItem
              key={quota.id}
              item={quota}
              checked={Boolean(todayLog.checklist?.[quota.id])}
              note={todayLog.taskDetails?.[quota.id]?.note || ''}
              completedAt={todayLog.taskDetails?.[quota.id]?.completedAt || null}
              onToggle={handleToggle}
              onSaveNote={(id, noteText) => {
                updateTaskNote(todayStr, id, noteText);
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Daily Notes & Metrics Logger ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white">
                Daily Proof & Reflection Log
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">Date: {todayStr}</span>
          </div>

          <form onSubmit={handleSaveDailyMetrics} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 font-semibold mb-1">
                  Morning Metric / Weight
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 78.4 kg"
                  value={dailyWeight}
                  onChange={(e) => setDailyWeight(e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 font-semibold mb-1">
                  Secondary Metric / Measurement
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 33.2 in or score"
                  value={dailyWaist}
                  onChange={(e) => setDailyWaist(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 font-semibold mb-1">
                Daily Execution Notes / Reflection
              </label>
              <textarea
                rows="3"
                placeholder="Log workout intensity, diet adherence, study milestones, or market setups..."
                value={dailyNotes}
                onChange={(e) => setDailyNotes(e.target.value)}
                className="input-field text-sm font-body resize-none"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary text-xs flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Locking in...' : 'Save Daily Log'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Community Pulse & Motivation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white">
                  Active Challengers
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-dark-300">
                Online
              </span>
            </div>

            <div className="space-y-3">
              {communityPulse.map((userItem) => (
                <div
                  key={userItem.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-dark-900/80 border border-slate-200 dark:border-dark-800"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={userItem.avatar}
                      alt={userItem.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-dark-700"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {userItem.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-dark-400">
                        {userItem.activeSector}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono text-orange-600 dark:text-orange-400 font-bold">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>{userItem.streak}d</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <MotivationalQuote />
        </div>
      </div>
    </div>
  );
}
