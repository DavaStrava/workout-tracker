import React, { useMemo, useState } from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Activity, Calendar, Dumbbell, Heart, Zap, ChevronDown, Clock } from 'lucide-react';
import { EXERCISES } from '../data/exercises';
import { calculateTotalVolume, getWorkoutFrequency, getExerciseProgress, getVolumeByWeek, getAverageDuration, getDurationByWeek } from '../utils/analyticsHelpers';

type TimePeriod = 'week' | 'month' | 'year';

export const Analytics: React.FC = () => {
    const { history } = useWorkout();
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
    const [selectedExercise, setSelectedExercise] = useState<string>('bench_press');

    // Filter out deleted workouts from analytics
    const activeWorkouts = useMemo(() => history.filter(w => !w.deletedAt), [history]);

    // Calculate stats based on time period
    const periodStats = useMemo(() => {
        return getWorkoutFrequency(activeWorkouts, timePeriod);
    }, [activeWorkouts, timePeriod]);

    // Calculate total volume
    const totalVolume = useMemo(() => {
        const periodMs = timePeriod === 'week' ? 7 * 24 * 60 * 60 * 1000
            : timePeriod === 'month' ? 30 * 24 * 60 * 60 * 1000
                : 365 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const filtered = activeWorkouts.filter(w => (now - w.startTime) <= periodMs);
        return calculateTotalVolume(filtered);
    }, [activeWorkouts, timePeriod]);

    // Weekly volume chart data
    const weeklyVolumeData = useMemo(() => getVolumeByWeek(activeWorkouts), [activeWorkouts]);

    // Exercise progress data
    const exerciseProgressData = useMemo(() => {
        return getExerciseProgress(activeWorkouts, selectedExercise);
    }, [activeWorkouts, selectedExercise]);

    const totalReps = useMemo(() => {
        return activeWorkouts.reduce((total, w) =>
            total + w.exercises.reduce((eTotal, e) =>
                eTotal + e.sets.reduce((sTotal, s) =>
                    // Count sets with actual reps data (reps > 0)
                    sTotal + (s.reps && s.reps > 0 ? s.reps : 0), 0), 0), 0);
    }, [activeWorkouts]);

    // Duration stats
    const avgDuration = useMemo(() => getAverageDuration(activeWorkouts), [activeWorkouts]);
    const weeklyDurationData = useMemo(() => getDurationByWeek(activeWorkouts), [activeWorkouts]);

    const formatVolume = (vol: number) => {
        if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
        if (vol >= 1000) return `${(vol / 1000).toFixed(1)}k`;
        return vol.toString();
    };

    const strengthExercises = EXERCISES.filter(e => !e.isCardio);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '96px' }}>
            {/* Header */}
            <header style={{ marginBottom: '8px' }}>
                <h1 style={{
                    fontSize: '36px',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #c084fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '8px',
                }}>
                    Analytics
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>Track your progress over time</p>
            </header>

            {/* Time Period Selector */}
            <div style={{ display: 'flex', gap: '12px' }}>
                {(['week', 'month', 'year'] as TimePeriod[]).map(period => (
                    <button
                        key={period}
                        onClick={() => setTimePeriod(period)}
                        style={{
                            flex: 1,
                            padding: '14px 16px',
                            borderRadius: '16px',
                            fontWeight: 600,
                            fontSize: '14px',
                            transition: 'all 0.2s',
                            border: timePeriod === period ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                            background: timePeriod === period
                                ? 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)'
                                : 'rgba(255, 255, 255, 0.05)',
                            color: timePeriod === period ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                            boxShadow: timePeriod === period ? '0 8px 20px rgba(236, 72, 153, 0.3)' : 'none',
                        }}
                    >
                        {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'This Year'}
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{
                    background: 'rgba(30, 27, 50, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '20px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Activity size={18} style={{ color: '#fb923c' }} />
                        <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Volume</span>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>{formatVolume(totalVolume)} kg</div>
                </div>
                <div style={{
                    background: 'rgba(30, 27, 50, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '20px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <TrendingUp size={18} style={{ color: '#10b981' }} />
                        <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Reps</span>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>{totalReps}</div>
                </div>
                <div style={{
                    background: 'rgba(30, 27, 50, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '20px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Clock size={18} style={{ color: '#60a5fa' }} />
                        <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Duration</span>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>{avgDuration > 0 ? `${avgDuration} min` : '—'}</div>
                </div>
            </div>

            {/* Workout Frequency by Type */}
            <div style={{
                background: 'rgba(30, 27, 50, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '24px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Calendar size={24} style={{ color: '#c084fc' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Workout Frequency</h3>
                </div>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>{periodStats.total} workouts</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(236, 72, 153, 0.1) 100%)',
                        borderRadius: '16px',
                        padding: '16px',
                        textAlign: 'center',
                    }}>
                        <Dumbbell size={24} style={{ color: '#fb923c', margin: '0 auto 8px' }} />
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#fb923c' }}>{periodStats.byType.STRENGTH || 0}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Strength</div>
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
                        borderRadius: '16px',
                        padding: '16px',
                        textAlign: 'center',
                    }}>
                        <Heart size={24} style={{ color: '#f472b6', margin: '0 auto 8px' }} />
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#f472b6' }}>{periodStats.byType.CARDIO || 0}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Cardio</div>
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)',
                        borderRadius: '16px',
                        padding: '16px',
                        textAlign: 'center',
                    }}>
                        <Zap size={24} style={{ color: '#c084fc', margin: '0 auto 8px' }} />
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#c084fc' }}>{periodStats.byType.HIIT || 0}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>HIIT</div>
                    </div>
                </div>
            </div>

            {/* Volume Chart */}
            <div style={{
                background: 'rgba(30, 27, 50, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '24px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <TrendingUp size={24} style={{ color: '#10b981' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Weekly Volume Trend</h3>
                </div>
                <div style={{ height: '200px', width: '100%' }}>
                    {weeklyVolumeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyVolumeData}>
                                <XAxis dataKey="week" stroke="rgba(255, 255, 255, 0.4)" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(30, 27, 50, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value) => [`${formatVolume(Number(value) || 0)} kg`, 'Volume']}
                                />
                                <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                                    {weeklyVolumeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.volume > 0 ? '#10b981' : 'rgba(255, 255, 255, 0.1)'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>
                            No volume data yet
                        </div>
                    )}
                </div>
            </div>

            {/* Duration Trend Chart */}
            <div style={{
                background: 'rgba(30, 27, 50, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '24px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Clock size={24} style={{ color: '#60a5fa' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Weekly Duration Trend</h3>
                </div>
                <div style={{ height: '200px', width: '100%' }}>
                    {weeklyDurationData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyDurationData}>
                                <XAxis dataKey="week" stroke="rgba(255, 255, 255, 0.4)" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(30, 27, 50, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value) => [`${Number(value) || 0} min`, 'Avg Duration']}
                                />
                                <Bar dataKey="avgDuration" radius={[6, 6, 0, 0]}>
                                    {weeklyDurationData.map((entry, index) => (
                                        <Cell key={`duration-${index}`} fill={entry.avgDuration > 0 ? '#60a5fa' : 'rgba(255, 255, 255, 0.1)'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>
                            No duration data yet
                        </div>
                    )}
                </div>
            </div>

            {/* Exercise Progress */}
            <div style={{
                background: 'rgba(30, 27, 50, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '24px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Dumbbell size={24} style={{ color: '#3b82f6' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Exercise Progress</h3>
                </div>

                {/* Exercise Selector */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <select
                        value={selectedExercise}
                        onChange={(e) => setSelectedExercise(e.target.value)}
                        style={{
                            width: '100%',
                            appearance: 'none',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            padding: '14px 40px 14px 16px',
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: 500,
                            outline: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {strengthExercises.map(ex => (
                            <option key={ex.id} value={ex.id} style={{ background: '#1a1625' }}>{ex.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)', pointerEvents: 'none' }} />
                </div>

                <div style={{ height: '180px', width: '100%' }}>
                    {exerciseProgressData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={exerciseProgressData}>
                                <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.4)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(30, 27, 50, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value) => [`${Number(value) || 0} kg`, 'Max Weight']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="maxWeight"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    dot={{ fill: '#ec4899', strokeWidth: 0, r: 5 }}
                                    activeDot={{ r: 7, fill: '#f472b6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                            <div>
                                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '15px' }}>No data for this exercise yet</p>
                                <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '13px', marginTop: '4px' }}>Complete some sets to see your progress!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
