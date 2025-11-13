'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Task } from '@/lib/types';
import { storage } from '@/lib/storage';

interface Step1ReviewInboxProps {
  userId: string;
  onComplete: (reviewedItems: string[]) => void;
  initialReviewedItems?: string[];
}

export function Step1ReviewInbox({
  userId,
  onComplete,
  initialReviewedItems = [],
}: Step1ReviewInboxProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reviewedItems, setReviewedItems] = useState<Set<string>>(new Set(initialReviewedItems));

  useEffect(() => {
    const allTasks = storage.getTasks(userId);
    const incompleteTasks = allTasks.filter(task => !task.completed);
    setTasks(incompleteTasks);
  }, [userId]);

  const toggleReview = (taskId: string) => {
    setReviewedItems(prev => {
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
    onComplete(Array.from(reviewedItems));
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Review Your Inbox</h2>
        <p className="text-text-secondary">
          Check off items you have reviewed and want to consider for tomorrow
        </p>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-text-muted">No captured items to review</p>
            <p className="text-sm text-text-secondary mt-2">Your inbox is empty</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <Card
              key={task.id}
              className="cursor-pointer hover:bg-bg-hover transition-colors"
              onClick={() => toggleReview(task.id)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={reviewedItems.has(task.id)}
                  onChange={() => toggleReview(task.id)}
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
                    {task.dueDate && (
                      <span className="text-xs text-text-muted">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg-primary border-t border-text-muted">
        <Button onClick={handleContinue} className="w-full" size="lg">
          Continue ({reviewedItems.size} reviewed)
        </Button>
      </div>
    </div>
  );
}
