import { forwardRef } from 'react';
import { Task } from '@/lib/types/task';
import { formatRelativeDate } from '@/lib/utils/dateUtils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
  task: Task;
  onEdit: (task: Task) => void;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onEdit, onComplete, onDelete, isDragging, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'cursor-move hover:border-accent/50 transition-all',
          isDragging && 'opacity-50',
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-medium text-text-primary mb-1 truncate">{task.title}</h4>

            {task.due_date && (
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={
                    task.horizon === '2-day'
                      ? 'error'
                      : task.horizon === '7-day'
                        ? 'warning'
                        : 'default'
                  }
                  size="sm"
                >
                  {formatRelativeDate(task.due_date)}
                </Badge>
              </div>
            )}

            {task.notes && <p className="text-sm text-text-secondary line-clamp-2">{task.notes}</p>}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={e => {
                e.stopPropagation();
                onComplete(task.id);
              }}
              className="p-1.5 text-text-secondary hover:text-success transition-colors"
              aria-label="Complete task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>

            <button
              onClick={e => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1.5 text-text-secondary hover:text-accent transition-colors"
              aria-label="Edit task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>

            <button
              onClick={e => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-1.5 text-text-secondary hover:text-error transition-colors"
              aria-label="Delete task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </Card>
    );
  }
);

TaskCard.displayName = 'TaskCard';
