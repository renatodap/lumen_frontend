'use client';

import { useMemo } from 'react';
import { calculateWinStatus } from '@/lib/winCalculations';
import { DailyLog, Goal } from '@/types/win';

interface WinStatusProps {
  todayLog: DailyLog | null;
  goal: Goal | null;
  className?: string;
}

export function WinStatus({ todayLog, goal, className = '' }: WinStatusProps) {
  const winStatus = useMemo(() => calculateWinStatus(todayLog, goal), [todayLog, goal]);

  const getStatusDisplay = () => {
    if (!winStatus.canWin) {
      return {
        text: 'No Win Condition',
        description: 'Set a win condition for this goal to track daily wins',
        color: 'text-text-muted',
        bgColor: 'bg-bg-surface',
      };
    }

    if (winStatus.won) {
      return {
        text: 'Day Won',
        description: winStatus.reason,
        color: 'text-success',
        bgColor: 'bg-success/10',
      };
    }

    return {
      text: 'Day Not Won',
      description: winStatus.reason,
      color: 'text-text-secondary',
      bgColor: 'bg-bg-surface',
    };
  };

  const status = getStatusDisplay();

  return (
    <div className={`rounded-lg border border-bg-hover p-4 ${status.bgColor} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-xl font-semibold ${status.color}`}>{status.text}</h3>
          <p className="mt-1 text-sm text-text-secondary">{status.description}</p>
        </div>
        <div
          className={`h-12 w-12 rounded-full ${status.bgColor} border-2 ${
            winStatus.won
              ? 'border-success'
              : winStatus.canWin
                ? 'border-text-muted'
                : 'border-bg-hover'
          } flex items-center justify-center`}
        >
          <span className={`text-2xl ${status.color}`}>
            {winStatus.won ? '✓' : winStatus.canWin ? '—' : '?'}
          </span>
        </div>
      </div>
    </div>
  );
}
