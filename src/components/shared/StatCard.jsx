import React from 'react';

export default function StatCard({
  title,
  value,
  subvalue,
  icon: Icon,
  badge,
  color = 'lime'
}) {
  return (
    <div className="glass-card p-5 relative overflow-hidden group hover:border-lime-500/40 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-dark-400 font-semibold">
            {title}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
              {value}
            </span>
            {subvalue && (
              <span className="text-xs font-mono text-dark-400">
                {subvalue}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400 group-hover:scale-110 transition-transform">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {badge && (
        <div className="mt-3 pt-3 border-t border-dark-800/80">
          <span className="text-[11px] font-mono text-lime-400 font-medium">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}
