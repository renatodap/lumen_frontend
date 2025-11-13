/**
 * Input Component Tests
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
  describe('Rendering', () => {
    it('renders input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders with different types', () => {
      const { rerender } = render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

      rerender(<Input type="password" />);
      expect(screen.getByRole('textbox', { hidden: true })).toHaveAttribute('type', 'password');

      rerender(<Input type="number" />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
    });

    it('renders with helper text', () => {
      render(<Input helperText="This is a hint" />);
      expect(screen.getByText('This is a hint')).toBeInTheDocument();
    });

    it('renders full width when specified', () => {
      render(<Input fullWidth />);
      expect(screen.getByRole('textbox').closest('div.w-full')).toBeInTheDocument();
    });

    it('renders with left icon', () => {
      render(<Input leftIcon={<span data-testid="left-icon">🔍</span>} />);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders with right icon', () => {
      render(<Input rightIcon={<span data-testid="right-icon">✓</span>} />);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('displays error message', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
    });

    it('has error styling when error is present', () => {
      render(<Input error="Error" />);
      expect(screen.getByRole('textbox')).toHaveClass('border-error');
    });

    it('has aria-invalid when error is present', () => {
      render(<Input error="Error" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('error message has proper id for aria-describedby', () => {
      render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      const errorId = input.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(document.getElementById(errorId as string)).toHaveTextContent('Error message');
    });

    it('shows error instead of helper text', () => {
      render(<Input error="Error" helperText="Helper" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('runs validation function on blur', async () => {
      const validate = jest.fn(value => (value.length < 3 ? 'Too short' : undefined));

      render(<Input validate={validate} />);
      const input = screen.getByRole('textbox');

      await userEvent.type(input, 'ab');
      expect(validate).not.toHaveBeenCalled();

      await userEvent.tab();
      expect(validate).toHaveBeenCalledWith('ab');
      expect(screen.getByRole('alert')).toHaveTextContent('Too short');
    });

    it('updates validation on change after blur', async () => {
      const validate = (value: string) => (value.length < 3 ? 'Too short' : undefined);

      render(<Input validate={validate} />);
      const input = screen.getByRole('textbox');

      await userEvent.type(input, 'ab');
      await userEvent.tab();
      expect(screen.getByRole('alert')).toHaveTextContent('Too short');

      await userEvent.type(input, 'c');
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });

    it('does not show validation error before blur', async () => {
      const validate = () => 'Error';

      render(<Input validate={validate} />);
      const input = screen.getByRole('textbox');

      await userEvent.type(input, 'test');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onChange when typing', async () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      await userEvent.type(screen.getByRole('textbox'), 'hello');
      expect(handleChange).toHaveBeenCalledTimes(5);
    });

    it('calls onBlur when focus is lost', async () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      input.focus();
      await userEvent.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('accepts user input', async () => {
      render(<Input />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await userEvent.type(input, 'test value');
      expect(input.value).toBe('test value');
    });

    it('can be cleared', async () => {
      render(<Input />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await userEvent.type(input, 'test');
      await userEvent.clear(input);
      expect(input.value).toBe('');
    });
  });

  describe('Disabled State', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('has correct styling when disabled', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toHaveClass('disabled:opacity-50');
    });

    it('does not accept input when disabled', async () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await userEvent.type(input, 'test');
      expect(input.value).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('label is connected to input', () => {
      render(<Input label="Username" />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Username');
      expect(input.id).toBe(label.getAttribute('for'));
    });

    it('has aria-describedby for helper text', () => {
      render(<Input helperText="Helper" />);
      const input = screen.getByRole('textbox');
      const helperId = input.getAttribute('aria-describedby');
      expect(helperId).toBeTruthy();
      expect(document.getElementById(helperId as string)).toHaveTextContent('Helper');
    });

    it('supports custom placeholder', () => {
      render(<Input placeholder="Enter text..." />);
      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<Input className="custom-class" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('forwards ref', () => {
      const ref = { current: null };
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('accepts custom id', () => {
      render(<Input id="custom-id" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id');
    });

    it('accepts value prop', () => {
      render(<Input value="controlled value" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('controlled value');
    });
  });
});
