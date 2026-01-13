import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuscleGroupSelector } from '../MuscleGroupSelector';

describe('MuscleGroupSelector', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render all 15 muscle group buttons', () => {
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      // Upper body - Push
      expect(screen.getByText('Chest')).toBeInTheDocument();
      expect(screen.getByText('Shoulders')).toBeInTheDocument();
      expect(screen.getByText('Triceps')).toBeInTheDocument();

      // Upper body - Pull
      expect(screen.getByText('Lats')).toBeInTheDocument();
      expect(screen.getByText('Upper Back')).toBeInTheDocument();
      expect(screen.getByText('Traps')).toBeInTheDocument();
      expect(screen.getByText('Biceps')).toBeInTheDocument();
      expect(screen.getByText('Forearms')).toBeInTheDocument();

      // Core
      expect(screen.getByText('Abs')).toBeInTheDocument();
      expect(screen.getByText('Obliques')).toBeInTheDocument();
      expect(screen.getByText('Lower Back')).toBeInTheDocument();

      // Lower body
      expect(screen.getByText('Quads')).toBeInTheDocument();
      expect(screen.getByText('Hamstrings')).toBeInTheDocument();
      expect(screen.getByText('Glutes')).toBeInTheDocument();
      expect(screen.getByText('Calves')).toBeInTheDocument();
    });

    it('should NOT render Cardio option', () => {
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      expect(screen.queryByText('Cardio')).not.toBeInTheDocument();
    });

    it('should render SVG icons for each muscle group', () => {
      const { container } = render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      const svgIcons = container.querySelectorAll('svg');
      expect(svgIcons.length).toBe(15);
    });

    it('should display exercise count for each muscle group', () => {
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      // Verify some exercise counts are displayed
      // Exercise counts: Chest(4), Shoulders(4), Triceps(3), Lats(3), Upper Back(3),
      // Traps(2), Biceps(3), Forearms(2), Abs(3), Obliques(3), Lower Back(2),
      // Quads(4), Hamstrings(2), Glutes(3), Calves(2)
      expect(screen.getAllByText('4 exercises').length).toBe(3); // Chest, Shoulders, Quads
      expect(screen.getAllByText('3 exercises').length).toBe(7); // Triceps, Lats, Upper Back, Biceps, Abs, Obliques, Glutes
      expect(screen.getAllByText('2 exercises').length).toBe(5); // Traps, Forearms, Lower Back, Hamstrings, Calves
    });
  });

  describe('interactions', () => {
    it('should call onSelect with Chest when Chest is clicked', async () => {
      const user = userEvent.setup();
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      await user.click(screen.getByText('Chest'));

      expect(mockOnSelect).toHaveBeenCalledWith('Chest');
    });

    it('should call onSelect with Lats when Lats is clicked', async () => {
      const user = userEvent.setup();
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      await user.click(screen.getByText('Lats'));

      expect(mockOnSelect).toHaveBeenCalledWith('Lats');
    });

    it('should call onSelect with Quads when Quads is clicked', async () => {
      const user = userEvent.setup();
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      await user.click(screen.getByText('Quads'));

      expect(mockOnSelect).toHaveBeenCalledWith('Quads');
    });

    it('should call onSelect with Shoulders when Shoulders is clicked', async () => {
      const user = userEvent.setup();
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      await user.click(screen.getByText('Shoulders'));

      expect(mockOnSelect).toHaveBeenCalledWith('Shoulders');
    });

    it('should call onSelect with Biceps when Biceps is clicked', async () => {
      const user = userEvent.setup();
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      await user.click(screen.getByText('Biceps'));

      expect(mockOnSelect).toHaveBeenCalledWith('Biceps');
    });

    it('should call onSelect with Abs when Abs is clicked', async () => {
      const user = userEvent.setup();
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      await user.click(screen.getByText('Abs'));

      expect(mockOnSelect).toHaveBeenCalledWith('Abs');
    });
  });

  describe('styling', () => {
    it('should have 2-column grid layout', () => {
      const { container } = render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(2, 1fr)');
    });

    it('should apply correct border radius to buttons', () => {
      const { container } = render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button.style.borderRadius).toBe('24px');
      });
    });

    it('should have 15 button elements', () => {
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(15);
    });
  });

  describe('accessibility', () => {
    it('should have accessible button elements', () => {
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(15);

      // Each button should have visible text
      buttons.forEach((button) => {
        expect(button.textContent).toBeTruthy();
      });
    });

    it('should have aria-hidden on SVG icons', () => {
      const { container } = render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      const svgIcons = container.querySelectorAll('svg');
      svgIcons.forEach((svg) => {
        expect(svg.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });
});
