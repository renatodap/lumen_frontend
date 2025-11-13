import { useQuery } from '@tanstack/react-query';
import { useHabitLogs } from './useHabitLogs';
import { HabitStats } from '@/types/habit';
import { calculateHabitStats, analyzeCompletionPattern, isTodayCompleted } from '@/lib/habitUtils';

export function useHabitStats(habitId: string) {
  const { logs, isLoading: isLoadingLogs } = useHabitLogs(habitId);

  const { data: stats, isLoading: isCalculating } = useQuery({
    queryKey: ['habit-stats', habitId],
    queryFn: () => {
      if (logs.length === 0) {
        return {
          habitId,
          currentStreak: 0,
          longestStreak: 0,
          completionRate: 0,
          totalCompletions: 0,
          lastCompletedAt: null,
        } as HabitStats;
      }
      return calculateHabitStats(logs);
    },
    enabled: !isLoadingLogs && logs.length > 0,
    staleTime: 30000,
  });

  const { data: pattern } = useQuery({
    queryKey: ['habit-pattern', habitId],
    queryFn: () => analyzeCompletionPattern(logs),
    enabled: !isLoadingLogs && logs.length >= 3,
    staleTime: 60000,
  });

  const todayCompleted = isTodayCompleted(logs);

  return {
    stats: stats || {
      habitId,
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
      totalCompletions: 0,
      lastCompletedAt: null,
    },
    pattern: pattern || null,
    todayCompleted,
    isLoading: isLoadingLogs || isCalculating,
  };
}

export function useAllHabitStats(habitIds: string[]) {
  const queries = habitIds.map(id => useHabitStats(id));

  return {
    allStats: queries.map(q => q.stats),
    allPatterns: queries.map(q => q.pattern),
    isLoading: queries.some(q => q.isLoading),
  };
}
