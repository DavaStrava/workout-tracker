import React from 'react';
import { cn } from '../utils/styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-zinc-400 ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex w-full rounded-xl px-4 py-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all text-white',
                        error && 'border-red-500/50 focus-visible:ring-red-500',
                        className
                    )}
                    style={{
                        background: 'rgba(30, 27, 50, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-500 ml-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
