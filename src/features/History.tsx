import React from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { Clock, Dumbbell } from 'lucide-react';

export const History: React.FC = () => {
    const { history } = useWorkout();

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center" style={{ height: '60vh', color: 'var(--color-text-muted)' }}>
                <Dumbbell size={48} style={{ opacity: 0.5, marginBottom: 16 }} />
                <p>No workouts recorded yet.</p>
                <p className="text-sm">Start your first workout to see history!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-md">
            <h1 className="text-xl">History</h1>
            {[...history].reverse().map(workout => (
                <div key={workout.id} className="card">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg">{workout.name}</h3>
                        <span className="text-sm text-muted">
                            {new Date(workout.startTime).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="flex gap-md text-sm text-muted">
                        <div className="flex items-center gap-sm">
                            <Clock size={16} />
                            <span>
                                {workout.endTime
                                    ? `${Math.round((workout.endTime - workout.startTime) / 60000)} min`
                                    : 'Incomplete'}
                            </span>
                        </div>
                        <div className="flex items-center gap-sm">
                            <Dumbbell size={16} />
                            <span>{workout.exercises.length} Exercises</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
