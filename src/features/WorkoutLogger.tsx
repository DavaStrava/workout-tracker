import React, { useState } from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { EXERCISES } from '../data/exercises';
import { Plus, Check, X, Trophy } from 'lucide-react';
import type { BodyArea } from '../types';

export const WorkoutLogger: React.FC = () => {
    const {
        activeWorkout, startWorkout, finishWorkout, cancelWorkout,
        addExercise, addSet, removeSet, updateSet, getExerciseName
    } = useWorkout();

    const [showExerciseSelector, setShowExerciseSelector] = useState(false);
    const [selectedBodyArea, setSelectedBodyArea] = useState<BodyArea | 'All'>('All');

    if (!activeWorkout) {
        return (
            <div className="flex flex-col items-center justify-center" style={{ height: '70vh' }}>
                <div className="flex flex-col items-center gap-md">
                    <div style={{
                        width: 80, height: 80, borderRadius: '50%', backgroundColor: 'var(--color-bg-elevated)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                    }}>
                        <Trophy size={40} color="var(--color-primary)" />
                    </div>
                    <h1 className="text-xl">Ready to Crush It?</h1>
                    <button className="btn btn-primary" onClick={() => startWorkout()}>
                        Start Workout
                    </button>
                </div>
            </div>
        );
    }

    if (showExerciseSelector) {
        const areas: (BodyArea | 'All')[] = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
        const filteredExercises = EXERCISES.filter(e => selectedBodyArea === 'All' || e.bodyArea === selectedBodyArea);

        return (
            <div className="flex flex-col gap-md">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg">Add Exercise</h2>
                    <button className="btn btn-ghost" onClick={() => setShowExerciseSelector(false)}>Close</button>
                </div>

                <div className="flex gap-sm" style={{ overflowX: 'auto', paddingBottom: 8 }}>
                    {areas.map(area => (
                        <button
                            key={area}
                            onClick={() => setSelectedBodyArea(area)}
                            className={`btn ${selectedBodyArea === area ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ padding: '6px 12px', fontSize: '0.875rem' }}
                        >
                            {area}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-sm">
                    {filteredExercises.map(ex => (
                        <button
                            key={ex.id}
                            className="card flex justify-between items-center"
                            style={{ textAlign: 'left' }}
                            onClick={() => {
                                addExercise(ex.id);
                                setShowExerciseSelector(false);
                            }}
                        >
                            <span style={{ fontWeight: 500 }}>{ex.name}</span>
                            <span className="text-sm text-muted">{ex.bodyArea}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-md">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl">{activeWorkout.name}</h1>
                    <span className="text-sm text-muted">Started {new Date(activeWorkout.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex gap-sm">
                    <button className="btn btn-ghost" style={{ padding: 8, color: 'var(--color-danger)' }} onClick={cancelWorkout}>
                        <X size={20} />
                    </button>
                    <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={finishWorkout}>
                        Finish
                    </button>
                </div>
            </div>

            {/* Exercises List */}
            <div className="flex flex-col gap-md">
                {activeWorkout.exercises.map((exerciseInstance) => (
                    <div key={exerciseInstance.id} className="card">
                        <h3 className="text-lg mb-2">{getExerciseName(exerciseInstance.exerciseId)}</h3>

                        <div className="flex flex-col gap-sm">
                            <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 1fr 40px', gap: 8, marginBottom: 4 }} className="text-sm text-muted">
                                <span className="text-center">Set</span>
                                <span className="text-center">kg</span>
                                <span className="text-center">Reps</span>
                                <span className="text-center">✓</span>
                            </div>

                            {exerciseInstance.sets.map((set, index) => (
                                <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 1fr 40px', gap: 8, alignItems: 'center' }}>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--color-text-muted)' }}>
                                        {index + 1}
                                    </div>
                                    <input
                                        type="number"
                                        className="input"
                                        style={{ textAlign: 'center', padding: 8 }}
                                        placeholder="0"
                                        value={set.weight || ''}
                                        onChange={(e) => updateSet(exerciseInstance.id, set.id, { weight: parseFloat(e.target.value) || 0 })}
                                    />
                                    <input
                                        type="number"
                                        className="input"
                                        style={{ textAlign: 'center', padding: 8 }}
                                        placeholder="0"
                                        value={set.reps || ''}
                                        onChange={(e) => updateSet(exerciseInstance.id, set.id, { reps: parseFloat(e.target.value) || 0 })}
                                    />
                                    <button
                                        onClick={() => updateSet(exerciseInstance.id, set.id, { completed: !set.completed })}
                                        style={{
                                            height: 36, borderRadius: 6, border: 'none', cursor: 'pointer',
                                            background: set.completed ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
                                            color: set.completed ? '#fff' : 'var(--color-text-muted)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        <Check size={18} />
                                    </button>
                                </div>
                            ))}

                            <div className="flex justify-end gap-sm mt-2">
                                {exerciseInstance.sets.length > 0 && (
                                    <button
                                        className="btn btn-ghost"
                                        style={{ padding: '6px 12px', fontSize: 13, color: 'var(--color-danger)' }}
                                        onClick={() => removeSet(exerciseInstance.id, exerciseInstance.sets[exerciseInstance.sets.length - 1].id)}
                                    >
                                        Remove Set
                                    </button>
                                )}
                                <button
                                    className="btn btn-ghost"
                                    style={{ padding: '6px 12px', fontSize: 13, background: 'var(--color-bg-elevated)' }}
                                    onClick={() => addSet(exerciseInstance.id)}
                                >
                                    + Add Set
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    className="btn btn-ghost"
                    style={{ border: '1px dashed var(--color-border)', width: '100%', padding: 16 }}
                    onClick={() => setShowExerciseSelector(true)}
                >
                    <Plus size={20} style={{ marginRight: 8 }} />
                    Add Exercise
                </button>
            </div>

            {/* Spacer for bottom tab bar */}
            <div style={{ height: 20 }} />
        </div>
    );
};
