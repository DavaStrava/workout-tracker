import React from 'react';
import { ExerciseIconGradientDefs, type ExerciseIconProps } from './ExerciseIconBase';

// Overhead Press - standing barbell press
export const OverheadPressIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="ohp" />
    <g filter="url(#ohpShadow)">
      {/* Person */}
      <circle cx="50" cy="35" r="6" fill="url(#ohp)" />
      <line x1="50" y1="41" x2="50" y2="65" stroke="url(#ohp)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms overhead */}
      <line x1="48" y1="45" x2="32" y2="18" stroke="url(#ohp)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="45" x2="68" y2="18" stroke="url(#ohp)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell overhead */}
      <rect x="15" y="12" width="70" height="4" rx="2" fill="url(#ohp)" />
      <rect x="8" y="8" width="12" height="12" rx="2" fill="url(#ohpDark)" />
      <rect x="80" y="8" width="12" height="12" rx="2" fill="url(#ohpDark)" />
      {/* Legs */}
      <line x1="50" y1="65" x2="42" y2="90" stroke="url(#ohp)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="65" x2="58" y2="90" stroke="url(#ohp)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Lateral Raise - arms out to sides
export const LateralRaiseIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="latRaise" />
    <g filter="url(#latRaiseShadow)">
      {/* Person */}
      <circle cx="50" cy="25" r="6" fill="url(#latRaise)" />
      <line x1="50" y1="31" x2="50" y2="58" stroke="url(#latRaise)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms raised to sides (T position) */}
      <line x1="48" y1="38" x2="18" y2="38" stroke="url(#latRaise)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="38" x2="82" y2="38" stroke="url(#latRaise)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbells */}
      <rect x="8" y="34" width="12" height="6" rx="1" fill="url(#latRaiseDark)" />
      <rect x="80" y="34" width="12" height="6" rx="1" fill="url(#latRaiseDark)" />
      {/* Legs */}
      <line x1="50" y1="58" x2="42" y2="88" stroke="url(#latRaise)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="58" x2="58" y2="88" stroke="url(#latRaise)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Front Raise - arms in front
export const FrontRaiseIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="frontRaise" />
    <g filter="url(#frontRaiseShadow)">
      {/* Person (side view) */}
      <circle cx="60" cy="28" r="6" fill="url(#frontRaise)" />
      <line x1="60" y1="34" x2="60" y2="60" stroke="url(#frontRaise)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms raised forward */}
      <line x1="58" y1="40" x2="25" y2="35" stroke="url(#frontRaise)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbell */}
      <rect x="12" y="32" width="15" height="6" rx="1" fill="url(#frontRaiseDark)" />
      {/* Legs */}
      <line x1="60" y1="60" x2="55" y2="88" stroke="url(#frontRaise)" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="60" x2="68" y2="88" stroke="url(#frontRaise)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Rear Delt Fly - bent over with arms out
export const RearDeltFlyIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="rearDelt" />
    <g filter="url(#rearDeltShadow)">
      {/* Person bent over */}
      <circle cx="50" cy="35" r="6" fill="url(#rearDelt)" />
      <line x1="50" y1="41" x2="50" y2="55" stroke="url(#rearDelt)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms out to sides */}
      <line x1="48" y1="45" x2="20" y2="35" stroke="url(#rearDelt)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="45" x2="80" y2="35" stroke="url(#rearDelt)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbells */}
      <rect x="10" y="32" width="12" height="5" rx="1" fill="url(#rearDeltDark)" />
      <rect x="78" y="32" width="12" height="5" rx="1" fill="url(#rearDeltDark)" />
      {/* Legs */}
      <line x1="50" y1="55" x2="38" y2="85" stroke="url(#rearDelt)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="62" y2="85" stroke="url(#rearDelt)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Dumbbell Shoulder Press - seated or standing
export const DumbbellShoulderPressIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="dbPress" />
    <g filter="url(#dbPressShadow)">
      {/* Person */}
      <circle cx="50" cy="35" r="6" fill="url(#dbPress)" />
      <line x1="50" y1="41" x2="50" y2="65" stroke="url(#dbPress)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms overhead with dumbbells */}
      <line x1="48" y1="45" x2="35" y2="18" stroke="url(#dbPress)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="45" x2="65" y2="18" stroke="url(#dbPress)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbells */}
      <rect x="25" y="12" width="18" height="6" rx="1" fill="url(#dbPressDark)" />
      <rect x="57" y="12" width="18" height="6" rx="1" fill="url(#dbPressDark)" />
      {/* Legs */}
      <line x1="50" y1="65" x2="42" y2="90" stroke="url(#dbPress)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="65" x2="58" y2="90" stroke="url(#dbPress)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Arnold Press - rotation during press
export const ArnoldPressIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="arnold" />
    <g filter="url(#arnoldShadow)">
      {/* Person */}
      <circle cx="50" cy="38" r="6" fill="url(#arnold)" />
      <line x1="50" y1="44" x2="50" y2="68" stroke="url(#arnold)" strokeWidth="4" strokeLinecap="round" />
      {/* One arm up, one transitioning (showing rotation) */}
      <line x1="48" y1="48" x2="32" y2="22" stroke="url(#arnold)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="48" x2="62" y2="38" stroke="url(#arnold)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbells at different angles */}
      <rect x="22" y="16" width="18" height="6" rx="1" fill="url(#arnoldDark)" />
      <rect x="58" y="34" width="14" height="6" rx="1" fill="url(#arnoldDark)" />
      {/* Rotation arrow */}
      <path d="M70 45 Q75 35 68 28" stroke="url(#arnoldDark)" strokeWidth="1.5" fill="none" strokeDasharray="3,2" />
      {/* Legs */}
      <line x1="50" y1="68" x2="42" y2="90" stroke="url(#arnold)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="68" x2="58" y2="90" stroke="url(#arnold)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Cable Lateral Raise
export const CableLateralRaiseIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="cableLatRaise" />
    <g filter="url(#cableLatRaiseShadow)">
      {/* Cable machine */}
      <rect x="5" y="20" width="12" height="60" rx="2" fill="rgba(255,255,255,0.15)" />
      {/* Cable */}
      <line x1="17" y1="70" x2="35" y2="35" stroke="url(#cableLatRaiseDark)" strokeWidth="2" />
      {/* Person */}
      <circle cx="55" cy="28" r="6" fill="url(#cableLatRaise)" />
      <line x1="55" y1="34" x2="55" y2="60" stroke="url(#cableLatRaise)" strokeWidth="4" strokeLinecap="round" />
      {/* Arm raised to side */}
      <line x1="53" y1="40" x2="35" y2="35" stroke="url(#cableLatRaise)" strokeWidth="3" strokeLinecap="round" />
      {/* Handle */}
      <circle cx="35" cy="35" r="3" fill="url(#cableLatRaiseDark)" />
      {/* Legs */}
      <line x1="55" y1="60" x2="48" y2="88" stroke="url(#cableLatRaise)" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="60" x2="62" y2="88" stroke="url(#cableLatRaise)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Machine Shoulder Press
export const MachineShoulderPressIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="machineShPress" />
    <g filter="url(#machineShPressShadow)">
      {/* Machine frame */}
      <rect x="20" y="10" width="60" height="75" rx="3" fill="rgba(255,255,255,0.1)" />
      {/* Seat back */}
      <rect x="45" y="45" width="8" height="30" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Seat */}
      <rect x="25" y="70" width="30" height="6" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Person */}
      <circle cx="40" cy="42" r="6" fill="url(#machineShPress)" />
      <line x1="40" y1="48" x2="42" y2="68" stroke="url(#machineShPress)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms pressing up */}
      <line x1="38" y1="50" x2="28" y2="28" stroke="url(#machineShPress)" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="50" x2="52" y2="28" stroke="url(#machineShPress)" strokeWidth="3" strokeLinecap="round" />
      {/* Handles */}
      <circle cx="28" cy="28" r="4" stroke="url(#machineShPressDark)" strokeWidth="2" fill="none" />
      <circle cx="52" cy="28" r="4" stroke="url(#machineShPressDark)" strokeWidth="2" fill="none" />
    </g>
  </svg>
);

// Reverse Pec Deck (Rear Delts)
export const ReversePecDeckIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="revPecDeck" />
    <g filter="url(#revPecDeckShadow)">
      {/* Machine */}
      <rect x="60" y="15" width="30" height="70" rx="3" fill="rgba(255,255,255,0.1)" />
      {/* Chest pad */}
      <rect x="55" y="35" width="8" height="25" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Person facing machine */}
      <circle cx="45" cy="40" r="6" fill="url(#revPecDeck)" />
      <line x1="48" y1="45" x2="50" y2="65" stroke="url(#revPecDeck)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms spread back */}
      <line x1="45" y1="48" x2="25" y2="42" stroke="url(#revPecDeck)" strokeWidth="3" strokeLinecap="round" />
      {/* Handles/arms */}
      <path d="M58 40 Q50 35 42 42" stroke="url(#revPecDeckDark)" strokeWidth="3" fill="none" />
      {/* Seat */}
      <rect x="30" y="68" width="28" height="5" rx="2" fill="rgba(255,255,255,0.2)" />
    </g>
  </svg>
);

// Seated Dumbbell Press
export const SeatedDumbbellPressIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="seatedDBPress" />
    <g filter="url(#seatedDBPressShadow)">
      {/* Bench with back support */}
      <rect x="55" y="35" width="8" height="35" rx="2" fill="rgba(255,255,255,0.2)" />
      <rect x="30" y="65" width="35" height="5" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Person seated */}
      <circle cx="45" cy="38" r="6" fill="url(#seatedDBPress)" />
      <line x1="45" y1="44" x2="48" y2="65" stroke="url(#seatedDBPress)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms overhead */}
      <line x1="43" y1="48" x2="30" y2="22" stroke="url(#seatedDBPress)" strokeWidth="3" strokeLinecap="round" />
      <line x1="47" y1="48" x2="60" y2="22" stroke="url(#seatedDBPress)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbells */}
      <rect x="20" y="18" width="18" height="6" rx="1" fill="url(#seatedDBPressDark)" />
      <rect x="52" y="18" width="18" height="6" rx="1" fill="url(#seatedDBPressDark)" />
      {/* Legs */}
      <line x1="48" y1="65" x2="40" y2="85" stroke="url(#seatedDBPress)" strokeWidth="3" strokeLinecap="round" />
      <line x1="48" y1="65" x2="56" y2="85" stroke="url(#seatedDBPress)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Export mapping
export const shoulderExerciseIcons: Record<string, React.FC<ExerciseIconProps>> = {
  overhead_press: OverheadPressIcon,
  lateral_raise: LateralRaiseIcon,
  front_raise: FrontRaiseIcon,
  rear_delt_fly: RearDeltFlyIcon,
  dumbbell_shoulder_press: DumbbellShoulderPressIcon,
  arnold_press: ArnoldPressIcon,
  cable_lateral_raise: CableLateralRaiseIcon,
  machine_shoulder_press: MachineShoulderPressIcon,
  reverse_pec_deck: ReversePecDeckIcon,
  seated_dumbbell_press: SeatedDumbbellPressIcon,
};
