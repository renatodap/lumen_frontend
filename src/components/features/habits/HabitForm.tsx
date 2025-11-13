'use client';

import { useState } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types/habit';
import { cn } from '@/lib/utils';
import { handleError } from '@/lib/errors';

interface HabitFormProps {
  habit?: Habit | null;
  goalId?: string | undefined;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['🏃', '📚', '💧', '🧘', '🛌', '🥗', '💪', '🎯', '✍️', '🎨'];

export function HabitForm({ habit, goalId, onClose }: HabitFormProps) {
  const { createHabit, updateHabit, isCreating, isUpdating } = useHabits();

  const [name, setName] = useState(habit?.name || '');
  const [icon, setIcon] = useState(habit?.icon || '🎯');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>(
    habit?.frequency || 'daily'
  );
  const [reminderTimes, setReminderTimes] = useState<string[]>(habit?.reminder_times || ['09:00']);
  const [error, setError] = useState('');

  const isEditing = !!habit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Habit name is required');
      return;
    }

    try {
      if (isEditing) {
        await updateHabit(habit.id, {
          name: name.trim(),
          icon,
          frequency,
          reminder_times: reminderTimes,
        });
      } else {
        await createHabit({
          name: name.trim(),
          icon,
          frequency,
          reminder_times: reminderTimes,
          goal_id: goalId || null,
        });
      }
      onClose();
    } catch (err) {
      setError(handleError(err));
    }
  };

  const addReminderTime = () => {
    if (reminderTimes.length < 5) {
      setReminderTimes([...reminderTimes, '12:00']);
    }
  };

  const removeReminderTime = (index: number) => {
    setReminderTimes(reminderTimes.filter((_, i) => i !== index));
  };

  const updateReminderTime = (index: number, value: string) => {
    const updated = [...reminderTimes];
    updated[index] = value;
    setReminderTimes(updated);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-bg-primary w-full sm:max-w-md sm:rounded-lg rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-text-primary">
            {isEditing ? 'Edit Habit' : 'New Habit'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={cn(
                    'w-12 h-12 rounded flex items-center justify-center text-2xl',
                    'transition-colors',
                    icon === emoji ? 'bg-accent' : 'bg-bg-surface hover:bg-bg-hover'
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Habit Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Morning run"
              className={cn(
                'w-full px-4 py-3 rounded',
                'bg-bg-surface text-text-primary',
                'border border-border',
                'focus:outline-none focus:border-accent',
                'placeholder:text-text-muted'
              )}
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Frequency</label>
            <div className="grid grid-cols-3 gap-2">
              {(['daily', 'weekly', 'custom'] as const).map(freq => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={cn(
                    'px-4 py-3 rounded capitalize',
                    'transition-colors font-medium',
                    frequency === freq
                      ? 'bg-accent text-bg-primary'
                      : 'bg-bg-surface text-text-secondary hover:bg-bg-hover'
                  )}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-text-secondary">Reminder Times</label>
              {reminderTimes.length < 5 && (
                <button
                  type="button"
                  onClick={addReminderTime}
                  className="text-sm text-accent hover:text-accent-hover"
                >
                  + Add Time
                </button>
              )}
            </div>
            <div className="space-y-2">
              {reminderTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={e => updateReminderTime(index, e.target.value)}
                    className={cn(
                      'flex-1 px-4 py-3 rounded',
                      'bg-bg-surface text-text-primary',
                      'border border-border',
                      'focus:outline-none focus:border-accent'
                    )}
                  />
                  {reminderTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReminderTime(index)}
                      className="text-error hover:text-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-error bg-opacity-10 border border-error rounded">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'flex-1 px-6 py-3 rounded',
                'bg-bg-surface text-text-primary',
                'font-medium transition-colors',
                'hover:bg-bg-hover'
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className={cn(
                'flex-1 px-6 py-3 rounded',
                'bg-accent text-bg-primary',
                'font-medium transition-colors',
                'hover:bg-accent-hover',
                (isCreating || isUpdating) && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isCreating || isUpdating ? 'Saving...' : isEditing ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
