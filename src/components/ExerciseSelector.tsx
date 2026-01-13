import React from 'react';
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
  // Filter exercises by muscle group and search query
  const filteredExercises = EXERCISES.filter((e: Exercise) => {
    const matchesArea = e.bodyArea === muscleGroup;
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isNotCardio = !e.isCardio;
    return matchesArea && matchesSearch && isNotCardio;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Exercise Grid */}
      {filteredExercises.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
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
