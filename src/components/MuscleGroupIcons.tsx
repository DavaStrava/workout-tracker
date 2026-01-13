import React from 'react';

interface MuscleIconProps {
  size?: number;
}

// Shared gradient definitions
const GradientDefs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f97316" />
      <stop offset="100%" stopColor="#ec4899" />
    </linearGradient>
    <linearGradient id={`${id}Light`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.5" />
    </linearGradient>
  </defs>
);

// Athletic front body silhouette - muscular male figure
const FrontBodyOutline: React.FC = () => (
  <g stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" fill="none">
    {/* Head */}
    <ellipse cx="50" cy="10" rx="7" ry="8" />
    {/* Neck */}
    <path d="M45 18 L45 22 M55 18 L55 22" />
    {/* Shoulders and torso */}
    <path d="M45 22 L30 26 L22 28 L18 30 M55 22 L70 26 L78 28 L82 30" />
    {/* Arms */}
    <path d="M18 30 L14 42 L12 55 L14 58 L18 56 L22 42 L24 34" />
    <path d="M82 30 L86 42 L88 55 L86 58 L82 56 L78 42 L76 34" />
    {/* Forearms */}
    <path d="M14 58 L16 72 L20 74 L22 72 L18 56" />
    <path d="M86 58 L84 72 L80 74 L78 72 L82 56" />
    {/* Torso sides */}
    <path d="M30 26 L28 35 L26 50 L28 62 L32 70 L38 78" />
    <path d="M70 26 L72 35 L74 50 L72 62 L68 70 L62 78" />
    {/* Inner torso */}
    <path d="M38 78 L42 82 L50 84 L58 82 L62 78" />
    {/* Legs */}
    <path d="M38 78 L36 88 L34 96" />
    <path d="M62 78 L64 88 L66 96" />
    <path d="M42 82 L44 92 L46 96" />
    <path d="M58 82 L56 92 L54 96" />
  </g>
);

// Athletic back body silhouette
const BackBodyOutline: React.FC = () => (
  <g stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" fill="none">
    {/* Head */}
    <ellipse cx="50" cy="10" rx="7" ry="8" />
    {/* Neck */}
    <path d="M45 18 L45 22 M55 18 L55 22" />
    {/* Shoulders and upper back */}
    <path d="M45 22 L30 26 L22 28 L18 30 M55 22 L70 26 L78 28 L82 30" />
    {/* Arms */}
    <path d="M18 30 L14 42 L12 55 L14 58 L18 56 L22 42 L24 34" />
    <path d="M82 30 L86 42 L88 55 L86 58 L82 56 L78 42 L76 34" />
    {/* Forearms */}
    <path d="M14 58 L16 72 L20 74 L22 72 L18 56" />
    <path d="M86 58 L84 72 L80 74 L78 72 L82 56" />
    {/* Back sides (lats area) */}
    <path d="M30 26 L26 35 L24 50 L26 62 L30 70 L38 78" />
    <path d="M70 26 L74 35 L76 50 L74 62 L70 70 L62 78" />
    {/* Spine */}
    <path d="M50 22 L50 75" strokeDasharray="2,2" />
    {/* Glutes */}
    <path d="M38 78 L42 82 L50 84 L58 82 L62 78" />
    {/* Legs */}
    <path d="M38 78 L36 88 L34 96" />
    <path d="M62 78 L64 88 L66 96" />
    <path d="M42 82 L44 92 L46 96" />
    <path d="M58 82 L56 92 L54 96" />
  </g>
);

// ============ FRONT VIEW ICONS ============

// Chest - Pectoralis major
export const ChestIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="chestGrad" />
    <FrontBodyOutline />
    {/* Left pectoral */}
    <path
      d="M32 28 C28 30 26 34 28 40 L30 46 C34 50 42 50 46 46 L48 38 C48 32 44 28 38 26 C35 25 32 26 32 28Z"
      fill="url(#chestGrad)"
    />
    {/* Right pectoral */}
    <path
      d="M68 28 C72 30 74 34 72 40 L70 46 C66 50 58 50 54 46 L52 38 C52 32 56 28 62 26 C65 25 68 26 68 28Z"
      fill="url(#chestGrad)"
    />
    {/* Muscle definition lines */}
    <path d="M50 30 L50 48" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    <path d="M34 36 Q40 42 46 38" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
    <path d="M66 36 Q60 42 54 38" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
  </svg>
);

// Shoulders - Deltoids (all three heads)
export const ShouldersIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="shouldersGrad" />
    <FrontBodyOutline />
    {/* Left deltoid - rounded cap */}
    <path
      d="M30 26 C24 24 18 26 16 32 C14 38 16 44 20 48 L24 46 C28 42 30 36 30 30 L30 26Z"
      fill="url(#shouldersGrad)"
    />
    {/* Right deltoid */}
    <path
      d="M70 26 C76 24 82 26 84 32 C86 38 84 44 80 48 L76 46 C72 42 70 36 70 30 L70 26Z"
      fill="url(#shouldersGrad)"
    />
    {/* Muscle separation lines */}
    <path d="M22 32 L24 42" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
    <path d="M78 32 L76 42" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
  </svg>
);

// Biceps - Front of upper arm
export const BicepsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="bicepsGrad" />
    <FrontBodyOutline />
    {/* Left biceps */}
    <path
      d="M20 32 C16 34 14 40 14 48 C14 52 16 54 20 54 C24 54 26 50 26 44 L26 36 C26 32 24 30 20 32Z"
      fill="url(#bicepsGrad)"
    />
    {/* Right biceps */}
    <path
      d="M80 32 C84 34 86 40 86 48 C86 52 84 54 80 54 C76 54 74 50 74 44 L74 36 C74 32 76 30 80 32Z"
      fill="url(#bicepsGrad)"
    />
    {/* Biceps peak definition */}
    <path d="M18 40 Q20 44 18 48" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
    <path d="M82 40 Q80 44 82 48" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
  </svg>
);

// Forearms - Lower arm muscles
export const ForearmsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="forearmsGrad" />
    <FrontBodyOutline />
    {/* Left forearm */}
    <path
      d="M14 56 C12 58 12 64 14 70 C16 74 20 74 22 70 L22 60 C22 56 18 54 14 56Z"
      fill="url(#forearmsGrad)"
    />
    {/* Right forearm */}
    <path
      d="M86 56 C88 58 88 64 86 70 C84 74 80 74 78 70 L78 60 C78 56 82 54 86 56Z"
      fill="url(#forearmsGrad)"
    />
    {/* Brachioradialis definition */}
    <path d="M16 60 L18 68" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
    <path d="M84 60 L82 68" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
  </svg>
);

// Quads - Front thigh muscles
export const QuadsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="quadsGrad" />
    <FrontBodyOutline />
    {/* Left quad group */}
    <path
      d="M36 78 C32 80 30 86 32 94 L46 94 C48 86 46 80 42 78 L36 78Z"
      fill="url(#quadsGrad)"
    />
    {/* Right quad group */}
    <path
      d="M64 78 C68 80 70 86 68 94 L54 94 C52 86 54 80 58 78 L64 78Z"
      fill="url(#quadsGrad)"
    />
    {/* Quad separation (4 heads) */}
    <path d="M38 82 L40 92" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
    <path d="M62 82 L60 92" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
    {/* Rectus femoris line */}
    <path d="M40 80 L42 90" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    <path d="M60 80 L58 90" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
  </svg>
);

// Abs - Rectus abdominis (6-pack)
export const AbsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="absGrad" />
    <FrontBodyOutline />
    {/* Six-pack muscles */}
    {/* Top row */}
    <rect x="40" y="36" width="8" height="10" rx="2" fill="url(#absGrad)" />
    <rect x="52" y="36" width="8" height="10" rx="2" fill="url(#absGrad)" />
    {/* Middle row */}
    <rect x="40" y="48" width="8" height="10" rx="2" fill="url(#absGrad)" />
    <rect x="52" y="48" width="8" height="10" rx="2" fill="url(#absGrad)" />
    {/* Bottom row */}
    <rect x="40" y="60" width="8" height="10" rx="2" fill="url(#absGrad)" />
    <rect x="52" y="60" width="8" height="10" rx="2" fill="url(#absGrad)" />
    {/* Linea alba (center line) */}
    <path d="M50 34 L50 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
  </svg>
);

// Obliques - Side abdominal muscles
export const ObliquesIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="obliquesGrad" />
    <FrontBodyOutline />
    {/* Left obliques */}
    <path
      d="M28 38 C26 42 26 54 28 64 L32 68 C34 64 36 54 34 44 L32 38 C30 36 28 36 28 38Z"
      fill="url(#obliquesGrad)"
    />
    {/* Right obliques */}
    <path
      d="M72 38 C74 42 74 54 72 64 L68 68 C66 64 64 54 66 44 L68 38 C70 36 72 36 72 38Z"
      fill="url(#obliquesGrad)"
    />
    {/* Oblique fiber direction lines */}
    <path d="M30 44 L32 50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    <path d="M30 54 L32 60" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    <path d="M70 44 L68 50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    <path d="M70 54 L68 60" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
  </svg>
);

// ============ BACK VIEW ICONS ============

// Lats - Latissimus dorsi (V-taper)
export const LatsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="latsGrad" />
    <BackBodyOutline />
    {/* Left lat - wing shape */}
    <path
      d="M30 28 C24 32 22 42 24 54 L28 62 C32 64 38 62 42 56 L44 44 C44 36 40 28 34 26 L30 28Z"
      fill="url(#latsGrad)"
    />
    {/* Right lat */}
    <path
      d="M70 28 C76 32 78 42 76 54 L72 62 C68 64 62 62 58 56 L56 44 C56 36 60 28 66 26 L70 28Z"
      fill="url(#latsGrad)"
    />
    {/* Lat fiber lines */}
    <path d="M28 36 Q34 46 30 56" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
    <path d="M72 36 Q66 46 70 56" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
  </svg>
);

// Upper Back - Rhomboids and mid traps
export const UpperBackIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="upperBackGrad" />
    <BackBodyOutline />
    {/* Left rhomboid/mid back */}
    <path
      d="M36 28 C32 30 30 36 32 44 L36 50 C40 52 46 50 48 44 L48 34 C46 28 40 26 36 28Z"
      fill="url(#upperBackGrad)"
    />
    {/* Right rhomboid/mid back */}
    <path
      d="M64 28 C68 30 70 36 68 44 L64 50 C60 52 54 50 52 44 L52 34 C54 28 60 26 64 28Z"
      fill="url(#upperBackGrad)"
    />
    {/* Scapula hints */}
    <path d="M38 34 Q42 40 38 46" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
    <path d="M62 34 Q58 40 62 46" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
  </svg>
);

// Traps - Upper trapezius
export const TrapsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="trapsGrad" />
    <BackBodyOutline />
    {/* Trapezius - diamond shape from neck to shoulders */}
    <path
      d="M50 18 L30 26 C28 28 28 32 30 36 L42 40 L50 42 L58 40 L70 36 C72 32 72 28 70 26 L50 18Z"
      fill="url(#trapsGrad)"
    />
    {/* Trap fiber lines */}
    <path d="M50 22 L38 32" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    <path d="M50 22 L62 32" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    <path d="M50 28 L50 38" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
  </svg>
);

// Lower Back - Erector spinae
export const LowerBackIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="lowerBackGrad" />
    <BackBodyOutline />
    {/* Left erector spinae column */}
    <path
      d="M42 52 C40 56 40 66 42 74 L46 76 C48 74 48 64 46 56 L42 52Z"
      fill="url(#lowerBackGrad)"
    />
    {/* Right erector spinae column */}
    <path
      d="M58 52 C60 56 60 66 58 74 L54 76 C52 74 52 64 54 56 L58 52Z"
      fill="url(#lowerBackGrad)"
    />
    {/* Spine highlight */}
    <path d="M50 50 L50 76" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    {/* Muscle fiber lines */}
    <path d="M44 58 L44 70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    <path d="M56 58 L56 70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
  </svg>
);

// Triceps - Back of upper arm
export const TricepsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="tricepsGrad" />
    <BackBodyOutline />
    {/* Left triceps (3 heads) */}
    <path
      d="M18 32 C14 36 12 44 14 52 C16 56 20 56 24 52 L26 42 C26 36 24 30 18 32Z"
      fill="url(#tricepsGrad)"
    />
    {/* Right triceps */}
    <path
      d="M82 32 C86 36 88 44 86 52 C84 56 80 56 76 52 L74 42 C74 36 76 30 82 32Z"
      fill="url(#tricepsGrad)"
    />
    {/* Triceps head separation */}
    <path d="M18 38 L20 48" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
    <path d="M82 38 L80 48" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
    <path d="M22 36 L22 46" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    <path d="M78 36 L78 46" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
  </svg>
);

// Hamstrings - Back of thigh
export const HamstringsIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="hamstringsGrad" />
    <BackBodyOutline />
    {/* Left hamstrings */}
    <path
      d="M36 80 C32 82 30 88 32 96 L44 96 C46 90 44 82 40 80 L36 80Z"
      fill="url(#hamstringsGrad)"
    />
    {/* Right hamstrings */}
    <path
      d="M64 80 C68 82 70 88 68 96 L56 96 C54 90 56 82 60 80 L64 80Z"
      fill="url(#hamstringsGrad)"
    />
    {/* Hamstring separation (biceps femoris, semitendinosus) */}
    <path d="M38 84 L40 94" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
    <path d="M62 84 L60 94" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
  </svg>
);

// Glutes - Gluteus maximus
export const GlutesIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="glutesGrad" />
    <BackBodyOutline />
    {/* Left glute */}
    <path
      d="M32 68 C28 72 28 78 32 82 L42 84 C46 82 48 78 46 74 L42 70 C38 68 34 66 32 68Z"
      fill="url(#glutesGrad)"
    />
    {/* Right glute */}
    <path
      d="M68 68 C72 72 72 78 68 82 L58 84 C54 82 52 78 54 74 L58 70 C62 68 66 66 68 68Z"
      fill="url(#glutesGrad)"
    />
    {/* Glute definition curves */}
    <path d="M36 72 Q40 76 38 80" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
    <path d="M64 72 Q60 76 62 80" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
  </svg>
);

// Calves - Gastrocnemius and soleus
export const CalvesIcon: React.FC<MuscleIconProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <GradientDefs id="calvesGrad" />
    <BackBodyOutline />
    {/* Note: Calves shown at different position for visibility */}
    {/* Left calf - diamond shape */}
    <path
      d="M36 86 C34 88 34 92 36 96 L42 96 C44 94 44 90 42 86 L36 86Z"
      fill="url(#calvesGrad)"
    />
    {/* Right calf */}
    <path
      d="M64 86 C66 88 66 92 64 96 L58 96 C56 94 56 90 58 86 L64 86Z"
      fill="url(#calvesGrad)"
    />
    {/* Gastrocnemius heads */}
    <path d="M38 88 L40 94" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
    <path d="M62 88 L60 94" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
  </svg>
);
