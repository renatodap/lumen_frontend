'use client';

import { useState } from 'react';
import { useDailyLog } from '@/hooks/useDailyLog';
import { Goal } from '@/types/win';
import { getTodayISO } from '@/lib/utils';
import { handleError } from '@/lib/errors';

interface WinReviewProps {
  userId: string;
  goal: Goal | null;
  initialWinConditionMet: boolean;
  onComplete?: () => void;
}

export function WinReview({ userId, goal, initialWinConditionMet, onComplete }: WinReviewProps) {
  const [winConditionMet, setWinConditionMet] = useState(initialWinConditionMet);
  const [reflection, setReflection] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { saveDailyLog, isSaving } = useDailyLog();

  const handleSubmit = async () => {
    try {
      setError(null);

      saveDailyLog(
        {
          userId,
          date: getTodayISO(),
          goalId: goal?.id || null,
          criteriaMet: [],
          dayWon: winConditionMet,
          winConditionMet,
          reflection: reflection.trim() || undefined,
          plannedNextDay: false,
        },
        {
          onSuccess: () => {
            onComplete?.();
          },
          onError: err => {
            setError(handleError(err));
          },
        }
      );
    } catch (err) {
      setError(handleError(err));
    }
  };

  if (!goal?.win_condition) {
    return (
      <div className="rounded-lg border border-bg-hover bg-bg-surface p-6">
        <h2 className="text-2xl font-semibold text-text-primary">Daily Review</h2>
        <p className="mt-2 text-text-secondary">
          Set a win condition for your goal to enable daily review.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-bg-hover bg-bg-surface p-6">
      <h2 className="text-2xl font-semibold text-text-primary">Did I Win My Day?</h2>

      <div className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-primary">Win Condition</label>
          <p className="mt-1 text-text-secondary">{goal.win_condition}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary">
            Did you meet your win condition today?
          </label>
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => setWinConditionMet(true)}
              className={`flex-1 rounded border py-3 px-4 font-medium transition-colors ${
                winConditionMet
                  ? 'border-success bg-success/10 text-success'
                  : 'border-bg-hover bg-bg-primary text-text-primary hover:bg-bg-hover'
              }`}
            >
              Yes, I Won
            </button>
            <button
              onClick={() => setWinConditionMet(false)}
              className={`flex-1 rounded border py-3 px-4 font-medium transition-colors ${
                !winConditionMet
                  ? 'border-error bg-error/10 text-error'
                  : 'border-bg-hover bg-bg-primary text-text-primary hover:bg-bg-hover'
              }`}
            >
              No, I Lost
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="reflection" className="block text-sm font-medium text-text-primary">
            Reflection (Optional)
          </label>
          <textarea
            id="reflection"
            rows={4}
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="What went well? What could be improved?"
            className="mt-2 w-full rounded border border-bg-hover bg-bg-primary px-4 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
          />
        </div>

        {error && (
          <div className="rounded border border-error bg-error/10 p-3 text-sm text-error">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="w-full rounded bg-accent py-3 px-4 font-semibold text-bg-primary hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Saving...' : 'Complete Review'}
        </button>
      </div>
    </div>
  );
}
