import { describe, it, expect } from 'vitest';
import {
  getLastPerformance,
  calculateTotalVolume,
  getVolumeByWeek,
  getWorkoutFrequency,
  getExerciseProgress,
  getTotalWorkouts
} from './analyticsHelpers';
import type { Workout } from '../types';

describe('analyticsHelpers', () => {
  // Test data helpers
  const createWorkout = (overrides: Partial<Workout> = {}): Workout => ({
    id: 'workout-1',
    name: 'Test Workout',
    type: 'STRENGTH',
    startTime: Date.now(),
    exercises: [],
    status: 'completed',
    ...overrides
  });

  describe('getLastPerformance', () => {
    it('should return null for empty workout history', () => {
      const result = getLastPerformance([], 'exercise-1');
      expect(result).toBeNull();
    });

    it('should return null when exercise is not found', () => {
      const workouts = [
        createWorkout({
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [{ id: 'set-1', weight: 100, reps: 10, completed: true }]
          }]
        })
      ];

      const result = getLastPerformance(workouts, 'squat');
      expect(result).toBeNull();
    });

    it('should return the best set from the most recent workout', () => {
      const workouts = [
        createWorkout({
          startTime: Date.now(),
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [
              { id: 'set-1', weight: 100, reps: 10, completed: true },
              { id: 'set-2', weight: 110, reps: 8, completed: true },
              { id: 'set-3', weight: 105, reps: 9, completed: true }
            ]
          }]
        })
      ];

      const result = getLastPerformance(workouts, 'bench-press');
      expect(result).toEqual({
        weight: 110,
        reps: 8,
        date: expect.any(String)
      });
    });

    it('should ignore incomplete sets', () => {
      const workouts = [
        createWorkout({
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [
              { id: 'set-1', weight: 120, reps: 5, completed: false },
              { id: 'set-2', weight: 100, reps: 10, completed: true }
            ]
          }]
        })
      ];

      const result = getLastPerformance(workouts, 'bench-press');
      expect(result?.weight).toBe(100);
    });

    it('should ignore sets with missing weight or reps', () => {
      const workouts = [
        createWorkout({
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [
              { id: 'set-1', weight: undefined, reps: 10, completed: true },
              { id: 'set-2', weight: 100, reps: undefined, completed: true },
              { id: 'set-3', weight: 90, reps: 8, completed: true }
            ]
          }]
        })
      ];

      const result = getLastPerformance(workouts, 'bench-press');
      expect(result?.weight).toBe(90);
      expect(result?.reps).toBe(8);
    });

    it('should return null when no completed sets exist', () => {
      const workouts = [
        createWorkout({
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [
              { id: 'set-1', weight: 100, reps: 10, completed: false }
            ]
          }]
        })
      ];

      const result = getLastPerformance(workouts, 'bench-press');
      expect(result).toBeNull();
    });
  });

  describe('calculateTotalVolume', () => {
    it('should return 0 for empty workout array', () => {
      expect(calculateTotalVolume([])).toBe(0);
    });

    it('should calculate total volume correctly', () => {
      const workouts = [
        createWorkout({
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [
              { id: 'set-1', weight: 100, reps: 10, completed: true },
              { id: 'set-2', weight: 100, reps: 8, completed: true }
            ]
          }]
        })
      ];

      // (100 * 10) + (100 * 8) = 1800
      expect(calculateTotalVolume(workouts)).toBe(1800);
    });

    it('should handle multiple exercises in one workout', () => {
      const workouts = [
        createWorkout({
          exercises: [
            {
              id: 'ex-1',
              exerciseId: 'bench-press',
              sets: [{ id: 'set-1', weight: 100, reps: 10, completed: true }]
            },
            {
              id: 'ex-2',
              exerciseId: 'squat',
              sets: [{ id: 'set-2', weight: 200, reps: 5, completed: true }]
            }
          ]
        })
      ];

      // (100 * 10) + (200 * 5) = 2000
      expect(calculateTotalVolume(workouts)).toBe(2000);
    });

    it('should handle multiple workouts', () => {
      const workouts = [
        createWorkout({
          id: 'w1',
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [{ id: 'set-1', weight: 100, reps: 10, completed: true }]
          }]
        }),
        createWorkout({
          id: 'w2',
          exercises: [{
            id: 'ex-2',
            exerciseId: 'squat',
            sets: [{ id: 'set-2', weight: 150, reps: 8, completed: true }]
          }]
        })
      ];

      // (100 * 10) + (150 * 8) = 2200
      expect(calculateTotalVolume(workouts)).toBe(2200);
    });

    it('should ignore incomplete sets', () => {
      const workouts = [
        createWorkout({
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [
              { id: 'set-1', weight: 100, reps: 10, completed: true },
              { id: 'set-2', weight: 100, reps: 10, completed: false }
            ]
          }]
        })
      ];

      expect(calculateTotalVolume(workouts)).toBe(1000);
    });

    it('should ignore sets with missing weight or reps', () => {
      const workouts = [
        createWorkout({
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [
              { id: 'set-1', weight: 100, reps: 10, completed: true },
              { id: 'set-2', weight: undefined, reps: 10, completed: true },
              { id: 'set-3', weight: 100, reps: undefined, completed: true }
            ]
          }]
        })
      ];

      expect(calculateTotalVolume(workouts)).toBe(1000);
    });

    it('should handle very large volumes', () => {
      const workouts = [
        createWorkout({
          exercises: [{
            id: 'ex-1',
            exerciseId: 'leg-press',
            sets: [{ id: 'set-1', weight: 999, reps: 999, completed: true }]
          }]
        })
      ];

      expect(calculateTotalVolume(workouts)).toBe(998001);
    });
  });

  describe('getVolumeByWeek', () => {
    it('should return empty array for no workouts', () => {
      expect(getVolumeByWeek([])).toEqual([]);
    });

    it('should aggregate volume by week', () => {
      const mondayMs = new Date('2024-01-01').getTime(); // Jan 1, 2024 is a Monday
      const tuesdayMs = new Date('2024-01-02').getTime();

      const workouts = [
        createWorkout({
          startTime: mondayMs,
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [{ id: 'set-1', weight: 100, reps: 10, completed: true }]
          }]
        }),
        createWorkout({
          startTime: tuesdayMs,
          exercises: [{
            id: 'ex-2',
            exerciseId: 'squat',
            sets: [{ id: 'set-2', weight: 150, reps: 5, completed: true }]
          }]
        })
      ];

      const result = getVolumeByWeek(workouts);
      expect(result).toHaveLength(1);
      expect(result[0].volume).toBe(1750); // 1000 + 750
    });

    it('should return last 8 weeks only', () => {
      const workouts = Array.from({ length: 20 }, (_, i) => {
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        return createWorkout({
          id: `w${i}`,
          startTime: Date.now() - (i * weekMs),
          exercises: [{
            id: `ex-${i}`,
            exerciseId: 'bench-press',
            sets: [{ id: `set-${i}`, weight: 100, reps: 10, completed: true }]
          }]
        });
      });

      const result = getVolumeByWeek(workouts);
      expect(result.length).toBeLessThanOrEqual(8);
    });

    it('should format week dates correctly', () => {
      const workouts = [
        createWorkout({
          startTime: new Date('2024-01-15').getTime(),
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [{ id: 'set-1', weight: 100, reps: 10, completed: true }]
          }]
        })
      ];

      const result = getVolumeByWeek(workouts);
      expect(result[0].week).toMatch(/\w{3} \d+/); // e.g., "Jan 14"
    });
  });

  describe('getWorkoutFrequency', () => {
    it('should return zero counts for empty workout array', () => {
      const result = getWorkoutFrequency([]);
      expect(result.total).toBe(0);
      expect(result.byType).toEqual({ STRENGTH: 0, CARDIO: 0, HIIT: 0 });
    });

    it('should count workouts by type', () => {
      const now = Date.now();
      const workouts = [
        createWorkout({ type: 'STRENGTH', startTime: now }),
        createWorkout({ type: 'STRENGTH', startTime: now }),
        createWorkout({ type: 'CARDIO', startTime: now }),
        createWorkout({ type: 'HIIT', startTime: now })
      ];

      const result = getWorkoutFrequency(workouts, 'month');
      expect(result.total).toBe(4);
      expect(result.byType.STRENGTH).toBe(2);
      expect(result.byType.CARDIO).toBe(1);
      expect(result.byType.HIIT).toBe(1);
    });

    it('should filter by week period', () => {
      const now = Date.now();
      const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = now - (14 * 24 * 60 * 60 * 1000);

      const workouts = [
        createWorkout({ startTime: now }),
        createWorkout({ startTime: weekAgo - 1000 }), // Just outside week
        createWorkout({ startTime: twoWeeksAgo })
      ];

      const result = getWorkoutFrequency(workouts, 'week');
      expect(result.total).toBe(1);
    });

    it('should filter by month period', () => {
      const now = Date.now();
      const monthAgo = now - (30 * 24 * 60 * 60 * 1000);

      const workouts = [
        createWorkout({ startTime: now }),
        createWorkout({ startTime: monthAgo - 1000 }) // Just outside month
      ];

      const result = getWorkoutFrequency(workouts, 'month');
      expect(result.total).toBe(1);
    });

    it('should filter by year period', () => {
      const now = Date.now();
      const yearAgo = now - (365 * 24 * 60 * 60 * 1000);

      const workouts = [
        createWorkout({ startTime: now }),
        createWorkout({ startTime: yearAgo - 1000 }) // Just outside year
      ];

      const result = getWorkoutFrequency(workouts, 'year');
      expect(result.total).toBe(1);
    });

    it('should default missing type to STRENGTH', () => {
      const workouts = [
        createWorkout({ type: undefined as any, startTime: Date.now() })
      ];

      const result = getWorkoutFrequency(workouts, 'month');
      expect(result.byType.STRENGTH).toBe(1);
    });
  });

  describe('getExerciseProgress', () => {
    it('should return empty array when exercise not found', () => {
      const workouts = [
        createWorkout({
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [{ id: 'set-1', weight: 100, reps: 10, completed: true }]
          }]
        })
      ];

      const result = getExerciseProgress(workouts, 'squat');
      expect(result).toEqual([]);
    });

    it('should return max weight per workout', () => {
      const workouts = [
        createWorkout({
          startTime: new Date('2024-01-01').getTime(),
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [
              { id: 'set-1', weight: 100, reps: 10, completed: true },
              { id: 'set-2', weight: 110, reps: 8, completed: true }
            ]
          }]
        })
      ];

      const result = getExerciseProgress(workouts, 'bench-press');
      expect(result).toHaveLength(1);
      expect(result[0].maxWeight).toBe(110);
    });

    it('should track progress over multiple workouts', () => {
      const workouts = [
        createWorkout({
          id: 'w1',
          startTime: new Date('2024-01-01').getTime(),
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [{ id: 'set-1', weight: 100, reps: 10, completed: true }]
          }]
        }),
        createWorkout({
          id: 'w2',
          startTime: new Date('2024-01-08').getTime(),
          exercises: [{
            id: 'ex-2',
            exerciseId: 'bench-press',
            sets: [{ id: 'set-2', weight: 110, reps: 10, completed: true }]
          }]
        })
      ];

      const result = getExerciseProgress(workouts, 'bench-press');
      expect(result).toHaveLength(2);
      expect(result[0].maxWeight).toBe(100);
      expect(result[1].maxWeight).toBe(110);
    });

    it('should sort results by date', () => {
      const workouts = [
        createWorkout({
          id: 'w2',
          startTime: new Date('2024-01-08').getTime(),
          exercises: [{
            id: 'ex-2',
            exerciseId: 'bench-press',
            sets: [{ id: 'set-2', weight: 110, reps: 10, completed: true }]
          }]
        }),
        createWorkout({
          id: 'w1',
          startTime: new Date('2024-01-01').getTime(),
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [{ id: 'set-1', weight: 100, reps: 10, completed: true }]
          }]
        })
      ];

      const result = getExerciseProgress(workouts, 'bench-press');
      expect(result[0].maxWeight).toBe(100); // Earlier date first
      expect(result[1].maxWeight).toBe(110);
    });

    it('should ignore incomplete sets', () => {
      const workouts = [
        createWorkout({
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [
              { id: 'set-1', weight: 120, reps: 5, completed: false },
              { id: 'set-2', weight: 100, reps: 10, completed: true }
            ]
          }]
        })
      ];

      const result = getExerciseProgress(workouts, 'bench-press');
      expect(result[0].maxWeight).toBe(100);
    });

    it('should skip workouts with no completed sets', () => {
      const workouts = [
        createWorkout({
          id: 'w1',
          startTime: new Date('2024-01-01').getTime(),
          exercises: [{
            id: 'ex-1',
            exerciseId: 'bench-press',
            sets: [{ id: 'set-1', weight: 100, reps: 10, completed: false }]
          }]
        }),
        createWorkout({
          id: 'w2',
          startTime: new Date('2024-01-08').getTime(),
          exercises: [{
            id: 'ex-2',
            exerciseId: 'bench-press',
            sets: [{ id: 'set-2', weight: 110, reps: 10, completed: true }]
          }]
        })
      ];

      const result = getExerciseProgress(workouts, 'bench-press');
      expect(result).toHaveLength(1);
      expect(result[0].maxWeight).toBe(110);
    });
  });

  describe('getTotalWorkouts', () => {
    it('should return 0 for empty array', () => {
      expect(getTotalWorkouts([])).toBe(0);
    });

    it('should count all workouts when no options provided', () => {
      const workouts = [
        createWorkout(),
        createWorkout(),
        createWorkout()
      ];

      expect(getTotalWorkouts(workouts)).toBe(3);
    });

    it('should filter by workout type', () => {
      const workouts = [
        createWorkout({ type: 'STRENGTH' }),
        createWorkout({ type: 'STRENGTH' }),
        createWorkout({ type: 'CARDIO' }),
        createWorkout({ type: 'HIIT' })
      ];

      expect(getTotalWorkouts(workouts, { type: 'STRENGTH' })).toBe(2);
      expect(getTotalWorkouts(workouts, { type: 'CARDIO' })).toBe(1);
      expect(getTotalWorkouts(workouts, { type: 'HIIT' })).toBe(1);
    });

    it('should filter by time period', () => {
      const now = Date.now();
      const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
      const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
      const yearAgo = now - (365 * 24 * 60 * 60 * 1000);

      const workouts = [
        createWorkout({ startTime: now }),
        createWorkout({ startTime: weekAgo - 1000 }),
        createWorkout({ startTime: monthAgo - 1000 }),
        createWorkout({ startTime: yearAgo - 1000 })
      ];

      expect(getTotalWorkouts(workouts, { period: 'week' })).toBe(1);
      expect(getTotalWorkouts(workouts, { period: 'month' })).toBe(2);
      expect(getTotalWorkouts(workouts, { period: 'year' })).toBe(3);
      expect(getTotalWorkouts(workouts, { period: 'all' })).toBe(4);
    });

    it('should filter by both type and period', () => {
      const now = Date.now();
      const weekAgo = now - (7 * 24 * 60 * 60 * 1000);

      const workouts = [
        createWorkout({ type: 'STRENGTH', startTime: now }),
        createWorkout({ type: 'CARDIO', startTime: now }),
        createWorkout({ type: 'STRENGTH', startTime: weekAgo - 1000 })
      ];

      expect(getTotalWorkouts(workouts, { type: 'STRENGTH', period: 'week' })).toBe(1);
      expect(getTotalWorkouts(workouts, { type: 'CARDIO', period: 'week' })).toBe(1);
    });

    it('should return all workouts when period is "all"', () => {
      const workouts = [
        createWorkout({ startTime: Date.now() - (400 * 24 * 60 * 60 * 1000) }),
        createWorkout({ startTime: Date.now() })
      ];

      expect(getTotalWorkouts(workouts, { period: 'all' })).toBe(2);
    });
  });
});
