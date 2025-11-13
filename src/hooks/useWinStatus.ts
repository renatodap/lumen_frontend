import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DailyLog, Goal } from '@/types/win';
import { LumenError } from '@/lib/errors';
import { getTodayISO } from '@/lib/utils';

export function useWinStatus(userId: string, goalId: string | null) {
  const queryClient = useQueryClient();

  const { data: todayLog, isLoading: loadingLog } = useQuery({
    queryKey: ['daily-log', userId, getTodayISO(), goalId],
    queryFn: async () => {
      const today = getTodayISO();
      const query = supabase.from('daily_logs').select('*').eq('user_id', userId).eq('date', today);

      if (goalId) {
        query.eq('goal_id', goalId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        throw new LumenError(error.message, 'FETCH_DAILY_LOG_ERROR', "Failed to load today's log");
      }

      return data as DailyLog | null;
    },
    enabled: !!userId,
  });

  const { data: goal, isLoading: loadingGoal } = useQuery({
    queryKey: ['goal', goalId],
    queryFn: async () => {
      if (!goalId) return null;

      const { data, error } = await supabase.from('goals').select('*').eq('id', goalId).single();

      if (error) {
        throw new LumenError(error.message, 'FETCH_GOAL_ERROR', 'Failed to load goal');
      }

      return data as Goal;
    },
    enabled: !!goalId,
  });

  const markWinConditionMutation = useMutation({
    mutationFn: async ({
      winConditionMet,
      dayWon,
    }: {
      winConditionMet: boolean;
      dayWon: boolean;
    }) => {
      const today = getTodayISO();

      if (todayLog) {
        const { data, error } = await supabase
          .from('daily_logs')
          .update({
            win_condition_met: winConditionMet,
            day_won: dayWon,
          })
          .eq('id', todayLog.id)
          .select()
          .single();

        if (error) {
          throw new LumenError(
            error.message,
            'UPDATE_WIN_STATUS_ERROR',
            'Failed to update win status'
          );
        }

        return data as DailyLog;
      } else {
        const { data, error } = await supabase
          .from('daily_logs')
          .insert([
            {
              user_id: userId,
              date: today,
              goal_id: goalId,
              criteria_met: [],
              day_won: dayWon,
              win_condition_met: winConditionMet,
            },
          ])
          .select()
          .single();

        if (error) {
          throw new LumenError(
            error.message,
            'CREATE_DAILY_LOG_ERROR',
            'Failed to create daily log'
          );
        }

        return data as DailyLog;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['daily-log', userId, getTodayISO()],
      });
      queryClient.invalidateQueries({
        queryKey: ['win-stats', userId],
      });
    },
  });

  return {
    todayLog,
    goal,
    isLoading: loadingLog || loadingGoal,
    markWinCondition: markWinConditionMutation.mutate,
    isUpdating: markWinConditionMutation.isPending,
  };
}
