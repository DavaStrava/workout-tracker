import React, { memo, useState } from 'react';
import type { BodyArea } from '../types';
import type { MuscleRecoveryData } from '../utils/recoveryHelpers';

interface AnatomicalBodySelectorProps {
  onSelect: (bodyArea: BodyArea) => void;
  muscleData?: Record<BodyArea, MuscleRecoveryData>;
}

type ViewMode = 'front' | 'back';

export const AnatomicalBodySelector: React.FC<AnatomicalBodySelectorProps> = memo(({
  onSelect,
  muscleData,
}) => {
  const [view, setView] = useState<ViewMode>('front');

  return (
    <div className="flex flex-col gap-6 px-4">
      {/* View toggle buttons */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setView('front')}
          className={`
            px-6 py-2 rounded-full font-semibold transition-all duration-200
            ${
              view === 'front'
                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/50'
                : 'bg-transparent border-2 border-white/20 text-white/60 hover:text-white'
            }
          `}
        >
          Front
        </button>
        <button
          onClick={() => setView('back')}
          className={`
            px-6 py-2 rounded-full font-semibold transition-all duration-200
            ${
              view === 'back'
                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/50'
                : 'bg-transparent border-2 border-white/20 text-white/60 hover:text-white'
            }
          `}
        >
          Back
        </button>
      </div>

      {/* Anatomical muscular body */}
      <div className="w-full mx-auto" style={{ maxWidth: '672px', transform: 'scale(2)', transformOrigin: 'top center', marginBottom: '672px' }}>
        <img
          src="/anatomical-muscles-clean.svg"
          alt={`${view} view of muscular body`}
          className="w-full h-auto"
          style={{
            clipPath: view === 'front'
              ? 'inset(0 50% 0 0)'
              : 'inset(0 0 0 50%)',
          }}
        />
      </div>
    </div>
  );
});

AnatomicalBodySelector.displayName = 'AnatomicalBodySelector';
