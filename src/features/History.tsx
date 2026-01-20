import React, { useState, useRef } from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { Clock, Dumbbell, Calendar, Trash2, Edit2, ChevronRight, Home } from 'lucide-react';
import { motion, useMotionValue, useTransform, useAnimationControls, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { DeletedWorkouts } from './DeletedWorkouts';
import { WorkoutEditor } from './WorkoutEditor';
import type { Workout } from '../types';

interface SwipeableWorkoutCardProps {
    workout: Workout;
    index: number;
    onDelete: (workout: Workout, resetPosition: () => void) => void;
    onEdit: (workout: Workout) => void;
}

const SwipeableWorkoutCard: React.FC<SwipeableWorkoutCardProps> = ({ workout, index, onDelete, onEdit }) => {
    const x = useMotionValue(0);
    const controls = useAnimationControls();
    const deleteButtonOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);
    const deleteButtonScale = useTransform(x, [-100, -50, 0], [1, 0.9, 0.8]);
    const cardOpacity = useTransform(x, [-200, -100, 0], [0.5, 1, 1]);

    const resetPosition = () => {
        controls.start({ x: 0 });
    };

    const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
        // If swiped far enough or with enough velocity, trigger delete
        if (info.offset.x < -120 || info.velocity.x < -500) {
            onDelete(workout, resetPosition);
        } else {
            // Snap back if not past threshold
            resetPosition();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px' }}
        >
            {/* Delete button behind the card */}
            <motion.div
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                    borderRadius: '20px',
                    opacity: deleteButtonOpacity,
                    scale: deleteButtonScale,
                }}
            >
                <Trash2 size={28} color="#fff" />
            </motion.div>

            {/* Edit button - moves with card but outside drag listener */}
            <motion.button
                onClick={() => onEdit(workout)}
                onPointerDownCapture={(e) => e.stopPropagation()}
                onTouchStartCapture={(e) => e.stopPropagation()}
                animate={controls}
                style={{
                    x,
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    zIndex: 10,
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    padding: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px',
                }}
                aria-label={`Edit ${workout.name}`}
            >
                <Edit2 size={18} color="rgba(255, 255, 255, 0.7)" />
            </motion.button>

            {/* Draggable card */}
            <motion.div
                drag="x"
                dragConstraints={{ left: -120, right: 0 }}
                dragElastic={0.1}
                animate={controls}
                style={{
                    x,
                    opacity: cardOpacity,
                    background: 'rgba(30, 27, 50, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '20px',
                    cursor: 'grab',
                    touchAction: 'pan-y',
                }}
                onDragEnd={handleDragEnd}
                whileTap={{ cursor: 'grabbing' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ paddingRight: '48px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                            {workout.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
                            <Calendar size={14} />
                            <span>
                                {new Date(workout.startTime).toLocaleDateString(undefined, {
                                    weekday: 'short', month: 'short', day: 'numeric'
                                })}
                                {workout.endTime && (
                                    <span style={{ marginLeft: '8px', color: 'rgba(255, 255, 255, 0.4)' }}>
                                        · Finished {new Date(workout.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        <Clock size={16} style={{ color: '#60a5fa' }} />
                        <span>
                            {workout.duration
                                ? `${Math.round(workout.duration / 60)} min`
                                : workout.endTime
                                    ? `${Math.round((workout.endTime - workout.startTime) / 60000)} min`
                                    : 'Incomplete'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        <Dumbbell size={16} style={{ color: '#10b981' }} />
                        <span>{workout.exercises.length} Exercises</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

interface HistoryProps {
    onNavigate: (tab: 'workout' | 'history' | 'analytics') => void;
}

export const History: React.FC<HistoryProps> = ({ onNavigate }) => {
    const { history, deletedWorkouts, softDeleteWorkout, editingWorkout, startEditWorkout } = useWorkout();
    const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);
    const [showDeletedWorkouts, setShowDeletedWorkouts] = useState(false);
    const resetPositionRef = useRef<(() => void) | null>(null);

    // Filter out deleted workouts from active history
    const activeWorkouts = history.filter(w => !w.deletedAt);

    const handleDeleteClick = (workout: Workout, resetPosition: () => void) => {
        setWorkoutToDelete(workout);
        resetPositionRef.current = resetPosition;
    };

    const handleCancelDelete = () => {
        // Reset the card position when modal is cancelled
        resetPositionRef.current?.();
        resetPositionRef.current = null;
        setWorkoutToDelete(null);
    };

    const confirmDelete = () => {
        if (workoutToDelete) {
            softDeleteWorkout(workoutToDelete.id);
            resetPositionRef.current = null;
            setWorkoutToDelete(null);
        }
    };

    const handleEditClick = (workout: Workout) => {
        startEditWorkout(workout.id);
    };

    // Show workout editor if editing
    if (editingWorkout) {
        return <WorkoutEditor onGoHome={() => onNavigate('workout')} />;
    }

    // Show deleted workouts view
    if (showDeletedWorkouts) {
        return <DeletedWorkouts onBack={() => setShowDeletedWorkouts(false)} onGoHome={() => onNavigate('workout')} />;
    }

    if (activeWorkouts.length === 0 && deletedWorkouts.length === 0) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
                color: 'rgba(255, 255, 255, 0.5)',
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
                    <Dumbbell size={36} style={{ opacity: 0.5 }} />
                </div>
                <p style={{ fontSize: '18px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>No workouts recorded</p>
                <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.5)' }}>Start your first workout to see history!</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '96px' }}>
            <header style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #c084fc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        History
                    </h1>
                    <Button variant="ghost" size="icon" onClick={() => onNavigate('workout')} aria-label="Go to home">
                        <Home size={24} />
                    </Button>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>Swipe left to delete workouts</p>
            </header>

            {activeWorkouts.length === 0 ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px 20px',
                    color: 'rgba(255, 255, 255, 0.5)',
                }}>
                    <Dumbbell size={36} style={{ opacity: 0.5, marginBottom: '16px' }} />
                    <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.6)' }}>No active workouts</p>
                </div>
            ) : (
                [...activeWorkouts].reverse().map((workout, index) => (
                    <SwipeableWorkoutCard
                        key={workout.id}
                        workout={workout}
                        index={index}
                        onDelete={handleDeleteClick}
                        onEdit={handleEditClick}
                    />
                ))
            )}

            {/* Deleted Workouts Link */}
            {deletedWorkouts.length > 0 && (
                <Button
                    variant="ghost"
                    onClick={() => setShowDeletedWorkouts(true)}
                    style={{
                        width: '100%',
                        marginTop: '8px',
                        padding: '16px',
                        borderRadius: '16px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        background: 'rgba(239, 68, 68, 0.1)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                        <Trash2 size={20} style={{ color: '#ef4444' }} />
                        <span style={{ flex: 1, textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)' }}>
                            {deletedWorkouts.length} Deleted Workout{deletedWorkouts.length !== 1 ? 's' : ''}
                        </span>
                        <ChevronRight size={20} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                    </div>
                </Button>
            )}

            {/* Delete Confirmation Modal */}
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
                        onClick={handleCancelDelete}
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
                                Delete Workout?
                            </h3>
                            <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '24px' }}>
                                "<strong style={{ color: '#fff' }}>{workoutToDelete.name}</strong>" will be moved to deleted workouts. You can restore it within 7 days.
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Button
                                    variant="ghost"
                                    style={{ flex: 1 }}
                                    onClick={handleCancelDelete}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    style={{ flex: 1, background: '#ef4444' }}
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
