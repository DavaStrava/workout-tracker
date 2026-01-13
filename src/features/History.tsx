import React from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { Clock, Dumbbell, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const History: React.FC = () => {
    const { history } = useWorkout();

    if (history.length === 0) {
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
                <h1 style={{
                    fontSize: '36px',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #c084fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '8px',
                }}>
                    History
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>Your past training sessions</p>
            </header>

            {[...history].reverse().map((workout, index) => (
                <motion.div
                    key={workout.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        background: 'rgba(30, 27, 50, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                                {workout.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
                                <Calendar size={14} />
                                <span>{new Date(workout.startTime).toLocaleDateString(undefined, {
                                    weekday: 'short', month: 'short', day: 'numeric'
                                })}</span>
                            </div>
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                            <ChevronRight size={22} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                            <Clock size={16} style={{ color: '#60a5fa' }} />
                            <span>
                                {workout.endTime
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
            ))}
        </div>
    );
};
