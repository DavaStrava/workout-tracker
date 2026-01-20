import type { Workout, MuscleGroup } from '../types';
import { EXERCISES } from '../data/exercises';

// Recovery constants for PRIMARY muscles
// Using a non-linear recovery curve: fast phase (0-48h: 0%→80%), slow phase (48-72h: 80%→100%)
const PRIMARY_FULL_RECOVERY_HOURS = 72;
const PRIMARY_FAST_PHASE_HOURS = 48;
const FAST_PHASE_RECOVERY = 80; // 80% recovered after fast phase (OK to train)

// Recovery constants for SECONDARY muscles (half the time)
// Fast phase (0-24h: 0%→80%), slow phase (24-36h: 80%→100%)
const SECONDARY_FULL_RECOVERY_HOURS = 36;
const SECONDARY_FAST_PHASE_HOURS = 24;

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
 * @param isPrimary - true for primary muscles (48/72h), false for secondary (24/36h)
 */
function calculateRecoveryPercent(hoursSince: number, isPrimary: boolean): number {
  const fullRecoveryHours = isPrimary ? PRIMARY_FULL_RECOVERY_HOURS : SECONDARY_FULL_RECOVERY_HOURS;
  const fastPhaseHours = isPrimary ? PRIMARY_FAST_PHASE_HOURS : SECONDARY_FAST_PHASE_HOURS;

  if (hoursSince >= fullRecoveryHours) return 100;
  if (hoursSince <= fastPhaseHours) {
    // Fast recovery phase (0% → 80%)
    return Math.round((hoursSince / fastPhaseHours) * FAST_PHASE_RECOVERY);
  }
  // Slow recovery phase (80% → 100%)
  const slowPhaseHours = fullRecoveryHours - fastPhaseHours;
  const slowPhaseProgress = (hoursSince - fastPhaseHours) / slowPhaseHours;
  return Math.round(FAST_PHASE_RECOVERY + slowPhaseProgress * (100 - FAST_PHASE_RECOVERY));
}

/**
 * Format time remaining until a target recovery percentage.
 * @param isPrimary - true for primary muscles (48/72h), false for secondary (24/36h)
 */
export function formatTimeToRecovery(hoursSince: number, targetPercent: number = 80, isPrimary: boolean = true): string {
  const fullRecoveryHours = isPrimary ? PRIMARY_FULL_RECOVERY_HOURS : SECONDARY_FULL_RECOVERY_HOURS;
  const fastPhaseHours = isPrimary ? PRIMARY_FAST_PHASE_HOURS : SECONDARY_FAST_PHASE_HOURS;

  // Calculate hours needed to reach target
  let hoursNeeded: number;

  if (targetPercent <= FAST_PHASE_RECOVERY) {
    // Target is within fast phase
    hoursNeeded = (targetPercent / FAST_PHASE_RECOVERY) * fastPhaseHours;
  } else {
    // Target is in slow phase
    const slowPhaseTarget = (targetPercent - FAST_PHASE_RECOVERY) / (100 - FAST_PHASE_RECOVERY);
    const slowPhaseHours = fullRecoveryHours - fastPhaseHours;
    hoursNeeded = fastPhaseHours + slowPhaseTarget * slowPhaseHours;
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
  isPrimary: boolean; // true if worked as primary muscle, false if secondary only
}

export interface RecoveryStats {
  lastWorkoutDaysAgo: number | null;
  freshMuscleCount: number;
  totalMuscleGroups: number;
  muscleData: Record<MuscleGroup, MuscleRecoveryData>;
}

// Track fatigue data per muscle for proper primary/secondary handling
interface MuscleFatigueInfo {
  workoutTime: number;
  isPrimary: boolean; // true = primary (48/72h recovery), false = secondary (24/36h recovery)
}

/**
 * Calculate muscle recovery status for all granular muscle groups based on workout history.
 * Tracks both primary and secondary muscles from exercises.
 * - Primary muscles: 48h → 80% (OK to train), 72h → 100% (fully recovered)
 * - Secondary muscles: 24h → 80% (OK to train), 36h → 100% (fully recovered)
 */
export function calculateMuscleRecovery(history: Workout[]): RecoveryStats {
  const now = Date.now();

  // Build exercise lookup map for O(1) access
  const exerciseMap = new Map(EXERCISES.map(e => [e.id, e]));

  // First pass: collect the most recent training for each muscle, tracking if primary or secondary
  const muscleFatigue: Record<string, MuscleFatigueInfo> = {};

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

      // Process primary muscles
      for (const muscle of primary) {
        if (!STRENGTH_MUSCLE_GROUPS.includes(muscle)) continue;
        updateMuscleFatigue(muscleFatigue, muscle, workoutTime, true);
      }

      // Process secondary muscles
      for (const muscle of secondary) {
        if (!STRENGTH_MUSCLE_GROUPS.includes(muscle)) continue;
        updateMuscleFatigue(muscleFatigue, muscle, workoutTime, false);
      }
    }
  }

  // Second pass: calculate recovery based on collected fatigue data
  const muscleData: Record<MuscleGroup, MuscleRecoveryData> = {} as Record<MuscleGroup, MuscleRecoveryData>;

  for (const muscle of STRENGTH_MUSCLE_GROUPS) {
    const fatigueInfo = muscleFatigue[muscle];

    if (fatigueInfo) {
      const hoursSince = (now - fatigueInfo.workoutTime) / (1000 * 60 * 60);
      const recoveryPercent = calculateRecoveryPercent(hoursSince, fatigueInfo.isPrimary);

      muscleData[muscle] = {
        muscleGroup: muscle,
        recoveryPercent,
        lastTrainedDate: new Date(fatigueInfo.workoutTime),
        hoursSinceTraining: hoursSince,
        isFresh: recoveryPercent >= 100,
        isPrimary: fatigueInfo.isPrimary,
      };
    } else {
      // Never trained - fully recovered
      muscleData[muscle] = {
        muscleGroup: muscle,
        recoveryPercent: 100,
        lastTrainedDate: null,
        hoursSinceTraining: null,
        isFresh: true,
        isPrimary: true, // Default to primary (doesn't matter since fully recovered)
      };
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
 * Update muscle fatigue tracking.
 * For the same workout time, primary beats secondary (longer recovery).
 * For different workout times, keeps the more recent.
 */
function updateMuscleFatigue(
  muscleFatigue: Record<string, MuscleFatigueInfo>,
  muscle: MuscleGroup,
  workoutTime: number,
  isPrimary: boolean
): void {
  const existing = muscleFatigue[muscle];

  if (!existing) {
    // First time seeing this muscle
    muscleFatigue[muscle] = { workoutTime, isPrimary };
  } else if (workoutTime > existing.workoutTime) {
    // More recent workout - always update
    muscleFatigue[muscle] = { workoutTime, isPrimary };
  } else if (workoutTime === existing.workoutTime && isPrimary && !existing.isPrimary) {
    // Same workout but this is primary and existing is secondary - upgrade to primary
    muscleFatigue[muscle] = { workoutTime, isPrimary: true };
  }
  // Otherwise: older workout or same workout with same/lower priority - ignore
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
