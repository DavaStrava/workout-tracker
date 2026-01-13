import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { History } from '../History';
import type { Workout } from '../../types';

const createMockWorkout = (overrides?: Partial<Workout>): Workout => ({
  id: 'workout-1',
  name: 'Morning Workout',
  type: 'STRENGTH',
  startTime: Date.now() - 3600000, // 1 hour ago
  endTime: Date.now() - 1800000, // 30 mins ago (30 min workout)
  exercises: [
    {
      id: 'ex-1',
      exerciseId: 'bench-press',
      sets: [
        { id: 'set-1', reps: 10, weight: 100, completed: true },
        { id: 'set-2', reps: 10, weight: 100, completed: true },
      ],
    },
  ],
  status: 'completed',
  ...overrides,
});

let mockHistory: Workout[] = [];

vi.mock('../../hooks/useWorkoutStore', () => ({
  useWorkout: () => ({
    history: mockHistory,
  }),
}));

describe('History', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = [];
  });

  describe('empty state', () => {
    it('should render empty state when there are no workouts', () => {
      mockHistory = [];

      render(<History />);

      expect(screen.getByText('No workouts recorded')).toBeInTheDocument();
    });

    it('should show helpful message in empty state', () => {
      mockHistory = [];

      render(<History />);

      expect(screen.getByText('Start your first workout to see history!')).toBeInTheDocument();
    });

    it('should render dumbbell icon in empty state', () => {
      mockHistory = [];

      const { container } = render(<History />);

      // Lucide Dumbbell icon has specific SVG path
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });
  });

  describe('with workout history', () => {
    beforeEach(() => {
      mockHistory = [createMockWorkout()];
    });

    it('should render the History header', () => {
      render(<History />);

      expect(screen.getByText('History')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      render(<History />);

      expect(screen.getByText('Your past training sessions')).toBeInTheDocument();
    });

    it('should render workout name', () => {
      render(<History />);

      expect(screen.getByText('Morning Workout')).toBeInTheDocument();
    });

    it('should render workout date', () => {
      render(<History />);

      // The date format includes weekday, month, and day
      // e.g., "Sun, Jan 12"
      const dateElements = screen.getAllByText(/\w{3}, \w{3} \d+/);
      expect(dateElements.length).toBeGreaterThan(0);
    });

    it('should render workout duration', () => {
      render(<History />);

      // 30 minute workout
      expect(screen.getByText('30 min')).toBeInTheDocument();
    });

    it('should render exercise count', () => {
      render(<History />);

      expect(screen.getByText('1 Exercises')).toBeInTheDocument();
    });
  });

  describe('incomplete workout', () => {
    it('should show Incomplete for workouts without endTime', () => {
      mockHistory = [
        createMockWorkout({
          endTime: undefined,
        }),
      ];

      render(<History />);

      expect(screen.getByText('Incomplete')).toBeInTheDocument();
    });
  });

  describe('multiple workouts', () => {
    it('should render all workouts', () => {
      mockHistory = [
        createMockWorkout({ id: 'w1', name: 'Morning Workout' }),
        createMockWorkout({ id: 'w2', name: 'Evening Workout' }),
        createMockWorkout({ id: 'w3', name: 'Leg Day' }),
      ];

      render(<History />);

      expect(screen.getByText('Morning Workout')).toBeInTheDocument();
      expect(screen.getByText('Evening Workout')).toBeInTheDocument();
      expect(screen.getByText('Leg Day')).toBeInTheDocument();
    });

    it('should display workouts in reverse chronological order', () => {
      const now = Date.now();
      mockHistory = [
        createMockWorkout({ id: 'w1', name: 'Oldest Workout', startTime: now - 86400000 }), // 1 day ago
        createMockWorkout({ id: 'w2', name: 'Middle Workout', startTime: now - 3600000 }), // 1 hour ago
        createMockWorkout({ id: 'w3', name: 'Newest Workout', startTime: now }), // now
      ];

      render(<History />);

      const workoutNames = screen.getAllByRole('heading', { level: 3 });
      // Reverse order: newest first
      expect(workoutNames[0]).toHaveTextContent('Newest Workout');
      expect(workoutNames[1]).toHaveTextContent('Middle Workout');
      expect(workoutNames[2]).toHaveTextContent('Oldest Workout');
    });
  });

  describe('workout with multiple exercises', () => {
    it('should display correct exercise count', () => {
      mockHistory = [
        createMockWorkout({
          exercises: [
            { id: 'ex-1', exerciseId: 'bench-press', sets: [] },
            { id: 'ex-2', exerciseId: 'squat', sets: [] },
            { id: 'ex-3', exerciseId: 'deadlift', sets: [] },
          ],
        }),
      ];

      render(<History />);

      expect(screen.getByText('3 Exercises')).toBeInTheDocument();
    });
  });

  describe('workout duration calculation', () => {
    it('should calculate duration correctly for 1 hour workout', () => {
      const now = Date.now();
      mockHistory = [
        createMockWorkout({
          startTime: now - 3600000, // 1 hour ago
          endTime: now,
        }),
      ];

      render(<History />);

      expect(screen.getByText('60 min')).toBeInTheDocument();
    });

    it('should round duration to nearest minute', () => {
      const now = Date.now();
      mockHistory = [
        createMockWorkout({
          startTime: now - 2700000, // 45 minutes ago
          endTime: now,
        }),
      ];

      render(<History />);

      expect(screen.getByText('45 min')).toBeInTheDocument();
    });
  });

  describe('different workout types', () => {
    it('should display strength workouts correctly', () => {
      mockHistory = [
        createMockWorkout({
          type: 'STRENGTH',
          name: 'Strength Training',
        }),
      ];

      render(<History />);

      expect(screen.getByText('Strength Training')).toBeInTheDocument();
    });

    it('should display cardio workouts correctly', () => {
      mockHistory = [
        createMockWorkout({
          type: 'CARDIO',
          name: 'Cardio Session',
        }),
      ];

      render(<History />);

      expect(screen.getByText('Cardio Session')).toBeInTheDocument();
    });

    it('should display HIIT workouts correctly', () => {
      mockHistory = [
        createMockWorkout({
          type: 'HIIT',
          name: 'HIIT Training',
        }),
      ];

      render(<History />);

      expect(screen.getByText('HIIT Training')).toBeInTheDocument();
    });
  });

  describe('workout card interactions', () => {
    it('should render workout cards with tap animation', () => {
      mockHistory = [createMockWorkout()];

      const { container } = render(<History />);

      // Framer motion adds style properties for animations
      const workoutCards = container.querySelectorAll('[style*="border-radius: 20px"]');
      expect(workoutCards.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle workout with 0 exercises', () => {
      mockHistory = [
        createMockWorkout({
          exercises: [],
        }),
      ];

      render(<History />);

      expect(screen.getByText('0 Exercises')).toBeInTheDocument();
    });

    it('should handle very short workout', () => {
      const now = Date.now();
      mockHistory = [
        createMockWorkout({
          startTime: now - 60000, // 1 minute ago
          endTime: now,
        }),
      ];

      render(<History />);

      expect(screen.getByText('1 min')).toBeInTheDocument();
    });

    it('should handle workout with notes', () => {
      mockHistory = [
        createMockWorkout({
          notes: 'Great session today!',
        }),
      ];

      render(<History />);

      // Notes are not displayed in History list view
      expect(screen.queryByText('Great session today!')).not.toBeInTheDocument();
    });
  });
});
