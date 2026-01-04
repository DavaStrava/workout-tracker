import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('should render children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should apply primary variant styles by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByText('Primary');

    expect(button).toHaveClass('btn-spotify');
    expect(button).toHaveStyle({ background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' });
  });

  it('should apply gradient variant styles', () => {
    render(<Button variant="gradient">Gradient</Button>);
    const button = screen.getByText('Gradient');

    expect(button).toHaveStyle({ background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #a855f7 100%)' });
  });

  it('should apply secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');

    expect(button).toHaveStyle({
      background: 'rgba(255, 255, 255, 0.1)'
    });
    expect(button.style.border).toContain('1px solid');
  });

  it('should apply ghost variant styles', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByText('Ghost');

    expect(button).toHaveStyle({
      background: 'transparent',
      color: 'rgba(255, 255, 255, 0.7)'
    });
  });

  it('should apply small size styles', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByText('Small');

    expect(button).toHaveStyle({
      height: '36px',
      padding: '0 16px',
      fontSize: '14px'
    });
  });

  it('should apply medium size styles', () => {
    render(<Button size="md">Medium</Button>);
    const button = screen.getByText('Medium');

    expect(button).toHaveStyle({
      height: '48px',
      padding: '0 24px',
      fontSize: '16px'
    });
  });

  it('should apply large size styles', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByText('Large');

    expect(button).toHaveStyle({
      height: '56px',
      padding: '0 32px',
      fontSize: '18px'
    });
  });

  it('should apply xl size styles', () => {
    render(<Button size="xl">Extra Large</Button>);
    const button = screen.getByText('Extra Large');

    expect(button).toHaveStyle({
      height: '64px',
      padding: '0 40px',
      fontSize: '20px'
    });
  });

  it('should apply icon size styles', () => {
    render(<Button size="icon">🔥</Button>);
    const button = screen.getByText('🔥');

    expect(button).toHaveStyle({
      height: '48px',
      width: '48px',
      padding: '0'
    });
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should show loading spinner when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);

    // Check for spinner div
    const button = screen.getByText('Loading');
    const spinner = button.querySelector('div[style*="animation"]');

    expect(spinner).toBeInTheDocument();
  });

  it('should be disabled when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);

    expect(screen.getByText('Loading')).toBeDisabled();
  });

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick} isLoading>Disabled</Button>);

    await user.click(screen.getByText('Disabled'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should merge custom className', () => {
    render(<Button className="custom-class">Custom</Button>);

    expect(screen.getByText('Custom')).toHaveClass('btn-spotify', 'custom-class');
  });

  it('should merge custom styles', () => {
    render(<Button style={{ margin: '10px' }}>Custom Style</Button>);
    const button = screen.getByText('Custom Style');

    expect(button).toHaveStyle({ margin: '10px' });
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();

    render(<Button ref={ref}>Ref Test</Button>);

    expect(ref).toHaveBeenCalled();
  });

  it('should pass additional props to button element', () => {
    render(<Button data-testid="custom-button" aria-label="Custom Button">Test</Button>);

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom Button');
  });
});
