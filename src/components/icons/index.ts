// Exercise Icons - Barrel Export
export * from './ExerciseIconBase';
export * from './EquipmentIcons';
export * from './ChestExerciseIcons';
export * from './BackExerciseIcons';
export * from './ShoulderExerciseIcons';
export * from './ArmExerciseIcons';
export * from './LegExerciseIcons';
export * from './CoreExerciseIcons';

import type { ExerciseIconProps } from './ExerciseIconBase';
import { chestExerciseIcons } from './ChestExerciseIcons';
import { backExerciseIcons } from './BackExerciseIcons';
import { shoulderExerciseIcons } from './ShoulderExerciseIcons';
import { armExerciseIcons } from './ArmExerciseIcons';
import { legExerciseIcons } from './LegExerciseIcons';
import { coreExerciseIcons } from './CoreExerciseIcons';
import React from 'react';

// Combined mapping of all exercise icons
export const exerciseIcons: Record<string, React.FC<ExerciseIconProps>> = {
  ...chestExerciseIcons,
  ...backExerciseIcons,
  ...shoulderExerciseIcons,
  ...armExerciseIcons,
  ...legExerciseIcons,
  ...coreExerciseIcons,
};

// Track warned icons to avoid spamming console
const warnedIcons = new Set<string>();

// Helper function to get icon for an exercise
export const getExerciseIcon = (exerciseId: string): React.FC<ExerciseIconProps> | null => {
  const icon = exerciseIcons[exerciseId];

  // Warn in development when icon is missing (only once per exerciseId)
  if (!icon && import.meta.env.DEV && !warnedIcons.has(exerciseId)) {
    warnedIcons.add(exerciseId);
    console.warn(`[ExerciseIcons] Missing icon for exercise: "${exerciseId}"`);
  }

  return icon || null;
};
