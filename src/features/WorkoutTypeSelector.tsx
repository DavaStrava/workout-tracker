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
        <div className="flex flex-col min-h-[70vh] px-4 pt-8">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Start Workout
                </h2>
                <p className="text-zinc-400 text-lg">Choose your workout type</p>
            </div>

            <div className="flex flex-col gap-4 w-full flex-1">
                {workoutTypes.map((wt, index) => (
                    <motion.button
                        key={wt.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => onSelect(wt.type)}
                        className="relative overflow-hidden text-white text-left flex-1 min-h-[100px]"
                        style={{
                            background: wt.gradient,
                            boxShadow: wt.shadow,
                            borderRadius: '24px',
                            padding: '24px',
                        }}
                    >
                        <div className="flex items-center gap-5 relative z-10 h-full">
                            <div style={{
                                padding: '16px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px',
                            }}>
                                {wt.icon}
                            </div>
                            <div className="flex-1">
                                <h3 style={{ fontSize: '22px', fontWeight: 700 }}>{wt.label}</h3>
                                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '15px', marginTop: '4px' }}>{wt.description}</p>
                            </div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
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
