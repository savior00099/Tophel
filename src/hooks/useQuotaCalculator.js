import { useMemo } from 'react';

/**
 * useQuotaCalculator — Evaluates today's active schedule and weekly consistency
 * according to the exact rules in the 1-Year 12-Sector Roadmap PDF.
 */
export function useQuotaCalculator(dailyLogs = {}, activeSectorId = 1) {
  const result = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = dayNames[dayOfWeek];

    // 1. Smart Day-Aware Quota Checklist for Today
    const isFridayOrSaturday = dayOfWeek === 5 || dayOfWeek === 6;
    const isMonThu = dayOfWeek >= 1 && dayOfWeek <= 4;
    const isFriSun = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

    // AI & SAT split rule: Split through Sector 4; 100% AI Engineering from Sector 5 onward
    const isSectorAfterSAT = activeSectorId >= 5;

    const todayQuotas = [
      {
        id: 'sleep',
        title: 'Sleep & Recovery Protocol',
        schedule: 'Bed: 2:00 AM – 3:00 AM | Wake: 10:00 AM – 10:30 AM',
        target: '7.0 – 8.5 hours of consistent recovery sleep',
        isRest: false,
        category: 'Recovery'
      },
      {
        id: 'cardio',
        title: isFridayOrSaturday ? 'Scheduled Physical Recovery Day' : 'Cardio & Conditioning (~2 Hours)',
        schedule: isFridayOrSaturday ? 'Full Rest & Muscle Rebuild' : '11:00 AM – 1:00 PM',
        target: isFridayOrSaturday 
          ? 'Strict physical rest day. No high-intensity cardio. Active walking / stretching only.'
          : '~2 hours cardio & conditioning starting post-wake at 11:00 AM.',
        isRest: isFridayOrSaturday,
        category: 'Physical'
      },
      {
        id: 'diet',
        title: 'Hard Diet (Strict 2-Meal Structure)',
        schedule: 'Lunch + Light Evening Dinner',
        target: 'Lunch: portion-controlled "diet dinner" (protein & veggies first, cut excess rice/carbs, zero sugar/fried). Dinner: small, light plate.',
        isRest: false,
        category: 'Nutrition'
      },
      {
        id: 'aiStudy',
        title: isSectorAfterSAT 
          ? '100% AI Engineering Deep Grind' 
          : 'AI Engineering + March 2027 SAT Prep',
        schedule: 'Post-gym shower and lunch study block',
        target: isSectorAfterSAT
          ? '100% focus on production AI builds, PyTorch, LLM systems & distributed training.'
          : 'Daily syllabus target: personal AI syllabus + March 2027 SAT practice drills.',
        isRest: false,
        category: 'Cognitive'
      },
      {
        id: 'nightBlock',
        title: isMonThu 
          ? '4-Hour Night Market Trading Lock' 
          : 'Protected 4-Hour Recharge Block',
        schedule: isMonThu ? 'Locked 4+ hours live market' : 'Completely off-duty 4 hours',
        target: isMonThu
          ? 'Lock in 4+ hours live night trading & systematic backtesting (16 nights/month target).'
          : 'Protected off-duty recharge for movies, small games, and mental reset so execution stays sharp.',
        isRest: isFriSun,
        category: 'Market / Reset'
      }
    ];

    // 2. Calculate Recent 7-Day Consistency Meter
    const past7Days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const str = d.toISOString().split('T')[0];
      past7Days.push(str);
    }

    let totalPossibleQuotas = 0;
    let completedQuotas = 0;

    past7Days.forEach((dateStr) => {
      const log = dailyLogs[dateStr]?.checklist || {};
      // 5 daily items
      totalPossibleQuotas += 5;
      if (log.sleep) completedQuotas++;
      if (log.cardio) completedQuotas++;
      if (log.diet) completedQuotas++;
      if (log.aiStudy) completedQuotas++;
      if (log.nightBlock) completedQuotas++;
    });

    const weeklyConsistencyPct = totalPossibleQuotas > 0
      ? Math.round((completedQuotas / totalPossibleQuotas) * 100)
      : 85;

    // Check if user is meeting 85% Sector Clearance Standard
    const isPassing85Percent = weeklyConsistencyPct >= 85;

    return {
      currentDayName,
      todayQuotas,
      isFridayOrSaturday,
      isMonThu,
      isFriSun,
      weeklyConsistencyPct,
      isPassing85Percent,
      completedQuotas,
      totalPossibleQuotas
    };
  }, [dailyLogs, activeSectorId]);

  return result;
}
