import React, { useState, useEffect } from 'react';
import { LandingPage } from './LandingPage';
import { CardioLogger } from './CardioLogger';
import { WorkoutTypeSelector } from './WorkoutTypeSelector';
import { useWorkout } from '../hooks/useWorkoutStore';
import { Plus, Check, X, ChevronLeft, Save, History, Home } from 'lucide-react';
import type { BodyArea, WorkoutType } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AnimatePresence, motion } from 'framer-motion';
import { getLastPerformance } from '../utils/analyticsHelpers';
import { AnatomicalBodySelector } from '../components/AnatomicalBodySelector';
import { ExerciseSelector } from '../components/ExerciseSelector';
import { WorkoutTimer } from '../components/WorkoutTimer';

type ExerciseSelectorStep = 'hidden' | 'muscle-group' | 'exercise-list';

export const WorkoutLogger: React.FC<{ onNavigate: (tab: 'workout' | 'history' | 'analytics') => void }> = ({ onNavigate }) => {
    const {
        activeWorkout, history, finishWorkout, cancelWorkout,
        addExercise, addSet, removeSet, updateSet, getExerciseName,
        saveRoutine, updateRoutine
    } = useWorkout();

    const [exerciseSelectorStep, setExerciseSelectorStep] = useState<ExerciseSelectorStep>('hidden');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<BodyArea | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showLanding, setShowLanding] = useState(false);
    const [showWorkoutTypeSelector, setShowWorkoutTypeSelector] = useState(false);

    // Reset showLanding when a new workout starts to prevent UI bugs
    useEffect(() => {
        if (activeWorkout) {
            setShowLanding(false);
        }
    }, [activeWorkout?.id]);

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
        // If workout has no exercises, go back to workout type selector
        if (activeWorkout && activeWorkout.exercises.length === 0) {
            setShowWorkoutTypeSelector(true);
        } else {
            setExerciseSelectorStep('hidden');
        }
    };

    const handleBackFromWorkoutTypeSelector = () => {
        // Cancel workout and go back to landing page
        cancelWorkout();
        setShowWorkoutTypeSelector(false);
    };

    const handleWorkoutTypeSelect = (type: WorkoutType) => {
        // Update workout type if different (workout already exists)
        if (activeWorkout && activeWorkout.type !== type) {
            // For now, just cancel and restart with new type
            // In a more complete implementation, you'd update the existing workout's type
            cancelWorkout();
            // Small delay to allow state to settle, then the user can start fresh
        }
        setShowWorkoutTypeSelector(false);
    };

    const handleExerciseSelect = (exerciseId: string) => {
        addExercise(exerciseId);
        setExerciseSelectorStep('hidden');
    };

    const handleGoHome = () => {
        setShowLanding(true);
        setExerciseSelectorStep('hidden');
        setShowWorkoutTypeSelector(false);
    };

    const handleResumeWorkout = () => {
        setShowLanding(false);
    };
    const [showRoutineModal, setShowRoutineModal] = useState(false);
    const [routineName, setRoutineName] = useState('');
    const [isSavingRoutine, setIsSavingRoutine] = useState(false);
    const [routineError, setRoutineError] = useState('');
    const [routineSuccess, setRoutineSuccess] = useState('');

    const handleSaveRoutine = async () => {
        // If already saved as a routine, just update it
        if (activeWorkout?.routineId) {
            setIsSavingRoutine(true);
            setRoutineError('');
            setRoutineSuccess('');
            try {
                const result = await updateRoutine();
                if (result.error) {
                    setRoutineError(result.error);
                } else {
                    // Show success message briefly
                    setRoutineSuccess('Routine updated');
                    setTimeout(() => setRoutineSuccess(''), 2000);
                }
            } catch (error) {
                setRoutineError('Failed to update routine. Please try again.');
            } finally {
                setIsSavingRoutine(false);
            }
            return;
        }
        // Otherwise show modal to get name
        setShowRoutineModal(true);
        setRoutineName('');
        setRoutineError('');
        setRoutineSuccess('');
    };

    const confirmSaveRoutine = async () => {
        if (!routineName.trim()) return;

        setIsSavingRoutine(true);
        setRoutineError('');

        try {
            const result = await saveRoutine(routineName.trim());

            if (result.error) {
                setRoutineError(result.error);
                return;
            }

            setShowRoutineModal(false);
            setRoutineName('');
        } catch (error) {
            setRoutineError('Failed to save routine. Please try again.');
        } finally {
            setIsSavingRoutine(false);
        }
    };

    if (!activeWorkout) {
        return <LandingPage onNavigate={onNavigate} />;
    }

    // Show landing page with resume option when user clicked home
    if (showLanding) {
        return <LandingPage onNavigate={onNavigate} onResumeWorkout={handleResumeWorkout} />;
    }

    // Show Workout Type Selector (when going back from muscle group/activity with no exercises)
    if (showWorkoutTypeSelector) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button variant="ghost" size="icon" onClick={handleBackFromWorkoutTypeSelector} aria-label="Go back">
                        <ChevronLeft size={24} />
                    </Button>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', flex: 1 }}>Select Workout Type</h2>
                    <Button variant="ghost" size="icon" onClick={handleGoHome} aria-label="Go to home">
                        <Home size={24} />
                    </Button>
                </div>
                <WorkoutTypeSelector onSelect={handleWorkoutTypeSelect} />
            </div>
        );
    }

    // Render CardioLogger for CARDIO workouts
    if (activeWorkout.type === 'CARDIO') {
        return (
            <CardioLogger
                onBackToWorkoutTypeSelector={() => setShowWorkoutTypeSelector(true)}
                onGoHome={handleGoHome}
            />
        );
    }

    // Exercise Selector - Muscle Group Step (also shown when workout has no exercises)
    if (showMuscleGroupStep) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '80px', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button variant="ghost" size="icon" onClick={handleBackFromMuscleGroup} aria-label="Go back">
                        <ChevronLeft size={24} />
                    </Button>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', flex: 1 }}>Select Muscle Group</h2>
                    <Button variant="ghost" size="icon" onClick={handleGoHome} aria-label="Go to home">
                        <Home size={24} />
                    </Button>
                </div>

                <AnatomicalBodySelector onSelect={handleMuscleGroupSelect} />
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
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', flex: 1 }}>{selectedMuscleGroup}</h2>
                        <Button variant="ghost" size="icon" onClick={handleGoHome} aria-label="Go to home">
                            <Home size={24} />
                        </Button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <Button variant="ghost" size="icon" onClick={handleGoHome} aria-label="Go to home" style={{ flexShrink: 0 }}>
                    <Home size={24} />
                </Button>
                <div style={{ flex: 1, minWidth: 0 }}>
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
                    <Button
                        variant="primary"
                        onClick={handleSaveRoutine}
                        disabled={isSavingRoutine}
                    >
                        {isSavingRoutine ? (
                            <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '8px' }} />
                        ) : (
                            <Save size={16} style={{ marginRight: '8px' }} />
                        )}
                        {activeWorkout.routineId ? 'Update' : 'Save'}
                    </Button>
                    <Button variant="primary" onClick={cancelWorkout}>
                        <X size={16} style={{ marginRight: '8px' }} />
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={finishWorkout}>
                        Finish
                    </Button>
                </div>
            </div>

            {/* Workout Timer */}
            <WorkoutTimer />

            {/* Success Banner (for update routine success) */}
            {routineSuccess && !showRoutineModal && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#10b981',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <Check size={16} />
                    <span>{routineSuccess}</span>
                </div>
            )}

            {/* Error Banner (for update routine errors outside modal) */}
            {routineError && !showRoutineModal && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <span>{routineError}</span>
                    <button
                        onClick={() => setRoutineError('')}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        aria-label="Dismiss error"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

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
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{getExerciseName(exerciseInstance.exerciseId)}</h3>
                                        {exerciseInstance.addedAt && (
                                            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'ui-monospace, monospace' }}>
                                                {new Date(exerciseInstance.addedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    {lastPerf && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '6px' }}>
                                            <History size={14} />
                                            <span>Last: {lastPerf.weight}kg × {lastPerf.reps} ({lastPerf.date})</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {/* Header Row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: activeWorkout.fromRoutine ? '24px 1fr 1fr 36px' : '24px 1fr 1fr', gap: '12px', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', padding: '0 4px' }}>
                                        <span>#</span>
                                        <span>kg</span>
                                        <span>Reps</span>
                                        {activeWorkout.fromRoutine && <span>✓</span>}
                                    </div>

                                    {/* Sets */}
                                    <AnimatePresence initial={false}>
                                        {exerciseInstance.sets.map((set, index) => (
                                            <motion.div
                                                key={set.id}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                style={{ display: 'grid', gridTemplateColumns: activeWorkout.fromRoutine ? '24px 1fr 1fr 36px' : '24px 1fr 1fr', gap: '12px', alignItems: 'center' }}
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
                                                    max="999"
                                                    step="1"
                                                    value={set.reps || ''}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10);
                                                        if (!isNaN(value) && value >= 0 && value <= 999) {
                                                            updateSet(exerciseInstance.id, set.id, { reps: value });
                                                        } else if (e.target.value === '') {
                                                            updateSet(exerciseInstance.id, set.id, { reps: 0 });
                                                        }
                                                    }}
                                                />
                                                {activeWorkout.fromRoutine && (
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
                                                )}
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
                                onChange={(e) => {
                                    setRoutineName(e.target.value);
                                    if (routineError) setRoutineError('');
                                }}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isSavingRoutine) confirmSaveRoutine();
                                    if (e.key === 'Escape') setShowRoutineModal(false);
                                }}
                            />
                            {routineError && (
                                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>
                                    {routineError}
                                </p>
                            )}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                <Button
                                    variant="ghost"
                                    style={{ flex: 1 }}
                                    onClick={() => setShowRoutineModal(false)}
                                    disabled={isSavingRoutine}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    style={{ flex: 1 }}
                                    onClick={confirmSaveRoutine}
                                    disabled={!routineName.trim() || isSavingRoutine}
                                >
                                    {isSavingRoutine ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
