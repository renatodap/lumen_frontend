'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Goal } from '@/types/win';
import { LumenError, handleError } from '@/lib/errors';

interface WinConditionFormProps {
  goal: Goal;
  onSave?: () => void;
  onCancel?: () => void;
}

export function WinConditionForm({ goal, onSave, onCancel }: WinConditionFormProps) {
  const [winCondition, setWinCondition] = useState(goal.win_condition || '');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const updateWinConditionMutation = useMutation({
    mutationFn: async (newWinCondition: string) => {
      const { data, error } = await supabase
        .from('goals')
        .update({ win_condition: newWinCondition })
        .eq('id', goal.id)
        .select()
        .single();

      if (error) {
        throw new LumenError(
          error.message,
          'UPDATE_WIN_CONDITION_ERROR',
          'Failed to update win condition'
        );
      }

      return data as Goal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', goal.id] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      onSave?.();
    },
    onError: err => {
      setError(handleError(err));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!winCondition.trim()) {
      setError('Win condition cannot be empty');
      return;
    }

    updateWinConditionMutation.mutate(winCondition.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="winCondition" className="block text-sm font-medium text-text-primary">
          Win Condition
        </label>
        <p className="mt-1 text-sm text-text-secondary">
          What must you accomplish each day to win? Be specific and measurable.
        </p>
        <input
          id="winCondition"
          type="text"
          value={winCondition}
          onChange={e => setWinCondition(e.target.value)}
          placeholder="e.g., Daily caloric deficit, Complete all tasks"
          className="mt-2 w-full rounded border border-bg-hover bg-bg-primary px-4 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
          maxLength={200}
        />
        <p className="mt-1 text-xs text-text-muted">{winCondition.length}/200 characters</p>
      </div>

      {error && (
        <div className="rounded border border-error bg-error/10 p-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={updateWinConditionMutation.isPending}
          className="flex-1 rounded bg-accent py-2 px-4 font-medium text-bg-primary hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {updateWinConditionMutation.isPending ? 'Saving...' : 'Save'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={updateWinConditionMutation.isPending}
            className="flex-1 rounded border border-bg-hover bg-bg-primary py-2 px-4 font-medium text-text-primary hover:bg-bg-hover disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="rounded-lg border border-bg-hover bg-bg-surface p-4">
        <h4 className="text-sm font-semibold text-text-primary">Examples</h4>
        <ul className="mt-2 space-y-1 text-sm text-text-secondary">
          <li>• Maintain caloric deficit</li>
          <li>• Complete all planned tasks</li>
          <li>• Practice instrument for 30 minutes</li>
          <li>• No social media before 6pm</li>
          <li>• Read for 20 minutes</li>
        </ul>
      </div>
    </form>
  );
}
