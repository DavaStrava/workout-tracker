import React from 'react';
import { ExerciseIconGradientDefs, type ExerciseIconProps } from './ExerciseIconBase';

// ============ UPPER BACK EXERCISES ============

// Barbell Row - bent over row position
export const BarbellRowIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="bbRow" />
    <g filter="url(#bbRowShadow)">
      {/* Person bent over */}
      <circle cx="65" cy="25" r="6" fill="url(#bbRow)" />
      <line x1="62" y1="30" x2="45" y2="55" stroke="url(#bbRow)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms pulling */}
      <line x1="52" y1="42" x2="45" y2="65" stroke="url(#bbRow)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="45" y1="55" x2="35" y2="80" stroke="url(#bbRow)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="55" x2="55" y2="80" stroke="url(#bbRow)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell */}
      <rect x="20" y="68" width="55" height="4" rx="2" fill="url(#bbRow)" />
      <rect x="12" y="64" width="12" height="12" rx="2" fill="url(#bbRowDark)" />
      <rect x="72" y="64" width="12" height="12" rx="2" fill="url(#bbRowDark)" />
    </g>
  </svg>
);

// Seated Cable Row - person seated pulling cable
export const SeatedRowIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="seatedRow" />
    <g filter="url(#seatedRowShadow)">
      {/* Cable machine */}
      <rect x="75" y="20" width="15" height="60" rx="2" fill="rgba(255,255,255,0.15)" />
      {/* Cable */}
      <line x1="75" y1="50" x2="55" y2="50" stroke="url(#seatedRowDark)" strokeWidth="2" />
      {/* Seat/platform */}
      <rect x="15" y="60" width="45" height="5" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Person seated */}
      <circle cx="35" cy="38" r="6" fill="url(#seatedRow)" />
      <line x1="35" y1="44" x2="38" y2="60" stroke="url(#seatedRow)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms pulling */}
      <line x1="38" y1="48" x2="55" y2="50" stroke="url(#seatedRow)" strokeWidth="3" strokeLinecap="round" />
      {/* Handle */}
      <rect x="52" y="46" width="6" height="8" rx="1" fill="url(#seatedRowDark)" />
      {/* Legs extended */}
      <line x1="38" y1="60" x2="20" y2="65" stroke="url(#seatedRow)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// T-Bar Row - person straddling bar
export const TBarRowIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="tbarRow" />
    <g filter="url(#tbarRowShadow)">
      {/* T-bar (angled) */}
      <line x1="15" y1="85" x2="60" y2="55" stroke="url(#tbarRow)" strokeWidth="4" strokeLinecap="round" />
      {/* Weight on end */}
      <rect x="55" y="48" width="15" height="12" rx="2" fill="url(#tbarRowDark)" />
      {/* Person bent over */}
      <circle cx="55" cy="22" r="6" fill="url(#tbarRow)" />
      <line x1="52" y1="27" x2="40" y2="50" stroke="url(#tbarRow)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms pulling up */}
      <line x1="45" y1="38" x2="55" y2="52" stroke="url(#tbarRow)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs straddling */}
      <line x1="40" y1="50" x2="28" y2="78" stroke="url(#tbarRow)" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="50" x2="52" y2="78" stroke="url(#tbarRow)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Dumbbell Row - single arm row on bench
export const DumbbellRowIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="dbRow" />
    <g filter="url(#dbRowShadow)">
      {/* Bench */}
      <rect x="15" y="55" width="50" height="5" rx="2" fill="rgba(255,255,255,0.25)" />
      {/* Person bent over bench */}
      <circle cx="45" cy="32" r="6" fill="url(#dbRow)" />
      <line x1="45" y1="38" x2="50" y2="55" stroke="url(#dbRow)" strokeWidth="4" strokeLinecap="round" />
      {/* Supporting arm on bench */}
      <line x1="48" y1="42" x2="35" y2="55" stroke="url(#dbRow)" strokeWidth="3" strokeLinecap="round" />
      {/* Rowing arm */}
      <line x1="52" y1="45" x2="70" y2="60" stroke="url(#dbRow)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbell */}
      <rect x="65" y="58" width="18" height="6" rx="1" fill="url(#dbRowDark)" />
      {/* Legs */}
      <line x1="50" y1="55" x2="60" y2="80" stroke="url(#dbRow)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Pendlay Row - explosive row from floor
export const PendlayRowIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="pendlay" />
    <g filter="url(#pendlayShadow)">
      {/* Floor */}
      <line x1="10" y1="82" x2="90" y2="82" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      {/* Person bent parallel */}
      <circle cx="60" cy="28" r="6" fill="url(#pendlay)" />
      <line x1="57" y1="33" x2="42" y2="48" stroke="url(#pendlay)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms at barbell */}
      <line x1="48" y1="40" x2="48" y2="72" stroke="url(#pendlay)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="42" y1="48" x2="32" y2="80" stroke="url(#pendlay)" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="48" x2="52" y2="80" stroke="url(#pendlay)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell on floor */}
      <rect x="18" y="74" width="60" height="4" rx="2" fill="url(#pendlay)" />
      <rect x="10" y="70" width="12" height="12" rx="2" fill="url(#pendlayDark)" />
      <rect x="75" y="70" width="12" height="12" rx="2" fill="url(#pendlayDark)" />
    </g>
  </svg>
);

// Chest Supported Row - lying on incline bench
export const ChestSupportedRowIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="chestRow" />
    <g filter="url(#chestRowShadow)">
      {/* Incline bench */}
      <path d="M25 80 L50 40 L60 40 L60 80 Z" fill="rgba(255,255,255,0.2)" />
      {/* Person chest on bench */}
      <ellipse cx="50" cy="50" rx="12" ry="5" transform="rotate(-40 50 50)" fill="url(#chestRow)" />
      <circle cx="40" cy="38" r="5" fill="url(#chestRow)" />
      {/* Arms hanging/rowing */}
      <line x1="45" y1="52" x2="35" y2="72" stroke="url(#chestRow)" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="52" x2="65" y2="72" stroke="url(#chestRow)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbells */}
      <rect x="28" y="70" width="14" height="5" rx="1" fill="url(#chestRowDark)" />
      <rect x="58" y="70" width="14" height="5" rx="1" fill="url(#chestRowDark)" />
    </g>
  </svg>
);

// Machine Row
export const MachineRowIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="machineRow" />
    <g filter="url(#machineRowShadow)">
      {/* Machine */}
      <rect x="60" y="20" width="30" height="60" rx="3" fill="rgba(255,255,255,0.15)" />
      {/* Chest pad */}
      <rect x="55" y="40" width="8" height="20" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Person seated */}
      <circle cx="40" cy="38" r="6" fill="url(#machineRow)" />
      <line x1="43" y1="44" x2="45" y2="58" stroke="url(#machineRow)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms pulling */}
      <line x1="45" y1="50" x2="55" y2="48" stroke="url(#machineRow)" strokeWidth="3" strokeLinecap="round" />
      {/* Handles */}
      <circle cx="58" cy="48" r="3" stroke="url(#machineRowDark)" strokeWidth="2" fill="none" />
      {/* Seat */}
      <rect x="25" y="58" width="25" height="5" rx="2" fill="rgba(255,255,255,0.2)" />
    </g>
  </svg>
);

// Inverted Row - bodyweight row under bar
export const InvertedRowIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="invertedRow" />
    <g filter="url(#invertedRowShadow)">
      {/* Bar */}
      <rect x="15" y="25" width="70" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
      {/* Supports */}
      <rect x="15" y="25" width="5" height="55" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect x="80" y="25" width="5" height="55" rx="1" fill="rgba(255,255,255,0.2)" />
      {/* Person hanging under bar */}
      <circle cx="50" cy="35" r="5" fill="url(#invertedRow)" />
      <line x1="50" y1="40" x2="50" y2="60" stroke="url(#invertedRow)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms gripping bar */}
      <line x1="50" y1="42" x2="38" y2="28" stroke="url(#invertedRow)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="42" x2="62" y2="28" stroke="url(#invertedRow)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs extended */}
      <line x1="50" y1="60" x2="50" y2="78" stroke="url(#invertedRow)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="78" x2="55" y2="82" stroke="url(#invertedRow)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// ============ LATS EXERCISES ============

// Pull Up
export const PullUpIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="pullUp" />
    <g filter="url(#pullUpShadow)">
      {/* Bar */}
      <rect x="15" y="10" width="70" height="5" rx="2" fill="rgba(255,255,255,0.3)" />
      {/* Person */}
      <circle cx="50" cy="28" r="6" fill="url(#pullUp)" />
      <line x1="50" y1="34" x2="50" y2="60" stroke="url(#pullUp)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms gripping wide */}
      <line x1="50" y1="38" x2="30" y2="14" stroke="url(#pullUp)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="38" x2="70" y2="14" stroke="url(#pullUp)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="50" y1="60" x2="42" y2="85" stroke="url(#pullUp)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="60" x2="58" y2="85" stroke="url(#pullUp)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Lat Pulldown
export const LatPulldownIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="latPD" />
    <g filter="url(#latPDShadow)">
      {/* Machine top */}
      <rect x="20" y="8" width="60" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Cable */}
      <line x1="50" y1="16" x2="50" y2="35" stroke="url(#latPDDark)" strokeWidth="2" />
      {/* Wide bar */}
      <rect x="25" y="32" width="50" height="4" rx="1" fill="url(#latPD)" />
      {/* Person seated */}
      <circle cx="50" cy="48" r="6" fill="url(#latPD)" />
      <line x1="50" y1="54" x2="50" y2="70" stroke="url(#latPD)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms pulling down */}
      <line x1="50" y1="52" x2="30" y2="35" stroke="url(#latPD)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="52" x2="70" y2="35" stroke="url(#latPD)" strokeWidth="3" strokeLinecap="round" />
      {/* Seat */}
      <rect x="35" y="72" width="30" height="5" rx="2" fill="rgba(255,255,255,0.2)" />
    </g>
  </svg>
);

// Straight Arm Pulldown
export const StraightArmPulldownIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="straightPD" />
    <g filter="url(#straightPDShadow)">
      {/* Cable machine */}
      <rect x="35" y="5" width="30" height="15" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Cable */}
      <line x1="50" y1="20" x2="50" y2="35" stroke="url(#straightPDDark)" strokeWidth="2" />
      {/* Bar/rope */}
      <rect x="40" y="33" width="20" height="4" rx="1" fill="url(#straightPD)" />
      {/* Person standing */}
      <circle cx="50" cy="48" r="6" fill="url(#straightPD)" />
      <line x1="50" y1="54" x2="50" y2="72" stroke="url(#straightPD)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms straight, pulling down */}
      <line x1="50" y1="56" x2="45" y2="36" stroke="url(#straightPD)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="56" x2="55" y2="36" stroke="url(#straightPD)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="50" y1="72" x2="42" y2="90" stroke="url(#straightPD)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="72" x2="58" y2="90" stroke="url(#straightPD)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Chin Up (underhand grip)
export const ChinUpIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="chinUp" />
    <g filter="url(#chinUpShadow)">
      {/* Bar */}
      <rect x="25" y="10" width="50" height="5" rx="2" fill="rgba(255,255,255,0.3)" />
      {/* Person */}
      <circle cx="50" cy="28" r="6" fill="url(#chinUp)" />
      <line x1="50" y1="34" x2="50" y2="60" stroke="url(#chinUp)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms close grip (chin up style) */}
      <line x1="50" y1="38" x2="38" y2="14" stroke="url(#chinUp)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="38" x2="62" y2="14" stroke="url(#chinUp)" strokeWidth="3" strokeLinecap="round" />
      {/* Grip indicators (dots) */}
      <circle cx="38" cy="12" r="3" fill="url(#chinUpDark)" />
      <circle cx="62" cy="12" r="3" fill="url(#chinUpDark)" />
      {/* Legs */}
      <line x1="50" y1="60" x2="44" y2="85" stroke="url(#chinUp)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="60" x2="56" y2="85" stroke="url(#chinUp)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Close Grip Lat Pulldown
export const CloseGripPulldownIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="closePD" />
    <g filter="url(#closePDShadow)">
      {/* Machine */}
      <rect x="30" y="8" width="40" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Cable */}
      <line x1="50" y1="16" x2="50" y2="30" stroke="url(#closePDDark)" strokeWidth="2" />
      {/* V-bar (close grip) */}
      <path d="M40 30 L50 38 L60 30" stroke="url(#closePD)" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Person */}
      <circle cx="50" cy="50" r="6" fill="url(#closePD)" />
      <line x1="50" y1="56" x2="50" y2="72" stroke="url(#closePD)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms */}
      <line x1="50" y1="54" x2="48" y2="38" stroke="url(#closePD)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="54" x2="52" y2="38" stroke="url(#closePD)" strokeWidth="3" strokeLinecap="round" />
      {/* Seat */}
      <rect x="35" y="74" width="30" height="5" rx="2" fill="rgba(255,255,255,0.2)" />
    </g>
  </svg>
);

// Assisted Pull Up
export const AssistedPullUpIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="assistPU" />
    <g filter="url(#assistPUShadow)">
      {/* Machine frame */}
      <rect x="10" y="5" width="80" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
      <rect x="10" y="5" width="5" height="85" rx="1" fill="rgba(255,255,255,0.15)" />
      <rect x="85" y="5" width="5" height="85" rx="1" fill="rgba(255,255,255,0.15)" />
      {/* Person */}
      <circle cx="50" cy="25" r="6" fill="url(#assistPU)" />
      <line x1="50" y1="31" x2="50" y2="55" stroke="url(#assistPU)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms */}
      <line x1="50" y1="35" x2="28" y2="12" stroke="url(#assistPU)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="35" x2="72" y2="12" stroke="url(#assistPU)" strokeWidth="3" strokeLinecap="round" />
      {/* Knee pad */}
      <rect x="40" y="60" width="20" height="15" rx="3" fill="url(#assistPUDark)" opacity="0.6" />
      {/* Knees on pad */}
      <line x1="50" y1="55" x2="45" y2="68" stroke="url(#assistPU)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="55" y2="68" stroke="url(#assistPU)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// ============ TRAPS EXERCISES ============

// Barbell Shrugs
export const ShrugsIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="shrugs" />
    <g filter="url(#shrugsShadow)">
      {/* Person standing */}
      <circle cx="50" cy="18" r="6" fill="url(#shrugs)" />
      {/* Shoulders raised (shrug position) */}
      <path d="M38 28 Q50 22 62 28" stroke="url(#shrugs)" strokeWidth="4" strokeLinecap="round" fill="none" />
      <line x1="50" y1="28" x2="50" y2="55" stroke="url(#shrugs)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms down at sides */}
      <line x1="42" y1="32" x2="35" y2="60" stroke="url(#shrugs)" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="32" x2="65" y2="60" stroke="url(#shrugs)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="50" y1="55" x2="42" y2="85" stroke="url(#shrugs)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="58" y2="85" stroke="url(#shrugs)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell */}
      <rect x="18" y="62" width="64" height="4" rx="2" fill="url(#shrugs)" />
      <rect x="10" y="58" width="12" height="12" rx="2" fill="url(#shrugsDark)" />
      <rect x="78" y="58" width="12" height="12" rx="2" fill="url(#shrugsDark)" />
    </g>
  </svg>
);

// Face Pull
export const FacePullIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="facePull" />
    <g filter="url(#facePullShadow)">
      {/* Cable machine */}
      <rect x="70" y="15" width="20" height="50" rx="2" fill="rgba(255,255,255,0.15)" />
      {/* Cable */}
      <line x1="70" y1="35" x2="55" y2="35" stroke="url(#facePullDark)" strokeWidth="2" />
      {/* Rope ends */}
      <circle cx="52" cy="32" r="3" fill="url(#facePullDark)" />
      <circle cx="52" cy="38" r="3" fill="url(#facePullDark)" />
      {/* Person */}
      <circle cx="35" cy="35" r="6" fill="url(#facePull)" />
      <line x1="35" y1="41" x2="35" y2="65" stroke="url(#facePull)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms pulling to face */}
      <line x1="38" y1="45" x2="52" y2="32" stroke="url(#facePull)" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="45" x2="52" y2="38" stroke="url(#facePull)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="35" y1="65" x2="28" y2="88" stroke="url(#facePull)" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="65" x2="42" y2="88" stroke="url(#facePull)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Dumbbell Shrugs
export const DumbbellShrugsIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="dbShrugs" />
    <g filter="url(#dbShrugsShadow)">
      {/* Person */}
      <circle cx="50" cy="18" r="6" fill="url(#dbShrugs)" />
      {/* Raised shoulders */}
      <path d="M38 28 Q50 22 62 28" stroke="url(#dbShrugs)" strokeWidth="4" strokeLinecap="round" fill="none" />
      <line x1="50" y1="28" x2="50" y2="55" stroke="url(#dbShrugs)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms with dumbbells */}
      <line x1="42" y1="32" x2="30" y2="55" stroke="url(#dbShrugs)" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="32" x2="70" y2="55" stroke="url(#dbShrugs)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbells */}
      <rect x="22" y="52" width="16" height="6" rx="1" fill="url(#dbShrugsDark)" />
      <rect x="62" y="52" width="16" height="6" rx="1" fill="url(#dbShrugsDark)" />
      {/* Legs */}
      <line x1="50" y1="55" x2="42" y2="85" stroke="url(#dbShrugs)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="58" y2="85" stroke="url(#dbShrugs)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Upright Row
export const UprightRowIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="uprightRow" />
    <g filter="url(#uprightRowShadow)">
      {/* Person */}
      <circle cx="50" cy="18" r="6" fill="url(#uprightRow)" />
      <line x1="50" y1="24" x2="50" y2="55" stroke="url(#uprightRow)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms pulling up (elbows high) */}
      <line x1="48" y1="32" x2="32" y2="38" stroke="url(#uprightRow)" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="38" x2="38" y2="48" stroke="url(#uprightRow)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="32" x2="68" y2="38" stroke="url(#uprightRow)" strokeWidth="3" strokeLinecap="round" />
      <line x1="68" y1="38" x2="62" y2="48" stroke="url(#uprightRow)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell at chest height */}
      <rect x="30" y="46" width="40" height="4" rx="2" fill="url(#uprightRow)" />
      <rect x="25" y="44" width="8" height="8" rx="1" fill="url(#uprightRowDark)" />
      <rect x="67" y="44" width="8" height="8" rx="1" fill="url(#uprightRowDark)" />
      {/* Legs */}
      <line x1="50" y1="55" x2="42" y2="85" stroke="url(#uprightRow)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="58" y2="85" stroke="url(#uprightRow)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Rack Pull
export const RackPullIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="rackPull" />
    <g filter="url(#rackPullShadow)">
      {/* Rack */}
      <rect x="10" y="30" width="5" height="55" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect x="85" y="30" width="5" height="55" rx="1" fill="rgba(255,255,255,0.2)" />
      {/* Safety bars */}
      <rect x="10" y="55" width="80" height="4" rx="1" fill="rgba(255,255,255,0.15)" />
      {/* Person */}
      <circle cx="50" cy="22" r="6" fill="url(#rackPull)" />
      <line x1="50" y1="28" x2="50" y2="48" stroke="url(#rackPull)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms */}
      <line x1="48" y1="35" x2="38" y2="52" stroke="url(#rackPull)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="35" x2="62" y2="52" stroke="url(#rackPull)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs slightly bent */}
      <line x1="50" y1="48" x2="40" y2="75" stroke="url(#rackPull)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="48" x2="60" y2="75" stroke="url(#rackPull)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell on rack */}
      <rect x="18" y="50" width="64" height="4" rx="2" fill="url(#rackPull)" />
      <rect x="12" y="46" width="10" height="12" rx="2" fill="url(#rackPullDark)" />
      <rect x="78" y="46" width="10" height="12" rx="2" fill="url(#rackPullDark)" />
    </g>
  </svg>
);

// Export mapping
export const backExerciseIcons: Record<string, React.FC<ExerciseIconProps>> = {
  // Upper Back
  row: BarbellRowIcon,
  barbell_row: BarbellRowIcon,
  seated_row: SeatedRowIcon,
  tbar_row: TBarRowIcon,
  dumbbell_row: DumbbellRowIcon,
  pendlay_row: PendlayRowIcon,
  chest_supported_row: ChestSupportedRowIcon,
  machine_row: MachineRowIcon,
  inverted_row: InvertedRowIcon,
  // Lats
  pull_up: PullUpIcon,
  lat_pulldown: LatPulldownIcon,
  straight_arm_pulldown: StraightArmPulldownIcon,
  chin_up: ChinUpIcon,
  close_grip_lat_pulldown: CloseGripPulldownIcon,
  assisted_pull_up: AssistedPullUpIcon,
  // Traps
  shrugs: ShrugsIcon,
  face_pull: FacePullIcon,
  dumbbell_shrugs: DumbbellShrugsIcon,
  upright_row: UprightRowIcon,
  rack_pull: RackPullIcon,
};
