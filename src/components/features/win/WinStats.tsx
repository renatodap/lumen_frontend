'use client';

import { useMemo } from 'react';
import { WinStats as WinStatsType } from '@/types/win';

interface WinStatsProps {
  stats: WinStatsType | null;
  isLoading: boolean;
  className?: string;
}

export function WinStats({ stats, isLoading, className = '' }: WinStatsProps) {
  const last7DaysDisplay = useMemo(() => {
    if (!stats?.last7Days.length) return null;

    return stats.last7Days.map((won, index) => ({
      won,
      index,
    }));
  }, [stats?.last7Days]);

  if (isLoading) {
    return (
      <div className={`rounded-lg border border-bg-hover bg-bg-surface p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-bg-hover" />
          <div className="h-16 rounded bg-bg-hover" />
          <div className="h-16 rounded bg-bg-hover" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`rounded-lg border border-bg-hover bg-bg-surface p-6 ${className}`}>
        <p className="text-text-secondary">No stats available yet</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-bg-hover bg-bg-surface p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-text-primary">Win Statistics</h3>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-bg-hover bg-bg-primary p-4">
          <p className="text-sm text-text-secondary">Win Rate</p>
          <p className="mt-1 text-3xl font-bold text-accent">{stats.winRate}%</p>
          <p className="mt-1 text-xs text-text-muted">
            {stats.wonDays} of {stats.totalDays} days
          </p>
        </div>

        <div className="rounded-lg border border-bg-hover bg-bg-primary p-4">
          <p className="text-sm text-text-secondary">Current Streak</p>
          <p className="mt-1 text-3xl font-bold text-success">{stats.currentStreak}</p>
          <p className="mt-1 text-xs text-text-muted">Best: {stats.bestStreak} days</p>
        </div>
      </div>

      {last7DaysDisplay && last7DaysDisplay.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-text-primary">Last 7 Days</p>
          <div className="mt-3 flex gap-2">
            {last7DaysDisplay.map(day => (
              <div
                key={day.index}
                className={`h-10 flex-1 rounded ${
                  day.won
                    ? 'bg-success/20 border border-success'
                    : 'bg-bg-primary border border-bg-hover'
                }`}
                title={day.won ? 'Won' : 'Lost'}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-lg border border-bg-hover bg-bg-primary p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">Days Tracked</p>
            <p className="mt-1 text-2xl font-semibold text-text-primary">{stats.totalDays}</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Days Won</p>
            <p className="mt-1 text-2xl font-semibold text-success">{stats.wonDays}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
