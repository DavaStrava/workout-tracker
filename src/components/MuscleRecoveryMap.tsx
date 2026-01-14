import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { BodyArea } from '../types';
import { useWorkout } from '../hooks/useWorkoutStore';
import { calculateMuscleRecovery } from '../utils/recoveryHelpers';
import { AnatomicalBody } from './AnatomicalBody';

interface MuscleRecoveryMapProps {
  onSelect: (bodyArea: BodyArea) => void;
}

export const MuscleRecoveryMap: React.FC<MuscleRecoveryMapProps> = ({ onSelect }) => {
  const { history } = useWorkout();

  // Calculate recovery stats from workout history
  const recoveryStats = useMemo(
    () => calculateMuscleRecovery(history),
    [history]
  );

  // Format "days ago" text
  const lastWorkoutText = recoveryStats.lastWorkoutDaysAgo === null
    ? 'Never'
    : recoveryStats.lastWorkoutDaysAgo === 0
      ? 'Today'
      : recoveryStats.lastWorkoutDaysAgo === 1
        ? '1 day ago'
        : `${recoveryStats.lastWorkoutDaysAgo} days ago`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        paddingBottom: '20px',
      }}
    >
      {/* Stats Header Card */}
      <div
        style={{
          background: 'rgba(30, 27, 50, 0.8)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Recovery
        </h3>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            gap: '20px',
          }}
        >
          {/* Last Workout Stat */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
              }}
            >
              Last Workout
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {lastWorkoutText}
            </div>
          </div>

          {/* Fresh Muscles Stat */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
              }}
            >
              Fresh Muscles
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: recoveryStats.freshMuscleCount === recoveryStats.totalMuscleGroups
                  ? '#ff4d6d'
                  : '#fff',
              }}
            >
              {recoveryStats.freshMuscleCount}
            </div>
          </div>
        </div>
      </div>

      {/* Body Visualization */}
      <div
        style={{
          background: 'rgba(15, 12, 30, 0.9)',
          borderRadius: '24px',
          padding: '24px 16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <AnatomicalBody
          muscleData={recoveryStats.muscleData}
          onSelectMuscle={onSelect}
        />

        {/* Tap hint */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.4)',
            marginTop: '16px',
          }}
        >
          Tap a muscle group to see exercises
        </p>
      </div>
    </motion.div>
  );
};
