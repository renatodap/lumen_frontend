'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, getTomorrow } from '@/lib/utils';

interface PlanningCompleteProps {
  assignedTasksCount: number;
  winCondition: string;
  onClose: () => void;
}

export function PlanningComplete({
  assignedTasksCount,
  winCondition,
  onClose,
}: PlanningCompleteProps) {
  const tomorrow = getTomorrow();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-success/20 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-text-primary">Planning Complete</h2>
          <p className="text-text-secondary">You&apos;re all set for {formatDate(tomorrow)}</p>
        </div>

        <Card>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-secondary mb-1">Tasks assigned</p>
              <p className="text-3xl font-semibold text-accent">{assignedTasksCount}</p>
            </div>
            <div className="border-t border-text-muted pt-4">
              <p className="text-sm text-text-secondary mb-2">Win condition</p>
              <p className="text-text-primary font-medium">{winCondition}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-bg-hover">
          <div className="text-sm text-text-secondary space-y-2">
            <p>Tomorrow, you&apos;ll be able to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Track your assigned tasks</li>
              <li>Check off your acceptance criteria</li>
              <li>Evaluate if you won the day</li>
            </ul>
          </div>
        </Card>

        <Button onClick={onClose} className="w-full" size="lg">
          Close
        </Button>
      </div>
    </div>
  );
}
