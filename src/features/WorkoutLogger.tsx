import React, { useState } from 'react';
import { LandingPage } from './LandingPage';
import { CardioLogger } from './CardioLogger';
import { useWorkout } from '../hooks/useWorkoutStore';
import { Plus, Check, X, ChevronLeft, Save, History } from 'lucide-react';
import type { BodyArea } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AnimatePresence, motion } from 'framer-motion';
import { getLastPerformance } from '../utils/analyticsHelpers';
import { MuscleGroupSelector } from '../components/MuscleGroupSelector';
import { ExerciseSelector } from '../components/ExerciseSelector';

type ExerciseSelectorStep = 'hidden' | 'muscle-group' | 'exercise-list';

export const WorkoutLogger: React.FC<{ onNavigate: (tab: 'workout' | 'history' | 'analytics') => void }> = ({ onNavigate }) => {
    const {
        activeWorkout, history, finishWorkout, cancelWorkout,
        addExercise, addSet, removeSet, updateSet, getExerciseName,
        saveRoutine
    } = useWorkout();

    const [exerciseSelectorStep, setExerciseSelectorStep] = useState<ExerciseSelectorStep>('hidden');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<BodyArea | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Determine if we should show muscle selector (empty workout or user opened it)
    const showMuscleGroupStep = exerciseSelectorStep === 'muscle-group' ||
        (activeWorkout && activeWorkout.exercises.length === 0 && exerciseSelectorStep === 'hidden');

    // Navigation handlers for exercise selector
    const handleOpenExerciseSelector = () => {
        setExerciseSelectorStep('muscle-group');
        setSelectedMuscleGroup(null);
        setSearchQuery('');
    };

    const handleMuscleGroupSelect = (bodyArea: BodyArea) => {
        setSelectedMuscleGroup(bodyArea);
        setExerciseSelectorStep('exercise-list');
    };

    const handleBackFromExerciseList = () => {
        setExerciseSelectorStep('muscle-group');
    };

    const handleBackFromMuscleGroup = () => {
        // If workout has no exercises, cancel the workout entirely
        if (activeWorkout && activeWorkout.exercises.length === 0) {
            cancelWorkout();
        } else {
            setExerciseSelectorStep('hidden');
        }
    };

    const handleExerciseSelect = (exerciseId: string) => {
        addExercise(exerciseId);
        setExerciseSelectorStep('hidden');
    };
    const [showRoutineModal, setShowRoutineModal] = useState(false);
    const [routineName, setRoutineName] = useState('');

    const handleSaveRoutine = () => {
        setShowRoutineModal(true);
        setRoutineName('');
    };

    const confirmSaveRoutine = async () => {
        if (routineName.trim()) {
            await saveRoutine(routineName.trim());
            setShowRoutineModal(false);
            setRoutineName('');
        }
    };

    if (!activeWorkout) {
        return <LandingPage onNavigate={onNavigate} />;
    }

    // Render CardioLogger for CARDIO workouts
    if (activeWorkout.type === 'CARDIO') {
        return <CardioLogger />;
    }

    // Exercise Selector - Muscle Group Step (also shown when workout has no exercises)
    if (showMuscleGroupStep) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button variant="ghost" size="icon" onClick={handleBackFromMuscleGroup} aria-label="Go back">
                        <ChevronLeft size={24} />
                    </Button>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>Select Muscle Group</h2>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key="muscle-grid"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <MuscleGroupSelector onSelect={handleMuscleGroupSelect} />
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    // Exercise Selector - Exercise List Step (with icons grid)
    if (exerciseSelectorStep === 'exercise-list' && selectedMuscleGroup) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="exercise-list"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '80px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Button variant="ghost" size="icon" onClick={handleBackFromExerciseList} aria-label="Go back">
                            <ChevronLeft size={24} />
                        </Button>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{selectedMuscleGroup}</h2>
                    </div>

                    <ExerciseSelector
                        muscleGroup={selectedMuscleGroup}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onSelectExercise={handleExerciseSelect}
                    />
                </motion.div>
            </AnimatePresence>
        );
    }

    // Active Workout View
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '96px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #fb923c 0%, #f472b6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        {activeWorkout.name}
                    </h1>
                    <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
                        Started {new Date(activeWorkout.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="ghost" size="icon" onClick={handleSaveRoutine} title="Save as Routine">
                        <Save size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={cancelWorkout} title="Cancel">
                        <X size={20} />
                    </Button>
                    <Button variant="primary" onClick={finishWorkout}>
                        Finish
                    </Button>
                </div>
            </div>

            {/* Exercises List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <AnimatePresence initial={false}>
                    {activeWorkout.exercises.map((exerciseInstance) => {
                        const lastPerf = getLastPerformance(history, exerciseInstance.exerciseId);
                        return (
                            <div
                                key={exerciseInstance.id}
                                style={{
                                    background: 'rgba(30, 27, 50, 0.8)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '24px',
                                    padding: '24px',
                                    overflow: 'visible',
                                }}
                            >
                                <div style={{ marginBottom: '20px', marginLeft: '4px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{getExerciseName(exerciseInstance.exerciseId)}</h3>
                                    {lastPerf && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '6px' }}>
                                            <History size={14} />
                                            <span>Last: {lastPerf.weight}kg × {lastPerf.reps} ({lastPerf.date})</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {/* Header Row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 1fr 36px', gap: '12px', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', padding: '0 4px' }}>
                                        <span>#</span>
                                        <span>kg</span>
                                        <span>Reps</span>
                                        <span>✓</span>
                                    </div>

                                    {/* Sets */}
                                    <AnimatePresence initial={false}>
                                        {exerciseInstance.sets.map((set, index) => (
                                            <motion.div
                                                key={set.id}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                style={{ display: 'grid', gridTemplateColumns: '24px 1fr 1fr 36px', gap: '12px', alignItems: 'center' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace' }}>
                                                    {index + 1}
                                                </div>
                                                <Input
                                                    type="number"
                                                    style={{ height: '40px', textAlign: 'center', padding: '4px', background: 'rgba(255, 255, 255, 0.05)' }}
                                                    placeholder="-"
                                                    min="0"
                                                    max="1000"
                                                    step="0.5"
                                                    value={set.weight || ''}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value);
                                                        if (!isNaN(value) && value >= 0 && value <= 1000) {
                                                            updateSet(exerciseInstance.id, set.id, { weight: value });
                                                        } else if (e.target.value === '') {
                                                            updateSet(exerciseInstance.id, set.id, { weight: 0 });
                                                        }
                                                    }}
                                                />
                                                <Input
                                                    type="number"
                                                    style={{ height: '40px', textAlign: 'center', padding: '4px', background: 'rgba(255, 255, 255, 0.05)' }}
                                                    placeholder="-"
                                                    min="0"
                                                    max="100"
                                                    step="1"
                                                    value={set.reps || ''}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10);
                                                        if (!isNaN(value) && value >= 0 && value <= 100) {
                                                            updateSet(exerciseInstance.id, set.id, { reps: value });
                                                        } else if (e.target.value === '') {
                                                            updateSet(exerciseInstance.id, set.id, { reps: 0 });
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => updateSet(exerciseInstance.id, set.id, { completed: !set.completed })}
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s',
                                                        cursor: 'pointer',
                                                        border: 'none',
                                                        background: set.completed
                                                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                                            : 'rgba(255, 255, 255, 0.1)',
                                                        color: set.completed ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                                                        boxShadow: set.completed ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                                                    }}
                                                >
                                                    <Check size={16} strokeWidth={3} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    {exerciseInstance.sets.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            style={{ color: '#f87171' }}
                                            onClick={() => removeSet(exerciseInstance.id, exerciseInstance.sets[exerciseInstance.sets.length - 1].id)}
                                        >
                                            Remove Set
                                        </Button>
                                    )}
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => addSet(exerciseInstance.id)}
                                    >
                                        + Add Set
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </AnimatePresence>

                <button
                    onClick={handleOpenExerciseSelector}
                    style={{
                        width: '100%',
                        height: '64px',
                        borderRadius: '20px',
                        background: 'rgba(30, 27, 50, 0.8)',
                        border: '2px dashed rgba(255, 255, 255, 0.15)',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '16px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    <Plus size={22} />
                    Add Exercise
                </button>
            </div>

            {/* Save Routine Modal */}
            <AnimatePresence>
                {showRoutineModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '16px',
                            background: 'rgba(0, 0, 0, 0.75)',
                        }}
                        onClick={() => setShowRoutineModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{
                                width: '100%',
                                maxWidth: '380px',
                                padding: '28px',
                                borderRadius: '24px',
                                background: 'rgba(30, 27, 50, 0.98)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', color: '#fff' }}>Save as Routine</h3>
                            <Input
                                placeholder="Routine name"
                                value={routineName}
                                onChange={(e) => setRoutineName(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') confirmSaveRoutine();
                                    if (e.key === 'Escape') setShowRoutineModal(false);
                                }}
                            />
                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                <Button
                                    variant="ghost"
                                    style={{ flex: 1 }}
                                    onClick={() => setShowRoutineModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    style={{ flex: 1 }}
                                    onClick={confirmSaveRoutine}
                                    disabled={!routineName.trim()}
                                >
                                    Save
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
