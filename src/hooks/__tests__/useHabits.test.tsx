/**
 * useHabits Hook Tests
 */
import { renderHook, waitFor } from '@testing-library/react';
import { renderWithProviders, createMockHabit, mockFetch, mockFetchError } from '@/test-utils';
import { useHabits } from '../useHabits';

// Mock fetch
global.fetch = jest.fn();

describe('useHabits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetching Habits', () => {
    it('fetches habits successfully', async () => {
      const mockHabits = [createMockHabit(), createMockHabit({ id: '2', name: 'Read' })];
      (global.fetch as jest.Mock).mockImplementation(mockFetch(mockHabits));

      const { result } = renderHook(() => useHabits(), {
        wrapper: ({ children }) => renderWithProviders(children as any).container,
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.habits).toEqual(mockHabits);
      expect(result.current.error).toBe(null);
    });

    it('handles fetch error', async () => {
      (global.fetch as jest.Mock).mockImplementation(mockFetchError('Failed to fetch', 500));

      const { result } = renderHook(() => useHabits(), {
        wrapper: ({ children }) => renderWithProviders(children as any).container,
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      expect(result.current.habits).toEqual([]);
    });

    it('returns empty array when no habits', async () => {
      (global.fetch as jest.Mock).mockImplementation(mockFetch([]));

      const { result } = renderHook(() => useHabits(), {
        wrapper: ({ children }) => renderWithProviders(children as any).container,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.habits).toEqual([]);
    });
  });

  describe('Creating Habits', () => {
    it('creates habit successfully', async () => {
      const existingHabits = [createMockHabit()];
      const newHabit = createMockHabit({ id: '2', name: 'New Habit' });

      (global.fetch as jest.Mock)
        .mockImplementationOnce(mockFetch(existingHabits))
        .mockImplementationOnce(mockFetch(newHabit))
        .mockImplementationOnce(mockFetch([...existingHabits, newHabit]));

      const { result } = renderHook(() => useHabits(), {
        wrapper: ({ children }) => renderWithProviders(children as any).container,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.createHabit({
        name: 'New Habit',
        frequency: 'daily',
        reminder_times: ['09:00'],
        icon: '📚',
        goal_id: null,
      });

      await waitFor(() => {
        expect(result.current.habits.length).toBe(2);
      });

      expect(result.current.isCreating).toBe(false);
    });

    it('handles create error', async () => {
      (global.fetch as jest.Mock)
        .mockImplementationOnce(mockFetch([]))
        .mockImplementationOnce(mockFetchError('Failed to create', 500));

      const { result } = renderHook(() => useHabits(), {
        wrapper: ({ children }) => renderWithProviders(children as any).container,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        result.current.createHabit({
          name: 'New Habit',
          frequency: 'daily',
          reminder_times: [],
          icon: null,
          goal_id: null,
        })
      ).rejects.toThrow();
    });

    it('sets isCreating flag during creation', async () => {
      const newHabit = createMockHabit();
      let resolveCreate: any;
      (global.fetch as jest.Mock).mockImplementationOnce(mockFetch([])).mockImplementationOnce(
        () =>
          new Promise(resolve => {
            resolveCreate = () =>
              resolve({
                ok: true,
                status: 200,
                json: async () => newHabit,
              });
          })
      );

      const { result } = renderHook(() => useHabits(), {
        wrapper: ({ children }) => renderWithProviders(children as any).container,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const createPromise = result.current.createHabit({
        name: 'Test',
        frequency: 'daily',
        reminder_times: [],
        icon: null,
        goal_id: null,
      });

      await waitFor(() => {
        expect(result.current.isCreating).toBe(true);
      });

      resolveCreate();
      await createPromise;

      await waitFor(() => {
        expect(result.current.isCreating).toBe(false);
      });
    });
  });

  describe('Updating Habits', () => {
    it('updates habit successfully', async () => {
      const habit = createMockHabit();
      const updatedHabit = { ...habit, name: 'Updated Name' };

      (global.fetch as jest.Mock)
        .mockImplementationOnce(mockFetch([habit]))
        .mockImplementationOnce(mockFetch(updatedHabit))
        .mockImplementationOnce(mockFetch([updatedHabit]));

      const { result } = renderHook(() => useHabits(), {
        wrapper: ({ children }) => renderWithProviders(children as any).container,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.updateHabit(habit.id, { name: 'Updated Name' });

      await waitFor(() => {
        expect(result.current.habits[0].name).toBe('Updated Name');
      });

      expect(result.current.isUpdating).toBe(false);
    });

    it('handles update error', async () => {
      const habit = createMockHabit();

      (global.fetch as jest.Mock)
        .mockImplementationOnce(mockFetch([habit]))
        .mockImplementationOnce(mockFetchError('Failed to update', 500));

      const { result } = renderHook(() => useHabits(), {
        wrapper: ({ children }) => renderWithProviders(children as any).container,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(result.current.updateHabit(habit.id, { name: 'New Name' })).rejects.toThrow();
    });
  });

  describe('Deleting Habits', () => {
    it('deletes habit successfully', async () => {
      const habits = [createMockHabit({ id: '1' }), createMockHabit({ id: '2', name: 'Habit 2' })];

      (global.fetch as jest.Mock)
        .mockImplementationOnce(mockFetch(habits))
        .mockImplementationOnce(mockFetch(undefined))
        .mockImplementationOnce(mockFetch([habits[1]]));

      const { result } = renderHook(() => useHabits(), {
        wrapper: ({ children }) => renderWithProviders(children as any).container,
      });

      await waitFor(() => {
        expect(result.current.habits.length).toBe(2);
      });

      await result.current.deleteHabit('1');

      await waitFor(() => {
        expect(result.current.habits.length).toBe(1);
      });

      expect(result.current.isDeleting).toBe(false);
    });

    it('handles delete error', async () => {
      const habit = createMockHabit();

      (global.fetch as jest.Mock)
        .mockImplementationOnce(mockFetch([habit]))
        .mockImplementationOnce(mockFetchError('Failed to delete', 500));

      const { result } = renderHook(() => useHabits(), {
        wrapper: ({ children }) => renderWithProviders(children as any).container,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(result.current.deleteHabit(habit.id)).rejects.toThrow();
    });
  });

  describe('Loading States', () => {
    it('exposes correct loading states', async () => {
      (global.fetch as jest.Mock).mockImplementation(mockFetch([]));

      const { result } = renderHook(() => useHabits(), {
        wrapper: ({ children }) => renderWithProviders(children as any).container,
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isCreating).toBe(false);
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.isDeleting).toBe(false);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
