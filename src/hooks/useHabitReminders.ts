import { useEffect, useCallback, useState } from 'react';
import { Habit, ReminderSchedule } from '@/types/habit';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return Promise.resolve('denied');
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve('granted');
  }

  if (Notification.permission !== 'denied') {
    return Notification.requestPermission();
  }

  return Promise.resolve('denied');
}

function showNotification(options: NotificationOptions): void {
  if (Notification.permission === 'granted') {
    const notifOptions: globalThis.NotificationOptions = {
      body: options.body,
      icon: options.icon || '/icon-192.png',
      requireInteraction: options.requireInteraction || false,
      badge: '/icon-192.png',
    };
    if (options.tag) notifOptions.tag = options.tag;
    new Notification(options.title, notifOptions);
  }
}

function scheduleReminder(
  schedule: ReminderSchedule,
  onTrigger: (habitId: string) => void
): () => void {
  const [hours, minutes] = schedule.scheduledTime.split(':').map(Number);

  const checkAndNotify = () => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    if (currentHours === hours && currentMinutes === minutes) {
      showNotification({
        title: 'Habit Reminder',
        body: `Time for: ${schedule.habitName}`,
        tag: `habit-${schedule.habitId}`,
        requireInteraction: true,
      });

      onTrigger(schedule.habitId);
    }
  };

  checkAndNotify();

  const interval = setInterval(checkAndNotify, 60000);

  return () => clearInterval(interval);
}

export function useHabitReminders(habits: Habit[]) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [activeReminders, setActiveReminders] = useState<string[]>([]);

  useEffect(() => {
    requestNotificationPermission().then(setPermission);
  }, []);

  const scheduleHabitReminders = useCallback(
    (habit: Habit) => {
      if (permission !== 'granted') return;

      // TODO: Check if habit completed today before scheduling reminders

      const schedules: ReminderSchedule[] = habit.reminder_times.map(time => {
        // TODO: Implement pattern learning for smart scheduling

        return {
          habitId: habit.id,
          habitName: habit.name,
          scheduledTime: time,
          isSmartScheduled: false,
        };
      });

      const cleanups: (() => void)[] = [];

      schedules.forEach(schedule => {
        const cleanup = scheduleReminder(schedule, habitId => {
          setActiveReminders(prev => [...prev, habitId]);
        });
        cleanups.push(cleanup);
      });

      return () => {
        cleanups.forEach(cleanup => cleanup());
      };
    },
    [permission]
  );

  useEffect(() => {
    if (permission !== 'granted') return;

    const cleanups = habits.map(habit => scheduleHabitReminders(habit));

    return () => {
      cleanups.forEach(cleanup => cleanup && cleanup());
    };
  }, [habits, permission, scheduleHabitReminders]);

  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    return result;
  }, []);

  const testNotification = useCallback((habitName: string) => {
    showNotification({
      title: 'Test Reminder',
      body: `This is how your reminder for "${habitName}" will look`,
      requireInteraction: false,
    });
  }, []);

  return {
    permission,
    requestPermission,
    testNotification,
    activeReminders,
    isSupported: 'Notification' in window,
  };
}
