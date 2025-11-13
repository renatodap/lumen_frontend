/**
 * Card Component Tests
 */
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';

describe('Card', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders with header', () => {
      render(<Card header={<div>Card Header</div>}>Card content</Card>);
      expect(screen.getByText('Card Header')).toBeInTheDocument();
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders with footer', () => {
      render(<Card footer={<div>Card Footer</div>}>Card content</Card>);
      expect(screen.getByText('Card Footer')).toBeInTheDocument();
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders with both header and footer', () => {
      render(
        <Card header={<div>Header</div>} footer={<div>Footer</div>}>
          Content
        </Card>
      );
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });

  describe('Padding', () => {
    it('has padding by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-4');
    });

    it('has no padding when noPadding is true', () => {
      const { container } = render(<Card noPadding>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass('p-4');
    });

    it('applies padding to content when header is present', () => {
      render(
        <Card header={<div>Header</div>}>
          <div data-testid="content">Content</div>
        </Card>
      );
      const content = screen.getByTestId('content').parentElement;
      expect(content).toHaveClass('p-4');
    });

    it('does not apply padding to content when noPadding and header is present', () => {
      render(
        <Card header={<div>Header</div>} noPadding>
          <div data-testid="content">Content</div>
        </Card>
      );
      const content = screen.getByTestId('content').parentElement;
      expect(content).not.toHaveClass('p-4');
    });
  });

  describe('Styling', () => {
    it('has correct base styling', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-bg-surface', 'border', 'rounded-card');
    });

    it('accepts custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });

    it('header has border separator', () => {
      const { container } = render(
        <Card header={<div data-testid="header">Header</div>}>Content</Card>
      );
      const header = screen.getByTestId('header').parentElement;
      expect(header).toHaveClass('border-b');
    });

    it('footer has border separator', () => {
      const { container } = render(
        <Card footer={<div data-testid="footer">Footer</div>}>Content</Card>
      );
      const footer = screen.getByTestId('footer').parentElement;
      expect(footer).toHaveClass('border-t');
    });
  });

  describe('Custom Props', () => {
    it('forwards ref', () => {
      const ref = { current: null };
      render(<Card ref={ref}>Content</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('accepts data attributes', () => {
      const { container } = render(<Card data-testid="custom-card">Content</Card>);
      expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    });

    it('accepts onClick handler', () => {
      const handleClick = jest.fn();
      const { container } = render(<Card onClick={handleClick}>Content</Card>);
      const card = container.firstChild as HTMLElement;
      card.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('has correct styling', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('mb-3');
  });

  it('accepts custom className', () => {
    const { container } = render(<CardHeader className="custom">Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<CardHeader ref={ref}>Header</CardHeader>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardTitle', () => {
  it('renders children', () => {
    render(<CardTitle>Title text</CardTitle>);
    expect(screen.getByText('Title text')).toBeInTheDocument();
  });

  it('renders as h3 element', () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('has correct styling', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title).toHaveClass('text-lg', 'font-semibold');
  });

  it('accepts custom className', () => {
    const { container } = render(<CardTitle className="custom">Title</CardTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<CardTitle ref={ref}>Title</CardTitle>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });
});

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>Content text</CardContent>);
    expect(screen.getByText('Content text')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(<CardContent className="custom">Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<CardContent ref={ref}>Content</CardContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
