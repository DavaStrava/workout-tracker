import React, { useMemo } from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { Card } from '../components/Card';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Activity, Calendar } from 'lucide-react';

export const Analytics: React.FC = () => {
    const { history } = useWorkout();

    // Calculate weekly stats
    const weeklyStats = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString(undefined, { weekday: 'short' });
        });

        // Mock data logic - in real app would aggregate actual history
        // For MVP, if no history, show zeros
        if (history.length === 0) {
            return last7Days.map(day => ({ name: day, volume: 0 }));
        }

        // Simple aggregation logic (volume = total sets completed)
        const stats = last7Days.map(day => {
            const sets = history.filter(w =>
                new Date(w.startTime).toLocaleDateString(undefined, { weekday: 'short' }) === day
            ).reduce((acc, w) => acc + w.exercises.reduce((s, e) => s + e.sets.filter(x => x.completed).length, 0), 0);

            return { name: day, volume: sets };
        });

        return stats;
    }, [history]);

    const totalWorkouts = history.length;
    const totalSets = history.reduce((acc, w) => acc + w.exercises.reduce((s, e) => s + e.sets.filter(x => x.completed).length, 0), 0);

    return (
        <div className="flex flex-col gap-6 pb-24">
            <header className="mb-2">
                <h1 className="text-h1 text-gradient">Analytics</h1>
                <p className="text-zinc-400">Track your progress over time</p>
            </header>

            <div className="grid grid-cols-2 gap-4">
                <Card variant="glass" className="p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                        <Activity size={14} className="text-blue-500" />
                        Total Sets
                    </div>
                    <div className="text-2xl font-bold">{totalSets}</div>
                </Card>
                <Card variant="glass" className="p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                        <TrendingUp size={14} className="text-emerald-500" />
                        Workouts
                    </div>
                    <div className="text-2xl font-bold">{totalWorkouts}</div>
                </Card>
            </div>

            <Card variant="glass" className="h-[300px] w-full p-4">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Calendar size={18} className="text-purple-500" />
                    Weekly Volume (Sets)
                </h3>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyStats}>
                            <XAxis
                                dataKey="name"
                                stroke="#52525b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                                {weeklyStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.volume > 0 ? '#3b82f6' : '#27272a'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};
