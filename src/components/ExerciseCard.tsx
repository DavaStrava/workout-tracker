import { motion } from 'framer-motion';
import type { FC } from 'react';
import type { Exercise } from '../types';
import { EquipmentBadge, equipmentLabels } from './icons/EquipmentIcons';

// Rotating gradient backgrounds (from WorkoutTypeSelector)
const CARD_GRADIENTS = [
  { gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #ec4899 100%)', shadow: 'rgba(249, 115, 22, 0.25)' },  // Orange-pink
  { gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #a855f7 100%)', shadow: 'rgba(236, 72, 153, 0.25)' },  // Pink-purple
  { gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #f97316 100%)', shadow: 'rgba(168, 85, 247, 0.25)' },  // Purple-orange
];

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exerciseId: string) => void;
  index: number;
}

export const ExerciseCard: FC<ExerciseCardProps> = ({ exercise, onSelect, index }) => {
  const gradientIndex = index % 3;
  const { gradient, shadow } = CARD_GRADIENTS[gradientIndex];

  // Build the targets string: primary + secondary muscles
  const targets = [exercise.bodyArea];
  if (exercise.secondaryAreas && exercise.secondaryAreas.length > 0) {
    targets.push(...exercise.secondaryAreas);
  }
  const targetsText = targets.join(' · ');

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.05, y: -4 }}
      onClick={() => onSelect(exercise.id)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        borderRadius: '20px',
        minHeight: '160px',
        width: '100%',
        textAlign: 'center',
        background: gradient,
        border: 'none',
        boxShadow: `0 10px 25px ${shadow}`,
        cursor: 'pointer',
        gap: '12px',
      }}
      aria-label={`Add ${exercise.name}`}
    >
      {/* Exercise Name */}
      <div style={{ width: '100%', padding: '0 4px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <span
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '22px',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.2,
            letterSpacing: '0.2px',
          }}
        >
          {exercise.name}
        </span>
      </div>

      {/* Equipment Badge */}
      {exercise.equipment && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '4px 10px',
            borderRadius: '12px',
          }}
        >
          <EquipmentBadge equipment={exercise.equipment} size={14} />
          <span style={{ fontSize: '11px', color: 'white', fontWeight: 500 }}>
            {equipmentLabels[exercise.equipment]}
          </span>
        </div>
      )}

      {/* Muscle Targets */}
      <div style={{ width: '100%' }}>
        <span
          style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.65)',
            fontWeight: 500,
          }}
        >
          Targets: {targetsText}
        </span>
      </div>
    </motion.button>
  );
};

export default ExerciseCard;
