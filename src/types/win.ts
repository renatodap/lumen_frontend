export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  goal_id: string | null;
  criteria_met: string[];
  day_won: boolean;
  win_condition_met: boolean | null;
  reflection: string | null;
  planned_next_day: boolean;
  created_at: string;
}

export interface WinStats {
  totalDays: number;
  wonDays: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  last7Days: boolean[];
  last30Days: boolean[];
}

export interface StreakData {
  current: number;
  best: number;
  history: Array<{
    date: string;
    won: boolean;
  }>;
}

export interface Goal {
  id: string;
  user_id: string;
  area_id: string | null;
  title: string;
  timeframe: string | null;
  end_date: string | null;
  win_condition: string | null;
  description: string | null;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}
