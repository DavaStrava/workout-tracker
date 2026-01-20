/**
 * @deprecated This component is deprecated as of 2026-01-16.
 * Replaced by AnatomicalBodySelector with 7-group muscle system.
 * Kept for reference and potential rollback.
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { BodyArea, MuscleGroup } from '../types';
import { useWorkout } from '../hooks/useWorkoutStore';
import { calculateMuscleRecovery, type MuscleRecoveryData } from '../utils/recoveryHelpers';
import { EXERCISES } from '../data/exercises';

// Map BodyArea to a representative MuscleGroup for recovery lookup
const bodyAreaToMuscleGroup: Record<BodyArea, MuscleGroup | null> = {
  'Chest': 'Chest',
  'Shoulders': 'Anterior Deltoid',
  'Arms': 'Biceps',
  'Abdomen': 'Abs',
  'Back': 'Lats',
  'Glutes': 'Glutes',
  'Legs': 'Quads',
  'Cardio': null,
};
import {
  ChestIcon,
  ShouldersIcon,
  BicepsIcon,
  TricepsIcon,
  ForearmsIcon,
  LatsIcon,
  UpperBackIcon,
  TrapsIcon,
  LowerBackIcon,
  QuadsIcon,
  HamstringsIcon,
  GlutesIcon,
  CalvesIcon,
  AbsIcon,
  ObliquesIcon,
} from './MuscleGroupIcons';

interface MuscleRecoveryMapProps {
  onSelect: (bodyArea: BodyArea) => void;
}

// Muscle groups organized by body region for logical scrolling order
// NOTE: Updated to new 7-group system for type compatibility
const muscleGroups: {
  area: BodyArea;
  label: string;
  icon: React.FC<{ size?: number }>;
}[] = [
  // Upper Body - Push
  { area: 'Chest', label: 'Chest', icon: ChestIcon },
  { area: 'Shoulders', label: 'Shoulders', icon: ShouldersIcon },
  { area: 'Arms', label: 'Arms (Triceps)', icon: TricepsIcon },

  // Upper Body - Pull
  { area: 'Back', label: 'Back (Lats)', icon: LatsIcon },
  { area: 'Back', label: 'Back (Upper)', icon: UpperBackIcon },
  { area: 'Back', label: 'Back (Traps)', icon: TrapsIcon },
  { area: 'Arms', label: 'Arms (Biceps)', icon: BicepsIcon },
  { area: 'Arms', label: 'Arms (Forearms)', icon: ForearmsIcon },

  // Core
  { area: 'Abdomen', label: 'Abdomen (Abs)', icon: AbsIcon },
  { area: 'Abdomen', label: 'Abdomen (Obliques)', icon: ObliquesIcon },
  { area: 'Back', label: 'Back (Lower)', icon: LowerBackIcon },

  // Lower Body
  { area: 'Legs', label: 'Legs (Quads)', icon: QuadsIcon },
  { area: 'Legs', label: 'Legs (Hamstrings)', icon: HamstringsIcon },
  { area: 'Glutes', label: 'Glutes', icon: GlutesIcon },
  { area: 'Legs', label: 'Legs (Calves)', icon: CalvesIcon },
];

// Count exercises per body area (excluding cardio)
const getExerciseCount = (bodyArea: BodyArea): number => {
  return EXERCISES.filter((e) => e.bodyArea === bodyArea && !e.isCardio).length;
};

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

      {/* Muscle Group Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}
      >
        {muscleGroups.map((group, index) => {
          const IconComponent = group.icon;
          const exerciseCount = getExerciseCount(group.area);
          // Map BodyArea to representative MuscleGroup for recovery lookup
          const representativeMuscle = bodyAreaToMuscleGroup[group.area];
          const muscleRecovery: MuscleRecoveryData | undefined = representativeMuscle
            ? recoveryStats.muscleData[representativeMuscle]
            : undefined;
          const isFresh = muscleRecovery?.isFresh ?? true;

          return (
            <motion.button
              key={group.area}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => onSelect(group.area)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 8px 16px',
                borderRadius: '20px',
                background: 'rgba(15, 12, 30, 0.9)',
                border: isFresh
                  ? '2px solid rgba(16, 185, 129, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                minHeight: '140px',
                boxShadow: isFresh
                  ? '0 4px 20px rgba(16, 185, 129, 0.15)'
                  : '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              <IconComponent size={72} />
              <span
                style={{
                  marginTop: '4px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '0.3px',
                }}
              >
                {group.label}
              </span>
              <span
                style={{
                  marginTop: '2px',
                  fontSize: '10px',
                  color: isFresh ? 'rgba(16, 185, 129, 0.8)' : 'rgba(255, 255, 255, 0.45)',
                }}
              >
                {isFresh ? '✓ Fresh' : `${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''}`}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
