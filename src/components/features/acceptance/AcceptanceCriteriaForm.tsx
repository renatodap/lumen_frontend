import React, { useState, useEffect } from 'react';
import { AcceptanceCriterion, DayType } from '@/types/acceptance';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DayTypeSelector } from './DayTypeSelector';

export interface AcceptanceCriteriaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (criteriaText: string, dayType: DayType) => void;
  editingCriterion?: AcceptanceCriterion | null;
  isSubmitting?: boolean;
  defaultDayType?: DayType;
}

export const AcceptanceCriteriaForm: React.FC<AcceptanceCriteriaFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCriterion,
  isSubmitting = false,
  defaultDayType = 'standard',
}) => {
  const [criteriaText, setCriteriaText] = useState('');
  const [dayType, setDayType] = useState<DayType>(defaultDayType);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingCriterion) {
      setCriteriaText(editingCriterion.criteriaText);
      setDayType(editingCriterion.dayType);
    } else {
      setCriteriaText('');
      setDayType(defaultDayType);
    }
    setError('');
  }, [editingCriterion, isOpen, defaultDayType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!criteriaText.trim()) {
      setError('Criteria text is required');
      return;
    }

    onSubmit(criteriaText.trim(), dayType);
  };

  const handleClose = () => {
    setCriteriaText('');
    setDayType(defaultDayType);
    setError('');
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={editingCriterion ? 'Edit Criterion' : 'Add Criterion'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Criteria Text"
          value={criteriaText}
          onChange={e => {
            setCriteriaText(e.target.value);
            setError('');
          }}
          placeholder="e.g., Complete morning workout"
          error={error}
          autoFocus
        />

        <DayTypeSelector value={dayType} onChange={setDayType} />

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
            fullWidth
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting} fullWidth>
            {editingCriterion ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
