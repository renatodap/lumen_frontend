import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { AcceptanceCriterion, DayType } from '@/types/acceptance';
import { DailyLog } from '@/types/win';
import { LumenError } from '@/lib/errors';
import { getTodayISO } from '@/lib/utils';

export interface DayCompletionStatus {
  canCloseDayCriteria: boolean;
  totalCriteria: number;
  completedCriteria: number;
  missingCriteria: AcceptanceCriterion[];
  allCriteriaMet: boolean;
  dayLog: DailyLog | null;
}

export function useDayCompletion(userId: string, dayType: DayType) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['day-completion', userId, dayType, getTodayISO()],
    queryFn: async (): Promise<DayCompletionStatus> => {
      const today = getTodayISO();

      const [criteriaResult, logResult] = await Promise.all([
        supabase
          .from('acceptance_criteria')
          .select('*')
          .eq('user_id', userId)
          .eq('day_type', dayType)
          .order('order_index', { ascending: true }),
        supabase
          .from('daily_logs')
          .select('*')
          .eq('user_id', userId)
          .eq('date', today)
          .maybeSingle(),
      ]);

      if (criteriaResult.error) {
        throw new LumenError(
          criteriaResult.error.message,
          'FETCH_CRITERIA_ERROR',
          'Failed to load acceptance criteria'
        );
      }

      if (logResult.error) {
        throw new LumenError(
          logResult.error.message,
          'FETCH_LOG_ERROR',
          'Failed to load daily log'
        );
      }

      const criteria = criteriaResult.data as AcceptanceCriterion[];
      const dayLog = logResult.data as DailyLog | null;

      const criteriaMet = dayLog?.criteria_met || [];
      const completedCount = criteriaMet.length;
      const totalCount = criteria.length;

      const missingCriteria = criteria.filter(c => !criteriaMet.includes(c.id));

      const allCriteriaMet = totalCount > 0 && completedCount === totalCount;
      const canCloseDayCriteria = allCriteriaMet;

      return {
        canCloseDayCriteria,
        totalCriteria: totalCount,
        completedCriteria: completedCount,
        missingCriteria,
        allCriteriaMet,
        dayLog,
      };
    },
    enabled: !!userId,
    refetchInterval: 30000,
  });

  return {
    completionStatus: data,
    isLoading,
    error,
  };
}
