export interface Task {
  id: string;
  userId: string;
  goalId?: string;
  title: string;
  dueDate?: string;
  horizon: '2-day' | '7-day' | 'future';
  notes?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  provider: 'google' | 'microsoft';
  allDay: boolean;
}

export interface PlanningData {
  userId: string;
  date: string;
  reviewedItems: string[];
  assignedTasks: string[];
  winCondition: string;
  calendarEvents: CalendarEvent[];
  completed: boolean;
  createdAt: string;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  goalId?: string;
  criteriaMet: string[];
  dayWon: boolean;
  winConditionMet?: boolean;
  reflection?: string;
  plannedNextDay: boolean;
  createdAt: string;
}
