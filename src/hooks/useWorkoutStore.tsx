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
} from '../services/firestore';

interface WorkoutContextType {
    activeWorkout: Workout | null;
    history: Workout[];
    deletedWorkouts: Workout[];
    routines: Routine[];
    user: User | null;
    isLoading: boolean;
    editingWorkout: Workout | null;
    startWorkout: (name?: string, type?: WorkoutType) => void;
    finishWorkout: () => Promise<void>;
    cancelWorkout: () => Promise<void>;
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
            (error) => console.error('Workout subscription error:', error)
        );

        // Subscribe to routines
        const unsubscribeRoutines = subscribeToRoutines(
            user.uid,
            (routines) => {
                setRoutines(routines);
                // Also update localStorage for offline support
                localStorage.setItem('routines', JSON.stringify(routines));
            },
            (error) => console.error('Routines subscription error:', error)
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
            (error) => console.error('Active workout subscription error:', error)
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
            exercises: [],
            status: 'active',
        };
        setActiveWorkout(newWorkout);
    };

    const finishWorkout = async () => {
        if (!activeWorkout) return;
        const previousWorkout = activeWorkout;
        const completedWorkout = { ...activeWorkout, endTime: Date.now(), status: 'completed' as const };

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

    const addExercise = async (exerciseId: string) => {
        if (!activeWorkout) return;
        const newExercise: WorkoutExercise = {
            id: crypto.randomUUID(),
            exerciseId,
            sets: [{ id: crypto.randomUUID(), reps: 0, weight: 0, completed: false }],
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
                        reps: lastSet ? lastSet.reps : 0,
                        weight: lastSet ? lastSet.weight : 0,
                        completed: false
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
            exercises: routine.exercises.map(re => ({
                id: crypto.randomUUID(),
                exerciseId: re.exerciseId,
                sets: Array.from({ length: Math.max(1, re.sets) }, () => ({
                    id: crypto.randomUUID(),
                    reps: 0,
                    weight: 0,
                    completed: false
                }))
            })),
            status: 'active',
            routineId: routine.id  // Link workout to the routine
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
            setEditingWorkout(JSON.parse(JSON.stringify(workout)));
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

    // Cleanup expired workouts (older than 7 days) on load
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    useEffect(() => {
        // Use user ID or 'local' as the cleanup key to run once per user session
        const cleanupKey = user?.uid || 'local';

        // Skip if we've already cleaned up for this user
        if (hasCleanedUpExpiredRef.current === cleanupKey) {
            return;
        }

        const expiredWorkouts = history.filter(
            w => w.deletedAt && (Date.now() - w.deletedAt > SEVEN_DAYS_MS)
        );

        if (expiredWorkouts.length > 0) {
            console.log(`Cleaning up ${expiredWorkouts.length} expired deleted workout(s)...`);
            expiredWorkouts.forEach(w => {
                permanentlyDeleteWorkout(w.id);
            });
        }

        // Mark cleanup as done for this user
        hasCleanedUpExpiredRef.current = cleanupKey;
    // Only run on mount and when user/history changes
    // The ref prevents re-running for the same user even if history changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, history]);

    return (
        <WorkoutContext.Provider value={{
            activeWorkout, history, deletedWorkouts, routines, user, isLoading, editingWorkout,
            startWorkout, finishWorkout, cancelWorkout,
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
