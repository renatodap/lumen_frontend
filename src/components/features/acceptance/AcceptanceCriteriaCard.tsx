import React from 'react';
import { AcceptanceCriterion } from '@/types/acceptance';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface AcceptanceCriteriaCardProps {
  criterion: AcceptanceCriterion;
  checked: boolean;
  onToggle: (criterionId: string, checked: boolean) => void;
  onEdit?: (criterion: AcceptanceCriterion) => void;
  onDelete?: (criterionId: string) => void;
  readonly?: boolean;
  className?: string;
}

export const AcceptanceCriteriaCard: React.FC<AcceptanceCriteriaCardProps> = ({
  criterion,
  checked,
  onToggle,
  onEdit,
  onDelete,
  readonly = false,
  className,
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(criterion.id, e.target.checked);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-md border transition-all',
        checked ? 'border-success bg-success/5' : 'border-border bg-bg-surface',
        className
      )}
    >
      <Checkbox
        checked={checked}
        onChange={handleCheckboxChange}
        disabled={readonly}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn('text-sm text-text-primary', checked && 'line-through text-text-secondary')}
        >
          {criterion.criteriaText}
        </p>
      </div>
      {!readonly && (onEdit || onDelete) && (
        <div className="flex gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(criterion)}
              className="h-6 px-2 text-xs"
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(criterion.id)}
              className="h-6 px-2 text-xs text-error hover:bg-error/10"
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
