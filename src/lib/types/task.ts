export type TaskHorizon = '2-day' | '7-day' | 'future';

export interface Task {
  id: string;
  user_id: string;
  goal_id: string | null;
  title: string;
  due_date: string | null;
  horizon: TaskHorizon;
  notes: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface TaskFormData {
  title: string;
  due_date: string | null;
  goal_id: string | null;
  notes: string;
}

export interface TaskHorizonBuckets {
  '2-day': Task[];
  '7-day': Task[];
  future: Task[];
}
