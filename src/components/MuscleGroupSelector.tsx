/**
 * @deprecated This component is deprecated as of 2026-01-16.
 * Replaced by AnatomicalBodySelector with 7-group muscle system.
 * Kept for reference and potential rollback.
 */
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
              padding: '12px 8px 16px',
              borderRadius: '20px',
              background: 'rgba(15, 12, 30, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              minHeight: '140px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
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
                color: 'rgba(255, 255, 255, 0.45)',
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
