import React from 'react';
import { Flame, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function StreakBanner({
  streak = 1,
  hasStreakViolation = false,
  violatedPillars = [],
  className = ''
}) {
  if (hasStreakViolation) {
    return (
      <div className={`p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/40 text-rose-900 dark:text-rose-200 flex items-start gap-3 shadow-sm ${className}`}>
        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0">
          <ShieldAlert className="w-5 h-5 animate-bounce" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-rose-700 dark:text-rose-400 tracking-wide font-sans">
              "NEVER MISS TWICE" PROTOCOL ALERT
            </h4>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-800 dark:text-rose-300 font-semibold">
              Action Required Today
            </span>
          </div>
          <p className="text-xs text-rose-800 dark:text-rose-300/90 mt-1 leading-relaxed">
            Rule: You missed <strong>{violatedPillars.join(', ')}</strong> on two consecutive days. 
            Do not drop this pillar again today. Lock in and execute!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl bg-white dark:bg-dark-900/60 border border-teal-200 dark:border-teal-500/30 flex items-center justify-between gap-4 shadow-sm glow-teal ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
          <Flame className="w-5 h-5 text-teal-600 dark:text-teal-400 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Active Grind Streak
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 font-mono font-bold">
              Unbroken
            </span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white font-sans mt-0.5">
            {streak} Consecutive Days Locked In
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-dark-400 bg-slate-50 dark:bg-dark-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-dark-800">
        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <span>Rule: Never Miss Twice</span>
      </div>
    </div>
  );
}
