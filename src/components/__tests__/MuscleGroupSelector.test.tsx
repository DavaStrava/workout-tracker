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
    it('should render all 6 muscle group buttons', () => {
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      expect(screen.getByText('Chest')).toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
      expect(screen.getByText('Legs')).toBeInTheDocument();
      expect(screen.getByText('Shoulders')).toBeInTheDocument();
      expect(screen.getByText('Arms')).toBeInTheDocument();
      expect(screen.getByText('Core')).toBeInTheDocument();
    });

    it('should NOT render Cardio option', () => {
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      expect(screen.queryByText('Cardio')).not.toBeInTheDocument();
    });

    it('should render SVG icons for each muscle group', () => {
      const { container } = render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      const svgIcons = container.querySelectorAll('svg');
      expect(svgIcons.length).toBe(6);
    });

    it('should display exercise count for each muscle group', () => {
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      // Check that exercise counts are displayed (multiple groups may have same count)
      // Chest: 3, Back: 4, Legs: 3, Shoulders: 2, Arms: 2, Core: 2
      expect(screen.getAllByText('3 exercises').length).toBe(2); // Chest and Legs
      expect(screen.getByText('4 exercises')).toBeInTheDocument(); // Back
      expect(screen.getAllByText('2 exercises').length).toBe(3); // Shoulders, Arms, Core
    });
  });

  describe('interactions', () => {
    it('should call onSelect with Chest when Chest is clicked', async () => {
      const user = userEvent.setup();
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      await user.click(screen.getByText('Chest'));

      expect(mockOnSelect).toHaveBeenCalledWith('Chest');
    });

    it('should call onSelect with Back when Back is clicked', async () => {
      const user = userEvent.setup();
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      await user.click(screen.getByText('Back'));

      expect(mockOnSelect).toHaveBeenCalledWith('Back');
    });

    it('should call onSelect with Legs when Legs is clicked', async () => {
      const user = userEvent.setup();
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      await user.click(screen.getByText('Legs'));

      expect(mockOnSelect).toHaveBeenCalledWith('Legs');
    });

    it('should call onSelect with Shoulders when Shoulders is clicked', async () => {
      const user = userEvent.setup();
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      await user.click(screen.getByText('Shoulders'));

      expect(mockOnSelect).toHaveBeenCalledWith('Shoulders');
    });

    it('should call onSelect with Arms when Arms is clicked', async () => {
      const user = userEvent.setup();
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      await user.click(screen.getByText('Arms'));

      expect(mockOnSelect).toHaveBeenCalledWith('Arms');
    });

    it('should call onSelect with Core when Core is clicked', async () => {
      const user = userEvent.setup();
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      await user.click(screen.getByText('Core'));

      expect(mockOnSelect).toHaveBeenCalledWith('Core');
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

    it('should have 6 button elements', () => {
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(6);
    });
  });

  describe('accessibility', () => {
    it('should have accessible button elements', () => {
      render(<MuscleGroupSelector onSelect={mockOnSelect} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(6);

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
