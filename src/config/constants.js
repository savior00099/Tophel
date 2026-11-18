// ============================================================
// Tophel — Multi-Disciplinary Execution & Checkpoint Architecture
// Inspired by high-performance systems and modern design aesthetics.
// ============================================================

export const APP_NAME = 'Tophel';
export const APP_TAGLINE = 'Personalized Execution Engine & Milestone Tracker';
export const APP_VERSION = '1.2.0';

// ── Master Admin Account ─────────────────────────────────────
// Defaults to environment variable or verified admin email
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'as3625525@gmail.com';

// ── 365-Day Window (Master Architecture) ────────────────────
export const ROADMAP_START_DATE = '2026-11-18';
export const ROADMAP_END_DATE = '2027-11-18';
export const TOTAL_DAYS = 365;
export const TOTAL_SECTORS = 12;
export const PASS_THRESHOLD_PERCENT = 85;

// ── Modern Palette Difficulty Tiers (Theme Compatible) ──────
export const DIFFICULTY_TIERS = {
  EASY: {
    key: 'EASY',
    label: 'Easy (Bootcamp / Baseline)',
    color: 'teal',
    bgLight: 'bg-teal-50 text-teal-800 border-teal-200',
    bgDark: 'dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60',
    hex: '#14b8a6',
    xp: 1000
  },
  INTERMEDIATE: {
    key: 'INTERMEDIATE',
    label: 'Intermediate (Acceleration)',
    color: 'emerald',
    bgLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    bgDark: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    hex: '#10b981',
    xp: 2500
  },
  HARD: {
    key: 'HARD',
    label: 'Hard (Deep Build & Proof)',
    color: 'amber',
    bgLight: 'bg-amber-50 text-amber-800 border-amber-200',
    bgDark: 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    hex: '#f59e0b',
    xp: 5000
  },
  BOSS_LEVEL: {
    key: 'BOSS LEVEL',
    label: 'Boss Level (Execution & Launch)',
    color: 'rose',
    bgLight: 'bg-rose-50 text-rose-800 border-rose-200',
    bgDark: 'dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    hex: '#f43f5e',
    xp: 8000
  },
  FINAL_BOSS: {
    key: 'FINAL BOSS',
    label: 'Final Boss (Mastery Lock)',
    color: 'purple',
    bgLight: 'bg-purple-50 text-purple-800 border-purple-200',
    bgDark: 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
    hex: '#a855f7',
    xp: 15000
  }
};

// ── Master 12 Sectors (EXCLUSIVELY Private to as3625525@gmail.com) ──
export const MASTER_SECTORS = [
  {
    id: 1,
    sectorNumber: 'Sector 01',
    deadline: '2026-12-18',
    checkpointDisplay: 'Dec 18, 2026',
    tier: 'EASY',
    tierLabel: 'Bootcamp',
    name: 'Lock the Base Loop',
    objective: 'Complete 20/20 Sun–Thu cardio sessions, survive 30 days on the 2-meal hard diet with zero sugar relapses, hit 16/16 Mon–Thu 4-hr trading/backtest nights, and stay on pace with your AI + SAT syllabus.',
    quotas: { cardioTarget: 20, dietDaysTarget: 30, tradingNightsTarget: 16, aiSatDaysTarget: 30 },
    targets: { weightTarget: 'Initial Baseline', aiProgressTarget: '15% Foundation', satTarget: 'Diagnostic Test' },
    status: 'ACTIVE',
    completionPct: 15,
    auditNotes: 'Baseline established on Nov 18. Daily cardio cadence set at 11:00 AM.'
  },
  {
    id: 2,
    sectorNumber: 'Sector 02',
    deadline: '2027-01-18',
    checkpointDisplay: 'Jan 18, 2027',
    tier: 'EASY',
    tierLabel: 'Momentum',
    name: 'Eliminate Friction',
    objective: 'Zero missed Monday–Thursday 4-hour trading locks; visible initial drop in body weight and waist measurement; complete a second uninterrupted month of daily AI + SAT syllabus milestones.',
    quotas: { cardioTarget: 20, dietDaysTarget: 30, tradingNightsTarget: 16, aiSatDaysTarget: 30 },
    targets: { weightTarget: '-3 kg from start', aiProgressTarget: '30% Core Math & Python', satTarget: 'Math Section Drills' },
    status: 'LOCKED',
    completionPct: 0,
    auditNotes: ''
  },
  {
    id: 3,
    sectorNumber: 'Sector 03',
    deadline: '2027-02-18',
    checkpointDisplay: 'Feb 18, 2027',
    tier: 'EASY',
    tierLabel: 'Pre-Boss',
    name: 'SAT Simulation & Stamina',
    objective: 'Increase cardio endurance without increasing meal portions; complete timed full-length SAT practice drills inside your daily grind while advancing your AI Engineering syllabus.',
    quotas: { cardioTarget: 20, dietDaysTarget: 30, tradingNightsTarget: 16, aiSatDaysTarget: 30 },
    targets: { weightTarget: '-5 kg total', aiProgressTarget: '45% Machine Learning Foundations', satTarget: '1450+ Practice Target' },
    status: 'LOCKED',
    completionPct: 0,
    auditNotes: ''
  },
  {
    id: 4,
    sectorNumber: 'Sector 04',
    deadline: '2027-03-18',
    checkpointDisplay: 'Mar 18, 2027',
    tier: 'INTERMEDIATE',
    tierLabel: 'Boss 1: SAT',
    name: 'Conquer the March SAT',
    objective: 'Execute the March SAT exam at peak sharpness. Immediately reallocate all freed SAT hours into accelerating your AI Engineering syllabus while maintaining 5x/week cardio and 4x/week trading.',
    quotas: { cardioTarget: 20, dietDaysTarget: 30, tradingNightsTarget: 16, aiSatDaysTarget: 30 },
    targets: { weightTarget: '-7 kg total', aiProgressTarget: '60% PyTorch & Neural Nets', satTarget: 'Official March SAT Exam' },
    status: 'LOCKED',
    completionPct: 0,
    auditNotes: ''
  },
  {
    id: 5,
    sectorNumber: 'Sector 05',
    deadline: '2027-04-18',
    checkpointDisplay: 'Apr 18, 2027',
    tier: 'INTERMEDIATE',
    tierLabel: 'Acceleration',
    name: '100% AI Focus Unlocked',
    objective: 'Complete your first full 30-day cycle with zero SAT split; double daily AI syllabus output; review 4 months of trading logs and backtests to cut your lowest-performing setups.',
    quotas: { cardioTarget: 20, dietDaysTarget: 30, tradingNightsTarget: 16, aiSatDaysTarget: 30 },
    targets: { weightTarget: '-9 kg total', aiProgressTarget: '70% Deep Learning & LLMs', satTarget: 'Conquered (Shift to 100% AI)' },
    status: 'LOCKED',
    completionPct: 0,
    auditNotes: ''
  },
  {
    id: 6,
    sectorNumber: 'Sector 06',
    deadline: '2027-05-18',
    checkpointDisplay: 'May 18, 2027',
    tier: 'INTERMEDIATE',
    tierLabel: 'Halftime Boss',
    name: '6-Month Transformation Audit',
    objective: 'Verify clear body fat loss from 24 weeks of cardio and hard dieting; lock in a repeatable night-trading rulebook; finish the foundational half of your AI Engineering syllabus.',
    quotas: { cardioTarget: 20, dietDaysTarget: 30, tradingNightsTarget: 16, aiSatDaysTarget: 30 },
    targets: { weightTarget: '-11 kg total', aiProgressTarget: '75% End-to-End Architectures', satTarget: 'N/A' },
    status: 'LOCKED',
    completionPct: 0,
    auditNotes: ''
  },
  {
    id: 7,
    sectorNumber: 'Sector 07',
    deadline: '2027-06-18',
    checkpointDisplay: 'Jun 18, 2027',
    tier: 'HARD',
    tierLabel: 'Deep Build',
    name: 'Build Real AI Systems',
    objective: 'Transition from syllabus theory into building working end-to-end AI projects; maintain strict 4-hour Mon–Thu trading discipline and 2-hour cardio sessions without skipping.',
    quotas: { cardioTarget: 20, dietDaysTarget: 30, tradingNightsTarget: 16, aiSatDaysTarget: 30 },
    targets: { weightTarget: '-13 kg total', aiProgressTarget: '80% Real-World AI Apps', satTarget: 'N/A' },
    status: 'LOCKED',
    completionPct: 0,
    auditNotes: ''
  },
  {
    id: 8,
    sectorNumber: 'Sector 08',
    deadline: '2027-07-18',
    checkpointDisplay: 'Jul 18, 2027',
    tier: 'HARD',
    tierLabel: 'Proof of Work',
    name: 'Portfolio & Edge',
    objective: 'Ship documented AI Engineering builds to your portfolio/GitHub; tighten lunch and dinner portions if weight loss slows while preserving high mental energy for night trading.',
    quotas: { cardioTarget: 20, dietDaysTarget: 30, tradingNightsTarget: 16, aiSatDaysTarget: 30 },
    targets: { weightTarget: '-15 kg total', aiProgressTarget: '85% Production Deployment', satTarget: 'N/A' },
    status: 'LOCKED',
    completionPct: 0,
    auditNotes: ''
  },
  {
    id: 9,
    sectorNumber: 'Sector 09',
    deadline: '2027-08-18',
    checkpointDisplay: 'Aug 18, 2027',
    tier: 'HARD',
    tierLabel: 'Endurance',
    name: 'Zero-Excuse Grind',
    objective: 'Hit 90%+ consistency across all daily quotas for 30 straight days; refine live trading execution and backtest win-rate; enter the final advanced tier of your AI syllabus.',
    quotas: { cardioTarget: 20, dietDaysTarget: 30, tradingNightsTarget: 16, aiSatDaysTarget: 30 },
    targets: { weightTarget: '-17 kg total', aiProgressTarget: '90% Distributed Training', satTarget: 'N/A' },
    status: 'LOCKED',
    completionPct: 0,
    auditNotes: ''
  },
  {
    id: 10,
    sectorNumber: 'Sector 10',
    deadline: '2027-09-18',
    checkpointDisplay: 'Sep 18, 2027',
    tier: 'BOSS LEVEL',
    tierLabel: 'Launchpad',
    name: 'Career Positioning',
    objective: 'Package your completed AI Engineering projects, technical stack, and SAT credentials into a sharp resume and portfolio ready for remote engineering roles, freelance clients, or university admissions.',
    quotas: { cardioTarget: 20, dietDaysTarget: 30, tradingNightsTarget: 16, aiSatDaysTarget: 30 },
    targets: { weightTarget: '-19 kg total', aiProgressTarget: '95% Portfolio Ready', satTarget: 'Credentials Packaged' },
    status: 'LOCKED',
    completionPct: 0,
    auditNotes: ''
  },
  {
    id: 11,
    sectorNumber: 'Sector 11',
    deadline: '2027-10-18',
    checkpointDisplay: 'Oct 18, 2027',
    tier: 'BOSS LEVEL',
    tierLabel: 'Execution',
    name: 'Market & Career Push',
    objective: 'Actively apply, pitch, or deploy real-world AI solutions while holding your lean physique, 5x/week cardio rhythm, and 16 monthly locked trading nights.',
    quotas: { cardioTarget: 20, dietDaysTarget: 30, tradingNightsTarget: 16, aiSatDaysTarget: 30 },
    targets: { weightTarget: '-20 kg Target Locked', aiProgressTarget: '98% Commercial Deployment', satTarget: 'Applications Active' },
    status: 'LOCKED',
    completionPct: 0,
    auditNotes: ''
  },
  {
    id: 12,
    sectorNumber: 'Sector 12',
    deadline: '2027-11-18',
    checkpointDisplay: 'Nov 18, 2027',
    tier: 'FINAL BOSS',
    tierLabel: 'New Life',
    name: '1-Year Completion Lock',
    objective: 'Complete the final 30-day sprint with zero broken rules. Step on the scale, open your finished AI portfolio, and review your 12-month trading log — officially clearing the game.',
    quotas: { cardioTarget: 20, dietDaysTarget: 30, tradingNightsTarget: 16, aiSatDaysTarget: 30 },
    targets: { weightTarget: 'Lean Physique Reached', aiProgressTarget: '100% Game Cleared', satTarget: 'Completed' },
    status: 'LOCKED',
    completionPct: 0,
    auditNotes: ''
  }
];

// Daily Operating Quota Rules (from PDF Roadmap, exclusively for Admin)
export const DAILY_OPERATING_QUOTAS = {
  sleep: {
    id: 'sleep',
    title: 'Sleep & Recovery',
    frequency: '7 Days / Week',
    schedule: 'Bed: 2:00 AM – 3:00 AM | Wake: 10:00 AM – 10:30 AM',
    duration: '7.0 – 8.5 hours',
    description: 'Go to bed between 2:00 AM – 3:00 AM and wake up between 10:00 AM – 10:30 AM (7.0 to 8.5 hours of consistent recovery sleep).'
  },
  cardio: {
    id: 'cardio',
    title: 'Cardio & Weight Loss',
    frequency: '5 Days (Sun – Thu)',
    restDays: ['Friday', 'Saturday'],
    schedule: '11:00 AM – 1:00 PM',
    duration: '~2 hours',
    description: 'Complete ~2 hours of cardio & conditioning starting around 11:00 AM – 1:00 PM. Friday and Saturday are strict physical rest days.'
  },
  diet: {
    id: 'diet',
    title: 'Hard Diet (Weight Loss)',
    frequency: '7 Days / Week',
    structure: '2-Meal Strict Protocol',
    description: 'Follow a strict 2-meal structure from home-cooked meals: a portion-controlled "diet dinner" at lunch plus a small, light dinner.'
  },
  aiStudy: {
    id: 'aiStudy',
    title: 'AI Engineering + SAT',
    frequency: '7 Days / Week',
    schedule: 'Post-gym shower and lunch',
    description: 'Complete your daily syllabus target. Split between AI Engineering and March 2027 SAT until the exam; shift to 100% AI Engineering after.'
  },
  nightBlock: {
    id: 'nightBlock',
    title: '4-Hour Night Block',
    frequency: 'Mon – Thu (Work) | Fri – Sun (Recharge)',
    monThuTarget: 'Live night-market trading and backtesting (4+ hours)',
    friSunTarget: 'Protected 4 hours off-duty recharge (movies, games, mental reset)',
    description: 'Mon–Thu: Lock in 4+ hours of live trading/backtesting (16 nights/month). Fri–Sun: 4 hours off-duty recharge.'
  }
};

// ── Great Motivational Quotes ────────────────────────────────
export const MOTIVATIONAL_QUOTES = [
  { text: 'You have power over your mind - not outside events. Realize this, and you will find strength.', author: 'Marcus Aurelius' },
  { text: 'The only way to do great work is to love what you do. If you haven\'t found it yet, keep looking.', author: 'Steve Jobs' },
  { text: 'Great things come from hard work and perseverance. No excuses.', author: 'Kobe Bryant' },
  { text: 'Don\'t count the days, make the days count.', author: 'Muhammad Ali' },
  { text: 'We suffer more often in imagination than in reality.', author: 'Seneca' },
  { text: 'Never miss twice. If you miss one day, get back on track immediately.', author: 'James Clear' },
  { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear' },
  { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln' },
  { text: 'It is not the critic who counts; the credit belongs to the man who is actually in the arena.', author: 'Theodore Roosevelt' },
  { text: 'Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.', author: 'John C. Maxwell' },
  { text: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
  { text: 'If you are going through hell, keep going.', author: 'Winston Churchill' },
  { text: 'Knowing is not enough, we must apply. Willing is not enough, we must do.', author: 'Bruce Lee' },
  { text: 'The standard you walk past is the standard you accept.', author: 'David Hurley' },
  { text: 'Show up, lock in, execute. The results will take care of themselves.', author: 'Tophel Creed' }
];

export const STORAGE_KEYS = {
  AUTH_USER: 'tophel_auth_user',
  SECTORS: 'tophel_sectors',
  DAILY_LOGS: 'tophel_daily_logs',
  PROOF_VAULT: 'tophel_proof_vault',
  CUSTOM_PILLARS: 'tophel_custom_pillars',
  COMMUNITY_CHAT: 'tophel_community_chat'
};
