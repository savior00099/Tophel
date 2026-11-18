import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import FileDropzone from '../components/shared/FileDropzone';
import {
  TrendingUp,
  Plus,
  Trash2,
  Clock,
  Target,
  BarChart2,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function JournalPage() {
  const { tradingJournal, addTradingEntry, deleteTradingEntry } = useData();
  const { isAdmin } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [durationHours, setDurationHours] = useState('3.0');
  const [instrument, setInstrument] = useState(isAdmin ? 'NQ / ES Futures' : 'Deep Work Session');
  const [sessionNotes, setSessionNotes] = useState('');
  const [backtestSummary, setBacktestSummary] = useState('');
  const [winRate, setWinRate] = useState('');
  const [chartUrl, setChartUrl] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sessionNotes.trim()) {
      toast.error('Please add session notes or reflection details');
      return;
    }

    addTradingEntry({
      date,
      durationHours: parseFloat(durationHours) || 3.0,
      instrument,
      sessionNotes,
      backtestSummary,
      winRate: winRate ? parseFloat(winRate) : null,
      chartUrl
    });

    toast.success('Journal session logged!');
    setShowAddModal(false);
    setSessionNotes('');
    setBacktestSummary('');
    setWinRate('');
    setChartUrl(null);
  };

  const totalEntries = tradingJournal.length;
  const currentMonthEntries = tradingJournal.filter((item) => {
    const itemMonth = new Date(item.date).getMonth();
    const currMonth = new Date().getMonth();
    return itemMonth === currMonth;
  }).length;

  const targetNights = 16;
  const progressPct = Math.min(100, Math.round((currentMonthEntries / targetNights) * 100));

  const averageWinRate = tradingJournal.filter((t) => t.winRate).length > 0
    ? Math.round(
        tradingJournal
          .filter((t) => t.winRate)
          .reduce((acc, curr) => acc + curr.winRate, 0) /
          tradingJournal.filter((t) => t.winRate).length
      )
    : 72;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Top Header ──────────────────────────────────────── */}
      <div className="p-6 rounded-2xl glass-card border border-teal-500/20 glow-teal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              {isAdmin ? '4-Hour Night Block' : 'Execution Journal'}
            </span>
            <span className="text-slate-400 dark:text-dark-600">•</span>
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">
              {isAdmin ? 'Mon–Thu Locked Execution (16 Nights/Mo)' : 'Personal Work Ledger'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-900 dark:text-white tracking-tight">
            {isAdmin ? 'Trading Journal & Backtest Proof Vault' : 'Execution & Project Journal'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 font-body mt-1">
            {isAdmin
              ? 'Log live market sessions, backtest data, chart setups, and win rates for the 4-hour Monday–Thursday night grind.'
              : 'Record your deep work blocks, creative sprints, problem-solving notes, and project deliverables.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-xs flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdmin ? 'Log Trading Night' : 'Log Work Session'}</span>
        </button>
      </div>

      {/* ── Monthly Quota Stats Row ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Target */}
        <div className="glass-card p-5 border-teal-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-dark-400 font-bold">
              Monthly Session Target
            </span>
            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20">
              {targetNights} SESSIONS
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black font-sans text-slate-900 dark:text-white">
              {currentMonthEntries} / {targetNights}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">Sessions Completed</span>
          </div>

          <div className="w-full h-2.5 bg-slate-200 dark:bg-dark-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(20,184,166,0.8)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Win-Rate or Focus Rating */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-dark-400 font-bold">
              {isAdmin ? 'Average Win-Rate' : 'Consistency Score'}
            </span>
            <BarChart2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black font-sans text-teal-600 dark:text-teal-400">
              {averageWinRate}%
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">Discipline adherence</span>
          </div>

          <p className="text-[11px] font-mono text-slate-500 dark:text-dark-400 mt-2">
            Adherence to non-negotiables & clear execution rules
          </p>
        </div>

        {/* Total Hours */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-dark-400 font-bold">
              Total Logged Hours
            </span>
            <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black font-sans text-slate-900 dark:text-white">
              {tradingJournal.reduce((acc, curr) => acc + (curr.durationHours || 3), 0).toFixed(1)} hrs
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">{totalEntries} sessions</span>
          </div>

          <p className="text-[11px] font-mono text-slate-500 dark:text-dark-400 mt-2">
            Unbroken deep work recorded
          </p>
        </div>
      </div>

      {/* ── Add Session Modal / Form ────────────────────────── */}
      {showAddModal && (
        <div className="glass-card p-6 border-teal-500/40 glow-teal animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-dark-800">
            <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>{isAdmin ? 'Log 4-Hour Live Trading & Backtest Session' : 'Record Dedicated Work Session'}</span>
            </h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-xs font-mono text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                  Session Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field text-sm font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  className="input-field text-sm font-mono"
                  placeholder="3.0"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                  Subject / Domain
                </label>
                <input
                  type="text"
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="input-field text-sm"
                  placeholder="e.g. Video Editing, NQ Futures, Financial Model"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                Session Execution Notes & Deliverables
              </label>
              <textarea
                rows="3"
                placeholder="What did you build, analyze, study, or execute during this block?..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="input-field text-sm font-body resize-none"
                required
              />
            </div>

            <FileDropzone
              label="Visual Attachment Proof (Chart, Code, Screenshot)"
              helperText="Upload screenshot or progress proof"
              currentUrl={chartUrl}
              onFileSelect={(dataUrl) => setChartUrl(dataUrl)}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs">
                Save Session
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Sessions Feed ───────────────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>Logged Sessions ({tradingJournal.length})</span>
        </h3>

        {tradingJournal.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 dark:text-dark-600 mx-auto" />
            <p className="text-sm text-slate-500 dark:text-dark-400 font-body">
              No journal sessions logged yet. Hit the button above to record your session.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tradingJournal.map((entry) => (
              <div
                key={entry.id}
                className="glass-card p-5 space-y-3 relative group hover:border-teal-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-teal-600 dark:text-teal-400 font-bold">
                    <span>{entry.date}</span>
                    <span className="text-slate-400 dark:text-dark-600">•</span>
                    <span>{entry.durationHours || 3}h Focused</span>
                  </div>

                  <button
                    onClick={() => {
                      deleteTradingEntry(entry.id);
                      toast.success('Session removed');
                    }}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs font-mono text-slate-900 dark:text-white font-semibold">
                  Focus: {entry.instrument || 'Deep Work'}
                </div>

                <p className="text-xs text-slate-600 dark:text-dark-300 font-body leading-relaxed">
                  {entry.sessionNotes}
                </p>

                {entry.chartUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-dark-800 mt-2">
                    <img
                      src={entry.chartUrl}
                      alt="Proof"
                      className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => window.open(entry.chartUrl, '_blank')}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
