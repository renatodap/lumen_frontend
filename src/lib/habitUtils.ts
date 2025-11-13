import { HabitLog, HabitStats, CompletionPattern } from '@/types/habit';

export function calculateStreak(logs: HabitLog[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (logs.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedLogs = [...logs]
    .filter(log => log.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let expectedDate = new Date();
  expectedDate.setHours(0, 0, 0, 0);

  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);

    if (logDate.getTime() === expectedDate.getTime()) {
      tempStreak++;
      if (currentStreak === 0) {
        currentStreak = tempStreak;
      }
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
      expectedDate = new Date(logDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { currentStreak, longestStreak };
}

export function calculateCompletionRate(logs: HabitLog[], daysToConsider: number = 30): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToConsider);

  const recentLogs = logs.filter(log => new Date(log.date) >= cutoffDate);

  if (recentLogs.length === 0) return 0;

  const completedCount = recentLogs.filter(log => log.completed).length;
  return (completedCount / Math.min(daysToConsider, recentLogs.length)) * 100;
}

export function calculateHabitStats(logs: HabitLog[]): HabitStats {
  const { currentStreak, longestStreak } = calculateStreak(logs);
  const completionRate = calculateCompletionRate(logs);
  const totalCompletions = logs.filter(log => log.completed).length;

  const lastCompleted = logs
    .filter(log => log.completed)
    .sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime())[0];

  return {
    habitId: logs[0]?.habit_id || '',
    currentStreak,
    longestStreak,
    completionRate: Math.round(completionRate),
    totalCompletions,
    lastCompletedAt: lastCompleted?.logged_at || null,
  };
}

export function analyzeCompletionPattern(logs: HabitLog[]): CompletionPattern | null {
  const completedLogs = logs.filter(log => log.completed);

  if (completedLogs.length < 3) return null;

  const completionTimes = completedLogs.map(log => {
    const date = new Date(log.logged_at);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  });

  const timeFrequency: Record<string, number> = {};
  let totalMinutes = 0;

  completionTimes.forEach(time => {
    timeFrequency[time] = (timeFrequency[time] || 0) + 1;
    const [hours, minutes] = time.split(':').map(Number);
    if (hours !== undefined && minutes !== undefined) {
      totalMinutes += hours * 60 + minutes;
    }
  });

  const averageMinutes = Math.round(totalMinutes / completionTimes.length);
  const averageHours = Math.floor(averageMinutes / 60);
  const averageMins = averageMinutes % 60;

  const commonTimes = Object.entries(timeFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([time]) => time);

  const variance =
    completionTimes.reduce((acc, time) => {
      const [hours, minutes] = time.split(':').map(Number);
      if (hours !== undefined && minutes !== undefined) {
        const mins = hours * 60 + minutes;
        return acc + Math.pow(mins - averageMinutes, 2);
      }
      return acc;
    }, 0) / completionTimes.length;

  return {
    habitId: completedLogs[0]?.habit_id || '',
    averageCompletionTime: `${averageHours.toString().padStart(2, '0')}:${averageMins.toString().padStart(2, '0')}`,
    commonCompletionTimes: commonTimes,
    completionTimeVariance: Math.round(Math.sqrt(variance)),
  };
}

export function predictOptimalReminderTime(
  pattern: CompletionPattern | null,
  defaultTime: string
): string {
  if (!pattern || pattern.completionTimeVariance > 120) {
    return defaultTime;
  }

  return pattern.averageCompletionTime;
}

export function isTodayCompleted(logs: HabitLog[]): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return logs.some(log => {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === today.getTime() && log.completed;
  });
}

export function formatStreakText(streak: number): string {
  if (streak === 0) return 'Start your streak!';
  if (streak === 1) return '1 day streak';
  return `${streak} day streak`;
}

export function getStreakEmoji(streak: number): string {
  if (streak === 0) return '⭐';
  if (streak < 7) return '🔥';
  if (streak < 30) return '💪';
  if (streak < 100) return '🚀';
  return '👑';
}
