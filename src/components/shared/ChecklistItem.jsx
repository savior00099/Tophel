import React, { useState } from 'react';
import { Check, Clock, Sparkles, Trash2, Edit3, MessageSquare, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChecklistItem({
  item,
  checked = false,
  onToggle,
  onDelete,
  onSaveNote,
  note = '',
  completedAt = null,
  disabled = false
}) {
  const [showNoteBox, setShowNoteBox] = useState(Boolean(note));
  const [currentNote, setCurrentNote] = useState(note);
  const [isSaved, setIsSaved] = useState(false);

  // Sync internal state when external note changes
  React.useEffect(() => {
    setCurrentNote(note || '');
  }, [note]);

  const handleSaveNote = (e) => {
    e.stopPropagation();
    if (onSaveNote) {
      onSaveNote(item.id, currentNote);
      setIsSaved(true);
      toast.success(`Note saved for "${item.title}"`);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Remove task "${item.title}" from your daily non-negotiables?`)) {
      if (onDelete) {
        onDelete(item.id);
        toast.success(`Task "${item.title}" removed`);
      }
    }
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 select-none overflow-hidden ${
        checked
          ? 'bg-orange-50/70 dark:bg-orange-950/20 border-orange-300 dark:border-orange-500/40 text-slate-900 dark:text-white shadow-sm'
          : item.isRest
          ? 'bg-offwhite-200/50 dark:bg-dark-900/40 border-offwhite-300 dark:border-dark-700/60'
          : 'bg-white dark:bg-dark-800 border-offwhite-300 dark:border-dark-700 hover:border-orange-400 hover:shadow-sm'
      }`}
    >
      {/* ── Main Task Bar (Click anywhere on bar to toggle) ── */}
      <div
        onClick={() => !disabled && onToggle && onToggle(item.id)}
        className="p-4 flex items-start gap-3.5 cursor-pointer"
      >
        {/* YPT-Style Play/Check Circular Button */}
        <div
          className={`w-7 h-7 rounded-full mt-0.5 flex items-center justify-center shrink-0 transition-all ${
            checked
              ? 'bg-orange-600 text-white font-bold shadow-md shadow-orange-500/30'
              : item.isRest
              ? 'border-2 border-slate-300 dark:border-dark-600 bg-offwhite-200 dark:bg-dark-900 text-slate-400'
              : 'border-2 border-orange-400 dark:border-orange-500/80 bg-white dark:bg-dark-900 text-orange-600 group-hover:scale-105'
          }`}
        >
          {checked ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : item.isRest ? (
            <Sparkles className="w-3.5 h-3.5" />
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          )}
        </div>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h4
                className={`font-sans font-bold text-sm tracking-tight ${
                  checked
                    ? 'text-orange-950 dark:text-orange-300 line-through decoration-orange-400/50'
                    : 'text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400'
                }`}
              >
                {item.title}
              </h4>

              {item.isRest ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 font-semibold">
                  RECOVERY DAY
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-offwhite-200 dark:bg-dark-700 text-slate-600 dark:text-dark-300 font-semibold">
                  {item.category || 'QUOTA'}
                </span>
              )}

              {completedAt && (
                <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1">
                  • Completed {completedAt}
                </span>
              )}
            </div>

            {/* Right actions: Schedule + Note toggle + Delete */}
            <div className="flex items-center gap-2 shrink-0">
              {item.schedule && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-dark-400 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-500" />
                  <span>{item.schedule}</span>
                </div>
              )}

              {/* Toggle Note Input */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNoteBox(!showNoteBox);
                }}
                className={`p-1 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors ${
                  showNoteBox || currentNote
                    ? 'text-orange-600 dark:text-orange-400 bg-orange-100/60 dark:bg-orange-500/20'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-700'
                }`}
                title={showNoteBox ? 'Hide reflection note' : 'Add reflection / what you lack'}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">
                  {currentNote ? 'Note Added' : 'Add Note'}
                </span>
                {showNoteBox ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {/* Delete Task Button */}
              {onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Remove this task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Execution description */}
          {item.target && (
            <p className="text-xs text-slate-600 dark:text-dark-300 mt-1 leading-relaxed font-body">
              {item.target}
            </p>
          )}
        </div>
      </div>

      {/* ── Sub-Item Reflection & Lack Note Drawer ─────────── */}
      {showNoteBox && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="border-t border-slate-200 dark:border-dark-700/80 bg-offwhite-100/80 dark:bg-dark-900/90 p-3 sm:px-4 sm:py-3 space-y-2 cursor-default animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono font-bold uppercase text-slate-600 dark:text-dark-300 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Progress Note & What I Lack (Reflection)</span>
            </label>

            <span className="text-[10px] font-mono text-slate-500 dark:text-dark-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Isolated in Tophel Vault</span>
            </span>
          </div>

          <textarea
            rows="2"
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            onBlur={handleSaveNote}
            placeholder="What did you lack or struggle with today? What do you need to improve tomorrow? Any key breakthroughs?"
            className="w-full bg-white dark:bg-dark-950 border border-slate-200 dark:border-dark-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 focus:outline-none focus:border-orange-500 transition-colors resize-none font-body leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 dark:text-dark-400">
              {isSaved ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Saved to Tophel Secure Storage
                </span>
              ) : currentNote ? (
                'Auto-saved on blur or click save'
              ) : (
                'Leave blank or add notes'
              )}
            </span>

            <button
              type="button"
              onClick={handleSaveNote}
              className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-[11px] transition-all active:scale-95 shadow-sm"
            >
              Save Reflection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
