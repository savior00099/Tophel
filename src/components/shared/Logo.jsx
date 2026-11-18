import React from 'react';

export default function Logo({ size = 'md', showSubtitle = true, className = '' }) {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 34, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 46, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 60, text: 'text-4xl', sub: 'text-sm' },
  };

  const { icon, text, sub } = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Vector Logo (Tangerine Orange & Charcoal) */}
      <div className="relative flex items-center justify-center">
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:rotate-6"
        >
          {/* Outer Hex Shield */}
          <polygon
            points="50,6 90,28 90,72 50,94 10,72 10,28"
            stroke="#ea580c"
            strokeWidth="5"
            fill="#18181b"
            fillOpacity="0.95"
            className="filter drop-shadow-[0_0_10px_rgba(234,88,12,0.4)]"
          />

          {/* Inner Target Crosshairs */}
          <circle
            cx="50"
            cy="50"
            r="28"
            stroke="#fb923c"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            strokeDasharray="4 3"
          />
          <circle
            cx="50"
            cy="50"
            r="16"
            stroke="#ea580c"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />

          {/* Central Apex Arrow */}
          <path
            d="M50 24L66 48H56V72H44V48H34L50 24Z"
            fill="url(#orangeGradient)"
            className="filter drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
          />

          {/* Center Target Dot */}
          <circle cx="50" cy="50" r="3.5" fill="#ffffff" />

          {/* Gradients */}
          <defs>
            <linearGradient id="orangeGradient" x1="50" y1="24" x2="50" y2="72" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fb923c" />
              <stop offset="0.6" stopColor="#ea580c" />
              <stop offset="1" stopColor="#c2410c" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5 font-sans font-black tracking-wider">
          <span className={`${text} text-slate-900 dark:text-white tracking-tight`}>
            TOP<span className="text-orange-600 dark:text-orange-500">HEL</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping inline-block" />
        </div>
        {showSubtitle && (
          <span className={`${sub} uppercase tracking-[0.25em] text-slate-500 dark:text-dark-400 font-mono font-semibold -mt-0.5`}>
            Execution Engine
          </span>
        )}
      </div>
    </div>
  );
}
