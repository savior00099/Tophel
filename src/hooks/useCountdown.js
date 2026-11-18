import { useState, useEffect } from 'react';

/**
 * useCountdown — Live countdown timer to the next 18th-of-the-month checkpoint deadline
 */
export function useCountdown(targetDateStr = null) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    isExpired: false,
    targetDateFormatted: ''
  });

  useEffect(() => {
    // If a targetDateStr is supplied (e.g. '2026-12-18'), use it.
    // Otherwise calculate the next 18th of the month at 23:59:59.
    const calculateTarget = () => {
      if (targetDateStr) {
        const d = new Date(targetDateStr);
        d.setHours(23, 59, 59, 999);
        return d;
      }

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDay = now.getDate();

      let target;
      if (currentDay < 18) {
        target = new Date(currentYear, currentMonth, 18, 23, 59, 59);
      } else {
        // Next month's 18th
        target = new Date(currentYear, currentMonth + 1, 18, 23, 59, 59);
      }
      return target;
    };

    const target = calculateTarget();

    const update = () => {
      const now = new Date();
      const diffMs = target.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          isExpired: true,
          targetDateFormatted: target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
        return;
      }

      const totalSec = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSec / (3600 * 24));
      const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        totalSeconds: totalSec,
        isExpired: false,
        targetDateFormatted: target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  return timeLeft;
}
