import React, { useState } from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { EXERCISES } from '../data/exercises';
import { Plus, ChevronLeft, Check, Clock, Ruler, MessageSquare } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../utils/styles';
import type { CardioIntensity } from '../types';

interface CardioLoggerProps {
    onBack: () => void;
}

export const CardioLogger: React.FC<CardioLoggerProps> = ({ onBack: _onBack }) => {
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
            <div className="flex flex-col gap-6 pb-20">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setShowExerciseSelector(false)}>
                        <ChevronLeft size={24} />
                    </Button>
                    <h2 className="text-xl font-bold">Select Activity</h2>
                </div>

                <div className="grid gap-3">
                    {cardioExercises.map((ex, index) => (
                        <motion.button
                            key={ex.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                                addExercise(ex.id);
                                setShowExerciseSelector(false);
                            }}
                            className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-white/5 hover:bg-zinc-700/50 transition-all"
                        >
                            <span className="font-medium text-white">{ex.name}</span>
                            <Plus size={18} className="text-zinc-500" />
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 pb-24">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-rose-500">
                        {activeWorkout.name}
                    </h1>
                    <div className="text-sm text-zinc-500 flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        Cardio Session
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="danger" size="sm" onClick={cancelWorkout}>
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
                        <Card key={exerciseInstance.id} variant="glass">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                🏃 {getExerciseName(exerciseInstance.exerciseId)}
                            </h3>

                            <div className="space-y-4">
                                {/* Duration */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                                        <Clock size={18} className="text-rose-400" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider">Duration (min)</label>
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
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <Ruler size={18} className="text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider">Distance (km)</label>
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
                                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Intensity</label>
                                    <div className="flex gap-2">
                                        {(['low', 'medium', 'high'] as CardioIntensity[]).map(level => (
                                            <button
                                                key={level}
                                                onClick={() => updateSet(exerciseInstance.id, set.id, { intensity: level })}
                                                className={cn(
                                                    "flex-1 py-2.5 rounded-xl font-medium text-sm transition-all capitalize",
                                                    set.intensity === level
                                                        ? level === 'low' ? "bg-green-500/30 text-green-400 border border-green-500/50"
                                                            : level === 'medium' ? "bg-amber-500/30 text-amber-400 border border-amber-500/50"
                                                                : "bg-red-500/30 text-red-400 border border-red-500/50"
                                                        : "bg-zinc-800/50 text-zinc-400 border border-white/5 hover:bg-zinc-700/50"
                                                )}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Completed toggle */}
                                <button
                                    onClick={() => updateSet(exerciseInstance.id, set.id, { completed: !set.completed })}
                                    className={cn(
                                        "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all",
                                        set.completed
                                            ? "bg-emerald-500 text-white"
                                            : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50"
                                    )}
                                >
                                    <Check size={18} />
                                    {set.completed ? 'Completed' : 'Mark Complete'}
                                </button>
                            </div>
                        </Card>
                    );
                })}
            </AnimatePresence>

            {/* Notes Section */}
            <Card variant="glass">
                <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={16} className="text-zinc-500" />
                    <label className="text-sm font-medium text-zinc-400">Session Notes</label>
                </div>
                <textarea
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-white/20"
                    rows={3}
                    placeholder="How did you feel? Any notes..."
                    value={activeWorkout.notes || ''}
                    onChange={(e) => updateNotes(e.target.value)}
                />
            </Card>

            {/* Add Activity */}
            <Button
                variant="glass"
                className="w-full h-14 border-dashed border-white/20 text-zinc-400 hover:text-white gap-2"
                onClick={() => setShowExerciseSelector(true)}
            >
                <Plus size={20} />
                Add Activity
            </Button>
        </div>
    );
};
