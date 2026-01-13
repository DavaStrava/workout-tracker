import React from 'react';
import { ExerciseIconGradientDefs, type ExerciseIconProps } from './ExerciseIconBase';

// ============ BICEPS EXERCISES ============

// Bicep Curl - standing dumbbell curl
export const BicepCurlIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="bicepCurl" />
    <g filter="url(#bicepCurlShadow)">
      {/* Person */}
      <circle cx="50" cy="22" r="6" fill="url(#bicepCurl)" />
      <line x1="50" y1="28" x2="50" y2="55" stroke="url(#bicepCurl)" strokeWidth="4" strokeLinecap="round" />
      {/* Curling arm (forearm up) */}
      <line x1="48" y1="35" x2="35" y2="40" stroke="url(#bicepCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="40" x2="38" y2="28" stroke="url(#bicepCurl)" strokeWidth="3" strokeLinecap="round" />
      {/* Other arm at rest */}
      <line x1="52" y1="35" x2="62" y2="55" stroke="url(#bicepCurl)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbells */}
      <rect x="32" y="22" width="12" height="5" rx="1" fill="url(#bicepCurlDark)" />
      <rect x="58" y="52" width="12" height="5" rx="1" fill="url(#bicepCurlDark)" />
      {/* Legs */}
      <line x1="50" y1="55" x2="42" y2="88" stroke="url(#bicepCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="58" y2="88" stroke="url(#bicepCurl)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Hammer Curl - neutral grip
export const HammerCurlIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="hammerCurl" />
    <g filter="url(#hammerCurlShadow)">
      {/* Person */}
      <circle cx="50" cy="22" r="6" fill="url(#hammerCurl)" />
      <line x1="50" y1="28" x2="50" y2="55" stroke="url(#hammerCurl)" strokeWidth="4" strokeLinecap="round" />
      {/* Both arms curling (hammer style - vertical dumbbells) */}
      <line x1="48" y1="35" x2="38" y2="40" stroke="url(#hammerCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="40" x2="38" y2="28" stroke="url(#hammerCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="35" x2="62" y2="40" stroke="url(#hammerCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="40" x2="62" y2="28" stroke="url(#hammerCurl)" strokeWidth="3" strokeLinecap="round" />
      {/* Vertical dumbbells (hammer grip) */}
      <rect x="35" y="18" width="6" height="12" rx="1" fill="url(#hammerCurlDark)" />
      <rect x="59" y="18" width="6" height="12" rx="1" fill="url(#hammerCurlDark)" />
      {/* Legs */}
      <line x1="50" y1="55" x2="42" y2="88" stroke="url(#hammerCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="58" y2="88" stroke="url(#hammerCurl)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Preacher Curl - arm on angled pad
export const PreacherCurlIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="preacherCurl" />
    <g filter="url(#preacherCurlShadow)">
      {/* Preacher pad (angled) */}
      <path d="M25 35 L55 55 L55 65 L25 45 Z" fill="rgba(255,255,255,0.2)" />
      {/* Person */}
      <circle cx="45" cy="28" r="6" fill="url(#preacherCurl)" />
      <line x1="45" y1="34" x2="48" y2="50" stroke="url(#preacherCurl)" strokeWidth="4" strokeLinecap="round" />
      {/* Arm on pad, curling */}
      <line x1="43" y1="38" x2="35" y2="50" stroke="url(#preacherCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="50" x2="30" y2="38" stroke="url(#preacherCurl)" strokeWidth="3" strokeLinecap="round" />
      {/* EZ bar */}
      <path d="M22 35 L28 38 L32 35 L38 38" stroke="url(#preacherCurlDark)" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Seat */}
      <rect x="45" y="65" width="25" height="5" rx="2" fill="rgba(255,255,255,0.2)" />
    </g>
  </svg>
);

// Barbell Curl
export const BarbellCurlIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="bbCurl" />
    <g filter="url(#bbCurlShadow)">
      {/* Person */}
      <circle cx="50" cy="22" r="6" fill="url(#bbCurl)" />
      <line x1="50" y1="28" x2="50" y2="55" stroke="url(#bbCurl)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms curling barbell */}
      <line x1="48" y1="35" x2="38" y2="40" stroke="url(#bbCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="40" x2="38" y2="30" stroke="url(#bbCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="35" x2="62" y2="40" stroke="url(#bbCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="40" x2="62" y2="30" stroke="url(#bbCurl)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell */}
      <rect x="22" y="26" width="56" height="4" rx="2" fill="url(#bbCurl)" />
      <rect x="15" y="22" width="10" height="12" rx="2" fill="url(#bbCurlDark)" />
      <rect x="75" y="22" width="10" height="12" rx="2" fill="url(#bbCurlDark)" />
      {/* Legs */}
      <line x1="50" y1="55" x2="42" y2="88" stroke="url(#bbCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="58" y2="88" stroke="url(#bbCurl)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Concentration Curl - seated, single arm
export const ConcentrationCurlIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="concCurl" />
    <g filter="url(#concCurlShadow)">
      {/* Person seated, leaning */}
      <circle cx="55" cy="28" r="6" fill="url(#concCurl)" />
      <line x1="52" y1="33" x2="45" y2="55" stroke="url(#concCurl)" strokeWidth="4" strokeLinecap="round" />
      {/* Arm braced on leg, curling */}
      <line x1="48" y1="42" x2="35" y2="55" stroke="url(#concCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="55" x2="32" y2="40" stroke="url(#concCurl)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbell */}
      <rect x="25" y="36" width="12" height="5" rx="1" fill="url(#concCurlDark)" />
      {/* Legs spread (seated) */}
      <line x1="45" y1="55" x2="28" y2="80" stroke="url(#concCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="55" x2="62" y2="80" stroke="url(#concCurl)" strokeWidth="3" strokeLinecap="round" />
      {/* Bench indication */}
      <rect x="38" y="58" width="35" height="4" rx="1" fill="rgba(255,255,255,0.2)" />
    </g>
  </svg>
);

// Cable Curl
export const CableCurlIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="cableCurl" />
    <g filter="url(#cableCurlShadow)">
      {/* Cable machine */}
      <rect x="5" y="25" width="15" height="55" rx="2" fill="rgba(255,255,255,0.15)" />
      {/* Cable */}
      <line x1="20" y1="70" x2="35" y2="45" stroke="url(#cableCurlDark)" strokeWidth="2" />
      {/* Person */}
      <circle cx="55" cy="28" r="6" fill="url(#cableCurl)" />
      <line x1="55" y1="34" x2="55" y2="60" stroke="url(#cableCurl)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms curling */}
      <line x1="53" y1="40" x2="42" y2="48" stroke="url(#cableCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="48" x2="35" y2="38" stroke="url(#cableCurl)" strokeWidth="3" strokeLinecap="round" />
      {/* Bar/handle */}
      <rect x="30" y="40" width="10" height="4" rx="1" fill="url(#cableCurlDark)" />
      {/* Legs */}
      <line x1="55" y1="60" x2="48" y2="88" stroke="url(#cableCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="60" x2="62" y2="88" stroke="url(#cableCurl)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Incline Curl - lying on incline bench
export const InclineCurlIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="inclineCurl" />
    <g filter="url(#inclineCurlShadow)">
      {/* Incline bench */}
      <path d="M30 80 L50 45 L60 45 L60 80 Z" fill="rgba(255,255,255,0.2)" />
      {/* Person on incline */}
      <ellipse cx="52" cy="55" rx="10" ry="5" transform="rotate(-40 52 55)" fill="url(#inclineCurl)" />
      <circle cx="44" cy="42" r="5" fill="url(#inclineCurl)" />
      {/* Arms hanging/curling */}
      <line x1="48" y1="52" x2="38" y2="72" stroke="url(#inclineCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="72" x2="35" y2="58" stroke="url(#inclineCurl)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbell */}
      <rect x="28" y="55" width="12" height="5" rx="1" fill="url(#inclineCurlDark)" />
    </g>
  </svg>
);

// ============ TRICEPS EXERCISES ============

// Tricep Dip
export const TricepDipIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="tricepDip" />
    <g filter="url(#tricepDipShadow)">
      {/* Dip bars */}
      <rect x="20" y="30" width="5" height="55" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect x="75" y="30" width="5" height="55" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect x="15" y="30" width="15" height="4" rx="1" fill="rgba(255,255,255,0.25)" />
      <rect x="70" y="30" width="15" height="4" rx="1" fill="rgba(255,255,255,0.25)" />
      {/* Person (body straight for triceps) */}
      <circle cx="50" cy="25" r="6" fill="url(#tricepDip)" />
      <line x1="50" y1="31" x2="50" y2="58" stroke="url(#tricepDip)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms on bars */}
      <line x1="48" y1="38" x2="28" y2="33" stroke="url(#tricepDip)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="38" x2="72" y2="33" stroke="url(#tricepDip)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs straight */}
      <line x1="50" y1="58" x2="50" y2="88" stroke="url(#tricepDip)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Tricep Pushdown
export const TricepPushdownIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="tricepPD" />
    <g filter="url(#tricepPDShadow)">
      {/* Cable machine */}
      <rect x="35" y="5" width="30" height="15" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Cable */}
      <line x1="50" y1="20" x2="50" y2="40" stroke="url(#tricepPDDark)" strokeWidth="2" />
      {/* Bar */}
      <rect x="38" y="38" width="24" height="4" rx="1" fill="url(#tricepPD)" />
      {/* Person */}
      <circle cx="50" cy="50" r="6" fill="url(#tricepPD)" />
      <line x1="50" y1="56" x2="50" y2="72" stroke="url(#tricepPD)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms pushing down */}
      <line x1="48" y1="55" x2="42" y2="42" stroke="url(#tricepPD)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="55" x2="58" y2="42" stroke="url(#tricepPD)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="50" y1="72" x2="42" y2="92" stroke="url(#tricepPD)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="72" x2="58" y2="92" stroke="url(#tricepPD)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Skull Crusher - lying EZ bar extension
export const SkullCrusherIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="skullCrusher" />
    <g filter="url(#skullCrusherShadow)">
      {/* Bench */}
      <rect x="20" y="55" width="60" height="5" rx="2" fill="rgba(255,255,255,0.25)" />
      {/* Person lying */}
      <ellipse cx="50" cy="50" rx="18" ry="5" fill="url(#skullCrusher)" />
      <circle cx="72" cy="50" r="5" fill="url(#skullCrusher)" />
      {/* Arms bent back (lowering to forehead) */}
      <line x1="42" y1="48" x2="35" y2="35" stroke="url(#skullCrusher)" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="48" x2="65" y2="35" stroke="url(#skullCrusher)" strokeWidth="3" strokeLinecap="round" />
      {/* Forearms bent toward head */}
      <line x1="35" y1="35" x2="45" y2="42" stroke="url(#skullCrusher)" strokeWidth="3" strokeLinecap="round" />
      <line x1="65" y1="35" x2="55" y2="42" stroke="url(#skullCrusher)" strokeWidth="3" strokeLinecap="round" />
      {/* EZ bar at forehead level */}
      <path d="M40 40 L45 43 L50 40 L55 43 L60 40" stroke="url(#skullCrusherDark)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

// Close Grip Bench Press
export const CloseGripBenchIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="cgBench" />
    <g filter="url(#cgBenchShadow)">
      {/* Bench */}
      <rect x="20" y="58" width="60" height="5" rx="2" fill="rgba(255,255,255,0.25)" />
      {/* Person */}
      <ellipse cx="50" cy="52" rx="18" ry="6" fill="url(#cgBench)" />
      <circle cx="70" cy="52" r="5" fill="url(#cgBench)" />
      {/* Arms close together */}
      <line x1="45" y1="50" x2="45" y2="28" stroke="url(#cgBench)" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="50" x2="55" y2="28" stroke="url(#cgBench)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell with close grip indicated */}
      <rect x="25" y="24" width="50" height="4" rx="2" fill="url(#cgBench)" />
      <rect x="18" y="20" width="10" height="12" rx="2" fill="url(#cgBenchDark)" />
      <rect x="72" y="20" width="10" height="12" rx="2" fill="url(#cgBenchDark)" />
      {/* Close grip markers */}
      <circle cx="45" cy="26" r="2" fill="url(#cgBenchDark)" />
      <circle cx="55" cy="26" r="2" fill="url(#cgBenchDark)" />
    </g>
  </svg>
);

// Overhead Tricep Extension
export const OverheadTricepExtensionIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="ohTricep" />
    <g filter="url(#ohTricepShadow)">
      {/* Person */}
      <circle cx="50" cy="38" r="6" fill="url(#ohTricep)" />
      <line x1="50" y1="44" x2="50" y2="68" stroke="url(#ohTricep)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms overhead, bent back */}
      <line x1="48" y1="46" x2="48" y2="18" stroke="url(#ohTricep)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="46" x2="52" y2="18" stroke="url(#ohTricep)" strokeWidth="3" strokeLinecap="round" />
      {/* Forearms bent behind head */}
      <line x1="48" y1="18" x2="42" y2="32" stroke="url(#ohTricep)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="18" x2="58" y2="32" stroke="url(#ohTricep)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbell behind head */}
      <rect x="38" y="28" width="24" height="6" rx="1" fill="url(#ohTricepDark)" />
      {/* Legs */}
      <line x1="50" y1="68" x2="42" y2="92" stroke="url(#ohTricep)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="68" x2="58" y2="92" stroke="url(#ohTricep)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Tricep Kickback
export const TricepKickbackIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="kickback" />
    <g filter="url(#kickbackShadow)">
      {/* Person bent over */}
      <circle cx="35" cy="32" r="6" fill="url(#kickback)" />
      <line x1="38" y1="37" x2="55" y2="52" stroke="url(#kickback)" strokeWidth="4" strokeLinecap="round" />
      {/* Supporting arm */}
      <line x1="42" y1="42" x2="30" y2="55" stroke="url(#kickback)" strokeWidth="3" strokeLinecap="round" />
      {/* Working arm - upper arm parallel, forearm extended back */}
      <line x1="48" y1="48" x2="60" y2="42" stroke="url(#kickback)" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="42" x2="80" y2="38" stroke="url(#kickback)" strokeWidth="3" strokeLinecap="round" />
      {/* Dumbbell */}
      <rect x="78" y="34" width="12" height="5" rx="1" fill="url(#kickbackDark)" />
      {/* Legs */}
      <line x1="55" y1="52" x2="48" y2="80" stroke="url(#kickback)" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="52" x2="68" y2="80" stroke="url(#kickback)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Diamond Push Up
export const DiamondPushUpIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="diamondPU" />
    <g filter="url(#diamondPUShadow)">
      {/* Floor */}
      <line x1="5" y1="78" x2="95" y2="78" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      {/* Head */}
      <circle cx="25" cy="42" r="6" fill="url(#diamondPU)" />
      {/* Body */}
      <line x1="29" y1="46" x2="78" y2="58" stroke="url(#diamondPU)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms close together (diamond) */}
      <line x1="38" y1="52" x2="42" y2="78" stroke="url(#diamondPU)" strokeWidth="3" strokeLinecap="round" />
      {/* Diamond hand position indicator */}
      <path d="M38 78 L45 72 L52 78" stroke="url(#diamondPUDark)" strokeWidth="2" fill="none" />
      {/* Legs */}
      <line x1="78" y1="58" x2="88" y2="68" stroke="url(#diamondPU)" strokeWidth="3" strokeLinecap="round" />
      <line x1="88" y1="68" x2="88" y2="78" stroke="url(#diamondPU)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Rope Pushdown
export const RopePushdownIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="ropePD" />
    <g filter="url(#ropePDShadow)">
      {/* Cable machine */}
      <rect x="35" y="5" width="30" height="15" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Cable */}
      <line x1="50" y1="20" x2="50" y2="35" stroke="url(#ropePDDark)" strokeWidth="2" />
      {/* Rope (V shape) */}
      <line x1="50" y1="35" x2="42" y2="50" stroke="url(#ropePD)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="35" x2="58" y2="50" stroke="url(#ropePD)" strokeWidth="3" strokeLinecap="round" />
      {/* Person */}
      <circle cx="50" cy="48" r="6" fill="url(#ropePD)" />
      <line x1="50" y1="54" x2="50" y2="70" stroke="url(#ropePD)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms on rope */}
      <line x1="48" y1="54" x2="42" y2="50" stroke="url(#ropePD)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="54" x2="58" y2="50" stroke="url(#ropePD)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="50" y1="70" x2="42" y2="90" stroke="url(#ropePD)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="70" x2="58" y2="90" stroke="url(#ropePD)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// ============ FOREARMS EXERCISES ============

// Wrist Curl
export const WristCurlIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="wristCurl" />
    <g filter="url(#wristCurlShadow)">
      {/* Bench/surface */}
      <rect x="15" y="45" width="70" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Forearm on bench */}
      <line x1="25" y1="42" x2="65" y2="42" stroke="url(#wristCurl)" strokeWidth="6" strokeLinecap="round" />
      {/* Wrist curling up */}
      <line x1="65" y1="42" x2="75" y2="32" stroke="url(#wristCurl)" strokeWidth="5" strokeLinecap="round" />
      {/* Barbell in hand */}
      <rect x="68" y="26" width="20" height="4" rx="1" fill="url(#wristCurlDark)" />
      {/* Hand indication */}
      <circle cx="72" cy="32" r="4" fill="url(#wristCurl)" opacity="0.6" />
    </g>
  </svg>
);

// Reverse Curl
export const ReverseCurlIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="revCurl" />
    <g filter="url(#revCurlShadow)">
      {/* Person */}
      <circle cx="50" cy="22" r="6" fill="url(#revCurl)" />
      <line x1="50" y1="28" x2="50" y2="55" stroke="url(#revCurl)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms curling (overhand grip indicated) */}
      <line x1="48" y1="35" x2="38" y2="42" stroke="url(#revCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="42" x2="38" y2="30" stroke="url(#revCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="35" x2="62" y2="42" stroke="url(#revCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="42" x2="62" y2="30" stroke="url(#revCurl)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell (overhand grip - hands on top) */}
      <rect x="25" y="28" width="50" height="3" rx="1" fill="url(#revCurl)" />
      <rect x="18" y="25" width="10" height="9" rx="1" fill="url(#revCurlDark)" />
      <rect x="72" y="25" width="10" height="9" rx="1" fill="url(#revCurlDark)" />
      {/* Grip indicators on top */}
      <circle cx="38" cy="28" r="2" fill="url(#revCurlDark)" />
      <circle cx="62" cy="28" r="2" fill="url(#revCurlDark)" />
      {/* Legs */}
      <line x1="50" y1="55" x2="42" y2="88" stroke="url(#revCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="58" y2="88" stroke="url(#revCurl)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Farmers Carry
export const FarmersCarryIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="farmersCarry" />
    <g filter="url(#farmersCarryShadow)">
      {/* Person walking */}
      <circle cx="50" cy="18" r="6" fill="url(#farmersCarry)" />
      <line x1="50" y1="24" x2="50" y2="52" stroke="url(#farmersCarry)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms down at sides holding weight */}
      <line x1="48" y1="30" x2="32" y2="55" stroke="url(#farmersCarry)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="30" x2="68" y2="55" stroke="url(#farmersCarry)" strokeWidth="3" strokeLinecap="round" />
      {/* Heavy dumbbells/handles */}
      <rect x="25" y="52" width="14" height="12" rx="2" fill="url(#farmersCarryDark)" />
      <rect x="61" y="52" width="14" height="12" rx="2" fill="url(#farmersCarryDark)" />
      {/* Walking legs */}
      <line x1="50" y1="52" x2="38" y2="82" stroke="url(#farmersCarry)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="52" x2="62" y2="75" stroke="url(#farmersCarry)" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="75" x2="58" y2="88" stroke="url(#farmersCarry)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Dead Hang
export const DeadHangIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="deadHang" />
    <g filter="url(#deadHangShadow)">
      {/* Bar */}
      <rect x="15" y="8" width="70" height="5" rx="2" fill="rgba(255,255,255,0.3)" />
      {/* Person hanging */}
      <circle cx="50" cy="28" r="6" fill="url(#deadHang)" />
      <line x1="50" y1="34" x2="50" y2="62" stroke="url(#deadHang)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms straight up */}
      <line x1="50" y1="35" x2="38" y2="12" stroke="url(#deadHang)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="35" x2="62" y2="12" stroke="url(#deadHang)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs hanging */}
      <line x1="50" y1="62" x2="44" y2="88" stroke="url(#deadHang)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="62" x2="56" y2="88" stroke="url(#deadHang)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Export mappings
export const armExerciseIcons: Record<string, React.FC<ExerciseIconProps>> = {
  // Biceps
  bicep_curl: BicepCurlIcon,
  hammer_curl: HammerCurlIcon,
  preacher_curl: PreacherCurlIcon,
  barbell_curl: BarbellCurlIcon,
  concentration_curl: ConcentrationCurlIcon,
  cable_curl: CableCurlIcon,
  incline_curl: InclineCurlIcon,
  // Triceps
  tricep_dip: TricepDipIcon,
  tricep_pushdown: TricepPushdownIcon,
  skull_crusher: SkullCrusherIcon,
  close_grip_bench: CloseGripBenchIcon,
  overhead_tricep_extension: OverheadTricepExtensionIcon,
  tricep_kickback: TricepKickbackIcon,
  diamond_push_up: DiamondPushUpIcon,
  rope_pushdown: RopePushdownIcon,
  // Forearms
  wrist_curl: WristCurlIcon,
  reverse_curl: ReverseCurlIcon,
  farmers_carry: FarmersCarryIcon,
  dead_hang: DeadHangIcon,
};
