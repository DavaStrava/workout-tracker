import React from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { Clock, Dumbbell, Calendar, ChevronRight } from 'lucide-react';
import { Card } from '../components/Card';

export const History: React.FC = () => {
    const { history } = useWorkout();

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
                <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-6">
                    <Dumbbell size={32} className="opacity-50" />
                </div>
                <p className="text-lg font-medium text-zinc-300">No workouts recorded</p>
                <p className="text-sm">Start your first workout to see history!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 pb-20">
            <header className="mb-4">
                <h1 className="text-h1 text-gradient">History</h1>
                <p className="text-zinc-400">Your past training sessions</p>
            </header>

            {[...history].reverse().map((workout, index) => (
                <Card
                    key={workout.id}
                    variant="glass"
                    className="group hover:bg-white/5 transition-colors cursor-pointer active:scale-[0.98]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                {workout.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                                <Calendar size={12} />
                                <span>{new Date(workout.startTime).toLocaleDateString(undefined, {
                                    weekday: 'short', month: 'short', day: 'numeric'
                                })}</span>
                            </div>
                        </div>
                        <div className="text-zinc-600">
                            <ChevronRight size={20} />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Clock size={14} className="text-blue-500" />
                            <span>
                                {workout.endTime
                                    ? `${Math.round((workout.endTime - workout.startTime) / 60000)} min`
                                    : 'Incomplete'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Dumbbell size={14} className="text-emerald-500" />
                            <span>{workout.exercises.length} Exercises</span>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
