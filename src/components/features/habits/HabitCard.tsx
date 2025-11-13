'use client';

import { useState, useRef, useEffect } from 'react';
import { Habit } from '@/types/habit';
import { useHabitStats } from '@/hooks/useHabitStats';
import { useHabitLogs } from '@/hooks/useHabitLogs';
import { formatStreakText, getStreakEmoji } from '@/lib/habitUtils';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { stats, todayCompleted, isLoading } = useHabitStats(habit.id);
  const { logHabit, isLogging } = useHabitLogs();

  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (todayCompleted) return;
    if (!e.touches[0]) return;
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || todayCompleted) return;
    if (!e.touches[0]) return;

    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;

    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 120));
    }
  };

  const handleTouchEnd = async () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (swipeOffset > 80 && !todayCompleted) {
      setIsCompleting(true);

      try {
        await logHabit(habit.id);
        setSwipeOffset(0);
      } catch (error) {
        setSwipeOffset(0);
      } finally {
        setIsCompleting(false);
      }
    } else {
      setSwipeOffset(0);
    }
  };

  const handleQuickComplete = async () => {
    if (todayCompleted || isCompleting) return;

    setIsCompleting(true);
    try {
      await logHabit(habit.id);
    } catch (error) {
      console.error('Failed to log habit:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  useEffect(() => {
    if (swipeOffset > 0) {
      const timer = setTimeout(() => {
        if (!isDraggingRef.current) {
          setSwipeOffset(0);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [swipeOffset]);

  return (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-end pr-6',
          'bg-success transition-opacity',
          swipeOffset > 40 ? 'opacity-100' : 'opacity-0'
        )}
      >
        <span className="text-2xl">✓</span>
      </div>

      <div
        ref={cardRef}
        className={cn(
          'relative bg-bg-surface border border-border rounded-lg p-4',
          'transition-all duration-200 ease-out',
          todayCompleted && 'opacity-60',
          isCompleting && 'scale-95'
        )}
        style={{
          transform: `translateX(${swipeOffset}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {habit.icon && <span className="text-xl">{habit.icon}</span>}
              <h3 className={cn('font-medium text-text-primary', todayCompleted && 'line-through')}>
                {habit.name}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="text-text-secondary">
                {getStreakEmoji(stats.currentStreak)} {formatStreakText(stats.currentStreak)}
              </span>

              {stats.completionRate > 0 && (
                <span className="text-text-muted">{stats.completionRate}% complete</span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickComplete}
            disabled={todayCompleted || isLogging || isCompleting}
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-full',
              'flex items-center justify-center',
              'transition-all duration-200',
              todayCompleted
                ? 'bg-success text-white'
                : 'bg-bg-hover text-text-secondary hover:bg-accent hover:text-bg-primary',
              (isLogging || isCompleting) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {todayCompleted ? (
              <span className="text-xl">✓</span>
            ) : (
              <span className="text-xl">○</span>
            )}
          </button>
        </div>

        {!isLoading && stats.longestStreak > stats.currentStreak && stats.longestStreak > 7 && (
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-xs text-text-muted">Best streak: {stats.longestStreak} days 🏆</p>
          </div>
        )}
      </div>
    </div>
  );
}
