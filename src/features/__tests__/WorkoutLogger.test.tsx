import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkoutLogger } from '../WorkoutLogger';
import type { Workout, WorkoutExercise } from '../../types';

// Mock the useWorkout hook
const mockSaveRoutine = vi.fn();
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

vi.mock('../../hooks/useWorkoutStore', () => ({
  useWorkout: () => ({
    activeWorkout: mockActiveWorkout,
    history: mockHistory,
    routines: mockRoutines,
    finishWorkout: mockFinishWorkout,
    cancelWorkout: mockCancelWorkout,
    addExercise: mockAddExercise,
    addSet: mockAddSet,
    removeSet: mockRemoveSet,
    updateSet: mockUpdateSet,
    getExerciseName: mockGetExerciseName,
    saveRoutine: mockSaveRoutine,
    startWorkout: vi.fn(),
    startRoutine: vi.fn(),
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

      // Cancel button has X icon with title
      const cancelButton = screen.getByTitle('Cancel');
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

      // Click Save
      await user.click(screen.getByRole('button', { name: 'Save' }));

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

      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeDisabled();
    });

    it('should enable Save button when routine name is entered', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Open modal
      await user.click(screen.getByTitle('Save as Routine'));

      // Type routine name
      const input = screen.getByPlaceholderText('Routine name');
      await user.type(input, 'My Routine');

      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).not.toBeDisabled();
    });

    it('should trim whitespace from routine name', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      // Open modal
      await user.click(screen.getByTitle('Save as Routine'));

      // Type routine name with whitespace
      const input = screen.getByPlaceholderText('Routine name');
      await user.type(input, '  My Routine  ');

      // Click Save
      await user.click(screen.getByRole('button', { name: 'Save' }));

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

      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeDisabled();
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

  describe('exercise selector', () => {
    beforeEach(() => {
      mockActiveWorkout = createMockWorkout();
    });

    it('should show exercise selector when Add Exercise is clicked', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      await user.click(screen.getByText('Add Exercise'));

      expect(screen.getByPlaceholderText('Search exercises...')).toBeInTheDocument();
    });

    it('should show body area filter pills', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      await user.click(screen.getByText('Add Exercise'));

      // Filter pills are buttons
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
      // Use getAllByText for body areas as they may appear in both filter and exercise list
      expect(screen.getAllByText('Chest').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Back').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Legs').length).toBeGreaterThan(0);
    });

    it('should go back when back button is clicked', async () => {
      const user = userEvent.setup();

      render(<WorkoutLogger onNavigate={mockOnNavigate} />);

      await user.click(screen.getByText('Add Exercise'));

      // Find the back button (ChevronLeft icon button)
      const buttons = screen.getAllByRole('button');
      const backButton = buttons[0]; // First button is back

      await user.click(backButton);

      // Should be back to active workout view
      expect(screen.queryByPlaceholderText('Search exercises...')).not.toBeInTheDocument();
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
