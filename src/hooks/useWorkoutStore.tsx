import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import type { Workout, WorkoutExercise, Routine, WorkoutType, CardioIntensity, Exercise } from '../types';
import { EXERCISES } from '../data/exercises';
import { auth } from '../config/firebase';
import {
    subscribeToWorkouts,
    subscribeToRoutines,
    subscribeToActiveWorkout,
    saveActiveWorkout as saveActiveWorkoutToFirestore,
    saveRoutine as saveRoutineToFirestore,
    saveRoutineAndWorkoutAtomic,
    deleteRoutine as deleteRoutineFromFirestore,
    migrateLocalDataToFirestore,
    finishWorkoutAtomic,
    softDeleteWorkoutInFirestore,
    restoreWorkoutInFirestore,
    permanentlyDeleteWorkoutInFirestore,
    updateWorkoutInFirestore,
    resumeFinishedWorkoutAtomic,
} from '../services/firestore';

// Error with retry capability
export interface RetryableError {
    id: string;
    message: string;
    retry: () => Promise<void>;
}

interface WorkoutContextType {
    activeWorkout: Workout | null;
    history: Workout[];
    deletedWorkouts: Workout[];
    routines: Routine[];
    user: User | null;
    isLoading: boolean;
    editingWorkout: Workout | null;
    isWorkoutPaused: boolean;
    lastError: RetryableError | null;
    lastFinishedWorkout: Workout | null;
    canResumeLastWorkout: boolean;
    justFinishedWorkoutId: string | null;
    clearError: () => void;
    clearJustFinished: () => void;
    startWorkout: (name?: string, type?: WorkoutType) => void;
    finishWorkout: () => Promise<void>;
    cancelWorkout: () => Promise<void>;
    pauseWorkout: () => Promise<void>;
    resumeWorkout: () => Promise<void>;
    resumeFinishedWorkout: () => Promise<void>;
    addExercise: (exerciseId: string) => Promise<void>;
    updateSet: (exerciseInstanceId: string, setId: string, updates: Partial<{ reps: number; weight: number; distance: number; duration: number; intensity: CardioIntensity; completed: boolean }>) => Promise<void>;
    updateNotes: (notes: string) => Promise<void>;
    getExerciseInfo: (id: string) => Exercise | undefined;
    addSet: (exerciseInstanceId: string) => Promise<void>;
    removeSet: (exerciseInstanceId: string, setId: string) => Promise<void>;
    getExerciseName: (id: string) => string;
    saveRoutine: (name: string) => Promise<{ error?: string }>;
    updateRoutine: () => Promise<{ error?: string }>;
    startRoutine: (routineId: string) => Promise<void>;
    deleteRoutine: (routineId: string) => Promise<void>;
    softDeleteWorkout: (workoutId: string) => Promise<void>;
    restoreWorkout: (workoutId: string) => Promise<void>;
    permanentlyDeleteWorkout: (workoutId: string) => Promise<void>;
    startEditWorkout: (workoutId: string) => void;
    updateEditingSet: (exerciseInstanceId: string, setId: string, updates: Partial<{ reps: number; weight: number; distance: number; duration: number; intensity: CardioIntensity }>) => void;
    addEditingSet: (exerciseInstanceId: string) => void;
    removeEditingSet: (exerciseInstanceId: string, setId: string) => void;
    saveEditedWorkout: () => Promise<{ error?: string }>;
    cancelEdit: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Time to wait for Firestore subscription to settle after optimistic updates (ms)
const SUBSCRIPTION_SETTLE_DELAY_MS = 2000;

// Time window for resuming a finished workout (5 minutes)
const RESUME_WINDOW_MS = 5 * 60 * 1000;

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeWorkout, setActiveWorkout] = useState<Workout | null>(() => {
        const saved = localStorage.getItem('activeWorkout');
        return saved ? JSON.parse(saved) : null;
    });

    const [history, setHistory] = useState<Workout[]>(() => {
        const saved = localStorage.getItem('workoutHistory');
        return saved ? JSON.parse(saved) : [];
    });

    const [routines, setRoutines] = useState<Routine[]>(() => {
        const saved = localStorage.getItem('routines');
        return saved ? JSON.parse(saved) : [];
    });

    // Track if we've migrated localStorage data
    const [hasMigrated, setHasMigrated] = useState(() => {
        return localStorage.getItem('hasFirebaseMigration') === 'true';
    });

    // Editing workout state
    const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

    // Track the workout ID that was just finished (for showing resume toast)
    const [justFinishedWorkoutId, setJustFinishedWorkoutId] = useState<string | null>(null);
    const clearJustFinished = () => setJustFinishedWorkoutId(null);

    // Error state with retry capability
    const [lastError, setLastError] = useState<RetryableError | null>(null);
    const clearError = () => setLastError(null);

    // Capture initial localStorage values for migration (to avoid stale closure issues)
    const initialDataRef = useRef({
        workouts: history,
        routines: routines,
        activeWorkout: activeWorkout,
    });

    // Track when we're finishing a workout to prevent subscription race conditions
    const isFinishingWorkoutRef = useRef(false);

    // Track timeout IDs for cleanup on unmount
    const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Track if we've run the expired workout cleanup for this user session
    const hasCleanedUpExpiredRef = useRef<string | null>(null);

    // Track latest history for cleanup function (avoids stale closure)
    const historyRef = useRef(history);
    historyRef.current = history;

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (settleTimeoutRef.current) {
                clearTimeout(settleTimeoutRef.current);
            }
        };
    }, []);

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    // Migrate localStorage data to Firestore on first login
    useEffect(() => {
        const migrateData = async () => {
            if (user && !hasMigrated) {
                // Use initial data captured at mount to avoid stale closures
                const { workouts: localWorkouts, routines: localRoutines, activeWorkout: localActiveWorkout } = initialDataRef.current;

                if (localWorkouts.length > 0 || localRoutines.length > 0 || localActiveWorkout) {
                    console.log('Migrating local data to Firestore...');
                    const { error } = await migrateLocalDataToFirestore(
                        user.uid,
                        localWorkouts,
                        localRoutines,
                        localActiveWorkout
                    );

                    if (!error) {
                        localStorage.setItem('hasFirebaseMigration', 'true');
                        setHasMigrated(true);
                        console.log('Migration successful!');
                    } else {
                        console.error('Migration failed:', error);
                    }
                }
            }
        };

        migrateData();
    }, [user, hasMigrated]);

    // Subscribe to Firestore updates when user is authenticated
    useEffect(() => {
        if (!user) {
            // Not authenticated, keep using localStorage
            return;
        }

        // Subscribe to workouts
        const unsubscribeWorkouts = subscribeToWorkouts(
            user.uid,
            (workouts) => {
                setHistory(workouts);
                // Also update localStorage for offline support
                localStorage.setItem('workoutHistory', JSON.stringify(workouts));
            },
            (error) => {
                console.error('Workout subscription error:', error);
                setLastError({
                    id: crypto.randomUUID(),
                    message: 'Failed to sync workout history. Please check your connection.',
                    retry: async () => {
                        clearError();
                        // Trigger re-subscription by forcing a state update
                        window.location.reload();
                    },
                });
            }
        );

        // Subscribe to routines
        const unsubscribeRoutines = subscribeToRoutines(
            user.uid,
            (routines) => {
                setRoutines(routines);
                // Also update localStorage for offline support
                localStorage.setItem('routines', JSON.stringify(routines));
            },
            (error) => {
                console.error('Routines subscription error:', error);
                // Routines are less critical, just log without blocking UI
            }
        );

        // Subscribe to active workout
        const unsubscribeActiveWorkout = subscribeToActiveWorkout(
            user.uid,
            (workout) => {
                // Ignore subscription updates while we're finishing a workout
                // This prevents race conditions where stale data overwrites our optimistic update
                if (isFinishingWorkoutRef.current) {
                    return;
                }
                setActiveWorkout(workout);
                // Also update localStorage for offline support
                if (workout) {
                    localStorage.setItem('activeWorkout', JSON.stringify(workout));
                } else {
                    localStorage.removeItem('activeWorkout');
                }
            },
            (error) => {
                console.error('Active workout subscription error:', error);
                setLastError({
                    id: crypto.randomUUID(),
                    message: 'Failed to sync active workout. Please check your connection.',
                    retry: async () => {
                        clearError();
                        window.location.reload();
                    },
                });
            }
        );

        return () => {
            unsubscribeWorkouts();
            unsubscribeRoutines();
            unsubscribeActiveWorkout();
        };
    }, [user]);

    // Always sync state to localStorage for offline support and persistence
    useEffect(() => {
        if (activeWorkout) {
            localStorage.setItem('activeWorkout', JSON.stringify(activeWorkout));
        } else {
            localStorage.removeItem('activeWorkout');
        }
    }, [activeWorkout]);

    useEffect(() => {
        localStorage.setItem('workoutHistory', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem('routines', JSON.stringify(routines));
    }, [routines]);

    const startWorkout = (name?: string, type: WorkoutType = 'STRENGTH') => {
        // Generate date-formatted name if not provided
        const workoutName = name ?? (() => {
            const now = new Date();
            const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
            const dateStr = now.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: '2-digit'
            });
            return `${dayName} Workout (${dateStr})`;
        })();

        const newWorkout: Workout = {
            id: crypto.randomUUID(),
            name: workoutName,
            type,
            startTime: Date.now(),
            totalPausedTime: 0,
            exercises: [],
            status: 'active',
            fromRoutine: false,
        };
        setActiveWorkout(newWorkout);
    };

    const finishWorkout = async () => {
        if (!activeWorkout) return;
        const previousWorkout = activeWorkout;
        const endTime = Date.now();

        // Calculate duration: total elapsed - paused time - current pause (if any)
        let totalPausedMs = (activeWorkout.totalPausedTime || 0) * 1000;
        if (activeWorkout.pausedAt) {
            totalPausedMs += (endTime - activeWorkout.pausedAt);
        }
        const durationSeconds = Math.floor((endTime - activeWorkout.startTime - totalPausedMs) / 1000);

        const completedWorkout = {
            ...activeWorkout,
            endTime,
            duration: durationSeconds,
            pausedAt: undefined,
            status: 'completed' as const,
        };

        // Set flag to prevent subscription from overwriting our optimistic update
        isFinishingWorkoutRef.current = true;

        // Optimistic update - update local state immediately for responsive UI
        setHistory(prev => [completedWorkout, ...prev]);
        setActiveWorkout(null);

        if (user) {
            // Sync to Firestore
            const { error } = await finishWorkoutAtomic(user.uid, completedWorkout);
            if (error) {
                // Rollback optimistic update on failure
                console.error('Failed to finish workout:', error);
                setHistory(prev => prev.filter(w => w.id !== completedWorkout.id));
                setActiveWorkout(previousWorkout);
                isFinishingWorkoutRef.current = false;

                // Set error with retry capability
                setLastError({
                    id: crypto.randomUUID(),
                    message: 'Failed to save workout. Please try again.',
                    retry: async () => {
                        clearError();
                        await finishWorkout();
                    },
                });
                return;
            }
        }

        // Track the just-finished workout for resume toast
        setJustFinishedWorkoutId(completedWorkout.id);

        // Clear the flag after a short delay to allow Firestore subscription to settle
        if (settleTimeoutRef.current) {
            clearTimeout(settleTimeoutRef.current);
        }
        settleTimeoutRef.current = setTimeout(() => {
            isFinishingWorkoutRef.current = false;
        }, SUBSCRIPTION_SETTLE_DELAY_MS);
    };

    const cancelWorkout = async () => {
        const previousWorkout = activeWorkout;

        // Set flag to prevent subscription from overwriting our update
        isFinishingWorkoutRef.current = true;

        setActiveWorkout(null);

        if (user) {
            // Delete from Firestore
            const { error } = await saveActiveWorkoutToFirestore(user.uid, null);
            if (error) {
                // Rollback on failure
                console.error('Failed to cancel workout:', error);
                setActiveWorkout(previousWorkout);
                isFinishingWorkoutRef.current = false;
                return;
            }
        }

        // Clear the flag after a short delay
        if (settleTimeoutRef.current) {
            clearTimeout(settleTimeoutRef.current);
        }
        settleTimeoutRef.current = setTimeout(() => {
            isFinishingWorkoutRef.current = false;
        }, SUBSCRIPTION_SETTLE_DELAY_MS);
    };

    // Resume a finished workout (undo finish within 5 minutes)
    const resumeFinishedWorkout = async () => {
        // Find the last finished workout within the resume window
        const now = Date.now();
        const resumableWorkout = history.find(w =>
            w.endTime &&
            !w.deletedAt &&
            w.status === 'completed' &&
            (now - w.endTime) < RESUME_WINDOW_MS
        );

        if (!resumableWorkout || activeWorkout) return;

        const previousHistory = [...history];

        // Create resumed workout (strip endTime, duration, reset status)
        const resumedWorkout: Workout = {
            ...resumableWorkout,
            endTime: undefined,
            duration: undefined,
            status: 'active',
        };

        // Set flag to prevent subscription from overwriting our optimistic update
        isFinishingWorkoutRef.current = true;

        // Optimistic update - remove from history and set as active
        setHistory(prev => prev.filter(w => w.id !== resumableWorkout.id));
        setActiveWorkout(resumedWorkout);
        setJustFinishedWorkoutId(null);

        if (user) {
            // Sync to Firestore atomically
            const { error } = await resumeFinishedWorkoutAtomic(user.uid, resumableWorkout.id, resumedWorkout);
            if (error) {
                // Rollback optimistic update on failure
                console.error('Failed to resume workout:', error);
                setHistory(previousHistory);
                setActiveWorkout(null);
                isFinishingWorkoutRef.current = false;

                // Set error with retry capability
                setLastError({
                    id: crypto.randomUUID(),
                    message: 'Failed to resume workout. Please try again.',
                    retry: async () => {
                        clearError();
                        await resumeFinishedWorkout();
                    },
                });
                return;
            }
        }

        // Clear the flag after a short delay to allow Firestore subscription to settle
        if (settleTimeoutRef.current) {
            clearTimeout(settleTimeoutRef.current);
        }
        settleTimeoutRef.current = setTimeout(() => {
            isFinishingWorkoutRef.current = false;
        }, SUBSCRIPTION_SETTLE_DELAY_MS);
    };

    const pauseWorkout = async () => {
        if (!activeWorkout || activeWorkout.pausedAt) return; // Already paused or no workout

        const updatedWorkout = { ...activeWorkout, pausedAt: Date.now() };
        setActiveWorkout(updatedWorkout);

        if (user) {
            await saveActiveWorkoutToFirestore(user.uid, updatedWorkout);
        }
    };

    const resumeWorkout = async () => {
        if (!activeWorkout || !activeWorkout.pausedAt) return; // Not paused

        const pauseDuration = Math.floor((Date.now() - activeWorkout.pausedAt) / 1000);
        const updatedWorkout = {
            ...activeWorkout,
            pausedAt: undefined,
            totalPausedTime: (activeWorkout.totalPausedTime || 0) + pauseDuration,
        };
        setActiveWorkout(updatedWorkout);

        if (user) {
            await saveActiveWorkoutToFirestore(user.uid, updatedWorkout);
        }
    };

    const addExercise = async (exerciseId: string) => {
        if (!activeWorkout) return;
        // Auto-complete sets for fresh workouts (not from routine)
        const autoComplete = !activeWorkout.fromRoutine;
        const newExercise: WorkoutExercise = {
            id: crypto.randomUUID(),
            exerciseId,
            sets: [{ id: crypto.randomUUID(), reps: 0, weight: 0, completed: autoComplete }],
            addedAt: Date.now(),
        };
        const updatedWorkout = { ...activeWorkout, exercises: [...activeWorkout.exercises, newExercise] };

        // Optimistic update
        setActiveWorkout(updatedWorkout);

        if (user) {
            await saveActiveWorkoutToFirestore(user.uid, updatedWorkout);
        }
    };

    const addSet = async (exerciseInstanceId: string) => {
        if (!activeWorkout) return;
        // Auto-complete sets for fresh workouts (not from routine)
        const autoComplete = !activeWorkout.fromRoutine;

        const updatedWorkout = {
            ...activeWorkout,
            exercises: activeWorkout.exercises.map(e => {
                if (e.id !== exerciseInstanceId) return e;
                // Copy previous set values for convenience, or 0
                const lastSet = e.sets[e.sets.length - 1];
                return {
                    ...e,
                    sets: [...e.sets, {
                        id: crypto.randomUUID(),
                        reps: lastSet?.reps ?? 0,
                        weight: lastSet?.weight ?? 0,
                        distance: lastSet?.distance ?? 0,
                        duration: lastSet?.duration ?? 0,
                        completed: autoComplete
                    }]
                };
            })
        };

        // Optimistic update
        setActiveWorkout(updatedWorkout);

        if (user) {
            await saveActiveWorkoutToFirestore(user.uid, updatedWorkout);
        }
    }

    const removeSet = async (exerciseInstanceId: string, setId: string) => {
        if (!activeWorkout) return;

        const updatedWorkout = {
            ...activeWorkout,
            exercises: activeWorkout.exercises.map(e => {
                if (e.id !== exerciseInstanceId) return e;
                return { ...e, sets: e.sets.filter(s => s.id !== setId) };
            }).filter(e => e.sets.length > 0)
        };

        // Optimistic update
        setActiveWorkout(updatedWorkout);

        if (user) {
            await saveActiveWorkoutToFirestore(user.uid, updatedWorkout);
        }
    };

    const updateSet = async (exerciseInstanceId: string, setId: string, updates: Partial<{ reps: number; weight: number; distance: number; duration: number; intensity: CardioIntensity; completed: boolean }>) => {
        if (!activeWorkout) return;

        const updatedWorkout = {
            ...activeWorkout,
            exercises: activeWorkout.exercises.map(ex => {
                if (ex.id !== exerciseInstanceId) return ex;
                return {
                    ...ex,
                    sets: ex.sets.map(s => s.id === setId ? { ...s, ...updates } : s)
                };
            })
        };

        // Optimistic update
        setActiveWorkout(updatedWorkout);

        if (user) {
            await saveActiveWorkoutToFirestore(user.uid, updatedWorkout);
        }
    };

    const updateNotes = async (notes: string) => {
        if (!activeWorkout) return;

        const updatedWorkout = { ...activeWorkout, notes };

        // Optimistic update
        setActiveWorkout(updatedWorkout);

        if (user) {
            await saveActiveWorkoutToFirestore(user.uid, updatedWorkout);
        }
    };

    const getExerciseInfo = (id: string): Exercise | undefined => EXERCISES.find(e => e.id === id);

    const getExerciseName = (id: string) => getExerciseInfo(id)?.name || 'Unknown Exercise';

    // Routine Logic
    const saveRoutine = async (name: string): Promise<{ error?: string }> => {
        if (!activeWorkout) return { error: 'No active workout' };

        // Check for duplicate routine name
        const normalizedName = name.trim().toLowerCase();
        const duplicateExists = routines.some(r => r.name.toLowerCase() === normalizedName);
        if (duplicateExists) {
            return { error: 'A routine with this name already exists' };
        }

        const newRoutine: Routine = {
            id: crypto.randomUUID(),
            name,
            exercises: activeWorkout.exercises.map(e => ({
                exerciseId: e.exerciseId,
                sets: e.sets.length
            }))
        };

        // Store previous state for potential rollback
        const previousWorkout = activeWorkout;

        // Optimistic update - add routine and update workout with routineId and new name
        setRoutines(prev => [...prev, newRoutine]);
        const updatedWorkout = { ...activeWorkout, name, routineId: newRoutine.id };
        setActiveWorkout(updatedWorkout);

        if (user) {
            // Use atomic batch write to ensure both operations succeed or fail together
            const { error } = await saveRoutineAndWorkoutAtomic(user.uid, newRoutine, updatedWorkout);
            if (error) {
                // Rollback optimistic updates on failure
                console.error('Failed to save routine:', error);
                setRoutines(prev => prev.filter(r => r.id !== newRoutine.id));
                setActiveWorkout(previousWorkout);
                return { error };
            }
        }

        return {};
    };

    // Update an existing routine with current workout exercises
    const updateRoutine = async (): Promise<{ error?: string }> => {
        if (!activeWorkout || !activeWorkout.routineId) return { error: 'No routine to update' };

        const routine = routines.find(r => r.id === activeWorkout.routineId);
        if (!routine) return { error: 'Routine not found' };

        const updatedRoutine: Routine = {
            ...routine,
            exercises: activeWorkout.exercises.map(e => ({
                exerciseId: e.exerciseId,
                sets: e.sets.length
            }))
        };

        // Optimistic update
        setRoutines(prev => prev.map(r => r.id === routine.id ? updatedRoutine : r));

        if (user) {
            try {
                await saveRoutineToFirestore(user.uid, updatedRoutine);
            } catch (error) {
                // Rollback optimistic update on failure
                console.error('Failed to update routine:', error);
                setRoutines(prev => prev.map(r => r.id === routine.id ? routine : r));
                return { error: 'Failed to update routine. Please try again.' };
            }
        }

        return {};
    };

    const startRoutine = async (routineId: string) => {
        const routine = routines.find(r => r.id === routineId);
        if (!routine) return;

        const newWorkout: Workout = {
            id: crypto.randomUUID(),
            name: routine.name,
            type: 'STRENGTH',
            startTime: Date.now(),
            totalPausedTime: 0,
            exercises: routine.exercises.map(re => ({
                id: crypto.randomUUID(),
                exerciseId: re.exerciseId,
                sets: Array.from({ length: Math.max(1, re.sets) }, () => ({
                    id: crypto.randomUUID(),
                    reps: 0,
                    weight: 0,
                    completed: false
                })),
                addedAt: Date.now(),
            })),
            status: 'active',
            routineId: routine.id,  // Link workout to the routine
            fromRoutine: true,
        };

        // Optimistic update
        setActiveWorkout(newWorkout);

        if (user) {
            await saveActiveWorkoutToFirestore(user.uid, newWorkout);
        }
    };

    const deleteRoutine = async (id: string) => {
        // Optimistic update
        setRoutines(prev => prev.filter(r => r.id !== id));

        if (user) {
            await deleteRoutineFromFirestore(user.uid, id);
        }
    };

    // Soft delete a workout (move to deleted folder with 7-day retention)
    const softDeleteWorkout = async (workoutId: string) => {
        const workout = history.find(w => w.id === workoutId);
        if (!workout) return;

        const deletedWorkout = { ...workout, deletedAt: Date.now() };

        // Optimistic update
        setHistory(prev => prev.map(w => w.id === workoutId ? deletedWorkout : w));

        if (user) {
            const { error } = await softDeleteWorkoutInFirestore(user.uid, workoutId);
            if (error) {
                // Rollback on failure
                console.error('Failed to soft delete workout:', error);
                setHistory(prev => prev.map(w => w.id === workoutId ? workout : w));
            }
        }
    };

    // Restore a soft-deleted workout
    const restoreWorkout = async (workoutId: string) => {
        const workout = history.find(w => w.id === workoutId);
        if (!workout || !workout.deletedAt) return;

        const restoredWorkout = { ...workout };
        delete restoredWorkout.deletedAt;

        // Optimistic update
        setHistory(prev => prev.map(w => w.id === workoutId ? restoredWorkout : w));

        if (user) {
            const { error } = await restoreWorkoutInFirestore(user.uid, workoutId);
            if (error) {
                // Rollback on failure
                console.error('Failed to restore workout:', error);
                setHistory(prev => prev.map(w => w.id === workoutId ? workout : w));
            }
        }
    };

    // Permanently delete a workout
    const permanentlyDeleteWorkout = async (workoutId: string) => {
        const workout = history.find(w => w.id === workoutId);
        if (!workout) return;

        // Optimistic update
        setHistory(prev => prev.filter(w => w.id !== workoutId));

        if (user) {
            const { error } = await permanentlyDeleteWorkoutInFirestore(user.uid, workoutId);
            if (error) {
                // Rollback on failure
                console.error('Failed to permanently delete workout:', error);
                setHistory(prev => [...prev, workout]);
            }
        }
    };

    // ==================== EDIT WORKOUT ====================

    // Start editing a workout
    const startEditWorkout = (workoutId: string) => {
        const workout = history.find(w => w.id === workoutId);
        if (workout) {
            // Deep clone the workout to avoid mutating the original
            setEditingWorkout(structuredClone(workout));
        }
    };

    // Update a set in the editing workout
    const updateEditingSet = (
        exerciseInstanceId: string,
        setId: string,
        updates: Partial<{ reps: number; weight: number; distance: number; duration: number; intensity: CardioIntensity }>
    ) => {
        if (!editingWorkout) return;
        setEditingWorkout({
            ...editingWorkout,
            exercises: editingWorkout.exercises.map(ex =>
                ex.id !== exerciseInstanceId ? ex : {
                    ...ex,
                    sets: ex.sets.map(s => s.id === setId ? { ...s, ...updates } : s)
                }
            )
        });
    };

    // Add a new set to an exercise in the editing workout
    const addEditingSet = (exerciseInstanceId: string) => {
        if (!editingWorkout) return;
        setEditingWorkout({
            ...editingWorkout,
            exercises: editingWorkout.exercises.map(ex => {
                if (ex.id !== exerciseInstanceId) return ex;
                const lastSet = ex.sets[ex.sets.length - 1];
                return {
                    ...ex,
                    sets: [...ex.sets, {
                        id: crypto.randomUUID(),
                        reps: lastSet?.reps ?? 0,
                        weight: lastSet?.weight ?? 0,
                        distance: lastSet?.distance ?? 0,
                        duration: lastSet?.duration ?? 0,
                        completed: true,
                    }]
                };
            })
        });
    };

    // Remove a set from an exercise in the editing workout
    const removeEditingSet = (exerciseInstanceId: string, setId: string) => {
        if (!editingWorkout) return;
        setEditingWorkout({
            ...editingWorkout,
            exercises: editingWorkout.exercises.map(ex =>
                ex.id !== exerciseInstanceId ? ex : {
                    ...ex,
                    sets: ex.sets.filter(s => s.id !== setId)
                }
            ).filter(ex => ex.sets.length > 0) // Remove exercise if no sets left
        });
    };

    // Save the edited workout
    const saveEditedWorkout = async (): Promise<{ error?: string }> => {
        if (!editingWorkout) return { error: 'No workout to save' };

        const workoutToSave = editingWorkout;
        const previousHistory = [...history];

        // Optimistic update
        setHistory(prev => prev.map(w => w.id === workoutToSave.id ? workoutToSave : w));
        setEditingWorkout(null);

        if (user) {
            const { error } = await updateWorkoutInFirestore(user.uid, workoutToSave);
            if (error) {
                // Rollback on failure
                setHistory(previousHistory);
                setEditingWorkout(workoutToSave);
                console.error('Failed to save edited workout:', error);
                return { error };
            }
        }

        return {};
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingWorkout(null);
    };

    // Computed: workouts that have been soft-deleted (have deletedAt set)
    const deletedWorkouts = history.filter(w => w.deletedAt !== undefined);

    // Computed: the last finished workout within resume window (for resume feature)
    // Note: This is recalculated every second via resumeWindowTick to handle time expiration
    const [resumeWindowTick, setResumeWindowTick] = useState(0);

    // Timer to update resume window state every second when there's a potential resumable workout
    useEffect(() => {
        // Only run timer if there might be a resumable workout
        const potentialWorkout = history.find(w =>
            w.endTime && !w.deletedAt && w.status === 'completed'
        );

        if (!potentialWorkout?.endTime) return;

        // Check if still within resume window
        const timeElapsed = Date.now() - potentialWorkout.endTime;
        if (timeElapsed >= RESUME_WINDOW_MS) return;

        // Set up timer to tick every second until window expires
        const interval = setInterval(() => {
            setResumeWindowTick(t => t + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [history]);

    const lastFinishedWorkout = React.useMemo(() => {
        // resumeWindowTick dependency ensures this recalculates as time passes
        void resumeWindowTick;
        const now = Date.now();
        return history.find(w =>
            w.endTime &&
            !w.deletedAt &&
            w.status === 'completed' &&
            (now - w.endTime) < RESUME_WINDOW_MS
        ) || null;
    }, [history, resumeWindowTick]);

    // Computed: can the user resume the last workout?
    const canResumeLastWorkout = lastFinishedWorkout !== null && activeWorkout === null;

    // Cleanup expired workouts (older than 7 days) - runs once after initial data load
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    // Function to clean up expired workouts - called once after data is loaded
    const cleanupExpiredWorkouts = React.useCallback((workouts: Workout[], userId: string | null) => {
        const cleanupKey = userId || 'local';

        // Skip if we've already cleaned up for this user
        if (hasCleanedUpExpiredRef.current === cleanupKey) {
            return;
        }

        const expiredWorkouts = workouts.filter(
            w => w.deletedAt && (Date.now() - w.deletedAt > SEVEN_DAYS_MS)
        );

        if (expiredWorkouts.length > 0) {
            console.log(`Cleaning up ${expiredWorkouts.length} expired deleted workout(s)...`);
            // Delete each expired workout
            expiredWorkouts.forEach(w => {
                // Optimistic update
                setHistory(prev => prev.filter(workout => workout.id !== w.id));

                // Sync to Firestore if user is authenticated
                if (userId) {
                    permanentlyDeleteWorkoutInFirestore(userId, w.id).catch(error => {
                        console.error('Failed to delete expired workout:', error);
                    });
                }
            });
        }

        // Mark cleanup as done for this user
        hasCleanedUpExpiredRef.current = cleanupKey;
    }, []);

    // Run cleanup once when user changes (after Firestore subscription delivers initial data)
    useEffect(() => {
        // Small delay to ensure Firestore subscription has delivered initial data
        const timeoutId = setTimeout(() => {
            // Use ref to get latest history value (avoids stale closure)
            cleanupExpiredWorkouts(historyRef.current, user?.uid || null);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [user?.uid, cleanupExpiredWorkouts]); // Only re-run when user changes, not history

    // Computed: is the workout currently paused
    const isWorkoutPaused = activeWorkout?.pausedAt !== undefined;

    return (
        <WorkoutContext.Provider value={{
            activeWorkout, history, deletedWorkouts, routines, user, isLoading, editingWorkout, isWorkoutPaused,
            lastError, clearError,
            lastFinishedWorkout, canResumeLastWorkout, justFinishedWorkoutId, clearJustFinished,
            startWorkout, finishWorkout, cancelWorkout, pauseWorkout, resumeWorkout, resumeFinishedWorkout,
            addExercise, addSet, removeSet, updateSet, updateNotes, getExerciseName, getExerciseInfo,
            saveRoutine, updateRoutine, startRoutine, deleteRoutine,
            softDeleteWorkout, restoreWorkout, permanentlyDeleteWorkout,
            startEditWorkout, updateEditingSet, addEditingSet, removeEditingSet, saveEditedWorkout, cancelEdit
        }}>
            {children}
        </WorkoutContext.Provider>
    );
};

export const useWorkout = () => {
    const context = useContext(WorkoutContext);
    if (context === undefined) {
        throw new Error('useWorkout must be used within a WorkoutProvider');
    }
    return context;
};
