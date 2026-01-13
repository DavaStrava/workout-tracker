import React from 'react';

interface MuscleIconProps {
  size?: number;
}

// Shared gradient definitions with glow effect
const GradientDefs: React.FC<{ id: string }> = ({ id }) => (
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
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id={`${id}Shadow`} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f7418c" floodOpacity="0.4" />
    </filter>
  </defs>
);

// ============ ISOLATED MUSCLE ICONS ============

// Chest - Pectoralis major (fan-shaped chest muscles)
export const ChestIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="chest" />
    <g filter="url(#chestShadow)">
      {/* Left pec - fan shape */}
      <path
        d="M8 25 C5 30 5 45 10 55 C15 65 30 70 45 65 C48 64 50 60 50 55 L50 35 C50 28 45 22 35 20 C25 18 15 20 8 25Z"
        fill="url(#chest)"
      />
      {/* Left pec definition */}
      <path
        d="M15 35 Q25 45 40 42"
        stroke="url(#chestDark)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* Right pec - fan shape */}
      <path
        d="M92 25 C95 30 95 45 90 55 C85 65 70 70 55 65 C52 64 50 60 50 55 L50 35 C50 28 55 22 65 20 C75 18 85 20 92 25Z"
        fill="url(#chest)"
      />
      {/* Right pec definition */}
      <path
        d="M85 35 Q75 45 60 42"
        stroke="url(#chestDark)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* Center line */}
      <path
        d="M50 22 L50 68"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1"
      />
    </g>
  </svg>
);

// Shoulders - Deltoid (3D cap shape)
export const ShouldersIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="shoulders" />
    <g filter="url(#shouldersShadow)">
      {/* Left deltoid - rounded cap */}
      <path
        d="M5 40 C2 30 8 18 20 15 C32 12 42 20 45 35 L45 60 C42 65 35 68 25 65 C12 62 5 52 5 40Z"
        fill="url(#shoulders)"
      />
      {/* Left deltoid striations */}
      <path d="M15 25 L25 55" stroke="url(#shouldersDark)" strokeWidth="1.5" opacity="0.4" />
      <path d="M25 20 L30 50" stroke="url(#shouldersDark)" strokeWidth="1.5" opacity="0.3" />
      {/* Right deltoid */}
      <path
        d="M95 40 C98 30 92 18 80 15 C68 12 58 20 55 35 L55 60 C58 65 65 68 75 65 C88 62 95 52 95 40Z"
        fill="url(#shoulders)"
      />
      {/* Right deltoid striations */}
      <path d="M85 25 L75 55" stroke="url(#shouldersDark)" strokeWidth="1.5" opacity="0.4" />
      <path d="M75 20 L70 50" stroke="url(#shouldersDark)" strokeWidth="1.5" opacity="0.3" />
    </g>
  </svg>
);

// Triceps - Horseshoe shape (back of arm)
export const TricepsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="triceps" />
    <g filter="url(#tricepsShadow)">
      {/* Left triceps - horseshoe */}
      <path
        d="M10 15 C5 20 5 35 8 50 C10 60 15 70 25 75 C32 78 38 75 40 68 L42 45 C42 30 38 18 28 12 C20 8 14 10 10 15Z"
        fill="url(#triceps)"
      />
      {/* Lateral head */}
      <path
        d="M12 25 C10 35 12 50 18 60"
        stroke="url(#tricepsDark)"
        strokeWidth="2"
        opacity="0.5"
        fill="none"
      />
      {/* Long head */}
      <path
        d="M30 18 L32 65"
        stroke="url(#tricepsDark)"
        strokeWidth="2"
        opacity="0.4"
      />
      {/* Right triceps */}
      <path
        d="M90 15 C95 20 95 35 92 50 C90 60 85 70 75 75 C68 78 62 75 60 68 L58 45 C58 30 62 18 72 12 C80 8 86 10 90 15Z"
        fill="url(#triceps)"
      />
      <path
        d="M88 25 C90 35 88 50 82 60"
        stroke="url(#tricepsDark)"
        strokeWidth="2"
        opacity="0.5"
        fill="none"
      />
      <path
        d="M70 18 L68 65"
        stroke="url(#tricepsDark)"
        strokeWidth="2"
        opacity="0.4"
      />
    </g>
  </svg>
);

// Lats - Wing shape (latissimus dorsi)
export const LatsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="lats" />
    <g filter="url(#latsShadow)">
      {/* Left lat - wing shape */}
      <path
        d="M45 10 C35 12 20 18 10 35 C5 48 8 65 15 78 C20 85 30 88 42 85 L48 80 L48 15 C48 12 46 10 45 10Z"
        fill="url(#lats)"
      />
      {/* Lat fiber lines */}
      <path d="M20 40 Q35 55 45 75" stroke="url(#latsDark)" strokeWidth="1.5" opacity="0.4" fill="none" />
      <path d="M15 50 Q30 62 42 78" stroke="url(#latsDark)" strokeWidth="1.5" opacity="0.3" fill="none" />
      {/* Right lat */}
      <path
        d="M55 10 C65 12 80 18 90 35 C95 48 92 65 85 78 C80 85 70 88 58 85 L52 80 L52 15 C52 12 54 10 55 10Z"
        fill="url(#lats)"
      />
      <path d="M80 40 Q65 55 55 75" stroke="url(#latsDark)" strokeWidth="1.5" opacity="0.4" fill="none" />
      <path d="M85 50 Q70 62 58 78" stroke="url(#latsDark)" strokeWidth="1.5" opacity="0.3" fill="none" />
    </g>
  </svg>
);

// Upper Back - Rhomboids (mid-back muscles)
export const UpperBackIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="upperBack" />
    <g filter="url(#upperBackShadow)">
      {/* Left rhomboid - diamond shape */}
      <path
        d="M15 20 L45 15 L48 50 L45 80 L15 70 L10 45 Z"
        fill="url(#upperBack)"
      />
      {/* Scapula outline */}
      <path
        d="M20 30 L40 28 L42 50 L38 68 L18 62 Z"
        stroke="url(#upperBackDark)"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
      {/* Right rhomboid */}
      <path
        d="M85 20 L55 15 L52 50 L55 80 L85 70 L90 45 Z"
        fill="url(#upperBack)"
      />
      <path
        d="M80 30 L60 28 L58 50 L62 68 L82 62 Z"
        stroke="url(#upperBackDark)"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
      {/* Spine indication */}
      <path d="M50 12 L50 85" stroke="rgba(0,0,0,0.15)" strokeWidth="2" strokeDasharray="4,4" />
    </g>
  </svg>
);

// Traps - Diamond/trapezoid shape
export const TrapsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="traps" />
    <g filter="url(#trapsShadow)">
      {/* Trapezius - kite/diamond shape */}
      <path
        d="M50 5 L15 30 C10 35 10 45 15 55 L30 70 L50 75 L70 70 L85 55 C90 45 90 35 85 30 L50 5Z"
        fill="url(#traps)"
      />
      {/* Upper trap fibers */}
      <path d="M50 10 L25 35" stroke="url(#trapsDark)" strokeWidth="1.5" opacity="0.4" />
      <path d="M50 10 L75 35" stroke="url(#trapsDark)" strokeWidth="1.5" opacity="0.4" />
      {/* Mid trap fibers */}
      <path d="M50 25 L20 45" stroke="url(#trapsDark)" strokeWidth="1.5" opacity="0.3" />
      <path d="M50 25 L80 45" stroke="url(#trapsDark)" strokeWidth="1.5" opacity="0.3" />
      {/* Lower trap fibers */}
      <path d="M50 45 L35 65" stroke="url(#trapsDark)" strokeWidth="1.5" opacity="0.3" />
      <path d="M50 45 L65 65" stroke="url(#trapsDark)" strokeWidth="1.5" opacity="0.3" />
      {/* Spine */}
      <path d="M50 8 L50 72" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
    </g>
  </svg>
);

// Biceps - Peaked muscle (front of arm)
export const BicepsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="biceps" />
    <g filter="url(#bicepsShadow)">
      {/* Left biceps - peaked shape */}
      <path
        d="M10 25 C5 35 8 50 12 60 C16 70 25 78 35 78 C42 78 45 72 45 65 L45 40 C45 28 40 18 30 15 C20 12 14 18 10 25Z"
        fill="url(#biceps)"
      />
      {/* Biceps peak */}
      <path
        d="M15 35 Q22 30 28 38 Q34 46 30 58"
        stroke="url(#bicepsDark)"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      {/* Short head line */}
      <path d="M35 22 L38 70" stroke="url(#bicepsDark)" strokeWidth="1.5" opacity="0.3" />
      {/* Right biceps */}
      <path
        d="M90 25 C95 35 92 50 88 60 C84 70 75 78 65 78 C58 78 55 72 55 65 L55 40 C55 28 60 18 70 15 C80 12 86 18 90 25Z"
        fill="url(#biceps)"
      />
      <path
        d="M85 35 Q78 30 72 38 Q66 46 70 58"
        stroke="url(#bicepsDark)"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      <path d="M65 22 L62 70" stroke="url(#bicepsDark)" strokeWidth="1.5" opacity="0.3" />
    </g>
  </svg>
);

// Forearms - Tapered shape
export const ForearmsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="forearms" />
    <g filter="url(#forearmsShadow)">
      {/* Left forearm - tapered cylinder */}
      <path
        d="M12 10 C8 12 5 20 5 30 L8 70 C10 80 15 88 22 90 C30 92 35 88 38 78 L42 30 C42 18 38 10 30 8 C22 6 16 8 12 10Z"
        fill="url(#forearms)"
      />
      {/* Brachioradialis */}
      <path d="M15 20 Q20 45 18 75" stroke="url(#forearmsDark)" strokeWidth="2" opacity="0.4" fill="none" />
      {/* Flexor muscles */}
      <path d="M28 15 L30 80" stroke="url(#forearmsDark)" strokeWidth="1.5" opacity="0.3" />
      {/* Right forearm */}
      <path
        d="M88 10 C92 12 95 20 95 30 L92 70 C90 80 85 88 78 90 C70 92 65 88 62 78 L58 30 C58 18 62 10 70 8 C78 6 84 8 88 10Z"
        fill="url(#forearms)"
      />
      <path d="M85 20 Q80 45 82 75" stroke="url(#forearmsDark)" strokeWidth="2" opacity="0.4" fill="none" />
      <path d="M72 15 L70 80" stroke="url(#forearmsDark)" strokeWidth="1.5" opacity="0.3" />
    </g>
  </svg>
);

// Abs - 6-pack grid
export const AbsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="abs" />
    <g filter="url(#absShadow)">
      {/* Outer shape - tapered torso */}
      <path
        d="M25 8 C20 10 18 15 18 22 L20 78 C22 88 30 95 50 95 C70 95 78 88 80 78 L82 22 C82 15 80 10 75 8 C65 5 55 5 50 5 C45 5 35 5 25 8Z"
        fill="url(#abs)"
      />
      {/* 6-pack segments */}
      {/* Top row */}
      <rect x="28" y="15" width="18" height="20" rx="4" fill="url(#absDark)" opacity="0.3" />
      <rect x="54" y="15" width="18" height="20" rx="4" fill="url(#absDark)" opacity="0.3" />
      {/* Middle row */}
      <rect x="27" y="40" width="19" height="20" rx="4" fill="url(#absDark)" opacity="0.3" />
      <rect x="54" y="40" width="19" height="20" rx="4" fill="url(#absDark)" opacity="0.3" />
      {/* Bottom row */}
      <rect x="28" y="65" width="18" height="20" rx="4" fill="url(#absDark)" opacity="0.3" />
      <rect x="54" y="65" width="18" height="20" rx="4" fill="url(#absDark)" opacity="0.3" />
      {/* Linea alba (center line) */}
      <path d="M50 10 L50 90" stroke="rgba(0,0,0,0.25)" strokeWidth="3" />
      {/* Horizontal lines */}
      <path d="M30 38 L70 38" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
      <path d="M28 63 L72 63" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
    </g>
  </svg>
);

// Obliques - Side abs (diagonal strips)
export const ObliquesIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="obliques" />
    <g filter="url(#obliquesShadow)">
      {/* Left oblique - curved strip */}
      <path
        d="M8 20 C5 28 5 45 8 60 C12 75 20 85 30 88 C38 90 42 85 42 75 L42 25 C42 15 38 10 30 10 C20 10 12 14 8 20Z"
        fill="url(#obliques)"
      />
      {/* Diagonal fiber lines - left */}
      <path d="M12 30 L35 50" stroke="url(#obliquesDark)" strokeWidth="2" opacity="0.4" />
      <path d="M10 45 L38 68" stroke="url(#obliquesDark)" strokeWidth="2" opacity="0.4" />
      <path d="M12 60 L35 80" stroke="url(#obliquesDark)" strokeWidth="2" opacity="0.4" />
      {/* Right oblique */}
      <path
        d="M92 20 C95 28 95 45 92 60 C88 75 80 85 70 88 C62 90 58 85 58 75 L58 25 C58 15 62 10 70 10 C80 10 88 14 92 20Z"
        fill="url(#obliques)"
      />
      {/* Diagonal fiber lines - right */}
      <path d="M88 30 L65 50" stroke="url(#obliquesDark)" strokeWidth="2" opacity="0.4" />
      <path d="M90 45 L62 68" stroke="url(#obliquesDark)" strokeWidth="2" opacity="0.4" />
      <path d="M88 60 L65 80" stroke="url(#obliquesDark)" strokeWidth="2" opacity="0.4" />
    </g>
  </svg>
);

// Lower Back - Erector spinae (vertical columns)
export const LowerBackIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="lowerBack" />
    <g filter="url(#lowerBackShadow)">
      {/* Left erector column */}
      <path
        d="M22 10 C15 12 12 20 12 30 L15 75 C18 88 25 95 35 95 C42 95 46 88 45 78 L42 25 C40 15 35 10 28 8 C25 7 22 8 22 10Z"
        fill="url(#lowerBack)"
      />
      {/* Muscle fiber lines */}
      <path d="M25 20 L28 85" stroke="url(#lowerBackDark)" strokeWidth="2" opacity="0.4" />
      <path d="M35 15 L36 88" stroke="url(#lowerBackDark)" strokeWidth="1.5" opacity="0.3" />
      {/* Right erector column */}
      <path
        d="M78 10 C85 12 88 20 88 30 L85 75 C82 88 75 95 65 95 C58 95 54 88 55 78 L58 25 C60 15 65 10 72 8 C75 7 78 8 78 10Z"
        fill="url(#lowerBack)"
      />
      <path d="M75 20 L72 85" stroke="url(#lowerBackDark)" strokeWidth="2" opacity="0.4" />
      <path d="M65 15 L64 88" stroke="url(#lowerBackDark)" strokeWidth="1.5" opacity="0.3" />
      {/* Spine indication */}
      <path d="M50 5 L50 95" stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeDasharray="5,3" />
    </g>
  </svg>
);

// Quads - Four-headed thigh (front)
export const QuadsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="quads" />
    <g filter="url(#quadsShadow)">
      {/* Left quad group */}
      <path
        d="M8 8 C5 12 5 25 8 45 L15 85 C18 92 25 95 32 95 C40 95 45 90 45 82 L45 20 C45 12 40 6 30 5 C20 4 12 5 8 8Z"
        fill="url(#quads)"
      />
      {/* Quad head separations - vastus lateralis, rectus femoris, vastus medialis */}
      <path d="M12 20 L18 80" stroke="url(#quadsDark)" strokeWidth="2" opacity="0.4" />
      <path d="M25 12 L28 88" stroke="url(#quadsDark)" strokeWidth="2" opacity="0.4" />
      <path d="M38 15 L40 85" stroke="url(#quadsDark)" strokeWidth="1.5" opacity="0.3" />
      {/* Right quad group */}
      <path
        d="M92 8 C95 12 95 25 92 45 L85 85 C82 92 75 95 68 95 C60 95 55 90 55 82 L55 20 C55 12 60 6 70 5 C80 4 88 5 92 8Z"
        fill="url(#quads)"
      />
      <path d="M88 20 L82 80" stroke="url(#quadsDark)" strokeWidth="2" opacity="0.4" />
      <path d="M75 12 L72 88" stroke="url(#quadsDark)" strokeWidth="2" opacity="0.4" />
      <path d="M62 15 L60 85" stroke="url(#quadsDark)" strokeWidth="1.5" opacity="0.3" />
    </g>
  </svg>
);

// Hamstrings - Back of thigh (3 muscles)
export const HamstringsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="hamstrings" />
    <g filter="url(#hamstringsShadow)">
      {/* Left hamstring group */}
      <path
        d="M10 5 C5 10 5 25 8 45 L15 88 C18 94 25 98 35 98 C42 98 45 92 45 85 L45 15 C45 8 40 4 30 4 C20 4 14 4 10 5Z"
        fill="url(#hamstrings)"
      />
      {/* Biceps femoris (lateral) */}
      <path d="M12 15 L18 90" stroke="url(#hamstringsDark)" strokeWidth="2" opacity="0.5" />
      {/* Semitendinosus (middle) */}
      <path d="M28 10 L30 92" stroke="url(#hamstringsDark)" strokeWidth="2" opacity="0.4" />
      {/* Semimembranosus (medial) */}
      <path d="M40 12 L42 88" stroke="url(#hamstringsDark)" strokeWidth="1.5" opacity="0.3" />
      {/* Right hamstring */}
      <path
        d="M90 5 C95 10 95 25 92 45 L85 88 C82 94 75 98 65 98 C58 98 55 92 55 85 L55 15 C55 8 60 4 70 4 C80 4 86 4 90 5Z"
        fill="url(#hamstrings)"
      />
      <path d="M88 15 L82 90" stroke="url(#hamstringsDark)" strokeWidth="2" opacity="0.5" />
      <path d="M72 10 L70 92" stroke="url(#hamstringsDark)" strokeWidth="2" opacity="0.4" />
      <path d="M60 12 L58 88" stroke="url(#hamstringsDark)" strokeWidth="1.5" opacity="0.3" />
    </g>
  </svg>
);

// Glutes - Rounded shape (gluteus maximus)
export const GlutesIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="glutes" />
    <g filter="url(#glutesShadow)">
      {/* Left glute - rounded */}
      <path
        d="M8 25 C2 35 2 55 10 70 C18 85 32 92 45 88 C48 87 50 82 50 75 L50 35 C50 25 45 18 35 15 C22 12 14 16 8 25Z"
        fill="url(#glutes)"
      />
      {/* Glute definition curves */}
      <path
        d="M15 35 Q25 50 22 70"
        stroke="url(#glutesDark)"
        strokeWidth="2"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M30 25 Q38 45 35 75"
        stroke="url(#glutesDark)"
        strokeWidth="1.5"
        opacity="0.3"
        fill="none"
      />
      {/* Right glute */}
      <path
        d="M92 25 C98 35 98 55 90 70 C82 85 68 92 55 88 C52 87 50 82 50 75 L50 35 C50 25 55 18 65 15 C78 12 86 16 92 25Z"
        fill="url(#glutes)"
      />
      <path
        d="M85 35 Q75 50 78 70"
        stroke="url(#glutesDark)"
        strokeWidth="2"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M70 25 Q62 45 65 75"
        stroke="url(#glutesDark)"
        strokeWidth="1.5"
        opacity="0.3"
        fill="none"
      />
    </g>
  </svg>
);

// Calves - Diamond shape (gastrocnemius)
export const CalvesIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="calves" />
    <g filter="url(#calvesShadow)">
      {/* Left calf - diamond/inverted teardrop */}
      <path
        d="M15 8 C8 12 5 25 8 42 C12 60 18 72 25 82 C30 90 35 95 40 95 C45 95 48 88 45 75 L42 35 C40 18 35 8 28 5 C22 3 18 5 15 8Z"
        fill="url(#calves)"
      />
      {/* Gastrocnemius heads */}
      <path d="M18 18 Q22 40 22 70" stroke="url(#calvesDark)" strokeWidth="2" opacity="0.5" fill="none" />
      <path d="M32 12 L35 75" stroke="url(#calvesDark)" strokeWidth="2" opacity="0.4" />
      {/* Soleus hint */}
      <path d="M25 55 Q30 70 32 88" stroke="url(#calvesDark)" strokeWidth="1.5" opacity="0.3" fill="none" />
      {/* Right calf */}
      <path
        d="M85 8 C92 12 95 25 92 42 C88 60 82 72 75 82 C70 90 65 95 60 95 C55 95 52 88 55 75 L58 35 C60 18 65 8 72 5 C78 3 82 5 85 8Z"
        fill="url(#calves)"
      />
      <path d="M82 18 Q78 40 78 70" stroke="url(#calvesDark)" strokeWidth="2" opacity="0.5" fill="none" />
      <path d="M68 12 L65 75" stroke="url(#calvesDark)" strokeWidth="2" opacity="0.4" />
      <path d="M75 55 Q70 70 68 88" stroke="url(#calvesDark)" strokeWidth="1.5" opacity="0.3" fill="none" />
    </g>
  </svg>
);
