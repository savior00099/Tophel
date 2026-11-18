import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { DIFFICULTY_TIERS } from '../config/constants';
import { FileText, Download, Printer, CheckCircle2, ShieldCheck, Target, Sparkles, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RoadmapPage() {
  const { sectors } = useData();
  const { user, isAdmin } = useAuth();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSummary = () => {
    const summaryText = `
TOPHEL — PERFORMANCE & CHECKPOINT REPORT
Challenger: ${user?.displayName || 'User'} (${user?.email || 'N/A'})
Generated: ${new Date().toLocaleDateString()}

CHECKPOINTS & DEADLINES
${sectors.map((s) => `${s.sectorNumber || 'Milestone'}: ${s.name} [Deadline: ${s.checkpointDisplay || s.deadline}] - Status: ${s.status} (${s.completionPct || 0}% Complete)`).join('\n')}

SYSTEM RULES
- 85% Checkpoint Clearance Standard
- Never Miss Twice Protocol
- Complete Data Privacy Maintained
    `.trim();

    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tophel_Report_${user?.displayName || 'Challenger'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Top Header ──────────────────────────────────────── */}
      <div className="p-6 rounded-2xl glass-card border border-teal-500/20 glow-teal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Performance Report Card
            </span>
            <span className="text-slate-400 dark:text-dark-600">•</span>
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">Monthly Audit Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-900 dark:text-white tracking-tight">
            {isAdmin ? '1-Year Transformation & Deadline Roadmap' : 'Monthly Performance Report & Checkpoints'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 font-body mt-1">
            {isAdmin
              ? 'Active Window: November 18, 2026 – November 18, 2027 • Master PDF Execution Roadmap.'
              : 'Audit your completed checkpoints, adherence to daily quotas, and download your monthly performance report.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadSummary}
            className="btn-secondary text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Summary</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* ── Master Operating Quotas Table (Admin Only) ──────── */}
      {isAdmin && (
        <div className="glass-card p-6 border-teal-500/20">
          <div className="mb-4">
            <h2 className="text-lg font-black font-sans text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>1. The Weekly Operating Quotas (Daily Non-Negotiables)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-dark-400 font-body mt-1">
              Clear at least 85% of your weekly quotas before going to sleep to unlock the next monthly sector.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-900/80 text-slate-500 dark:text-dark-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">Core Pillar</th>
                  <th className="py-3 px-4 font-bold">Weekly Frequency</th>
                  <th className="py-3 px-4 font-bold">Execution Rule & Daily Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800/60 font-body">
                <tr className="hover:bg-slate-50 dark:hover:bg-dark-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    Sleep & Recovery
                  </td>
                  <td className="py-3.5 px-4 font-mono text-teal-600 dark:text-teal-400 whitespace-nowrap">
                    7 Days / Week
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-dark-300 leading-relaxed">
                    Bed between <strong>2:00 AM – 3:00 AM</strong> and wake between <strong>10:00 AM – 10:30 AM</strong> (7.0 to 8.5 hours).
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-dark-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    Cardio & Weight Loss
                  </td>
                  <td className="py-3.5 px-4 font-mono text-teal-600 dark:text-teal-400 whitespace-nowrap">
                    5 Days (Sun – Thu)<br />
                    <span className="text-blue-500 text-[10px]">Rest: Fri & Sat</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-dark-300 leading-relaxed">
                    Complete <strong>~2 hours of cardio & conditioning</strong> (11:00 AM – 1:00 PM). Friday and Saturday are strict physical rest days.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-dark-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    Hard Diet (Weight Loss)
                  </td>
                  <td className="py-3.5 px-4 font-mono text-teal-600 dark:text-teal-400 whitespace-nowrap">
                    7 Days / Week
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-dark-300 leading-relaxed">
                    Strict <strong>2-meal structure</strong>: portion-controlled "diet dinner" at lunch plus a small, light dinner.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-dark-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    AI Engineering + SAT
                  </td>
                  <td className="py-3.5 px-4 font-mono text-teal-600 dark:text-teal-400 whitespace-nowrap">
                    7 Days / Week
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-dark-300 leading-relaxed">
                    Post-gym syllabus block. Split with March 2027 SAT until exam; shift to <strong>100% AI Engineering</strong> after.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-dark-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    4-Hour Night Block
                  </td>
                  <td className="py-3.5 px-4 font-mono text-teal-600 dark:text-teal-400 whitespace-nowrap">
                    4 Nights (Mon – Thu)<br />
                    <span className="text-purple-500 text-[10px]">Off: Fri – Sun</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-dark-300 leading-relaxed">
                    <strong>Monday–Thursday:</strong> 4+ hours live market trading & backtesting.<br />
                    <strong>Friday–Sunday:</strong> 4 hours off-duty recharge.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Checkpoints & Deadlines Map Table ───────────────── */}
      <div className="glass-card p-6 border-teal-500/20">
        <div className="mb-4">
          <h2 className="text-lg font-black font-sans text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Checkpoints & Audit Status</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-dark-400 font-body mt-1">
            Audit your numbers on every deadline date before advancing to the next level.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-900/80 text-slate-500 dark:text-dark-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">Checkpoint & Deadline</th>
                <th className="py-3 px-4 font-bold">Tier / Domain</th>
                <th className="py-3 px-4 font-bold">Core Objective & Deliverables</th>
                <th className="py-3 px-4 font-bold">Completion</th>
                <th className="py-3 px-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-800/60 font-body">
              {sectors.map((sec) => {
                const tierCfg = DIFFICULTY_TIERS[sec.tier] || DIFFICULTY_TIERS.EASY;
                const isPassed = sec.status === 'PASSED';

                return (
                  <tr key={sec.id} className="hover:bg-slate-50 dark:hover:bg-dark-900/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 dark:text-white block font-sans">{sec.sectorNumber || 'Milestone'}</span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-dark-400">{sec.checkpointDisplay || sec.deadline}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${tierCfg.bgLight} ${tierCfg.bgDark}`}>
                        {sec.tierLabel || sec.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-dark-300 leading-relaxed max-w-md">
                      {sec.objective}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-600 dark:text-teal-400 whitespace-nowrap">
                      {sec.completionPct || 0}%
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isPassed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> [X] PASSED
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400 dark:text-dark-500">
                          [ ] IN PROGRESS
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Game Enforcement Rules ──────────────────────────── */}
      <div className="glass-card p-6 border-teal-500/20 space-y-4">
        <h2 className="text-lg font-black font-sans text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>Core Enforcement Principles</span>
        </h2>

        <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-900 dark:text-teal-200 text-xs leading-relaxed">
          <strong className="text-teal-950 dark:text-teal-300 font-sans block mb-1">
            The "Never Miss Twice" Protocol:
          </strong>
          If an unavoidable emergency forces you to miss a daily study target or workout, you are forbidden from missing that same pillar the following day. Two consecutive misses count as a broken streak.
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-dark-300 font-body leading-relaxed list-disc list-inside">
          <li>
            <strong className="text-slate-900 dark:text-white">85% Clearance Standard:</strong> Each checkpoint requires at least 85% completion across active daily quotas to earn a PASS.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Check-in Ritual:</strong> Dedicate 20 minutes on each checkpoint deadline date auditing your metrics, deliverables, and reflection notes.
          </li>
        </ul>
      </div>
    </div>
  );
}
