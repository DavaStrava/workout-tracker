import React from 'react';
import { Card } from './Card';
import type { RecoveryStats, MuscleRecoveryData } from '../utils/recoveryHelpers';
import { formatTimeToRecovery } from '../utils/recoveryHelpers';
import { Activity } from 'lucide-react';

interface RecoveryStatusCardProps {
  stats: RecoveryStats;
  hasWorkoutHistory: boolean;
}

export const RecoveryStatusCard: React.FC<RecoveryStatusCardProps> = ({ stats, hasWorkoutHistory }) => {
  // Group muscles by recovery status
  const muscleEntries = Object.values(stats.muscleData) as MuscleRecoveryData[];

  const fullyRecovered = muscleEntries.filter(m => m.recoveryPercent >= 100);
  const okToTrain = muscleEntries.filter(m => m.recoveryPercent >= 80 && m.recoveryPercent < 100);
  const recovering = muscleEntries.filter(m => m.recoveryPercent < 80);

  // Format last workout time
  const formatLastWorkout = () => {
    if (stats.lastWorkoutDaysAgo === null) return null;
    if (stats.lastWorkoutDaysAgo === 0) {
      // Find the most recent muscle data to get hours
      const mostRecent = muscleEntries
        .filter(m => m.hoursSinceTraining !== null)
        .sort((a, b) => (a.hoursSinceTraining || 0) - (b.hoursSinceTraining || 0))[0];
      if (mostRecent && mostRecent.hoursSinceTraining !== null && mostRecent.hoursSinceTraining < 24) {
        return `${Math.round(mostRecent.hoursSinceTraining)} hours ago`;
      }
      return 'Today';
    }
    if (stats.lastWorkoutDaysAgo === 1) return 'Yesterday';
    return `${stats.lastWorkoutDaysAgo} days ago`;
  };

  // Empty state - no workout history
  if (!hasWorkoutHistory) {
    return (
      <Card variant="default" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Activity size={24} style={{ color: '#a855f7' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Recovery Status</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px', fontWeight: 500 }}>
            No recovery data yet
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
            Start your first workout to see muscle recovery status
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Activity size={24} style={{ color: '#a855f7' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Recovery Status</h2>
      </div>

      {/* Ready (100%) */}
      {fullyRecovered.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)',
            }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e' }}>
              Ready (100%)
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingLeft: '18px' }}>
            {fullyRecovered.map(m => (
              <span
                key={m.muscleGroup}
                style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#22c55e',
                }}
              >
                {m.muscleGroup}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* OK to Train (80-99%) */}
      {okToTrain.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#eab308',
              boxShadow: '0 0 8px rgba(234, 179, 8, 0.5)',
            }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#eab308' }}>
              OK to Train (80%+)
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingLeft: '18px' }}>
            {okToTrain.map(m => (
              <span
                key={m.muscleGroup}
                style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  background: 'rgba(234, 179, 8, 0.15)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#eab308',
                }}
              >
                {m.muscleGroup}
                {m.hoursSinceTraining !== null && (
                  <span style={{ opacity: 0.7, marginLeft: '4px' }}>
                    ({formatTimeToRecovery(m.hoursSinceTraining, 100)} left)
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recovering (<80%) */}
      {recovering.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#ef4444',
              boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)',
            }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#ef4444' }}>
              Recovering
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingLeft: '18px' }}>
            {recovering.map(m => (
              <span
                key={m.muscleGroup}
                style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#ef4444',
                }}
              >
                {m.muscleGroup}
                {m.hoursSinceTraining !== null && (
                  <span style={{ opacity: 0.7, marginLeft: '4px' }}>
                    ({formatTimeToRecovery(m.hoursSinceTraining, 80)} left)
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Last workout info */}
      {formatLastWorkout() && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.5)',
        }}>
          Last strength workout: {formatLastWorkout()}
        </div>
      )}
    </Card>
  );
};
