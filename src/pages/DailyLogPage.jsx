import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useStreakDetection } from '../hooks/useStreakDetection';
import ChecklistItem from '../components/shared/ChecklistItem';
import StreakBanner from '../components/shared/StreakBanner';
import {
  Calendar,
  Save,
  Scale,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DailyLogPage() {
  const {
    dailyLogs,
    userTasks,
    toggleDailyItem,
    updateDailyLog,
    updateTaskNote,
    deleteUserTask
  } = useData();
  const { isAdmin } = useAuth();
  const { currentStreak, hasStreakViolation, violatedPillars } = useStreakDetection(dailyLogs);

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const selectedLog = dailyLogs[selectedDate] || {
    checklist: {},
    notes: '',
    weight: '',
    waist: ''
  };

  const [notes, setNotes] = useState(selectedLog.notes || '');
  const [weight, setWeight] = useState(selectedLog.weight || '');
  const [waist, setWaist] = useState(selectedLog.waist || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const log = dailyLogs[newDate] || { checklist: {}, notes: '', weight: '', waist: '' };
    setNotes(log.notes || '');
    setWeight(log.weight || '');
    setWaist(log.waist || '');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    updateDailyLog(selectedDate, {
      notes,
      weight: weight ? parseFloat(weight) : null,
      waist: waist ? parseFloat(waist) : null
    });

    setTimeout(() => {
      setIsSaving(false);
      toast.success(`Log for ${selectedDate} saved!`);
    }, 200);
  };

  const handleToggle = (itemId) => {
    toggleDailyItem(selectedDate, itemId);
    toast.success('Pillar updated');
  };

  const selDateObj = new Date(selectedDate);
  const dayOfWeek = selDateObj.getDay();
  const isFriSat = dayOfWeek === 5 || dayOfWeek === 6;
  const isMonThu = dayOfWeek >= 1 && dayOfWeek <= 4;
  const isFriSun = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

  // If Admin: show the PDF roadmap daily non-negotiables
  // If Normal user: show customizable daily pillars from userTasks
  const quotasForDay = isAdmin
    ? [
        {
          id: 'sleep',
          title: 'Sleep & Recovery Protocol',
          schedule: 'Bed: 2:00 AM – 3:00 AM | Wake: 10:00 AM – 10:30 AM',
          target: '7.0 – 8.5 hours consistent recovery sleep.',
          isRest: false,
          category: 'Recovery'
        },
        {
          id: 'cardio',
          title: isFriSat ? 'Scheduled Physical Recovery Day' : 'Cardio & Conditioning (~2 Hours)',
          schedule: isFriSat ? 'Rest Day' : '11:00 AM – 1:00 PM',
          target: isFriSat ? 'Strict physical rest day. No high-intensity cardio.' : '~2 hours cardio & conditioning starting post-wake at 11:00 AM.',
          isRest: isFriSat,
          category: 'Physical'
        },
        {
          id: 'diet',
          title: 'Hard Diet (Strict 2-Meal Structure)',
          schedule: 'Lunch + Light Evening Dinner',
          target: 'Lunch: portion-controlled "diet dinner" (protein & veggies first, cut excess rice/carbs, zero sugar/fried). Dinner: small, light plate.',
          isRest: false,
          category: 'Nutrition'
        },
        {
          id: 'aiStudy',
          title: 'AI Engineering + SAT Syllabus Block',
          schedule: 'Post-gym shower and lunch study block',
          target: 'Daily syllabus target: personal AI syllabus + March 2027 SAT practice drills.',
          isRest: false,
          category: 'Cognitive'
        },
        {
          id: 'nightBlock',
          title: isMonThu ? '4-Hour Night Market Trading Lock' : 'Protected 4-Hour Recharge Block',
          schedule: isMonThu ? 'Locked 4+ hours live market' : 'Completely off-duty 4 hours',
          target: isMonThu ? 'Lock in 4+ hours live night trading & systematic backtesting.' : 'Protected off-duty recharge for movies, small games, and mental reset.',
          isRest: isFriSun,
          category: 'Market / Reset'
        }
      ]
    : userTasks || [];

  const pastDays = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    pastDays.push(d.toISOString().split('T')[0]);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Top Header ──────────────────────────────────────── */}
      <div className="p-6 rounded-2xl glass-card border border-orange-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Daily Ledger
            </span>
            <span className="text-slate-400 dark:text-dark-600">•</span>
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">Non-Negotiable Operating Quotas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-900 dark:text-white tracking-tight">
            Daily Execution & Quota Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 font-body mt-1">
            Track and verify daily operating pillars day by day.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="input-field text-xs font-mono py-2 px-3"
          />
        </div>
      </div>

      {/* Streak Alert Banner */}
      <StreakBanner
        streak={currentStreak}
        hasStreakViolation={hasStreakViolation}
        violatedPillars={violatedPillars}
      />

      {/* ── Quick Day Scroller ──────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {pastDays.map((dateStr) => {
          const log = dailyLogs[dateStr]?.checklist || {};
          const count = Object.values(log).filter(Boolean).length;
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => handleDateChange(dateStr)}
              className={`p-3 rounded-xl border flex flex-col items-center min-w-[76px] transition-all shrink-0 ${
                isSelected
                  ? 'bg-orange-50 dark:bg-orange-500/15 border-orange-500 shadow-sm'
                  : 'bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-800 hover:border-slate-300 dark:hover:border-dark-700'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-500 dark:text-dark-400 uppercase">
                {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className={`text-sm font-black font-sans mt-0.5 ${isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-white'}`}>
                {new Date(dateStr).getDate()}
              </span>
              <div className="flex items-center gap-0.5 mt-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    count === 5
                      ? 'bg-orange-500'
                      : count >= 3
                      ? 'bg-amber-500'
                      : count > 0
                      ? 'bg-orange-500'
                      : 'bg-slate-300 dark:bg-dark-700'
                  }`}
                />
                <span className="text-[9px] font-mono text-slate-500 dark:text-dark-400">{count}/5</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Quota Checklist for Selected Day ────────────────── */}
      <div className="glass-card p-6 border-orange-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span>Quotas for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </h2>

          <span className="text-xs font-mono text-orange-700 dark:text-orange-400 font-bold px-2.5 py-1 rounded bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30">
            {Object.values(selectedLog.checklist || {}).filter(Boolean).length} / {quotasForDay.length} Cleared
          </span>
        </div>

        <div className="space-y-3">
          {quotasForDay.map((quota) => (
            <ChecklistItem
              key={quota.id}
              item={quota}
              checked={Boolean(selectedLog.checklist?.[quota.id])}
              note={selectedLog.taskDetails?.[quota.id]?.note || ''}
              completedAt={selectedLog.taskDetails?.[quota.id]?.completedAt || null}
              onToggle={handleToggle}
              onSaveNote={(id, noteText) => {
                updateTaskNote(selectedDate, id, noteText);
              }}
              onDelete={!isAdmin ? (id) => deleteUserTask(id) : null}
            />
          ))}
        </div>
      </div>

      {/* ── Daily Notes & Metrics ───────────────────────────── */}
      <form onSubmit={handleSave} className="glass-card p-6 space-y-4">
        <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-dark-800">
          <Scale className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <span>Metrics & Log Notes for {selectedDate}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
              Primary Metric (e.g. Weight / Score)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 78.2"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
              Secondary Metric (e.g. Waist / Hours)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 33.0"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
            Daily Journal & Notes
          </label>
          <textarea
            rows="3"
            placeholder="Log details on workout intensity, study focus, project execution, or reflections..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
            <span>{isSaving ? 'Saving...' : 'Save Ledger Entry'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
