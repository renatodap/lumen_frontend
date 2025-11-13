import { PlanningData, Task, CalendarEvent } from './types';

const STORAGE_KEYS = {
  PLANNING_DATA: 'lumen_planning_data',
  TASKS: 'lumen_tasks',
  CALENDAR_EVENTS: 'lumen_calendar_events',
  SYNC_QUEUE: 'lumen_sync_queue',
} as const;

export interface SyncItem {
  id: string;
  type: 'planning' | 'task' | 'calendar';
  data: unknown;
  timestamp: number;
  synced: boolean;
}

export const storage = {
  getPlanningData: (userId: string, date: string): PlanningData | null => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.PLANNING_DATA}_${userId}_${date}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading planning data from storage:', error);
      return null;
    }
  },

  savePlanningData: (data: PlanningData): void => {
    try {
      localStorage.setItem(
        `${STORAGE_KEYS.PLANNING_DATA}_${data.userId}_${data.date}`,
        JSON.stringify(data)
      );
      storage.addToSyncQueue({
        id: `planning_${data.userId}_${data.date}`,
        type: 'planning',
        data,
        timestamp: Date.now(),
        synced: false,
      });
    } catch (error) {
      console.error('Error saving planning data to storage:', error);
    }
  },

  getTasks: (userId: string): Task[] => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.TASKS}_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading tasks from storage:', error);
      return [];
    }
  },

  saveTasks: (userId: string, tasks: Task[]): void => {
    try {
      localStorage.setItem(`${STORAGE_KEYS.TASKS}_${userId}`, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
    }
  },

  getCalendarEvents: (userId: string, date: string): CalendarEvent[] => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.CALENDAR_EVENTS}_${userId}_${date}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading calendar events from storage:', error);
      return [];
    }
  },

  saveCalendarEvents: (userId: string, date: string, events: CalendarEvent[]): void => {
    try {
      localStorage.setItem(
        `${STORAGE_KEYS.CALENDAR_EVENTS}_${userId}_${date}`,
        JSON.stringify(events)
      );
    } catch (error) {
      console.error('Error saving calendar events to storage:', error);
    }
  },

  addToSyncQueue: (item: SyncItem): void => {
    try {
      const queue = storage.getSyncQueue();
      queue.push(item);
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  },

  getSyncQueue: (): SyncItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading sync queue:', error);
      return [];
    }
  },

  markSynced: (id: string): void => {
    try {
      const queue = storage.getSyncQueue();
      const updated = queue.map(item => (item.id === id ? { ...item, synced: true } : item));
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking item as synced:', error);
    }
  },

  clearSyncedItems: (): void => {
    try {
      const queue = storage.getSyncQueue();
      const unsynced = queue.filter(item => !item.synced);
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(unsynced));
    } catch (error) {
      console.error('Error clearing synced items:', error);
    }
  },
};
