/**
 * Test utilities for LUMEN tests
 */
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Create a new QueryClient for each test
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface AllTheProvidersProps {
  children: React.ReactNode;
}

/**
 * Wrapper component with all providers for testing
 */
export function AllTheProviders({ children }: AllTheProvidersProps) {
  const queryClient = createTestQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

/**
 * Custom render with providers
 */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

/**
 * Mock fetch responses (for use in test files only)
 */
export function mockFetch(response: any, status = 200) {
  // @ts-expect-error - jest is available in test environment
  return (globalThis.jest as any)?.fn()?.mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => response,
    text: async () => JSON.stringify(response),
  });
}

/**
 * Mock fetch error (for use in test files only)
 */
export function mockFetchError(message: string, status = 500) {
  // @ts-expect-error - jest is available in test environment
  return (globalThis.jest as any)?.fn()?.mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ message }),
    text: async () => message,
  });
}

/**
 * Wait for async operations
 */
export function waitForAsync() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Create mock habit data
 */
export function createMockHabit(overrides = {}) {
  return {
    id: '1',
    user_id: 'user-1',
    goal_id: null,
    name: 'Morning Exercise',
    frequency: 'daily' as const,
    reminder_times: ['09:00'],
    icon: '🏃',
    created_at: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

/**
 * Create mock habit log data
 */
export function createMockHabitLog(overrides = {}) {
  return {
    id: '1',
    habit_id: '1',
    user_id: 'user-1',
    logged_at: '2025-01-13T09:00:00Z',
    date: '2025-01-13',
    completed: true,
    notes: null,
    ...overrides,
  };
}

/**
 * Create mock task data
 */
export function createMockTask(overrides = {}) {
  return {
    id: '1',
    user_id: 'user-1',
    goal_id: null,
    title: 'Complete project report',
    due_date: '2025-01-15T00:00:00Z',
    horizon: '2-day' as const,
    notes: null,
    completed: false,
    completed_at: null,
    created_at: '2025-01-13T00:00:00Z',
    ...overrides,
  };
}

/**
 * Create mock daily log data
 */
export function createMockDailyLog(overrides = {}) {
  return {
    id: '1',
    user_id: 'user-1',
    date: '2025-01-13',
    goal_id: null,
    criteria_met: ['1', '2', '3'],
    day_won: true,
    win_condition_met: true,
    reflection: 'Great day!',
    planned_next_day: true,
    created_at: '2025-01-13T23:00:00Z',
    ...overrides,
  };
}

// Re-export testing library utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
