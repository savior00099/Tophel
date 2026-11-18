import { useMemo } from 'react';

/**
 * useStreakDetection — Detects active streaks and enforces the "Never Miss Twice" Protocol.
 */
export function useStreakDetection(dailyLogs = {}) {
  const result = useMemo(() => {
    const today = new Date();
    const sortedDates = Object.keys(dailyLogs).sort().reverse();

    // 1. Calculate Active Streak (consecutive days with at least 3/5 or 4/5 items checked)
    let currentStreak = 0;
    let checkDate = new Date(today);

    // If today hasn't been logged yet, start checking from yesterday so streak doesn't break at 8 AM
    const todayStr = today.toISOString().split('T')[0];
    const todayLog = dailyLogs[todayStr];
    const hasLoggedToday = todayLog && Object.values(todayLog.checklist || {}).some(Boolean);

    if (!hasLoggedToday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const log = dailyLogs[dateStr];
      if (!log || !log.checklist) break;

      const checkedCount = Object.values(log.checklist).filter(Boolean).length;
      if (checkedCount >= 3) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // 2. Check "Never Miss Twice" Protocol (Pillars missed 2 consecutive days)
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2);

    const yStr = yesterday.toISOString().split('T')[0];
    const dbyStr = dayBeforeYesterday.toISOString().split('T')[0];

    const yLog = dailyLogs[yStr]?.checklist || {};
    const dbyLog = dailyLogs[dbyStr]?.checklist || {};

    const pillars = [
      { key: 'cardio', name: 'Cardio & Conditioning' },
      { key: 'diet', name: 'Hard Diet Protocol' },
      { key: 'aiStudy', name: 'AI Engineering & SAT' },
      { key: 'nightBlock', name: '4-Hour Night Block' }
    ];

    const violatedPillars = [];
    pillars.forEach((p) => {
      // If missed yesterday AND day before yesterday
      if (yLog[p.key] === false && dbyLog[p.key] === false) {
        violatedPillars.push(p.name);
      }
    });

    const hasStreakViolation = violatedPillars.length > 0;

    return {
      currentStreak: Math.max(currentStreak, 1),
      hasStreakViolation,
      violatedPillars,
      totalLoggedDays: Object.keys(dailyLogs).length
    };
  }, [dailyLogs]);

  return result;
}
