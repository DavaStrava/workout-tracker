import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { WorkoutLogger } from './features/WorkoutLogger';
import { History } from './features/History';
import { Analytics } from './features/Analytics';
import { Auth } from './features/Auth';
import { WorkoutProvider, useWorkout } from './hooks/useWorkoutStore';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Button } from './components/Button';
import { signOut } from './services/auth';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workout' | 'history' | 'analytics'>('workout');
  const { user, isLoading } = useWorkout();

  const handleSignOut = async () => {
    await signOut();
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      }}>
        <div className="text-center">
          <div style={{
            height: '48px',
            width: '48px',
            border: '4px solid rgba(255, 255, 255, 0.1)',
            borderTopColor: '#ec4899',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <Auth />;
  }

  // Show main app if authenticated
  return (
    <>
      <ThemeSwitcher />
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <span className="text-sm text-zinc-400">
          {user.displayName || user.email}
        </span>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          size="sm"
        >
          Sign Out
        </Button>
      </div>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'workout' && <WorkoutLogger onNavigate={setActiveTab} />}
        {activeTab === 'history' && <History />}
        {activeTab === 'analytics' && <Analytics />}
      </Layout>
    </>
  );
};

export default function App() {
  return (
    <WorkoutProvider>
      <AppContent />
    </WorkoutProvider>
  );
}
