'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Step4WinConditionProps {
  userId: string;
  assignedTasks: string[];
  onComplete: (winCondition: string) => void;
  initialWinCondition?: string;
}

const SUGGESTED_WIN_CONDITIONS = [
  'Complete all assigned tasks',
  'Make progress on top priority task',
  'Maintain daily habits streak',
  'Stay within time budget',
  'Complete morning routine',
  'End day with inbox at zero',
];

export function Step4WinCondition({
  assignedTasks,
  onComplete,
  initialWinCondition = '',
}: Step4WinConditionProps) {
  const [winCondition, setWinCondition] = useState(initialWinCondition);
  const [customMode, setCustomMode] = useState(false);

  useEffect(() => {
    if (initialWinCondition && !SUGGESTED_WIN_CONDITIONS.includes(initialWinCondition)) {
      setCustomMode(true);
    }
  }, [initialWinCondition]);

  const handleSelectSuggestion = (suggestion: string) => {
    setWinCondition(suggestion);
    setCustomMode(false);
  };

  const handleCustomInput = () => {
    setCustomMode(true);
    setWinCondition('');
  };

  const handleContinue = () => {
    if (winCondition.trim()) {
      onComplete(winCondition.trim());
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Set Your Win Condition</h2>
        <p className="text-text-secondary">What would make tomorrow a winning day?</p>
      </div>

      <Card className="bg-accent/10 border-accent">
        <div>
          <p className="text-sm text-text-secondary mb-1">Tasks assigned</p>
          <p className="text-2xl font-semibold text-accent">{assignedTasks.length}</p>
        </div>
      </Card>

      {!customMode ? (
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">Select a win condition:</p>
          {SUGGESTED_WIN_CONDITIONS.map(suggestion => (
            <Card
              key={suggestion}
              className={`cursor-pointer hover:bg-bg-hover transition-colors ${
                winCondition === suggestion ? 'border-accent bg-accent/5' : ''
              }`}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    winCondition === suggestion ? 'border-accent bg-accent' : 'border-text-muted'
                  }`}
                >
                  {winCondition === suggestion && (
                    <svg
                      className="w-3 h-3 text-bg-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-text-primary">{suggestion}</p>
              </div>
            </Card>
          ))}
          <Button variant="ghost" onClick={handleCustomInput} className="w-full">
            Write custom win condition
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            label="Custom win condition"
            placeholder="What would make tomorrow a winning day?"
            value={winCondition}
            onChange={e => setWinCondition(e.target.value)}
            autoFocus
          />
          <Button
            variant="ghost"
            onClick={() => {
              setCustomMode(false);
              setWinCondition('');
            }}
            size="sm"
          >
            Back to suggestions
          </Button>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg-primary border-t border-text-muted">
        <Button
          onClick={handleContinue}
          className="w-full"
          size="lg"
          disabled={!winCondition.trim()}
        >
          Complete Planning
        </Button>
      </div>
    </div>
  );
}
