import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import ProgressRing from '../shared/ProgressRing';
import MotivationalQuote from '../shared/MotivationalQuote';
import { Target, Shield, CheckCircle, Lock, Trophy } from 'lucide-react';

export default function Sidebar() {
  const { sectors } = useData();
  const { isAdmin } = useAuth();

  // Calculate overall 365-day progress
  const totalSectors = sectors.length;
  const passedSectors = sectors.filter((s) => s.status === 'PASSED').length;
  const overallPct = totalSectors > 0 ? Math.round((passedSectors / totalSectors) * 100) : 0;

  return (
    <aside className="hidden xl:flex flex-col w-72 shrink-0 space-y-6">
      {/* 365-Day Transformation Ring */}
      <div className="glass-card p-6 flex flex-col items-center text-center border-orange-500/20">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-dark-400 font-bold mb-3">
          Overall 365-Day XP
        </span>
        <ProgressRing
          percentage={overallPct || 12}
          size={110}
          strokeWidth={9}
          label="CLEARED"
          color="#ea580c"
        />
        <div className="mt-3 flex items-center gap-1.5 text-xs font-mono text-orange-600 dark:text-orange-400 font-bold">
          <Trophy className="w-4 h-4 text-orange-500" />
          <span>{passedSectors} of {totalSectors} Cleared</span>
        </div>
      </div>

      {/* Checkpoint Map Quick-Jump */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-dark-400 font-bold">
            Roadmap Checkpoints
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-dark-300">
            {isAdmin ? '18th of Month' : 'Milestones'}
          </span>
        </div>

        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {sectors.map((sector) => {
            const isPassed = sector.status === 'PASSED';
            const isActive = sector.status === 'ACTIVE';

            return (
              <NavLink
                key={sector.id}
                to={`/sectors/${sector.id}`}
                className={({ isActive: isCurrentRoute }) =>
                  `flex items-center justify-between p-2.5 rounded-xl text-xs font-mono transition-all border ${
                    isCurrentRoute
                      ? 'bg-orange-500/15 border-orange-500/40 text-orange-600 dark:text-orange-400 font-bold'
                      : isActive
                      ? 'bg-slate-100 dark:bg-dark-900 border-orange-500/30 text-slate-900 dark:text-white hover:border-orange-500/50'
                      : isPassed
                      ? 'bg-slate-50 dark:bg-dark-900/50 border-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                      : 'bg-transparent border-transparent text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-dark-200'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isPassed
                        ? 'bg-emerald-500'
                        : isActive
                        ? 'bg-orange-500 animate-ping'
                        : 'bg-slate-300 dark:bg-dark-600'
                    }`}
                  />
                  <span className="font-semibold">{sector.sectorNumber}</span>
                  <span className="text-slate-400 dark:text-dark-500 truncate max-w-[100px]">
                    {sector.name}
                  </span>
                </div>

                {isPassed ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : isActive ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold">
                    ACTIVE
                  </span>
                ) : (
                  <Lock className="w-3 h-3 text-slate-400 dark:text-dark-600 shrink-0" />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Quote Widget */}
      <MotivationalQuote />
    </aside>
  );
}
