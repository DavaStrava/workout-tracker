import React, { useMemo, useState } from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { Card } from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Activity, Calendar, Dumbbell, Heart, Zap, ChevronDown } from 'lucide-react';
import { EXERCISES } from '../data/exercises';
import { calculateTotalVolume, getWorkoutFrequency, getExerciseProgress, getVolumeByWeek } from '../utils/analyticsHelpers';
import { cn } from '../utils/styles';

type TimePeriod = 'week' | 'month' | 'year';

export const Analytics: React.FC = () => {
    const { history } = useWorkout();
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
    const [selectedExercise, setSelectedExercise] = useState<string>('bench_press');

    // Calculate stats based on time period
    const periodStats = useMemo(() => {
        return getWorkoutFrequency(history, timePeriod);
    }, [history, timePeriod]);

    // Calculate total volume
    const totalVolume = useMemo(() => {
        const periodMs = timePeriod === 'week' ? 7 * 24 * 60 * 60 * 1000
            : timePeriod === 'month' ? 30 * 24 * 60 * 60 * 1000
                : 365 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const filtered = history.filter(w => (now - w.startTime) <= periodMs);
        return calculateTotalVolume(filtered);
    }, [history, timePeriod]);

    // Weekly volume chart data
    const weeklyVolumeData = useMemo(() => getVolumeByWeek(history), [history]);

    // Exercise progress data
    const exerciseProgressData = useMemo(() => {
        return getExerciseProgress(history, selectedExercise);
    }, [history, selectedExercise]);

    const totalReps = useMemo(() => {
        return history.reduce((total, w) =>
            total + w.exercises.reduce((eTotal, e) =>
                eTotal + e.sets.reduce((sTotal, s) =>
                    sTotal + (s.completed && s.reps ? s.reps : 0), 0), 0), 0);
    }, [history]);

    const formatVolume = (vol: number) => {
        if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
        if (vol >= 1000) return `${(vol / 1000).toFixed(1)}k`;
        return vol.toString();
    };

    const strengthExercises = EXERCISES.filter(e => !e.isCardio);

    return (
        <div className="flex flex-col gap-6 pb-24">
            <header className="mb-2">
                <h1 className="text-h1 text-gradient">Analytics</h1>
                <p className="text-zinc-400">Track your progress over time</p>
            </header>

            {/* Time Period Selector */}
            <div className="flex gap-2">
                {(['week', 'month', 'year'] as TimePeriod[]).map(period => (
                    <button
                        key={period}
                        onClick={() => setTimePeriod(period)}
                        className={cn(
                            "flex-1 py-2.5 rounded-xl font-medium text-sm transition-all capitalize",
                            timePeriod === period
                                ? "bg-blue-600 text-white"
                                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50"
                        )}
                    >
                        {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'This Year'}
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <Card variant="glass" className="p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                        <Activity size={14} className="text-blue-500" />
                        Total Volume
                    </div>
                    <div className="text-2xl font-bold">{formatVolume(totalVolume)} kg</div>
                </Card>
                <Card variant="glass" className="p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                        <TrendingUp size={14} className="text-emerald-500" />
                        Total Reps
                    </div>
                    <div className="text-2xl font-bold">{totalReps}</div>
                </Card>
            </div>

            {/* Workout Frequency by Type */}
            <Card variant="glass" className="p-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-purple-500" />
                    Workout Frequency
                </h3>
                <div className="text-3xl font-bold mb-4">{periodStats.total} workouts</div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-500/20 rounded-xl p-3 text-center">
                        <Dumbbell size={20} className="text-blue-400 mx-auto mb-1" />
                        <div className="text-xl font-bold text-blue-400">{periodStats.byType.STRENGTH || 0}</div>
                        <div className="text-xs text-zinc-500">Strength</div>
                    </div>
                    <div className="bg-rose-500/20 rounded-xl p-3 text-center">
                        <Heart size={20} className="text-rose-400 mx-auto mb-1" />
                        <div className="text-xl font-bold text-rose-400">{periodStats.byType.CARDIO || 0}</div>
                        <div className="text-xs text-zinc-500">Cardio</div>
                    </div>
                    <div className="bg-amber-500/20 rounded-xl p-3 text-center">
                        <Zap size={20} className="text-amber-400 mx-auto mb-1" />
                        <div className="text-xl font-bold text-amber-400">{periodStats.byType.HIIT || 0}</div>
                        <div className="text-xs text-zinc-500">HIIT</div>
                    </div>
                </div>
            </Card>

            {/* Volume Chart */}
            <Card variant="glass" className="p-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-500" />
                    Weekly Volume Trend
                </h3>
                <div className="h-[200px] w-full">
                    {weeklyVolumeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyVolumeData}>
                                <XAxis dataKey="week" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value) => [`${formatVolume(Number(value) || 0)} kg`, 'Volume']}
                                />
                                <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                                    {weeklyVolumeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.volume > 0 ? '#10b981' : '#27272a'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-500">
                            No volume data yet
                        </div>
                    )}
                </div>
            </Card>

            {/* Exercise Progress */}
            <Card variant="glass" className="p-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Dumbbell size={18} className="text-blue-500" />
                    Exercise Progress
                </h3>

                {/* Exercise Selector */}
                <div className="relative mb-4">
                    <select
                        value={selectedExercise}
                        onChange={(e) => setSelectedExercise(e.target.value)}
                        className="w-full appearance-none bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-white/20"
                    >
                        {strengthExercises.map(ex => (
                            <option key={ex.id} value={ex.id}>{ex.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>

                <div className="h-[180px] w-full">
                    {exerciseProgressData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={exerciseProgressData}>
                                <XAxis dataKey="date" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} width={40} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value) => [`${Number(value) || 0} kg`, 'Max Weight']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="maxWeight"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
                                    activeDot={{ r: 6, fill: '#60a5fa' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-500 text-center">
                            <div>
                                <p>No data for this exercise yet</p>
                                <p className="text-xs mt-1">Complete some sets to see your progress!</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
