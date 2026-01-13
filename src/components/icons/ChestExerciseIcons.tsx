import React from 'react';
import { ExerciseIconGradientDefs, type ExerciseIconProps } from './ExerciseIconBase';

// Bench Press - person lying on bench pressing barbell up
export const BenchPressIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="benchPress" />
    <g filter="url(#benchPressShadow)">
      {/* Bench */}
      <rect x="20" y="58" width="60" height="5" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="25" y="63" width="6" height="18" rx="2" fill="rgba(255,255,255,0.2)" />
      <rect x="69" y="63" width="6" height="18" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Person lying down */}
      <ellipse cx="50" cy="52" rx="18" ry="6" fill="url(#benchPress)" />
      <circle cx="70" cy="52" r="5" fill="url(#benchPress)" />
      {/* Arms up */}
      <line x1="38" y1="50" x2="38" y2="28" stroke="url(#benchPress)" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="50" x2="62" y2="28" stroke="url(#benchPress)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell */}
      <rect x="15" y="24" width="70" height="4" rx="2" fill="url(#benchPress)" />
      <rect x="8" y="20" width="12" height="12" rx="2" fill="url(#benchPressDark)" />
      <rect x="80" y="20" width="12" height="12" rx="2" fill="url(#benchPressDark)" />
    </g>
  </svg>
);

// Push Up - person in plank position pushing up
export const PushUpIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="pushUp" />
    <g filter="url(#pushUpShadow)">
      {/* Ground line */}
      <line x1="5" y1="78" x2="95" y2="78" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      {/* Head */}
      <circle cx="20" cy="42" r="6" fill="url(#pushUp)" />
      {/* Body (angled plank) */}
      <line x1="24" y1="46" x2="75" y2="58" stroke="url(#pushUp)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms (supporting) */}
      <line x1="30" y1="50" x2="30" y2="78" stroke="url(#pushUp)" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="78" x2="35" y2="78" stroke="url(#pushUp)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="75" y1="58" x2="88" y2="68" stroke="url(#pushUp)" strokeWidth="3" strokeLinecap="round" />
      <line x1="88" y1="68" x2="88" y2="78" stroke="url(#pushUp)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Incline Dumbbell Press - person on inclined bench with dumbbells
export const InclineDumbbellPressIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="inclineDB" />
    <g filter="url(#inclineDBShadow)">
      {/* Incline bench */}
      <path d="M25 75 L45 45 L55 45 L55 75 Z" fill="rgba(255,255,255,0.2)" />
      <rect x="55" y="75" width="20" height="5" rx="1" fill="rgba(255,255,255,0.2)" />
      {/* Person on incline */}
      <ellipse cx="50" cy="55" rx="12" ry="5" transform="rotate(-35 50 55)" fill="url(#inclineDB)" />
      <circle cx="42" cy="42" r="5" fill="url(#inclineDB)" />
      {/* Arms with dumbbells */}
      <line x1="45" y1="52" x2="30" y2="32" stroke="url(#inclineDB)" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="52" x2="70" y2="32" stroke="url(#inclineDB)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbells */}
      <rect x="22" y="28" width="16" height="5" rx="1" fill="url(#inclineDBDark)" />
      <rect x="62" y="28" width="16" height="5" rx="1" fill="url(#inclineDBDark)" />
    </g>
  </svg>
);

// Cable Fly - person standing with cables crossing
export const CableFlyIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="cableFly" />
    <g filter="url(#cableFlyShadow)">
      {/* Cable towers */}
      <rect x="5" y="10" width="8" height="70" rx="2" fill="rgba(255,255,255,0.2)" />
      <rect x="87" y="10" width="8" height="70" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Cables */}
      <line x1="13" y1="25" x2="40" y2="50" stroke="url(#cableFlyDark)" strokeWidth="2" />
      <line x1="87" y1="25" x2="60" y2="50" stroke="url(#cableFlyDark)" strokeWidth="2" />
      {/* Person */}
      <circle cx="50" cy="32" r="6" fill="url(#cableFly)" />
      <line x1="50" y1="38" x2="50" y2="65" stroke="url(#cableFly)" strokeWidth="3" strokeLinecap="round" />
      {/* Arms (pulling cables) */}
      <line x1="50" y1="45" x2="40" y2="50" stroke="url(#cableFly)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="45" x2="60" y2="50" stroke="url(#cableFly)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="50" y1="65" x2="42" y2="85" stroke="url(#cableFly)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="65" x2="58" y2="85" stroke="url(#cableFly)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Dumbbell Fly - person lying with arms spread holding dumbbells
export const DumbbellFlyIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="dbFly" />
    <g filter="url(#dbFlyShadow)">
      {/* Bench */}
      <rect x="25" y="55" width="50" height="5" rx="2" fill="rgba(255,255,255,0.25)" />
      {/* Person lying */}
      <ellipse cx="50" cy="50" rx="16" ry="5" fill="url(#dbFly)" />
      <circle cx="68" cy="50" r="5" fill="url(#dbFly)" />
      {/* Arms spread out (fly position) */}
      <line x1="38" y1="48" x2="18" y2="38" stroke="url(#dbFly)" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="48" x2="82" y2="38" stroke="url(#dbFly)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbells at angles */}
      <rect x="8" y="32" width="14" height="5" rx="1" transform="rotate(30 15 35)" fill="url(#dbFlyDark)" />
      <rect x="78" y="32" width="14" height="5" rx="1" transform="rotate(-30 85 35)" fill="url(#dbFlyDark)" />
    </g>
  </svg>
);

// Incline Bench Press - person on incline with barbell
export const InclineBenchPressIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="inclineBP" />
    <g filter="url(#inclineBPShadow)">
      {/* Incline bench */}
      <path d="M30 80 L48 48 L58 48 L58 80 Z" fill="rgba(255,255,255,0.2)" />
      {/* Person */}
      <ellipse cx="52" cy="58" rx="10" ry="5" transform="rotate(-35 52 58)" fill="url(#inclineBP)" />
      <circle cx="45" cy="45" r="5" fill="url(#inclineBP)" />
      {/* Arms up */}
      <line x1="48" y1="52" x2="35" y2="28" stroke="url(#inclineBP)" strokeWidth="3" strokeLinecap="round" />
      <line x1="56" y1="52" x2="68" y2="28" stroke="url(#inclineBP)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell */}
      <rect x="15" y="22" width="72" height="4" rx="2" fill="url(#inclineBP)" />
      <rect x="8" y="18" width="12" height="12" rx="2" fill="url(#inclineBPDark)" />
      <rect x="82" y="18" width="12" height="12" rx="2" fill="url(#inclineBPDark)" />
    </g>
  </svg>
);

// Decline Bench Press - person on decline with barbell
export const DeclineBenchPressIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="declineBP" />
    <g filter="url(#declineBPShadow)">
      {/* Decline bench */}
      <path d="M25 45 L75 55 L75 60 L25 50 Z" fill="rgba(255,255,255,0.2)" />
      <rect x="70" y="60" width="8" height="20" rx="2" fill="rgba(255,255,255,0.15)" />
      {/* Person on decline (head lower) */}
      <ellipse cx="50" cy="48" rx="18" ry="5" transform="rotate(8 50 48)" fill="url(#declineBP)" />
      <circle cx="28" cy="52" r="5" fill="url(#declineBP)" />
      {/* Arms up */}
      <line x1="40" y1="45" x2="35" y2="22" stroke="url(#declineBP)" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="48" x2="65" y2="25" stroke="url(#declineBP)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell */}
      <rect x="18" y="18" width="65" height="4" rx="2" fill="url(#declineBP)" />
      <rect x="10" y="14" width="12" height="12" rx="2" fill="url(#declineBPDark)" />
      <rect x="78" y="14" width="12" height="12" rx="2" fill="url(#declineBPDark)" />
    </g>
  </svg>
);

// Chest Dip - person on dip bars leaning forward
export const ChestDipIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="chestDip" />
    <g filter="url(#chestDipShadow)">
      {/* Dip bars */}
      <rect x="20" y="35" width="5" height="50" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect x="75" y="35" width="5" height="50" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect x="15" y="35" width="15" height="4" rx="1" fill="rgba(255,255,255,0.25)" />
      <rect x="70" y="35" width="15" height="4" rx="1" fill="rgba(255,255,255,0.25)" />
      {/* Person (leaning forward for chest emphasis) */}
      <circle cx="50" cy="28" r="6" fill="url(#chestDip)" />
      <line x1="50" y1="34" x2="52" y2="55" stroke="url(#chestDip)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms on bars */}
      <line x1="48" y1="40" x2="28" y2="38" stroke="url(#chestDip)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="40" x2="72" y2="38" stroke="url(#chestDip)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs (bent back) */}
      <line x1="52" y1="55" x2="58" y2="72" stroke="url(#chestDip)" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="72" x2="52" y2="85" stroke="url(#chestDip)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Machine Chest Press - person seated at machine pressing forward
export const MachineChestPressIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="machinePress" />
    <g filter="url(#machinePressShadow)">
      {/* Machine frame */}
      <rect x="65" y="15" width="25" height="70" rx="3" fill="rgba(255,255,255,0.15)" />
      <rect x="75" y="25" width="10" height="15" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Seat */}
      <rect x="30" y="55" width="30" height="5" rx="2" fill="rgba(255,255,255,0.2)" />
      <rect x="55" y="35" width="5" height="25" rx="1" fill="rgba(255,255,255,0.2)" />
      {/* Person seated */}
      <circle cx="40" cy="38" r="6" fill="url(#machinePress)" />
      <line x1="40" y1="44" x2="42" y2="55" stroke="url(#machinePress)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms pressing forward */}
      <line x1="42" y1="48" x2="65" y2="45" stroke="url(#machinePress)" strokeWidth="3" strokeLinecap="round" />
      {/* Handles */}
      <circle cx="65" cy="45" r="4" stroke="url(#machinePressDark)" strokeWidth="2" fill="none" />
      {/* Legs */}
      <line x1="42" y1="55" x2="35" y2="75" stroke="url(#machinePress)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Dumbbell Pullover - person lying with dumbbell overhead
export const DumbbellPulloverIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="pullover" />
    <g filter="url(#pulloverShadow)">
      {/* Bench */}
      <rect x="30" y="52" width="40" height="5" rx="2" fill="rgba(255,255,255,0.25)" />
      {/* Person lying perpendicular to bench */}
      <ellipse cx="50" cy="48" rx="12" ry="6" fill="url(#pullover)" />
      <circle cx="50" cy="38" r="5" fill="url(#pullover)" />
      {/* Arms extended back with dumbbell */}
      <line x1="50" y1="35" x2="50" y2="15" stroke="url(#pullover)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbell above head */}
      <rect x="38" y="8" width="24" height="6" rx="1" fill="url(#pullover)" />
      <rect x="35" y="6" width="8" height="10" rx="1" fill="url(#pulloverDark)" />
      <rect x="57" y="6" width="8" height="10" rx="1" fill="url(#pulloverDark)" />
      {/* Legs bent */}
      <line x1="50" y1="55" x2="45" y2="70" stroke="url(#pullover)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="55" y2="70" stroke="url(#pullover)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Export mapping from exercise ID to icon component
export const chestExerciseIcons: Record<string, React.FC<ExerciseIconProps>> = {
  bench_press: BenchPressIcon,
  push_up: PushUpIcon,
  incline_dumbbell_press: InclineDumbbellPressIcon,
  cable_fly: CableFlyIcon,
  dumbbell_fly: DumbbellFlyIcon,
  incline_bench_press: InclineBenchPressIcon,
  decline_bench_press: DeclineBenchPressIcon,
  chest_dip: ChestDipIcon,
  machine_chest_press: MachineChestPressIcon,
  dumbbell_pullover: DumbbellPulloverIcon,
};
