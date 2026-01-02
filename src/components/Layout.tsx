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

            <nav className="fixed bottom-0 left-0 right-0 h-[80px] z-50 px-4 pb-safe pt-2">
                <div className="glass-panel mx-auto max-w-md h-16 flex items-center justify-around px-2 mb-4 bg-black/40 backdrop-blur-xl border-white/5 shadow-2xl">
                    <button
                        onClick={() => onTabChange('workout')}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full rounded-xl transition-all duration-300 relative overflow-hidden",
                            activeTab === 'workout' ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        {activeTab === 'workout' && (
                            <motion.div
                                layoutId="nav-glow"
                                className="absolute inset-0 bg-blue-500/10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <Dumbbell size={24} strokeWidth={activeTab === 'workout' ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-1">Workout</span>
                    </button>

                    <button
                        onClick={() => onTabChange('analytics')}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full rounded-xl transition-all duration-300 relative overflow-hidden",
                            activeTab === 'analytics' ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        {activeTab === 'analytics' && (
                            <motion.div
                                layoutId="nav-glow"
                                className="absolute inset-0 bg-blue-500/10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <BarChart2 size={24} strokeWidth={activeTab === 'analytics' ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-1">Analytics</span>
                    </button>

                    <button
                        onClick={() => onTabChange('history')}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full rounded-xl transition-all duration-300 relative overflow-hidden",
                            activeTab === 'history' ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        {activeTab === 'history' && (
                            <motion.div
                                layoutId="nav-glow"
                                className="absolute inset-0 bg-blue-500/10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <HistoryIcon size={24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-1">History</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};
