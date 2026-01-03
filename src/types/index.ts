export type BodyArea = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio';

export type WorkoutType = 'STRENGTH' | 'CARDIO' | 'HIIT';
export type CardioIntensity = 'low' | 'medium' | 'high';

export interface Exercise {
  id: string;
  name: string;
  bodyArea: BodyArea;
  isCardio?: boolean;
}

export interface WorkoutSet {
  id: string;
  reps?: number;        // Strength
  weight?: number;      // Strength
  distance?: number;    // Cardio (meters)
  duration?: number;    // Cardio (seconds)
  intensity?: CardioIntensity;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string; /* Instance ID in the workout */
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  type: WorkoutType;
  startTime: number;
  endTime?: number;
  exercises: WorkoutExercise[];
  notes?: string;
  status: 'active' | 'completed';
}

export interface UserHistory {
  workouts: Workout[];
}

export interface RoutineExercise {
  exerciseId: string;
  sets: number; // Number of sets to initialize
}

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
}
