import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardioLogger } from '../CardioLogger';
import type { Workout, WorkoutExercise } from '../../types';

// Mock functions
const mockFinishWorkout = vi.fn();
const mockCancelWorkout = vi.fn();
const mockAddExercise = vi.fn();
const mockUpdateSet = vi.fn();
const mockUpdateNotes = vi.fn();
const mockGetExerciseName = vi.fn((id: string) => {
  const names: Record<string, string> = {
    'running': 'Running',
    'cycling': 'Cycling',
    'swimming': 'Swimming',
  };
  return names[id] || 'Unknown Activity';
});

const createMockWorkout = (overrides?: Partial<Workout>): Workout => ({
  id: 'workout-1',
  name: 'Cardio Session',
  type: 'CARDIO',
  startTime: Date.now(),
  exercises: [],
  status: 'active',
  ...overrides,
});

const createMockCardioExercise = (overrides?: Partial<WorkoutExercise>): WorkoutExercise => ({
  id: 'exercise-1',
  exerciseId: 'running',
  sets: [
    {
      id: 'set-1',
      duration: 1800, // 30 minutes in seconds
      distance: 5000, // 5km in meters
      intensity: 'medium',
      completed: false,
    },
  ],
  ...overrides,
});

let mockActiveWorkout: Workout | null = null;

vi.mock('../../hooks/useWorkoutStore', () => ({
  useWorkout: () => ({
    activeWorkout: mockActiveWorkout,
    finishWorkout: mockFinishWorkout,
    cancelWorkout: mockCancelWorkout,
    addExercise: mockAddExercise,
    updateSet: mockUpdateSet,
    updateNotes: mockUpdateNotes,
    getExerciseName: mockGetExerciseName,
  }),
}));

// Mock the EXERCISES data
vi.mock('../../data/exercises', () => ({
  EXERCISES: [
    { id: 'running', name: 'Running', bodyArea: 'Cardio', isCardio: true },
    { id: 'cycling', name: 'Cycling', bodyArea: 'Cardio', isCardio: true },
    { id: 'swimming', name: 'Swimming', bodyArea: 'Cardio', isCardio: true },
  ],
}));

describe('CardioLogger', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockActiveWorkout = null;
  });

  describe('when no active workout', () => {
    it('should return null when there is no active workout', () => {
      mockActiveWorkout = null;

      const { container } = render(<CardioLogger onBack={mockOnBack} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('main workout view', () => {
    beforeEach(() => {
      mockActiveWorkout = createMockWorkout({
        exercises: [createMockCardioExercise()],
      });
    });

    it('should render the workout name', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      // The workout name "Cardio Session" appears in an h1 element
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Cardio Session');
    });

    it('should display "Cardio Session" indicator', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      // There are multiple elements with "Cardio Session" - the h1 title and the indicator
      const elements = screen.getAllByText(/Cardio Session/);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });

    it('should render the exercise name', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      expect(screen.getByText(/Running/)).toBeInTheDocument();
    });

    it('should render Cancel button', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should render Finish button', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      expect(screen.getByText('Finish')).toBeInTheDocument();
    });

    it('should call cancelWorkout when Cancel is clicked', async () => {
      const user = userEvent.setup();

      render(<CardioLogger onBack={mockOnBack} />);

      await user.click(screen.getByText('Cancel'));

      expect(mockCancelWorkout).toHaveBeenCalledTimes(1);
    });

    it('should call finishWorkout when Finish is clicked', async () => {
      const user = userEvent.setup();

      render(<CardioLogger onBack={mockOnBack} />);

      await user.click(screen.getByText('Finish'));

      expect(mockFinishWorkout).toHaveBeenCalledTimes(1);
    });

    it('should render Add Activity button', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      expect(screen.getByText('Add Activity')).toBeInTheDocument();
    });
  });

  describe('duration input', () => {
    beforeEach(() => {
      mockActiveWorkout = createMockWorkout({
        exercises: [createMockCardioExercise()],
      });
    });

    it('should render duration input with label', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      expect(screen.getByText('Duration (min)')).toBeInTheDocument();
    });

    it('should display current duration value', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      // Duration is 1800 seconds = 30 minutes
      const durationInput = screen.getByPlaceholderText('30') as HTMLInputElement;
      expect(durationInput.value).toBe('30');
    });

    it('should call updateSet when duration changes', async () => {
      const user = userEvent.setup();

      render(<CardioLogger onBack={mockOnBack} />);

      const durationInput = screen.getByPlaceholderText('30');
      await user.clear(durationInput);
      await user.type(durationInput, '45');

      // Check that updateSet was called (it's called on each keystroke)
      expect(mockUpdateSet).toHaveBeenCalled();
    });
  });

  describe('distance input', () => {
    beforeEach(() => {
      mockActiveWorkout = createMockWorkout({
        exercises: [createMockCardioExercise()],
      });
    });

    it('should render distance input with label', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      expect(screen.getByText('Distance (km)')).toBeInTheDocument();
    });

    it('should display current distance value in km', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      // Distance is 5000 meters = 5.0 km
      const distanceInput = screen.getByPlaceholderText('5.0') as HTMLInputElement;
      expect(distanceInput.value).toBe('5.0');
    });

    it('should call updateSet when distance changes', async () => {
      const user = userEvent.setup();

      render(<CardioLogger onBack={mockOnBack} />);

      const distanceInput = screen.getByPlaceholderText('5.0');
      await user.clear(distanceInput);
      await user.type(distanceInput, '10');

      // Check that updateSet was called (it's called on each keystroke)
      expect(mockUpdateSet).toHaveBeenCalled();
    });
  });

  describe('intensity buttons', () => {
    beforeEach(() => {
      mockActiveWorkout = createMockWorkout({
        exercises: [createMockCardioExercise()],
      });
    });

    it('should render all intensity buttons', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      expect(screen.getByText('low')).toBeInTheDocument();
      expect(screen.getByText('medium')).toBeInTheDocument();
      expect(screen.getByText('high')).toBeInTheDocument();
    });

    it('should call updateSet when intensity button is clicked', async () => {
      const user = userEvent.setup();

      render(<CardioLogger onBack={mockOnBack} />);

      await user.click(screen.getByText('high'));

      expect(mockUpdateSet).toHaveBeenCalledWith('exercise-1', 'set-1', {
        intensity: 'high',
      });
    });

    it('should call updateSet with low intensity', async () => {
      const user = userEvent.setup();

      render(<CardioLogger onBack={mockOnBack} />);

      await user.click(screen.getByText('low'));

      expect(mockUpdateSet).toHaveBeenCalledWith('exercise-1', 'set-1', {
        intensity: 'low',
      });
    });
  });

  describe('mark complete toggle', () => {
    beforeEach(() => {
      mockActiveWorkout = createMockWorkout({
        exercises: [createMockCardioExercise()],
      });
    });

    it('should render Mark Complete button', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      expect(screen.getByText('Mark Complete')).toBeInTheDocument();
    });

    it('should call updateSet with completed true when clicked', async () => {
      const user = userEvent.setup();

      render(<CardioLogger onBack={mockOnBack} />);

      await user.click(screen.getByText('Mark Complete'));

      expect(mockUpdateSet).toHaveBeenCalledWith('exercise-1', 'set-1', {
        completed: true,
      });
    });

    it('should show Completed text when already completed', () => {
      mockActiveWorkout = createMockWorkout({
        exercises: [
          createMockCardioExercise({
            sets: [
              {
                id: 'set-1',
                duration: 1800,
                distance: 5000,
                intensity: 'medium',
                completed: true,
              },
            ],
          }),
        ],
      });

      render(<CardioLogger onBack={mockOnBack} />);

      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  describe('notes section', () => {
    beforeEach(() => {
      mockActiveWorkout = createMockWorkout({
        exercises: [createMockCardioExercise()],
        notes: 'Felt good today',
      });
    });

    it('should render Session Notes section', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      expect(screen.getByText('Session Notes')).toBeInTheDocument();
    });

    it('should render notes textarea with placeholder', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      expect(screen.getByPlaceholderText('How did you feel? Any notes...')).toBeInTheDocument();
    });

    it('should display current notes value', () => {
      render(<CardioLogger onBack={mockOnBack} />);

      const textarea = screen.getByPlaceholderText('How did you feel? Any notes...');
      expect(textarea).toHaveValue('Felt good today');
    });

    it('should call updateNotes when notes change', async () => {
      const user = userEvent.setup();

      render(<CardioLogger onBack={mockOnBack} />);

      const textarea = screen.getByPlaceholderText('How did you feel? Any notes...');
      await user.clear(textarea);
      await user.type(textarea, 'Great run!');

      expect(mockUpdateNotes).toHaveBeenCalled();
    });
  });

  describe('exercise selector', () => {
    beforeEach(() => {
      mockActiveWorkout = createMockWorkout();
    });

    it('should show exercise selector when Add Activity is clicked', async () => {
      const user = userEvent.setup();

      render(<CardioLogger onBack={mockOnBack} />);

      await user.click(screen.getByText('Add Activity'));

      expect(screen.getByText('Select Activity')).toBeInTheDocument();
    });

    it('should show cardio exercises in selector', async () => {
      const user = userEvent.setup();

      render(<CardioLogger onBack={mockOnBack} />);

      await user.click(screen.getByText('Add Activity'));

      expect(screen.getByText('Running')).toBeInTheDocument();
      expect(screen.getByText('Cycling')).toBeInTheDocument();
      expect(screen.getByText('Swimming')).toBeInTheDocument();
    });

    it('should call addExercise when activity is selected', async () => {
      const user = userEvent.setup();

      render(<CardioLogger onBack={mockOnBack} />);

      await user.click(screen.getByText('Add Activity'));
      await user.click(screen.getByText('Running'));

      expect(mockAddExercise).toHaveBeenCalledWith('running');
    });

    it('should hide selector after exercise is added', async () => {
      const user = userEvent.setup();

      render(<CardioLogger onBack={mockOnBack} />);

      await user.click(screen.getByText('Add Activity'));
      await user.click(screen.getByText('Running'));

      expect(screen.queryByText('Select Activity')).not.toBeInTheDocument();
    });

    it('should go back when back button is clicked', async () => {
      const user = userEvent.setup();

      render(<CardioLogger onBack={mockOnBack} />);

      await user.click(screen.getByText('Add Activity'));

      // Find back button (ChevronLeft icon button)
      const buttons = screen.getAllByRole('button');
      const backButton = buttons[0]; // First button is back

      await user.click(backButton);

      expect(screen.queryByText('Select Activity')).not.toBeInTheDocument();
    });
  });

  describe('multiple activities', () => {
    it('should render all activities', () => {
      mockActiveWorkout = createMockWorkout({
        exercises: [
          createMockCardioExercise({ id: 'ex-1', exerciseId: 'running' }),
          createMockCardioExercise({ id: 'ex-2', exerciseId: 'cycling' }),
        ],
      });

      render(<CardioLogger onBack={mockOnBack} />);

      expect(screen.getByText(/Running/)).toBeInTheDocument();
      expect(screen.getByText(/Cycling/)).toBeInTheDocument();
    });
  });
});
