import React from 'react';
import { ExerciseIconGradientDefs, type ExerciseIconProps } from './ExerciseIconBase';

// ============ QUADS EXERCISES ============

// Squat - barbell back squat
export const SquatIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="squat" />
    <g filter="url(#squatShadow)">
      {/* Person in squat position */}
      <circle cx="50" cy="25" r="6" fill="url(#squat)" />
      <line x1="50" y1="31" x2="50" y2="50" stroke="url(#squat)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms holding bar on back */}
      <line x1="48" y1="35" x2="30" y2="30" stroke="url(#squat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="35" x2="70" y2="30" stroke="url(#squat)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell on shoulders */}
      <rect x="15" y="26" width="70" height="4" rx="2" fill="url(#squat)" />
      <rect x="8" y="22" width="12" height="12" rx="2" fill="url(#squatDark)" />
      <rect x="80" y="22" width="12" height="12" rx="2" fill="url(#squatDark)" />
      {/* Legs bent (squat) */}
      <line x1="50" y1="50" x2="35" y2="65" stroke="url(#squat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="65" x2="38" y2="88" stroke="url(#squat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="50" x2="65" y2="65" stroke="url(#squat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="65" y1="65" x2="62" y2="88" stroke="url(#squat)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Leg Press
export const LegPressIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="legPress" />
    <g filter="url(#legPressShadow)">
      {/* Machine sled (angled) */}
      <rect x="50" y="20" width="40" height="30" rx="3" transform="rotate(35 70 35)" fill="rgba(255,255,255,0.2)" />
      {/* Person reclined */}
      <circle cx="25" cy="55" r="6" fill="url(#legPress)" />
      <line x1="28" y1="50" x2="38" y2="65" stroke="url(#legPress)" strokeWidth="4" strokeLinecap="round" />
      {/* Legs pushing sled */}
      <line x1="38" y1="62" x2="55" y2="45" stroke="url(#legPress)" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="68" x2="58" y2="52" stroke="url(#legPress)" strokeWidth="3" strokeLinecap="round" />
      {/* Foot platform */}
      <rect x="52" y="40" width="20" height="15" rx="2" fill="url(#legPressDark)" opacity="0.6" />
      {/* Seat */}
      <rect x="15" y="68" width="30" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
    </g>
  </svg>
);

// Leg Extension
export const LegExtensionIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="legExt" />
    <g filter="url(#legExtShadow)">
      {/* Machine */}
      <rect x="60" y="30" width="30" height="50" rx="3" fill="rgba(255,255,255,0.15)" />
      {/* Seat */}
      <rect x="25" y="55" width="35" height="6" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Person seated */}
      <circle cx="40" cy="42" r="6" fill="url(#legExt)" />
      <line x1="40" y1="48" x2="42" y2="55" stroke="url(#legExt)" strokeWidth="4" strokeLinecap="round" />
      {/* Leg extended */}
      <line x1="42" y1="55" x2="75" y2="48" stroke="url(#legExt)" strokeWidth="4" strokeLinecap="round" />
      {/* Ankle pad */}
      <rect x="72" y="45" width="10" height="8" rx="2" fill="url(#legExtDark)" />
      {/* Back support */}
      <rect x="25" y="35" width="6" height="25" rx="2" fill="rgba(255,255,255,0.2)" />
    </g>
  </svg>
);

// Lunges
export const LungeIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="lunge" />
    <g filter="url(#lungeShadow)">
      {/* Person in lunge position */}
      <circle cx="45" cy="22" r="6" fill="url(#lunge)" />
      <line x1="45" y1="28" x2="45" y2="50" stroke="url(#lunge)" strokeWidth="4" strokeLinecap="round" />
      {/* Front leg bent */}
      <line x1="45" y1="50" x2="30" y2="65" stroke="url(#lunge)" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="65" x2="28" y2="88" stroke="url(#lunge)" strokeWidth="3" strokeLinecap="round" />
      {/* Back leg extended */}
      <line x1="45" y1="50" x2="70" y2="58" stroke="url(#lunge)" strokeWidth="3" strokeLinecap="round" />
      <line x1="70" y1="58" x2="80" y2="85" stroke="url(#lunge)" strokeWidth="3" strokeLinecap="round" />
      {/* Arms with dumbbells */}
      <line x1="43" y1="35" x2="35" y2="55" stroke="url(#lunge)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="47" y1="35" x2="55" y2="55" stroke="url(#lunge)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Dumbbells */}
      <rect x="30" y="53" width="10" height="5" rx="1" fill="url(#lungeDark)" />
      <rect x="52" y="53" width="10" height="5" rx="1" fill="url(#lungeDark)" />
    </g>
  </svg>
);

// Front Squat
export const FrontSquatIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="frontSquat" />
    <g filter="url(#frontSquatShadow)">
      {/* Person */}
      <circle cx="50" cy="25" r="6" fill="url(#frontSquat)" />
      <line x1="50" y1="31" x2="50" y2="50" stroke="url(#frontSquat)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms crossed in front (front rack) */}
      <line x1="48" y1="38" x2="35" y2="35" stroke="url(#frontSquat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="38" x2="65" y2="35" stroke="url(#frontSquat)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell in front rack */}
      <rect x="20" y="32" width="60" height="4" rx="2" fill="url(#frontSquat)" />
      <rect x="12" y="28" width="12" height="12" rx="2" fill="url(#frontSquatDark)" />
      <rect x="76" y="28" width="12" height="12" rx="2" fill="url(#frontSquatDark)" />
      {/* Legs squatting */}
      <line x1="50" y1="50" x2="35" y2="65" stroke="url(#frontSquat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="65" x2="38" y2="88" stroke="url(#frontSquat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="50" x2="65" y2="65" stroke="url(#frontSquat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="65" y1="65" x2="62" y2="88" stroke="url(#frontSquat)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Bulgarian Split Squat
export const BulgarianSplitSquatIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="bulgarianSS" />
    <g filter="url(#bulgarianSSShadow)">
      {/* Bench behind */}
      <rect x="65" y="55" width="25" height="8" rx="2" fill="rgba(255,255,255,0.25)" />
      {/* Person */}
      <circle cx="40" cy="22" r="6" fill="url(#bulgarianSS)" />
      <line x1="40" y1="28" x2="40" y2="48" stroke="url(#bulgarianSS)" strokeWidth="4" strokeLinecap="round" />
      {/* Front leg bent deep */}
      <line x1="40" y1="48" x2="25" y2="65" stroke="url(#bulgarianSS)" strokeWidth="3" strokeLinecap="round" />
      <line x1="25" y1="65" x2="22" y2="88" stroke="url(#bulgarianSS)" strokeWidth="3" strokeLinecap="round" />
      {/* Back leg on bench */}
      <line x1="40" y1="48" x2="70" y2="55" stroke="url(#bulgarianSS)" strokeWidth="3" strokeLinecap="round" />
      {/* Arms */}
      <line x1="38" y1="35" x2="30" y2="52" stroke="url(#bulgarianSS)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="42" y1="35" x2="50" y2="52" stroke="url(#bulgarianSS)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Dumbbells */}
      <rect x="25" y="50" width="10" height="5" rx="1" fill="url(#bulgarianSSDark)" />
      <rect x="47" y="50" width="10" height="5" rx="1" fill="url(#bulgarianSSDark)" />
    </g>
  </svg>
);

// Hack Squat
export const HackSquatIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="hackSquat" />
    <g filter="url(#hackSquatShadow)">
      {/* Machine frame (angled) */}
      <path d="M20 85 L40 15 L55 15 L75 85 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      {/* Sled/back pad */}
      <rect x="35" y="35" width="15" height="25" rx="2" transform="rotate(-15 42 48)" fill="rgba(255,255,255,0.2)" />
      {/* Person */}
      <circle cx="48" cy="38" r="5" fill="url(#hackSquat)" />
      <line x1="46" y1="43" x2="44" y2="58" stroke="url(#hackSquat)" strokeWidth="4" strokeLinecap="round" />
      {/* Shoulders on pads */}
      <line x1="44" y1="45" x2="38" y2="40" stroke="url(#hackSquat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="45" x2="56" y2="40" stroke="url(#hackSquat)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs squatting */}
      <line x1="44" y1="58" x2="35" y2="72" stroke="url(#hackSquat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="72" x2="32" y2="88" stroke="url(#hackSquat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="58" x2="55" y2="72" stroke="url(#hackSquat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="72" x2="58" y2="88" stroke="url(#hackSquat)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Goblet Squat
export const GobletSquatIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="gobletSquat" />
    <g filter="url(#gobletSquatShadow)">
      {/* Person */}
      <circle cx="50" cy="22" r="6" fill="url(#gobletSquat)" />
      <line x1="50" y1="28" x2="50" y2="48" stroke="url(#gobletSquat)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms holding kettlebell/dumbbell at chest */}
      <line x1="48" y1="35" x2="42" y2="42" stroke="url(#gobletSquat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="35" x2="58" y2="42" stroke="url(#gobletSquat)" strokeWidth="3" strokeLinecap="round" />
      {/* Kettlebell/dumbbell at chest */}
      <ellipse cx="50" cy="42" rx="8" ry="6" fill="url(#gobletSquatDark)" />
      {/* Legs squatting */}
      <line x1="50" y1="48" x2="35" y2="65" stroke="url(#gobletSquat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="65" x2="32" y2="88" stroke="url(#gobletSquat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="48" x2="65" y2="65" stroke="url(#gobletSquat)" strokeWidth="3" strokeLinecap="round" />
      <line x1="65" y1="65" x2="68" y2="88" stroke="url(#gobletSquat)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Step Up
export const StepUpIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="stepUp" />
    <g filter="url(#stepUpShadow)">
      {/* Box/platform */}
      <rect x="40" y="55" width="35" height="25" rx="3" fill="rgba(255,255,255,0.25)" />
      {/* Person stepping up */}
      <circle cx="45" cy="25" r="6" fill="url(#stepUp)" />
      <line x1="45" y1="31" x2="45" y2="50" stroke="url(#stepUp)" strokeWidth="4" strokeLinecap="round" />
      {/* Leg on box */}
      <line x1="45" y1="50" x2="55" y2="55" stroke="url(#stepUp)" strokeWidth="3" strokeLinecap="round" />
      {/* Back leg hanging */}
      <line x1="45" y1="50" x2="32" y2="72" stroke="url(#stepUp)" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="72" x2="28" y2="88" stroke="url(#stepUp)" strokeWidth="3" strokeLinecap="round" />
      {/* Arms with dumbbells */}
      <line x1="43" y1="38" x2="32" y2="55" stroke="url(#stepUp)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="47" y1="38" x2="58" y2="55" stroke="url(#stepUp)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Dumbbells */}
      <rect x="26" y="53" width="10" height="5" rx="1" fill="url(#stepUpDark)" />
    </g>
  </svg>
);

// ============ HAMSTRINGS EXERCISES ============

// Romanian Deadlift
export const RomanianDeadliftIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="rdl" />
    <g filter="url(#rdlShadow)">
      {/* Person hinging */}
      <circle cx="55" cy="28" r="6" fill="url(#rdl)" />
      <line x1="52" y1="33" x2="40" y2="52" stroke="url(#rdl)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms straight down */}
      <line x1="45" y1="42" x2="40" y2="68" stroke="url(#rdl)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs slightly bent */}
      <line x1="40" y1="52" x2="35" y2="80" stroke="url(#rdl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="52" x2="50" y2="80" stroke="url(#rdl)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell */}
      <rect x="20" y="68" width="50" height="4" rx="2" fill="url(#rdl)" />
      <rect x="12" y="64" width="12" height="12" rx="2" fill="url(#rdlDark)" />
      <rect x="66" y="64" width="12" height="12" rx="2" fill="url(#rdlDark)" />
    </g>
  </svg>
);

// Leg Curl (lying)
export const LegCurlIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="legCurl" />
    <g filter="url(#legCurlShadow)">
      {/* Machine bench */}
      <rect x="15" y="50" width="70" height="8" rx="3" fill="rgba(255,255,255,0.2)" />
      {/* Person lying face down */}
      <circle cx="25" cy="45" r="5" fill="url(#legCurl)" />
      <line x1="28" y1="48" x2="65" y2="48" stroke="url(#legCurl)" strokeWidth="5" strokeLinecap="round" />
      {/* Legs curling up */}
      <line x1="65" y1="48" x2="75" y2="45" stroke="url(#legCurl)" strokeWidth="4" strokeLinecap="round" />
      <line x1="75" y1="45" x2="70" y2="28" stroke="url(#legCurl)" strokeWidth="4" strokeLinecap="round" />
      {/* Ankle pad */}
      <rect x="65" y="24" width="12" height="6" rx="2" fill="url(#legCurlDark)" />
    </g>
  </svg>
);

// Nordic Curl
export const NordicCurlIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="nordicCurl" />
    <g filter="url(#nordicCurlShadow)">
      {/* Anchor point */}
      <rect x="70" y="70" width="20" height="15" rx="3" fill="rgba(255,255,255,0.25)" />
      {/* Person lowering forward from knees */}
      <circle cx="35" cy="35" r="6" fill="url(#nordicCurl)" />
      <line x1="38" y1="40" x2="55" y2="55" stroke="url(#nordicCurl)" strokeWidth="4" strokeLinecap="round" />
      {/* Legs anchored */}
      <line x1="55" y1="55" x2="70" y2="70" stroke="url(#nordicCurl)" strokeWidth="3" strokeLinecap="round" />
      <line x1="70" y1="70" x2="75" y2="78" stroke="url(#nordicCurl)" strokeWidth="3" strokeLinecap="round" />
      {/* Arms ready to catch */}
      <line x1="35" y1="42" x2="22" y2="58" stroke="url(#nordicCurl)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Seated Leg Curl
export const SeatedLegCurlIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="seatedLC" />
    <g filter="url(#seatedLCShadow)">
      {/* Machine */}
      <rect x="55" y="25" width="35" height="55" rx="3" fill="rgba(255,255,255,0.15)" />
      {/* Seat */}
      <rect x="20" y="55" width="40" height="6" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Person seated */}
      <circle cx="35" cy="42" r="6" fill="url(#seatedLC)" />
      <line x1="35" y1="48" x2="38" y2="55" stroke="url(#seatedLC)" strokeWidth="4" strokeLinecap="round" />
      {/* Thigh on seat, lower leg curled under */}
      <line x1="38" y1="55" x2="58" y2="58" stroke="url(#seatedLC)" strokeWidth="4" strokeLinecap="round" />
      <line x1="58" y1="58" x2="50" y2="75" stroke="url(#seatedLC)" strokeWidth="3" strokeLinecap="round" />
      {/* Ankle pad */}
      <rect x="45" y="72" width="10" height="6" rx="2" fill="url(#seatedLCDark)" />
    </g>
  </svg>
);

// ============ GLUTES EXERCISES ============

// Hip Thrust
export const HipThrustIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="hipThrust" />
    <g filter="url(#hipThrustShadow)">
      {/* Bench */}
      <rect x="10" y="45" width="30" height="15" rx="3" fill="rgba(255,255,255,0.25)" />
      {/* Person - back on bench, hips thrust up */}
      <circle cx="25" cy="40" r="5" fill="url(#hipThrust)" />
      <line x1="28" y1="42" x2="55" y2="35" stroke="url(#hipThrust)" strokeWidth="4" strokeLinecap="round" />
      {/* Legs bent, feet on floor */}
      <line x1="55" y1="35" x2="70" y2="55" stroke="url(#hipThrust)" strokeWidth="3" strokeLinecap="round" />
      <line x1="70" y1="55" x2="72" y2="75" stroke="url(#hipThrust)" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="35" x2="62" y2="55" stroke="url(#hipThrust)" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="55" x2="60" y2="75" stroke="url(#hipThrust)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell on hips */}
      <rect x="40" y="32" width="35" height="4" rx="2" fill="url(#hipThrust)" />
      <rect x="72" y="28" width="10" height="12" rx="2" fill="url(#hipThrustDark)" />
    </g>
  </svg>
);

// Glute Bridge
export const GluteBridgeIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="gluteBridge" />
    <g filter="url(#gluteBridgeShadow)">
      {/* Floor */}
      <line x1="5" y1="75" x2="95" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      {/* Person on floor, hips raised */}
      <circle cx="20" cy="65" r="5" fill="url(#gluteBridge)" />
      <line x1="25" y1="65" x2="55" y2="45" stroke="url(#gluteBridge)" strokeWidth="4" strokeLinecap="round" />
      {/* Legs bent */}
      <line x1="55" y1="45" x2="70" y2="60" stroke="url(#gluteBridge)" strokeWidth="3" strokeLinecap="round" />
      <line x1="70" y1="60" x2="75" y2="75" stroke="url(#gluteBridge)" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="45" x2="62" y2="60" stroke="url(#gluteBridge)" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="60" x2="62" y2="75" stroke="url(#gluteBridge)" strokeWidth="3" strokeLinecap="round" />
      {/* Arms on floor */}
      <line x1="22" y1="68" x2="15" y2="75" stroke="url(#gluteBridge)" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
);

// Cable Kickback
export const CableKickbackIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="cableKick" />
    <g filter="url(#cableKickShadow)">
      {/* Cable machine */}
      <rect x="5" y="50" width="15" height="35" rx="2" fill="rgba(255,255,255,0.15)" />
      {/* Cable */}
      <line x1="20" y1="78" x2="45" y2="65" stroke="url(#cableKickDark)" strokeWidth="2" />
      {/* Person bent forward */}
      <circle cx="55" cy="35" r="6" fill="url(#cableKick)" />
      <line x1="55" y1="41" x2="55" y2="58" stroke="url(#cableKick)" strokeWidth="4" strokeLinecap="round" />
      {/* Supporting leg */}
      <line x1="55" y1="58" x2="48" y2="85" stroke="url(#cableKick)" strokeWidth="3" strokeLinecap="round" />
      {/* Kicking leg back */}
      <line x1="55" y1="58" x2="45" y2="65" stroke="url(#cableKick)" strokeWidth="3" strokeLinecap="round" />
      {/* Ankle strap */}
      <circle cx="45" cy="65" r="4" stroke="url(#cableKickDark)" strokeWidth="2" fill="none" />
      {/* Arms on machine */}
      <line x1="53" y1="45" x2="40" y2="48" stroke="url(#cableKick)" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
);

// Sumo Deadlift
export const SumoDeadliftIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="sumo" />
    <g filter="url(#sumoShadow)">
      {/* Person in wide stance */}
      <circle cx="50" cy="25" r="6" fill="url(#sumo)" />
      <line x1="50" y1="31" x2="50" y2="48" stroke="url(#sumo)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms down narrow grip */}
      <line x1="48" y1="38" x2="45" y2="62" stroke="url(#sumo)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="38" x2="55" y2="62" stroke="url(#sumo)" strokeWidth="3" strokeLinecap="round" />
      {/* Wide stance legs */}
      <line x1="50" y1="48" x2="25" y2="70" stroke="url(#sumo)" strokeWidth="3" strokeLinecap="round" />
      <line x1="25" y1="70" x2="22" y2="88" stroke="url(#sumo)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="48" x2="75" y2="70" stroke="url(#sumo)" strokeWidth="3" strokeLinecap="round" />
      <line x1="75" y1="70" x2="78" y2="88" stroke="url(#sumo)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell */}
      <rect x="30" y="64" width="40" height="4" rx="2" fill="url(#sumo)" />
      <rect x="22" y="60" width="12" height="12" rx="2" fill="url(#sumoDark)" />
      <rect x="66" y="60" width="12" height="12" rx="2" fill="url(#sumoDark)" />
    </g>
  </svg>
);

// ============ CALVES EXERCISES ============

// Standing Calf Raise
export const CalfRaiseIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="calfRaise" />
    <g filter="url(#calfRaiseShadow)">
      {/* Platform/step */}
      <rect x="30" y="75" width="40" height="10" rx="2" fill="rgba(255,255,255,0.25)" />
      {/* Person standing on toes */}
      <circle cx="50" cy="22" r="6" fill="url(#calfRaise)" />
      <line x1="50" y1="28" x2="50" y2="55" stroke="url(#calfRaise)" strokeWidth="4" strokeLinecap="round" />
      {/* Legs straight, on toes */}
      <line x1="50" y1="55" x2="45" y2="72" stroke="url(#calfRaise)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="72" x2="45" y2="75" stroke="url(#calfRaise)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="55" y2="72" stroke="url(#calfRaise)" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="72" x2="55" y2="75" stroke="url(#calfRaise)" strokeWidth="3" strokeLinecap="round" />
      {/* Machine shoulder pads */}
      <rect x="35" y="25" width="10" height="5" rx="1" fill="url(#calfRaiseDark)" />
      <rect x="55" y="25" width="10" height="5" rx="1" fill="url(#calfRaiseDark)" />
    </g>
  </svg>
);

// Seated Calf Raise
export const SeatedCalfRaiseIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="seatedCalf" />
    <g filter="url(#seatedCalfShadow)">
      {/* Machine */}
      <rect x="55" y="20" width="35" height="60" rx="3" fill="rgba(255,255,255,0.15)" />
      {/* Seat */}
      <rect x="20" y="45" width="40" height="6" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Person seated */}
      <circle cx="35" cy="35" r="6" fill="url(#seatedCalf)" />
      <line x1="35" y1="41" x2="38" y2="45" stroke="url(#seatedCalf)" strokeWidth="4" strokeLinecap="round" />
      {/* Knees under pad */}
      <rect x="38" y="48" width="25" height="5" rx="1" fill="url(#seatedCalfDark)" />
      {/* Lower legs, feet on platform */}
      <line x1="45" y1="53" x2="45" y2="70" stroke="url(#seatedCalf)" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="53" x2="55" y2="70" stroke="url(#seatedCalf)" strokeWidth="3" strokeLinecap="round" />
      {/* Foot platform */}
      <rect x="35" y="70" width="30" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Toes raised */}
      <line x1="45" y1="70" x2="45" y2="68" stroke="url(#seatedCalf)" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="70" x2="55" y2="68" stroke="url(#seatedCalf)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Export mappings
export const legExerciseIcons: Record<string, React.FC<ExerciseIconProps>> = {
  // Quads
  squat: SquatIcon,
  leg_press: LegPressIcon,
  leg_extension: LegExtensionIcon,
  lunge: LungeIcon,
  front_squat: FrontSquatIcon,
  bulgarian_split_squat: BulgarianSplitSquatIcon,
  hack_squat: HackSquatIcon,
  goblet_squat: GobletSquatIcon,
  step_up: StepUpIcon,
  // Hamstrings
  romanian_deadlift: RomanianDeadliftIcon,
  leg_curl: LegCurlIcon,
  nordic_curl: NordicCurlIcon,
  seated_leg_curl: SeatedLegCurlIcon,
  // Glutes
  hip_thrust: HipThrustIcon,
  glute_bridge: GluteBridgeIcon,
  cable_kickback: CableKickbackIcon,
  sumo_deadlift: SumoDeadliftIcon,
  // Calves
  calf_raise: CalfRaiseIcon,
  seated_calf_raise: SeatedCalfRaiseIcon,
};
