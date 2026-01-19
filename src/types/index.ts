export type BodyArea =
  | 'Chest'
  | 'Shoulders'
  | 'Arms'
  | 'Abdomen'
  | 'Back'
  | 'Glutes'
  | 'Legs'
  | 'Cardio';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'resistance_band'
  | 'ez_bar';

export type WorkoutType = 'STRENGTH' | 'CARDIO' | 'HIIT';
export type CardioIntensity = 'low' | 'medium' | 'high';
export type SwimmingStrokeType = 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'mixed';

// Sport-specific field types for cardio activities
export type CardioFieldType =
  | 'distance'      // meters (stored), km (displayed)
  | 'duration'      // seconds (stored), min:sec (displayed)
  | 'pace'          // computed: min/km
  | 'speed'         // computed: km/h
  | 'heartRate'     // bpm
  | 'calories'      // kcal
  | 'elevation'     // meters
  | 'cadence'       // steps or strokes per minute
  | 'laps'          // count
  | 'strokeType'    // swimming only
  | 'strokeRate'    // strokes per minute
  | 'strokes';      // total stroke count

// Field configuration for dynamic form rendering
export interface CardioFieldConfig {
  type: CardioFieldType;
  label: string;
  unit: string;
  required: boolean;
  isComputed?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

// Sport definition with icon and fields
export interface CardioSportConfig {
  id: string;
  name: string;
  icon: string;    // lucide-react icon name
  color: string;   // theme color for the sport
  fields: CardioFieldConfig[];
}

export interface Exercise {
  id: string;
  name: string;
  bodyArea: BodyArea;
  secondaryAreas?: BodyArea[];  // Secondary muscle groups targeted
  equipment?: Equipment;
  isCardio?: boolean;
  sportId?: string;  // Links to CardioSportConfig for cardio exercises
}

export interface WorkoutSet {
  id: string;
  // Strength fields
  reps?: number;
  weight?: number;
  // Core cardio fields
  distance?: number;           // meters
  duration?: number;           // seconds
  intensity?: CardioIntensity;
  // Extended cardio metrics
  heartRate?: number;          // bpm
  calories?: number;           // kcal
  elevation?: number;          // meters (gain)
  cadence?: number;            // per minute (steps, strokes, rpm)
  laps?: number;               // count
  strokeType?: SwimmingStrokeType;
  strokeRate?: number;         // strokes per minute
  strokes?: number;            // total strokes
  pace?: number;               // seconds per km (stored for imports)
  avgSpeed?: number;           // km/h (stored for imports)
  completed: boolean;
}

export interface WorkoutExercise {
  id: string; /* Instance ID in the workout */
  exerciseId: string;
  sets: WorkoutSet[];
  addedAt?: number; /* Timestamp when exercise was added to workout */
}

export interface Workout {
  id: string;
  name: string;
  type: WorkoutType;
  startTime: number;
  endTime?: number;
  // Timer fields
  pausedAt?: number;        // Timestamp when current pause started (undefined = not paused)
  totalPausedTime: number;  // Cumulative seconds spent paused (default: 0)
  duration?: number;        // Final workout duration in seconds (set on finish, excludes pauses)
  exercises: WorkoutExercise[];
  notes?: string;
  status: 'active' | 'completed';
  deletedAt?: number;  // Timestamp when soft-deleted (7-day retention)
  routineId?: string;  // If workout was saved as/from a routine
  fromRoutine?: boolean;  // True if started from a routine (shows checkmarks for planned vs completed sets)
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
