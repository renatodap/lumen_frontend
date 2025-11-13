/**
 * Checkbox Component Tests
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('renders checkbox input', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('label is clickable', async () => {
      const handleChange = jest.fn();
      render(<Checkbox label="Click label" onChange={handleChange} />);

      await userEvent.click(screen.getByText('Click label'));
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Checked State', () => {
    it('can be checked', async () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('can be unchecked', async () => {
      render(<Checkbox checked onChange={() => {}} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      await userEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('is controlled by checked prop', () => {
      const { rerender } = render(<Checkbox checked={true} onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).toBeChecked();

      rerender(<Checkbox checked={false} onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  describe('Indeterminate State', () => {
    it('supports indeterminate state', () => {
      render(<Checkbox indeterminate />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    it('shows different icon when indeterminate', () => {
      const { container } = render(<Checkbox indeterminate />);
      const svg = container.querySelector('svg line');
      expect(svg).toBeInTheDocument();
    });

    it('updates indeterminate state dynamically', () => {
      const { rerender } = render(<Checkbox indeterminate={false} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(false);

      rerender(<Checkbox indeterminate={true} />);
      expect(checkbox.indeterminate).toBe(true);
    });
  });

  describe('Error State', () => {
    it('displays error message', () => {
      render(<Checkbox error="This field is required" />);
      expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
    });

    it('has error styling when error is present', () => {
      render(<Checkbox error="Error" />);
      expect(screen.getByRole('checkbox')).toHaveClass('border-error');
    });

    it('has aria-invalid when error is present', () => {
      render(<Checkbox error="Error" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('error message has proper id for aria-describedby', () => {
      render(<Checkbox error="Error message" />);
      const checkbox = screen.getByRole('checkbox');
      const errorId = checkbox.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(document.getElementById(errorId as string)).toHaveTextContent('Error message');
    });
  });

  describe('Disabled State', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Checkbox disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('has correct styling when disabled', () => {
      render(<Checkbox disabled />);
      expect(screen.getByRole('checkbox')).toHaveClass('disabled:opacity-50');
    });

    it('does not change state when disabled and clicked', async () => {
      const handleChange = jest.fn();
      render(<Checkbox disabled onChange={handleChange} />);

      await userEvent.click(screen.getByRole('checkbox'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('calls onChange when clicked', async () => {
      const handleChange = jest.fn();
      render(<Checkbox onChange={handleChange} />);

      await userEvent.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('can be toggled multiple times', async () => {
      const handleChange = jest.fn();
      render(<Checkbox onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await userEvent.click(checkbox);
      await userEvent.click(checkbox);
      await userEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it('can be triggered with Space key', async () => {
      const handleChange = jest.fn();
      render(<Checkbox onChange={handleChange} />);

      screen.getByRole('checkbox').focus();
      await userEvent.keyboard(' ');
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('can be focused', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      expect(checkbox).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('label is connected to checkbox', () => {
      render(<Checkbox label="Accept" />);
      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText('Accept');
      expect(checkbox.id).toBe(label.getAttribute('for'));
    });

    it('has focus-visible styling', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toHaveClass('focus-visible:outline-none');
    });

    it('supports custom aria-label', () => {
      render(<Checkbox aria-label="Custom label" />);
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<Checkbox className="custom-class" />);
      expect(screen.getByRole('checkbox')).toHaveClass('custom-class');
    });

    it('forwards ref', () => {
      const ref = { current: null };
      render(<Checkbox ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('accepts custom id', () => {
      render(<Checkbox id="custom-id" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'custom-id');
    });

    it('accepts data attributes', () => {
      render(<Checkbox data-testid="custom-checkbox" />);
      expect(screen.getByTestId('custom-checkbox')).toBeInTheDocument();
    });
  });
});
