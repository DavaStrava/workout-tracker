import React from 'react';
import { Dumbbell, Heart, Zap } from 'lucide-react';
import type { WorkoutType } from '../types';
import { motion } from 'framer-motion';

interface WorkoutTypeSelectorProps {
    onSelect: (type: WorkoutType) => void;
}

const workoutTypes: { type: WorkoutType; label: string; description: string; icon: React.ReactNode; gradient: string }[] = [
    {
        type: 'STRENGTH',
        label: 'Strength',
        description: 'Weights, machines, resistance training',
        icon: <Dumbbell size={32} />,
        gradient: 'from-blue-600 to-blue-400'
    },
    {
        type: 'CARDIO',
        label: 'Cardio',
        description: 'Running, cycling, rowing, swimming',
        icon: <Heart size={32} />,
        gradient: 'from-rose-600 to-rose-400'
    },
    {
        type: 'HIIT',
        label: 'HIIT',
        description: 'High intensity interval training',
        icon: <Zap size={32} />,
        gradient: 'from-amber-600 to-amber-400'
    }
];

export const WorkoutTypeSelector: React.FC<WorkoutTypeSelectorProps> = ({ onSelect }) => {
    return (
        <div className="flex flex-col gap-6 min-h-[60vh] justify-center items-center px-4">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Start Workout</h2>
                <p className="text-zinc-400">Choose your workout type</p>
            </div>

            <div className="grid gap-4 w-full max-w-sm">
                {workoutTypes.map((wt, index) => (
                    <motion.button
                        key={wt.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        onClick={() => onSelect(wt.type)}
                        className={`
                            relative overflow-hidden p-6 rounded-2xl 
                            bg-gradient-to-br ${wt.gradient}
                            text-white text-left
                            transition-all duration-200
                            hover:scale-[1.02] active:scale-[0.98]
                            shadow-lg hover:shadow-xl
                        `}
                    >
                        {/* Background glow effect */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                {wt.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{wt.label}</h3>
                                <p className="text-white/80 text-sm mt-1">{wt.description}</p>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
