import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DailyLog } from '@/types/win';
import { LumenError } from '@/lib/errors';
import { calculateWinStats } from '@/lib/winCalculations';

export function useWinStats(userId: string, goalId: string | null = null) {
  const { data: logs, isLoading: loadingLogs } = useQuery({
    queryKey: ['daily-logs', userId, goalId],
    queryFn: async () => {
      const query = supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (goalId) {
        query.eq('goal_id', goalId);
      }

      const { data, error } = await query;

      if (error) {
        throw new LumenError(error.message, 'FETCH_DAILY_LOGS_ERROR', 'Failed to load daily logs');
      }

      return data as DailyLog[];
    },
    enabled: !!userId,
  });

  const stats = logs ? calculateWinStats(logs) : null;

  return {
    logs: logs || [],
    stats,
    isLoading: loadingLogs,
  };
}
