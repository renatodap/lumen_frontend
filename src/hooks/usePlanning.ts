import { useState, useCallback, useEffect } from 'react';
import { PlanningData, CalendarEvent } from '@/lib/types';
import { storage } from '@/lib/storage';
import { getTomorrow } from '@/lib/utils';
import { LumenError } from '@/lib/errors';

export interface PlanningState {
  currentStep: number;
  reviewedItems: string[];
  assignedTasks: string[];
  winCondition: string;
  calendarEvents: CalendarEvent[];
  isComplete: boolean;
}

export function usePlanning(userId: string) {
  const [state, setState] = useState<PlanningState>({
    currentStep: 1,
    reviewedItems: [],
    assignedTasks: [],
    winCondition: '',
    calendarEvents: [],
    isComplete: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tomorrowDate = getTomorrow().toISOString().split('T')[0] || '';

  useEffect(() => {
    const existingData = storage.getPlanningData(userId, tomorrowDate);
    if (existingData && !existingData.completed) {
      setState({
        currentStep: 1,
        reviewedItems: existingData.reviewedItems,
        assignedTasks: existingData.assignedTasks,
        winCondition: existingData.winCondition,
        calendarEvents: existingData.calendarEvents,
        isComplete: false,
      });
    }
  }, [userId, tomorrowDate]);

  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 5),
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  const updateReviewedItems = useCallback((items: string[]) => {
    setState(prev => ({ ...prev, reviewedItems: items }));
  }, []);

  const updateCalendarEvents = useCallback(
    (events: CalendarEvent[]) => {
      setState(prev => ({ ...prev, calendarEvents: events }));
      storage.saveCalendarEvents(userId, tomorrowDate, events);
    },
    [userId, tomorrowDate]
  );

  const updateAssignedTasks = useCallback((taskIds: string[]) => {
    setState(prev => ({ ...prev, assignedTasks: taskIds }));
  }, []);

  const updateWinCondition = useCallback((condition: string) => {
    setState(prev => ({ ...prev, winCondition: condition }));
  }, []);

  const savePlanning = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const planningData: PlanningData = {
        userId,
        date: tomorrowDate,
        reviewedItems: state.reviewedItems,
        assignedTasks: state.assignedTasks,
        winCondition: state.winCondition,
        calendarEvents: state.calendarEvents,
        completed: true,
        createdAt: new Date().toISOString(),
      };

      storage.savePlanningData(planningData);

      try {
        const response = await fetch('/api/planning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(planningData),
        });

        if (!response.ok) {
          throw new LumenError(
            'Failed to save planning data',
            'SAVE_PLANNING_ERROR',
            'Planning saved locally. Will sync when online.',
            response.status
          );
        }

        storage.markSynced(`planning_${userId}_${tomorrowDate}`);
      } catch (apiError) {
        console.warn('API save failed, data saved locally:', apiError);
      }

      setState(prev => ({ ...prev, isComplete: true }));
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save planning';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, [userId, tomorrowDate, state]);

  const resetPlanning = useCallback(() => {
    setState({
      currentStep: 1,
      reviewedItems: [],
      assignedTasks: [],
      winCondition: '',
      calendarEvents: [],
      isComplete: false,
    });
  }, []);

  return {
    state,
    loading,
    error,
    nextStep,
    previousStep,
    updateReviewedItems,
    updateCalendarEvents,
    updateAssignedTasks,
    updateWinCondition,
    savePlanning,
    resetPlanning,
  };
}
