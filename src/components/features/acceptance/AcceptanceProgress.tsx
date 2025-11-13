import React from 'react';
import { cn } from '@/lib/utils';

export interface AcceptanceProgressProps {
  total: number;
  completed: number;
  showLabel?: boolean;
  className?: string;
}

export const AcceptanceProgress: React.FC<AcceptanceProgressProps> = ({
  total,
  completed,
  showLabel = true,
  className,
}) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const isComplete = total > 0 && completed === total;

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-text-primary">Acceptance Criteria</span>
          <span
            className={cn(
              'text-sm font-semibold',
              isComplete ? 'text-success' : 'text-text-secondary'
            )}
          >
            {completed} / {total}
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-bg-hover rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out',
            isComplete ? 'bg-success' : 'bg-accent'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!isComplete && total > 0 && (
        <p className="text-xs text-text-secondary">
          {total - completed} criteria remaining to close the day
        </p>
      )}
      {isComplete && total > 0 && (
        <p className="text-xs text-success font-medium">All criteria met! You can close the day.</p>
      )}
    </div>
  );
};
