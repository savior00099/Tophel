import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  MASTER_SECTORS,
  DAILY_OPERATING_QUOTAS,
  PASS_THRESHOLD_PERCENT,
  STORAGE_KEYS,
  ADMIN_EMAIL
} from '../config/constants';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user, isAdmin } = useAuth();
  const userId = user?.uid || 'guest';

  // State keys scoped by user ID to guarantee strict privacy
  const getStorageKey = (prefix) => `${prefix}_${userId}`;

  // 1. Sectors State
  const [sectors, setSectors] = useState(() => {
    const saved = localStorage.getItem(getStorageKey(STORAGE_KEYS.SECTORS));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    // Admin user receives the exact 12-Sector PDF Roadmap
    if (isAdmin) {
      return MASTER_SECTORS;
    }
    // Clean starter milestone for regular users (their own custom sectors)
    return [
      {
        id: 1,
        sectorNumber: 'Sector 01',
        name: 'Sprint 01: Foundation & Habit Lock',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        checkpointDisplay: 'Month 1 Checkpoint',
        tier: 'EASY',
        tierLabel: 'Baseline',
        objective: 'Define your core deliverables, lock in daily non-negotiables, and audit your first milestone.',
        status: 'ACTIVE',
        completionPct: 15,
        auditNotes: 'Started my personalized quest.',
        proofs: []
      }
    ];
  });

  // Re-initialize or load when user switches
  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(getStorageKey(STORAGE_KEYS.SECTORS));
    if (saved) {
      try {
        setSectors(JSON.parse(saved));
        return;
      } catch (e) { }
    }
    if (isAdmin) {
      setSectors(MASTER_SECTORS);
    } else {
      setSectors([
        {
          id: 1,
          sectorNumber: 'Sector 01',
          name: 'Sprint 01: Foundation & Habit Lock',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          checkpointDisplay: 'Month 1 Checkpoint',
          tier: 'EASY',
          tierLabel: 'Baseline',
          objective: 'Define your core deliverables, lock in daily non-negotiables, and audit your first milestone.',
          status: 'ACTIVE',
          completionPct: 15,
          auditNotes: 'Started my personalized quest.',
          proofs: []
        }
      ]);
    }
  }, [user?.uid, isAdmin]);

  // Persist sectors
  useEffect(() => {
    if (user && sectors.length > 0) {
      localStorage.setItem(getStorageKey(STORAGE_KEYS.SECTORS), JSON.stringify(sectors));
    }
  }, [sectors, user?.uid]);

  // Default 5 pillars for custom users
  const DEFAULT_USER_TASKS = [
    {
      id: 'task_sleep',
      title: 'Optimal Recovery Sleep',
      schedule: '7.5 – 8.0 Hours',
      target: 'Go to bed at a consistent hour and wake up with high mental clarity.',
      category: 'Health'
    },
    {
      id: 'task_workout',
      title: 'Physical Health & Workout',
      schedule: 'Daily active movement',
      target: 'Complete your planned cardio, workout, or gym session.',
      category: 'Physical'
    },
    {
      id: 'task_diet',
      title: 'Clean Nutrition & Hydration',
      schedule: 'Balanced fuel',
      target: 'Drink 3L+ water, eliminate junk food, and maintain steady energy.',
      category: 'Nutrition'
    },
    {
      id: 'task_focus',
      title: 'Core Milestone Focus Block',
      schedule: 'Deep work sprint (2–4 hrs)',
      target: 'Execute dedicated focus output towards your active sector objective.',
      category: 'Deep Work'
    },
    {
      id: 'task_review',
      title: 'Review & Evening Mental Reset',
      schedule: 'Night reflection',
      target: 'Audit today’s achievements, outline tomorrow’s top priorities, and recharge.',
      category: 'Reset'
    }
  ];

  // 1b. Customizable User Daily Tasks State
  const [userTasks, setUserTasks] = useState(() => {
    const saved = localStorage.getItem(getStorageKey('tophel_user_tasks'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return DEFAULT_USER_TASKS;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(getStorageKey('tophel_user_tasks'), JSON.stringify(userTasks));
    }
  }, [userTasks, user?.uid]);

  // 2. Daily Logs State
  const [dailyLogs, setDailyLogs] = useState(() => {
    const saved = localStorage.getItem(getStorageKey(STORAGE_KEYS.DAILY_LOGS));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    const today = new Date().toISOString().split('T')[0];
    return {
      [today]: {
        date: today,
        checklist: {
          task_sleep: true,
          task_workout: true,
          task_diet: true,
          task_focus: true,
          task_review: false
        },
        taskDetails: {
          task_sleep: { completed: true, completedAt: '08:15 AM', note: 'Slept 7.8 hrs, woke up energized.' },
          task_workout: { completed: true, completedAt: '12:30 PM', note: 'High intensity conditioning session.' }
        },
        notes: 'Locked in. High energy execution today.',
        weight: null,
        waist: null,
        proofs: []
      }
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(getStorageKey(STORAGE_KEYS.DAILY_LOGS), JSON.stringify(dailyLogs));
    }
  }, [dailyLogs, user?.uid]);

  // 3. Work & Trading Journal State
  const [tradingJournal, setTradingJournal] = useState(() => {
    const saved = localStorage.getItem(getStorageKey(STORAGE_KEYS.WORK_JOURNAL));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      {
        id: 'trade_1',
        date: new Date().toISOString().split('T')[0],
        durationHours: 3.5,
        instrument: isAdmin ? 'NQ / ES Futures' : 'Deep Work Output',
        sessionNotes: isAdmin
          ? 'Clean market structure on NY session. 25 backtest samples with 2:1 R/R.'
          : 'Focused deep work block completed on core deliverables.',
        backtestSummary: '',
        winRate: 75,
        chartUrl: null,
        sectorId: 1
      }
    ];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(getStorageKey(STORAGE_KEYS.WORK_JOURNAL), JSON.stringify(tradingJournal));
    }
  }, [tradingJournal, user?.uid]);

  // ── Actions ────────────────────────────────────────────────

  // Add a new custom daily task
  const addUserTask = (taskData) => {
    const newTask = {
      id: `task_${Date.now()}`,
      title: taskData.title?.trim() || 'New Daily Quota',
      schedule: taskData.schedule?.trim() || 'Flexible target',
      target: taskData.target?.trim() || 'Execute scheduled output.',
      category: taskData.category || 'Focus'
    };
    setUserTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  // Remove a custom daily task
  const deleteUserTask = (taskId) => {
    setUserTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Save individual task reflection note (what was lacked, progress, insights)
  const updateTaskNote = (date, taskId, note) => {
    setDailyLogs((prev) => {
      const dayLog = prev[date] || {
        date,
        checklist: {},
        taskDetails: {},
        notes: '',
        weight: null,
        waist: null,
        proofs: []
      };

      const existingTask = dayLog.taskDetails?.[taskId] || {};
      const updatedDetails = {
        ...(dayLog.taskDetails || {}),
        [taskId]: {
          ...existingTask,
          note,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      };

      return {
        ...prev,
        [date]: {
          ...dayLog,
          taskDetails: updatedDetails
        }
      };
    });
  };

  // Toggle checklist item with automatic completion timestamp
  const toggleDailyItem = (date, itemKey) => {
    setDailyLogs((prev) => {
      const dayLog = prev[date] || {
        date,
        checklist: {},
        taskDetails: {},
        notes: '',
        weight: null,
        waist: null,
        proofs: []
      };

      const isChecked = Boolean(dayLog.checklist?.[itemKey]);
      const newChecked = !isChecked;
      const existingDetails = dayLog.taskDetails?.[itemKey] || {};

      const updatedChecklist = {
        ...dayLog.checklist,
        [itemKey]: newChecked
      };

      const updatedTaskDetails = {
        ...(dayLog.taskDetails || {}),
        [itemKey]: {
          ...existingDetails,
          completed: newChecked,
          completedAt: newChecked
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : null
        }
      };

      return {
        ...prev,
        [date]: {
          ...dayLog,
          checklist: updatedChecklist,
          taskDetails: updatedTaskDetails
        }
      };
    });
  };

  // Update daily notes or body metrics
  const updateDailyLog = (date, fields) => {
    setDailyLogs((prev) => {
      const dayLog = prev[date] || {
        date,
        checklist: { sleep: false, cardio: false, diet: false, aiStudy: false, nightBlock: false },
        notes: '',
        weight: null,
        waist: null,
        proofs: []
      };

      return {
        ...prev,
        [date]: {
          ...dayLog,
          ...fields
        }
      };
    });
  };

  // Update sector details
  const updateSector = (sectorId, updates) => {
    setSectors((prev) =>
      prev.map((sec) => (sec.id === sectorId ? { ...sec, ...updates } : sec))
    );
  };

  // Add custom sector (user building their own)
  const addCustomSector = (customData) => {
    setSectors((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sectorNumber: `Sector ${String(prev.length + 1).padStart(2, '0')}`,
        status: prev.length === 0 ? 'ACTIVE' : 'LOCKED',
        completionPct: 0,
        auditNotes: '',
        proofs: [],
        ...customData
      }
    ]);
  };

  // Delete custom sector
  const deleteSector = (sectorId) => {
    setSectors((prev) => prev.filter((s) => s.id !== sectorId));
  };

  // Add work / trading journal entry
  const addTradingEntry = (entry) => {
    const newEntry = {
      id: `entry_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...entry
    };
    setTradingJournal((prev) => [newEntry, ...prev]);
  };

  // Delete journal entry
  const deleteTradingEntry = (id) => {
    setTradingJournal((prev) => prev.filter((item) => item.id !== id));
  };

  // Reset to default PDF roadmap (admin only)
  const resetToMasterRoadmap = () => {
    if (isAdmin) {
      setSectors(MASTER_SECTORS);
      localStorage.setItem(getStorageKey(STORAGE_KEYS.SECTORS), JSON.stringify(MASTER_SECTORS));
    }
  };

  // Community Pulse
  const getCommunityPulse = () => {
    return [
      { id: '1', name: 'Lead Architect', role: 'Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', streak: 42, activeSector: 'Sector 01' },
      { id: '2', name: 'Elena R.', role: 'Creative Design', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=elena', streak: 19, activeSector: 'Checkpoint 02' },
      { id: '3', name: 'Marcus V.', role: 'Commerce & Finance', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=marcus', streak: 26, activeSector: 'Checkpoint 03' },
      { id: '4', name: 'Dr. Tariq K.', role: 'Science & Lab', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=tariq', streak: 14, activeSector: 'Checkpoint 01' }
    ];
  };

  // Admin stats
  const getAdminStats = () => {
    if (!isAdmin) return null;
    return {
      totalRegisteredUsers: 14,
      activeToday: 9,
      totalQuotasLogged: 482,
      platformClearanceAverage: 88.4,
      usersList: [
        { email: 'architect@tophel.system', name: 'Master Architect', role: 'Admin', joined: '2026-11-18', currentStreak: 42, completionRate: '94%' },
        { email: 'elena@creative.studio', name: 'Elena Rostova', role: 'User', joined: '2026-11-19', currentStreak: 19, completionRate: '88%' },
        { email: 'marcus@finance.io', name: 'Marcus Vance', role: 'User', joined: '2026-11-20', currentStreak: 26, completionRate: '91%' },
        { email: 'tariq@medlab.edu', name: 'Tariq Khan', role: 'User', joined: '2026-11-21', currentStreak: 14, completionRate: '85%' }
      ]
    };
  };

  return (
    <DataContext.Provider
      value={{
        sectors,
        dailyLogs,
        tradingJournal,
        userTasks,
        addUserTask,
        deleteUserTask,
        updateTaskNote,
        toggleDailyItem,
        updateDailyLog,
        updateSector,
        addCustomSector,
        deleteSector,
        addTradingEntry,
        deleteTradingEntry,
        resetToMasterRoadmap,
        getCommunityPulse,
        getAdminStats
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
