import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DailyLog } from '@/types/win';
import { LumenError } from '@/lib/errors';
import { formatDateISO } from '@/lib/utils';

interface SaveDailyLogParams {
  userId: string;
  date: string;
  goalId: string | null;
  criteriaMet: string[];
  dayWon: boolean;
  winConditionMet: boolean | null;
  reflection?: string | undefined;
  plannedNextDay: boolean;
}

export function useDailyLog() {
  const queryClient = useQueryClient();

  const saveDailyLogMutation = useMutation({
    mutationFn: async (params: SaveDailyLogParams) => {
      const {
        userId,
        date,
        goalId,
        criteriaMet,
        dayWon,
        winConditionMet,
        reflection,
        plannedNextDay,
      } = params;

      const formattedDate = formatDateISO(date);

      const { data: existing } = await supabase
        .from('daily_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('date', formattedDate)
        .eq('goal_id', goalId || '')
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('daily_logs')
          .update({
            criteria_met: criteriaMet,
            day_won: dayWon,
            win_condition_met: winConditionMet,
            reflection: reflection || null,
            planned_next_day: plannedNextDay,
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          throw new LumenError(
            error.message,
            'UPDATE_DAILY_LOG_ERROR',
            'Failed to update daily log'
          );
        }

        return data as DailyLog;
      } else {
        const { data, error } = await supabase
          .from('daily_logs')
          .insert([
            {
              user_id: userId,
              date: formattedDate,
              goal_id: goalId,
              criteria_met: criteriaMet,
              day_won: dayWon,
              win_condition_met: winConditionMet,
              reflection: reflection || null,
              planned_next_day: plannedNextDay,
            },
          ])
          .select()
          .single();

        if (error) {
          throw new LumenError(error.message, 'CREATE_DAILY_LOG_ERROR', 'Failed to save daily log');
        }

        return data as DailyLog;
      }
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: ['daily-log', data.user_id, formatDateISO(data.date)],
      });
      queryClient.invalidateQueries({
        queryKey: ['daily-logs', data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['win-stats', data.user_id],
      });
    },
  });

  return {
    saveDailyLog: saveDailyLogMutation.mutate,
    saveDailyLogAsync: saveDailyLogMutation.mutateAsync,
    isSaving: saveDailyLogMutation.isPending,
    error: saveDailyLogMutation.error,
  };
}
