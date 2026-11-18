import React, { useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { DIFFICULTY_TIERS } from '../config/constants';
import CountdownTimer from '../components/shared/CountdownTimer';
import FileDropzone from '../components/shared/FileDropzone';
import {
  ArrowLeft,
  CheckCircle2,
  Save,
  Link as LinkIcon,
  Sparkles,
  Target,
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink,
  Edit3,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SectorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { sectors, updateSector, addSubRoad, toggleSubRoad, deleteSubRoad } = useData();
  const [newSubRoadText, setNewSubRoadText] = useState('');

  const sectorId = parseInt(id, 10);
  const sector = sectors.find((s) => s.id === sectorId);

  if (!sector) {
    return (
      <div className="glass-card p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Checkpoint Not Found</h2>
        <NavLink to="/sectors" className="btn-primary inline-block text-xs">
          Return to Checkpoints Board
        </NavLink>
      </div>
    );
  }

  const tierConfig = DIFFICULTY_TIERS[sector.tier] || DIFFICULTY_TIERS.EASY;

  // Editable sector properties
  const [sectorName, setSectorName] = useState(sector.name || '');
  const [sectorObjective, setSectorObjective] = useState(sector.objective || '');
  const [sectorDeadline, setSectorDeadline] = useState(sector.deadline || '');
  const [completionPct, setCompletionPct] = useState(sector.completionPct || 0);
  const [status, setStatus] = useState(sector.status || 'ACTIVE');
  const [auditNotes, setAuditNotes] = useState(sector.auditNotes || '');

  // Dynamic Proof Vault items (Links, Metrics, Files)
  const [proofs, setProofs] = useState(() => sector.proofs || [
    { id: '1', type: 'link', title: 'Deliverable / Project URL', value: 'https://github.com/my-project' }
  ]);

  const [newProofType, setNewProofType] = useState('link');
  const [newProofTitle, setNewProofTitle] = useState('');
  const [newProofValue, setNewProofValue] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Add proof item to vault
  const handleAddProof = (e) => {
    e.preventDefault();
    if (newProofType === 'image') {
      if (!uploadedFileUrl) {
        toast.error('Please upload an image file first');
        return;
      }
      const newEntry = {
        id: `proof_${Date.now()}`,
        type: 'image',
        title: newProofTitle.trim() || 'Visual Screenshot Proof',
        value: uploadedFileUrl
      };
      setProofs((prev) => [...prev, newEntry]);
      setUploadedFileUrl(null);
      setNewProofTitle('');
      toast.success('Screenshot proof attached!');
    } else {
      if (!newProofValue.trim()) {
        toast.error('Please enter link or metric value');
        return;
      }
      const newEntry = {
        id: `proof_${Date.now()}`,
        type: newProofType,
        title: newProofTitle.trim() || (newProofType === 'link' ? 'Deliverable Link' : 'Target Metric'),
        value: newProofValue.trim()
      };
      setProofs((prev) => [...prev, newEntry]);
      setNewProofTitle('');
      setNewProofValue('');
      toast.success('Proof item added to vault!');
    }
  };

  const handleRemoveProof = (proofId) => {
    setProofs((prev) => prev.filter((p) => p.id !== proofId));
    toast.success('Proof removed');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    updateSector(sectorId, {
      name: sectorName,
      objective: sectorObjective,
      deadline: sectorDeadline,
      completionPct: parseInt(completionPct, 10),
      status,
      auditNotes,
      proofs
    });

    setTimeout(() => {
      setIsSaving(false);
      toast.success('Checkpoint details & proof vault saved!');
    }, 250);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Top Navigation & Actions ───────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/sectors')}
          className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Checkpoints Board</span>
        </button>

        <button
          type="button"
          onClick={() => setStatus(status === 'PASSED' ? 'ACTIVE' : 'PASSED')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
            status === 'PASSED'
              ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 shadow-sm'
              : 'bg-slate-100 dark:bg-dark-900 text-slate-700 dark:text-dark-300 border border-slate-200 dark:border-dark-700 hover:border-teal-500/40'
          }`}
        >
          {status === 'PASSED' ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Checkpoint Cleared (PASSED)</span>
            </>
          ) : (
            <>
              <Target className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Mark as PASSED</span>
            </>
          )}
        </button>
      </div>

      {/* ── Sector Header (Theme Adaptive) ─────────────────── */}
      <div className="p-6 sm:p-8 rounded-2xl glass-card border-teal-500/20 glow-teal relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-mono font-bold text-teal-600 dark:text-teal-400">
                {sector.sectorNumber}
              </span>
              <span className="text-slate-400 dark:text-dark-600">•</span>
              <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${tierConfig.bgLight} ${tierConfig.bgDark}`}>
                {sector.tierLabel || sector.tier}
              </span>
              <span className="text-slate-400 dark:text-dark-600">•</span>
              <span className="text-xs font-mono text-slate-500 dark:text-dark-400">
                Deadline: {sector.checkpointDisplay || sector.deadline}
              </span>
            </div>

            {/* Editable Title */}
            <input
              type="text"
              value={sectorName}
              onChange={(e) => setSectorName(e.target.value)}
              className="text-2xl sm:text-3xl font-black font-sans bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-dark-700 focus:border-teal-500 text-slate-900 dark:text-white outline-none w-full pb-1"
            />

            {/* Editable Objective */}
            <textarea
              rows="2"
              value={sectorObjective}
              onChange={(e) => setSectorObjective(e.target.value)}
              className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 font-body leading-relaxed bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-dark-700 focus:border-teal-500 outline-none w-full resize-none"
            />
          </div>

          {/* Completion Slider Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 min-w-[200px] text-center shadow-inner">
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400 block mb-1">
              Live Progress
            </span>
            <span className="text-3xl font-black font-sans text-teal-600 dark:text-teal-400">
              {completionPct}%
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={completionPct}
              onChange={(e) => setCompletionPct(e.target.value)}
              className="w-full accent-teal-500 mt-2 cursor-pointer"
            />
            <span className="text-[10px] font-mono text-slate-400 dark:text-dark-500 block mt-1">
              Pass requires ≥85%
            </span>
          </div>
        </div>
      </div>

      {/* ── Countdown to Deadline ───────────────────────────── */}
      <CountdownTimer
        targetDate={sectorDeadline || sector.deadline}
        title={`${sector.sectorNumber} Checkpoint Cutoff`}
      />

      {/* ── Sub-Roads / Milestone Objectives Checklist ─────────── */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-dark-800">
          <div>
            <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span>Sector Sub-Roads & Deliverable Steps</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-dark-400 font-body mt-0.5">
              Check off deliverables as you complete them. Progress percentage recalculates automatically.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30">
            {sector.subRoads?.filter((s) => s.completed).length || 0} of {sector.subRoads?.length || 0} Cleared
          </span>
        </div>

        <div className="space-y-2">
          {(sector.subRoads || []).length === 0 ? (
            <p className="text-xs font-mono text-slate-400 dark:text-dark-500 italic py-2">
              No sub-roads added yet. Add step-by-step targets below!
            </p>
          ) : (
            (sector.subRoads || []).map((sr) => (
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
                    onChange={() => toggleSubRoad(sector.id, sr.id)}
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
                  type="button"
                  onClick={() => deleteSubRoad(sector.id, sr.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 text-xs"
                  title="Delete sub-road"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Form: Quick Add Sub-Road */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newSubRoadText.trim()) return;
            addSubRoad(sector.id, newSubRoadText.trim());
            setNewSubRoadText('');
            toast.success('Sub-road added!');
          }}
          className="flex gap-2 pt-2"
        >
          <input
            type="text"
            placeholder="+ Add a new sub-road to this sector..."
            value={newSubRoadText}
            onChange={(e) => setNewSubRoadText(e.target.value)}
            className="input-field text-xs flex-1"
          />
          <button type="submit" className="btn-primary text-xs shrink-0 py-2">
            Add Step
          </button>
        </form>
      </div>

      {/* ── Dynamic Modular Proof Vault ─────────────────────── */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-dark-800">
          <div>
            <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Modular Proof Vault (Attach Anything)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-dark-400 font-body mt-0.5">
              Upload screenshots, link deliverables (GitHub, Figma, live URLs), or record target metrics.
            </p>
          </div>
        </div>

        {/* Form: Add New Proof Entry */}
        <form onSubmit={handleAddProof} className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950/80 border border-slate-200 dark:border-dark-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                Proof Type
              </label>
              <select
                value={newProofType}
                onChange={(e) => setNewProofType(e.target.value)}
                className="input-field text-xs"
              >
                <option value="link">Deliverable Link (GitHub, Figma, Web)</option>
                <option value="metric">Key Metric / Number (Weight, Score, Hours)</option>
                <option value="image">Screenshot / Photo Attachment</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                Title / Label
              </label>
              <input
                type="text"
                placeholder="e.g. Figma Prototype / SAT Mock / Scale Photo"
                value={newProofTitle}
                onChange={(e) => setNewProofTitle(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            {newProofType !== 'image' && (
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-500 dark:text-dark-400 mb-1">
                  URL or Metric Value
                </label>
                <input
                  type="text"
                  placeholder={newProofType === 'link' ? 'https://...' : 'e.g. 78.4 kg or 1480'}
                  value={newProofValue}
                  onChange={(e) => setNewProofValue(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            )}
          </div>

          {newProofType === 'image' && (
            <div className="pt-2">
              <FileDropzone
                label="Select Screenshot or Progress Photo"
                currentUrl={uploadedFileUrl}
                onFileSelect={(dataUrl) => setUploadedFileUrl(dataUrl)}
              />
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button type="submit" className="btn-primary text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Attach Proof to Vault</span>
            </button>
          </div>
        </form>

        {/* Attached Proofs Gallery */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-dark-400 font-semibold">
            Attached Proofs in Vault ({proofs.length})
          </h4>

          {proofs.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-dark-500 italic">
              No proofs attached yet. Add your first proof above.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {proofs.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 flex items-start justify-between gap-3 shadow-sm group"
                >
                  <div className="flex items-start gap-2.5 truncate">
                    {p.type === 'image' ? (
                      <ImageIcon className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                    ) : (
                      <LinkIcon className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                    )}
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                        {p.title}
                      </span>
                      {p.type === 'link' ? (
                        <a
                          href={p.value}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 truncate"
                        >
                          <span className="truncate">{p.value}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : p.type === 'image' ? (
                        <img
                          src={p.value}
                          alt={p.title}
                          className="w-24 h-16 object-cover rounded-lg mt-1 border border-slate-200 dark:border-dark-700"
                        />
                      ) : (
                        <span className="text-[11px] font-mono text-slate-700 dark:text-dark-300 font-bold">
                          {p.value}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveProof(p.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                    title="Remove proof"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Monthly Audit Reflection Notes ──────────────────── */}
      <div className="glass-card p-6 space-y-3">
        <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-dark-800">
          <Edit3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>Checkpoint Audit Notes</span>
        </h3>
        <textarea
          rows="3"
          placeholder="Reflect on this checkpoint: what worked, habits mastered, metrics achieved, and areas of improvement..."
          value={auditNotes}
          onChange={(e) => setAuditNotes(e.target.value)}
          className="input-field text-sm font-body resize-none"
        />
      </div>

      {/* ── Save Action Bar ─────────────────────────────────── */}
      <div className="flex items-center justify-between p-4 rounded-xl glass-card">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-dark-400">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Changes are safely persisted in real time</span>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary text-xs flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Locking in Proofs...' : 'Save Checkpoint'}</span>
        </button>
      </div>
    </div>
  );
}
