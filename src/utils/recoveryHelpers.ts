import type { Workout, BodyArea } from '../types';
import { EXERCISES } from '../data/exercises';

// Recovery constants
const FULL_RECOVERY_HOURS = 72; // 3 days for full recovery

// All strength-training muscle groups (excludes Cardio)
const STRENGTH_BODY_AREAS: BodyArea[] = [
  'Chest', 'Shoulders', 'Biceps', 'Triceps', 'Forearms',
  'Lats', 'Upper Back', 'Traps', 'Lower Back',
  'Quads', 'Hamstrings', 'Glutes', 'Calves',
  'Abs', 'Obliques'
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
      const exerciseInfo = EXERCISES.find(e => e.id === exercise.exerciseId);
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
 */
export function getRecoveryColor(percent: number): RecoveryColorScheme {
  if (percent >= 100) {
    // Fresh - Bright pink/red
    return {
      fill: '#f7418c',
      glow: 'rgba(247, 65, 140, 0.5)',
    };
  } else if (percent >= 75) {
    // Almost recovered - Medium pink
    return {
      fill: '#c44a7a',
      glow: 'rgba(196, 74, 122, 0.3)',
    };
  } else if (percent >= 50) {
    // Mid recovery - Purple-pink
    return {
      fill: '#8b4a6b',
      glow: 'rgba(139, 74, 107, 0.2)',
    };
  } else if (percent >= 25) {
    // Low recovery - Dark purple
    return {
      fill: '#5a4a5a',
      glow: 'none',
    };
  } else {
    // Fatigued - Very dark
    return {
      fill: '#3d3452',
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
