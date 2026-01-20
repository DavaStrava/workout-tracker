import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import type { BodyArea, Exercise } from '../types';
import { EXERCISES } from '../data/exercises';
import { ExerciseCard } from './ExerciseCard';
import { Input } from './Input';

interface ExerciseSelectorProps {
  muscleGroup: BodyArea;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectExercise: (exerciseId: string) => void;
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  muscleGroup,
  searchQuery,
  onSearchChange,
  onSelectExercise,
}) => {
  // Filter exercises by muscle group and search query (memoized for performance)
  const filteredExercises = useMemo(() =>
    EXERCISES.filter((e: Exercise) => {
      const matchesArea = e.bodyArea === muscleGroup;
      const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
      const isNotCardio = !e.isCardio;
      return matchesArea && matchesSearch && isNotCardio;
    }),
    [muscleGroup, searchQuery]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
        <Input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 w-full"
          style={{ fontSize: '16px', padding: '16px 16px 16px 48px' }}
        />
      </div>

      {/* Exercise Grid */}
      {filteredExercises.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}
        >
          {filteredExercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onSelect={onSelectExercise}
              index={index}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-8">
          <p className="text-white/50">No exercises found</p>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="mt-2 text-sm text-orange-400 hover:text-orange-300"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseSelector;
