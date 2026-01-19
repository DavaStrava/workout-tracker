import type { Workout } from '../types';

/**
 * Get the last performance for a specific exercise
 * Returns the most recent set data (weight/reps) for the given exercise
 */
export function getLastPerformance(
    history: Workout[],
    exerciseId: string
): { weight: number; reps: number; date: string } | null {
    // Search through history from most recent to oldest
    for (const workout of history) {
        const exerciseLog = workout.exercises.find(e => e.exerciseId === exerciseId);
        if (exerciseLog && exerciseLog.sets.length > 0) {
            // Find the heaviest set with actual data (weight > 0 and reps > 0)
            const validSets = exerciseLog.sets.filter(s => s.weight && s.weight > 0 && s.reps && s.reps > 0);
            if (validSets.length > 0) {
                const bestSet = validSets.reduce((best, current) =>
                    (current.weight || 0) > (best.weight || 0) ? current : best
                );
                return {
                    weight: bestSet.weight || 0,
                    reps: bestSet.reps || 0,
                    date: new Date(workout.startTime).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                    })
                };
            }
        }
    }
    return null;
}

/**
 * Calculate total volume (weight × reps) for a list of workouts
 * Counts all sets with actual weight and reps data
 */
export function calculateTotalVolume(workouts: Workout[]): number {
    return workouts.reduce((total, workout) => {
        return total + workout.exercises.reduce((wTotal, exercise) => {
            return wTotal + exercise.sets.reduce((sTotal, set) => {
                // Count sets with actual data (weight > 0 and reps > 0)
                if (set.weight && set.weight > 0 && set.reps && set.reps > 0) {
                    return sTotal + (set.weight * set.reps);
                }
                return sTotal;
            }, 0);
        }, 0);
    }, 0);
}

/**
 * Get weekly volume data for charting
 */
export function getVolumeByWeek(workouts: Workout[]): { week: string; volume: number }[] {
    const weeklyData: Record<string, number> = {};

    workouts.forEach(workout => {
        const date = new Date(workout.startTime);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
        const weekKey = weekStart.toISOString().split('T')[0];

        const volume = workout.exercises.reduce((total, ex) => {
            return total + ex.sets.reduce((setTotal, set) => {
                // Count sets with actual data (weight > 0 and reps > 0)
                if (set.weight && set.weight > 0 && set.reps && set.reps > 0) {
                    return setTotal + (set.weight * set.reps);
                }
                return setTotal;
            }, 0);
        }, 0);

        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + volume;
    });

    // Sort by date and return last 8 weeks
    return Object.entries(weeklyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-8)
        .map(([week, volume]) => ({
            week: new Date(week).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            volume
        }));
}

/**
 * Get workout frequency breakdown by type
 */
export function getWorkoutFrequency(
    workouts: Workout[],
    period: 'week' | 'month' | 'year' = 'month'
): { total: number; byType: Record<string, number> } {
    const now = Date.now();
    const periodMs = period === 'week' ? 7 * 24 * 60 * 60 * 1000
        : period === 'month' ? 30 * 24 * 60 * 60 * 1000
            : 365 * 24 * 60 * 60 * 1000;

    const filtered = workouts.filter(w => (now - w.startTime) <= periodMs);

    const byType: Record<string, number> = { STRENGTH: 0, CARDIO: 0, HIIT: 0 };
    filtered.forEach(w => {
        byType[w.type || 'STRENGTH'] = (byType[w.type || 'STRENGTH'] || 0) + 1;
    });

    return { total: filtered.length, byType };
}

/**
 * Get max weight trend for a specific exercise
 */
export function getExerciseProgress(
    workouts: Workout[],
    exerciseId: string
): { date: string; maxWeight: number }[] {
    const data: { date: string; maxWeight: number; timestamp: number }[] = [];

    workouts.forEach(workout => {
        const exerciseLog = workout.exercises.find(e => e.exerciseId === exerciseId);
        if (exerciseLog) {
            // Filter sets with actual weight data (weight > 0)
            const validSets = exerciseLog.sets.filter(s => s.weight && s.weight > 0);
            if (validSets.length > 0) {
                const maxWeight = Math.max(...validSets.map(s => s.weight || 0));
                data.push({
                    date: new Date(workout.startTime).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                    }),
                    maxWeight,
                    timestamp: workout.startTime
                });
            }
        }
    });

    // Sort by date and return
    return data
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(({ date, maxWeight }) => ({ date, maxWeight }));
}

/**
 * Get total workout count with optional type and time period filters
 */
export function getTotalWorkouts(
    workouts: Workout[],
    options?: {
        type?: 'STRENGTH' | 'CARDIO' | 'HIIT';
        period?: 'week' | 'month' | 'year' | 'all';
    }
): number {
    let filtered = workouts;

    // Filter by time period
    if (options?.period && options.period !== 'all') {
        const now = Date.now();
        const periodMs = options.period === 'week' ? 7 * 24 * 60 * 60 * 1000
            : options.period === 'month' ? 30 * 24 * 60 * 60 * 1000
                : 365 * 24 * 60 * 60 * 1000;
        filtered = filtered.filter(w => (now - w.startTime) <= periodMs);
    }

    // Filter by type
    if (options?.type) {
        filtered = filtered.filter(w => w.type === options.type);
    }

    return filtered.length;
}

/**
 * Get average workout duration in minutes
 */
export function getAverageDuration(workouts: Workout[]): number {
    const withDuration = workouts.filter(w => w.duration !== undefined && w.duration > 0);
    if (withDuration.length === 0) return 0;

    const totalSeconds = withDuration.reduce((sum, w) => sum + (w.duration || 0), 0);
    return Math.round(totalSeconds / withDuration.length / 60);
}

/**
 * Get duration stats (min, max, average) in minutes
 */
export function getDurationStats(workouts: Workout[]): { min: number; max: number; avg: number } {
    const withDuration = workouts.filter(w => w.duration !== undefined && w.duration > 0);
    if (withDuration.length === 0) return { min: 0, max: 0, avg: 0 };

    const durations = withDuration.map(w => (w.duration || 0) / 60); // Convert to minutes
    return {
        min: Math.round(Math.min(...durations)),
        max: Math.round(Math.max(...durations)),
        avg: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
    };
}

/**
 * Get weekly average duration for charting
 */
export function getDurationByWeek(workouts: Workout[]): { week: string; avgDuration: number }[] {
    const weeklyData: Record<string, { total: number; count: number }> = {};

    workouts.forEach(workout => {
        if (!workout.duration) return;

        const date = new Date(workout.startTime);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = { total: 0, count: 0 };
        }
        weeklyData[weekKey].total += workout.duration;
        weeklyData[weekKey].count += 1;
    });

    return Object.entries(weeklyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-8)
        .map(([week, data]) => ({
            week: new Date(week).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            avgDuration: Math.round(data.total / data.count / 60), // Minutes
        }));
}
