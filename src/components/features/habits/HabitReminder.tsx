'use client';

import { useEffect, useState } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { useHabitReminders } from '@/hooks/useHabitReminders';
import { cn } from '@/lib/utils';

export function HabitReminder() {
  const { habits } = useHabits();
  const { permission, requestPermission, testNotification, isSupported } =
    useHabitReminders(habits);

  const [showSettings, setShowSettings] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const hasSeenPrompt = localStorage.getItem('lumen-notifications-prompted');
    if (!hasSeenPrompt && isSupported && permission === 'default') {
      setShowSettings(true);
    }
  }, [isSupported, permission]);

  const handleEnable = async () => {
    const result = await requestPermission();
    localStorage.setItem('lumen-notifications-prompted', 'true');

    if (result === 'granted') {
      testNotification('Example Habit');
      setShowSettings(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('lumen-notifications-prompted', 'true');
    setShowSettings(false);
    setDismissed(true);
  };

  if (!isSupported) {
    return null;
  }

  if (permission === 'granted' || dismissed) {
    return null;
  }

  if (!showSettings) {
    return (
      <button
        onClick={() => setShowSettings(true)}
        className={cn(
          'fixed bottom-20 right-4 z-40',
          'w-14 h-14 rounded-full',
          'bg-accent text-bg-primary',
          'flex items-center justify-center',
          'shadow-lg hover:scale-110 transition-transform'
        )}
        title="Enable reminders"
      >
        🔔
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-primary rounded-lg p-6 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔔</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">Enable Habit Reminders</h3>
          <p className="text-text-secondary text-sm">
            Get timely notifications to help you stay consistent with your habits. LUMEN learns when
            you usually complete habits and optimizes reminder timing.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 text-sm">
            <span className="text-accent">✓</span>
            <p className="text-text-secondary">Smart timing based on your patterns</p>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-accent">✓</span>
            <p className="text-text-secondary">Works offline with PWA</p>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-accent">✓</span>
            <p className="text-text-secondary">Quick dismiss or complete from notification</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDismiss}
            className={cn(
              'flex-1 px-4 py-3 rounded',
              'bg-bg-surface text-text-secondary',
              'font-medium transition-colors',
              'hover:bg-bg-hover'
            )}
          >
            Maybe Later
          </button>
          <button
            onClick={handleEnable}
            className={cn(
              'flex-1 px-4 py-3 rounded',
              'bg-accent text-bg-primary',
              'font-medium transition-colors',
              'hover:bg-accent-hover'
            )}
          >
            Enable
          </button>
        </div>

        <p className="text-xs text-text-muted text-center mt-4">
          You can change this later in settings
        </p>
      </div>
    </div>
  );
}
