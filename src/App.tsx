import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { WorkoutLogger } from './features/WorkoutLogger';
import { History } from './features/History';
import { Analytics } from './features/Analytics';
import { WorkoutProvider } from './hooks/useWorkoutStore';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workout' | 'history' | 'analytics'>('workout');

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'workout' && <WorkoutLogger />}
      {activeTab === 'history' && <History />}
      {activeTab === 'analytics' && <Analytics />}
    </Layout>
  );
};

export default function App() {
  return (
    <WorkoutProvider>
      <AppContent />
    </WorkoutProvider>
  );
}
