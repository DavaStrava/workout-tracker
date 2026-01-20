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
const mockOnBackToWorkoutTypeSelector = vi.fn();
const mockOnGoHome = vi.fn();
const mockGetExerciseName = vi.fn((id: string) => {
  const names: Record<string, string> = {
    'running': 'Running',
    'cycling': 'Cycling',
    'swimming': 'Swimming',
  };
  return names[id] || 'Unknown Activity';
});

// Helper to render with required props
const renderCardioLogger = () => {
  return render(
    <CardioLogger
      onBackToWorkoutTypeSelector={mockOnBackToWorkoutTypeSelector}
      onGoHome={mockOnGoHome}
    />
  );
};

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
    finishExercise: vi.fn(),
    editExercise: vi.fn(),
  }),
}));

vi.mock('../../hooks/usePreferences', () => ({
  usePreferences: () => ({
    preferences: { unitSystem: 'metric' },
    unitSystem: 'metric',
    setUnitSystem: vi.fn(),
    isLoading: false,
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
    mockOnBackToWorkoutTypeSelector.mockClear();
    mockOnGoHome.mockClear();
  });

  describe('when no active workout', () => {
    it('should return null when there is no active workout', () => {
      mockActiveWorkout = null;

      const { container } = renderCardioLogger();

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
      renderCardioLogger();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Cardio Session');
    });

    it('should display "Cardio Session" indicator', () => {
      renderCardioLogger();

      const elements = screen.getAllByText(/Cardio Session/);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });

    it('should render the exercise name', () => {
      renderCardioLogger();

      expect(screen.getByText(/Running/)).toBeInTheDocument();
    });

    it('should render Cancel button', () => {
      renderCardioLogger();

      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should render Finish button', () => {
      renderCardioLogger();

      expect(screen.getByText('Finish')).toBeInTheDocument();
    });

    it('should call cancelWorkout when Cancel is clicked', async () => {
      const user = userEvent.setup();

      renderCardioLogger();

      await user.click(screen.getByText('Cancel'));

      expect(mockCancelWorkout).toHaveBeenCalledTimes(1);
    });

    it('should call finishWorkout when Finish is clicked', async () => {
      const user = userEvent.setup();

      renderCardioLogger();

      await user.click(screen.getByText('Finish'));

      expect(mockFinishWorkout).toHaveBeenCalledTimes(1);
    });

    it('should render Add Activity button', () => {
      renderCardioLogger();

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
      renderCardioLogger();

      // New label format from CardioFieldInput
      expect(screen.getByText(/Duration/)).toBeInTheDocument();
    });

    it('should display current duration value', () => {
      renderCardioLogger();

      // Duration is 1800 seconds = 30 minutes, displayed in the input
      const durationInput = screen.getByPlaceholderText('30') as HTMLInputElement;
      expect(durationInput.value).toBe('30');
    });

    it('should call updateSet when duration changes', async () => {
      const user = userEvent.setup();

      renderCardioLogger();

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
      renderCardioLogger();

      expect(screen.getByText(/Distance/)).toBeInTheDocument();
    });

    it('should display current distance value in km', () => {
      renderCardioLogger();

      // Distance is 5000 meters = 5 km
      const distanceInput = screen.getByPlaceholderText('5.0') as HTMLInputElement;
      expect(distanceInput.value).toBe('5');
    });

    it('should call updateSet when distance changes', async () => {
      const user = userEvent.setup();

      renderCardioLogger();

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
      renderCardioLogger();

      expect(screen.getByText('low')).toBeInTheDocument();
      expect(screen.getByText('medium')).toBeInTheDocument();
      expect(screen.getByText('high')).toBeInTheDocument();
    });

    it('should call updateSet when intensity button is clicked', async () => {
      const user = userEvent.setup();

      renderCardioLogger();

      await user.click(screen.getByText('high'));

      expect(mockUpdateSet).toHaveBeenCalledWith('exercise-1', 'set-1', {
        intensity: 'high',
      });
    });

    it('should call updateSet with low intensity', async () => {
      const user = userEvent.setup();

      renderCardioLogger();

      await user.click(screen.getByText('low'));

      expect(mockUpdateSet).toHaveBeenCalledWith('exercise-1', 'set-1', {
        intensity: 'low',
      });
    });
  });

  describe('finish activity toggle', () => {
    beforeEach(() => {
      mockActiveWorkout = createMockWorkout({
        exercises: [createMockCardioExercise()],
      });
    });

    it('should render Finish Activity button', () => {
      renderCardioLogger();

      expect(screen.getByText('Finish Activity')).toBeInTheDocument();
    });

    it('should render Edit Activity button when exercise is completed', () => {
      mockActiveWorkout = createMockWorkout({
        exercises: [
          createMockCardioExercise({
            completedAt: Date.now(),
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

      renderCardioLogger();

      expect(screen.getByText('Edit Activity')).toBeInTheDocument();
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
      renderCardioLogger();

      expect(screen.getByText('Session Notes')).toBeInTheDocument();
    });

    it('should render notes textarea with placeholder', () => {
      renderCardioLogger();

      expect(screen.getByPlaceholderText('How did you feel? Any notes...')).toBeInTheDocument();
    });

    it('should display current notes value', () => {
      renderCardioLogger();

      const textarea = screen.getByPlaceholderText('How did you feel? Any notes...');
      expect(textarea).toHaveValue('Felt good today');
    });

    it('should call updateNotes when notes change', async () => {
      const user = userEvent.setup();

      renderCardioLogger();

      const textarea = screen.getByPlaceholderText('How did you feel? Any notes...');
      await user.clear(textarea);
      await user.type(textarea, 'Great run!');

      expect(mockUpdateNotes).toHaveBeenCalled();
    });
  });

  describe('sport selector', () => {
    it('should show exercise selector immediately when workout has no activities', () => {
      mockActiveWorkout = createMockWorkout({ exercises: [] });

      renderCardioLogger();

      // Selector shows immediately for empty workout
      expect(screen.getByText('Select Activity')).toBeInTheDocument();
    });

    it('should show cardio exercises in selector', () => {
      mockActiveWorkout = createMockWorkout({ exercises: [] });

      renderCardioLogger();

      expect(screen.getByText('Running')).toBeInTheDocument();
      expect(screen.getByText('Cycling')).toBeInTheDocument();
      expect(screen.getByText('Swimming')).toBeInTheDocument();
    });

    it('should call addExercise when activity is selected', async () => {
      const user = userEvent.setup();
      mockActiveWorkout = createMockWorkout({ exercises: [] });

      renderCardioLogger();

      await user.click(screen.getByLabelText('Select Running'));

      expect(mockAddExercise).toHaveBeenCalledWith('running');
    });

    it('should show Add Activity button when workout has activities', () => {
      mockActiveWorkout = createMockWorkout({
        exercises: [createMockCardioExercise()],
      });

      renderCardioLogger();

      expect(screen.getByText('Add Activity')).toBeInTheDocument();
    });

    it('should call onBackToWorkoutTypeSelector when back button is clicked with no activities', async () => {
      const user = userEvent.setup();
      mockActiveWorkout = createMockWorkout({ exercises: [] });

      renderCardioLogger();

      const backButton = screen.getByLabelText('Go back');
      await user.click(backButton);

      expect(mockOnBackToWorkoutTypeSelector).toHaveBeenCalled();
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

      renderCardioLogger();

      expect(screen.getByText(/Running/)).toBeInTheDocument();
      expect(screen.getByText(/Cycling/)).toBeInTheDocument();
    });
  });
});
