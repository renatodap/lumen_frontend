import { DailyLog, WinStats, StreakData } from '@/types/win';
import { formatDateISO, getDateDaysAgo } from './utils';

export function calculateWinStatus(
  dailyLog: DailyLog | null,
  goal: { win_condition: string | null } | null
): {
  won: boolean;
  canWin: boolean;
  reason: string;
} {
  if (!dailyLog) {
    return {
      won: false,
      canWin: !!goal?.win_condition,
      reason: 'No log recorded for today',
    };
  }

  if (!goal?.win_condition) {
    return {
      won: dailyLog.day_won,
      canWin: false,
      reason: 'No win condition set',
    };
  }

  const won = dailyLog.day_won && (dailyLog.win_condition_met ?? false);

  return {
    won,
    canWin: true,
    reason: won ? 'Win condition met' : 'Win condition not met',
  };
}

export function calculateStreak(logs: DailyLog[]): StreakData {
  if (logs.length === 0) {
    return {
      current: 0,
      best: 0,
      history: [],
    };
  }

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  const today = formatDateISO(new Date());

  for (let i = 0; i < sortedLogs.length; i++) {
    const log = sortedLogs[i];
    if (!log) continue;
    const logDate = formatDateISO(log.date);

    if (log.day_won) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);

      if (i === 0 && logDate === today) {
        currentStreak = tempStreak;
      } else if (i > 0) {
        const prevLog = sortedLogs[i - 1];
        if (!prevLog) continue;
        const prevDate = new Date(prevLog.date);
        const currDate = new Date(log.date);
        const dayDiff = Math.floor(
          (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dayDiff === 1) {
          if (i === 1 && formatDateISO(prevLog.date) === today && prevLog.day_won) {
            currentStreak = tempStreak;
          }
        } else {
          tempStreak = 1;
        }
      }
    } else {
      tempStreak = 0;
      if (i === 0 && logDate === today) {
        currentStreak = 0;
      }
    }
  }

  const history = sortedLogs.map(log => ({
    date: formatDateISO(log.date),
    won: log.day_won,
  }));

  return {
    current: currentStreak,
    best: bestStreak,
    history,
  };
}

export function calculateWinStats(logs: DailyLog[]): WinStats {
  const totalDays = logs.length;
  const wonDays = logs.filter(log => log.day_won).length;
  const winRate = totalDays > 0 ? (wonDays / totalDays) * 100 : 0;

  const streakData = calculateStreak(logs);

  const last7DaysDate = getDateDaysAgo(7);
  const last30DaysDate = getDateDaysAgo(30);

  const last7Days = logs
    .filter(log => log.date >= last7DaysDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(log => log.day_won);

  const last30Days = logs
    .filter(log => log.date >= last30DaysDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(log => log.day_won);

  return {
    totalDays,
    wonDays,
    winRate: Math.round(winRate * 10) / 10,
    currentStreak: streakData.current,
    bestStreak: streakData.best,
    last7Days,
    last30Days,
  };
}
