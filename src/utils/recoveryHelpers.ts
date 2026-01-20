import type { Workout, MuscleGroup } from '../types';
import { EXERCISES } from '../data/exercises';

// Recovery constants
// Using a non-linear recovery curve: fast phase (0-24h: 0%→80%), slow phase (24-36h: 80%→100%)
const FULL_RECOVERY_HOURS = 36;
const FAST_PHASE_HOURS = 24;
const FAST_PHASE_RECOVERY = 80; // 80% recovered after fast phase (OK to train)

// Secondary muscles recover faster since they're worked less intensely
// We apply a multiplier to simulate less fatigue (e.g., 0.5 = half the fatigue)
const SECONDARY_MUSCLE_FATIGUE_FACTOR = 0.5;

// All granular muscle groups for strength training (18 muscles - excludes Hip Flexors as minor)
const STRENGTH_MUSCLE_GROUPS: MuscleGroup[] = [
  // Chest
  'Chest',
  // Shoulders
  'Anterior Deltoid', 'Lateral Deltoid', 'Posterior Deltoid',
  // Arms
  'Biceps', 'Triceps', 'Forearms',
  // Abdomen
  'Abs', 'Obliques',
  // Back
  'Lats', 'Upper Back', 'Traps', 'Lower Back',
  // Glutes
  'Glutes',
  // Legs
  'Quads', 'Hamstrings', 'Calves',
];

/**
 * Calculate recovery percentage using non-linear formula.
 * Fast phase (0-48h): 0% → 80% (linear)
 * Slow phase (48-72h): 80% → 100% (linear)
 */
function calculateRecoveryPercent(hoursSince: number): number {
  if (hoursSince >= FULL_RECOVERY_HOURS) return 100;
  if (hoursSince <= FAST_PHASE_HOURS) {
    // 0-48h: Fast recovery phase (0% → 80%)
    return Math.round((hoursSince / FAST_PHASE_HOURS) * FAST_PHASE_RECOVERY);
  }
  // 48-72h: Slower recovery phase (80% → 100%)
  const slowPhaseHours = FULL_RECOVERY_HOURS - FAST_PHASE_HOURS;
  const slowPhaseProgress = (hoursSince - FAST_PHASE_HOURS) / slowPhaseHours;
  return Math.round(FAST_PHASE_RECOVERY + slowPhaseProgress * (100 - FAST_PHASE_RECOVERY));
}

/**
 * Format time remaining until a target recovery percentage.
 * Returns format like "8h" or "1d".
 */
export function formatTimeToRecovery(hoursSince: number, targetPercent: number = 80): string {
  // Calculate hours needed to reach target
  let hoursNeeded: number;

  if (targetPercent <= FAST_PHASE_RECOVERY) {
    // Target is within fast phase
    hoursNeeded = (targetPercent / FAST_PHASE_RECOVERY) * FAST_PHASE_HOURS;
  } else {
    // Target is in slow phase
    const slowPhaseTarget = (targetPercent - FAST_PHASE_RECOVERY) / (100 - FAST_PHASE_RECOVERY);
    const slowPhaseHours = FULL_RECOVERY_HOURS - FAST_PHASE_HOURS;
    hoursNeeded = FAST_PHASE_HOURS + slowPhaseTarget * slowPhaseHours;
  }

  const hoursLeft = Math.max(0, Math.round(hoursNeeded - hoursSince));
  return `${hoursLeft} hrs`;
}

export interface MuscleRecoveryData {
  muscleGroup: MuscleGroup;
  recoveryPercent: number;
  lastTrainedDate: Date | null;
  hoursSinceTraining: number | null;
  isFresh: boolean;
}

export interface RecoveryStats {
  lastWorkoutDaysAgo: number | null;
  freshMuscleCount: number;
  totalMuscleGroups: number;
  muscleData: Record<MuscleGroup, MuscleRecoveryData>;
}

/**
 * Calculate muscle recovery status for all granular muscle groups based on workout history.
 * Tracks both primary and secondary muscles from exercises.
 * Secondary muscles receive reduced fatigue (recover faster).
 * Recovery uses non-linear formula:
 * - 0-24h: Fast phase (0% → 80%) - OK to train
 * - 24-36h: Slow phase (80% → 100%) - Fully recovered
 */
export function calculateMuscleRecovery(history: Workout[]): RecoveryStats {
  const now = Date.now();

  // Initialize all muscle groups as fully recovered
  const muscleData: Record<MuscleGroup, MuscleRecoveryData> = {} as Record<MuscleGroup, MuscleRecoveryData>;

  for (const muscle of STRENGTH_MUSCLE_GROUPS) {
    muscleData[muscle] = {
      muscleGroup: muscle,
      recoveryPercent: 100,
      lastTrainedDate: null,
      hoursSinceTraining: null,
      isFresh: true,
    };
  }

  // Build exercise lookup map for O(1) access
  const exerciseMap = new Map(EXERCISES.map(e => [e.id, e]));

  // Find the most recent training for each muscle group
  for (const workout of history) {
    if (workout.type !== 'STRENGTH' || workout.status !== 'completed') continue;

    for (const exercise of workout.exercises) {
      const exerciseInfo = exerciseMap.get(exercise.exerciseId);
      if (!exerciseInfo || exerciseInfo.bodyArea === 'Cardio') continue;

      // Only count exercises with at least one completed set
      const hasCompletedSets = exercise.sets.some(s => s.completed);
      if (!hasCompletedSets) continue;

      const workoutTime = workout.endTime || workout.startTime;

      // Get primary and secondary muscles trained by this exercise
      const { primary, secondary } = getMusclesFromExercise(exerciseInfo);

      // Process primary muscles (full fatigue)
      for (const muscle of primary) {
        if (!STRENGTH_MUSCLE_GROUPS.includes(muscle)) continue;
        updateMuscleRecovery(muscleData, muscle, workoutTime, now, 1.0);
      }

      // Process secondary muscles (reduced fatigue)
      for (const muscle of secondary) {
        if (!STRENGTH_MUSCLE_GROUPS.includes(muscle)) continue;
        updateMuscleRecovery(muscleData, muscle, workoutTime, now, SECONDARY_MUSCLE_FATIGUE_FACTOR);
      }
    }
  }

  // Calculate summary stats
  const freshCount = Object.values(muscleData).filter(m => m.isFresh).length;

  // Find most recent strength workout
  const lastStrengthWorkout = history.find(w => w.type === 'STRENGTH' && w.status === 'completed');
  const lastWorkoutDaysAgo = lastStrengthWorkout
    ? Math.floor((now - (lastStrengthWorkout.endTime || lastStrengthWorkout.startTime)) / (1000 * 60 * 60 * 24))
    : null;

  return {
    lastWorkoutDaysAgo,
    freshMuscleCount: freshCount,
    totalMuscleGroups: STRENGTH_MUSCLE_GROUPS.length,
    muscleData,
  };
}

/**
 * Update muscle recovery data for a specific muscle.
 * Only updates if this workout is more recent than what we've seen.
 * @param fatigueFactor - 1.0 for primary muscles, 0.5 for secondary (recovers faster)
 */
function updateMuscleRecovery(
  muscleData: Record<MuscleGroup, MuscleRecoveryData>,
  muscle: MuscleGroup,
  workoutTime: number,
  now: number,
  fatigueFactor: number
): void {
  const existingData = muscleData[muscle];

  // Only update if this workout is more recent than what we've seen
  if (!existingData.lastTrainedDate || workoutTime > existingData.lastTrainedDate.getTime()) {
    const hoursSince = (now - workoutTime) / (1000 * 60 * 60);

    // Apply fatigue factor: secondary muscles accumulate less fatigue
    // Effectively, we scale the recovery time down (they recover faster)
    const effectiveHoursSince = hoursSince / fatigueFactor;

    const recoveryPercent = calculateRecoveryPercent(effectiveHoursSince);

    muscleData[muscle] = {
      muscleGroup: muscle,
      recoveryPercent,
      lastTrainedDate: new Date(workoutTime),
      hoursSinceTraining: hoursSince,
      isFresh: recoveryPercent >= 100,
    };
  }
}

/**
 * Get the granular muscles trained by an exercise.
 * Returns both primary and secondary muscles separately.
 * Uses primaryMuscles/secondaryMuscles if available, otherwise maps bodyArea to defaults.
 */
function getMusclesFromExercise(exerciseInfo: {
  bodyArea: string;
  primaryMuscles?: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[]
}): { primary: MuscleGroup[]; secondary: MuscleGroup[] } {
  // Fallback mapping from bodyArea to default muscle groups
  const bodyAreaToMuscle: Record<string, MuscleGroup[]> = {
    'Chest': ['Chest'],
    'Shoulders': ['Anterior Deltoid', 'Lateral Deltoid', 'Posterior Deltoid'],
    'Arms': ['Biceps', 'Triceps', 'Forearms'],
    'Abdomen': ['Abs', 'Obliques'],
    'Back': ['Lats', 'Upper Back', 'Traps', 'Lower Back'],
    'Glutes': ['Glutes'],
    'Legs': ['Quads', 'Hamstrings', 'Calves'],
  };

  // Get primary muscles
  const primary = exerciseInfo.primaryMuscles?.length
    ? exerciseInfo.primaryMuscles
    : (bodyAreaToMuscle[exerciseInfo.bodyArea] || []);

  // Get secondary muscles (empty array if not defined)
  const secondary = exerciseInfo.secondaryMuscles || [];

  return { primary, secondary };
}

export interface RecoveryColorScheme {
  fill: string;
  glow: string;
}

/**
 * Get the color scheme for a muscle based on its recovery percentage.
 * Colors inspired by Fitbod: bright red for fresh, dark purple for fatigued.
 */
export function getRecoveryColor(percent: number): RecoveryColorScheme {
  if (percent >= 100) {
    // Fresh - Bright red (like Fitbod)
    return {
      fill: '#ff4d6d',
      glow: 'rgba(255, 77, 109, 0.6)',
    };
  } else if (percent >= 75) {
    // Almost recovered - Coral red
    return {
      fill: '#e05578',
      glow: 'rgba(224, 85, 120, 0.4)',
    };
  } else if (percent >= 50) {
    // Mid recovery - Muted pink
    return {
      fill: '#a85a7a',
      glow: 'rgba(168, 90, 122, 0.2)',
    };
  } else if (percent >= 25) {
    // Low recovery - Purple
    return {
      fill: '#6b4d7a',
      glow: 'none',
    };
  } else {
    // Fatigued - Dark purple (like body silhouette)
    return {
      fill: '#4a3d5c',
      glow: 'none',
    };
  }
}

/**
 * Get list of strength muscle groups for iteration.
 */
export function getStrengthMuscleGroups(): MuscleGroup[] {
  return [...STRENGTH_MUSCLE_GROUPS];
}
