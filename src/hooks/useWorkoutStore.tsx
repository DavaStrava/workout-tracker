import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import type { Workout, WorkoutExercise, Routine, WorkoutType, CardioIntensity, Exercise } from '../types';
import { EXERCISES } from '../data/exercises';
import { auth } from '../config/firebase';
import {
    subscribeToWorkouts,
    subscribeToRoutines,
    subscribeToActiveWorkout,
    saveWorkout as saveWorkoutToFirestore,
    saveActiveWorkout as saveActiveWorkoutToFirestore,
    saveRoutine as saveRoutineToFirestore,
    deleteRoutine as deleteRoutineFromFirestore,
    migrateLocalDataToFirestore,
} from '../services/firestore';

interface WorkoutContextType {
    activeWorkout: Workout | null;
    history: Workout[];
    routines: Routine[];
    user: User | null;
    isLoading: boolean;
    startWorkout: (name?: string, type?: WorkoutType) => void;
    finishWorkout: () => void;
    cancelWorkout: () => void;
    addExercise: (exerciseId: string) => void;
    updateSet: (exerciseInstanceId: string, setId: string, updates: Partial<{ reps: number; weight: number; distance: number; duration: number; intensity: CardioIntensity; completed: boolean }>) => void;
    updateNotes: (notes: string) => void;
    getExerciseInfo: (id: string) => Exercise | undefined;
    addSet: (exerciseInstanceId: string) => void;
    removeSet: (exerciseInstanceId: string, setId: string) => void;
    getExerciseName: (id: string) => string;
    saveRoutine: (name: string) => void;
    startRoutine: (routineId: string) => void;
    deleteRoutine: (routineId: string) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

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
                const localWorkouts = history;
                const localRoutines = routines;
                const localActiveWorkout = activeWorkout;

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

    // Fallback: Save to localStorage when not authenticated
    useEffect(() => {
        if (!user) {
            if (activeWorkout) {
                localStorage.setItem('activeWorkout', JSON.stringify(activeWorkout));
            } else {
                localStorage.removeItem('activeWorkout');
            }
        }
    }, [activeWorkout, user]);

    useEffect(() => {
        if (!user) {
            localStorage.setItem('workoutHistory', JSON.stringify(history));
        }
    }, [history, user]);

    useEffect(() => {
        if (!user) {
            localStorage.setItem('routines', JSON.stringify(routines));
        }
    }, [routines, user]);

    const startWorkout = (name: string = 'New Workout', type: WorkoutType = 'STRENGTH') => {
        const newWorkout: Workout = {
            id: crypto.randomUUID(),
            name,
            type,
            startTime: Date.now(),
            exercises: [],
            status: 'active',
        };
        setActiveWorkout(newWorkout);
    };

    const finishWorkout = async () => {
        if (!activeWorkout) return;
        const completedWorkout = { ...activeWorkout, endTime: Date.now(), status: 'completed' as const };

        if (user) {
            // Save to Firestore (real-time listeners will update state)
            await saveWorkoutToFirestore(user.uid, completedWorkout);
            await saveActiveWorkoutToFirestore(user.uid, null);
        } else {
            // Fallback to local state
            setHistory(prev => [completedWorkout, ...prev]);
            setActiveWorkout(null);
        }
    };

    const cancelWorkout = () => setActiveWorkout(null);

    const addExercise = async (exerciseId: string) => {
        if (!activeWorkout) return;
        const newExercise: WorkoutExercise = {
            id: crypto.randomUUID(),
            exerciseId,
            sets: [{ id: crypto.randomUUID(), reps: 0, weight: 0, completed: false }],
        };
        const updatedWorkout = { ...activeWorkout, exercises: [...activeWorkout.exercises, newExercise] };

        if (user) {
            await saveActiveWorkoutToFirestore(user.uid, updatedWorkout);
        } else {
            setActiveWorkout(updatedWorkout);
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

        if (user) {
            await saveActiveWorkoutToFirestore(user.uid, updatedWorkout);
        } else {
            setActiveWorkout(updatedWorkout);
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

        if (user) {
            await saveActiveWorkoutToFirestore(user.uid, updatedWorkout);
        } else {
            setActiveWorkout(updatedWorkout);
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

        if (user) {
            await saveActiveWorkoutToFirestore(user.uid, updatedWorkout);
        } else {
            setActiveWorkout(updatedWorkout);
        }
    };

    const updateNotes = async (notes: string) => {
        if (!activeWorkout) return;

        const updatedWorkout = { ...activeWorkout, notes };

        if (user) {
            await saveActiveWorkoutToFirestore(user.uid, updatedWorkout);
        } else {
            setActiveWorkout(updatedWorkout);
        }
    };

    const getExerciseInfo = (id: string): Exercise | undefined => EXERCISES.find(e => e.id === id);

    const getExerciseName = (id: string) => getExerciseInfo(id)?.name || 'Unknown Exercise';

    // Routine Logic
    const saveRoutine = async (name: string) => {
        if (!activeWorkout) return;
        const newRoutine: Routine = {
            id: crypto.randomUUID(),
            name,
            exercises: activeWorkout.exercises.map(e => ({
                exerciseId: e.exerciseId,
                sets: e.sets.length
            }))
        };

        if (user) {
            await saveRoutineToFirestore(user.uid, newRoutine);
        } else {
            setRoutines(prev => [...prev, newRoutine]);
        }
    };

    const startRoutine = (routineId: string) => {
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
            status: 'active'
        };
        setActiveWorkout(newWorkout);
    };

    const deleteRoutine = async (id: string) => {
        if (user) {
            await deleteRoutineFromFirestore(user.uid, id);
        } else {
            setRoutines(prev => prev.filter(r => r.id !== id));
        }
    };

    return (
        <WorkoutContext.Provider value={{
            activeWorkout, history, routines, user, isLoading,
            startWorkout, finishWorkout, cancelWorkout,
            addExercise, addSet, removeSet, updateSet, updateNotes, getExerciseName, getExerciseInfo,
            saveRoutine, startRoutine, deleteRoutine
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
