import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/styles';

interface CardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    variant?: 'default' | 'glass' | 'outline' | 'gradient' | 'elevated' | 'floating';
    gradient?: 'orange-pink' | 'pink-purple' | 'purple-blue' | 'teal-cyan' | 'none';
}

const gradientBackgrounds = {
    'orange-pink': 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(236, 72, 153, 0.2) 50%, rgba(168, 85, 247, 0.1) 100%)',
    'pink-purple': 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.2) 50%, rgba(59, 130, 246, 0.1) 100%)',
    'purple-blue': 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(6, 182, 212, 0.1) 100%)',
    'teal-cyan': 'linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(6, 182, 212, 0.2) 50%, rgba(59, 130, 246, 0.1) 100%)',
    'none': 'transparent',
};

const gradientBorders = {
    'orange-pink': 'rgba(249, 115, 22, 0.3)',
    'pink-purple': 'rgba(236, 72, 153, 0.3)',
    'purple-blue': 'rgba(168, 85, 247, 0.3)',
    'teal-cyan': 'rgba(6, 182, 212, 0.3)',
    'none': 'rgba(255, 255, 255, 0.1)',
};

const gradientShadows = {
    'orange-pink': '0 10px 30px rgba(249, 115, 22, 0.2)',
    'pink-purple': '0 10px 30px rgba(236, 72, 153, 0.2)',
    'purple-blue': '0 10px 30px rgba(168, 85, 247, 0.2)',
    'teal-cyan': '0 10px 30px rgba(6, 182, 212, 0.2)',
    'none': '0 4px 6px rgba(0, 0, 0, 0.1)',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, variant = 'glass', gradient = 'none', style, ...props }, ref) => {
        const baseStyle: React.CSSProperties = {
            borderRadius: '24px',
            padding: '24px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            color: 'var(--color-text-main)',
        };

        const variantStyle: React.CSSProperties =
            variant === 'glass' ? {
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            } :
            variant === 'default' ? {
                background: 'rgba(24, 24, 27, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            } :
            variant === 'outline' ? {
                border: '2px solid rgba(255, 255, 255, 0.2)',
                background: 'transparent',
            } :
            variant === 'elevated' ? {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            } :
            variant === 'floating' ? {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(236, 72, 153, 0.2)',
            } :
            variant === 'gradient' ? {
                background: gradientBackgrounds[gradient],
                backdropFilter: 'blur(12px)',
                border: `1px solid ${gradientBorders[gradient]}`,
                boxShadow: gradientShadows[gradient],
            } : {};

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={cn('card-spotify', className)}
                style={{
                    ...baseStyle,
                    ...variantStyle,
                    ...style,
                }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = 'Card';
