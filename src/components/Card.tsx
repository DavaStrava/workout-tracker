import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/styles';

interface CardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    variant?: 'default' | 'glass' | 'outline' | 'gradient' | 'elevated' | 'floating';
    gradient?: 'orange-pink' | 'pink-purple' | 'purple-blue' | 'teal-cyan' | 'none';
}

const gradientBackgrounds = {
    'orange-pink': 'rgba(30, 27, 50, 0.8)',
    'pink-purple': 'rgba(30, 27, 50, 0.8)',
    'purple-blue': 'rgba(30, 27, 50, 0.8)',
    'teal-cyan': 'rgba(30, 27, 50, 0.8)',
    'none': 'transparent',
};

const gradientBorders = {
    'orange-pink': 'rgba(249, 115, 22, 0.3)',
    'pink-purple': 'rgba(236, 72, 153, 0.3)',
    'purple-blue': 'rgba(168, 85, 247, 0.3)',
    'teal-cyan': 'rgba(6, 182, 212, 0.3)',
    'none': 'rgba(255, 255, 255, 0.1)',
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
                background: 'rgba(30, 27, 50, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            } :
            variant === 'default' ? {
                background: 'rgba(30, 27, 50, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            } :
            variant === 'outline' ? {
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'transparent',
            } :
            variant === 'elevated' ? {
                background: 'rgba(30, 27, 50, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            } :
            variant === 'floating' ? {
                background: 'rgba(30, 27, 50, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            } :
            variant === 'gradient' ? {
                background: gradientBackgrounds[gradient],
                border: `1px solid ${gradientBorders[gradient]}`,
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
