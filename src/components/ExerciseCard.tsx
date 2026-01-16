import React from 'react';
import { motion } from 'framer-motion';
import type { Equipment, Exercise } from '../types';
import { getExerciseIcon } from './icons';
import { EquipmentBadge, equipmentLabels } from './icons/EquipmentIcons';

// RGB values for equipment-based styling (matching StatCard pattern)
const equipmentColors: Record<Equipment | 'default', string> = {
  barbell: '249, 115, 22',        // orange
  ez_bar: '249, 115, 22',         // orange
  dumbbell: '236, 72, 153',       // pink
  kettlebell: '236, 72, 153',     // pink
  cable: '168, 85, 247',          // purple
  resistance_band: '168, 85, 247', // purple
  machine: '6, 182, 212',         // cyan
  bodyweight: '249, 115, 22',     // orange
  default: '249, 115, 22',        // orange fallback
};

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exerciseId: string) => void;
  index: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onSelect, index }) => {
  const Icon = getExerciseIcon(exercise.id);
  const colorRgb = equipmentColors[exercise.equipment ?? 'default'] ?? equipmentColors.default;
  const borderColor = `rgba(${colorRgb}, 0.3)`;
  const shadowColor = `rgba(${colorRgb}, 0.2)`;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.05, y: -4 }}
      onClick={() => onSelect(exercise.id)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        borderRadius: '16px',
        minHeight: '130px',
        width: '100%',
        textAlign: 'center',
        background: 'rgba(30, 27, 50, 0.8)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${borderColor}`,
        boxShadow: `0 10px 25px ${shadowColor}`,
        cursor: 'pointer',
      }}
      aria-label={`Add ${exercise.name}`}
    >
      {/* Icon */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
        {Icon ? (
          <Icon size={52} />
        ) : (
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #ff6b35, #f7418c)',
            }}
          >
            <span style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>
              {exercise.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Exercise Name */}
      <div style={{ width: '100%', padding: '0 4px' }}>
        <span
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: 'white',
            lineHeight: 1.3,
            letterSpacing: '0.2px',
          }}
        >
          {exercise.name}
        </span>
      </div>

      {/* Equipment Badge */}
      {exercise.equipment && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', opacity: 0.5 }}>
          <EquipmentBadge equipment={exercise.equipment} size={12} />
          <span style={{ fontSize: '10px', color: 'white' }}>
            {equipmentLabels[exercise.equipment]}
          </span>
        </div>
      )}
    </motion.button>
  );
};

export default ExerciseCard;
