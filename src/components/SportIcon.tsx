import {
  Bike,
  Waves,
  Ship,
  Footprints,
  Mountain,
  MountainSnow,
  CircleDot,
  TrendingUp,
  Zap,
  PersonStanding,
  Heart,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Bike,
  Waves,
  Ship,
  Footprints,
  Mountain,
  MountainSnow,
  CircleDot,
  TrendingUp,
  Zap,
  PersonStanding,
  Heart,
};

interface SportIconProps {
  iconName: string;
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export function SportIcon({
  iconName,
  size = 24,
  color,
  className,
  strokeWidth = 2,
}: SportIconProps) {
  const Icon = iconMap[iconName] || Heart;
  return <Icon size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}
