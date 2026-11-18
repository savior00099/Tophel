import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import SectorCard from '../components/shared/SectorCard';
import { DIFFICULTY_TIERS } from '../config/constants';
import { Target, Filter, Trophy, Plus, Shield, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SectorsPage() {
  const { sectors, addCustomSector } = useData();
  const { isAdmin } = useAuth();
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for creating custom sector
  const [sectorName, setSectorName] = useState('');
  const [sectorObjective, setSectorObjective] = useState('');
  const [sectorDeadline, setSectorDeadline] = useState('');
  const [sectorTier, setSectorTier] = useState('INTERMEDIATE');

  const filteredSectors = selectedTier === 'ALL'
    ? sectors
    : sectors.filter((s) => s.tier === selectedTier);

  const passedCount = sectors.filter((s) => s.status === 'PASSED').length;
  const activeSector = sectors.find((s) => s.status === 'ACTIVE');

  const handleCreateSector = (e) => {
    e.preventDefault();
    if (!sectorName.trim()) {
      toast.error('Please enter checkpoint name');
      return;
    }

    addCustomSector({
      name: sectorName.trim(),
      objective: sectorObjective.trim() || 'Achieve customized daily consistency target.',
      deadline: sectorDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkpointDisplay: sectorDeadline ? new Date(sectorDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Month Checkpoint',
      tier: sectorTier,
      tierLabel: sectorTier === 'EASY' ? 'Baseline' : sectorTier === 'INTERMEDIATE' ? 'Growth' : 'Mastery'
    });

    toast.success('New checkpoint added to your roadmap!');
    setShowAddModal(false);
    setSectorName('');
    setSectorObjective('');
    setSectorDeadline('');
  };

  const tierFilters = [
    { key: 'ALL', label: 'All Checkpoints' },
    { key: 'EASY', label: 'Easy' },
    { key: 'INTERMEDIATE', label: 'Intermediate' },
    { key: 'HARD', label: 'Hard' },
    { key: 'BOSS LEVEL', label: 'Boss Level' },
    { key: 'FINAL BOSS', label: 'Final Boss' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Top Header ──────────────────────────────────────── */}
      <div className="p-6 rounded-2xl glass-card border border-teal-500/20 glow-teal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Execution Architecture
            </span>
            <span className="text-slate-400 dark:text-dark-600">•</span>
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">
              {isAdmin ? '12 Monthly Checkpoints' : 'Personal Checkpoints'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-900 dark:text-white tracking-tight">
            {isAdmin ? '12-Sector Game Map & Checkpoints' : 'Your Checkpoints & Deadlines Board'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 font-body mt-1 max-w-2xl">
            Audit your progress on every deadline. Clear at least <strong>85% of your quota</strong> to unlock the next level badge.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Checkpoint</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-dark-950 p-2.5 rounded-xl border border-slate-200 dark:border-dark-800">
            <Trophy className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <div className="text-xs font-mono">
              <span className="text-slate-500 dark:text-dark-400 block text-[10px]">Cleared</span>
              <span className="font-black text-slate-900 dark:text-white">
                {passedCount} / {sectors.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier Filter Chips ──────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-dark-400 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Tier Filter:</span>
        </div>
        {tierFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setSelectedTier(f.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 ${
              selectedTier === f.key
                ? 'bg-teal-600 dark:bg-teal-500 text-white dark:text-dark-950 shadow-sm'
                : 'bg-white dark:bg-dark-900 text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-dark-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Checkpoints Grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSectors.map((sector) => (
          <SectorCard
            key={sector.id}
            sector={sector}
            isActive={sector.id === activeSector?.id}
          />
        ))}
      </div>

      {/* ── Modal: Add Custom Sector ────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 border-teal-500/40 glow-teal animate-in fade-in duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-dark-800">
              <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white">
                Add Custom Roadmap Checkpoint
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-mono text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateSector} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                  Checkpoint Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Creative Video Editing Portfolio"
                  value={sectorName}
                  onChange={(e) => setSectorName(e.target.value)}
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                  Difficulty Tier
                </label>
                <select
                  value={sectorTier}
                  onChange={(e) => setSectorTier(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="EASY">Easy (Bootcamp / Baseline)</option>
                  <option value="INTERMEDIATE">Intermediate (Acceleration)</option>
                  <option value="HARD">Hard (Deep Build)</option>
                  <option value="BOSS LEVEL">Boss Level (Execution)</option>
                  <option value="FINAL BOSS">Final Boss (Mastery Lock)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                  Core Objective & Clear Condition
                </label>
                <textarea
                  rows="3"
                  placeholder="What deliverable or milestone must be completed to earn a PASS?"
                  value={sectorObjective}
                  onChange={(e) => setSectorObjective(e.target.value)}
                  className="input-field text-sm font-body resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                  Target Deadline Date
                </label>
                <input
                  type="date"
                  value={sectorDeadline}
                  onChange={(e) => setSectorDeadline(e.target.value)}
                  className="input-field text-sm font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Create Checkpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
