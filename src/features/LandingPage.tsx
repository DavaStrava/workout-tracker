import React, { useState } from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { Play, ArrowLeft, Dumbbell, TrendingUp, Clock, Target } from 'lucide-react';
import { WorkoutTypeSelector } from './WorkoutTypeSelector';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StatCard, Badge } from '../components/Badge';
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
                <Button
                    variant="ghost"
                    onClick={() => setShowTypeSelector(false)}
                    className="mb-6"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                </Button>
                <WorkoutTypeSelector onSelect={handleSelectType} />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100%', paddingBottom: '96px', padding: '32px 16px' }} className="animate-fade-in">
            {/* Header - Spotify-inspired bold typography */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #c084fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1.1,
                    marginBottom: '12px',
                }}>
                    Let's Get<br />Moving
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '18px', fontWeight: 500 }}>
                    Your workout journey starts here
                </p>
            </div>

            {/* Main CTA - Bold gradient button */}
            <Button
                variant="gradient"
                size="xl"
                onClick={() => setShowTypeSelector(true)}
                style={{ width: '100%', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Play size={24} style={{ marginRight: '12px' }} />
                Start New Workout
            </Button>

            {/* Quick Stats - Spotify-inspired floating cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <StatCard
                    label="Workouts"
                    value={totalWorkouts}
                    gradient="orange-pink"
                    icon={<Dumbbell size={20} style={{ color: '#fb923c' }} />}
                />
                <StatCard
                    label="Hours"
                    value={totalHours}
                    gradient="pink-purple"
                    icon={<Clock size={20} style={{ color: '#f472b6' }} />}
                />
                <StatCard
                    label="Total Sets"
                    value={totalSets}
                    gradient="purple-blue"
                    icon={<Target size={20} style={{ color: '#c084fc' }} />}
                />
                <StatCard
                    label="lbs Lifted"
                    value={formatWeight(totalWeight)}
                    gradient="cyan-blue"
                    icon={<TrendingUp size={20} style={{ color: '#06b6d4' }} />}
                />
            </div>

            {/* Routines Section - Organic Spotify-style card */}
            <Card variant="gradient" gradient="orange-pink" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Dumbbell size={28} style={{ color: '#fb923c' }} />
                    <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>Your Routines</h2>
                    <Badge variant="glow" color="orange" size="sm" style={{ marginLeft: 'auto' }}>
                        {routines.length}
                    </Badge>
                </div>

                {routines.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px', fontWeight: 500 }}>
                            No saved routines yet
                        </p>
                        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginBottom: '16px' }}>
                            Create your first routine to get started
                        </p>
                        <Button variant="secondary" size="md">
                            Create Routine
                        </Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {routines.slice(0, 3).map(routine => (
                            <button
                                key={routine.id}
                                onClick={() => startRoutine(routine.id)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                            >
                                <span style={{ fontWeight: 700, color: '#fff' }}>{routine.name}</span>
                                <Play size={20} style={{ color: '#fb923c' }} />
                            </button>
                        ))}
                        {routines.length > 3 && (
                            <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '12px' }}>
                                + {routines.length - 3} more routines
                            </p>
                        )}
                    </div>
                )}
            </Card>

            {/* Recent History - Spotify-style card */}
            <Card
                variant="gradient"
                gradient="pink-purple"
                onClick={() => onNavigate('history')}
                style={{ cursor: 'pointer' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Clock size={28} style={{ color: '#f472b6' }} />
                    <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>Recent Workouts</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {history.slice(0, 4).map((workout) => (
                        <div
                            key={workout.id}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                padding: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.2s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                                        {workout.name}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                        <Badge variant="outline" color="pink" size="sm">
                                            {new Date(workout.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </Badge>
                                        <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                            {workout.endTime ? Math.round((workout.endTime - workout.startTime) / 60000) : 0} min
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {history.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255, 255, 255, 0.6)' }}>
                            No workout history yet
                        </div>
                    )}
                </div>

                {history.length > 0 && (
                    <Button variant="secondary" style={{ width: '100%' }}>
                        View All Workouts
                    </Button>
                )}
            </Card>
        </div>
    );
};
