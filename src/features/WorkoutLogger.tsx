import React, { useState } from 'react';
import { LandingPage } from './LandingPage';
import { CardioLogger } from './CardioLogger';
import { useWorkout } from '../hooks/useWorkoutStore';
import { EXERCISES } from '../data/exercises';
import { Plus, Check, X, Search, ChevronLeft, Save, History } from 'lucide-react';
import type { BodyArea } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AnimatePresence, motion } from 'framer-motion';
import { getLastPerformance } from '../utils/analyticsHelpers';

export const WorkoutLogger: React.FC<{ onNavigate: (tab: 'workout' | 'history' | 'analytics') => void }> = ({ onNavigate }) => {
    const {
        activeWorkout, history, finishWorkout, cancelWorkout,
        addExercise, addSet, removeSet, updateSet, getExerciseName,
        saveRoutine
    } = useWorkout();

    const [showExerciseSelector, setShowExerciseSelector] = useState(false);
    const [selectedBodyArea, setSelectedBodyArea] = useState<BodyArea | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
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
        return <CardioLogger onBack={() => cancelWorkout()} />;
    }

    // Exercise Selector View
    if (showExerciseSelector) {
        const areas: (BodyArea | 'All')[] = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];
        const filteredExercises = EXERCISES.filter(e => {
            const matchesArea = selectedBodyArea === 'All' || e.bodyArea === selectedBodyArea;
            const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesArea && matchesSearch;
        });

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button variant="ghost" size="icon" onClick={() => setShowExerciseSelector(false)}>
                        <ChevronLeft size={24} />
                    </Button>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>Add Exercise</h2>
                </div>

                <div style={{ position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)', paddingBottom: '16px', paddingTop: '8px', marginTop: '-8px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(26, 22, 37, 0.9)' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '14px', top: '14px', color: 'rgba(255, 255, 255, 0.4)' }} size={18} />
                        <Input
                            placeholder="Search exercises..."
                            style={{ paddingLeft: '44px' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {areas.map(area => {
                            const isActive = selectedBodyArea === area;
                            return (
                                <button
                                    key={area}
                                    onClick={() => setSelectedBodyArea(area)}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                        border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                                        background: isActive
                                            ? 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)'
                                            : 'rgba(255, 255, 255, 0.05)',
                                        color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                                        boxShadow: isActive ? '0 4px 12px rgba(236, 72, 153, 0.3)' : 'none',
                                    }}
                                >
                                    {area}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredExercises.map(ex => (
                        <motion.div
                            key={ex.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                addExercise(ex.id);
                                setShowExerciseSelector(false);
                            }}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px 20px',
                                borderRadius: '16px',
                                background: 'rgba(30, 27, 50, 0.8)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            <div>
                                <h3 style={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>{ex.name}</h3>
                                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>{ex.bodyArea}</p>
                            </div>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Plus size={18} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                            </div>
                        </motion.div>
                    ))}
                    {filteredExercises.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255, 255, 255, 0.5)' }}>
                            No exercises found
                        </div>
                    )}
                </div>
            </div>
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
                                                    value={set.weight || ''}
                                                    onChange={(e) => updateSet(exerciseInstance.id, set.id, { weight: parseFloat(e.target.value) || 0 })}
                                                />
                                                <Input
                                                    type="number"
                                                    style={{ height: '40px', textAlign: 'center', padding: '4px', background: 'rgba(255, 255, 255, 0.05)' }}
                                                    placeholder="-"
                                                    value={set.reps || ''}
                                                    onChange={(e) => updateSet(exerciseInstance.id, set.id, { reps: parseFloat(e.target.value) || 0 })}
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
                    onClick={() => setShowExerciseSelector(true)}
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
