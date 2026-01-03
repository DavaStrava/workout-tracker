import type { Exercise } from '../types';

export const EXERCISES: Exercise[] = [
    // Chest
    { id: 'bench_press', name: 'Bench Press', bodyArea: 'Chest' },
    { id: 'push_up', name: 'Push Up', bodyArea: 'Chest' },
    { id: 'incline_dumbell_press', name: 'Incline Dumbbell Press', bodyArea: 'Chest' },
    // Back
    { id: 'pull_up', name: 'Pull Up', bodyArea: 'Back' },
    { id: 'deadlift', name: 'Deadlift', bodyArea: 'Back' },
    { id: 'lat_pulldown', name: 'Lat Pulldown', bodyArea: 'Back' },
    { id: 'row', name: 'Barbell Row', bodyArea: 'Back' },
    // Legs
    { id: 'squat', name: 'Squat', bodyArea: 'Legs' },
    { id: 'leg_press', name: 'Leg Press', bodyArea: 'Legs' },
    { id: 'lunge', name: 'Lunges', bodyArea: 'Legs' },
    // Shoulders
    { id: 'overhead_press', name: 'Overhead Press', bodyArea: 'Shoulders' },
    { id: 'lateral_raise', name: 'Lateral Raise', bodyArea: 'Shoulders' },
    // Arms
    { id: 'bicep_curl', name: 'Bicep Curl', bodyArea: 'Arms' },
    { id: 'tricep_dip', name: 'Tricep Dip', bodyArea: 'Arms' },
    // Core
    { id: 'plank', name: 'Plank', bodyArea: 'Core' },
    { id: 'crunch', name: 'Crunch', bodyArea: 'Core' },
    // Cardio
    { id: 'running', name: 'Running', bodyArea: 'Cardio', isCardio: true },
    { id: 'cycling', name: 'Cycling', bodyArea: 'Cardio', isCardio: true },
    { id: 'rowing', name: 'Rowing', bodyArea: 'Cardio', isCardio: true },
    { id: 'swimming', name: 'Swimming', bodyArea: 'Cardio', isCardio: true },
    { id: 'elliptical', name: 'Elliptical', bodyArea: 'Cardio', isCardio: true },
    { id: 'jump_rope', name: 'Jump Rope', bodyArea: 'Cardio', isCardio: true },
];
