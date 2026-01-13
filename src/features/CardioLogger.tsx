import React, { useState } from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { EXERCISES } from '../data/exercises';
import { Plus, ChevronLeft, Check, Clock, Ruler, MessageSquare } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AnimatePresence, motion } from 'framer-motion';
import type { CardioIntensity } from '../types';

export const CardioLogger: React.FC = () => {
    const {
        activeWorkout, finishWorkout, cancelWorkout,
        addExercise, updateSet, updateNotes, getExerciseName
    } = useWorkout();

    const [showExerciseSelector, setShowExerciseSelector] = useState(false);

    // Get only cardio exercises
    const cardioExercises = EXERCISES.filter(e => e.isCardio);

    if (!activeWorkout) return null;

    // Exercise Selector
    if (showExerciseSelector) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button variant="ghost" size="icon" onClick={() => setShowExerciseSelector(false)}>
                        <ChevronLeft size={24} />
                    </Button>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>Select Activity</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {cardioExercises.map((ex, index) => (
                        <motion.button
                            key={ex.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => {
                                addExercise(ex.id);
                                setShowExerciseSelector(false);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '18px 20px',
                                borderRadius: '16px',
                                background: 'rgba(30, 27, 50, 0.8)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            <span style={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>{ex.name}</span>
                            <Plus size={20} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '96px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        {activeWorkout.name}
                    </h1>
                    <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', animation: 'pulse 2s infinite' }} />
                        Cardio Session
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="ghost" size="sm" onClick={cancelWorkout}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={finishWorkout}>
                        Finish
                    </Button>
                </div>
            </div>

            {/* Activities */}
            <AnimatePresence initial={false}>
                {activeWorkout.exercises.map((exerciseInstance) => {
                    const set = exerciseInstance.sets[0]; // Cardio typically has 1 set per activity
                    if (!set) return null;

                    return (
                        <div
                            key={exerciseInstance.id}
                            style={{
                                background: 'rgba(30, 27, 50, 0.8)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '24px',
                                padding: '24px',
                            }}
                        >
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                                🏃 {getExerciseName(exerciseInstance.exerciseId)}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {/* Duration */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Clock size={20} style={{ color: '#f472b6' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration (min)</label>
                                        <Input
                                            type="number"
                                            className="mt-1 bg-zinc-900/50"
                                            placeholder="30"
                                            value={set.duration ? Math.round(set.duration / 60) : ''}
                                            onChange={(e) => updateSet(exerciseInstance.id, set.id, {
                                                duration: (parseFloat(e.target.value) || 0) * 60
                                            })}
                                        />
                                    </div>
                                </div>

                                {/* Distance */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Ruler size={20} style={{ color: '#60a5fa' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Distance (km)</label>
                                        <Input
                                            type="number"
                                            className="mt-1 bg-zinc-900/50"
                                            placeholder="5.0"
                                            step="0.1"
                                            value={set.distance ? (set.distance / 1000).toFixed(1) : ''}
                                            onChange={(e) => updateSet(exerciseInstance.id, set.id, {
                                                distance: (parseFloat(e.target.value) || 0) * 1000
                                            })}
                                        />
                                    </div>
                                </div>

                                {/* Intensity */}
                                <div>
                                    <label id={`intensity-label-${exerciseInstance.id}`} style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'block' }}>Intensity</label>
                                    <div role="group" aria-labelledby={`intensity-label-${exerciseInstance.id}`} style={{ display: 'flex', gap: '10px' }}>
                                        {(['low', 'medium', 'high'] as CardioIntensity[]).map(level => {
                                            const isActive = set.intensity === level;
                                            const colors = {
                                                low: { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.5)', text: '#22c55e' },
                                                medium: { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.5)', text: '#f59e0b' },
                                                high: { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.5)', text: '#ef4444' },
                                            };
                                            return (
                                                <button
                                                    key={level}
                                                    aria-pressed={isActive}
                                                    aria-label={`${level} intensity`}
                                                    onClick={() => updateSet(exerciseInstance.id, set.id, { intensity: level })}
                                                    style={{
                                                        flex: 1,
                                                        padding: '12px 16px',
                                                        borderRadius: '12px',
                                                        fontWeight: 600,
                                                        fontSize: '14px',
                                                        textTransform: 'capitalize',
                                                        transition: 'all 0.2s',
                                                        cursor: 'pointer',
                                                        background: isActive ? colors[level].bg : 'rgba(255, 255, 255, 0.05)',
                                                        border: isActive ? `1px solid ${colors[level].border}` : '1px solid rgba(255, 255, 255, 0.1)',
                                                        color: isActive ? colors[level].text : 'rgba(255, 255, 255, 0.6)',
                                                    }}
                                                >
                                                    {level}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Completed toggle */}
                                <button
                                    aria-pressed={set.completed}
                                    aria-label={set.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                    onClick={() => updateSet(exerciseInstance.id, set.id, { completed: !set.completed })}
                                    style={{
                                        width: '100%',
                                        padding: '14px 20px',
                                        borderRadius: '16px',
                                        fontWeight: 600,
                                        fontSize: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                        border: 'none',
                                        background: set.completed
                                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                            : 'rgba(255, 255, 255, 0.05)',
                                        color: set.completed ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                                        boxShadow: set.completed ? '0 8px 20px rgba(16, 185, 129, 0.3)' : 'none',
                                    }}
                                >
                                    <Check size={18} />
                                    {set.completed ? 'Completed' : 'Mark Complete'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </AnimatePresence>

            {/* Notes Section */}
            <div style={{
                background: 'rgba(30, 27, 50, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '24px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <MessageSquare size={18} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)' }}>Session Notes</label>
                </div>
                <textarea
                    style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '14px',
                        color: '#fff',
                        fontSize: '15px',
                        resize: 'none',
                        outline: 'none',
                    }}
                    rows={3}
                    placeholder="How did you feel? Any notes..."
                    value={activeWorkout.notes || ''}
                    onChange={(e) => updateNotes(e.target.value)}
                />
            </div>

            {/* Add Activity */}
            <button
                onClick={() => setShowExerciseSelector(true)}
                style={{
                    width: '100%',
                    height: '60px',
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
                Add Activity
            </button>
        </div>
    );
};
