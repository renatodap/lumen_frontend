export interface Habit {
  id: string;
  user_id: string;
  goal_id: string | null;
  name: string;
  frequency: 'daily' | 'weekly' | 'custom';
  reminder_times: string[];
  icon: string | null;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  logged_at: string;
  date: string;
  completed: boolean;
  notes: string | null;
}

export interface HabitStats {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
  lastCompletedAt: string | null;
}

export interface HabitWithStats extends Habit {
  stats: HabitStats;
  todayCompleted: boolean;
}

export interface ReminderSchedule {
  habitId: string;
  habitName: string;
  scheduledTime: string;
  predictedTime?: string;
  isSmartScheduled: boolean;
}

export interface CompletionPattern {
  habitId: string;
  averageCompletionTime: string;
  commonCompletionTimes: string[];
  completionTimeVariance: number;
}
