import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  AcceptanceCriterion,
  CreateCriterionParams,
  UpdateCriterionParams,
  DayType,
} from '@/types/acceptance';
import { LumenError } from '@/lib/errors';

export function useAcceptanceCriteria(userId: string, dayType: DayType) {
  const queryClient = useQueryClient();

  const {
    data: criteria = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['acceptance-criteria', userId, dayType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('acceptance_criteria')
        .select('*')
        .eq('user_id', userId)
        .eq('day_type', dayType)
        .order('order_index', { ascending: true });

      if (error) {
        throw new LumenError(
          error.message,
          'FETCH_CRITERIA_ERROR',
          'Failed to load acceptance criteria'
        );
      }

      return data as AcceptanceCriterion[];
    },
    enabled: !!userId,
  });

  const createCriterionMutation = useMutation({
    mutationFn: async (params: CreateCriterionParams) => {
      const { data, error } = await supabase
        .from('acceptance_criteria')
        .insert([
          {
            user_id: userId,
            criteria_text: params.criteriaText,
            day_type: params.dayType,
            order_index: params.orderIndex,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new LumenError(error.message, 'CREATE_CRITERION_ERROR', 'Failed to create criterion');
      }

      return data as AcceptanceCriterion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acceptance-criteria', userId] });
    },
  });

  const updateCriterionMutation = useMutation({
    mutationFn: async (params: UpdateCriterionParams) => {
      const { id, ...updates } = params;
      const updateData: Record<string, unknown> = {};

      if (updates.criteriaText !== undefined) {
        updateData['criteria_text'] = updates.criteriaText;
      }
      if (updates.dayType !== undefined) {
        updateData['day_type'] = updates.dayType;
      }
      if (updates.orderIndex !== undefined) {
        updateData['order_index'] = updates.orderIndex;
      }

      const { data, error } = await supabase
        .from('acceptance_criteria')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new LumenError(error.message, 'UPDATE_CRITERION_ERROR', 'Failed to update criterion');
      }

      return data as AcceptanceCriterion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acceptance-criteria', userId] });
    },
  });

  const deleteCriterionMutation = useMutation({
    mutationFn: async (criterionId: string) => {
      const { error } = await supabase.from('acceptance_criteria').delete().eq('id', criterionId);

      if (error) {
        throw new LumenError(error.message, 'DELETE_CRITERION_ERROR', 'Failed to delete criterion');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acceptance-criteria', userId] });
    },
  });

  return {
    criteria,
    isLoading,
    error,
    createCriterion: createCriterionMutation.mutate,
    createCriterionAsync: createCriterionMutation.mutateAsync,
    updateCriterion: updateCriterionMutation.mutate,
    updateCriterionAsync: updateCriterionMutation.mutateAsync,
    deleteCriterion: deleteCriterionMutation.mutate,
    isCreating: createCriterionMutation.isPending,
    isUpdating: updateCriterionMutation.isPending,
    isDeleting: deleteCriterionMutation.isPending,
  };
}
