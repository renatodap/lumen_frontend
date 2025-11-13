import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Habit } from '@/types/habit';
import { LumenError } from '@/lib/errors';

const API_BASE = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:8080/api';

async function fetchHabits(): Promise<Habit[]> {
  const response = await fetch(`${API_BASE}/habits`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new LumenError(
      'Failed to fetch habits',
      'FETCH_HABITS_ERROR',
      'Could not load your habits. Please try again.',
      response.status
    );
  }

  return response.json();
}

async function createHabit(habit: Omit<Habit, 'id' | 'user_id' | 'created_at'>): Promise<Habit> {
  const response = await fetch(`${API_BASE}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(habit),
  });

  if (!response.ok) {
    throw new LumenError(
      'Failed to create habit',
      'CREATE_HABIT_ERROR',
      'Could not create habit. Please try again.',
      response.status
    );
  }

  return response.json();
}

async function updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
  const response = await fetch(`${API_BASE}/habits/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new LumenError(
      'Failed to update habit',
      'UPDATE_HABIT_ERROR',
      'Could not update habit. Please try again.',
      response.status
    );
  }

  return response.json();
}

async function deleteHabit(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/habits/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new LumenError(
      'Failed to delete habit',
      'DELETE_HABIT_ERROR',
      'Could not delete habit. Please try again.',
      response.status
    );
  }
}

export function useHabits() {
  const queryClient = useQueryClient();

  const {
    data: habits = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['habits'],
    queryFn: fetchHabits,
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit-logs'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Habit> }) =>
      updateHabit(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit-logs'] });
    },
  });

  return {
    habits,
    isLoading,
    error,
    createHabit: createMutation.mutateAsync,
    updateHabit: (id: string, updates: Partial<Habit>) =>
      updateMutation.mutateAsync({ id, updates }),
    deleteHabit: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
