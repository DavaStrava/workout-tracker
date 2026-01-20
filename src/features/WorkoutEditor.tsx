import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, X, Plus, AlertCircle, Home } from 'lucide-react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface WorkoutEditorProps {
    onGoHome?: () => void;
}

export const WorkoutEditor: React.FC<WorkoutEditorProps> = ({ onGoHome }) => {
    const {
        editingWorkout,
        updateEditingSet,
        addEditingSet,
        removeEditingSet,
        saveEditedWorkout,
        cancelEdit,
        getExerciseName,
        getExerciseInfo,
    } = useWorkout();

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        setError(null);
        const result = await saveEditedWorkout();
        setIsSaving(false);
        if (result.error) {
            setError(result.error);
        }
    }, [saveEditedWorkout]);

    const handleWeightChange = useCallback((exerciseId: string, setId: string, value: string) => {
        const num = parseFloat(value);
        if (!isNaN(num) && num >= 0 && num <= 1000) {
            updateEditingSet(exerciseId, setId, { weight: num });
        } else if (value === '') {
            updateEditingSet(exerciseId, setId, { weight: 0 });
        }
    }, [updateEditingSet]);

    const handleRepsChange = useCallback((exerciseId: string, setId: string, value: string) => {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= 0 && num <= 999) {
            updateEditingSet(exerciseId, setId, { reps: num });
        } else if (value === '') {
            updateEditingSet(exerciseId, setId, { reps: 0 });
        }
    }, [updateEditingSet]);

    const handleDistanceChange = useCallback((exerciseId: string, setId: string, value: string) => {
        const num = parseFloat(value);
        if (!isNaN(num) && num >= 0 && num <= 1000) {
            // Convert km (display) to meters (storage)
            updateEditingSet(exerciseId, setId, { distance: num * 1000 });
        } else if (value === '') {
            updateEditingSet(exerciseId, setId, { distance: 0 });
        }
    }, [updateEditingSet]);

    const handleDurationChange = useCallback((exerciseId: string, setId: string, value: string) => {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= 0 && num <= 1440) {
            // Convert minutes (display) to seconds (storage)
            updateEditingSet(exerciseId, setId, { duration: num * 60 });
        } else if (value === '') {
            updateEditingSet(exerciseId, setId, { duration: 0 });
        }
    }, [updateEditingSet]);

    if (!editingWorkout) return null;

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '100px' }}>
            {/* Error Banner */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            marginBottom: '16px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: '12px',
                            color: '#fca5a5',
                        }}
                    >
                        <AlertCircle size={20} />
                        <span style={{ flex: 1, fontSize: '14px' }}>{error}</span>
                        <button
                            onClick={() => setError(null)}
                            style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }}
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Button variant="ghost" size="icon" onClick={cancelEdit} aria-label="Cancel editing">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 600 }}>
                            Edit Workout
                        </h2>
                        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
                            {formatDate(editingWorkout.startTime)}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {onGoHome && (
                        <Button variant="ghost" size="icon" onClick={onGoHome} aria-label="Go to home">
                            <Home size={20} />
                        </Button>
                    )}
                    <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTopColor: 'white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                marginRight: '8px',
                            }} />
                        ) : (
                            <Save size={16} style={{ marginRight: '8px' }} />
                        )}
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>

            {/* Workout Name */}
            <h3 style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 700,
                marginBottom: '24px',
                background: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
            }}>
                {editingWorkout.name}
            </h3>

            {/* Exercises */}
            {editingWorkout.exercises.length === 0 ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px 20px',
                    color: 'rgba(255, 255, 255, 0.5)',
                }}>
                    <p style={{ fontSize: '16px' }}>No exercises in this workout</p>
                </div>
            ) : (
                editingWorkout.exercises.map((exerciseInstance) => {
                    const exerciseInfo = getExerciseInfo(exerciseInstance.exerciseId);
                    const isCardio = exerciseInfo?.isCardio;

                    return (
                        <motion.div
                            key={exerciseInstance.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'rgba(30, 27, 50, 0.8)',
                                borderRadius: '16px',
                                padding: '16px',
                                marginBottom: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <h4 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                                {getExerciseName(exerciseInstance.exerciseId)}
                            </h4>

                            {/* Sets Header */}
                            {isCardio ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textAlign: 'center' }}>Set</span>
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textAlign: 'center' }}>Distance (km)</span>
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textAlign: 'center' }}>Duration (min)</span>
                                    <span></span>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textAlign: 'center' }}>Set</span>
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textAlign: 'center' }}>Weight (kg)</span>
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textAlign: 'center' }}>Reps</span>
                                    <span></span>
                                </div>
                            )}

                            {/* Sets */}
                            {exerciseInstance.sets.map((set, index) => (
                                <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', textAlign: 'center', fontWeight: 500 }}>
                                        {index + 1}
                                    </span>
                                    {isCardio ? (
                                        <>
                                            <Input
                                                type="number"
                                                inputMode="decimal"
                                                step="0.1"
                                                value={set.distance ? (set.distance / 1000) : ''}
                                                onChange={(e) => handleDistanceChange(exerciseInstance.id, set.id, e.target.value)}
                                                style={{ textAlign: 'center', padding: '10px 8px' }}
                                            />
                                            <Input
                                                type="number"
                                                inputMode="numeric"
                                                value={set.duration ? Math.round(set.duration / 60) : ''}
                                                onChange={(e) => handleDurationChange(exerciseInstance.id, set.id, e.target.value)}
                                                style={{ textAlign: 'center', padding: '10px 8px' }}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Input
                                                type="number"
                                                inputMode="decimal"
                                                step="0.5"
                                                value={set.weight ?? ''}
                                                onChange={(e) => handleWeightChange(exerciseInstance.id, set.id, e.target.value)}
                                                style={{ textAlign: 'center', padding: '10px 8px' }}
                                            />
                                            <Input
                                                type="number"
                                                inputMode="numeric"
                                                value={set.reps ?? ''}
                                                onChange={(e) => handleRepsChange(exerciseInstance.id, set.id, e.target.value)}
                                                style={{ textAlign: 'center', padding: '10px 8px' }}
                                            />
                                        </>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeEditingSet(exerciseInstance.id, set.id)}
                                        style={{ color: 'rgba(255,255,255,0.4)' }}
                                        aria-label={`Remove set ${index + 1}`}
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ))}

                            {/* Add Set Button */}
                            <Button
                                variant="ghost"
                                onClick={() => addEditingSet(exerciseInstance.id)}
                                style={{
                                    width: '100%',
                                    marginTop: '12px',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                                }}
                            >
                                <Plus size={16} style={{ marginRight: '8px' }} />
                                Add Set
                            </Button>
                        </motion.div>
                    );
                })
            )}
        </div>
    );
};
