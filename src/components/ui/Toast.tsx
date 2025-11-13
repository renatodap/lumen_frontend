/**
 * Toast Component - LUMEN Design System
 * @module components/ui/Toast
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  /** Toast variant */
  variant?: ToastVariant;
  /** Toast title */
  title?: string;
  /** Toast message */
  message: string;
  /** Duration in milliseconds (0 for persistent) */
  duration?: number;
  /** Callback when toast closes */
  onClose?: () => void;
  /** Show close button */
  showCloseButton?: boolean;
  /** Custom class name */
  className?: string;
}

const variantStyles: Record<ToastVariant, { bg: string; border: string; icon: JSX.Element }> = {
  success: {
    bg: 'bg-success/10 border-success',
    border: 'border-success',
    icon: (
      <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-error/10 border-error',
    border: 'border-error',
    icon: (
      <svg className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
  info: {
    bg: 'bg-info/10 border-info',
    border: 'border-info',
    icon: (
      <svg className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-warning/10 border-warning',
    border: 'border-warning',
    icon: (
      <svg className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
};

/**
 * Toast notification component
 * @example
 * <Toast
 *   variant="success"
 *   title="Success"
 *   message="Operation completed successfully"
 *   duration={3000}
 *   onClose={() => setToast(null)}
 * />
 */
export const Toast: React.FC<ToastProps> = ({
  variant = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  showCloseButton = true,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-md rounded-lg border-l-4 p-4',
        'shadow-lg backdrop-blur-sm transition-all duration-300',
        styles.bg,
        styles.border,
        isVisible ? 'animate-slide-in opacity-100' : 'animate-slide-out opacity-0',
        className
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex-shrink-0">{styles.icon}</div>
      <div className="ml-3 flex-1">
        {title && <p className="text-sm font-semibold text-foreground">{title}</p>}
        <p className={cn('text-sm text-foreground', title && 'mt-1')}>{message}</p>
      </div>
      {showCloseButton && (
        <button
          onClick={handleClose}
          className={cn(
            'ml-4 inline-flex flex-shrink-0 rounded-md p-1.5',
            'text-muted-foreground hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'transition-colors'
          )}
          aria-label="Close notification"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

Toast.displayName = 'Toast';

/**
 * ToastContainer component for managing multiple toasts
 */
export interface ToastContainerProps {
  /** Position of toast container */
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
  /** Children (Toast components) */
  children: React.ReactNode;
}

const positionStyles: Record<NonNullable<ToastContainerProps['position']>, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  children,
}) => {
  return (
    <div
      className={cn('fixed z-50 flex flex-col gap-2 pointer-events-none', positionStyles[position])}
      aria-label="Notifications"
    >
      {children}
    </div>
  );
};

ToastContainer.displayName = 'ToastContainer';
