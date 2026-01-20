import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, X } from 'lucide-react';
import { useWorkout } from '../hooks/useWorkoutStore';

const RESUME_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export function ResumeToast() {
    const { justFinishedWorkoutId, lastFinishedWorkout, canResumeLastWorkout, resumeFinishedWorkout, clearJustFinished } = useWorkout();
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [isResuming, setIsResuming] = useState(false);

    // Calculate time remaining and update countdown
    useEffect(() => {
        if (!justFinishedWorkoutId || !lastFinishedWorkout?.endTime) {
            setTimeRemaining(0);
            return;
        }

        const updateTimer = () => {
            const elapsed = Date.now() - lastFinishedWorkout.endTime!;
            const remaining = Math.max(0, RESUME_WINDOW_MS - elapsed);
            setTimeRemaining(remaining);

            // Auto-dismiss when time expires
            if (remaining <= 0) {
                clearJustFinished();
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [justFinishedWorkoutId, lastFinishedWorkout?.endTime, clearJustFinished]);

    const handleResume = async () => {
        setIsResuming(true);
        await resumeFinishedWorkout();
        setIsResuming(false);
        // Note: clearJustFinished is called inside resumeFinishedWorkout on success
    };

    const handleDismiss = () => {
        clearJustFinished();
    };

    // Format remaining time
    const formatTime = (ms: number) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const shouldShow = justFinishedWorkoutId && canResumeLastWorkout && timeRemaining > 0;

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 100,
                        width: 'calc(100% - 32px)',
                        maxWidth: '400px',
                    }}
                >
                    <div
                        style={{
                            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.95) 0%, rgba(234, 88, 12, 0.95) 100%)',
                            borderRadius: '16px',
                            padding: '16px 20px',
                            boxShadow: '0 8px 32px rgba(249, 115, 22, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    color: '#fff',
                                    marginBottom: '4px',
                                }}>
                                    Workout finished
                                </div>
                                <div style={{
                                    fontSize: '13px',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                }}>
                                    Resume within {formatTime(timeRemaining)}
                                </div>
                            </div>

                            <button
                                onClick={handleResume}
                                disabled={isResuming}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '10px 16px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    color: '#fff',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: isResuming ? 'wait' : 'pointer',
                                    transition: 'all 0.2s',
                                    opacity: isResuming ? 0.7 : 1,
                                }}
                            >
                                <Undo2 size={16} />
                                {isResuming ? 'Resuming...' : 'Undo'}
                            </button>

                            <button
                                onClick={handleDismiss}
                                aria-label="Dismiss"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div
                            style={{
                                marginTop: '12px',
                                height: '3px',
                                borderRadius: '2px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                overflow: 'hidden',
                            }}
                        >
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{ width: `${(timeRemaining / RESUME_WINDOW_MS) * 100}%` }}
                                transition={{ duration: 1, ease: 'linear' }}
                                style={{
                                    height: '100%',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '2px',
                                }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
