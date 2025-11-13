'use client';

import { useState } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from './HabitCard';
import { HabitForm } from './HabitForm';
import { Habit } from '@/types/habit';
import { cn } from '@/lib/utils';

interface HabitListProps {
  goalId?: string;
  className?: string;
}

export function HabitList({ goalId, className }: HabitListProps) {
  const { habits, isLoading, deleteHabit } = useHabits();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredHabits = goalId ? habits.filter(h => h.goal_id === goalId) : habits;

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleDelete = async (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit? All logs will be lost.')) {
      try {
        await deleteHabit(habitId);
      } catch (error) {
        console.error('Failed to delete habit:', error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingHabit(null);
  };

  const handleAddNew = () => {
    setEditingHabit(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-bg-surface rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Today&apos;s Habits</h2>
          <p className="text-sm text-text-muted mt-1">
            {filteredHabits.length} {filteredHabits.length === 1 ? 'habit' : 'habits'}
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className={cn(
            'px-4 py-2 rounded',
            'bg-accent text-bg-primary',
            'font-medium transition-colors',
            'hover:bg-accent-hover'
          )}
        >
          + Add Habit
        </button>
      </div>

      {filteredHabits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary mb-4">
            No habits yet. Create your first habit to get started!
          </p>
          <button
            onClick={handleAddNew}
            className="px-6 py-3 bg-accent text-bg-primary rounded font-medium"
          >
            Create Habit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHabits.map(habit => (
            <HabitCard key={habit.id} habit={habit} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {isFormOpen && <HabitForm habit={editingHabit} goalId={goalId} onClose={handleFormClose} />}

      <div className="mt-6 p-4 bg-bg-surface rounded-lg border border-border">
        <p className="text-sm text-text-muted">
          <strong className="text-text-secondary">Pro tip:</strong> Swipe right on any habit to
          quickly mark it complete, or tap the circle button.
        </p>
      </div>
    </div>
  );
}
