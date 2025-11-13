/**
 * Modal Component - LUMEN Design System
 * @module components/ui/Modal
 */

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ModalVariant = 'fullscreen' | 'bottom-sheet' | 'center';

export interface ModalProps {
  /** Modal open state */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal variant */
  variant?: ModalVariant;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Close on backdrop click */
  closeOnBackdrop?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Modal component with fullscreen and bottom-sheet variants
 * @example
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   variant="bottom-sheet"
 *   title="Modal Title"
 * >
 *   Modal content
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  variant = 'center',
  title,
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  const variantStyles: Record<ModalVariant, string> = {
    fullscreen: 'inset-0 rounded-none',
    'bottom-sheet': 'bottom-0 left-0 right-0 rounded-t-2xl max-h-[90vh] animate-slide-in',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-w-md w-full mx-4',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="fixed inset-0 bg-petroleum-900/80 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div
        className={cn(
          'fixed bg-petroleum-800 border border-border shadow-lg',
          'flex flex-col overflow-hidden',
          variantStyles[variant],
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-foreground">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'text-muted-foreground hover:text-foreground transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  'rounded p-1',
                  !title && 'ml-auto'
                )}
                aria-label="Close modal"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';
