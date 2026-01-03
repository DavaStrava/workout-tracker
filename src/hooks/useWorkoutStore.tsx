import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Workout, WorkoutExercise, Routine, WorkoutType, CardioIntensity, Exercise } from '../types';
import { EXERCISES } from '../data/exercises';

interface WorkoutContextType {
    activeWorkout: Workout | null;
    history: Workout[];
    routines: Routine[];
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

    const finishWorkout = () => {
        if (!activeWorkout) return;
        const completedWorkout = { ...activeWorkout, endTime: Date.now(), status: 'completed' as const };
        setHistory(prev => [completedWorkout, ...prev]);
        setActiveWorkout(null);
    };

    const cancelWorkout = () => setActiveWorkout(null);

    const addExercise = (exerciseId: string) => {
        if (!activeWorkout) return;
        const newExercise: WorkoutExercise = {
            id: crypto.randomUUID(),
            exerciseId,
            sets: [{ id: crypto.randomUUID(), reps: 0, weight: 0, completed: false }],
        };
        setActiveWorkout(prev => prev ? { ...prev, exercises: [...prev.exercises, newExercise] } : null);
    };

    const addSet = (exerciseInstanceId: string) => {
        if (!activeWorkout) return;
        setActiveWorkout(prev => {
            if (!prev) return null;
            return {
                ...prev,
                exercises: prev.exercises.map(e => {
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
            }
        })
    }

    const removeSet = (exerciseInstanceId: string, setId: string) => {
        if (!activeWorkout) return;
        setActiveWorkout(prev => {
            if (!prev) return null;
            return {
                ...prev,
                exercises: prev.exercises.map(e => {
                    if (e.id !== exerciseInstanceId) return e;
                    return { ...e, sets: e.sets.filter(s => s.id !== setId) };
                }).filter(e => e.sets.length > 0)
            };
        });
    };

    const updateSet = (exerciseInstanceId: string, setId: string, updates: Partial<{ reps: number; weight: number; distance: number; duration: number; intensity: CardioIntensity; completed: boolean }>) => {
        if (!activeWorkout) return;
        setActiveWorkout(prev => {
            if (!prev) return null;
            return {
                ...prev,
                exercises: prev.exercises.map(ex => {
                    if (ex.id !== exerciseInstanceId) return ex;
                    return {
                        ...ex,
                        sets: ex.sets.map(s => s.id === setId ? { ...s, ...updates } : s)
                    };
                })
            };
        });
    };

    const updateNotes = (notes: string) => {
        if (!activeWorkout) return;
        setActiveWorkout(prev => prev ? { ...prev, notes } : null);
    };

    const getExerciseInfo = (id: string): Exercise | undefined => EXERCISES.find(e => e.id === id);

    const getExerciseName = (id: string) => getExerciseInfo(id)?.name || 'Unknown Exercise';

    // Routine Logic
    const saveRoutine = (name: string) => {
        if (!activeWorkout) return;
        const newRoutine: Routine = {
            id: crypto.randomUUID(),
            name,
            exercises: activeWorkout.exercises.map(e => ({
                exerciseId: e.exerciseId,
                sets: e.sets.length
            }))
        };
        setRoutines(prev => [...prev, newRoutine]);
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

    const deleteRoutine = (id: string) => {
        setRoutines(prev => prev.filter(r => r.id !== id));
    };

    return (
        <WorkoutContext.Provider value={{
            activeWorkout, history, routines, startWorkout, finishWorkout, cancelWorkout,
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
