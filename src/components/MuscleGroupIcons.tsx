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
      <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
    </linearGradient>
  </defs>
);

// Chest - Front torso with pectoralis major muscles
export const ChestIcon: React.FC<MuscleIconProps> = ({ size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <GradientDefs id="chestGradient" />
    {/* Torso outline */}
    <path
      d="M50 8 C35 8 25 12 20 18 C15 24 12 32 12 42 L12 75 C12 82 18 88 28 90 L72 90 C82 88 88 82 88 75 L88 42 C88 32 85 24 80 18 C75 12 65 8 50 8Z"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Neck */}
    <path
      d="M42 8 L42 2 C42 0 45 0 50 0 C55 0 58 0 58 2 L58 8"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Left pectoral - anatomically shaped */}
    <path
      d="M18 28 C20 22 28 20 38 22 C46 24 48 28 48 32 L48 48 C48 54 44 58 36 56 C26 54 18 48 16 40 C14 34 16 30 18 28Z"
      fill="url(#chestGradient)"
    />
    {/* Right pectoral - anatomically shaped */}
    <path
      d="M82 28 C80 22 72 20 62 22 C54 24 52 28 52 32 L52 48 C52 54 56 58 64 56 C74 54 82 48 84 40 C86 34 84 30 82 28Z"
      fill="url(#chestGradient)"
    />
    {/* Sternum line */}
    <path
      d="M50 24 L50 58"
      stroke="rgba(255, 255, 255, 0.15)"
      strokeWidth="1"
    />
    {/* Clavicle lines */}
    <path
      d="M20 22 Q35 18 50 20 Q65 18 80 22"
      stroke="rgba(255, 255, 255, 0.15)"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

// Back - Posterior view with lats and traps
export const BackIcon: React.FC<MuscleIconProps> = ({ size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <GradientDefs id="backGradient" />
    {/* Torso outline */}
    <path
      d="M50 8 C35 8 25 12 20 18 C15 24 12 32 12 42 L12 75 C12 82 18 88 28 90 L72 90 C82 88 88 82 88 75 L88 42 C88 32 85 24 80 18 C75 12 65 8 50 8Z"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Trapezius - diamond shape on upper back */}
    <path
      d="M50 10 L30 20 C25 24 22 30 24 36 L50 50 L76 36 C78 30 75 24 70 20 L50 10Z"
      fill="url(#backGradient)"
    />
    {/* Left latissimus dorsi - wing shape */}
    <path
      d="M14 35 C12 40 10 50 12 60 C14 72 20 80 30 82 L42 82 C48 80 50 75 50 70 L50 55 C48 50 40 45 30 42 C20 39 16 36 14 35Z"
      fill="url(#backGradientLight)"
    />
    {/* Right latissimus dorsi - wing shape */}
    <path
      d="M86 35 C88 40 90 50 88 60 C86 72 80 80 70 82 L58 82 C52 80 50 75 50 70 L50 55 C52 50 60 45 70 42 C80 39 84 36 86 35Z"
      fill="url(#backGradientLight)"
    />
    {/* Spine line */}
    <path
      d="M50 15 L50 85"
      stroke="rgba(255, 255, 255, 0.15)"
      strokeWidth="1"
    />
    {/* Scapula hints */}
    <path
      d="M30 35 Q35 45 32 55"
      stroke="rgba(255, 255, 255, 0.1)"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M70 35 Q65 45 68 55"
      stroke="rgba(255, 255, 255, 0.1)"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

// Legs - Quadriceps and hamstrings
export const LegsIcon: React.FC<MuscleIconProps> = ({ size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <GradientDefs id="legsGradient" />
    {/* Left leg outline */}
    <path
      d="M20 5 C15 5 12 8 12 12 L12 15 C10 20 8 30 10 45 L14 85 C14 92 18 96 24 96 L32 96 C38 96 42 92 42 85 L46 45 C48 30 46 15 44 10 C42 6 38 5 34 5 L20 5Z"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Right leg outline */}
    <path
      d="M80 5 C85 5 88 8 88 12 L88 15 C90 20 92 30 90 45 L86 85 C86 92 82 96 76 96 L68 96 C62 96 58 92 58 85 L54 45 C52 30 54 15 56 10 C58 6 62 5 66 5 L80 5Z"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Left quadriceps - front thigh muscle group */}
    <path
      d="M18 12 C14 14 12 20 12 28 L14 55 C16 65 22 70 28 68 L36 65 C40 62 42 55 42 45 L42 28 C42 18 38 12 32 10 C26 8 22 10 18 12Z"
      fill="url(#legsGradient)"
    />
    {/* Left vastus lateralis */}
    <path
      d="M14 30 C12 35 12 45 14 55 L16 65 C14 55 14 45 14 35 Z"
      fill="url(#legsGradientLight)"
    />
    {/* Right quadriceps - front thigh muscle group */}
    <path
      d="M82 12 C86 14 88 20 88 28 L86 55 C84 65 78 70 72 68 L64 65 C60 62 58 55 58 45 L58 28 C58 18 62 12 68 10 C74 8 78 10 82 12Z"
      fill="url(#legsGradient)"
    />
    {/* Knee caps */}
    <ellipse cx="27" cy="72" rx="8" ry="5" fill="rgba(255, 255, 255, 0.1)" />
    <ellipse cx="73" cy="72" rx="8" ry="5" fill="rgba(255, 255, 255, 0.1)" />
    {/* Lower leg muscle hints */}
    <path
      d="M24 78 C22 82 22 88 24 92"
      stroke="rgba(255, 255, 255, 0.1)"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M76 78 C78 82 78 88 76 92"
      stroke="rgba(255, 255, 255, 0.1)"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

// Shoulders - Deltoid muscles (three heads)
export const ShouldersIcon: React.FC<MuscleIconProps> = ({ size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <GradientDefs id="shouldersGradient" />
    {/* Upper torso/neck outline */}
    <path
      d="M50 25 C40 25 32 28 28 32 L28 70 C28 78 35 82 50 82 C65 82 72 78 72 70 L72 32 C68 28 60 25 50 25Z"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Neck */}
    <path
      d="M44 25 L44 15 C44 10 47 8 50 8 C53 8 56 10 56 15 L56 25"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Left deltoid - anterior head */}
    <path
      d="M28 32 C20 30 10 32 6 40 C4 46 6 52 10 56 L18 58 C22 58 26 54 28 48 L28 32Z"
      fill="url(#shouldersGradient)"
    />
    {/* Left deltoid - lateral head (cap) */}
    <path
      d="M6 40 C2 35 2 28 8 22 C14 16 24 18 28 24 L28 32 C20 30 10 32 6 40Z"
      fill="url(#shouldersGradient)"
    />
    {/* Left deltoid - posterior head */}
    <path
      d="M10 56 C6 60 6 66 10 70 L18 72 C24 70 28 65 28 58 L28 48 C26 54 22 58 18 58 L10 56Z"
      fill="url(#shouldersGradientLight)"
    />
    {/* Right deltoid - anterior head */}
    <path
      d="M72 32 C80 30 90 32 94 40 C96 46 94 52 90 56 L82 58 C78 58 74 54 72 48 L72 32Z"
      fill="url(#shouldersGradient)"
    />
    {/* Right deltoid - lateral head (cap) */}
    <path
      d="M94 40 C98 35 98 28 92 22 C86 16 76 18 72 24 L72 32 C80 30 90 32 94 40Z"
      fill="url(#shouldersGradient)"
    />
    {/* Right deltoid - posterior head */}
    <path
      d="M90 56 C94 60 94 66 90 70 L82 72 C76 70 72 65 72 58 L72 48 C74 54 78 58 82 58 L90 56Z"
      fill="url(#shouldersGradientLight)"
    />
    {/* Clavicle line */}
    <path
      d="M28 32 Q50 28 72 32"
      stroke="rgba(255, 255, 255, 0.15)"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

// Arms - Biceps and triceps
export const ArmsIcon: React.FC<MuscleIconProps> = ({ size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <GradientDefs id="armsGradient" />
    {/* Left arm outline */}
    <path
      d="M8 10 C4 10 2 14 2 20 L2 55 C2 60 4 65 8 68 L12 70 C16 70 20 68 22 65 L26 55 L26 20 C26 14 24 10 20 10 L8 10Z"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Left forearm */}
    <path
      d="M8 70 L6 90 C6 94 8 96 12 96 L16 96 C20 96 22 94 22 90 L20 70"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Left biceps - two heads visible */}
    <path
      d="M6 18 C4 22 4 30 6 40 C8 48 12 54 18 54 C22 54 24 48 24 40 L24 28 C24 20 22 16 18 14 C14 12 10 14 6 18Z"
      fill="url(#armsGradient)"
    />
    {/* Left biceps peak */}
    <path
      d="M10 25 C8 30 10 38 14 42 C12 36 12 30 14 26 C12 24 10 24 10 25Z"
      fill="url(#armsGradientLight)"
    />
    {/* Left triceps (back of arm) */}
    <path
      d="M6 40 C4 45 4 52 6 58 L10 62 C14 62 18 58 20 52 L22 40 C20 48 16 52 12 50 C8 48 6 44 6 40Z"
      fill="url(#armsGradientLight)"
    />
    {/* Left forearm muscles */}
    <path
      d="M10 72 C8 76 8 84 10 90"
      fill="url(#armsGradientLight)"
    />

    {/* Right arm outline */}
    <path
      d="M92 10 C96 10 98 14 98 20 L98 55 C98 60 96 65 92 68 L88 70 C84 70 80 68 78 65 L74 55 L74 20 C74 14 76 10 80 10 L92 10Z"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Right forearm */}
    <path
      d="M92 70 L94 90 C94 94 92 96 88 96 L84 96 C80 96 78 94 78 90 L80 70"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Right biceps */}
    <path
      d="M94 18 C96 22 96 30 94 40 C92 48 88 54 82 54 C78 54 76 48 76 40 L76 28 C76 20 78 16 82 14 C86 12 90 14 94 18Z"
      fill="url(#armsGradient)"
    />
    {/* Right biceps peak */}
    <path
      d="M90 25 C92 30 90 38 86 42 C88 36 88 30 86 26 C88 24 90 24 90 25Z"
      fill="url(#armsGradientLight)"
    />
    {/* Right triceps */}
    <path
      d="M94 40 C96 45 96 52 94 58 L90 62 C86 62 82 58 80 52 L78 40 C80 48 84 52 88 50 C92 48 94 44 94 40Z"
      fill="url(#armsGradientLight)"
    />

    {/* Center torso hint */}
    <path
      d="M35 20 L35 70 M65 20 L65 70"
      stroke="rgba(255, 255, 255, 0.1)"
      strokeWidth="1"
    />
  </svg>
);

// Core - Abdominal muscles (rectus abdominis, obliques)
export const CoreIcon: React.FC<MuscleIconProps> = ({ size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <GradientDefs id="coreGradient" />
    {/* Torso outline */}
    <path
      d="M50 5 C38 5 28 8 22 14 C16 20 14 28 14 38 L14 75 C14 85 22 92 35 94 L65 94 C78 92 86 85 86 75 L86 38 C86 28 84 20 78 14 C72 8 62 5 50 5Z"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Rectus abdominis - 6-pack with anatomical shape */}
    {/* Top row */}
    <path
      d="M38 22 C34 24 32 28 34 34 L38 38 C42 40 46 38 48 34 L48 26 C46 22 42 20 38 22Z"
      fill="url(#coreGradient)"
    />
    <path
      d="M62 22 C66 24 68 28 66 34 L62 38 C58 40 54 38 52 34 L52 26 C54 22 58 20 62 22Z"
      fill="url(#coreGradient)"
    />
    {/* Middle row */}
    <path
      d="M36 42 C32 44 30 50 32 56 L36 60 C42 62 46 58 48 54 L48 46 C46 42 42 40 36 42Z"
      fill="url(#coreGradient)"
    />
    <path
      d="M64 42 C68 44 70 50 68 56 L64 60 C58 62 54 58 52 54 L52 46 C54 42 58 40 64 42Z"
      fill="url(#coreGradient)"
    />
    {/* Bottom row */}
    <path
      d="M36 64 C32 66 30 72 32 78 L38 82 C44 82 48 78 48 72 L48 68 C46 64 42 62 36 64Z"
      fill="url(#coreGradient)"
    />
    <path
      d="M64 64 C68 66 70 72 68 78 L62 82 C56 82 52 78 52 72 L52 68 C54 64 58 62 64 64Z"
      fill="url(#coreGradient)"
    />
    {/* Linea alba (center line) */}
    <path
      d="M50 18 L50 86"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
    />
    {/* Tendinous intersections (horizontal lines) */}
    <path
      d="M35 40 L48 40 M52 40 L65 40"
      stroke="rgba(255, 255, 255, 0.15)"
      strokeWidth="1"
    />
    <path
      d="M34 62 L48 62 M52 62 L66 62"
      stroke="rgba(255, 255, 255, 0.15)"
      strokeWidth="1"
    />
    {/* External obliques */}
    <path
      d="M18 35 C16 45 18 60 22 72 L28 78 C30 75 30 65 28 55 L24 40 C22 36 20 34 18 35Z"
      fill="url(#coreGradientLight)"
    />
    <path
      d="M82 35 C84 45 82 60 78 72 L72 78 C70 75 70 65 72 55 L76 40 C78 36 80 34 82 35Z"
      fill="url(#coreGradientLight)"
    />
  </svg>
);
