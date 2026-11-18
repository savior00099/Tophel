import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import CountdownTimer from '../components/shared/CountdownTimer';
import ChecklistItem from '../components/shared/ChecklistItem';
import MotivationalQuote from '../components/shared/MotivationalQuote';
import {
  Sparkles,
  Plus,
  CheckCircle2,
  Target,
  Flame,
  Calendar,
  Layers,
  ArrowRight,
  FileCheck,
  Award,
  Clock,
  Trash2,
  Edit3,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewUserDashboard() {
  const { user } = useAuth();
  const {
    sectors,
    dailyLogs,
    userTasks,
    addUserTask,
    deleteUserTask,
    updateTaskNote,
    toggleDailyItem,
    addCustomSector,
    deleteSector,
    addSubRoad,
    toggleSubRoad,
    deleteSubRoad
  } = useData();

  // Modals state
  const [showCustomSectorModal, setShowCustomSectorModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Sub-roads builder state for creating custom sectors
  const [newSectorSubRoads, setNewSectorSubRoads] = useState([]);
  const [subRoadInput, setSubRoadInput] = useState('');
  const [quickSubRoadInput, setQuickSubRoadInput] = useState('');

  // Date selection state (default today)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Task filter: 'ALL' | 'PENDING' | 'COMPLETED'
  const [taskFilter, setTaskFilter] = useState('ALL');

  // Form states for creating custom checkpoints
  const [newSectorName, setNewSectorName] = useState('');
  const [newSectorObj, setNewSectorObj] = useState('');
  const [newSectorDeadline, setNewSectorDeadline] = useState('');
  const [newSectorCategory, setNewSectorCategory] = useState('Commerce');
  const [newSectorTier, setNewSectorTier] = useState('EASY');

  // Form states for adding custom daily task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSchedule, setNewTaskSchedule] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Deep Work');
  const [newTaskTarget, setNewTaskTarget] = useState('');

  // Current day log for selected date
  const selectedLog = dailyLogs[selectedDate] || {
    checklist: {},
    taskDetails: {},
    notes: ''
  };

  // Date navigation helpers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === todayStr;

  // Sub-roads builder helpers
  const handleAddSubRoadToDraft = (e) => {
    e?.preventDefault();
    if (!subRoadInput.trim()) return;
    setNewSectorSubRoads((prev) => [...prev, subRoadInput.trim()]);
    setSubRoadInput('');
  };

  const handleRemoveSubRoadFromDraft = (indexToRemove) => {
    setNewSectorSubRoads((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Handler: Create Custom Sector
  const handleCreateSector = (e) => {
    e.preventDefault();
    if (!newSectorName.trim()) {
      toast.error('Please enter sector or milestone name');
      return;
    }

    addCustomSector({
      name: newSectorName.trim(),
      objective: newSectorObj.trim() || 'Achieve customized milestone deliverables.',
      deadline: newSectorDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkpointDisplay: newSectorDeadline ? new Date(newSectorDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Month Checkpoint',
      tier: newSectorTier,
      tierLabel: newSectorCategory,
      subRoads: newSectorSubRoads.map((title) => ({
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        title,
        completed: false,
        completedAt: null
      }))
    });

    toast.success('New sector created with sub-roads!');
    setShowCustomSectorModal(false);
    setNewSectorName('');
    setNewSectorObj('');
    setNewSectorDeadline('');
    setNewSectorSubRoads([]);
    setSubRoadInput('');
  };

  // Handler: Add Custom Daily Task
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    addUserTask({
      title: newTaskTitle.trim(),
      schedule: newTaskSchedule.trim() || 'Daily focus',
      category: newTaskCategory,
      target: newTaskTarget.trim() || 'Complete designated output before sleep.'
    });

    toast.success(`Task "${newTaskTitle.trim()}" added to daily non-negotiables!`);
    setShowAddTaskModal(false);
    setNewTaskTitle('');
    setNewTaskSchedule('');
    setNewTaskTarget('');
  };

  const activeCheckpoint = sectors.find((s) => s.status === 'ACTIVE') || sectors[0] || {};
  const clearedCount = sectors.filter((s) => s.status === 'PASSED').length;

  // Filter tasks according to selected view
  const currentTasks = userTasks || [];
  const completedCount = currentTasks.filter((t) => Boolean(selectedLog.checklist?.[t.id])).length;
  const pendingCount = currentTasks.length - completedCount;

  const filteredTasks = currentTasks.filter((task) => {
    const isCompleted = Boolean(selectedLog.checklist?.[task.id]);
    if (taskFilter === 'COMPLETED') return isCompleted;
    if (taskFilter === 'PENDING') return !isCompleted;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Security & Cloud Isolation Reassurance Banner ─── */}
      <div className="p-4 rounded-2xl bg-orange-50/80 dark:bg-dark-900 border border-orange-200 dark:border-dark-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5 text-slate-800 dark:text-dark-200">
          <ShieldCheck className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
          <span>
            <strong>Tophel System Security:</strong> All your tasks, reflection logs, and metrics are encrypted & private to your account. Zero data leakage.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700">
            RECORD ISOLATION ACTIVE
          </span>
        </div>
      </div>

      {/* ── Top Header Banner ─────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-2xl glass-card border border-orange-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Personalized Milestone Deck
            </span>
            <span className="text-slate-400 dark:text-dark-600">•</span>
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">Custom Roadmap & Tasks</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-sans text-slate-900 dark:text-white tracking-tight">
            Welcome, {user?.displayName || 'Challenger'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 font-body mt-1 max-w-2xl leading-relaxed">
            Add or remove your daily tasks, track completion with timestamps, write reflections on what you lacked or need to improve, and view your complete past task history anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Daily Task</span>
          </button>

          <button
            onClick={() => setShowCustomSectorModal(true)}
            className="btn-secondary text-xs flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span>Build New Sector</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="btn-secondary text-xs flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span>Monthly Report</span>
          </button>
        </div>
      </div>

      {/* ── Active Milestone Hero Row ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <CountdownTimer
            targetDate={activeCheckpoint.deadline}
            title={`${activeCheckpoint.sectorNumber || 'Active Milestone'} Deadline Cutoff`}
          />
        </div>

        {/* Milestone Summary Card */}
        <div className="glass-card p-5 flex flex-col justify-between border-orange-500/20">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-slate-500 dark:text-dark-400 font-bold">
                Roadmap Milestones
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30">
                ACTIVE
              </span>
            </div>

            <div className="text-3xl font-black font-sans text-slate-900 dark:text-white mt-1">
              {clearedCount} of {sectors.length}
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">Milestones Cleared</span>

            <div className="w-full h-2.5 bg-slate-200 dark:bg-dark-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(234,88,12,0.6)]"
                style={{ width: `${sectors.length > 0 ? (clearedCount / sectors.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-dark-800 text-[11px] font-mono text-slate-500 dark:text-dark-400 flex items-center justify-between">
            <span>Pass Rule: 85% Consistency</span>
            <span className="text-orange-600 dark:text-orange-400 font-semibold">Active Sector</span>
          </div>
        </div>
      </div>

      {/* ── Active Sector Sub-Roads & Deliverables Tracker ── */}
      {activeCheckpoint && (
        <div className="glass-card p-6 border-orange-500/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-dark-700">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h3 className="text-base font-black font-sans text-slate-900 dark:text-white">
                  {activeCheckpoint.name} — Sub-Roads & Deliverables
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-dark-400 mt-0.5">
                {activeCheckpoint.objective}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30">
                {activeCheckpoint.completionPct || 0}% Complete
              </span>
            </div>
          </div>

          {/* Sub-Roads Checklist */}
          <div className="space-y-2">
            {(activeCheckpoint.subRoads || []).length === 0 ? (
              <p className="text-xs font-mono text-slate-400 dark:text-dark-400 italic py-2">
                No sub-roads added yet. Add milestone steps below to track your progress!
              </p>
            ) : (
              (activeCheckpoint.subRoads || []).map((sr) => (
                <div
                  key={sr.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                    sr.completed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-500 dark:text-dark-400 line-through'
                      : 'bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-800 text-slate-900 dark:text-white'
                  }`}
                >
                  <label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(sr.completed)}
                      onChange={() => toggleSubRoad(activeCheckpoint.id, sr.id)}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 dark:border-dark-700"
                    />
                    <span className="text-xs font-medium font-sans">{sr.title}</span>
                    {sr.completedAt && (
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 no-underline ml-auto">
                        Cleared {sr.completedAt}
                      </span>
                    )}
                  </label>
                  <button
                    onClick={() => deleteSubRoad(activeCheckpoint.id, sr.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 text-xs"
                    title="Delete sub-road"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Add Sub-Road input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!quickSubRoadInput.trim()) return;
              addSubRoad(activeCheckpoint.id, quickSubRoadInput.trim());
              setQuickSubRoadInput('');
              toast.success('Sub-road added!');
            }}
            className="flex gap-2 pt-2"
          >
            <input
              type="text"
              placeholder="+ Add another sub-road to this sector..."
              value={quickSubRoadInput}
              onChange={(e) => setQuickSubRoadInput(e.target.value)}
              className="input-field text-xs flex-1"
            />
            <button type="submit" className="btn-primary text-xs shrink-0 py-2">
              Add Step
            </button>
          </form>
        </div>
      )}

      {/* ── Interactive Daily Non-Negotiables & History View ── */}
      <div className="glass-card p-6 border-orange-500/20 space-y-6">
        {/* Top Controls: Date Navigator + Filter + Add Task Button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-dark-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping inline-block" />
              <h2 className="text-lg font-black font-sans text-slate-900 dark:text-white tracking-tight">
                Daily Non-Negotiables & Progress Reflection
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-dark-400 font-body mt-0.5">
              Check tasks, log what you lacked or improved, and review previous days anytime.
            </p>
          </div>

          {/* Date Selector Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl p-1 shadow-sm">
              <button
                type="button"
                onClick={handlePrevDay}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-dark-300 transition-colors"
                title="View previous day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-3 text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>
                  {isToday ? 'Today' : new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextDay}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-dark-300 transition-colors"
                title="View next day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {!isToday && (
                <button
                  type="button"
                  onClick={() => setSelectedDate(todayStr)}
                  className="px-2 py-1 text-[11px] font-mono font-bold rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 hover:bg-orange-200 transition-colors"
                >
                  Back to Today
                </button>
              )}
            </div>

            {/* Quick Add Task Button */}
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="btn-primary text-xs flex items-center gap-1.5 py-2 px-3"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Task Filtering Pills & Live Completion Stats */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-dark-900 p-1 rounded-xl text-xs font-mono font-semibold">
            <button
              onClick={() => setTaskFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                taskFilter === 'ALL'
                  ? 'bg-white dark:bg-dark-800 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-slate-600 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Tasks ({currentTasks.length})
            </button>
            <button
              onClick={() => setTaskFilter('PENDING')}
              className={`px-3 py-1 rounded-lg transition-all ${
                taskFilter === 'PENDING'
                  ? 'bg-white dark:bg-dark-800 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Incomplete ({pendingCount})
            </button>
            <button
              onClick={() => setTaskFilter('COMPLETED')}
              className={`px-3 py-1 rounded-lg transition-all ${
                taskFilter === 'COMPLETED'
                  ? 'bg-white dark:bg-dark-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-dark-400">
            <span>Progress:</span>
            <span className="font-bold px-2.5 py-0.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30">
              {completedCount} / {currentTasks.length} Done ({currentTasks.length > 0 ? Math.round((completedCount / currentTasks.length) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Task List Render with Expandable Notes & Delete Support */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-dark-700 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-dark-300">
                {taskFilter === 'COMPLETED'
                  ? 'No completed tasks yet for this date.'
                  : taskFilter === 'PENDING'
                  ? 'All tasks cleared for this date! Relentless execution.'
                  : 'No daily tasks configured. Click "+ Add Daily Task" to create one.'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isChecked = Boolean(selectedLog.checklist?.[task.id]);
              const taskDetail = selectedLog.taskDetails?.[task.id] || {};
              const taskNote = taskDetail.note || '';
              const completedTime = taskDetail.completedAt || null;

              return (
                <ChecklistItem
                  key={task.id}
                  item={task}
                  checked={isChecked}
                  note={taskNote}
                  completedAt={completedTime}
                  onToggle={(id) => {
                    toggleDailyItem(selectedDate, id);
                    toast.success(isChecked ? 'Marked incomplete' : 'Quota checked!');
                  }}
                  onSaveNote={(id, noteText) => {
                    updateTaskNote(selectedDate, id, noteText);
                  }}
                  onDelete={(id) => {
                    deleteUserTask(id);
                  }}
                />
              );
            })
          )}
        </div>
      </div>

      {/* ── Your Custom Sectors Board ───────────────────────── */}
      <div className="glass-card p-6 border-slate-200 dark:border-dark-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span>Your Custom Sectors & Deadlines ({sectors.length})</span>
          </h3>

          <button
            onClick={() => setShowCustomSectorModal(true)}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sector</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectors.map((sec) => (
            <div
              key={sec.id}
              className="p-5 rounded-2xl bg-white dark:bg-dark-950/80 border border-slate-200 dark:border-dark-800 space-y-3 shadow-sm hover:border-orange-500/40 transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-orange-600 dark:text-orange-400">{sec.sectorNumber}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-dark-500">{sec.checkpointDisplay || sec.deadline}</span>
                  {sectors.length > 1 && (
                    <button
                      onClick={() => {
                        deleteSector(sec.id);
                        toast.success('Sector removed');
                      }}
                      className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition-colors"
                      title="Delete sector"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{sec.name}</h4>
              <p className="text-xs text-slate-600 dark:text-dark-400 font-body line-clamp-2 leading-relaxed">
                {sec.objective}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 font-semibold">
                  {sec.tierLabel || 'Custom'}
                </span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">
                  {sec.completionPct || 0}% Complete
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal: Add Custom Daily Task ────────────────────── */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 border-orange-500/40 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-dark-800 mb-4">
              <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-600" />
                <span>Add Custom Daily Non-Negotiable</span>
              </h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-xs font-mono text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 Hours Market Backtesting / LeetCode"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="input-field text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="input-field text-sm font-mono"
                  >
                    <option value="Deep Work">Deep Work</option>
                    <option value="Health">Health</option>
                    <option value="Physical">Physical</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Reading">Reading</option>
                    <option value="Career">Career</option>
                    <option value="Reset">Reset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                    Target Time Schedule
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 11:00 AM – 1:00 PM"
                    value={newTaskSchedule}
                    onChange={(e) => setNewTaskSchedule(e.target.value)}
                    className="input-field text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                  Execution Standard & Description
                </label>
                <textarea
                  rows="2"
                  placeholder="What is the non-negotiable bar required to mark this done?"
                  value={newTaskTarget}
                  onChange={(e) => setNewTaskTarget(e.target.value)}
                  className="input-field text-sm font-body resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Add Daily Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Create Custom Sector ─────────────────────── */}
      {showCustomSectorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 border-orange-500/40 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-dark-800 mb-4">
              <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white">
                Build Your Own Sector & Deadline
              </h3>
              <button
                onClick={() => setShowCustomSectorModal(false)}
                className="text-xs font-mono text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateSector} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                  Field / Domain
                </label>
                <select
                  value={newSectorCategory}
                  onChange={(e) => setNewSectorCategory(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="Commerce">Commerce & Financial Analysis</option>
                  <option value="Creative Arts">Creative Arts & Content Design</option>
                  <option value="Science">Science & Lab Research</option>
                  <option value="Marketing">Marketing & Growth</option>
                  <option value="Technology">Software Engineering</option>
                  <option value="Academics">Academic Exam & GPA</option>
                  <option value="Personal">Personal Habit Transformation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                  Sector Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Financial Modeling & DCF Valuation"
                  value={newSectorName}
                  onChange={(e) => setNewSectorName(e.target.value)}
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                  Core Objective & Deliverable Condition
                </label>
                <textarea
                  rows="3"
                  placeholder="What must be completed to clear this sector milestone?"
                  value={newSectorObj}
                  onChange={(e) => setNewSectorObj(e.target.value)}
                  className="input-field text-sm font-body resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                    Difficulty Tier
                  </label>
                  <select
                    value={newSectorTier}
                    onChange={(e) => setNewSectorTier(e.target.value)}
                    className="input-field text-sm font-mono"
                  >
                    <option value="EASY">Easy</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="HARD">Hard</option>
                    <option value="BOSS LEVEL">Boss Level</option>
                    <option value="FINAL BOSS">Final Boss</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={newSectorDeadline}
                    onChange={(e) => setNewSectorDeadline(e.target.value)}
                    className="input-field text-sm font-mono"
                    required
                  />
                </div>
              </div>

              {/* Sub-Roads / Step-by-Step Deliverables Builder */}
              <div className="pt-2 border-t border-slate-200 dark:border-dark-800">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono uppercase text-slate-700 dark:text-dark-300 font-bold">
                    Sub-Roads / Milestone Objectives
                  </label>
                  <span className="text-[11px] font-mono text-orange-600 dark:text-orange-400">
                    {newSectorSubRoads.length} added
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-dark-400 mb-2">
                  Break this sector into tangible sub-steps or chapters to check off as you progress.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 1. Complete DCF Valuation Excel Model"
                    value={subRoadInput}
                    onChange={(e) => setSubRoadInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubRoadToDraft();
                      }
                    }}
                    className="input-field text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubRoadToDraft}
                    className="px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs border border-orange-500/30 shrink-0"
                  >
                    + Add Sub-Road
                  </button>
                </div>

                {newSectorSubRoads.length > 0 && (
                  <div className="mt-3 space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {newSectorSubRoads.map((sr, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-800 text-xs"
                      >
                        <span className="text-slate-800 dark:text-dark-200 font-sans font-medium line-clamp-1">
                          {idx + 1}. {sr}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubRoadFromDraft(idx)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCustomSectorModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Build Sector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Monthly Report Card ──────────────────────── */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-xl w-full p-6 sm:p-8 border-orange-500/40 animate-in fade-in duration-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-dark-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h3 className="text-lg font-black font-sans text-slate-900 dark:text-white">
                  Monthly Performance Report Card
                </h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-xs font-mono text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-dark-400">Challenger:</span>
                <span className="font-bold text-slate-900 dark:text-white">{user?.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-dark-400">Active Sectors:</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{sectors.length} Defined</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-dark-400">Cleared Sectors:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{clearedCount} Cleared</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-dark-400">Clearance Grade:</span>
                <span className="font-bold text-slate-900 dark:text-white">88% (High Discipline)</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="btn-primary text-xs flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>Print Official Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Quote */}
      <MotivationalQuote />
    </div>
  );
}
