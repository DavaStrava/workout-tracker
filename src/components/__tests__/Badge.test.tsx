import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, StatCard } from '../Badge';
import { Dumbbell } from 'lucide-react';

describe('Badge', () => {
  it('should render children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('should apply gradient variant with orange color by default', () => {
    render(<Badge>Orange Badge</Badge>);
    const badge = screen.getByText('Orange Badge');

    expect(badge).toHaveStyle({
      background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)'
    });
  });

  it('should apply gradient variant with pink color', () => {
    render(<Badge variant="gradient" color="pink">Pink Badge</Badge>);
    const badge = screen.getByText('Pink Badge');

    expect(badge).toHaveStyle({
      background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
    });
  });

  it('should apply solid variant', () => {
    render(<Badge variant="solid" color="purple">Solid Purple</Badge>);
    const badge = screen.getByText('Solid Purple');

    expect(badge).toHaveStyle({
      background: '#a855f7',
      color: '#fff'
    });
  });

  it('should apply outline variant', () => {
    render(<Badge variant="outline" color="cyan">Outline Cyan</Badge>);
    const badge = screen.getByText('Outline Cyan');

    expect(badge).toHaveStyle({
      color: '#06b6d4'
    });
    // Check border separately as it may be computed
    expect(badge.style.border).toContain('2px solid');
  });

  it('should apply glow variant', () => {
    render(<Badge variant="glow" color="green">Glow Green</Badge>);
    const badge = screen.getByText('Glow Green');

    expect(badge).toHaveStyle({
      color: '#10b981'
    });
  });

  it('should apply small size', () => {
    render(<Badge size="sm">Small</Badge>);
    const badge = screen.getByText('Small');

    expect(badge).toHaveStyle({
      padding: '4px 10px',
      fontSize: '12px'
    });
  });

  it('should apply medium size by default', () => {
    render(<Badge size="md">Medium</Badge>);
    const badge = screen.getByText('Medium');

    expect(badge).toHaveStyle({
      padding: '6px 16px',
      fontSize: '14px'
    });
  });

  it('should apply large size', () => {
    render(<Badge size="lg">Large</Badge>);
    const badge = screen.getByText('Large');

    expect(badge).toHaveStyle({
      padding: '8px 24px',
      fontSize: '16px'
    });
  });

  it('should apply base styles', () => {
    render(<Badge>Base Styles</Badge>);
    const badge = screen.getByText('Base Styles');

    expect(badge).toHaveStyle({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      borderRadius: '9999px'
    });
  });

  it('should merge custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>);

    expect(screen.getByText('Custom')).toHaveClass('custom-badge');
  });
});

describe('StatCard', () => {
  it('should render label and value correctly', () => {
    render(<StatCard label="Workouts" value={42} />);

    expect(screen.getByText('Workouts')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should render string values', () => {
    render(<StatCard label="Distance" value="10.5k" />);

    expect(screen.getByText('10.5k')).toBeInTheDocument();
  });

  it('should render icon when provided', () => {
    render(
      <StatCard
        label="Strength"
        value={100}
        icon={<Dumbbell data-testid="icon" />}
      />
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should apply orange-pink gradient by default', () => {
    const { container } = render(<StatCard label="Test" value={1} />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveStyle({
      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(236, 72, 153, 0.2) 100%)'
    });
    expect(card.style.border).toContain('1px solid');
  });

  it('should apply pink-purple gradient', () => {
    const { container } = render(<StatCard label="Test" value={1} gradient="pink-purple" />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveStyle({
      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.2) 100%)'
    });
  });

  it('should apply purple-blue gradient', () => {
    const { container } = render(<StatCard label="Test" value={1} gradient="purple-blue" />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveStyle({
      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)'
    });
  });

  it('should apply cyan-blue gradient', () => {
    const { container } = render(<StatCard label="Test" value={1} gradient="cyan-blue" />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveStyle({
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)'
    });
  });

  it('should apply base styles', () => {
    const { container } = render(<StatCard label="Test" value={1} />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveStyle({
      borderRadius: '16px',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    });
  });

  it('should merge custom className', () => {
    const { container } = render(<StatCard label="Test" value={1} className="custom-stat" />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('custom-stat');
  });

  it('should apply uppercase styling to label', () => {
    render(<StatCard label="workouts" value={10} />);
    const label = screen.getByText('workouts');

    expect(label).toHaveStyle({
      textTransform: 'uppercase',
      fontSize: '12px',
      fontWeight: 600
    });
  });

  it('should apply gradient text to value', () => {
    render(<StatCard label="Test" value={999} />);
    const value = screen.getByText('999');

    expect(value).toHaveStyle({
      fontSize: '32px',
      fontWeight: 900,
      background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)'
    });
  });
});
