import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import { Clock, Flame, Sparkles } from 'lucide-react';

export default function CountdownTimer({ targetDate = null, title = 'Checkpoint Deadline' }) {
  const { days, hours, minutes, seconds, targetDateFormatted } = useCountdown(targetDate);

  const units = [
    { label: 'DAYS', value: String(days).padStart(2, '0') },
    { label: 'HOURS', value: String(hours).padStart(2, '0') },
    { label: 'MINUTES', value: String(minutes).padStart(2, '0') },
    { label: 'SECONDS', value: String(seconds).padStart(2, '0') },
  ];

  return (
    <div className="rounded-2xl ypt-orange-banner p-6 relative overflow-hidden shadow-xl text-white">
      {/* Background Ambient Flare */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Row (YPT D-Day Style) */}
      <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-black/20 text-white border border-white/20">
            D-{days}
          </span>
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-orange-100 font-bold">
              {title}
            </h4>
            <span className="text-xs font-bold text-white/90 font-sans">
              Cutoff: {targetDateFormatted || '18th Checkpoint'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-md">
          <Clock className="w-3.5 h-3.5" />
          <span>23:59:59 CUTOFF</span>
        </div>
      </div>

      {/* Large YPT-Style Central Digits Display */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center relative z-10 pt-1">
        {units.map((u, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-black/20 border border-white/20 backdrop-blur-md shadow-inner group hover:bg-black/30 transition-colors"
          >
            <span className="text-2xl sm:text-4xl font-black font-sans text-white tracking-tight drop-shadow-sm">
              {u.value}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-orange-100 font-bold mt-1">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
