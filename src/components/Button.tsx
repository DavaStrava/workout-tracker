import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/styles';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-background transition-all',
                    // Variants
                    variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20',
                    variant === 'secondary' && 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-white/10',
                    variant === 'ghost' && 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5',
                    variant === 'danger' && 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20',
                    variant === 'glass' && 'glass-panel hover:bg-white/5 active:bg-white/10',

                    // Sizes
                    size === 'sm' && 'h-8 px-3 text-xs rounded-lg',
                    size === 'md' && 'h-11 px-4 text-sm rounded-xl',
                    size === 'lg' && 'h-12 px-6 text-base rounded-2xl',
                    size === 'icon' && 'h-11 w-11 p-0 rounded-xl',
                    className
                )}
                disabled={isLoading}
                {...props}
            >
                {isLoading ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
