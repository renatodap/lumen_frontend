/**
 * Utility Functions Tests
 */
import {
  cn,
  formatDate,
  formatShortDate,
  isToday,
  getStartOfDay,
  sleep,
  formatDateISO,
  getTodayISO,
  getDateDaysAgo,
  isSameDay,
  formatTime,
  getToday,
  getTomorrow,
} from '../utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles undefined and null', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
  });
});

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-01-13T00:00:00Z');
    const formatted = formatDate(date);
    expect(formatted).toMatch(/January 13, 2025/);
  });

  it('handles different dates', () => {
    const date = new Date('2024-12-25T00:00:00Z');
    const formatted = formatDate(date);
    expect(formatted).toMatch(/December 25, 2024/);
  });
});

describe('formatShortDate', () => {
  it('formats date in short format', () => {
    const date = new Date('2025-01-13T00:00:00Z');
    const formatted = formatShortDate(date);
    expect(formatted).toMatch(/Jan 13/);
  });

  it('handles different months', () => {
    const date = new Date('2024-12-25T00:00:00Z');
    const formatted = formatShortDate(date);
    expect(formatted).toMatch(/Dec 25/);
  });
});

describe('isToday', () => {
  it('returns true for today', () => {
    const today = new Date();
    expect(isToday(today)).toBe(true);
  });

  it('returns false for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });

  it('returns false for tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(isToday(tomorrow)).toBe(false);
  });

  it('returns true for today at different times', () => {
    const morning = new Date();
    morning.setHours(9, 0, 0, 0);

    const evening = new Date();
    evening.setHours(21, 30, 0, 0);

    expect(isToday(morning)).toBe(true);
    expect(isToday(evening)).toBe(true);
  });
});

describe('getStartOfDay', () => {
  it('returns start of day', () => {
    const date = new Date('2025-01-13T15:30:45.123Z');
    const startOfDay = getStartOfDay(date);

    expect(startOfDay.getHours()).toBe(0);
    expect(startOfDay.getMinutes()).toBe(0);
    expect(startOfDay.getSeconds()).toBe(0);
    expect(startOfDay.getMilliseconds()).toBe(0);
  });

  it('does not mutate original date', () => {
    const original = new Date('2025-01-13T15:30:45.123Z');
    const originalTime = original.getTime();

    getStartOfDay(original);

    expect(original.getTime()).toBe(originalTime);
  });

  it('preserves the date', () => {
    const date = new Date('2025-01-13T23:59:59.999Z');
    const startOfDay = getStartOfDay(date);

    expect(startOfDay.getDate()).toBe(date.getDate());
  });
});

describe('sleep', () => {
  it('resolves after specified time', async () => {
    const start = Date.now();
    await sleep(100);
    const duration = Date.now() - start;

    expect(duration).toBeGreaterThanOrEqual(90);
    expect(duration).toBeLessThan(200);
  });

  it('returns undefined', async () => {
    const result = await sleep(10);
    expect(result).toBeUndefined();
  });
});

describe('formatDateISO', () => {
  it('formats Date to ISO date string', () => {
    const date = new Date('2025-01-13T15:30:45.123Z');
    expect(formatDateISO(date)).toBe('2025-01-13');
  });

  it('formats string date to ISO date string', () => {
    expect(formatDateISO('2025-01-13T15:30:45.123Z')).toBe('2025-01-13');
  });

  it('handles different dates', () => {
    const date = new Date('2024-12-25T23:59:59.999Z');
    expect(formatDateISO(date)).toBe('2024-12-25');
  });
});

describe('getTodayISO', () => {
  it('returns today in ISO format', () => {
    const today = getTodayISO();
    const expected = new Date().toISOString().split('T')[0];
    expect(today).toBe(expected);
  });

  it('returns YYYY-MM-DD format', () => {
    const today = getTodayISO();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('getDateDaysAgo', () => {
  it('returns date 1 day ago', () => {
    const yesterday = getDateDaysAgo(1);
    const expected = new Date();
    expected.setDate(expected.getDate() - 1);

    expect(yesterday).toBe(formatDateISO(expected));
  });

  it('returns date 7 days ago', () => {
    const weekAgo = getDateDaysAgo(7);
    const expected = new Date();
    expected.setDate(expected.getDate() - 7);

    expect(weekAgo).toBe(formatDateISO(expected));
  });

  it('handles 0 days (today)', () => {
    const today = getDateDaysAgo(0);
    expect(today).toBe(getTodayISO());
  });
});

describe('isSameDay', () => {
  it('returns true for same dates', () => {
    const date1 = new Date('2025-01-13T09:00:00Z');
    const date2 = new Date('2025-01-13T18:00:00Z');
    expect(isSameDay(date1, date2)).toBe(true);
  });

  it('returns false for different dates', () => {
    const date1 = new Date('2025-01-13T23:59:59Z');
    const date2 = new Date('2025-01-14T00:00:01Z');
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it('works with string dates', () => {
    expect(isSameDay('2025-01-13', '2025-01-13')).toBe(true);
    expect(isSameDay('2025-01-13', '2025-01-14')).toBe(false);
  });

  it('works with mixed Date and string', () => {
    const date = new Date('2025-01-13T00:00:00Z');
    expect(isSameDay(date, '2025-01-13')).toBe(true);
    expect(isSameDay('2025-01-13', date)).toBe(true);
  });
});

describe('formatTime', () => {
  it('formats time in 12-hour format', () => {
    expect(formatTime('09:00')).toBe('9:00 AM');
    expect(formatTime('15:30')).toBe('3:30 PM');
  });

  it('handles midnight correctly', () => {
    expect(formatTime('00:00')).toBe('12:00 AM');
    expect(formatTime('00:30')).toBe('12:30 AM');
  });

  it('handles noon correctly', () => {
    expect(formatTime('12:00')).toBe('12:00 PM');
    expect(formatTime('12:30')).toBe('12:30 PM');
  });

  it('handles edge cases', () => {
    expect(formatTime('23:59')).toBe('11:59 PM');
    expect(formatTime('01:00')).toBe('1:00 AM');
  });
});

describe('getToday', () => {
  it('returns today at start of day', () => {
    const today = getToday();

    expect(today.getHours()).toBe(0);
    expect(today.getMinutes()).toBe(0);
    expect(today.getSeconds()).toBe(0);
    expect(today.getMilliseconds()).toBe(0);
  });

  it('returns Date object', () => {
    const today = getToday();
    expect(today).toBeInstanceOf(Date);
  });
});

describe('getTomorrow', () => {
  it('returns tomorrow at start of day', () => {
    const tomorrow = getTomorrow();
    const today = new Date();

    expect(tomorrow.getDate()).toBe(today.getDate() + 1);
    expect(tomorrow.getHours()).toBe(0);
    expect(tomorrow.getMinutes()).toBe(0);
    expect(tomorrow.getSeconds()).toBe(0);
    expect(tomorrow.getMilliseconds()).toBe(0);
  });

  it('returns Date object', () => {
    const tomorrow = getTomorrow();
    expect(tomorrow).toBeInstanceOf(Date);
  });

  it('handles month boundary', () => {
    const tomorrow = getTomorrow();
    const expected = new Date();
    expected.setDate(expected.getDate() + 1);

    expect(tomorrow.getDate()).toBe(expected.getDate());
    expect(tomorrow.getMonth()).toBe(expected.getMonth());
  });
});
