import React from 'react';
import { Dumbbell, History as HistoryIcon, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/styles';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: 'workout' | 'history' | 'analytics';
    onTabChange: (tab: 'workout' | 'history' | 'analytics') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
    return (
        <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg-app text-text-main relative">
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                <div className="container min-h-full">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '90px',
                zIndex: 50,
                padding: '8px 16px',
            }}>
                <div style={{
                    margin: '0 auto',
                    maxWidth: '448px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: '0 12px',
                    marginBottom: '16px',
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(236, 72, 153, 0.2) 50%, rgba(168, 85, 247, 0.2) 100%)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)',
                }}>
                    <button
                        onClick={() => onTabChange('workout')}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            borderRadius: '16px',
                            transition: 'all 0.3s',
                            position: 'relative',
                            overflow: 'hidden',
                            color: activeTab === 'workout' ? '#fb923c' : 'rgba(255, 255, 255, 0.4)',
                            transform: activeTab === 'workout' ? 'scale(1.1)' : 'scale(1)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        {activeTab === 'workout' && (
                            <motion.div
                                layoutId="nav-glow"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)',
                                    borderRadius: '16px',
                                }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <Dumbbell size={26} strokeWidth={activeTab === 'workout' ? 2.5 : 2} style={{ position: 'relative', zIndex: 10 }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px', position: 'relative', zIndex: 10 }}>Workout</span>
                    </button>

                    <button
                        onClick={() => onTabChange('analytics')}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            borderRadius: '16px',
                            transition: 'all 0.3s',
                            position: 'relative',
                            overflow: 'hidden',
                            color: activeTab === 'analytics' ? '#f472b6' : 'rgba(255, 255, 255, 0.4)',
                            transform: activeTab === 'analytics' ? 'scale(1.1)' : 'scale(1)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        {activeTab === 'analytics' && (
                            <motion.div
                                layoutId="nav-glow"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)',
                                    borderRadius: '16px',
                                }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <BarChart2 size={26} strokeWidth={activeTab === 'analytics' ? 2.5 : 2} style={{ position: 'relative', zIndex: 10 }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px', position: 'relative', zIndex: 10 }}>Analytics</span>
                    </button>

                    <button
                        onClick={() => onTabChange('history')}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            borderRadius: '16px',
                            transition: 'all 0.3s',
                            position: 'relative',
                            overflow: 'hidden',
                            color: activeTab === 'history' ? '#c084fc' : 'rgba(255, 255, 255, 0.4)',
                            transform: activeTab === 'history' ? 'scale(1.1)' : 'scale(1)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        {activeTab === 'history' && (
                            <motion.div
                                layoutId="nav-glow"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',
                                    borderRadius: '16px',
                                }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <HistoryIcon size={26} strokeWidth={activeTab === 'history' ? 2.5 : 2} style={{ position: 'relative', zIndex: 10 }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px', position: 'relative', zIndex: 10 }}>History</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};
