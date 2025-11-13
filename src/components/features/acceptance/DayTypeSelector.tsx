import React from 'react';
import { DayType } from '@/types/acceptance';
import { cn } from '@/lib/utils';

export interface DayTypeSelectorProps {
  value: DayType;
  onChange: (dayType: DayType) => void;
  className?: string;
}

const DAY_TYPES: { value: DayType; label: string; description: string }[] = [
  {
    value: 'standard',
    label: 'Standard Day',
    description: 'Regular daily routine',
  },
  {
    value: 'laundry_day',
    label: 'Laundry Day',
    description: 'Includes laundry tasks',
  },
  {
    value: 'gym_day',
    label: 'Gym Day',
    description: 'Includes workout routine',
  },
];

export const DayTypeSelector: React.FC<DayTypeSelectorProps> = ({ value, onChange, className }) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-sm font-medium text-text-primary">Day Type</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {DAY_TYPES.map(dayType => (
          <button
            key={dayType.value}
            type="button"
            onClick={() => onChange(dayType.value)}
            className={cn(
              'flex flex-col items-start p-3 rounded-md border transition-all',
              'hover:border-accent focus:outline-none focus:ring-2 focus:ring-ring',
              value === dayType.value ? 'border-accent bg-accent/10' : 'border-border bg-bg-surface'
            )}
          >
            <span className="font-medium text-text-primary">{dayType.label}</span>
            <span className="text-xs text-text-secondary mt-1">{dayType.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
