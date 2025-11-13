/**
 * DatePicker Component - LUMEN Design System
 * @module components/ui/DatePicker
 */

import React, { useState } from 'react';
import { cn, formatDate } from '../../lib/utils';
import { Modal } from './Modal';

export type DatePickerVariant = 'inline' | 'modal';

export interface DatePickerProps {
  /** Selected date */
  value?: Date;
  /** Callback when date changes */
  onChange: (date: Date) => void;
  /** DatePicker variant */
  variant?: DatePickerVariant;
  /** Label text */
  label?: string;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Disabled state */
  disabled?: boolean;
  /** Error message */
  error?: string;
  /** Custom class name */
  className?: string;
}

/**
 * DatePicker component with inline and modal variants
 * @example
 * <DatePicker
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 *   variant="modal"
 *   label="Select date"
 * />
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  variant = 'inline',
  label,
  minDate,
  maxDate,
  disabled = false,
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (minDate && newDate < minDate) return;
    if (maxDate && newDate > maxDate) return;

    onChange(newDate);
    if (variant === 'modal') {
      setIsOpen(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (day: number): boolean => {
    if (!value) return false;
    return (
      value.getDate() === day &&
      value.getMonth() === currentMonth.getMonth() &&
      value.getFullYear() === currentMonth.getFullYear()
    );
  };

  const calendar = (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-petroleum-700 rounded transition-colors"
          aria-label="Previous month"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="text-base font-semibold">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-petroleum-700 rounded transition-colors"
          aria-label="Next month"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isDisabled = isDateDisabled(day);
          const isSelected = isDateSelected(day);

          return (
            <button
              key={day}
              onClick={() => !isDisabled && handleDateClick(day)}
              disabled={isDisabled}
              className={cn(
                'aspect-square p-2 text-sm rounded transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isSelected
                  ? 'bg-secondary text-secondary-foreground font-semibold'
                  : 'hover:bg-petroleum-700',
                isDisabled && 'opacity-30 cursor-not-allowed hover:bg-transparent'
              )}
              aria-label={`Select ${day}`}
              aria-pressed={isSelected}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (variant === 'modal') {
    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && <label className="text-sm font-medium text-foreground">{label}</label>}
        <button
          onClick={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2 text-left rounded-md border bg-input',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-error' : 'border-border'
          )}
        >
          {value ? formatDate(value) : 'Select date'}
        </button>
        {error && <p className="text-xs text-error">{error}</p>}
        <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Select Date">
          {calendar}
        </Modal>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      {calendar}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
};

DatePicker.displayName = 'DatePicker';
