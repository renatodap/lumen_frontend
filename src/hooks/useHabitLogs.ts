import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HabitLog } from '@/types/habit';
import { LumenError } from '@/lib/errors';
import { getToday } from '@/lib/utils';

const API_BASE = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:8080/api';

async function fetchHabitLogs(habitId?: string): Promise<HabitLog[]> {
  const url = habitId ? `${API_BASE}/habit-logs?habit_id=${habitId}` : `${API_BASE}/habit-logs`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new LumenError(
      'Failed to fetch habit logs',
      'FETCH_LOGS_ERROR',
      'Could not load habit history. Please try again.',
      response.status
    );
  }

  return response.json();
}

async function logHabit(habitId: string, notes?: string): Promise<HabitLog> {
  const response = await fetch(`${API_BASE}/habit-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      habit_id: habitId,
      date: getToday(),
      completed: true,
      notes: notes || null,
    }),
  });

  if (!response.ok) {
    throw new LumenError(
      'Failed to log habit',
      'LOG_HABIT_ERROR',
      'Could not log habit completion. Please try again.',
      response.status
    );
  }

  return response.json();
}

async function updateHabitLog(logId: string, updates: Partial<HabitLog>): Promise<HabitLog> {
  const response = await fetch(`${API_BASE}/habit-logs/${logId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new LumenError(
      'Failed to update log',
      'UPDATE_LOG_ERROR',
      'Could not update habit log. Please try again.',
      response.status
    );
  }

  return response.json();
}

async function deleteHabitLog(logId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/habit-logs/${logId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new LumenError(
      'Failed to delete log',
      'DELETE_LOG_ERROR',
      'Could not delete habit log. Please try again.',
      response.status
    );
  }
}

export function useHabitLogs(habitId?: string) {
  const queryClient = useQueryClient();

  const {
    data: logs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: habitId ? ['habit-logs', habitId] : ['habit-logs'],
    queryFn: () => fetchHabitLogs(habitId),
    staleTime: 10000,
  });

  const logMutation = useMutation({
    mutationFn: ({ habitId, notes }: { habitId: string; notes?: string }) =>
      logHabit(habitId, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['habit-logs'] });
      queryClient.invalidateQueries({ queryKey: ['habit-logs', variables.habitId] });
      queryClient.invalidateQueries({ queryKey: ['habit-stats'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ logId, updates }: { logId: string; updates: Partial<HabitLog> }) =>
      updateHabitLog(logId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit-logs'] });
      queryClient.invalidateQueries({ queryKey: ['habit-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHabitLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit-logs'] });
      queryClient.invalidateQueries({ queryKey: ['habit-stats'] });
    },
  });

  return {
    logs,
    isLoading,
    error,
    logHabit: (habitId: string, notes?: string) =>
      logMutation.mutateAsync(notes ? { habitId, notes } : { habitId }),
    updateLog: (logId: string, updates: Partial<HabitLog>) =>
      updateMutation.mutateAsync({ logId, updates }),
    deleteLog: deleteMutation.mutateAsync,
    isLogging: logMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
