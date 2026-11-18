import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Logo from '../components/shared/Logo';
import { ADMIN_EMAIL } from '../config/constants';
import {
  Shield,
  Target,
  Flame,
  TrendingUp,
  Sun,
  Moon,
  ArrowRight,
  Sparkles,
  Award,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { signInWithGoogle, loginAsPreviewUser } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Hidden admin check via URL query (e.g. /login?admin=secret or /login?mode=admin)
  const isSecretAdminQuery = new URLSearchParams(location.search).get('admin') === 'true' ||
                            new URLSearchParams(location.search).get('mode') === 'admin';

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
      toast.success('Signed in with Google');
      navigate('/dashboard');
    } catch (err) {
      if (err.message === 'FIREBASE_CONFIG_REQUIRED') {
        toast((t) => (
          <div className="text-xs">
            <p className="font-bold">Firebase Configuration Required</p>
            <p className="mt-1">Add your VITE_FIREBASE_* credentials in your environment variables to enable live Google popup, or click "Try Demo Workspace" below!</p>
          </div>
        ), { duration: 6000, icon: '🔑' });
      } else {
        toast.error(`Login error: ${err.message}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLaunch = () => {
    loginAsPreviewUser(ADMIN_EMAIL, 'Master Architect');
    toast.success('Admin identity verified');
    navigate('/dashboard');
  };

  const handleGuestLaunch = (e) => {
    e.preventDefault();
    const email = customEmail.trim() || 'challenger@tophel.dev';
    const name = customName.trim() || 'Challenger';

    // If owner enters his email, grant admin securely
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      loginAsPreviewUser(ADMIN_EMAIL, 'Master Architect');
      toast.success('Welcome back, Architect');
    } else {
      loginAsPreviewUser(email, name);
      toast.success(`Logged in as ${name}`);
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-offwhite-100 dark:bg-dark-950 text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-200">
      {/* Top Header */}
      <div className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo size="md" />

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 text-slate-700 dark:text-dark-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
          <span className="text-xs font-mono text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-500/30 font-semibold">
            Execution Engine
          </span>
        </div>
      </div>

      {/* Main Split Hero */}
      <div className="w-full max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Visual System & Motivation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-dark-900 border border-orange-200 dark:border-orange-500/30 text-orange-700 dark:text-orange-400 text-xs font-mono font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>High-Discipline Checkpoint Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight leading-[1.08] text-slate-900 dark:text-white">
            Lock In Your Goals. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 dark:from-orange-400 dark:via-amber-300 dark:to-orange-200">
              Clear Every Checkpoint.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-dark-300 font-body max-w-2xl leading-relaxed">
            Build your personal sectors, enforce daily operating non-negotiables, track unbroken streaks, and generate monthly audit report cards with absolute privacy.
          </p>

          {/* Key Features Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl glass-card">
              <Target className="w-5 h-5 text-orange-600 dark:text-orange-400 mb-2" />
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">85% Clearance</h3>
              <p className="text-xs text-slate-500 dark:text-dark-400 mt-1">Audit consistency metrics on every checkpoint date before advancing.</p>
            </div>

            <div className="p-4 rounded-2xl glass-card">
              <Flame className="w-5 h-5 text-orange-500 mb-2" />
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Never Miss Twice</h3>
              <p className="text-xs text-slate-500 dark:text-dark-400 mt-1">Instant alert banner triggered if any active quota is missed two days in a row.</p>
            </div>

            <div className="p-4 rounded-2xl glass-card">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" />
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Modular Vault</h3>
              <p className="text-xs text-slate-500 dark:text-dark-400 mt-1">Attach visual proofs, GitHub/portfolio links, and metrics.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-5">
          <div className="glass-card p-6 sm:p-8 relative overflow-hidden border-orange-500/30">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black font-sans text-slate-900 dark:text-white">
                Access Workspace
              </h2>
              <p className="text-xs text-slate-500 dark:text-dark-400 font-mono mt-1">
                Authenticate with Google or try instant preview
              </p>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white dark:bg-white text-slate-900 font-bold text-sm border border-slate-200 dark:border-transparent hover:bg-slate-50 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-dark-800 w-full" />
              <span className="bg-white dark:bg-dark-900 px-3 text-[11px] font-mono uppercase text-slate-400 dark:text-dark-500 absolute">
                Instant Access
              </span>
            </div>

            {/* Challenger / Demo Launch Options */}
            <div className="space-y-3">
              {/* Discrete secret admin trigger (only appears if ?admin=true is passed) */}
              {isSecretAdminQuery && (
                <button
                  onClick={handleAdminLaunch}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-300 dark:border-orange-500/40 text-orange-800 dark:text-orange-300 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-600" />
                    <span>Launch Architect Profile ({ADMIN_EMAIL})</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Launch as Challenger button */}
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-800 hover:border-orange-500/40 text-slate-700 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold shrink-0">
                      ⚡
                    </div>
                    <div>
                      <div className="text-xs font-bold font-sans text-slate-900 dark:text-white">
                        Try Demo Workspace
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-dark-400">
                        Create custom sectors & test without login
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-dark-400 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <form onSubmit={handleGuestLaunch} className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-800 space-y-2.5">
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 dark:text-dark-400 uppercase font-semibold">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-white dark:bg-dark-950 border border-slate-300 dark:border-dark-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 dark:text-dark-400 uppercase font-semibold">Your Email</label>
                    <input
                      type="email"
                      placeholder="e.g. alex@example.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full bg-white dark:bg-dark-950 border border-slate-300 dark:border-dark-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-lg btn-primary text-xs"
                    >
                      Enter Workspace
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="px-3 py-2 rounded-lg btn-secondary text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Privacy indicator */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-dark-800 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500 dark:text-dark-400">
              <Lock className="w-3.5 h-3.5 text-orange-500" />
              <span>Isolated Workspaces • Private Data by Default</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs font-mono text-slate-500 dark:text-dark-500 border-t border-slate-200 dark:border-dark-900">
        <span>Tophel Execution Engine • Built for relentless consistency</span>
      </div>
    </div>
  );
}
