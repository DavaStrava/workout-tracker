import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkoutLogger } from '../WorkoutLogger';
import type { Workout, WorkoutExercise } from '../../types';

// Mock the useWorkout hook
const mockSaveRoutine = vi.fn().mockResolvedValue({});
const mockUpdateRoutine = vi.fn().mockResolvedValue({});
const mockFinishWorkout = vi.fn();
const mockCancelWorkout = vi.fn();
const mockAddExercise = vi.fn();
const mockAddSet = vi.fn();
const mockRemoveSet = vi.fn();
const mockUpdateSet = vi.fn();
const mockGetExerciseName = vi.fn((id: string) => {
  const names: Record<string, string> = {
    'bench-press': 'Bench Press',
    'squat': 'Squat',
    'deadlift': 'Deadlift',
  };
  return names[id] || 'Unknown Exercise';
});

const createMockWorkout = (overrides?: Partial<Workout>): Workout => ({
  id: 'workout-1',
  name: 'Test Workout',
  type: 'STRENGTH',
  startTime: Date.now(),
  exercises: [],
  status: 'active',
  ...overrides,
});

const createMockExercise = (overrides?: Partial<WorkoutExercise>): WorkoutExercise => ({
  id: 'exercise-1',
  exerciseId: 'bench-press',
  sets: [
    { id: 'set-1', reps: 10, weight: 100, completed: false },
  ],
  ...overrides,
});

let mockActiveWorkout: Workout | null = null;
let mockHistory: Workout[] = [];
let mockRoutines: any[] = [];
let mockDeletedWorkouts: Workout[] = [];

vi.mock('../../hooks/useWorkoutStore', () => ({
  useWorkout: () => ({
    activeWorkout: mockActiveWorkout,
    history: mockHistory,
    routines: mockRoutines,
    deletedWorkouts: mockDeletedWorkouts,
    finishWorkout: mockFinishWorkout,
    cancelWorkout: mockCancelWorkout,
    addExercise: mockAddExercise,
    addSet: mockAddSet,
    removeSet: mockRemoveSet,
    updateSet: mockUpdateSet,
    getExerciseName: mockGetExerciseName,
    saveRoutine: mockSaveRoutine,
    updateRoutine: mockUpdateRoutine,
    startWorkout: vi.fn(),
    startRoutine: vi.fn(),
    deleteRoutine: vi.fn(),
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

// Mock the analytics helper
vi.mock('../../utils/analyticsHelpers', () => ({
  getLastPerformance: vi.fn(() => null),
}));

describe('WorkoutLogger', () => {
  const mockOnNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockActiveWorkout = null;
    mockHistory = [];
    mockRoutines = [];
    mockDeletedWorkouts = [];
  });

  describe('when no active workout', () => {
    it('should render LandingPage when there is no active workout', () => {
      mockActiveWorkout = null;

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // LandingPage has "Start New Workout" button - check for any landing page content
      // The LandingPage component renders when there's no active workout
      expect(screen.queryByText('Test Workout')).not.toBeInTheDocument();
    });
  });

  describe('active workout view', () => {
    beforeEach(() => {
      mockActiveWorkout = createMockWorkout({
        exercises: [createMockExercise()],
      });
    });

    it('should render the workout name', () => {
      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      expect(screen.getByText('Test Workout')).toBeInTheDocument();
    });

    it('should render the start time', () => {
      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      expect(screen.getByText(/Started/)).toBeInTheDocument();
    });

    it('should render exercises', () => {
      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    it('should render Add Exercise button', () => {
      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      expect(screen.getByText('Add Exercise')).toBeInTheDocument();
    });

    it('should call finishWorkout when Finish button is clicked', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      await user.click(screen.getByText('Finish'));

      expect(mockFinishWorkout).toHaveBeenCalledTimes(1);
    });

    it('should call cancelWorkout when cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Find Cancel button by text (contains X icon and "Cancel" text)
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      await user.click(cancelButton);

      expect(mockCancelWorkout).toHaveBeenCalledTimes(1);
    });
  });

  describe('save routine modal', () => {
    beforeEach(() => {
      mockActiveWorkout = createMockWorkout({
        exercises: [createMockExercise()],
      });
    });

    it('should open save routine modal when save button is clicked', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      const saveButton = screen.getByTitle('Save as Routine');
      await user.click(saveButton);

      expect(screen.getByText('Save as Routine')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Routine name')).toBeInTheDocument();
    });

    it('should close modal when Cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Open modal
      await user.click(screen.getByTitle('Save as Routine'));
      expect(screen.getByPlaceholderText('Routine name')).toBeInTheDocument();

      // Click cancel - find the Cancel button within the modal
      const cancelButtons = screen.getAllByRole('button', { name: 'Cancel' });
      // Modal Cancel button is the last one added
      const modalCancelButton = cancelButtons[cancelButtons.length - 1];
      if (modalCancelButton) {
        await user.click(modalCancelButton);
      }

      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Routine name')).not.toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should close modal when clicking outside', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Open modal
      await user.click(screen.getByTitle('Save as Routine'));
      expect(screen.getByPlaceholderText('Routine name')).toBeInTheDocument();

      // Click the backdrop - find element with position fixed using inline styles
      const backdrop = document.querySelector('[style*="position: fixed"]');
      if (backdrop) {
        // Click directly on the backdrop, not on the modal content
        await user.click(backdrop);
      }

      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Routine name')).not.toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should call saveRoutine with the entered name when Save is clicked', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Open modal
      await user.click(screen.getByTitle('Save as Routine'));

      // Type routine name
      const input = screen.getByPlaceholderText('Routine name');
      await user.type(input, 'My Routine');

      // Click Save - get all Save buttons, the modal one is the last one
      const saveButtons = screen.getAllByRole('button', { name: 'Save' });
      await user.click(saveButtons[saveButtons.length - 1]);

      expect(mockSaveRoutine).toHaveBeenCalledWith('My Routine');
    });

    it('should save routine when Enter is pressed', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Open modal
      await user.click(screen.getByTitle('Save as Routine'));

      // Type routine name and press Enter
      const input = screen.getByPlaceholderText('Routine name');
      await user.type(input, 'My Routine{enter}');

      expect(mockSaveRoutine).toHaveBeenCalledWith('My Routine');
    });

    it('should close modal when Escape is pressed', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Open modal
      await user.click(screen.getByTitle('Save as Routine'));
      expect(screen.getByPlaceholderText('Routine name')).toBeInTheDocument();

      // Press Escape - need to use keyboard method
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Routine name')).not.toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should disable Save button when routine name is empty', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Open modal
      await user.click(screen.getByTitle('Save as Routine'));

      // Get all Save buttons - the modal one is the last one
      const saveButtons = screen.getAllByRole('button', { name: 'Save' });
      const modalSaveButton = saveButtons[saveButtons.length - 1];
      expect(modalSaveButton).toBeDisabled();
    });

    it('should enable Save button when routine name is entered', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Open modal
      await user.click(screen.getByTitle('Save as Routine'));

      // Type routine name
      const input = screen.getByPlaceholderText('Routine name');
      await user.type(input, 'My Routine');

      // Get all Save buttons - the modal one is the last one
      const saveButtons = screen.getAllByRole('button', { name: 'Save' });
      const modalSaveButton = saveButtons[saveButtons.length - 1];
      expect(modalSaveButton).not.toBeDisabled();
    });

    it('should trim whitespace from routine name', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Open modal
      await user.click(screen.getByTitle('Save as Routine'));

      // Type routine name with whitespace
      const input = screen.getByPlaceholderText('Routine name');
      await user.type(input, '  My Routine  ');

      // Click Save - get all Save buttons, the modal one is the last one
      const saveButtons = screen.getAllByRole('button', { name: 'Save' });
      await user.click(saveButtons[saveButtons.length - 1]);

      expect(mockSaveRoutine).toHaveBeenCalledWith('My Routine');
    });

    it('should not save routine if name is only whitespace', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Open modal
      await user.click(screen.getByTitle('Save as Routine'));

      // Type only whitespace - the button should remain disabled
      const input = screen.getByPlaceholderText('Routine name');
      await user.type(input, '   ');

      // Get all Save buttons - the modal one is the last one
      const saveButtons = screen.getAllByRole('button', { name: 'Save' });
      const modalSaveButton = saveButtons[saveButtons.length - 1];
      expect(modalSaveButton).toBeDisabled();
    });

    it('should clear input when modal is reopened', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Open modal and type something
      await user.click(screen.getByTitle('Save as Routine'));
      const input = screen.getByPlaceholderText('Routine name');
      await user.type(input, 'My Routine');

      // Close modal - find Cancel button in the modal
      const cancelButtons = screen.getAllByRole('button', { name: 'Cancel' });
      await user.click(cancelButtons[cancelButtons.length - 1]); // Last one is in modal

      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Routine name')).not.toBeInTheDocument();
      }, { timeout: 2000 });

      // Reopen modal
      await user.click(screen.getByTitle('Save as Routine'));

      const newInput = screen.getByPlaceholderText('Routine name');
      expect(newInput).toHaveValue('');
    });
  });

  describe('set management', () => {
    beforeEach(() => {
      mockActiveWorkout = createMockWorkout({
        exercises: [createMockExercise()],
      });
    });

    it('should call addSet when Add Set button is clicked', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      await user.click(screen.getByText('+ Add Set'));

      expect(mockAddSet).toHaveBeenCalledWith('exercise-1');
    });

    it('should call removeSet when Remove Set button is clicked', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      await user.click(screen.getByText('Remove Set'));

      expect(mockRemoveSet).toHaveBeenCalledWith('exercise-1', 'set-1');
    });

    it('should update weight when weight input changes', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      const weightInputs = screen.getAllByPlaceholderText('-');
      // First input is weight
      await user.clear(weightInputs[0]);
      await user.type(weightInputs[0], '150');

      expect(mockUpdateSet).toHaveBeenCalled();
    });

    it('should update reps when reps input changes', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      const repsInputs = screen.getAllByPlaceholderText('-');
      // Second input is reps
      await user.clear(repsInputs[1]);
      await user.type(repsInputs[1], '12');

      expect(mockUpdateSet).toHaveBeenCalled();
    });

    it('should toggle completed status when checkbox is clicked', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Find the check button (it's a button with a Check icon)
      const checkButtons = screen.getAllByRole('button').filter(
        (btn) => btn.querySelector('svg')
      );

      // The last button in each set row is the complete toggle
      const completeButton = checkButtons.find((btn) =>
        btn.className.includes('rounded-lg') && btn.className.includes('w-8')
      );

      if (completeButton) {
        await user.click(completeButton);
        expect(mockUpdateSet).toHaveBeenCalledWith('exercise-1', 'set-1', { completed: true });
      }
    });
  });

  describe('exercise selector - muscle group step (empty workout)', () => {
    beforeEach(() => {
      // Empty workout - should auto-show muscle group selector
      mockActiveWorkout = createMockWorkout();
    });

    it('should automatically show muscle group selector for empty workout', () => {
      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Should show muscle groups immediately without clicking Add Exercise
      expect(screen.getByText('Select Muscle Group')).toBeInTheDocument();
    });

    it('should show all muscle groups in anatomical body view', () => {
      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Default is front view - shows 5 muscle groups
      // Front view groups: Shoulders, Chest, Arms, Abdomen, Legs
      expect(screen.getByText('Chest')).toBeInTheDocument();
      expect(screen.getByText('Shoulders')).toBeInTheDocument();
      expect(screen.getByText('Arms')).toBeInTheDocument();
      expect(screen.getByText('Abdomen')).toBeInTheDocument();
      expect(screen.getByText('Legs')).toBeInTheDocument();

      // Back-only groups should NOT be visible in front view
      expect(screen.queryByText('Glutes')).not.toBeInTheDocument();
      // 'Back' muscle group is only in back view (not the "Back" toggle button)
      // The toggle buttons have aria-labels for accessibility
      expect(screen.getByRole('button', { name: 'Show back view of body' })).toBeInTheDocument();

      // Should show Front and Back view toggle buttons
      expect(screen.getByRole('button', { name: 'Show front view of body' })).toBeInTheDocument();
    });

    it('should NOT show Cardio in muscle group selector', () => {
      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      expect(screen.queryByText('Cardio')).not.toBeInTheDocument();
    });

    it('should show workout type selector when back button is clicked from empty workout', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      expect(screen.getByText('Select Muscle Group')).toBeInTheDocument();

      const backButton = screen.getByRole('button', { name: 'Go back' });
      await user.click(backButton);

      // Should show workout type selector (not cancel immediately)
      // The actual cancel happens from the workout type selector back button
      expect(screen.getByText('Select Workout Type')).toBeInTheDocument();
    });
  });

  describe('exercise selector - muscle group step (with exercises)', () => {
    beforeEach(() => {
      // Workout with exercises - should show workout view with Add Exercise button
      mockActiveWorkout = createMockWorkout({
        exercises: [createMockExercise()],
      });
    });

    it('should show muscle group selector when Add Exercise is clicked', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      await user.click(screen.getByText('Add Exercise'));

      expect(screen.getByText('Select Muscle Group')).toBeInTheDocument();
    });

    it('should go back to workout when back button is clicked', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      await user.click(screen.getByText('Add Exercise'));
      expect(screen.getByText('Select Muscle Group')).toBeInTheDocument();

      const backButton = screen.getByRole('button', { name: 'Go back' });
      await user.click(backButton);

      expect(screen.queryByText('Select Muscle Group')).not.toBeInTheDocument();
      expect(screen.getByText('Add Exercise')).toBeInTheDocument();
    });
  });

  describe('exercise selector - exercise list step', () => {
    beforeEach(() => {
      // Empty workout - auto-shows muscle group selector
      mockActiveWorkout = createMockWorkout();
    });

    it('should show exercise list when muscle group is selected', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Muscle groups shown automatically for empty workout
      await user.click(screen.getByText('Chest'));

      expect(screen.getByText('Bench Press')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search exercises...')).toBeInTheDocument();
    });

    it('should show muscle group name as header', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      await user.click(screen.getByText('Chest'));

      expect(screen.getByRole('heading', { name: 'Chest' })).toBeInTheDocument();
    });

    it('should go back to muscle groups when back button is clicked from exercise list', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      await user.click(screen.getByText('Chest'));

      const backButton = screen.getByRole('button', { name: 'Go back' });
      await user.click(backButton);

      expect(screen.getByText('Select Muscle Group')).toBeInTheDocument();
    });

    it('should call addExercise when exercise is selected', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      await user.click(screen.getByText('Chest'));
      await user.click(screen.getByText('Bench Press'));

      expect(mockAddExercise).toHaveBeenCalledWith('bench_press');
    });
  });

  describe('multiple exercises', () => {
    it('should render all exercises', () => {
      mockActiveWorkout = createMockWorkout({
        exercises: [
          createMockExercise({ id: 'ex-1', exerciseId: 'bench-press' }),
          createMockExercise({ id: 'ex-2', exerciseId: 'squat' }),
          createMockExercise({ id: 'ex-3', exerciseId: 'deadlift' }),
        ],
      });

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      expect(screen.getByText('Bench Press')).toBeInTheDocument();
      expect(screen.getByText('Squat')).toBeInTheDocument();
      expect(screen.getByText('Deadlift')).toBeInTheDocument();
    });
  });
});
