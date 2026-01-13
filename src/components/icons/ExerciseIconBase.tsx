import React from 'react';

export interface ExerciseIconProps {
  size?: number;
}

// Shared gradient definitions matching MuscleGroupIcons.tsx pattern
export const ExerciseIconGradientDefs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ff6b35" />
      <stop offset="50%" stopColor="#f7418c" />
      <stop offset="100%" stopColor="#fc5c7d" />
    </linearGradient>
    <linearGradient id={`${id}Dark`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#cc4a20" />
      <stop offset="100%" stopColor="#b8305f" />
    </linearGradient>
    <filter id={`${id}Glow`} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id={`${id}Shadow`} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#f7418c" floodOpacity="0.3" />
    </filter>
  </defs>
);

// Wrapper component for consistent sizing
export const ExerciseIconWrapper: React.FC<{
  size?: number;
  id: string;
  children: React.ReactNode;
}> = ({ size = 48, id, children }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id={id} />
    <g filter={`url(#${id}Shadow)`}>
      {children}
    </g>
  </svg>
);

// Common shapes for exercise icons
export const BarbellShape: React.FC<{ y?: number }> = ({ y = 25 }) => (
  <>
    {/* Bar */}
    <rect x="10" y={y} width="80" height="4" rx="2" fill="url(#barbell)" />
    {/* Left weight */}
    <rect x="5" y={y - 6} width="12" height="16" rx="2" fill="url(#barbellDark)" />
    {/* Right weight */}
    <rect x="83" y={y - 6} width="12" height="16" rx="2" fill="url(#barbellDark)" />
  </>
);

export const DumbbellShape: React.FC<{ x?: number; y?: number; rotation?: number }> = ({
  x = 50,
  y = 50,
  rotation = 0
}) => (
  <g transform={`rotate(${rotation} ${x} ${y})`}>
    {/* Handle */}
    <rect x={x - 15} y={y - 2} width="30" height="4" rx="1" fill="url(#dumbbell)" />
    {/* Left weight */}
    <rect x={x - 20} y={y - 5} width="8" height="10" rx="1" fill="url(#dumbbellDark)" />
    {/* Right weight */}
    <rect x={x + 12} y={y - 5} width="8" height="10" rx="1" fill="url(#dumbbellDark)" />
  </g>
);

// Simplified human figure for exercise poses
export const StickFigure: React.FC<{
  headX?: number;
  headY?: number;
  bodyEndY?: number;
  armAngle?: number;
  legAngle?: number;
}> = ({
  headX = 50,
  headY = 20,
  bodyEndY = 55,
  armAngle = 45,
  legAngle = 30
}) => {
  const shoulderY = headY + 15;

  return (
    <>
      {/* Head */}
      <circle cx={headX} cy={headY} r="6" fill="url(#figure)" />
      {/* Body */}
      <line
        x1={headX} y1={headY + 6}
        x2={headX} y2={bodyEndY}
        stroke="url(#figure)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Arms */}
      <line
        x1={headX} y1={shoulderY}
        x2={headX - 20 * Math.cos(armAngle * Math.PI / 180)}
        y2={shoulderY + 20 * Math.sin(armAngle * Math.PI / 180)}
        stroke="url(#figure)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1={headX} y1={shoulderY}
        x2={headX + 20 * Math.cos(armAngle * Math.PI / 180)}
        y2={shoulderY + 20 * Math.sin(armAngle * Math.PI / 180)}
        stroke="url(#figure)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Legs */}
      <line
        x1={headX} y1={bodyEndY}
        x2={headX - 15 * Math.sin(legAngle * Math.PI / 180)}
        y2={bodyEndY + 20}
        stroke="url(#figure)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1={headX} y1={bodyEndY}
        x2={headX + 15 * Math.sin(legAngle * Math.PI / 180)}
        y2={bodyEndY + 20}
        stroke="url(#figure)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </>
  );
};
