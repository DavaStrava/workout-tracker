import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import type { RecoveryStats, MuscleRecoveryData } from '../utils/recoveryHelpers';
import { formatTimeToRecovery, getRecoveryColor } from '../utils/recoveryHelpers';
import { Activity, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecoveryStatusCardProps {
  stats: RecoveryStats;
  hasWorkoutHistory: boolean;
}

// Progress bar component for individual muscles
const MuscleProgressBar: React.FC<{
  muscle: MuscleRecoveryData;
  targetPercent?: number; // 70 for "ready", 90 for "fresh"
  targetLabel?: string;   // "ready" or "fresh"
}> = ({ muscle, targetPercent = 70, targetLabel = 'ready' }) => {
  const color = getRecoveryColor(muscle.recoveryPercent);
  const isFullyRecovered = muscle.recoveryPercent >= 100;
  const timeRemaining = muscle.hoursSinceTraining !== null && !isFullyRecovered
    ? formatTimeToRecovery(muscle.hoursSinceTraining, targetPercent, muscle.isPrimary)
    : null;

  return (
    <div
      style={{
        background: 'rgba(30, 27, 50, 0.6)',
        borderRadius: '12px',
        padding: '12px 16px',
        borderLeft: `3px solid ${color.fill}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>
          {muscle.muscleGroup}
        </span>
        <span style={{ fontWeight: 700, color: color.fill, fontSize: '14px' }}>
          {Math.round(muscle.recoveryPercent)}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          height: '8px',
          borderRadius: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(muscle.recoveryPercent, 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '100%',
            borderRadius: '4px',
            background: `linear-gradient(90deg, ${color.fill} 0%, ${color.fill}dd 100%)`,
            boxShadow: color.glow !== 'none' ? `0 0 8px ${color.glow}` : undefined,
          }}
        />
      </div>

      {/* Time remaining - only show if not fully recovered */}
      {timeRemaining && (
        <div style={{ marginTop: '6px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
          {timeRemaining} to {targetLabel}
        </div>
      )}
    </div>
  );
};

// Collapsible section component
const CollapsibleSection: React.FC<{
  id: string;
  title: string;
  count: number;
  avgPercent: number;
  icon: React.ReactNode;
  color: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}> = ({ id, title, count, avgPercent, icon, color, defaultExpanded = true, children }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentId = `recovery-section-${id}`;

  return (
    <div style={{ marginBottom: '16px' }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '8px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#fff',
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
          {icon}
          <span
            style={{
              fontSize: '16px',
              fontWeight: 800,
              color,
            }}
          >
            {count}
          </span>
          <span style={{ fontWeight: 600, color, fontSize: '14px' }}>
            {title}
          </span>
          <span
            style={{
              marginLeft: '8px',
              fontSize: '14px',
              fontWeight: 700,
              color,
            }}
          >
            {avgPercent}% recovered
          </span>
          <span style={{ marginLeft: 'auto', color: 'rgba(255, 255, 255, 0.4)' }}>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(avgPercent, 100)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              borderRadius: '3px',
              background: color,
            }}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: '8px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Recovery thresholds
const NEEDS_REST_THRESHOLD = 70;
const FRESH_THRESHOLD = 90;

// Helper to calculate average recovery
const calcAverage = (muscles: MuscleRecoveryData[]): number => {
  if (muscles.length === 0) return 0;
  const total = muscles.reduce((sum, m) => sum + m.recoveryPercent, 0);
  return Math.round(total / muscles.length);
};

export const RecoveryStatusCard: React.FC<RecoveryStatusCardProps> = ({ stats, hasWorkoutHistory }) => {
  // Group muscles by recovery status
  const muscleEntries = useMemo(() =>
    Object.values(stats.muscleData) as MuscleRecoveryData[],
    [stats.muscleData]
  );

  // Sort recovering muscles by recovery % (lowest first)
  const sortedMuscles = useMemo(() => {
    return [...muscleEntries].sort((a, b) => a.recoveryPercent - b.recoveryPercent);
  }, [muscleEntries]);

  // Three-tier grouping (memoized):
  // - Needs Rest: <70% (red/orange cards with progress bars)
  // - OK to Train: 70-89% (yellow cards with progress bars)
  // - Fresh: 90%+ (green cards with progress bars)
  const needsRest = useMemo(() =>
    sortedMuscles.filter(m => m.recoveryPercent < NEEDS_REST_THRESHOLD),
    [sortedMuscles]
  );
  const okToTrain = useMemo(() =>
    sortedMuscles.filter(m => m.recoveryPercent >= NEEDS_REST_THRESHOLD && m.recoveryPercent < FRESH_THRESHOLD),
    [sortedMuscles]
  );
  const fullyRecovered = useMemo(() =>
    sortedMuscles.filter(m => m.recoveryPercent >= FRESH_THRESHOLD),
    [sortedMuscles]
  );

  // Calculate overall recovery percentage (with division by zero guard)
  const overallRecovery = useMemo(() => calcAverage(muscleEntries), [muscleEntries]);

  // Calculate average for each category
  const needsRestAvg = useMemo(() => calcAverage(needsRest), [needsRest]);
  const okToTrainAvg = useMemo(() => calcAverage(okToTrain), [okToTrain]);
  const fullyRecoveredAvg = useMemo(() => calcAverage(fullyRecovered), [fullyRecovered]);

  // Get overall color based on lowest recovery
  const overallColor = getRecoveryColor(overallRecovery);

  // Format last workout time
  const formatLastWorkout = () => {
    if (stats.lastWorkoutDaysAgo === null) return null;
    if (stats.lastWorkoutDaysAgo === 0) {
      const mostRecent = muscleEntries
        .filter(m => m.hoursSinceTraining !== null)
        .sort((a, b) => (a.hoursSinceTraining || 0) - (b.hoursSinceTraining || 0))[0];
      if (mostRecent && mostRecent.hoursSinceTraining !== null && mostRecent.hoursSinceTraining < 24) {
        return `${Math.round(mostRecent.hoursSinceTraining)} hours ago`;
      }
      return 'Today';
    }
    if (stats.lastWorkoutDaysAgo === 1) return 'Yesterday';
    return `${stats.lastWorkoutDaysAgo} days ago`;
  };

  // Empty state - no workout history
  if (!hasWorkoutHistory) {
    return (
      <Card variant="default" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Activity size={24} style={{ color: '#a855f7' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Recovery Status</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px', fontWeight: 500 }}>
            No recovery data yet
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
            Start your first workout to see muscle recovery status
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" style={{ marginBottom: '32px' }}>
      {/* Header with overall recovery */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={24} style={{ color: '#a855f7' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Recovery Status</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: overallColor.fill }}>
              {overallRecovery}%
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
              Overall
            </span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div
          style={{
            width: '100%',
            height: '10px',
            borderRadius: '5px',
            background: 'rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallRecovery}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              height: '100%',
              borderRadius: '5px',
              background: `linear-gradient(90deg, ${overallColor.fill} 0%, ${overallColor.fill}cc 100%)`,
              boxShadow: `0 0 12px ${overallColor.glow}`,
            }}
          />
        </div>
      </div>

      {/* Needs Rest Section (<70%) - Red/Orange cards with progress bars */}
      {needsRest.length > 0 && (
        <CollapsibleSection
          id="needs-rest"
          title="need rest"
          count={needsRest.length}
          avgPercent={needsRestAvg}
          icon={<AlertCircle size={18} style={{ color: '#ef4444' }} />}
          color="#ef4444"
          defaultExpanded={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {needsRest.map(muscle => (
              <MuscleProgressBar key={muscle.muscleGroup} muscle={muscle} />
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* OK to Train Section (70-89%) - Yellow cards with progress bars */}
      {okToTrain.length > 0 && (
        <CollapsibleSection
          id="ok-to-train"
          title="ok to train"
          count={okToTrain.length}
          avgPercent={okToTrainAvg}
          icon={<AlertCircle size={18} style={{ color: '#eab308' }} />}
          color="#eab308"
          defaultExpanded={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {okToTrain.map(muscle => (
              <MuscleProgressBar
                key={muscle.muscleGroup}
                muscle={muscle}
                targetPercent={90}
                targetLabel="fresh"
              />
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Fresh Section (90%+) - Green cards with progress bars */}
      {fullyRecovered.length > 0 && (
        <CollapsibleSection
          id="fresh"
          title="fresh"
          count={fullyRecovered.length}
          avgPercent={fullyRecoveredAvg}
          icon={<CheckCircle2 size={18} style={{ color: '#22c55e' }} />}
          color="#22c55e"
          defaultExpanded={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {fullyRecovered.map(muscle => (
              <MuscleProgressBar key={muscle.muscleGroup} muscle={muscle} />
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Last workout info */}
      {formatLastWorkout() && (
        <div style={{
          marginTop: '8px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.5)',
        }}>
          Last strength workout: {formatLastWorkout()}
        </div>
      )}
    </Card>
  );
};
