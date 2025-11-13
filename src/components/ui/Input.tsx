/**
 * Input Component - LUMEN Design System
 * @module components/ui/Input
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export type InputType = 'text' | 'email' | 'number' | 'password' | 'tel' | 'url' | 'date';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Input type */
  type?: InputType;
  /** Label text */
  label?: string;
  /** Error message */
  error?: string | undefined;
  /** Helper text */
  helperText?: string;
  /** Icon to display before input */
  leftIcon?: React.ReactNode;
  /** Icon to display after input */
  rightIcon?: React.ReactNode;
  /** Full width input */
  fullWidth?: boolean;
  /** Custom validation function */
  validate?: (value: string) => string | undefined;
}

/**
 * Input component with validation and accessibility
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={error}
 *   onChange={handleChange}
 * />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      validate,
      className,
      id,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [internalError, setInternalError] = useState<string | undefined>();
    const [touched, setTouched] = useState(false);

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const displayError = error || (touched ? internalError : undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (validate && touched) {
        const validationError = validate(e.target.value);
        setInternalError(validationError);
      }
      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      if (validate) {
        const validationError = validate(e.target.value);
        setInternalError(validationError);
      }
      onBlur?.(e);
    };

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full rounded-md border bg-input px-3 py-2 text-sm text-foreground',
              'placeholder:text-muted-foreground',
              'transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              displayError
                ? 'border-error focus-visible:ring-error'
                : 'border-border focus-visible:ring-ring',
              className
            )}
            aria-invalid={!!displayError}
            aria-describedby={displayError ? errorId : helperText ? helperId : undefined}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {displayError && (
          <p id={errorId} className="text-xs text-error" role="alert">
            {displayError}
          </p>
        )}
        {!displayError && helperText && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
