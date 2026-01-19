import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { useWorkout } from '../hooks/useWorkoutStore';

export const WorkoutTimer: React.FC = () => {
    const { activeWorkout, pauseWorkout, resumeWorkout, isWorkoutPaused } = useWorkout();
    const [displayTime, setDisplayTime] = useState(0);

    useEffect(() => {
        if (!activeWorkout) return;

        const updateTimer = () => {
            const now = Date.now();
            let elapsed = now - activeWorkout.startTime;

            // Subtract total paused time (stored in seconds, convert to ms)
            elapsed -= (activeWorkout.totalPausedTime || 0) * 1000;

            // If currently paused, subtract current pause duration
            if (activeWorkout.pausedAt) {
                elapsed -= (now - activeWorkout.pausedAt);
            }

            setDisplayTime(Math.max(0, Math.floor(elapsed / 1000)));
        };

        updateTimer(); // Initial update
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [activeWorkout]);

    const formatTime = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTogglePause = () => {
        if (isWorkoutPaused) {
            resumeWorkout();
        } else {
            pauseWorkout();
        }
    };

    if (!activeWorkout) return null;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'rgba(30, 27, 50, 0.8)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
            {/* Timer Display */}
            <div style={{
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
                fontSize: '24px',
                fontWeight: 700,
                color: isWorkoutPaused ? '#f59e0b' : '#10b981',
                minWidth: '80px',
            }}>
                {formatTime(displayTime)}
            </div>

            {/* Pause/Resume Button */}
            <button
                onClick={handleTogglePause}
                aria-label={isWorkoutPaused ? 'Resume workout' : 'Pause workout'}
                aria-pressed={isWorkoutPaused}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isWorkoutPaused
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
            >
                {isWorkoutPaused ? <Play size={18} /> : <Pause size={18} />}
            </button>

            {/* Paused indicator */}
            {isWorkoutPaused && (
                <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#f59e0b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                }}>
                    Paused
                </span>
            )}
        </div>
    );
};
