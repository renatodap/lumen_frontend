/**
 * Switch Component - LUMEN Design System
 * @module components/ui/Switch
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text */
  label?: string;
  /** Label position */
  labelPosition?: 'left' | 'right';
  /** Size of the switch */
  size?: 'sm' | 'md' | 'lg';
  /** Error message */
  error?: string;
}

const sizeStyles = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'h-3 w-3',
    translate: 'translate-x-4',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'h-6 w-6',
    translate: 'translate-x-7',
  },
};

/**
 * Toggle switch component
 * @example
 * <Switch
 *   label="Enable notifications"
 *   checked={enabled}
 *   onChange={(e) => setEnabled(e.target.checked)}
 * />
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      labelPosition = 'right',
      size = 'md',
      error,
      className,
      id,
      checked,
      disabled,
      ...props
    },
    ref
  ) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${switchId}-error`;

    const styles = sizeStyles[size];

    const switchElement = (
      <div className="relative inline-flex items-center">
        <input
          ref={ref}
          id={switchId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="sr-only peer"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        <div
          className={cn(
            'relative rounded-full transition-colors duration-200',
            'cursor-pointer',
            'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            checked
              ? 'bg-secondary'
              : error
                ? 'bg-error/20 border border-error'
                : 'bg-input border border-border',
            styles.track,
            className
          )}
        >
          <span
            className={cn(
              'absolute top-1/2 -translate-y-1/2 left-0.5 rounded-full transition-transform duration-200',
              'shadow-sm',
              checked
                ? `${styles.translate} bg-secondary-foreground`
                : 'translate-x-0 bg-muted-foreground',
              styles.thumb
            )}
          />
        </div>
      </div>
    );

    return (
      <div className="flex flex-col gap-1">
        <div className="inline-flex items-center gap-2">
          {label && labelPosition === 'left' && (
            <label
              htmlFor={switchId}
              className="text-sm font-medium text-foreground cursor-pointer select-none"
            >
              {label}
            </label>
          )}
          {switchElement}
          {label && labelPosition === 'right' && (
            <label
              htmlFor={switchId}
              className="text-sm font-medium text-foreground cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
