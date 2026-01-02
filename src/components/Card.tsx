import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/styles';

interface CardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    variant?: 'default' | 'glass' | 'outline';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, variant = 'glass', ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                    'rounded-2xl p-4 transition-all',
                    variant === 'glass' && 'glass-panel text-main',
                    variant === 'default' && 'bg-zinc-900 border border-white/10 text-main',
                    variant === 'outline' && 'border border-white/20 bg-transparent text-main',
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = 'Card';
