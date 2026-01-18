import React, { memo, useState } from 'react';
import type { BodyArea } from '../types';
import type { MuscleRecoveryData } from '../utils/recoveryHelpers';

interface AnatomicalBodySelectorProps {
  onSelect: (bodyArea: BodyArea) => void;
  muscleData?: Record<BodyArea, MuscleRecoveryData>;
}

type ViewMode = 'front' | 'back';

// Leader line definition type - using SVG coordinates (0-2700 x, 0-2000 y)
interface LeaderLineConfig {
  muscle: BodyArea;
  label: string;
  targetX: number;
  targetY: number;
  labelX: number;
  labelY: number;
  labelSide: 'left' | 'right';
}

// Front view leader lines (left half: x 0-1350)
// Body center ~675. RIGHT side targets for Shoulders/Arms/Legs
const FRONT_LEADER_LINES: LeaderLineConfig[] = [
  { muscle: 'Shoulders', label: 'Shoulders', targetX: 900, targetY: 510, labelX: 1300, labelY: 250, labelSide: 'right' },   // RIGHT shoulder
  { muscle: 'Chest', label: 'Chest', targetX: 700, targetY: 530, labelX: 50, labelY: 400, labelSide: 'left' },              // RIGHT pec - more down
  { muscle: 'Arms', label: 'Arms', targetX: 950, targetY: 720, labelX: 1300, labelY: 520, labelSide: 'right' },             // RIGHT arm - more down
  { muscle: 'Abdomen', label: 'Abdomen', targetX: 675, targetY: 820, labelX: 50, labelY: 720, labelSide: 'left' },          // CENTER abs
  { muscle: 'Legs', label: 'Legs', targetX: 780, targetY: 1220, labelX: 1300, labelY: 1000, labelSide: 'right' },           // RIGHT thigh - right & down
];

// Back view leader lines (right half: x 1350-2700)
// Body center ~2025. LEFT side targets for Shoulders/Arms/Legs
const BACK_LEADER_LINES: LeaderLineConfig[] = [
  { muscle: 'Shoulders', label: 'Shoulders', targetX: 1760, targetY: 480, labelX: 1400, labelY: 250, labelSide: 'left' },   // LEFT shoulder
  { muscle: 'Back', label: 'Back', targetX: 2025, targetY: 600, labelX: 2650, labelY: 400, labelSide: 'right' },            // CENTER back - down
  { muscle: 'Arms', label: 'Arms', targetX: 1720, targetY: 720, labelX: 1400, labelY: 520, labelSide: 'left' },             // LEFT arm - down
  { muscle: 'Glutes', label: 'Glutes', targetX: 2025, targetY: 960, labelX: 2650, labelY: 750, labelSide: 'right' },        // CENTER glutes - down
  { muscle: 'Legs', label: 'Legs', targetX: 1880, targetY: 1250, labelX: 1400, labelY: 1000, labelSide: 'left' },           // LEFT thigh - down
];

// Leader line component
interface LeaderLineProps {
  config: LeaderLineConfig;
  onSelect: (bodyArea: BodyArea) => void;
}

const LeaderLine: React.FC<LeaderLineProps> = ({ config, onSelect }) => {
  const { muscle, label, targetX, targetY, labelX, labelY, labelSide } = config;

  // Calculate elbow point (where horizontal line meets diagonal)
  const CHAR_WIDTH_PX = 28;
  const textWidth = label.length * CHAR_WIDTH_PX;
  const elbowX = labelSide === 'left'
    ? labelX + textWidth + 30
    : labelX - textWidth - 30;

  const handleSelect = () => onSelect(muscle);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(muscle);
    }
  };

  return (
    <g
      className="cursor-pointer leader-line"
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Select ${label} exercises`}
      style={{ pointerEvents: 'all', outline: 'none' }}
    >
      {/* Clickable hit area */}
      <rect
        x={Math.min(labelX, targetX) - 30}
        y={Math.min(labelY, targetY) - 50}
        width={Math.abs(targetX - labelX) + 80}
        height={Math.abs(targetY - labelY) + 100}
        fill="transparent"
      />

      {/* Horizontal line under label */}
      <line
        x1={labelX}
        y1={labelY}
        x2={elbowX}
        y2={labelY}
        stroke="rgba(255, 255, 255, 0.85)"
        strokeWidth="4"
        className="leader-line-stroke"
      />

      {/* Diagonal line to muscle target */}
      <line
        x1={elbowX}
        y1={labelY}
        x2={targetX}
        y2={targetY}
        stroke="rgba(255, 255, 255, 0.85)"
        strokeWidth="4"
        className="leader-line-stroke"
      />

      {/* Circle at muscle target */}
      <circle
        cx={targetX}
        cy={targetY}
        r="14"
        fill="rgba(255, 255, 255, 0.9)"
        className="leader-line-circle"
      />

      {/* Label text */}
      <text
        x={labelX}
        y={labelY - 15}
        fill="white"
        fontSize="48"
        fontWeight="600"
        textAnchor={labelSide === 'left' ? 'start' : 'end'}
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        className="leader-line-text"
      >
        {label}
      </text>
    </g>
  );
};

export const AnatomicalBodySelector: React.FC<AnatomicalBodySelectorProps> = memo(({
  onSelect,
  muscleData: _muscleData,
}) => {
  const [view, setView] = useState<ViewMode>('front');

  const leaderLines = view === 'front' ? FRONT_LEADER_LINES : BACK_LEADER_LINES;

  // ViewBox for front shows left half (0-1350), back shows right half (1350-2700)
  const viewBox = view === 'front'
    ? '0 0 1350 2000'
    : '1350 0 1350 2000';

  return (
    <div className="flex flex-col gap-6 px-4">
      {/* View toggle buttons */}
      <div className="flex gap-4 justify-center" role="group" aria-label="Body view selection">
        <button
          onClick={() => setView('front')}
          aria-pressed={view === 'front'}
          aria-label="Show front view of body"
          className="font-bold transition-all duration-200 text-white"
          style={{
            height: '64px',
            padding: '0 48px',
            fontSize: '20px',
            borderRadius: '16px',
            ...(view === 'front'
              ? {
                  background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #a855f7 100%)',
                  boxShadow: '0 10px 25px rgba(236, 72, 153, 0.4)',
                }
              : {
                  background: 'rgba(30, 27, 50, 0.8)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.6)',
                }),
          }}
        >
          Front
        </button>
        <button
          onClick={() => setView('back')}
          aria-pressed={view === 'back'}
          aria-label="Show back view of body"
          className="font-bold transition-all duration-200 text-white"
          style={{
            height: '64px',
            padding: '0 48px',
            fontSize: '20px',
            borderRadius: '16px',
            ...(view === 'back'
              ? {
                  background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #a855f7 100%)',
                  boxShadow: '0 10px 25px rgba(236, 72, 153, 0.4)',
                }
              : {
                  background: 'rgba(30, 27, 50, 0.8)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.6)',
                }),
          }}
        >
          Back
        </button>
      </div>

      {/* Single inline SVG with both body image and leader lines */}
      <div
        className="w-full mx-auto"
        style={{ maxWidth: '672px' }}
      >
        <svg
          viewBox={viewBox}
          className="w-full h-auto"
          style={{ display: 'block' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Embed the anatomical body SVG as an image */}
          <image
            href="/anatomical-muscles-clean.svg"
            x="0"
            y="0"
            width="2700"
            height="2000"
            preserveAspectRatio="xMidYMid meet"
          />

          {/* Leader lines rendered in the same coordinate space */}
          {leaderLines.map((line) => (
            <LeaderLine
              key={line.muscle}
              config={line}
              onSelect={onSelect}
            />
          ))}
        </svg>
      </div>
    </div>
  );
});

AnatomicalBodySelector.displayName = 'AnatomicalBodySelector';
