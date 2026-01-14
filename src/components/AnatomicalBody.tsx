import React from 'react';
import { motion } from 'framer-motion';
import type { BodyArea } from '../types';
import type { MuscleRecoveryData } from '../utils/recoveryHelpers';
import { getRecoveryColor } from '../utils/recoveryHelpers';

interface AnatomicalBodyProps {
  muscleData: Record<BodyArea, MuscleRecoveryData>;
  onSelectMuscle: (bodyArea: BodyArea) => void;
  showBadges?: boolean;
}

// Badge positions (relative to viewBox 0 0 200 400)
const BADGE_POSITIONS: Partial<Record<BodyArea, { x: number; y: number }>> = {
  'Chest': { x: 100, y: 105 },
  'Shoulders': { x: 52, y: 82 },
  'Biceps': { x: 38, y: 135 },
};

interface MuscleRegionProps {
  bodyArea: BodyArea;
  paths: string[];
  recovery: MuscleRecoveryData;
  onSelect: () => void;
}

const MuscleRegion: React.FC<MuscleRegionProps> = ({ bodyArea, paths, recovery, onSelect }) => {
  const colors = getRecoveryColor(recovery.recoveryPercent);

  return (
    <motion.g
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`${bodyArea}, ${recovery.recoveryPercent}% recovered`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={colors.fill}
          style={{
            filter: recovery.isFresh ? `drop-shadow(0 0 6px ${colors.glow})` : 'none',
            transition: 'fill 0.3s ease',
          }}
        />
      ))}
    </motion.g>
  );
};

export const AnatomicalBody: React.FC<AnatomicalBodyProps> = ({
  muscleData,
  onSelectMuscle,
  showBadges = true,
}) => {
  // Define muscle region paths (front view anatomical body)
  const muscleRegions: Record<BodyArea, string[]> = {
    // Traps - upper back/neck area
    'Traps': [
      'M85 62 Q100 55 115 62 L112 72 Q100 68 88 72 Z',
    ],
    // Shoulders - deltoids
    'Shoulders': [
      // Left deltoid
      'M58 72 Q45 70 40 82 Q38 95 45 105 Q52 108 60 100 Q65 90 62 78 Z',
      // Right deltoid
      'M142 72 Q155 70 160 82 Q162 95 155 105 Q148 108 140 100 Q135 90 138 78 Z',
    ],
    // Chest - pectorals
    'Chest': [
      // Left pec
      'M62 88 Q65 82 85 80 L98 82 L98 115 Q90 122 75 118 Q62 112 60 100 Z',
      // Right pec
      'M138 88 Q135 82 115 80 L102 82 L102 115 Q110 122 125 118 Q138 112 140 100 Z',
    ],
    // Biceps
    'Biceps': [
      // Left bicep
      'M45 108 Q40 115 38 135 Q38 150 42 160 Q50 162 55 155 Q58 140 56 120 Q55 110 50 105 Z',
      // Right bicep
      'M155 108 Q160 115 162 135 Q162 150 158 160 Q150 162 145 155 Q142 140 144 120 Q145 110 150 105 Z',
    ],
    // Triceps (visible from front as outer arm)
    'Triceps': [
      // Left tricep
      'M38 135 Q32 145 30 160 Q30 172 35 180 Q42 178 45 165 Q46 150 42 138 Z',
      // Right tricep
      'M162 135 Q168 145 170 160 Q170 172 165 180 Q158 178 155 165 Q154 150 158 138 Z',
    ],
    // Forearms
    'Forearms': [
      // Left forearm
      'M35 182 Q30 195 28 215 Q28 235 32 250 Q40 252 45 245 Q50 225 48 200 Q46 185 42 180 Z',
      // Right forearm
      'M165 182 Q170 195 172 215 Q172 235 168 250 Q160 252 155 245 Q150 225 152 200 Q154 185 158 180 Z',
    ],
    // Lats - side torso
    'Lats': [
      // Left lat
      'M58 105 Q52 115 50 135 Q52 155 58 165 Q62 160 65 145 Q66 125 64 110 Z',
      // Right lat
      'M142 105 Q148 115 150 135 Q148 155 142 165 Q138 160 135 145 Q134 125 136 110 Z',
    ],
    // Upper Back (shown behind traps area)
    'Upper Back': [
      'M75 70 Q100 65 125 70 L122 82 Q100 78 78 82 Z',
    ],
    // Abs - rectus abdominis
    'Abs': [
      // 6-pack segments
      'M88 118 L112 118 L112 138 L88 138 Z',
      'M88 142 L112 142 L112 162 L88 162 Z',
      'M88 166 L112 166 L112 186 L88 186 Z',
    ],
    // Obliques
    'Obliques': [
      // Left oblique
      'M65 125 Q62 145 64 170 Q68 185 75 190 Q82 185 85 170 Q86 145 84 125 Z',
      // Right oblique
      'M135 125 Q138 145 136 170 Q132 185 125 190 Q118 185 115 170 Q114 145 116 125 Z',
    ],
    // Lower Back
    'Lower Back': [
      'M85 175 Q100 172 115 175 L115 195 Q100 200 85 195 Z',
    ],
    // Quads - front thighs
    'Quads': [
      // Left quad
      'M72 200 Q65 210 62 240 Q60 275 65 310 Q75 318 88 310 Q95 280 95 240 Q92 210 88 200 Z',
      // Right quad
      'M128 200 Q135 210 138 240 Q140 275 135 310 Q125 318 112 310 Q105 280 105 240 Q108 210 112 200 Z',
    ],
    // Hamstrings (shown as inner/back thigh from front view)
    'Hamstrings': [
      // Left hamstring (inner thigh visible)
      'M88 205 Q95 220 98 250 Q98 285 95 310 Q90 315 85 310 Q82 280 85 245 Q86 220 88 205 Z',
      // Right hamstring
      'M112 205 Q105 220 102 250 Q102 285 105 310 Q110 315 115 310 Q118 280 115 245 Q114 220 112 205 Z',
    ],
    // Glutes
    'Glutes': [
      // Left glute
      'M72 190 Q65 195 62 205 Q68 215 78 212 Q85 205 85 195 Q82 190 72 190 Z',
      // Right glute
      'M128 190 Q135 195 138 205 Q132 215 122 212 Q115 205 115 195 Q118 190 128 190 Z',
    ],
    // Calves
    'Calves': [
      // Left calf
      'M65 315 Q60 330 58 355 Q60 380 68 395 Q78 398 85 390 Q88 370 85 345 Q82 325 78 315 Z',
      // Right calf
      'M135 315 Q140 330 142 355 Q140 380 132 395 Q122 398 115 390 Q112 370 115 345 Q118 325 122 315 Z',
    ],
    // Cardio is not rendered
    'Cardio': [],
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '280px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 200 420"
        width="100%"
        height="auto"
        style={{ display: 'block' }}
        aria-label="Muscle recovery body map"
      >
        <defs>
          {/* Gradient for fresh muscles */}
          <linearGradient id="freshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b35" />
            <stop offset="100%" stopColor="#f7418c" />
          </linearGradient>
          {/* Body silhouette gradient */}
          <linearGradient id="bodyBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2d2640" />
            <stop offset="100%" stopColor="#1a1625" />
          </linearGradient>
        </defs>

        {/* Body silhouette/outline */}
        <g opacity="0.6">
          {/* Head */}
          <ellipse cx="100" cy="35" rx="22" ry="28" fill="#2d2640" />
          {/* Neck */}
          <rect x="90" y="58" width="20" height="15" fill="#2d2640" />
          {/* Torso */}
          <path
            d="M60 72 Q40 75 35 95 Q30 120 32 160 Q35 190 40 200 L50 200 Q55 195 60 200
               L75 200 Q85 198 100 200 Q115 198 125 200 L140 200 Q145 195 150 200 L160 200
               Q165 190 168 160 Q170 120 165 95 Q160 75 140 72 Z"
            fill="#2d2640"
          />
          {/* Arms */}
          <path d="M35 95 Q25 130 25 170 Q25 210 30 250" stroke="#2d2640" strokeWidth="20" strokeLinecap="round" fill="none" />
          <path d="M165 95 Q175 130 175 170 Q175 210 170 250" stroke="#2d2640" strokeWidth="20" strokeLinecap="round" fill="none" />
          {/* Hands */}
          <ellipse cx="30" cy="265" rx="12" ry="18" fill="#2d2640" />
          <ellipse cx="170" cy="265" rx="12" ry="18" fill="#2d2640" />
          {/* Legs */}
          <path d="M75 200 Q65 250 60 310 Q58 360 65 400" stroke="#2d2640" strokeWidth="30" strokeLinecap="round" fill="none" />
          <path d="M125 200 Q135 250 140 310 Q142 360 135 400" stroke="#2d2640" strokeWidth="30" strokeLinecap="round" fill="none" />
          {/* Feet */}
          <ellipse cx="65" cy="410" rx="18" ry="8" fill="#2d2640" />
          <ellipse cx="135" cy="410" rx="18" ry="8" fill="#2d2640" />
        </g>

        {/* Muscle regions - render each group */}
        {(Object.entries(muscleRegions) as [BodyArea, string[]][]).map(([bodyArea, paths]) => {
          if (bodyArea === 'Cardio' || paths.length === 0) return null;
          const recovery = muscleData[bodyArea];
          if (!recovery) return null;

          return (
            <MuscleRegion
              key={bodyArea}
              bodyArea={bodyArea}
              paths={paths}
              recovery={recovery}
              onSelect={() => onSelectMuscle(bodyArea)}
            />
          );
        })}
      </svg>

      {/* Recovery badges */}
      {showBadges && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {(Object.entries(BADGE_POSITIONS) as [BodyArea, { x: number; y: number }][]).map(([bodyArea, pos]) => {
            const recovery = muscleData[bodyArea];
            if (!recovery) return null;

            // Convert viewBox coordinates to percentage positions
            const leftPercent = (pos.x / 200) * 100;
            const topPercent = (pos.y / 420) * 100;

            return (
              <div
                key={bodyArea}
                style={{
                  position: 'absolute',
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  transform: 'translate(-50%, -50%)',
                  background: recovery.isFresh
                    ? 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)'
                    : 'rgba(45, 38, 64, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff',
                  boxShadow: recovery.isFresh
                    ? '0 2px 8px rgba(249, 115, 22, 0.4)'
                    : '0 2px 4px rgba(0, 0, 0, 0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                {recovery.recoveryPercent}%
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
