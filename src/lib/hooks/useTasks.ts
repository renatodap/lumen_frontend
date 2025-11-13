import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Task, TaskFormData } from '@/lib/types/task';
import { calculateHorizon } from '@/lib/utils/horizonCalculator';

class TaskError extends Error {
  code: string;
  userMessage: string;
  statusCode: number;

  constructor(message: string, code: string, userMessage?: string, statusCode = 500) {
    super(message);
    this.code = code;
    this.userMessage = userMessage || message;
    this.statusCode = statusCode;
  }
}

export function useTasks() {
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('completed', false)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) throw new TaskError(error.message, 'FETCH_TASKS_ERROR', 'Failed to load tasks');

      return data.map(task => ({
        ...task,
        horizon: calculateHorizon(task.due_date),
      }));
    },
  });

  const createTask = useMutation({
    mutationFn: async (taskData: TaskFormData) => {
      const horizon = calculateHorizon(taskData.due_date);

      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, horizon }])
        .select()
        .single();

      if (error) throw new TaskError(error.message, 'CREATE_TASK_ERROR', 'Failed to create task');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      if (updates.due_date !== undefined) {
        updates.horizon = calculateHorizon(updates.due_date);
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new TaskError(error.message, 'UPDATE_TASK_ERROR', 'Failed to update task');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);

      if (error) throw new TaskError(error.message, 'DELETE_TASK_ERROR', 'Failed to delete task');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const completeTask = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error)
        throw new TaskError(error.message, 'COMPLETE_TASK_ERROR', 'Failed to complete task');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: tasks || [],
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
  };
}
