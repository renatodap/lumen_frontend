import { Task } from '@/lib/types/task';
import { formatDate, formatRelativeDate } from '@/lib/utils/dateUtils';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface TaskDetailProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskDetail({ task, open, onClose, onEdit, onComplete, onDelete }: TaskDetailProps) {
  if (!task) return null;

  const handleComplete = () => {
    onComplete(task.id);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const handleEdit = () => {
    onEdit(task);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Task Details" variant="bottom-sheet">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">{task.title}</h3>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={
                task.horizon === '2-day'
                  ? 'error'
                  : task.horizon === '7-day'
                    ? 'warning'
                    : 'default'
              }
            >
              {task.horizon.toUpperCase()}
            </Badge>

            {task.due_date && <Badge variant="default">{formatRelativeDate(task.due_date)}</Badge>}
          </div>
        </div>

        {task.due_date && (
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Due Date</p>
            <p className="text-base text-text-primary">{formatDate(task.due_date)}</p>
          </div>
        )}

        {task.notes && (
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Notes</p>
            <p className="text-base text-text-primary whitespace-pre-wrap">{task.notes}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">Created</p>
          <p className="text-base text-text-primary">{formatDate(task.created_at)}</p>
        </div>

        <div className="flex gap-3 pt-4 border-t border-text-muted/20">
          <Button variant="primary" onClick={handleComplete} className="flex-1">
            Complete
          </Button>

          <Button variant="secondary" onClick={handleEdit}>
            Edit
          </Button>

          <Button variant="ghost" onClick={handleDelete} className="text-error hover:bg-error/10">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
