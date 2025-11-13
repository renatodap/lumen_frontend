import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from '@/lib/types';
import { storage } from '@/lib/storage';
import { LumenError } from '@/lib/errors';

interface CalendarProvider {
  provider: 'google' | 'microsoft';
  connected: boolean;
}

export function useCalendarEvents(userId: string, date: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [providers, setProviders] = useState<CalendarProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cachedEvents = storage.getCalendarEvents(userId, date);
    if (cachedEvents.length > 0) {
      setEvents(cachedEvents);
    }
  }, [userId, date]);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calendar/providers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new LumenError(
          'Failed to fetch calendar providers',
          'FETCH_PROVIDERS_ERROR',
          'Could not load connected calendars',
          response.status
        );
      }

      const data = await response.json();
      setProviders(data.providers || []);
      setLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof LumenError ? err.userMessage : 'Failed to load calendar providers';
      setError(errorMessage);
      setLoading(false);
      setProviders([]);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/calendar/events?date=${date}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new LumenError(
          'Failed to fetch calendar events',
          'FETCH_EVENTS_ERROR',
          'Could not load calendar events',
          response.status
        );
      }

      const data = await response.json();
      const fetchedEvents: CalendarEvent[] = data.events || [];

      setEvents(fetchedEvents);
      storage.saveCalendarEvents(userId, date, fetchedEvents);
      setLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof LumenError ? err.userMessage : 'Failed to load calendar events';
      setError(errorMessage);
      setLoading(false);

      const cachedEvents = storage.getCalendarEvents(userId, date);
      if (cachedEvents.length > 0) {
        setEvents(cachedEvents);
      }
    }
  }, [userId, date]);

  const connectProvider = useCallback(async (provider: 'google' | 'microsoft') => {
    setLoading(true);
    setError(null);

    try {
      window.location.href = `/api/calendar/connect?provider=${provider}`;
    } catch (err) {
      setError('Failed to connect calendar provider');
      setLoading(false);
    }
  }, []);

  return {
    events,
    providers,
    loading,
    error,
    fetchProviders,
    fetchEvents,
    connectProvider,
  };
}
