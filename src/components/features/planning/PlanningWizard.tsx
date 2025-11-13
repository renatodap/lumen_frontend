'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { Step1ReviewInbox } from './Step1ReviewInbox';
import { Step2CalendarView } from './Step2CalendarView';
import { Step3TaskAssignment } from './Step3TaskAssignment';
import { Step4WinCondition } from './Step4WinCondition';
import { PlanningComplete } from './PlanningComplete';
import { usePlanning } from '@/hooks/usePlanning';

interface PlanningWizardProps {
  userId: string;
  onClose: () => void;
}

const STEP_TITLES = ['Review Inbox', 'Calendar', 'Assign Tasks', 'Win Condition', 'Complete'];

export function PlanningWizard({ userId, onClose }: PlanningWizardProps) {
  const {
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
  } = usePlanning(userId);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0]?.clientX || null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0]?.clientX || null);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && state.currentStep < 4) {
      handleStepComplete();
    }
    if (isRightSwipe && state.currentStep > 1) {
      previousStep();
    }
  };

  const handleStepComplete = async () => {
    if (state.currentStep === 4) {
      const success = await savePlanning();
      if (success) {
        nextStep();
      }
    } else {
      nextStep();
    }
  };

  const handleStep1Complete = (reviewedItems: string[]) => {
    updateReviewedItems(reviewedItems);
    nextStep();
  };

  const handleStep2Complete = (events: typeof state.calendarEvents) => {
    updateCalendarEvents(events);
    nextStep();
  };

  const handleStep3Complete = (taskIds: string[]) => {
    updateAssignedTasks(taskIds);
    nextStep();
  };

  const handleStep4Complete = async (condition: string) => {
    updateWinCondition(condition);
    const success = await savePlanning();
    if (success) {
      nextStep();
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (state.isComplete && state.currentStep === 5) {
    return (
      <div className="fixed inset-0 z-50 bg-bg-primary">
        <PlanningComplete
          assignedTasksCount={state.assignedTasks.length}
          winCondition={state.winCondition}
          onClose={onClose}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-bg-primary overflow-y-auto"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="sticky top-0 z-10 bg-bg-primary border-b border-text-muted">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-text-primary">Plan Tomorrow</h1>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <Progress value={state.currentStep} max={4} showLabel={false} />
          <div className="flex justify-between mt-2">
            {STEP_TITLES.slice(0, 4).map((title, index) => (
              <span
                key={title}
                className={`text-xs ${
                  index + 1 === state.currentStep
                    ? 'text-accent font-medium'
                    : index + 1 < state.currentStep
                      ? 'text-success'
                      : 'text-text-muted'
                }`}
              >
                {title}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error rounded text-error text-sm">
            {error}
          </div>
        )}

        {state.currentStep === 1 && (
          <Step1ReviewInbox
            userId={userId}
            onComplete={handleStep1Complete}
            initialReviewedItems={state.reviewedItems}
          />
        )}

        {state.currentStep === 2 && (
          <Step2CalendarView
            userId={userId}
            onComplete={handleStep2Complete}
            initialEvents={state.calendarEvents}
          />
        )}

        {state.currentStep === 3 && (
          <Step3TaskAssignment
            userId={userId}
            reviewedItems={state.reviewedItems}
            calendarEvents={state.calendarEvents}
            onComplete={handleStep3Complete}
            initialAssignedTasks={state.assignedTasks}
          />
        )}

        {state.currentStep === 4 && (
          <Step4WinCondition
            userId={userId}
            assignedTasks={state.assignedTasks}
            onComplete={handleStep4Complete}
            initialWinCondition={state.winCondition}
          />
        )}
      </div>

      {state.currentStep > 1 && state.currentStep < 5 && (
        <div className="fixed bottom-20 left-4">
          <Button variant="ghost" size="sm" onClick={previousStep} disabled={loading}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
