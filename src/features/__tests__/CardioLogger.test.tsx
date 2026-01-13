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

// Mock the EXERCISES data with sportId
vi.mock('../../data/exercises', () => ({
  EXERCISES: [
    { id: 'running', name: 'Running', bodyArea: 'Cardio', isCardio: true, sportId: 'running' },
    { id: 'cycling', name: 'Cycling', bodyArea: 'Cardio', isCardio: true, sportId: 'cycling' },
    { id: 'swimming', name: 'Swimming', bodyArea: 'Cardio', isCardio: true, sportId: 'swimming' },
  ],
}));

// Mock cardio sports config
vi.mock('../../data/cardioSports', () => ({
  CARDIO_SPORTS: [
    {
      id: 'running',
      name: 'Running',
      icon: 'PersonStanding',
      color: '#22c55e',
      fields: [
        { type: 'distance', label: 'Distance', unit: 'km', required: true, min: 0, max: 500, step: 0.1, placeholder: '5.0' },
        { type: 'duration', label: 'Duration', unit: 'min', required: true, min: 0, max: 1440, placeholder: '30' },
        { type: 'pace', label: 'Pace', unit: 'min/km', required: false, isComputed: true },
        { type: 'heartRate', label: 'Avg Heart Rate', unit: 'bpm', required: false, min: 40, max: 220, placeholder: '145' },
      ],
    },
    {
      id: 'cycling',
      name: 'Cycling',
      icon: 'Bike',
      color: '#f97316',
      fields: [
        { type: 'distance', label: 'Distance', unit: 'km', required: true, min: 0, max: 500, step: 0.1, placeholder: '25.0' },
        { type: 'duration', label: 'Duration', unit: 'min', required: true, min: 0, max: 1440, placeholder: '60' },
      ],
    },
    {
      id: 'swimming',
      name: 'Swimming',
      icon: 'Waves',
      color: '#3b82f6',
      fields: [
        { type: 'distance', label: 'Distance', unit: 'm', required: true, min: 0, max: 20000, step: 25, placeholder: '1500' },
        { type: 'duration', label: 'Duration', unit: 'min', required: true, min: 0, max: 1440, placeholder: '45' },
      ],
    },
  ],
  getSportConfig: (sportId: string) => {
    const sports: Record<string, unknown> = {
      running: {
        id: 'running',
        name: 'Running',
        icon: 'PersonStanding',
        color: '#22c55e',
        fields: [
          { type: 'distance', label: 'Distance', unit: 'km', required: true, min: 0, max: 500, step: 0.1, placeholder: '5.0' },
          { type: 'duration', label: 'Duration', unit: 'min', required: true, min: 0, max: 1440, placeholder: '30' },
          { type: 'pace', label: 'Pace', unit: 'min/km', required: false, isComputed: true },
          { type: 'heartRate', label: 'Avg Heart Rate', unit: 'bpm', required: false, min: 40, max: 220, placeholder: '145' },
        ],
      },
      cycling: {
        id: 'cycling',
        name: 'Cycling',
        icon: 'Bike',
        color: '#f97316',
        fields: [
          { type: 'distance', label: 'Distance', unit: 'km', required: true, min: 0, max: 500, step: 0.1, placeholder: '25.0' },
          { type: 'duration', label: 'Duration', unit: 'min', required: true, min: 0, max: 1440, placeholder: '60' },
        ],
      },
      swimming: {
        id: 'swimming',
        name: 'Swimming',
        icon: 'Waves',
        color: '#3b82f6',
        fields: [
          { type: 'distance', label: 'Distance', unit: 'm', required: true, min: 0, max: 20000, step: 25, placeholder: '1500' },
          { type: 'duration', label: 'Duration', unit: 'min', required: true, min: 0, max: 1440, placeholder: '45' },
        ],
      },
    };
    return sports[sportId];
  },
}));

describe('CardioLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockActiveWorkout = null;
  });

  describe('when no active workout', () => {
    it('should return null when there is no active workout', () => {
      mockActiveWorkout = null;

      const { container } = render(<CardioLogger />);

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
      render(<CardioLogger />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Cardio Session');
    });

    it('should display "Cardio Session" indicator', () => {
      render(<CardioLogger />);

      const elements = screen.getAllByText(/Cardio Session/);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });

    it('should render the exercise name', () => {
      render(<CardioLogger />);

      expect(screen.getByText(/Running/)).toBeInTheDocument();
    });

    it('should render Cancel button', () => {
      render(<CardioLogger />);

      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should render Finish button', () => {
      render(<CardioLogger />);

      expect(screen.getByText('Finish')).toBeInTheDocument();
    });

    it('should call cancelWorkout when Cancel is clicked', async () => {
      const user = userEvent.setup();

      render(<CardioLogger />);

      await user.click(screen.getByText('Cancel'));

      expect(mockCancelWorkout).toHaveBeenCalledTimes(1);
    });

    it('should call finishWorkout when Finish is clicked', async () => {
      const user = userEvent.setup();

      render(<CardioLogger />);

      await user.click(screen.getByText('Finish'));

      expect(mockFinishWorkout).toHaveBeenCalledTimes(1);
    });

    it('should render Add Activity button', () => {
      render(<CardioLogger />);

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
      render(<CardioLogger />);

      // New label format from CardioFieldInput
      expect(screen.getByText(/Duration/)).toBeInTheDocument();
    });

    it('should display current duration value', () => {
      render(<CardioLogger />);

      // Duration is 1800 seconds = 30 minutes, displayed in the input
      const durationInput = screen.getByPlaceholderText('30') as HTMLInputElement;
      expect(durationInput.value).toBe('30');
    });

    it('should call updateSet when duration changes', async () => {
      const user = userEvent.setup();

      render(<CardioLogger />);

      const durationInput = screen.getByPlaceholderText('30');
      await user.clear(durationInput);
      await user.type(durationInput, '45');

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
      render(<CardioLogger />);

      expect(screen.getByText(/Distance/)).toBeInTheDocument();
    });

    it('should display current distance value in km', () => {
      render(<CardioLogger />);

      // Distance is 5000 meters = 5 km
      const distanceInput = screen.getByPlaceholderText('5.0') as HTMLInputElement;
      expect(distanceInput.value).toBe('5');
    });

    it('should call updateSet when distance changes', async () => {
      const user = userEvent.setup();

      render(<CardioLogger />);

      const distanceInput = screen.getByPlaceholderText('5.0');
      await user.clear(distanceInput);
      await user.type(distanceInput, '10');

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
      render(<CardioLogger />);

      expect(screen.getByText('low')).toBeInTheDocument();
      expect(screen.getByText('medium')).toBeInTheDocument();
      expect(screen.getByText('high')).toBeInTheDocument();
    });

    it('should call updateSet when intensity button is clicked', async () => {
      const user = userEvent.setup();

      render(<CardioLogger />);

      await user.click(screen.getByText('high'));

      expect(mockUpdateSet).toHaveBeenCalledWith('exercise-1', 'set-1', {
        intensity: 'high',
      });
    });

    it('should call updateSet with low intensity', async () => {
      const user = userEvent.setup();

      render(<CardioLogger />);

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
      render(<CardioLogger />);

      expect(screen.getByText('Mark Complete')).toBeInTheDocument();
    });

    it('should call updateSet with completed true when clicked', async () => {
      const user = userEvent.setup();

      render(<CardioLogger />);

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

      render(<CardioLogger />);

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
      render(<CardioLogger />);

      expect(screen.getByText('Session Notes')).toBeInTheDocument();
    });

    it('should render notes textarea with placeholder', () => {
      render(<CardioLogger />);

      expect(screen.getByPlaceholderText('How did you feel? Any notes...')).toBeInTheDocument();
    });

    it('should display current notes value', () => {
      render(<CardioLogger />);

      const textarea = screen.getByPlaceholderText('How did you feel? Any notes...');
      expect(textarea).toHaveValue('Felt good today');
    });

    it('should call updateNotes when notes change', async () => {
      const user = userEvent.setup();

      render(<CardioLogger />);

      const textarea = screen.getByPlaceholderText('How did you feel? Any notes...');
      await user.clear(textarea);
      await user.type(textarea, 'Great run!');

      expect(mockUpdateNotes).toHaveBeenCalled();
    });
  });

  describe('sport selector', () => {
    beforeEach(() => {
      mockActiveWorkout = createMockWorkout();
    });

    it('should show exercise selector when Add Activity is clicked', async () => {
      const user = userEvent.setup();

      render(<CardioLogger />);

      await user.click(screen.getByText('Add Activity'));

      expect(screen.getByText('Select Activity')).toBeInTheDocument();
    });

    it('should show cardio exercises in selector', async () => {
      const user = userEvent.setup();

      render(<CardioLogger />);

      await user.click(screen.getByText('Add Activity'));

      expect(screen.getByText('Running')).toBeInTheDocument();
      expect(screen.getByText('Cycling')).toBeInTheDocument();
      expect(screen.getByText('Swimming')).toBeInTheDocument();
    });

    it('should call addExercise when activity is selected', async () => {
      const user = userEvent.setup();

      render(<CardioLogger />);

      await user.click(screen.getByText('Add Activity'));
      await user.click(screen.getByLabelText('Select Running'));

      expect(mockAddExercise).toHaveBeenCalledWith('running');
    });

    it('should hide selector after exercise is added', async () => {
      const user = userEvent.setup();

      render(<CardioLogger />);

      await user.click(screen.getByText('Add Activity'));
      await user.click(screen.getByLabelText('Select Running'));

      expect(screen.queryByText('Select Activity')).not.toBeInTheDocument();
    });

    it('should go back when back button is clicked', async () => {
      const user = userEvent.setup();

      render(<CardioLogger />);

      await user.click(screen.getByText('Add Activity'));

      // Find back button by aria-label
      const backButton = screen.getByLabelText('Go back');

      await user.click(backButton);

      // When no exercises, back cancels the workout
      expect(mockCancelWorkout).toHaveBeenCalled();
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

      render(<CardioLogger />);

      expect(screen.getByText(/Running/)).toBeInTheDocument();
      expect(screen.getByText(/Cycling/)).toBeInTheDocument();
    });
  });
});
