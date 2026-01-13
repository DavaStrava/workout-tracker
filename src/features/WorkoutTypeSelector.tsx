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
        gradient: 'from-orange-500 via-orange-600 to-pink-500',
        shadow: 'shadow-orange-500/30'
    },
    {
        type: 'CARDIO',
        label: 'Cardio',
        description: 'Running, cycling, rowing, swimming',
        icon: <Heart size={32} />,
        gradient: 'from-pink-500 via-pink-600 to-purple-500',
        shadow: 'shadow-pink-500/30'
    },
    {
        type: 'HIIT',
        label: 'HIIT',
        description: 'High intensity interval training',
        icon: <Zap size={32} />,
        gradient: 'from-purple-500 via-purple-600 to-orange-500',
        shadow: 'shadow-purple-500/30'
    }
];

export const WorkoutTypeSelector: React.FC<WorkoutTypeSelectorProps> = ({ onSelect }) => {
    return (
        <div className="flex flex-col gap-6 min-h-[60vh] justify-center items-center px-4">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Start Workout
                </h2>
                <p className="text-zinc-400">Choose your workout type</p>
            </div>

            <div className="grid gap-4 w-full max-w-sm">
                {workoutTypes.map((wt, index) => (
                    <motion.button
                        key={wt.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        onClick={() => onSelect(wt.type)}
                        className={`
                            relative overflow-hidden p-6 rounded-2xl
                            bg-gradient-to-br ${wt.gradient}
                            text-white text-left
                            shadow-xl ${wt.shadow}
                        `}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-inner">
                                {wt.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold tracking-tight">{wt.label}</h3>
                                <p className="text-white/70 text-sm mt-0.5">{wt.description}</p>
                            </div>
                            <div className="text-white/40">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
