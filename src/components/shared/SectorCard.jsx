import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DIFFICULTY_TIERS } from '../../config/constants';
import { ChevronRight, CheckCircle2, Lock, Target } from 'lucide-react';

export default function SectorCard({ sector, isActive = false }) {
  const navigate = useNavigate();
  const tierConfig = DIFFICULTY_TIERS[sector.tier] || DIFFICULTY_TIERS.EASY;
  const isPassed = sector.status === 'PASSED';
  const isLocked = sector.status === 'LOCKED' && !isActive;

  return (
    <div
      onClick={() => navigate(`/sectors/${sector.id}`)}
      className={`glass-card p-5 relative overflow-hidden transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${
        isActive
          ? 'border-teal-500/60 ring-2 ring-teal-500/20 shadow-md shadow-teal-500/10'
          : isPassed
          ? 'border-emerald-500/40'
          : isLocked
          ? 'opacity-70 hover:opacity-100'
          : 'hover:border-teal-500/40'
      }`}
    >
      {/* Top Sector Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold tracking-wider text-teal-600 dark:text-teal-400">
            {sector.sectorNumber}
          </span>
          <span className="text-slate-400 dark:text-dark-600">•</span>
          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${tierConfig.bgLight} ${tierConfig.bgDark}`}>
            {sector.tierLabel || sector.tier}
          </span>
        </div>

        {/* Status Badge */}
        {isPassed ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" /> PASSED
          </span>
        ) : isActive ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/40 animate-pulse">
            ACTIVE
          </span>
        ) : isLocked ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-dark-500 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700">
            <Lock className="w-3 h-3" /> LOCKED
          </span>
        ) : (
          <span className="text-[10px] font-mono text-slate-500 dark:text-dark-400">IN PROGRESS</span>
        )}
      </div>

      {/* Sector Name & Objective */}
      <h3 className="font-sans font-extrabold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
        {sector.name}
      </h3>
      <p className="text-xs text-slate-600 dark:text-dark-300 font-body line-clamp-2 mt-1.5 leading-relaxed">
        {sector.objective}
      </p>

      {/* Checkpoint & Target Stats */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-dark-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-dark-400">
          <Target className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>{sector.checkpointDisplay || sector.deadline}</span>
        </div>
        <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold group-hover:translate-x-1 transition-transform">
          <span>{sector.completionPct || 0}%</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Mini Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-dark-800 rounded-full mt-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isPassed ? 'bg-emerald-500' : 'bg-teal-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, sector.completionPct || 0))}%` }}
        />
      </div>
    </div>
  );
}
