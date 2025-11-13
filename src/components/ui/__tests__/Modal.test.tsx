/**
 * Modal Component Tests
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';

describe('Modal', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = 'unset';
  });

  describe('Rendering', () => {
    it('renders when open is true', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when open is false', () => {
      render(<Modal {...defaultProps} open={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders with title', () => {
      render(<Modal {...defaultProps} title="Modal Title" />);
      expect(screen.getByText('Modal Title')).toBeInTheDocument();
    });

    it('title has correct id for aria-labelledby', () => {
      render(<Modal {...defaultProps} title="Modal Title" />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(document.getElementById('modal-title')).toHaveTextContent('Modal Title');
    });

    it('renders close button by default', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('hides close button when showCloseButton is false', () => {
      render(<Modal {...defaultProps} showCloseButton={false} />);
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders center variant by default', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const modal = container.querySelector('.fixed.bg-petroleum-800');
      expect(modal).toHaveClass('-translate-x-1/2', '-translate-y-1/2');
    });

    it('renders fullscreen variant', () => {
      const { container } = render(<Modal {...defaultProps} variant="fullscreen" />);
      const modal = container.querySelector('.fixed.bg-petroleum-800');
      expect(modal).toHaveClass('inset-0', 'rounded-none');
    });

    it('renders bottom-sheet variant', () => {
      const { container } = render(<Modal {...defaultProps} variant="bottom-sheet" />);
      const modal = container.querySelector('.fixed.bg-petroleum-800');
      expect(modal).toHaveClass('bottom-0', 'rounded-t-2xl');
    });
  });

  describe('Backdrop Interaction', () => {
    it('closes on backdrop click by default', async () => {
      const onClose = jest.fn();
      const { container } = render(<Modal {...defaultProps} onClose={onClose} />);

      const backdrop = container.querySelector('.fixed.bg-petroleum-900\\/80');
      await userEvent.click(backdrop as HTMLElement);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on backdrop click when closeOnBackdrop is false', async () => {
      const onClose = jest.fn();
      const { container } = render(
        <Modal {...defaultProps} onClose={onClose} closeOnBackdrop={false} />
      );

      const backdrop = container.querySelector('.fixed.bg-petroleum-900\\/80');
      await userEvent.click(backdrop as HTMLElement);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not close when clicking modal content', async () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      await userEvent.click(screen.getByText('Modal content'));
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Interaction', () => {
    it('closes on Escape key by default', async () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      await userEvent.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on Escape when closeOnEscape is false', async () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} closeOnEscape={false} />);

      await userEvent.keyboard('{Escape}');
      expect(onClose).not.toHaveBeenCalled();
    });

    it('closes when close button is clicked', async () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      await userEvent.click(screen.getByLabelText('Close modal'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Body Scroll Lock', () => {
    it('locks body scroll when open', () => {
      render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when closed', async () => {
      const { rerender } = render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');

      rerender(<Modal {...defaultProps} open={false} />);
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('unset');
      });
    });

    it('restores body scroll on unmount', () => {
      const { unmount } = render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');

      unmount();
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal attribute', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('backdrop has aria-hidden', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const backdrop = container.querySelector('.fixed.bg-petroleum-900\\/80');
      expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    });

    it('close button has proper aria-label', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      const { container } = render(<Modal {...defaultProps} className="custom-class" />);
      const modal = container.querySelector('.custom-class');
      expect(modal).toBeInTheDocument();
    });

    it('renders complex children', () => {
      render(
        <Modal {...defaultProps}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Modal>
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
  });
});
