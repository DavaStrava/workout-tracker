import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, RefreshCw } from 'lucide-react';

export interface ToastData {
    id: string;
    message: string;
    type: 'error' | 'success' | 'info';
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastProps {
    toast: ToastData;
    onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    const bgColor = toast.type === 'error'
        ? 'rgba(239, 68, 68, 0.15)'
        : toast.type === 'success'
            ? 'rgba(16, 185, 129, 0.15)'
            : 'rgba(59, 130, 246, 0.15)';

    const borderColor = toast.type === 'error'
        ? 'rgba(239, 68, 68, 0.3)'
        : toast.type === 'success'
            ? 'rgba(16, 185, 129, 0.3)'
            : 'rgba(59, 130, 246, 0.3)';

    const iconColor = toast.type === 'error'
        ? '#ef4444'
        : toast.type === 'success'
            ? '#10b981'
            : '#3b82f6';

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: bgColor,
                border: `1px solid ${borderColor}`,
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            }}
        >
            <AlertCircle size={20} style={{ color: iconColor, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '14px', color: '#fff' }}>
                {toast.message}
            </span>
            {toast.action && (
                <button
                    onClick={toast.action.onClick}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                >
                    <RefreshCw size={14} />
                    {toast.action.label}
                </button>
            )}
            <button
                onClick={() => onDismiss(toast.id)}
                style={{
                    padding: '4px',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                aria-label="Dismiss"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

interface ToastContainerProps {
    toasts: ToastData[];
    onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '0 16px',
                width: '100%',
                maxWidth: '432px',
                pointerEvents: 'none',
            }}
        >
            <AnimatePresence mode="sync">
                {toasts.map(toast => (
                    <div key={toast.id} style={{ pointerEvents: 'auto' }}>
                        <Toast toast={toast} onDismiss={onDismiss} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// Hook for managing toasts
export const useToast = () => {
    const [toasts, setToasts] = React.useState<ToastData[]>([]);

    const addToast = React.useCallback((toast: Omit<ToastData, 'id'>) => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { ...toast, id }]);

        // Auto-dismiss after 5 seconds if no action
        if (!toast.action) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 5000);
        }

        return id;
    }, []);

    const dismissToast = React.useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const dismissAll = React.useCallback(() => {
        setToasts([]);
    }, []);

    return { toasts, addToast, dismissToast, dismissAll };
};
