import { useState } from 'react';
import { useWorkout } from '../hooks/useWorkoutStore';
import { EXERCISES } from '../data/exercises';
import { Plus, Check, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../components/Button';
import { CardioFieldInput } from '../components/CardioFieldInput';
import { CardioSportSelector } from './CardioSportSelector';
import { SportIcon } from '../components/SportIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { getSportConfig } from '../data/cardioSports';
import {
  displayToStorage,
  storageToDisplay,
  getComputedValue,
} from '../utils/cardioCalculations';
import type { CardioIntensity, CardioFieldType, WorkoutSet } from '../types';

export function CardioLogger() {
  const {
    activeWorkout,
    finishWorkout,
    cancelWorkout,
    addExercise,
    updateSet,
    updateNotes,
    getExerciseName,
  } = useWorkout();

  const [showSportSelector, setShowSportSelector] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());

  if (!activeWorkout) return null;

  const handleSportSelect = (sportId: string) => {
    // Find the exercise that matches this sport
    const exercise = EXERCISES.find(e => e.sportId === sportId);
    if (exercise) {
      addExercise(exercise.id);
    }
    setShowSportSelector(false);
  };

  const handleBack = () => {
    if (activeWorkout.exercises.length === 0) {
      cancelWorkout();
    } else {
      setShowSportSelector(false);
    }
  };

  const toggleExpanded = (instanceId: string) => {
    setExpandedActivities(prev => {
      const next = new Set(prev);
      if (next.has(instanceId)) {
        next.delete(instanceId);
      } else {
        next.add(instanceId);
      }
      return next;
    });
  };

  // Get sport config for an exercise instance
  const getExerciseSportConfig = (exerciseId: string) => {
    const exercise = EXERCISES.find(e => e.id === exerciseId);
    return exercise?.sportId ? getSportConfig(exercise.sportId) : undefined;
  };

  // Handle field value changes with unit conversion
  const handleFieldChange = (
    instanceId: string,
    setId: string,
    fieldType: CardioFieldType,
    displayValue: number | string,
    sportId?: string
  ) => {
    if (typeof displayValue === 'string') {
      // For stroke type dropdown
      updateSet(instanceId, setId, { [fieldType]: displayValue });
    } else {
      // Convert display value to storage value
      const storageValue = displayToStorage(fieldType, displayValue, sportId);
      updateSet(instanceId, setId, { [fieldType]: storageValue });
    }
  };

  // Get display value for a field
  const getFieldDisplayValue = (
    set: WorkoutSet,
    fieldType: CardioFieldType,
    sportId?: string
  ): number | string | undefined => {
    const storageValue = set[fieldType as keyof WorkoutSet];
    if (storageValue === undefined) return undefined;
    if (typeof storageValue === 'string') return storageValue;
    if (typeof storageValue === 'number') {
      return storageToDisplay(fieldType, storageValue, sportId);
    }
    return undefined;
  };

  // Sport Selector
  if (showSportSelector) {
    return <CardioSportSelector onSelect={handleSportSelect} onBack={handleBack} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '96px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {activeWorkout.name}
          </h1>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '4px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ec4899',
                animation: 'pulse 2s infinite',
              }}
            />
            Cardio Session
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="ghost" size="sm" onClick={cancelWorkout}>
            Cancel
          </Button>
          <Button variant="primary" onClick={finishWorkout}>
            Finish
          </Button>
        </div>
      </div>

      {/* Activities */}
      <AnimatePresence initial={false}>
        {activeWorkout.exercises.map((exerciseInstance) => {
          const set = exerciseInstance.sets[0];
          if (!set) return null;

          const sportConfig = getExerciseSportConfig(exerciseInstance.exerciseId);
          const isExpanded = expandedActivities.has(exerciseInstance.id);

          // Split fields into required and optional
          const requiredFields = sportConfig?.fields.filter(f => f.required) || [];
          const computedFields = sportConfig?.fields.filter(f => f.isComputed) || [];
          const optionalFields = sportConfig?.fields.filter(f => !f.required && !f.isComputed) || [];

          return (
            <motion.div
              key={exerciseInstance.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: 'rgba(30, 27, 50, 0.8)',
                border: `1px solid ${sportConfig?.color || 'rgba(255, 255, 255, 0.1)'}30`,
                borderRadius: '24px',
                padding: '24px',
              }}
            >
              {/* Activity Header */}
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#fff',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: `${sportConfig?.color || '#ec4899'}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SportIcon
                    iconName={sportConfig?.icon || 'Heart'}
                    size={22}
                    color={sportConfig?.color || '#ec4899'}
                  />
                </div>
                {getExerciseName(exerciseInstance.exerciseId)}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Required Fields */}
                {requiredFields.map((field) => (
                  <CardioFieldInput
                    key={field.type}
                    field={field}
                    value={getFieldDisplayValue(set, field.type, sportConfig?.id)}
                    onChange={(value) =>
                      handleFieldChange(
                        exerciseInstance.id,
                        set.id,
                        field.type,
                        value,
                        sportConfig?.id
                      )
                    }
                  />
                ))}

                {/* Computed Fields (read-only) */}
                {computedFields.map((field) => (
                  <CardioFieldInput
                    key={field.type}
                    field={field}
                    value={undefined}
                    computedValue={getComputedValue(
                      field.type,
                      set.distance,
                      set.duration,
                      sportConfig?.id || ''
                    )}
                    onChange={() => {}}
                    disabled
                  />
                ))}

                {/* Intensity */}
                <div>
                  <label
                    id={`intensity-label-${exerciseInstance.id}`}
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '10px',
                      display: 'block',
                    }}
                  >
                    Intensity
                  </label>
                  <div
                    role="group"
                    aria-labelledby={`intensity-label-${exerciseInstance.id}`}
                    style={{ display: 'flex', gap: '10px' }}
                  >
                    {(['low', 'medium', 'high'] as CardioIntensity[]).map((level) => {
                      const isActive = set.intensity === level;
                      const colors = {
                        low: {
                          bg: 'rgba(34, 197, 94, 0.2)',
                          border: 'rgba(34, 197, 94, 0.5)',
                          text: '#22c55e',
                        },
                        medium: {
                          bg: 'rgba(245, 158, 11, 0.2)',
                          border: 'rgba(245, 158, 11, 0.5)',
                          text: '#f59e0b',
                        },
                        high: {
                          bg: 'rgba(239, 68, 68, 0.2)',
                          border: 'rgba(239, 68, 68, 0.5)',
                          text: '#ef4444',
                        },
                      };
                      return (
                        <button
                          key={level}
                          aria-pressed={isActive}
                          aria-label={`${level} intensity`}
                          onClick={() =>
                            updateSet(exerciseInstance.id, set.id, { intensity: level })
                          }
                          style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '14px',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            background: isActive
                              ? colors[level].bg
                              : 'rgba(255, 255, 255, 0.05)',
                            border: isActive
                              ? `1px solid ${colors[level].border}`
                              : '1px solid rgba(255, 255, 255, 0.1)',
                            color: isActive ? colors[level].text : 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Expand/Collapse for optional fields */}
                {optionalFields.length > 0 && (
                  <>
                    <button
                      onClick={() => toggleExpanded(exerciseInstance.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      {isExpanded ? 'Hide Details' : 'More Details'}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            overflow: 'hidden',
                          }}
                        >
                          {optionalFields.map((field) => (
                            <CardioFieldInput
                              key={field.type}
                              field={field}
                              value={getFieldDisplayValue(set, field.type, sportConfig?.id)}
                              onChange={(value) =>
                                handleFieldChange(
                                  exerciseInstance.id,
                                  set.id,
                                  field.type,
                                  value,
                                  sportConfig?.id
                                )
                              }
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}

                {/* Completed toggle */}
                <button
                  aria-pressed={set.completed}
                  aria-label={set.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  onClick={() =>
                    updateSet(exerciseInstance.id, set.id, { completed: !set.completed })
                  }
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '16px',
                    fontWeight: 600,
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    border: 'none',
                    background: set.completed
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: set.completed ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                    boxShadow: set.completed ? '0 8px 20px rgba(16, 185, 129, 0.3)' : 'none',
                  }}
                >
                  <Check size={18} />
                  {set.completed ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Notes Section */}
      <div
        style={{
          background: 'rgba(30, 27, 50, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <MessageSquare size={18} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
          <label
            style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)' }}
          >
            Session Notes
          </label>
        </div>
        <textarea
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '14px',
            color: '#fff',
            fontSize: '15px',
            resize: 'none',
            outline: 'none',
          }}
          rows={3}
          placeholder="How did you feel? Any notes..."
          value={activeWorkout.notes || ''}
          onChange={(e) => updateNotes(e.target.value)}
        />
      </div>

      {/* Add Activity */}
      <button
        onClick={() => setShowSportSelector(true)}
        style={{
          width: '100%',
          height: '60px',
          borderRadius: '20px',
          background: 'rgba(30, 27, 50, 0.8)',
          border: '2px dashed rgba(255, 255, 255, 0.15)',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '16px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <Plus size={22} />
        Add Activity
      </button>
    </div>
  );
}
