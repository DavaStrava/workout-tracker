import React, { useState } from 'react';
import { LandingPage } from './LandingPage';
import { CardioLogger } from './CardioLogger';
import { useWorkout } from '../hooks/useWorkoutStore';
import { EXERCISES } from '../data/exercises';
import { Plus, Check, X, Search, ChevronLeft, Save, History } from 'lucide-react';
import type { BodyArea } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../utils/styles';
import { getLastPerformance } from '../utils/analyticsHelpers';

export const WorkoutLogger: React.FC<{ onNavigate: (tab: 'workout' | 'history' | 'analytics') => void }> = ({ onNavigate }) => {
    const {
        activeWorkout, history, finishWorkout, cancelWorkout,
        addExercise, addSet, removeSet, updateSet, getExerciseName,
        saveRoutine
    } = useWorkout();

    const [showExerciseSelector, setShowExerciseSelector] = useState(false);
    const [selectedBodyArea, setSelectedBodyArea] = useState<BodyArea | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSaveRoutine = () => {
        const name = window.prompt("Enter routine name:");
        if (name) {
            saveRoutine(name);
            alert("Routine saved!");
        }
    };

    if (!activeWorkout) {
        return <LandingPage onNavigate={onNavigate} />;
    }

    // Render CardioLogger for CARDIO workouts
    if (activeWorkout.type === 'CARDIO') {
        return <CardioLogger onBack={() => cancelWorkout()} />;
    }

    // Exercise Selector View
    if (showExerciseSelector) {
        const areas: (BodyArea | 'All')[] = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];
        const filteredExercises = EXERCISES.filter(e => {
            const matchesArea = selectedBodyArea === 'All' || e.bodyArea === selectedBodyArea;
            const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesArea && matchesSearch;
        });

        return (
            <div className="flex flex-col gap-6 h-full pb-20">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setShowExerciseSelector(false)}>
                        <ChevronLeft size={24} />
                    </Button>
                    <h2 className="text-xl font-bold">Add Exercise</h2>
                </div>

                <div className="sticky top-0 z-10 bg-bg-app/80 backdrop-blur-md pb-4 pt-2 -mt-2 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
                        <Input
                            placeholder="Search exercises..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {areas.map(area => (
                            <button
                                key={area}
                                onClick={() => setSelectedBodyArea(area)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                                    selectedBodyArea === area
                                        ? "bg-blue-600 border-blue-500 text-white"
                                        : "bg-zinc-800/50 border-white/10 text-zinc-400 hover:bg-zinc-800"
                                )}
                            >
                                {area}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-2">
                    {filteredExercises.map(ex => (
                        <Card
                            key={ex.id}
                            variant="glass"
                            className="flex justify-between items-center cursor-pointer hover:bg-white/5 active:scale-[0.99] transition-all"
                            onClick={() => {
                                addExercise(ex.id);
                                setShowExerciseSelector(false);
                            }}
                        >
                            <div>
                                <h3 className="font-semibold text-white">{ex.name}</h3>
                                <p className="text-xs text-zinc-500">{ex.bodyArea}</p>
                            </div>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/5">
                                <Plus size={16} />
                            </Button>
                        </Card>
                    ))}
                    {filteredExercises.length === 0 && (
                        <div className="text-center py-10 text-zinc-500">
                            No exercises found
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Active Workout View
    return (
        <div className="flex flex-col gap-6 pb-24">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        {activeWorkout.name}
                    </h1>
                    <div className="text-sm text-zinc-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Started {new Date(activeWorkout.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleSaveRoutine} title="Save as Routine">
                        <Save size={20} />
                    </Button>
                    <Button variant="danger" size="icon" onClick={cancelWorkout} title="Cancel">
                        <X size={20} />
                    </Button>
                    <Button variant="primary" onClick={finishWorkout}>
                        Finish
                    </Button>
                </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-6">
                <AnimatePresence initial={false}>
                    {activeWorkout.exercises.map((exerciseInstance) => {
                        const lastPerf = getLastPerformance(history, exerciseInstance.exerciseId);
                        return (
                            <Card key={exerciseInstance.id} variant="glass" className="overflow-visible">
                                <div className="mb-4 ml-1">
                                    <h3 className="text-lg font-bold">{getExerciseName(exerciseInstance.exerciseId)}</h3>
                                    {lastPerf && (
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                                            <History size={12} />
                                            <span>Last: {lastPerf.weight}kg × {lastPerf.reps} ({lastPerf.date})</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {/* Header Row */}
                                    <div className="grid grid-cols-[24px_1fr_1fr_32px] gap-3 text-xs font-medium text-zinc-500 text-center px-1">
                                        <span>#</span>
                                        <span>kg</span>
                                        <span>Reps</span>
                                        <span>✓</span>
                                    </div>

                                    {/* Sets */}
                                    <AnimatePresence initial={false}>
                                        {exerciseInstance.sets.map((set, index) => (
                                            <motion.div
                                                key={set.id}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                className="grid grid-cols-[24px_1fr_1fr_32px] gap-3 items-center"
                                            >
                                                <div className="flex items-center justify-center text-sm text-zinc-500 font-mono">
                                                    {index + 1}
                                                </div>
                                                <Input
                                                    type="number"
                                                    className="h-9 text-center p-1 bg-zinc-900/50"
                                                    placeholder="-"
                                                    value={set.weight || ''}
                                                    onChange={(e) => updateSet(exerciseInstance.id, set.id, { weight: parseFloat(e.target.value) || 0 })}
                                                />
                                                <Input
                                                    type="number"
                                                    className="h-9 text-center p-1 bg-zinc-900/50"
                                                    placeholder="-"
                                                    value={set.reps || ''}
                                                    onChange={(e) => updateSet(exerciseInstance.id, set.id, { reps: parseFloat(e.target.value) || 0 })}
                                                />
                                                <button
                                                    onClick={() => updateSet(exerciseInstance.id, set.id, { completed: !set.completed })}
                                                    className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                                        set.completed
                                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                                            : "bg-zinc-800 text-zinc-600 hover:bg-zinc-700 hover:text-zinc-400"
                                                    )}
                                                >
                                                    <Check size={16} strokeWidth={3} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-white/5">
                                    {exerciseInstance.sets.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            onClick={() => removeSet(exerciseInstance.id, exerciseInstance.sets[exerciseInstance.sets.length - 1].id)}
                                        >
                                            Remove Set
                                        </Button>
                                    )}
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => addSet(exerciseInstance.id)}
                                    >
                                        + Add Set
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </AnimatePresence>

                <Button
                    variant="glass"
                    className="w-full h-16 border-dashed border-white/20 text-zinc-400 hover:text-white hover:border-white/40 gap-2"
                    onClick={() => setShowExerciseSelector(true)}
                >
                    <Plus size={20} />
                    Add Exercise
                </Button>
            </div>
        </div>
    );
};
