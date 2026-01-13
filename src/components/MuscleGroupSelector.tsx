import React from 'react';
import { motion } from 'framer-motion';
import type { BodyArea } from '../types';
import { EXERCISES } from '../data/exercises';
import {
  ChestIcon,
  BackIcon,
  LegsIcon,
  ShouldersIcon,
  ArmsIcon,
  CoreIcon,
} from './MuscleGroupIcons';

interface MuscleGroupSelectorProps {
  onSelect: (bodyArea: BodyArea) => void;
}

const muscleGroups: {
  area: BodyArea;
  label: string;
  icon: React.FC<{ size?: number }>;
}[] = [
  { area: 'Chest', label: 'Chest', icon: ChestIcon },
  { area: 'Back', label: 'Back', icon: BackIcon },
  { area: 'Legs', label: 'Legs', icon: LegsIcon },
  { area: 'Shoulders', label: 'Shoulders', icon: ShouldersIcon },
  { area: 'Arms', label: 'Arms', icon: ArmsIcon },
  { area: 'Core', label: 'Core', icon: CoreIcon },
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
            transition={{ delay: index * 0.05, duration: 0.2 }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={() => onSelect(group.area)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 16px',
              borderRadius: '24px',
              background: 'rgba(30, 27, 50, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              minHeight: '160px',
            }}
          >
            <IconComponent size={64} />
            <span
              style={{
                marginTop: '12px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#fff',
              }}
            >
              {group.label}
            </span>
            <span
              style={{
                marginTop: '4px',
                fontSize: '12px',
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
