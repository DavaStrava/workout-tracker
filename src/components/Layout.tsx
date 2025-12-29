import React from 'react';
import { Dumbbell, History as HistoryIcon } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: 'workout' | 'history';
    onTabChange: (tab: 'workout' | 'history') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
    return (
        <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
                <div className="container">
                    {children}
                </div>
            </main>

            <nav className="tab-bar" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                zIndex: 100
            }}>
                <button
                    onClick={() => onTabChange('workout')}
                    className="flex flex-col items-center justify-center p-2"
                    style={{ width: '50%', color: activeTab === 'workout' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                >
                    <Dumbbell size={24} />
                    <span className="text-sm" style={{ marginTop: 4 }}>Workout</span>
                </button>

                <button
                    onClick={() => onTabChange('history')}
                    className="flex flex-col items-center justify-center p-2"
                    style={{ width: '50%', color: activeTab === 'history' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                >
                    <HistoryIcon size={24} />
                    <span className="text-sm" style={{ marginTop: 4 }}>History</span>
                </button>
            </nav>
        </div>
    );
};
