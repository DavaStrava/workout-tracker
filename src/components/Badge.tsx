import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'gradient' | 'solid' | 'outline' | 'glow';
    color?: 'orange' | 'pink' | 'purple' | 'cyan' | 'green' | 'yellow';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const gradientColors = {
    orange: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
    pink: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
    purple: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
    cyan: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    green: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    yellow: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
};

const solidColors = {
    orange: '#f97316',
    pink: '#ec4899',
    purple: '#a855f7',
    cyan: '#06b6d4',
    green: '#10b981',
    yellow: '#fbbf24',
};

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'gradient',
    color = 'orange',
    size = 'md',
    className = '',
}) => {
    const sizeStyles: React.CSSProperties =
        size === 'sm' ? { padding: '4px 10px', fontSize: '12px' } :
        size === 'md' ? { padding: '6px 16px', fontSize: '14px' } :
        { padding: '8px 24px', fontSize: '16px' };

    const variantStyles: React.CSSProperties =
        variant === 'gradient' ? {
            background: gradientColors[color],
            color: '#fff',
            boxShadow: `0 8px 20px ${solidColors[color]}40`,
        } :
        variant === 'solid' ? {
            background: solidColors[color],
            color: '#fff',
        } :
        variant === 'outline' ? {
            background: `${solidColors[color]}1A`,
            color: solidColors[color],
            border: `2px solid ${solidColors[color]}`,
        } :
        {
            background: `${solidColors[color]}33`,
            color: `${solidColors[color]}`,
            border: `1px solid ${solidColors[color]}80`,
            boxShadow: `0 8px 20px ${solidColors[color]}80`,
        };

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                borderRadius: '9999px',
                ...sizeStyles,
                ...variantStyles,
            }}
        >
            {children}
        </motion.div>
    );
};


interface StatCardProps {
    label: string;
    value: string | number;
    gradient?: 'orange-pink' | 'pink-purple' | 'purple-blue' | 'cyan-blue';
    icon?: React.ReactNode;
    className?: string;
}

const gradientMap = {
    'orange-pink': 'linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(236, 72, 153, 0.2) 100%)',
    'pink-purple': 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.2) 100%)',
    'purple-blue': 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)',
    'cyan-blue': 'linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)',
};

const borderColorMap = {
    'orange-pink': 'rgba(249, 115, 22, 0.3)',
    'pink-purple': 'rgba(236, 72, 153, 0.3)',
    'purple-blue': 'rgba(168, 85, 247, 0.3)',
    'cyan-blue': 'rgba(6, 182, 212, 0.3)',
};

const shadowColorMap = {
    'orange-pink': 'rgba(249, 115, 22, 0.2)',
    'pink-purple': 'rgba(236, 72, 153, 0.2)',
    'purple-blue': 'rgba(168, 85, 247, 0.2)',
    'cyan-blue': 'rgba(6, 182, 212, 0.2)',
};

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    gradient = 'orange-pink',
    icon,
    className = '',
}) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className={className}
            style={{
                borderRadius: '16px',
                padding: '16px',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${borderColorMap[gradient]}`,
                background: gradientMap[gradient],
                boxShadow: `0 10px 25px ${shadowColorMap[gradient]}`,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {icon && <div style={{ marginBottom: '8px', opacity: 0.8 }}>{icon}</div>}
            <div style={{
                fontSize: '32px',
                fontWeight: 900,
                marginBottom: '4px',
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
            }}>
                {value}
            </div>
            <div style={{
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'rgba(255, 255, 255, 0.6)',
            }}>
                {label}
            </div>
        </motion.div>
    );
};
