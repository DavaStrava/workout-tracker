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
 * Calculate volume for a workout
 */
function calculateWorkoutVolume(workout: Workout): number {
    return workout.exercises.reduce((total, ex) => {
        return total + ex.sets.reduce((setTotal, set) => {
            if (set.weight && set.weight > 0 && set.reps && set.reps > 0) {
                return setTotal + (set.weight * set.reps);
            }
            return setTotal;
        }, 0);
    }, 0);
}

/**
 * Get a local date key (YYYY-MM-DD) for consistent lookups
 */
function getLocalDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Get the start of the week (Sunday) for a given date
 */
function getWeekStart(date: Date): Date {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
}

/**
 * Get daily volume data for charting (last 7 days)
 */
export function getVolumeByDay(workouts: Workout[]): { label: string; volume: number }[] {
    const dailyData: Record<string, number> = {};

    workouts.forEach(workout => {
        const date = new Date(workout.startTime);
        const dayKey = getLocalDateKey(date);
        dailyData[dayKey] = (dailyData[dayKey] || 0) + calculateWorkoutVolume(workout);
    });

    // Generate last 7 days
    const days: { label: string; volume: number }[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        const dayKey = getLocalDateKey(day);
        days.push({
            label: day.toLocaleDateString(undefined, { weekday: 'short' }),
            volume: dailyData[dayKey] || 0
        });
    }

    return days;
}

/**
 * Get weekly volume data for charting (last 4 weeks)
 */
export function getVolumeByWeek(workouts: Workout[]): { label: string; volume: number }[] {
    const weeklyData: Record<string, number> = {};

    workouts.forEach(workout => {
        const date = new Date(workout.startTime);
        const weekStart = getWeekStart(date);
        const weekKey = getLocalDateKey(weekStart);
        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + calculateWorkoutVolume(workout);
    });

    // Generate last 4 weeks
    const weeks: { label: string; volume: number }[] = [];
    const now = new Date();
    const currentWeekStart = getWeekStart(now);

    for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(currentWeekStart);
        weekStart.setDate(currentWeekStart.getDate() - (i * 7));
        const weekKey = getLocalDateKey(weekStart);
        weeks.push({
            label: weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            volume: weeklyData[weekKey] || 0
        });
    }

    return weeks;
}

/**
 * Get monthly volume data for charting (last 12 months)
 */
export function getVolumeByMonth(workouts: Workout[]): { label: string; volume: number }[] {
    const monthlyData: Record<string, number> = {};

    workouts.forEach(workout => {
        const date = new Date(workout.startTime);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + calculateWorkoutVolume(workout);
    });

    // Generate last 12 months
    const months: { label: string; volume: number }[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
        months.push({
            label: month.toLocaleDateString(undefined, { month: 'short' }),
            volume: monthlyData[monthKey] || 0
        });
    }

    return months;
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
 * Get daily duration for charting (last 7 days)
 */
export function getDurationByDay(workouts: Workout[]): { label: string; duration: number }[] {
    const dailyData: Record<string, { total: number; count: number }> = {};

    workouts.forEach(workout => {
        if (!workout.duration) return;
        const date = new Date(workout.startTime);
        const dayKey = getLocalDateKey(date);
        if (!dailyData[dayKey]) {
            dailyData[dayKey] = { total: 0, count: 0 };
        }
        dailyData[dayKey].total += workout.duration;
        dailyData[dayKey].count += 1;
    });

    const days: { label: string; duration: number }[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        const dayKey = getLocalDateKey(day);
        const data = dailyData[dayKey];
        days.push({
            label: day.toLocaleDateString(undefined, { weekday: 'short' }),
            duration: data ? Math.round(data.total / data.count / 60) : 0
        });
    }

    return days;
}

/**
 * Get weekly duration for charting (last 4 weeks)
 */
export function getDurationByWeek(workouts: Workout[]): { label: string; duration: number }[] {
    const weeklyData: Record<string, { total: number; count: number }> = {};

    workouts.forEach(workout => {
        if (!workout.duration) return;
        const date = new Date(workout.startTime);
        const weekStart = getWeekStart(date);
        const weekKey = getLocalDateKey(weekStart);
        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = { total: 0, count: 0 };
        }
        weeklyData[weekKey].total += workout.duration;
        weeklyData[weekKey].count += 1;
    });

    const weeks: { label: string; duration: number }[] = [];
    const now = new Date();
    const currentWeekStart = getWeekStart(now);

    for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(currentWeekStart);
        weekStart.setDate(currentWeekStart.getDate() - (i * 7));
        const weekKey = getLocalDateKey(weekStart);
        const data = weeklyData[weekKey];
        weeks.push({
            label: weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            duration: data ? Math.round(data.total / data.count / 60) : 0
        });
    }

    return weeks;
}

/**
 * Get monthly duration for charting (last 12 months)
 */
export function getDurationByMonth(workouts: Workout[]): { label: string; duration: number }[] {
    const monthlyData: Record<string, { total: number; count: number }> = {};

    workouts.forEach(workout => {
        if (!workout.duration) return;
        const date = new Date(workout.startTime);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { total: 0, count: 0 };
        }
        monthlyData[monthKey].total += workout.duration;
        monthlyData[monthKey].count += 1;
    });

    const months: { label: string; duration: number }[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
        const data = monthlyData[monthKey];
        months.push({
            label: month.toLocaleDateString(undefined, { month: 'short' }),
            duration: data ? Math.round(data.total / data.count / 60) : 0
        });
    }

    return months;
}
