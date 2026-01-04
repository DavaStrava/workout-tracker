import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/styles';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass' | 'gradient' | 'accent';
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
    isLoading?: boolean;
}

const buttonStyles: Record<string, React.CSSProperties> = {
    primary: {
        background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
        color: '#fff',
        boxShadow: '0 10px 25px rgba(249, 115, 22, 0.3)',
    },
    gradient: {
        background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #a855f7 100%)',
        color: '#fff',
        boxShadow: '0 10px 25px rgba(236, 72, 153, 0.4)',
    },
    accent: {
        background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
        color: '#fff',
        boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)',
    },
    secondary: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(8px)',
    },
    ghost: {
        background: 'transparent',
        color: 'rgba(255, 255, 255, 0.7)',
    },
    danger: {
        background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
        color: '#fff',
        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
    },
    glass: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff',
    },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, style, ...props }, ref) => {
        const sizeStyles: React.CSSProperties =
            size === 'sm' ? { height: '36px', padding: '0 16px', fontSize: '14px', borderRadius: '8px' } :
            size === 'md' ? { height: '48px', padding: '0 24px', fontSize: '16px', borderRadius: '12px' } :
            size === 'lg' ? { height: '56px', padding: '0 32px', fontSize: '18px', borderRadius: '16px' } :
            size === 'xl' ? { height: '64px', padding: '0 40px', fontSize: '20px', borderRadius: '16px' } :
            { height: '48px', width: '48px', padding: '0', borderRadius: '12px' };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className={cn('btn-spotify', className)}
                style={{
                    ...buttonStyles[variant],
                    ...sizeStyles,
                    ...style,
                }}
                disabled={isLoading}
                {...props}
            >
                {isLoading ? (
                    <div style={{
                        height: '20px',
                        width: '20px',
                        border: '2px solid currentColor',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '8px'
                    }} />
                ) : null}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
