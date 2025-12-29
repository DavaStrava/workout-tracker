export type BodyArea = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio';

export interface Exercise {
  id: string;
  name: string;
  bodyArea: BodyArea;
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
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
  startTime: number;
  endTime?: number;
  exercises: WorkoutExercise[];
  status: 'active' | 'completed';
}

export interface UserHistory {
  workouts: Workout[];
}
