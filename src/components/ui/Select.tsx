/**
 * Select Component - LUMEN Design System
 * @module components/ui/Select
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  /** Option value */
  value: string;
  /** Option label */
  label: string;
  /** Disabled state */
  disabled?: boolean;
}

export interface SelectProps {
  /** Select options */
  options: SelectOption[];
  /** Selected value */
  value?: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Label text */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Full width select */
  fullWidth?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Custom dropdown select component
 * @example
 * <Select
 *   options={[
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' },
 *   ]}
 *   value={selectedValue}
 *   onChange={setSelectedValue}
 *   label="Choose an option"
 * />
 */
export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  error,
  disabled = false,
  fullWidth = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = options.findIndex(opt => opt.value === value);
          const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          const nextOption = options[nextIndex];
          if (nextOption) onChange(nextOption.value);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          const currentIndex = options.findIndex(opt => opt.value === value);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          const prevOption = options[prevIndex];
          if (prevOption) onChange(prevOption.value);
        }
        break;
    }
  };

  return (
    <div
      className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', className)}
      ref={containerRef}
    >
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2 text-left rounded-md border bg-input',
            'flex items-center justify-between gap-2',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-error' : 'border-border'
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={cn('text-sm', !selectedOption && 'text-muted-foreground')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {isOpen && (
          <div
            className={cn(
              'absolute z-50 w-full mt-1 rounded-md border border-border',
              'bg-petroleum-800 shadow-lg max-h-60 overflow-auto',
              'animate-fade-in'
            )}
            role="listbox"
          >
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:bg-petroleum-700',
                  option.value === value
                    ? 'bg-petroleum-700 text-foreground font-medium'
                    : 'text-foreground hover:bg-petroleum-700',
                  option.disabled && 'opacity-50 cursor-not-allowed'
                )}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
};

Select.displayName = 'Select';
