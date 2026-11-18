import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../shared/Logo';
import {
  LayoutDashboard,
  Target,
  CalendarCheck,
  TrendingUp,
  FileText,
  ShieldCheck,
  MessageSquare,
  Sun,
  Moon,
  User,
  LogOut,
  Menu,
  X,
  FileCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/sectors', label: 'Checkpoints', icon: Target },
    { to: '/daily-log', label: 'Daily Ledger', icon: CalendarCheck },
    { to: '/journal', label: isAdmin ? 'Trading Journal' : 'Work Journal', icon: TrendingUp },
    { to: '/chat', label: 'Live Chat', icon: MessageSquare, badge: 'LIVE' },
    { to: '/roadmap', label: 'Monthly Report', icon: FileCheck },
  ];

  // Note: Admin Deck is hidden from main navigation bar to keep interface private & clean.
  // Admin can access oversight deck discretely via user profile menu.

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-dark-800/80 bg-white/80 dark:bg-dark-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <Logo size="md" />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                      isActive
                        ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 shadow-sm'
                        : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-900 border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-700 dark:text-orange-300 font-bold border border-orange-500/30">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Menu: Theme Toggle & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark & Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 bg-slate-100 dark:bg-dark-900 text-slate-700 dark:text-dark-300 border border-slate-300 dark:border-dark-700 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-orange-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-dark-900 border border-slate-300 dark:border-dark-700/80 hover:border-orange-500/50 transition-all focus:outline-none"
              >
                <img
                  src={user?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email || 'user'}`}
                  alt="Avatar"
                  className="w-7 h-7 rounded-lg object-cover border border-orange-500/40"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-sans truncate max-w-[110px]">
                    {user?.displayName || 'Active User'}
                  </span>
                  <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400">
                    {isAdmin ? 'Architect' : 'Challenger'}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="p-3 border-b border-slate-100 dark:border-dark-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white font-sans truncate">
                      {user?.displayName}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-dark-400 truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <NavLink
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile & Settings</span>
                    </NavLink>
                    <NavLink
                      to="/roadmap"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Monthly Report Card</span>
                    </NavLink>
                    {isAdmin && (
                      <NavLink
                        to="/admin"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Oversight</span>
                      </NavLink>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-dark-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-red-500 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-800 text-slate-700 dark:text-dark-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-dark-800 bg-white/95 dark:bg-dark-950/95 px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-mono font-medium ${
                    isActive
                      ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30'
                      : 'text-slate-700 dark:text-dark-300 hover:bg-slate-100 dark:hover:bg-dark-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-700 dark:text-orange-300 font-bold">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}
