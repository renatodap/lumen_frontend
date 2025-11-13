import { useMemo } from 'react';
import { Task, TaskHorizon, TaskHorizonBuckets } from '../types/task';

export function useTaskHorizon(tasks: Task[]) {
  const buckets = useMemo<TaskHorizonBuckets>(() => {
    return tasks.reduce(
      (acc, task) => {
        acc[task.horizon].push(task);
        return acc;
      },
      {
        '2-day': [] as Task[],
        '7-day': [] as Task[],
        future: [] as Task[],
      }
    );
  }, [tasks]);

  const has2DayTasks = buckets['2-day'].length > 0;

  const isFutureBlocked = has2DayTasks;

  const canAddToHorizon = (horizon: TaskHorizon): boolean => {
    if (horizon === 'future' && isFutureBlocked) {
      return false;
    }
    return true;
  };

  const getHorizonStatus = (horizon: TaskHorizon) => {
    const count = buckets[horizon].length;

    if (horizon === '2-day' && count > 0) {
      return { blocked: false, warning: true, count };
    }

    if (horizon === 'future' && isFutureBlocked) {
      return { blocked: true, warning: false, count };
    }

    return { blocked: false, warning: false, count };
  };

  return {
    buckets,
    has2DayTasks,
    isFutureBlocked,
    canAddToHorizon,
    getHorizonStatus,
  };
}
