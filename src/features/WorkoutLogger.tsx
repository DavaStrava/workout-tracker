import React, { useState } from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { EXERCISES } from '../data/exercises';
import { Plus, Check, X, Trophy, Search, ChevronLeft, Save, BookOpen, Trash2, Play } from 'lucide-react';
import type { BodyArea } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../utils/styles';

export const WorkoutLogger: React.FC = () => {
    const {
        activeWorkout, startWorkout, finishWorkout, cancelWorkout,
        addExercise, addSet, removeSet, updateSet, getExerciseName,
        routines, startRoutine, saveRoutine, deleteRoutine
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
        return (
            <div className="flex flex-col gap-6 pb-24 h-full">
                <div className="flex flex-col items-center justify-center py-10 gap-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                        <div className="relative w-24 h-24 rounded-full bg-zinc-800/80 border border-white/10 flex items-center justify-center">
                            <Trophy size={40} className="text-yellow-500" />
                        </div>
                    </motion.div>

                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-bold text-white">Ready to Train?</h1>
                        <p className="text-zinc-400 text-sm">Start a fresh workout or load a routine.</p>
                    </div>

                    <Button
                        size="lg"
                        onClick={() => startWorkout()}
                        className="w-full max-w-xs shadow-blue-500/20"
                    >
                        Start Empty Workout
                    </Button>
                </div>

                {/* Routines List */}
                <div className="flex-1 px-1">
                    <div className="flex items-center gap-2 mb-4 text-zinc-400 text-sm font-medium uppercase tracking-wider">
                        <BookOpen size={14} />
                        Your Routines
                    </div>

                    {routines.length === 0 ? (
                        <div className="text-center py-8 text-zinc-600 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
                            <p className="text-sm">No saved routines yet.</p>
                            <p className="text-xs mt-1">Save a workout to see it here.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {routines.map(routine => (
                                <Card key={routine.id} variant="glass" className="flex items-center justify-between p-4 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <Play size={18} fill="currentColor" className="ml-0.5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">{routine.name}</h3>
                                            <p className="text-xs text-zinc-500">{routine.exercises.length} Exercises</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => startRoutine(routine.id)}
                                            className="bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white"
                                        >
                                            Start
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-zinc-600 hover:text-red-400"
                                            onClick={() => {
                                                if (confirm('Delete this routine?')) deleteRoutine(routine.id);
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Exercise Selector View
    if (showExerciseSelector) {
        const areas: (BodyArea | 'All')[] = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
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
                    {activeWorkout.exercises.map((exerciseInstance) => (
                        <Card key={exerciseInstance.id} variant="glass" className="overflow-visible">
                            <h3 className="text-lg font-bold mb-4 ml-1">{getExerciseName(exerciseInstance.exerciseId)}</h3>

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
                    ))}
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
