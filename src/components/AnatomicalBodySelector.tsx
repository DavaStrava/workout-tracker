import React, { memo } from 'react';
import type { BodyArea } from '../types';
import type { MuscleRecoveryData } from '../utils/recoveryHelpers';

interface AnatomicalBodySelectorProps {
  onSelect: (bodyArea: BodyArea) => void;
  muscleData?: Record<BodyArea, MuscleRecoveryData>;
}

export const AnatomicalBodySelector: React.FC<AnatomicalBodySelectorProps> = memo(({
  onSelect: _onSelect,
  muscleData,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Anatomical body illustration */}
      <div className="relative flex justify-center">
        <img
          src="/anatomical-muscles-detailed.svg"
          alt="Anatomical muscle map"
          className="w-full max-w-[600px]"
        />
      </div>

      {/* Recovery legend */}
      {muscleData && (
        <div className="text-center text-sm text-white/60">
          Color indicates recovery: Bright = Fresh, Dark = Fatigued
        </div>
      )}
    </div>
  );
});

AnatomicalBodySelector.displayName = 'AnatomicalBodySelector';
