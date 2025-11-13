import React, { useState, useCallback } from 'react';
import { useAcceptanceCriteria } from '@/hooks/useAcceptanceCriteria';
import { useDayCompletion } from '@/hooks/useDayCompletion';
import { useDailyLog } from '@/hooks/useDailyLog';
import { DayType, AcceptanceCriterion } from '@/types/acceptance';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AcceptanceCriteriaCard } from './AcceptanceCriteriaCard';
import { AcceptanceProgress } from './AcceptanceProgress';
import { AcceptanceCriteriaForm } from './AcceptanceCriteriaForm';
import { DayTypeSelector } from './DayTypeSelector';
import { getTodayISO } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface AcceptanceCriteriaProps {
  userId: string;
  initialDayType?: DayType;
  onDayComplete?: () => void;
  className?: string;
}

export const AcceptanceCriteria: React.FC<AcceptanceCriteriaProps> = ({
  userId,
  initialDayType = 'standard',
  onDayComplete,
  className,
}) => {
  const [dayType, setDayType] = useState<DayType>(initialDayType);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<AcceptanceCriterion | null>(null);

  const {
    criteria,
    isLoading: loadingCriteria,
    createCriterion,
    updateCriterion,
    deleteCriterion,
    isCreating,
    isUpdating,
  } = useAcceptanceCriteria(userId, dayType);

  const { completionStatus, isLoading: loadingCompletion } = useDayCompletion(userId, dayType);
  const { saveDailyLog } = useDailyLog();

  const criteriaMet = completionStatus?.dayLog?.criteria_met || [];

  const handleToggleCriterion = useCallback(
    (criterionId: string, checked: boolean) => {
      const newCriteriaMet = checked
        ? [...criteriaMet, criterionId]
        : criteriaMet.filter(id => id !== criterionId);

      saveDailyLog({
        userId,
        date: getTodayISO(),
        goalId: completionStatus?.dayLog?.goal_id || null,
        criteriaMet: newCriteriaMet,
        dayWon: completionStatus?.dayLog?.day_won || false,
        winConditionMet: completionStatus?.dayLog?.win_condition_met || null,
        plannedNextDay: completionStatus?.dayLog?.planned_next_day || false,
      });
    },
    [criteriaMet, completionStatus, saveDailyLog, userId]
  );

  const handleCreateCriterion = (criteriaText: string, selectedDayType: DayType) => {
    const nextIndex = criteria.length;
    createCriterion(
      { criteriaText, dayType: selectedDayType, orderIndex: nextIndex },
      {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      }
    );
  };

  const handleEditCriterion = (criteriaText: string, selectedDayType: DayType) => {
    if (!editingCriterion) return;

    updateCriterion(
      {
        id: editingCriterion.id,
        criteriaText,
        dayType: selectedDayType,
      },
      {
        onSuccess: () => {
          setEditingCriterion(null);
          setIsFormOpen(false);
        },
      }
    );
  };

  const handleEditClick = (criterion: AcceptanceCriterion) => {
    setEditingCriterion(criterion);
    setIsFormOpen(true);
  };

  const handleDeleteCriterion = (criterionId: string) => {
    if (window.confirm('Are you sure you want to delete this criterion?')) {
      deleteCriterion(criterionId);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCriterion(null);
  };

  const isLoading = loadingCriteria || loadingCompletion;

  return (
    <>
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle>Today&apos;s Acceptance Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <DayTypeSelector value={dayType} onChange={setDayType} />

            {completionStatus && (
              <AcceptanceProgress
                total={completionStatus.totalCriteria}
                completed={completionStatus.completedCriteria}
              />
            )}

            {isLoading && (
              <div className="text-center py-8 text-text-secondary">Loading criteria...</div>
            )}

            {!isLoading && criteria.length === 0 && (
              <div className="text-center py-8 space-y-2">
                <p className="text-text-secondary">
                  No criteria set for {dayType.replace('_', ' ')}.
                </p>
                <Button onClick={() => setIsFormOpen(true)} size="sm">
                  Add First Criterion
                </Button>
              </div>
            )}

            {!isLoading && criteria.length > 0 && (
              <div className="space-y-2">
                {criteria.map(criterion => (
                  <AcceptanceCriteriaCard
                    key={criterion.id}
                    criterion={criterion}
                    checked={criteriaMet.includes(criterion.id)}
                    onToggle={handleToggleCriterion}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteCriterion}
                  />
                ))}
              </div>
            )}

            {!isLoading && criteria.length > 0 && (
              <Button variant="secondary" onClick={() => setIsFormOpen(true)} fullWidth>
                Add Another Criterion
              </Button>
            )}

            {completionStatus &&
              !completionStatus.allCriteriaMet &&
              completionStatus.totalCriteria > 0 && (
                <div className="p-3 rounded-md bg-warning/10 border border-warning">
                  <p className="text-sm text-warning font-medium">
                    Complete all criteria to close the day
                  </p>
                </div>
              )}

            {completionStatus?.allCriteriaMet && (
              <div className="p-3 rounded-md bg-success/10 border border-success">
                <p className="text-sm text-success font-medium">
                  All criteria met! You can now close your day.
                </p>
                {onDayComplete && (
                  <Button variant="primary" onClick={onDayComplete} className="mt-2" fullWidth>
                    Close Day
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AcceptanceCriteriaForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={editingCriterion ? handleEditCriterion : handleCreateCriterion}
        editingCriterion={editingCriterion}
        isSubmitting={isCreating || isUpdating}
        defaultDayType={dayType}
      />
    </>
  );
};
