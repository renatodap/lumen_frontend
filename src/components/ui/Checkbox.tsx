/**
 * Checkbox Component - LUMEN Design System
 * @module components/ui/Checkbox
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Indeterminate state */
  indeterminate?: boolean;
}

/**
 * Custom styled checkbox with accessibility
 * @example
 * <Checkbox
 *   label="Accept terms and conditions"
 *   checked={accepted}
 *   onChange={(e) => setAccepted(e.target.checked)}
 * />
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, indeterminate = false, className, id, checked, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${checkboxId}-error`;

    const checkboxRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => checkboxRef.current!);

    React.useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-2">
          <div className="relative flex items-center">
            <input
              ref={checkboxRef}
              id={checkboxId}
              type="checkbox"
              checked={checked}
              className={cn(
                'peer h-5 w-5 shrink-0 appearance-none rounded border bg-input',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error
                  ? 'border-error'
                  : 'border-border checked:border-secondary checked:bg-secondary',
                className
              )}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              {...props}
            />
            <svg
              className={cn(
                'absolute left-0.5 top-0.5 h-4 w-4 pointer-events-none',
                'text-secondary-foreground opacity-0 peer-checked:opacity-100',
                'transition-opacity duration-200'
              )}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {indeterminate ? (
                <line x1="5" y1="12" x2="19" y2="12" />
              ) : (
                <polyline points="20 6 9 17 4 12" />
              )}
            </svg>
          </div>
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm text-foreground cursor-pointer select-none leading-5"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-error ml-7" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
