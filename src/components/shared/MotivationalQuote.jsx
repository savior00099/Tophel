import React, { useState, useEffect } from 'react';
import { MOTIVATIONAL_QUOTES } from '../../config/constants';
import { Quote, RefreshCw } from 'lucide-react';

export default function MotivationalQuote({ className = '' }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    setQuoteIndex(dayOfYear % MOTIVATIONAL_QUOTES.length);
  }, []);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex] || MOTIVATIONAL_QUOTES[0];

  return (
    <div className={`glass-card p-5 relative overflow-hidden border border-teal-500/20 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
          <Quote className="w-4 h-4" />
        </div>
        <button
          onClick={nextQuote}
          title="Inspire me"
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-500 dark:text-dark-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium text-slate-800 dark:text-dark-200 italic font-body leading-relaxed">
          "{currentQuote.text}"
        </p>
        <p className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 mt-2 text-right">
          — {currentQuote.author}
        </p>
      </div>
    </div>
  );
}
