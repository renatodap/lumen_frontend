'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { getTomorrow, formatDate } from '@/lib/utils';
import { CalendarEvent } from '@/lib/types';

interface Step2CalendarViewProps {
  userId: string;
  onComplete: (events: CalendarEvent[]) => void;
  initialEvents?: CalendarEvent[];
}

export function Step2CalendarView({
  userId,
  onComplete,
  initialEvents = [],
}: Step2CalendarViewProps) {
  const tomorrowDate = getTomorrow().toISOString().split('T')[0] || '';
  const { events, providers, loading, error, fetchProviders, fetchEvents, connectProvider } =
    useCalendarEvents(userId, tomorrowDate);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleRefresh = () => {
    fetchEvents();
  };

  const handleContinue = () => {
    onComplete(events.length > 0 ? events : initialEvents);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const connectedProviders = providers.filter(p => p.connected);
  const hasConnectedCalendar = connectedProviders.length > 0;

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Tomorrow&apos;s Calendar</h2>
        <p className="text-text-secondary">{formatDate(getTomorrow())}</p>
      </div>

      {!hasConnectedCalendar && (
        <Card>
          <div className="text-center py-8 space-y-4">
            <p className="text-text-primary">Connect your calendar to see events</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="secondary"
                onClick={() => connectProvider('google')}
                disabled={loading}
              >
                Connect Google Calendar
              </Button>
              <Button
                variant="secondary"
                onClick={() => connectProvider('microsoft')}
                disabled={loading}
              >
                Connect Microsoft Calendar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {hasConnectedCalendar && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              Connected: {connectedProviders.map(p => p.provider).join(', ')}
            </p>
            <Button variant="ghost" size="sm" onClick={handleRefresh} loading={loading}>
              Refresh
            </Button>
          </div>

          {error && (
            <Card className="border-warning bg-warning/10">
              <p className="text-sm text-warning">{error}</p>
            </Card>
          )}

          {events.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-text-muted">No events scheduled for tomorrow</p>
                <p className="text-sm text-text-secondary mt-2">You have a free day</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {events.map(event => (
                <Card key={event.id}>
                  <div className="flex items-start gap-3">
                    <div className="w-16 flex-shrink-0">
                      <div className="text-sm font-medium text-accent">
                        {formatTime(event.start)}
                      </div>
                      {!event.allDay && (
                        <div className="text-xs text-text-muted">{formatTime(event.end)}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-text-primary font-medium">{event.title}</h3>
                      {event.allDay && (
                        <span className="text-xs px-2 py-1 rounded bg-bg-hover text-text-secondary mt-1 inline-block">
                          All day
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg-primary border-t border-text-muted">
        <Button onClick={handleContinue} className="w-full" size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}
