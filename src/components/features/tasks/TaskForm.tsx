import { useState, useEffect } from 'react';
import { Task, TaskFormData } from '@/lib/types/task';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    due_date: null,
    goal_id: null,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        due_date: task.due_date,
        goal_id: task.goal_id,
        notes: task.notes,
      });
    }
  }, [task]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors['title'] = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Task Title"
        value={formData.title}
        onChange={e => setFormData({ ...formData, title: e.target.value })}
        placeholder="Enter task title"
        error={errors['title']}
        disabled={isLoading}
        required
      />

      <Input
        label="Due Date"
        type="date"
        value={formData.due_date || ''}
        onChange={e => setFormData({ ...formData, due_date: e.target.value || null })}
        disabled={isLoading}
      />

      <div>
        <label className="block mb-1 text-sm font-medium text-text-secondary">Notes</label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add notes or details"
          rows={4}
          className="w-full px-3 py-2 rounded border bg-bg-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 border-text-muted/20 focus:ring-accent/50 resize-none"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" className="flex-1" loading={isLoading}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>

        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
