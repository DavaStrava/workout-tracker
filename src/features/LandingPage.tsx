import React, { useState } from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { Play, ArrowLeft } from 'lucide-react';
import { WorkoutTypeSelector } from './WorkoutTypeSelector';
import type { WorkoutType } from '../types';

interface LandingPageProps {
    onNavigate: (tab: 'workout' | 'history' | 'analytics') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const { routines, history, startWorkout, startRoutine } = useWorkout();
    const [showTypeSelector, setShowTypeSelector] = useState(false);

    const handleSelectType = (type: WorkoutType) => {
        startWorkout('New Workout', type);
        setShowTypeSelector(false);
    };

    // Analytics Calculations
    const totalWorkouts = history.length;
    const totalDurationMs = history.reduce((acc, curr) => {
        if (curr.endTime && curr.startTime) {
            return acc + (curr.endTime - curr.startTime);
        }
        return acc;
    }, 0);
    const totalHours = Math.round(totalDurationMs / (1000 * 60 * 60));

    const totalSets = history.reduce((acc, workout) => {
        return acc + workout.exercises.reduce((wAcc, ex) => wAcc + ex.sets.length, 0);
    }, 0);

    const totalWeight = history.reduce((acc, workout) => {
        return acc + workout.exercises.reduce((wAcc, ex) => {
            return wAcc + ex.sets.reduce((sAcc, set) => sAcc + ((set.weight || 0) * (set.reps || 1)), 0);
        }, 0);
    }, 0);

    const formatWeight = (lbs: number) => {
        if (lbs >= 1000) return `${(lbs / 1000).toFixed(1)}k`;
        return lbs.toString();
    };

    // Show Workout Type Selector
    if (showTypeSelector) {
        return (
            <div className="min-h-full pb-24 px-4 pt-6 animate-fade-in">
                <button
                    onClick={() => setShowTypeSelector(false)}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
                <WorkoutTypeSelector onSelect={handleSelectType} />
            </div>
        );
    }

    return (
        <div className="min-h-full pb-24 px-4 pt-6 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-4xl font-extrabold pb-2 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                    Ready to Train?
                </h1>
                <p className="text-zinc-400 text-lg">Start a fresh workout or load a routine.</p>
            </div>

            {/* Main CTA */}
            <button
                onClick={() => setShowTypeSelector(true)}
                className="w-full max-w-xl mx-auto block p-5 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 text-white text-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/40 active:scale-[0.98]"
            >
                Start new workout
            </button>

            {/* Tiles Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">

                {/* Workout Routines Tile */}
                <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700/30 rounded-3xl p-6 flex flex-col hover:-translate-y-1 hover:border-zinc-600/50 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                        <span className="text-3xl">💪</span>
                        <h2 className="text-2xl font-semibold text-white">Workout routines</h2>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className="bg-white/5 rounded-2xl p-6 text-center flex-1 flex flex-col justify-center mb-6">
                            <p className="text-zinc-400 mb-2">Your Routines</p>
                            <div className="text-5xl font-bold text-blue-400 mb-4">{routines.length}</div>
                            {routines.length === 0 ? (
                                <>
                                    <p className="text-white mb-1">No saved routines yet.</p>
                                    <p className="text-zinc-500 text-sm">Save a workout to see it here.</p>
                                </>
                            ) : (
                                <div className="space-y-2 w-full text-left">
                                    {routines.slice(0, 3).map(routine => (
                                        <button
                                            key={routine.id}
                                            onClick={() => startRoutine(routine.id)}
                                            className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors group"
                                        >
                                            <span className="font-medium text-zinc-200 group-hover:text-white truncate">{routine.name}</span>
                                            <Play size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                    {routines.length > 3 && (
                                        <div className="text-center text-xs text-zinc-500 mt-2">
                                            + {routines.length - 3} more
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {routines.length === 0 && (
                            <button className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-violet-600 rounded-xl text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-[0.98]">
                                Create workout routine
                            </button>
                        )}
                    </div>
                </div>

                {/* Analytics Tile */}
                <div
                    onClick={() => onNavigate('analytics')}
                    className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700/30 rounded-3xl p-6 flex flex-col hover:-translate-y-1 hover:border-zinc-600/50 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                        <span className="text-3xl">📊</span>
                        <h2 className="text-2xl font-semibold text-white group-hover:text-blue-400 transition-colors">Analytics</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 flex-1 content-start">
                        <div className="bg-white/5 rounded-2xl p-4 text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-1">{totalWorkouts}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Workouts</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-1">{totalHours}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Hours</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-1">{totalSets}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Sets</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-1">{formatWeight(totalWeight)}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">lbs Lifted</div>
                        </div>
                    </div>
                </div>

                {/* History Tile */}
                <div
                    onClick={() => onNavigate('history')}
                    className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700/30 rounded-3xl p-6 flex flex-col hover:-translate-y-1 hover:border-zinc-600/50 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                        <span className="text-3xl">🕐</span>
                        <h2 className="text-2xl font-semibold text-white group-hover:text-blue-400 transition-colors">History</h2>
                    </div>

                    <div className="space-y-3 flex-1">
                        {history.slice(0, 5).map((workout) => (
                            <div key={workout.id} className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-3 flex justify-between items-center">
                                <div>
                                    <div className="text-blue-400 text-sm font-semibold mb-0.5">
                                        {new Date(workout.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(workout.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-white font-medium">{workout.name}</div>
                                    <div className="text-zinc-500 text-xs mt-0.5">
                                        {workout.endTime ? Math.round((workout.endTime - workout.startTime) / 60000) : 0} minutes
                                    </div>
                                </div>
                            </div>
                        ))}
                        {history.length === 0 && (
                            <div className="text-center text-zinc-500 py-10 italic">
                                No workout history yet.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
