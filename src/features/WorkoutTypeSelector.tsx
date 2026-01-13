import React from 'react';
import { Dumbbell, Heart, Zap } from 'lucide-react';
import type { WorkoutType } from '../types';
import { motion } from 'framer-motion';

interface WorkoutTypeSelectorProps {
    onSelect: (type: WorkoutType) => void;
}

const workoutTypes: { type: WorkoutType; label: string; description: string; icon: React.ReactNode; gradient: string; shadow: string }[] = [
    {
        type: 'STRENGTH',
        label: 'Strength',
        description: 'Weights, machines, resistance training',
        icon: <Dumbbell size={32} />,
        gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #ec4899 100%)',
        shadow: '0 20px 40px rgba(249, 115, 22, 0.3)'
    },
    {
        type: 'CARDIO',
        label: 'Cardio',
        description: 'Running, cycling, rowing, swimming',
        icon: <Heart size={32} />,
        gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #a855f7 100%)',
        shadow: '0 20px 40px rgba(236, 72, 153, 0.3)'
    },
    {
        type: 'HIIT',
        label: 'HIIT',
        description: 'High intensity interval training',
        icon: <Zap size={32} />,
        gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #f97316 100%)',
        shadow: '0 20px 40px rgba(168, 85, 247, 0.3)'
    }
];

export const WorkoutTypeSelector: React.FC<WorkoutTypeSelectorProps> = ({ onSelect }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '65vh',
            paddingTop: '16px',
        }}>
            {/* Header - matching landing page typography */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{
                    fontSize: '36px',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #c084fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '12px',
                    lineHeight: 1.2,
                }}>
                    Start Workout
                </h2>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '18px',
                    fontWeight: 500,
                }}>
                    Choose your workout type
                </p>
            </div>

            {/* Workout type buttons with proper spacing */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                width: '100%',
                flex: 1,
            }}>
                {workoutTypes.map((wt, index) => (
                    <motion.button
                        key={wt.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => onSelect(wt.type)}
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                            color: '#fff',
                            textAlign: 'left',
                            flex: 1,
                            minHeight: '110px',
                            background: wt.gradient,
                            boxShadow: wt.shadow,
                            borderRadius: '24px',
                            padding: '24px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            position: 'relative',
                            zIndex: 10,
                            height: '100%',
                        }}>
                            <div style={{
                                padding: '16px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px',
                            }}>
                                {wt.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    marginBottom: '4px',
                                    letterSpacing: '-0.02em',
                                }}>
                                    {wt.label}
                                </h3>
                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.85)',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                }}>
                                    {wt.description}
                                </p>
                            </div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6"/>
                                </svg>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
