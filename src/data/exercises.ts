import type { Exercise } from '../types';

export const EXERCISES: Exercise[] = [
  // Chest (4 exercises)
  { id: 'bench_press', name: 'Bench Press', bodyArea: 'Chest' },
  { id: 'push_up', name: 'Push Up', bodyArea: 'Chest' },
  { id: 'incline_dumbell_press', name: 'Incline Dumbbell Press', bodyArea: 'Chest' },
  { id: 'cable_fly', name: 'Cable Fly', bodyArea: 'Chest' },

  // Upper Back (3 exercises)
  { id: 'row', name: 'Barbell Row', bodyArea: 'Upper Back' },
  { id: 'seated_row', name: 'Seated Cable Row', bodyArea: 'Upper Back' },
  { id: 'tbar_row', name: 'T-Bar Row', bodyArea: 'Upper Back' },

  // Lats (3 exercises)
  { id: 'pull_up', name: 'Pull Up', bodyArea: 'Lats' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', bodyArea: 'Lats' },
  { id: 'straight_arm_pulldown', name: 'Straight Arm Pulldown', bodyArea: 'Lats' },

  // Traps (2 exercises)
  { id: 'shrugs', name: 'Shrugs', bodyArea: 'Traps' },
  { id: 'face_pull', name: 'Face Pull', bodyArea: 'Traps' },

  // Lower Back (2 exercises)
  { id: 'deadlift', name: 'Deadlift', bodyArea: 'Lower Back' },
  { id: 'back_extension', name: 'Back Extension', bodyArea: 'Lower Back' },

  // Shoulders (4 exercises)
  { id: 'overhead_press', name: 'Overhead Press', bodyArea: 'Shoulders' },
  { id: 'lateral_raise', name: 'Lateral Raise', bodyArea: 'Shoulders' },
  { id: 'front_raise', name: 'Front Raise', bodyArea: 'Shoulders' },
  { id: 'rear_delt_fly', name: 'Rear Delt Fly', bodyArea: 'Shoulders' },

  // Biceps (3 exercises)
  { id: 'bicep_curl', name: 'Bicep Curl', bodyArea: 'Biceps' },
  { id: 'hammer_curl', name: 'Hammer Curl', bodyArea: 'Biceps' },
  { id: 'preacher_curl', name: 'Preacher Curl', bodyArea: 'Biceps' },

  // Triceps (3 exercises)
  { id: 'tricep_dip', name: 'Tricep Dip', bodyArea: 'Triceps' },
  { id: 'tricep_pushdown', name: 'Tricep Pushdown', bodyArea: 'Triceps' },
  { id: 'skull_crusher', name: 'Skull Crusher', bodyArea: 'Triceps' },

  // Forearms (2 exercises)
  { id: 'wrist_curl', name: 'Wrist Curl', bodyArea: 'Forearms' },
  { id: 'reverse_curl', name: 'Reverse Curl', bodyArea: 'Forearms' },

  // Quads (4 exercises)
  { id: 'squat', name: 'Squat', bodyArea: 'Quads' },
  { id: 'leg_press', name: 'Leg Press', bodyArea: 'Quads' },
  { id: 'leg_extension', name: 'Leg Extension', bodyArea: 'Quads' },
  { id: 'lunge', name: 'Lunges', bodyArea: 'Quads' },

  // Hamstrings (2 exercises)
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', bodyArea: 'Hamstrings' },
  { id: 'leg_curl', name: 'Leg Curl', bodyArea: 'Hamstrings' },

  // Glutes (3 exercises)
  { id: 'hip_thrust', name: 'Hip Thrust', bodyArea: 'Glutes' },
  { id: 'glute_bridge', name: 'Glute Bridge', bodyArea: 'Glutes' },
  { id: 'cable_kickback', name: 'Cable Kickback', bodyArea: 'Glutes' },

  // Calves (2 exercises)
  { id: 'calf_raise', name: 'Calf Raise', bodyArea: 'Calves' },
  { id: 'seated_calf_raise', name: 'Seated Calf Raise', bodyArea: 'Calves' },

  // Abs (3 exercises)
  { id: 'crunch', name: 'Crunch', bodyArea: 'Abs' },
  { id: 'leg_raise', name: 'Leg Raise', bodyArea: 'Abs' },
  { id: 'plank', name: 'Plank', bodyArea: 'Abs' },

  // Obliques (3 exercises)
  { id: 'russian_twist', name: 'Russian Twist', bodyArea: 'Obliques' },
  { id: 'side_plank', name: 'Side Plank', bodyArea: 'Obliques' },
  { id: 'woodchop', name: 'Cable Woodchop', bodyArea: 'Obliques' },

  // Cardio (11 exercises)
  { id: 'running', name: 'Running', bodyArea: 'Cardio', isCardio: true, sportId: 'running' },
  { id: 'cycling', name: 'Cycling', bodyArea: 'Cardio', isCardio: true, sportId: 'cycling' },
  { id: 'swimming', name: 'Swimming', bodyArea: 'Cardio', isCardio: true, sportId: 'swimming' },
  { id: 'rowing', name: 'Rowing', bodyArea: 'Cardio', isCardio: true, sportId: 'rowing' },
  { id: 'walking', name: 'Walking', bodyArea: 'Cardio', isCardio: true, sportId: 'walking' },
  { id: 'hiking', name: 'Hiking', bodyArea: 'Cardio', isCardio: true, sportId: 'hiking' },
  { id: 'elliptical', name: 'Elliptical', bodyArea: 'Cardio', isCardio: true, sportId: 'elliptical' },
  { id: 'stair_climbing', name: 'Stair Climbing', bodyArea: 'Cardio', isCardio: true, sportId: 'stair_climbing' },
  { id: 'indoor_cycling', name: 'Indoor Cycling', bodyArea: 'Cardio', isCardio: true, sportId: 'indoor_cycling' },
  { id: 'cross_country_skiing', name: 'XC Skiing', bodyArea: 'Cardio', isCardio: true, sportId: 'cross_country_skiing' },
  { id: 'jump_rope', name: 'Jump Rope', bodyArea: 'Cardio', isCardio: true, sportId: 'jump_rope' },
];
