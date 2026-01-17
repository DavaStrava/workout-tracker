import type { Workout, BodyArea } from '../types';
import { EXERCISES } from '../data/exercises';

// Recovery constants
// Based on exercise science: muscle protein synthesis typically completes within 48-72 hours.
// Using 72 hours (3 days) as a conservative estimate for full recovery.
// Source: https://pubmed.ncbi.nlm.nih.gov/8563679/
const FULL_RECOVERY_HOURS = 72;

// Pre-compute exercise lookup map for O(1) access instead of O(n) find()
const EXERCISE_MAP = new Map(EXERCISES.map(e => [e.id, e]));

// All strength-training muscle groups (excludes Cardio)
const STRENGTH_BODY_AREAS: BodyArea[] = [
  'Chest', 'Shoulders', 'Arms', 'Abdomen', 'Back', 'Glutes', 'Legs'
];

export interface MuscleRecoveryData {
  bodyArea: BodyArea;
  recoveryPercent: number;
  lastTrainedDate: Date | null;
  hoursSinceTraining: number | null;
  isFresh: boolean;
}

export interface RecoveryStats {
  lastWorkoutDaysAgo: number | null;
  freshMuscleCount: number;
  totalMuscleGroups: number;
  muscleData: Record<BodyArea, MuscleRecoveryData>;
}

/**
 * Calculate muscle recovery status for all muscle groups based on workout history.
 * Recovery is linear: 0% immediately after workout, 100% after FULL_RECOVERY_HOURS.
 */
export function calculateMuscleRecovery(history: Workout[]): RecoveryStats {
  const now = Date.now();

  // Initialize all muscle groups as fully recovered
  const muscleData: Record<BodyArea, MuscleRecoveryData> = {} as Record<BodyArea, MuscleRecoveryData>;

  for (const area of STRENGTH_BODY_AREAS) {
    muscleData[area] = {
      bodyArea: area,
      recoveryPercent: 100,
      lastTrainedDate: null,
      hoursSinceTraining: null,
      isFresh: true,
    };
  }

  // Find the most recent training for each muscle group
  for (const workout of history) {
    if (workout.type !== 'STRENGTH' || workout.status !== 'completed') continue;

    for (const exercise of workout.exercises) {
      const exerciseInfo = EXERCISE_MAP.get(exercise.exerciseId);
      if (!exerciseInfo || exerciseInfo.bodyArea === 'Cardio') continue;

      // Only count exercises with at least one completed set
      const hasCompletedSets = exercise.sets.some(s => s.completed);
      if (!hasCompletedSets) continue;

      const area = exerciseInfo.bodyArea as BodyArea;
      const existingData = muscleData[area];
      const workoutTime = workout.endTime || workout.startTime;

      // Only update if this workout is more recent than what we've seen
      if (!existingData.lastTrainedDate || workoutTime > existingData.lastTrainedDate.getTime()) {
        const hoursSince = (now - workoutTime) / (1000 * 60 * 60);

        // Linear recovery from 0% to 100% over FULL_RECOVERY_HOURS
        const recoveryPercent = Math.min(100, Math.round((hoursSince / FULL_RECOVERY_HOURS) * 100));

        muscleData[area] = {
          bodyArea: area,
          recoveryPercent,
          lastTrainedDate: new Date(workoutTime),
          hoursSinceTraining: hoursSince,
          isFresh: recoveryPercent >= 100,
        };
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
    totalMuscleGroups: STRENGTH_BODY_AREAS.length,
    muscleData,
  };
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
 * Get list of strength body areas for iteration.
 */
export function getStrengthBodyAreas(): BodyArea[] {
  return [...STRENGTH_BODY_AREAS];
}
