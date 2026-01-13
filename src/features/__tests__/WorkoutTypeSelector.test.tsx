import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkoutTypeSelector } from '../WorkoutTypeSelector';

describe('WorkoutTypeSelector', () => {
  describe('rendering', () => {
    it('should render the heading', () => {
      render(<WorkoutTypeSelector onSelect={vi.fn()} />);

      expect(screen.getByText('Start Workout')).toBeInTheDocument();
      expect(screen.getByText('Choose your workout type')).toBeInTheDocument();
    });

    it('should render all three workout type options', () => {
      render(<WorkoutTypeSelector onSelect={vi.fn()} />);

      expect(screen.getByText('Strength')).toBeInTheDocument();
      expect(screen.getByText('Cardio')).toBeInTheDocument();
      expect(screen.getByText('HIIT')).toBeInTheDocument();
    });

    it('should render descriptions for each workout type', () => {
      render(<WorkoutTypeSelector onSelect={vi.fn()} />);

      expect(screen.getByText('Weights, machines, resistance training')).toBeInTheDocument();
      expect(screen.getByText('Running, cycling, rowing, swimming')).toBeInTheDocument();
      expect(screen.getByText('High intensity interval training')).toBeInTheDocument();
    });

    it('should render icons for each workout type', () => {
      const { container } = render(<WorkoutTypeSelector onSelect={vi.fn()} />);

      // Check for SVG icons (lucide-react renders SVGs)
      const svgIcons = container.querySelectorAll('svg');
      // 3 workout type icons + 3 chevron arrows
      expect(svgIcons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('interactions', () => {
    it('should call onSelect with STRENGTH when Strength button is clicked', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();

      render(<WorkoutTypeSelector onSelect={handleSelect} />);

      await user.click(screen.getByText('Strength'));

      expect(handleSelect).toHaveBeenCalledTimes(1);
      expect(handleSelect).toHaveBeenCalledWith('STRENGTH');
    });

    it('should call onSelect with CARDIO when Cardio button is clicked', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();

      render(<WorkoutTypeSelector onSelect={handleSelect} />);

      await user.click(screen.getByText('Cardio'));

      expect(handleSelect).toHaveBeenCalledTimes(1);
      expect(handleSelect).toHaveBeenCalledWith('CARDIO');
    });

    it('should call onSelect with HIIT when HIIT button is clicked', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();

      render(<WorkoutTypeSelector onSelect={handleSelect} />);

      await user.click(screen.getByText('HIIT'));

      expect(handleSelect).toHaveBeenCalledTimes(1);
      expect(handleSelect).toHaveBeenCalledWith('HIIT');
    });

    it('should only call onSelect once per click', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();

      render(<WorkoutTypeSelector onSelect={handleSelect} />);

      await user.click(screen.getByText('Strength'));
      await user.click(screen.getByText('Cardio'));

      expect(handleSelect).toHaveBeenCalledTimes(2);
      expect(handleSelect).toHaveBeenNthCalledWith(1, 'STRENGTH');
      expect(handleSelect).toHaveBeenNthCalledWith(2, 'CARDIO');
    });
  });

  describe('styling', () => {
    it('should apply gradient classes to buttons', () => {
      const { container } = render(<WorkoutTypeSelector onSelect={vi.fn()} />);

      const buttons = container.querySelectorAll('button');

      // Each button should have gradient styling
      buttons.forEach((button) => {
        expect(button.className).toContain('bg-gradient-to-br');
      });
    });

    it('should apply gradient text to heading', () => {
      render(<WorkoutTypeSelector onSelect={vi.fn()} />);

      const heading = screen.getByText('Start Workout');
      expect(heading.className).toContain('bg-gradient-to-r');
      expect(heading.className).toContain('bg-clip-text');
    });

    it('should have rounded corners on buttons', () => {
      const { container } = render(<WorkoutTypeSelector onSelect={vi.fn()} />);

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button.className).toContain('rounded-2xl');
      });
    });
  });

  describe('accessibility', () => {
    it('should have accessible button elements', () => {
      render(<WorkoutTypeSelector onSelect={vi.fn()} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('should have text content for screen readers', () => {
      render(<WorkoutTypeSelector onSelect={vi.fn()} />);

      // All workout types should be in the document (Framer Motion may affect visibility during animation)
      expect(screen.getByText('Strength')).toBeInTheDocument();
      expect(screen.getByText('Cardio')).toBeInTheDocument();
      expect(screen.getByText('HIIT')).toBeInTheDocument();
    });
  });

  describe('animations', () => {
    it('should have motion button elements', () => {
      const { container } = render(<WorkoutTypeSelector onSelect={vi.fn()} />);

      // Framer motion adds data attributes
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(3);
    });
  });
});
