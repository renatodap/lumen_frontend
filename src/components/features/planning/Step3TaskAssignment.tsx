'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Task, CalendarEvent } from '@/lib/types';
import { storage } from '@/lib/storage';

interface Step3TaskAssignmentProps {
  userId: string;
  reviewedItems: string[];
  calendarEvents: CalendarEvent[];
  onComplete: (assignedTasks: string[]) => void;
  initialAssignedTasks?: string[];
}

export function Step3TaskAssignment({
  userId,
  reviewedItems,
  calendarEvents,
  onComplete,
  initialAssignedTasks = [],
}: Step3TaskAssignmentProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Set<string>>(new Set(initialAssignedTasks));

  useEffect(() => {
    const allTasks = storage.getTasks(userId);
    const reviewedTaskList = allTasks.filter(task => reviewedItems.includes(task.id));
    setTasks(reviewedTaskList);
  }, [userId, reviewedItems]);

  const toggleAssignment = (taskId: string) => {
    setAssignedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleContinue = () => {
    onComplete(Array.from(assignedTasks));
  };

  const estimateFreeTime = () => {
    const totalMinutesInDay = 16 * 60;
    const busyMinutes = calendarEvents.reduce((total, event) => {
      if (event.allDay) return total + 480;
      const start = new Date(event.start);
      const end = new Date(event.end);
      return total + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);
    const freeHours = Math.floor((totalMinutesInDay - busyMinutes) / 60);
    return Math.max(0, freeHours);
  };

  const freeHours = estimateFreeTime();

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Assign Tasks to Tomorrow</h2>
        <p className="text-text-secondary">Select tasks you want to complete tomorrow</p>
      </div>

      <Card className="bg-accent/10 border-accent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">Estimated free time</p>
            <p className="text-2xl font-semibold text-accent">{freeHours}h</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Tasks assigned</p>
            <p className="text-2xl font-semibold text-text-primary">{assignedTasks.size}</p>
          </div>
        </div>
      </Card>

      {tasks.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-text-muted">No reviewed items to assign</p>
            <p className="text-sm text-text-secondary mt-2">Go back to review items first</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <Card
              key={task.id}
              className="cursor-pointer hover:bg-bg-hover transition-colors"
              onClick={() => toggleAssignment(task.id)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={assignedTasks.has(task.id)}
                  onChange={() => toggleAssignment(task.id)}
                  onClick={e => e.stopPropagation()}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-text-primary font-medium">{task.title}</h3>
                  {task.notes && (
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{task.notes}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded bg-bg-hover text-text-secondary">
                      {task.horizon}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg-primary border-t border-text-muted">
        <Button
          onClick={handleContinue}
          className="w-full"
          size="lg"
          disabled={assignedTasks.size === 0}
        >
          Continue ({assignedTasks.size} assigned)
        </Button>
      </div>
    </div>
  );
}
