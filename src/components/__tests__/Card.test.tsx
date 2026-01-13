import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('should render children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('should apply glass variant styles by default', () => {
    render(<Card>Glass Card</Card>);
    const card = screen.getByText('Glass Card');

    expect(card).toHaveClass('card-spotify');
    expect(card).toHaveStyle({
      background: 'rgba(30, 27, 50, 0.8)'
    });
  });

  it('should apply default variant styles', () => {
    render(<Card variant="default">Default Card</Card>);
    const card = screen.getByText('Default Card');

    expect(card).toHaveStyle({
      background: 'rgba(30, 27, 50, 0.8)'
    });
  });

  it('should apply outline variant styles', () => {
    render(<Card variant="outline">Outline Card</Card>);
    const card = screen.getByText('Outline Card');

    expect(card).toHaveStyle({
      background: 'transparent'
    });
  });

  it('should apply elevated variant styles', () => {
    render(<Card variant="elevated">Elevated Card</Card>);
    const card = screen.getByText('Elevated Card');

    expect(card).toHaveStyle({
      background: 'rgba(30, 27, 50, 0.9)'
    });
  });

  it('should apply floating variant styles', () => {
    render(<Card variant="floating">Floating Card</Card>);
    const card = screen.getByText('Floating Card');

    expect(card).toHaveStyle({
      background: 'rgba(30, 27, 50, 0.9)'
    });
  });

  it('should apply gradient variant with orange-pink gradient', () => {
    render(<Card variant="gradient" gradient="orange-pink">Gradient Card</Card>);
    const card = screen.getByText('Gradient Card');

    expect(card).toHaveStyle({
      background: 'rgba(30, 27, 50, 0.8)'
    });
    // Check for the gradient border color
    expect(card.style.border).toContain('rgba(249, 115, 22, 0.3)');
  });

  it('should apply gradient variant with pink-purple gradient', () => {
    render(<Card variant="gradient" gradient="pink-purple">Pink Purple</Card>);
    const card = screen.getByText('Pink Purple');

    expect(card).toHaveStyle({
      background: 'rgba(30, 27, 50, 0.8)'
    });
    expect(card.style.border).toContain('rgba(236, 72, 153, 0.3)');
  });

  it('should apply base styles to all variants', () => {
    render(<Card>Test Card</Card>);
    const card = screen.getByText('Test Card');

    expect(card).toHaveStyle({
      borderRadius: '24px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    });
  });

  it('should merge custom className', () => {
    render(<Card className="custom-class">Custom Class</Card>);

    expect(screen.getByText('Custom Class')).toHaveClass('card-spotify', 'custom-class');
  });

  it('should merge custom styles', () => {
    render(<Card style={{ margin: '20px' }}>Custom Style</Card>);
    const card = screen.getByText('Custom Style');

    expect(card).toHaveStyle({ margin: '20px' });
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();

    render(<Card ref={ref}>Ref Test</Card>);

    expect(ref).toHaveBeenCalled();
  });

  it('should accept onClick and other props', () => {
    const handleClick = vi.fn();

    render(<Card onClick={handleClick} data-testid="clickable-card">Clickable</Card>);

    const card = screen.getByTestId('clickable-card');
    card.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
