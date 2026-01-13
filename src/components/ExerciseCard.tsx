import React from 'react';
import { motion } from 'framer-motion';
import type { Exercise } from '../types';
import { getExerciseIcon } from './icons';
import { EquipmentBadge, equipmentLabels } from './icons/EquipmentIcons';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exerciseId: string) => void;
  index: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onSelect, index }) => {
  const Icon = getExerciseIcon(exercise.id);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => onSelect(exercise.id)}
      className="flex flex-col items-center justify-between p-3 pb-4 rounded-[20px] min-h-[120px] w-full text-center transition-all duration-200"
      style={{
        background: 'rgba(15, 12, 30, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
      aria-label={`Add ${exercise.name}`}
    >
      {/* Icon */}
      <div className="flex-1 flex items-center justify-center py-2">
        {Icon ? (
          <Icon size={52} />
        ) : (
          <div
            className="w-[52px] h-[52px] rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ff6b35, #f7418c)' }}
          >
            <span className="text-white text-lg font-bold">
              {exercise.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Exercise Name */}
      <div className="w-full px-1">
        <span
          className="block text-[13px] font-semibold text-white leading-tight"
          style={{ letterSpacing: '0.2px' }}
        >
          {exercise.name}
        </span>
      </div>

      {/* Equipment Badge */}
      {exercise.equipment && (
        <div className="flex items-center gap-1 mt-2" style={{ opacity: 0.5 }}>
          <EquipmentBadge equipment={exercise.equipment} size={12} />
          <span className="text-[10px] text-white">
            {equipmentLabels[exercise.equipment]}
          </span>
        </div>
      )}
    </motion.button>
  );
};

export default ExerciseCard;
