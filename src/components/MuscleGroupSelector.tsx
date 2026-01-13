import React from 'react';
import { motion } from 'framer-motion';
import type { BodyArea } from '../types';
import { EXERCISES } from '../data/exercises';
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

interface MuscleGroupSelectorProps {
  onSelect: (bodyArea: BodyArea) => void;
}

// Muscle groups organized by body region for logical scrolling order
const muscleGroups: {
  area: BodyArea;
  label: string;
  icon: React.FC<{ size?: number }>;
}[] = [
  // Upper Body - Push
  { area: 'Chest', label: 'Chest', icon: ChestIcon },
  { area: 'Shoulders', label: 'Shoulders', icon: ShouldersIcon },
  { area: 'Triceps', label: 'Triceps', icon: TricepsIcon },

  // Upper Body - Pull
  { area: 'Lats', label: 'Lats', icon: LatsIcon },
  { area: 'Upper Back', label: 'Upper Back', icon: UpperBackIcon },
  { area: 'Traps', label: 'Traps', icon: TrapsIcon },
  { area: 'Biceps', label: 'Biceps', icon: BicepsIcon },
  { area: 'Forearms', label: 'Forearms', icon: ForearmsIcon },

  // Core
  { area: 'Abs', label: 'Abs', icon: AbsIcon },
  { area: 'Obliques', label: 'Obliques', icon: ObliquesIcon },
  { area: 'Lower Back', label: 'Lower Back', icon: LowerBackIcon },

  // Lower Body
  { area: 'Quads', label: 'Quads', icon: QuadsIcon },
  { area: 'Hamstrings', label: 'Hamstrings', icon: HamstringsIcon },
  { area: 'Glutes', label: 'Glutes', icon: GlutesIcon },
  { area: 'Calves', label: 'Calves', icon: CalvesIcon },
];

// Count exercises per body area (excluding cardio)
const getExerciseCount = (bodyArea: BodyArea): number => {
  return EXERCISES.filter((e) => e.bodyArea === bodyArea && !e.isCardio).length;
};

export const MuscleGroupSelector: React.FC<MuscleGroupSelectorProps> = ({
  onSelect,
}) => {
  return (
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
              padding: '16px 12px',
              borderRadius: '24px',
              background: 'rgba(30, 27, 50, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              minHeight: '160px',
            }}
          >
            <IconComponent size={80} />
            <span
              style={{
                marginTop: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#fff',
              }}
            >
              {group.label}
            </span>
            <span
              style={{
                marginTop: '2px',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
