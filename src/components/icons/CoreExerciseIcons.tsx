import React from 'react';
import { ExerciseIconGradientDefs, type ExerciseIconProps } from './ExerciseIconBase';

// ============ ABS EXERCISES ============

// Crunch
export const CrunchIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="crunch" />
    <g filter="url(#crunchShadow)">
      {/* Floor */}
      <line x1="5" y1="75" x2="95" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      {/* Person crunching */}
      <circle cx="35" cy="48" r="6" fill="url(#crunch)" />
      <line x1="38" y1="52" x2="55" y2="65" stroke="url(#crunch)" strokeWidth="4" strokeLinecap="round" />
      {/* Legs bent */}
      <line x1="55" y1="65" x2="72" y2="60" stroke="url(#crunch)" strokeWidth="3" strokeLinecap="round" />
      <line x1="72" y1="60" x2="78" y2="75" stroke="url(#crunch)" strokeWidth="3" strokeLinecap="round" />
      {/* Arms behind head */}
      <line x1="33" y1="45" x2="28" y2="38" stroke="url(#crunch)" strokeWidth="3" strokeLinecap="round" />
      <line x1="37" y1="45" x2="42" y2="38" stroke="url(#crunch)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Leg Raise
export const LegRaiseIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="legRaise" />
    <g filter="url(#legRaiseShadow)">
      {/* Floor/bench */}
      <line x1="10" y1="65" x2="70" y2="65" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
      {/* Person lying, legs raised */}
      <circle cx="25" cy="60" r="5" fill="url(#legRaise)" />
      <line x1="28" y1="62" x2="50" y2="62" stroke="url(#legRaise)" strokeWidth="4" strokeLinecap="round" />
      {/* Legs raised up */}
      <line x1="50" y1="62" x2="55" y2="25" stroke="url(#legRaise)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms by sides */}
      <line x1="28" y1="60" x2="20" y2="65" stroke="url(#legRaise)" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
);

// Plank
export const PlankIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="plank" />
    <g filter="url(#plankShadow)">
      {/* Floor */}
      <line x1="5" y1="70" x2="95" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      {/* Person in plank */}
      <circle cx="20" cy="45" r="6" fill="url(#plank)" />
      {/* Body straight */}
      <line x1="24" y1="49" x2="80" y2="55" stroke="url(#plank)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms (forearms on ground) */}
      <line x1="24" y1="52" x2="28" y2="70" stroke="url(#plank)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="80" y1="55" x2="88" y2="65" stroke="url(#plank)" strokeWidth="3" strokeLinecap="round" />
      <line x1="88" y1="65" x2="88" y2="70" stroke="url(#plank)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Hanging Leg Raise
export const HangingLegRaiseIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="hangLegRaise" />
    <g filter="url(#hangLegRaiseShadow)">
      {/* Bar */}
      <rect x="25" y="8" width="50" height="5" rx="2" fill="rgba(255,255,255,0.3)" />
      {/* Person hanging */}
      <circle cx="50" cy="25" r="6" fill="url(#hangLegRaise)" />
      <line x1="50" y1="31" x2="50" y2="50" stroke="url(#hangLegRaise)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms up */}
      <line x1="48" y1="32" x2="40" y2="12" stroke="url(#hangLegRaise)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="32" x2="60" y2="12" stroke="url(#hangLegRaise)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs raised to horizontal */}
      <line x1="50" y1="50" x2="35" y2="55" stroke="url(#hangLegRaise)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="50" x2="65" y2="55" stroke="url(#hangLegRaise)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Cable Crunch
export const CableCrunchIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="cableCrunch" />
    <g filter="url(#cableCrunchShadow)">
      {/* Cable machine */}
      <rect x="35" y="5" width="30" height="15" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Cable */}
      <line x1="50" y1="20" x2="50" y2="35" stroke="url(#cableCrunchDark)" strokeWidth="2" />
      {/* Rope */}
      <path d="M42 35 L50 42 L58 35" stroke="url(#cableCrunch)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Person kneeling, crunching */}
      <circle cx="50" cy="50" r="6" fill="url(#cableCrunch)" />
      <line x1="50" y1="56" x2="50" y2="72" stroke="url(#cableCrunch)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms pulling rope behind head */}
      <line x1="48" y1="52" x2="44" y2="40" stroke="url(#cableCrunch)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="52" x2="56" y2="40" stroke="url(#cableCrunch)" strokeWidth="3" strokeLinecap="round" />
      {/* Knees on ground */}
      <line x1="50" y1="72" x2="45" y2="85" stroke="url(#cableCrunch)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="72" x2="55" y2="85" stroke="url(#cableCrunch)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Ab Wheel Rollout
export const AbWheelIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="abWheel" />
    <g filter="url(#abWheelShadow)">
      {/* Floor */}
      <line x1="5" y1="75" x2="95" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      {/* Person extended */}
      <circle cx="70" cy="48" r="6" fill="url(#abWheel)" />
      <line x1="67" y1="52" x2="40" y2="62" stroke="url(#abWheel)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms extended to wheel */}
      <line x1="45" y1="60" x2="20" y2="68" stroke="url(#abWheel)" strokeWidth="3" strokeLinecap="round" />
      {/* Ab wheel */}
      <circle cx="18" cy="70" r="8" stroke="url(#abWheelDark)" strokeWidth="3" fill="none" />
      <circle cx="18" cy="70" r="2" fill="url(#abWheel)" />
      {/* Knees on ground */}
      <line x1="40" y1="62" x2="45" y2="75" stroke="url(#abWheel)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Dead Bug
export const DeadBugIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="deadBug" />
    <g filter="url(#deadBugShadow)">
      {/* Floor */}
      <line x1="5" y1="75" x2="95" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      {/* Person on back */}
      <circle cx="50" cy="68" r="5" fill="url(#deadBug)" />
      <line x1="50" y1="63" x2="50" y2="45" stroke="url(#deadBug)" strokeWidth="4" strokeLinecap="round" />
      {/* Opposite arm and leg extended */}
      <line x1="48" y1="55" x2="25" y2="45" stroke="url(#deadBug)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="55" x2="60" y2="35" stroke="url(#deadBug)" strokeWidth="3" strokeLinecap="round" />
      {/* Other arm and leg bent */}
      <line x1="50" y1="45" x2="35" y2="35" stroke="url(#deadBug)" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="35" x2="42" y2="28" stroke="url(#deadBug)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="45" x2="70" y2="50" stroke="url(#deadBug)" strokeWidth="3" strokeLinecap="round" />
      <line x1="70" y1="50" x2="75" y2="35" stroke="url(#deadBug)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// V-Up
export const VUpIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="vUp" />
    <g filter="url(#vUpShadow)">
      {/* Person in V position */}
      <circle cx="50" cy="45" r="6" fill="url(#vUp)" />
      {/* Body angled up */}
      <line x1="50" y1="51" x2="50" y2="62" stroke="url(#vUp)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms reaching to toes */}
      <line x1="48" y1="48" x2="35" y2="35" stroke="url(#vUp)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="48" x2="65" y2="35" stroke="url(#vUp)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs raised to meet hands */}
      <line x1="50" y1="62" x2="35" y2="35" stroke="url(#vUp)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="62" x2="65" y2="35" stroke="url(#vUp)" strokeWidth="3" strokeLinecap="round" />
      {/* Floor reference */}
      <line x1="20" y1="80" x2="80" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
    </g>
  </svg>
);

// ============ OBLIQUES EXERCISES ============

// Russian Twist
export const RussianTwistIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="russianTwist" />
    <g filter="url(#russianTwistShadow)">
      {/* Person seated, leaning back */}
      <circle cx="50" cy="35" r="6" fill="url(#russianTwist)" />
      <line x1="50" y1="41" x2="50" y2="58" stroke="url(#russianTwist)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms holding weight, twisted to side */}
      <line x1="48" y1="48" x2="28" y2="45" stroke="url(#russianTwist)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="48" x2="32" y2="45" stroke="url(#russianTwist)" strokeWidth="3" strokeLinecap="round" />
      {/* Weight/medicine ball */}
      <circle cx="28" cy="45" r="5" fill="url(#russianTwistDark)" />
      {/* Legs raised, bent */}
      <line x1="50" y1="58" x2="60" y2="72" stroke="url(#russianTwist)" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="72" x2="55" y2="85" stroke="url(#russianTwist)" strokeWidth="3" strokeLinecap="round" />
      {/* Floor */}
      <line x1="35" y1="88" x2="75" y2="88" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
    </g>
  </svg>
);

// Side Plank
export const SidePlankIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="sidePlank" />
    <g filter="url(#sidePlankShadow)">
      {/* Floor */}
      <line x1="5" y1="80" x2="95" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      {/* Person in side plank (from front view) */}
      <circle cx="50" cy="30" r="6" fill="url(#sidePlank)" />
      <line x1="50" y1="36" x2="50" y2="60" stroke="url(#sidePlank)" strokeWidth="4" strokeLinecap="round" />
      {/* Supporting arm down */}
      <line x1="48" y1="42" x2="35" y2="75" stroke="url(#sidePlank)" strokeWidth="3" strokeLinecap="round" />
      {/* Top arm raised */}
      <line x1="52" y1="42" x2="65" y2="20" stroke="url(#sidePlank)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs stacked */}
      <line x1="50" y1="60" x2="45" y2="80" stroke="url(#sidePlank)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Cable Woodchop
export const WoodchopIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="woodchop" />
    <g filter="url(#woodchopShadow)">
      {/* Cable machine (high) */}
      <rect x="5" y="10" width="15" height="30" rx="2" fill="rgba(255,255,255,0.15)" />
      {/* Cable */}
      <line x1="20" y1="20" x2="40" y2="40" stroke="url(#woodchopDark)" strokeWidth="2" />
      {/* Person */}
      <circle cx="55" cy="35" r="6" fill="url(#woodchop)" />
      <line x1="55" y1="41" x2="55" y2="62" stroke="url(#woodchop)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms pulling diagonally down */}
      <line x1="53" y1="45" x2="40" y2="40" stroke="url(#woodchop)" strokeWidth="3" strokeLinecap="round" />
      <line x1="57" y1="45" x2="42" y2="42" stroke="url(#woodchop)" strokeWidth="3" strokeLinecap="round" />
      {/* Handle */}
      <circle cx="40" cy="40" r="3" fill="url(#woodchopDark)" />
      {/* Legs in athletic stance */}
      <line x1="55" y1="62" x2="45" y2="85" stroke="url(#woodchop)" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="62" x2="65" y2="85" stroke="url(#woodchop)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Bicycle Crunch
export const BicycleCrunchIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="bicycleCrunch" />
    <g filter="url(#bicycleCrunchShadow)">
      {/* Floor */}
      <line x1="5" y1="75" x2="95" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      {/* Person on back, crunching/twisting */}
      <circle cx="40" cy="50" r="6" fill="url(#bicycleCrunch)" />
      <line x1="43" y1="54" x2="55" y2="65" stroke="url(#bicycleCrunch)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms behind head */}
      <line x1="38" y1="47" x2="32" y2="40" stroke="url(#bicycleCrunch)" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="47" x2="48" y2="40" stroke="url(#bicycleCrunch)" strokeWidth="3" strokeLinecap="round" />
      {/* One leg bent toward chest (elbow to knee) */}
      <line x1="55" y1="65" x2="45" y2="55" stroke="url(#bicycleCrunch)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="55" x2="48" y2="45" stroke="url(#bicycleCrunch)" strokeWidth="3" strokeLinecap="round" />
      {/* Other leg extended */}
      <line x1="55" y1="65" x2="78" y2="60" stroke="url(#bicycleCrunch)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Pallof Press
export const PallofPressIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="pallofPress" />
    <g filter="url(#pallofPressShadow)">
      {/* Cable machine */}
      <rect x="5" y="30" width="12" height="40" rx="2" fill="rgba(255,255,255,0.15)" />
      {/* Cable */}
      <line x1="17" y1="50" x2="45" y2="50" stroke="url(#pallofPressDark)" strokeWidth="2" />
      {/* Person standing sideways to cable */}
      <circle cx="60" cy="32" r="6" fill="url(#pallofPress)" />
      <line x1="60" y1="38" x2="60" y2="62" stroke="url(#pallofPress)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms pressing forward */}
      <line x1="58" y1="45" x2="45" y2="50" stroke="url(#pallofPress)" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="45" x2="48" y2="50" stroke="url(#pallofPress)" strokeWidth="3" strokeLinecap="round" />
      {/* Handle */}
      <rect x="42" y="47" width="8" height="6" rx="1" fill="url(#pallofPressDark)" />
      {/* Legs */}
      <line x1="60" y1="62" x2="55" y2="88" stroke="url(#pallofPress)" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="62" x2="68" y2="88" stroke="url(#pallofPress)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// ============ LOWER BACK EXERCISES ============

// Deadlift
export const DeadliftIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="deadlift" />
    <g filter="url(#deadliftShadow)">
      {/* Person lifting */}
      <circle cx="50" cy="22" r="6" fill="url(#deadlift)" />
      <line x1="50" y1="28" x2="50" y2="50" stroke="url(#deadlift)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms down holding bar */}
      <line x1="48" y1="35" x2="38" y2="58" stroke="url(#deadlift)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="35" x2="62" y2="58" stroke="url(#deadlift)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs slightly bent */}
      <line x1="50" y1="50" x2="38" y2="78" stroke="url(#deadlift)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="50" x2="62" y2="78" stroke="url(#deadlift)" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell */}
      <rect x="22" y="60" width="56" height="4" rx="2" fill="url(#deadlift)" />
      <rect x="14" y="56" width="12" height="12" rx="2" fill="url(#deadliftDark)" />
      <rect x="74" y="56" width="12" height="12" rx="2" fill="url(#deadliftDark)" />
    </g>
  </svg>
);

// Back Extension
export const BackExtensionIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="backExt" />
    <g filter="url(#backExtShadow)">
      {/* Hyperextension bench */}
      <rect x="30" y="50" width="45" height="8" rx="2" transform="rotate(-25 52 54)" fill="rgba(255,255,255,0.2)" />
      {/* Support */}
      <rect x="68" y="55" width="8" height="30" rx="2" fill="rgba(255,255,255,0.15)" />
      {/* Person extending back */}
      <circle cx="32" cy="42" r="6" fill="url(#backExt)" />
      <line x1="35" y1="46" x2="58" y2="58" stroke="url(#backExt)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms crossed or behind head */}
      <line x1="33" y1="48" x2="38" y2="38" stroke="url(#backExt)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs anchored */}
      <line x1="58" y1="58" x2="75" y2="65" stroke="url(#backExt)" strokeWidth="3" strokeLinecap="round" />
      <line x1="75" y1="65" x2="78" y2="78" stroke="url(#backExt)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Good Morning
export const GoodMorningIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="goodMorning" />
    <g filter="url(#goodMorningShadow)">
      {/* Person hinging with bar on back */}
      <circle cx="60" cy="32" r="6" fill="url(#goodMorning)" />
      <line x1="57" y1="37" x2="42" y2="55" stroke="url(#goodMorning)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms holding bar on back */}
      <line x1="55" y1="40" x2="45" y2="35" stroke="url(#goodMorning)" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="38" x2="72" y2="33" stroke="url(#goodMorning)" strokeWidth="3" strokeLinecap="round" />
      {/* Bar on back */}
      <rect x="32" y="30" width="50" height="4" rx="2" fill="url(#goodMorning)" />
      <rect x="25" y="26" width="10" height="12" rx="2" fill="url(#goodMorningDark)" />
      <rect x="78" y="26" width="10" height="12" rx="2" fill="url(#goodMorningDark)" />
      {/* Legs straight */}
      <line x1="42" y1="55" x2="35" y2="85" stroke="url(#goodMorning)" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="55" x2="52" y2="85" stroke="url(#goodMorning)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Superman
export const SupermanIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="superman" />
    <g filter="url(#supermanShadow)">
      {/* Floor */}
      <line x1="5" y1="65" x2="95" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      {/* Person lying face down, arms and legs raised */}
      <circle cx="50" cy="55" r="5" fill="url(#superman)" />
      <line x1="45" y1="58" x2="65" y2="60" stroke="url(#superman)" strokeWidth="4" strokeLinecap="round" />
      {/* Arms extended forward, raised */}
      <line x1="45" y1="55" x2="20" y2="45" stroke="url(#superman)" strokeWidth="3" strokeLinecap="round" />
      {/* Legs extended back, raised */}
      <line x1="65" y1="60" x2="85" y2="50" stroke="url(#superman)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Bird Dog
export const BirdDogIcon: React.FC<ExerciseIconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ExerciseIconGradientDefs id="birdDog" />
    <g filter="url(#birdDogShadow)">
      {/* Floor */}
      <line x1="5" y1="75" x2="95" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      {/* Person on all fours */}
      <circle cx="50" cy="48" r="5" fill="url(#birdDog)" />
      <line x1="48" y1="52" x2="58" y2="58" stroke="url(#birdDog)" strokeWidth="4" strokeLinecap="round" />
      {/* Supporting arm */}
      <line x1="46" y1="55" x2="38" y2="75" stroke="url(#birdDog)" strokeWidth="3" strokeLinecap="round" />
      {/* Extended arm (opposite) */}
      <line x1="52" y1="50" x2="25" y2="40" stroke="url(#birdDog)" strokeWidth="3" strokeLinecap="round" />
      {/* Supporting leg */}
      <line x1="58" y1="58" x2="65" y2="75" stroke="url(#birdDog)" strokeWidth="3" strokeLinecap="round" />
      {/* Extended leg (opposite) */}
      <line x1="58" y1="58" x2="85" y2="52" stroke="url(#birdDog)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// Export mappings
export const coreExerciseIcons: Record<string, React.FC<ExerciseIconProps>> = {
  // Abs
  crunch: CrunchIcon,
  leg_raise: LegRaiseIcon,
  plank: PlankIcon,
  hanging_leg_raise: HangingLegRaiseIcon,
  cable_crunch: CableCrunchIcon,
  ab_wheel: AbWheelIcon,
  dead_bug: DeadBugIcon,
  v_up: VUpIcon,
  // Obliques
  russian_twist: RussianTwistIcon,
  side_plank: SidePlankIcon,
  woodchop: WoodchopIcon,
  bicycle_crunch: BicycleCrunchIcon,
  pallof_press: PallofPressIcon,
  // Lower Back
  deadlift: DeadliftIcon,
  back_extension: BackExtensionIcon,
  good_morning: GoodMorningIcon,
  superman: SupermanIcon,
  bird_dog: BirdDogIcon,
};
