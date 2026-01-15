import React, { useState } from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { ArrowLeft, Trash2, RotateCcw, Clock, Calendar, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import type { Workout } from '../types';

interface DeletedWorkoutsProps {
    onBack: () => void;
}

export const DeletedWorkouts: React.FC<DeletedWorkoutsProps> = ({ onBack }) => {
    const { deletedWorkouts, restoreWorkout, permanentlyDeleteWorkout } = useWorkout();
    const [workoutToRestore, setWorkoutToRestore] = useState<Workout | null>(null);
    const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);

    const getDaysRemaining = (deletedAt: number): number => {
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const expiresAt = deletedAt + sevenDaysMs;
        const remaining = expiresAt - Date.now();
        return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
    };

    const handleRestore = () => {
        if (workoutToRestore) {
            restoreWorkout(workoutToRestore.id);
            setWorkoutToRestore(null);
        }
    };

    const handlePermanentDelete = () => {
        if (workoutToDelete) {
            permanentlyDeleteWorkout(workoutToDelete.id);
            setWorkoutToDelete(null);
        }
    };

    return (
        <div style={{ paddingBottom: '96px' }}>
            {/* Header with back button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <Button
                    variant="ghost"
                    onClick={onBack}
                    style={{ padding: '8px' }}
                >
                    <ArrowLeft size={24} />
                </Button>
                <div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Deleted Workouts
                    </h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
                        Automatically removed after 7 days
                    </p>
                </div>
            </div>

            {/* Empty State */}
            {deletedWorkouts.length === 0 && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    textAlign: 'center',
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(30, 27, 50, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px',
                    }}>
                        <Trash2 size={36} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                    </div>
                    <p style={{ fontSize: '18px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                        No deleted workouts
                    </p>
                    <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.5)' }}>
                        Deleted workouts will appear here
                    </p>
                </div>
            )}

            {/* Deleted Workout Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {deletedWorkouts.map((workout, index) => {
                    const daysRemaining = workout.deletedAt ? getDaysRemaining(workout.deletedAt) : 0;

                    return (
                        <motion.div
                            key={workout.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            style={{
                                background: 'rgba(30, 27, 50, 0.8)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '20px',
                                padding: '20px',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                                        {workout.name}
                                    </h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Calendar size={14} />
                                            <span>{new Date(workout.startTime).toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric'
                                            })}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={14} />
                                            <span>
                                                {workout.endTime
                                                    ? `${Math.round((workout.endTime - workout.startTime) / 60000)} min`
                                                    : 'Incomplete'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Dumbbell size={14} />
                                            <span>{workout.exercises.length} exercises</span>
                                        </div>
                                    </div>
                                    <div style={{
                                        marginTop: '12px',
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        background: daysRemaining <= 2 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(251, 146, 60, 0.15)',
                                        display: 'inline-block',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: daysRemaining <= 2 ? '#ef4444' : '#f97316',
                                    }}>
                                        {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '16px' }}>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setWorkoutToRestore(workout)}
                                        aria-label={`Restore ${workout.name}`}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '12px',
                                            background: 'rgba(16, 185, 129, 0.15)',
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                        }}
                                    >
                                        <RotateCcw size={20} style={{ color: '#10b981' }} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setWorkoutToDelete(workout)}
                                        aria-label={`Permanently delete ${workout.name}`}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '12px',
                                            background: 'rgba(239, 68, 68, 0.15)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                        }}
                                    >
                                        <Trash2 size={20} style={{ color: '#ef4444' }} />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Restore Confirmation Modal */}
            <AnimatePresence>
                {workoutToRestore && (
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
                        onClick={() => setWorkoutToRestore(null)}
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
                            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>
                                Restore Workout?
                            </h3>
                            <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '24px' }}>
                                "<strong style={{ color: '#fff' }}>{workoutToRestore.name}</strong>" will be restored to your workout history.
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Button
                                    variant="ghost"
                                    style={{ flex: 1 }}
                                    onClick={() => setWorkoutToRestore(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    style={{ flex: 1, background: '#10b981' }}
                                    onClick={handleRestore}
                                >
                                    Restore
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Permanent Delete Confirmation Modal */}
            <AnimatePresence>
                {workoutToDelete && (
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
                        onClick={() => setWorkoutToDelete(null)}
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
                            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>
                                Delete Forever?
                            </h3>
                            <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '24px' }}>
                                "<strong style={{ color: '#fff' }}>{workoutToDelete.name}</strong>" will be permanently deleted. This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Button
                                    variant="ghost"
                                    style={{ flex: 1 }}
                                    onClick={() => setWorkoutToDelete(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    style={{ flex: 1, background: '#ef4444' }}
                                    onClick={handlePermanentDelete}
                                >
                                    Delete Forever
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
