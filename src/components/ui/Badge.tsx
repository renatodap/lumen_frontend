/**
 * Badge Component - LUMEN Design System
 * @module components/ui/Badge
 */

import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual variant of the badge */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Dot indicator instead of full badge */
  dot?: boolean;
  /** Child elements */
  children?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-petroleum-700 text-foreground border-petroleum-600',
  success: 'bg-success/20 text-success border-success/50',
  error: 'bg-error/20 text-error border-error/50',
  warning: 'bg-warning/20 text-warning border-warning/50',
  info: 'bg-info/20 text-info border-info/50',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-petroleum-500',
  success: 'bg-success',
  error: 'bg-error',
  warning: 'bg-warning',
  info: 'bg-info',
};

/**
 * Badge component for status indicators
 * @example
 * <Badge variant="success" size="md">
 *   Active
 * </Badge>
 * <Badge variant="error" dot />
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', dot = false, className, children, ...props }, ref) => {
    if (dot) {
      return (
        <span
          ref={ref}
          className={cn('inline-flex h-2 w-2 rounded-full', dotStyles[variant], className)}
          role="status"
          aria-label={`${variant} status`}
          {...props}
        />
      );
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full border font-medium',
          'transition-colors duration-200',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        role="status"
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

/**
 * BadgeGroup component for grouping multiple badges
 */
export interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Badge elements */
  children: React.ReactNode;
  /** Gap between badges */
  gap?: 'sm' | 'md' | 'lg';
}

const gapStyles: Record<NonNullable<BadgeGroupProps['gap']>, string> = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-3',
};

export const BadgeGroup = React.forwardRef<HTMLDivElement, BadgeGroupProps>(
  ({ children, gap = 'md', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('inline-flex flex-wrap items-center', gapStyles[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BadgeGroup.displayName = 'BadgeGroup';
