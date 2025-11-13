import { TaskHorizon } from '../types/task';
import { getDaysDifference } from './dateUtils';

export function calculateHorizon(dueDate: string | null): TaskHorizon {
  if (!dueDate) return 'future';

  const days = getDaysDifference(dueDate);

  if (days <= 2) return '2-day';
  if (days <= 7) return '7-day';
  return 'future';
}

export function isValidHorizonTransition(
  task: { horizon: TaskHorizon; due_date: string | null },
  newHorizon: TaskHorizon
): boolean {
  const calculatedHorizon = calculateHorizon(task.due_date);

  if (calculatedHorizon === '2-day' && newHorizon !== '2-day') {
    return false;
  }

  return true;
}
