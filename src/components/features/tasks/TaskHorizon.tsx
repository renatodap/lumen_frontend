import { useState } from 'react';
import { useTasks } from '@/lib/hooks/useTasks';
import { useTaskHorizon } from '@/lib/hooks/useTaskHorizon';
import { Task, TaskHorizon as THorizonType } from '@/lib/types/task';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskDetail } from './TaskDetail';
import { EmptyFutureBlock } from './EmptyFutureBlock';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

const HORIZON_LABELS: Record<THorizonType, string> = {
  '2-day': '2-Day',
  '7-day': '7-Day',
  future: 'Future',
};

const HORIZON_DESCRIPTIONS: Record<THorizonType, string> = {
  '2-day': 'Due within 2 days',
  '7-day': 'Due within a week',
  future: 'Beyond 7 days',
};

export function TaskHorizon() {
  const { tasks, isLoading, createTask, updateTask, deleteTask, completeTask } = useTasks();
  const { buckets, has2DayTasks, getHorizonStatus } = useTaskHorizon(tasks);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleCreateTask = async (data: any) => {
    try {
      await createTask.mutateAsync(data);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!editingTask) return;

    try {
      await updateTask.mutateAsync({
        id: editingTask.id,
        updates: data,
      });
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleComplete = async (taskId: string) => {
    try {
      await completeTask.mutateAsync(taskId);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask.mutateAsync(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleCardClick = (task: Task) => {
    setDetailTask(task);
    setIsDetailOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const renderHorizonColumn = (horizon: THorizonType) => {
    const status = getHorizonStatus(horizon);
    const tasksInHorizon = buckets[horizon];

    return (
      <div className="flex-1 min-w-[280px]">
        <Card>
          <CardHeader>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle>{HORIZON_LABELS[horizon]}</CardTitle>
                {status.count > 0 && (
                  <Badge variant={status.warning ? 'error' : 'default'} size="sm">
                    {status.count}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-text-secondary">{HORIZON_DESCRIPTIONS[horizon]}</p>
            </div>
          </CardHeader>

          <CardContent>
            {horizon === 'future' && status.blocked ? (
              <EmptyFutureBlock />
            ) : tasksInHorizon.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                <p className="text-sm">No tasks in this bucket</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasksInHorizon.map(task => (
                  <div key={task.id} onClick={() => handleCardClick(task)}>
                    <TaskCard
                      task={task}
                      onEdit={handleEdit}
                      onComplete={handleComplete}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-text-secondary">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Task Horizon</h1>
          <p className="text-sm text-text-secondary">
            Organize tasks by urgency.{' '}
            {has2DayTasks && (
              <span className="text-error font-medium">
                Clear 2-day bucket to add future tasks.
              </span>
            )}
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsFormOpen(true)}>
          + New Task
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {renderHorizonColumn('2-day')}
        {renderHorizonColumn('7-day')}
        {renderHorizonColumn('future')}
      </div>

      <Modal
        open={isFormOpen}
        onClose={handleCloseForm}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        variant="bottom-sheet"
      >
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCloseForm}
          isLoading={createTask.isPending || updateTask.isPending}
        />
      </Modal>

      <TaskDetail
        task={detailTask}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEdit}
        onComplete={handleComplete}
        onDelete={handleDelete}
      />
    </div>
  );
}
