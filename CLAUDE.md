# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A mobile-first Progressive Web App (PWA) for tracking strength training and cardio workouts. Built with React + TypeScript using Vite. Data persists locally using localStorage with no backend required.

## Project Structure

```
workout-tracker/
├── CLAUDE.md
├── IMPLEMENTATION_PLAN.md
├── Product Requirements Document (MVP)_ Personal Workout Tracker.md
├── README.md
├── TASKS.md
├── WALKTHROUGH.md
├── package.json
├── package-lock.json
├── index.html
├── vite.config.ts
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── public/
│   └── vite.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.css
    ├── index.css
    ├── types/
    │   └── index.ts
    ├── hooks/
    │   └── useWorkoutStore.tsx
    ├── components/
    │   ├── Layout.tsx
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   └── Card.tsx
    ├── features/
    │   ├── LandingPage.tsx
    │   ├── WorkoutTypeSelector.tsx
    │   ├── WorkoutLogger.tsx
    │   ├── CardioLogger.tsx
    │   ├── History.tsx
    │   └── Analytics.tsx
    ├── data/
    │   └── exercises.ts
    ├── utils/
    │   ├── analyticsHelpers.ts
    │   └── styles.ts
    └── assets/
        └── react.svg
```

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev

# Build for production (TypeScript compilation + Vite build)
npm run build

# Lint the codebase
npm run lint

# Preview production build
npm preview
```

## Architecture

### State Management
The app uses React Context (`WorkoutProvider` in `src/hooks/useWorkoutStore.tsx`) as the single source of truth for all workout data. This context:
- Manages active workout state
- Stores workout history
- Handles routines (saved workout templates)
- Automatically syncs to localStorage on every state change
- Hydrates from localStorage on mount

**Key principle**: All workout data flows through this context. Never manipulate localStorage directly outside of this provider.

### Data Model Hierarchy

```
Workout (workout session with metadata)
  └─ WorkoutExercise[] (instances of exercises in this workout)
      └─ WorkoutSet[] (individual sets with reps/weight or distance/duration)
```

- **Exercise definitions** live in `src/data/exercises.ts` (static catalog)
- **WorkoutExercise** links to an exercise via `exerciseId` and contains the actual logged sets
- **WorkoutSet** supports both strength (reps/weight) and cardio (distance/duration/intensity) data
- **Routine** is a template that stores exercise IDs and set counts to quickly start workouts

### Component Structure

**Feature-based organization** (`src/features/`):
- `WorkoutLogger.tsx` - Main workout interface (exercise selection, set logging)
- `WorkoutTypeSelector.tsx` - "Garmin-style" activity type picker
- `History.tsx` - Chronological list of past workouts
- `Analytics.tsx` - Charts and stats (volume, frequency, PR tracking)
- `CardioLogger.tsx` - Cardio-specific logging interface

**Shared components** (`src/components/`):
- `Layout.tsx` - Bottom navigation wrapper
- `Button.tsx`, `Input.tsx`, `Card.tsx` - Reusable UI primitives

### Analytics Helpers (`src/utils/analyticsHelpers.ts`)

Pure functions for computing workout stats:
- `getLastPerformance()` - Find previous best set for an exercise (for "last time" display)
- `calculateTotalVolume()` - Sum of (weight × reps) across workouts
- `getVolumeByWeek()` - Weekly volume data for charting (last 8 weeks)
- `getWorkoutFrequency()` - Workout counts by type (week/month/year)
- `getExerciseProgress()` - Max weight trend for specific exercise
- `getTotalWorkouts()` - Count total workouts with optional filters by type and time period

**Important**: These functions read from the entire workout history array. For MVP scale (<1000 workouts), this is acceptable. If performance becomes an issue, consider indexing or aggregation strategies.

### Styling

Vanilla CSS with CSS variables for theming. Dark mode is default (defined in `src/index.css`). Uses Flexbox/Grid for layout. Framer Motion for animations. TailwindCSS utilities via `clsx` and `tailwind-merge` helpers.

### Key Design Patterns

1. **Exercise Instance IDs**: `WorkoutExercise.id` is unique per workout instance. This allows logging the same exercise multiple times in one session (e.g., "Bench Press" morning and evening).

2. **Set Copying**: When adding a new set via `addSet()`, it copies values from the previous set for convenience (user just adjusts weight/reps incrementally).

3. **Active Workout Recovery**: If the app crashes mid-workout, the active workout state is restored from localStorage on next load.

4. **Routine Starting**: `startRoutine()` creates a new workout pre-populated with exercises and empty sets matching the routine template.

## Common Patterns

### Adding a New Exercise Definition
Edit `src/data/exercises.ts` and add to the `EXERCISES` array. Ensure `id` is unique and `bodyArea` matches the `BodyArea` type.

### Modifying Workout State
Always use the context methods (`addExercise`, `updateSet`, etc.). These handle immutability and localStorage sync correctly.

### Adding Analytics
Create a new helper in `analyticsHelpers.ts` that accepts `Workout[]` and returns computed data. Keep it pure (no side effects). Use in `Analytics.tsx` by calling `useWorkout().history`.

## Technical Constraints

- **No backend**: All data is localStorage only. Export/import features (if added) should use JSON download/upload.
- **Mobile-first**: UI is optimized for mobile touch targets. Test in Chrome DevTools mobile view.
- **PWA ready**: The app can be added to home screen. Ensure manifest and service worker (if added) are configured correctly.
- **React 19**: Uses latest React features including automatic batching.

## Important Notes

- The PRD (`Product Requirements Document (MVP)_ Personal Workout Tracker.md`) contains detailed product specs including analytics requirements and UI/UX guidelines.
- `IMPLEMENTATION_PLAN.md` has the original architectural decisions and component breakdown.
- When logging cardio workouts, the set structure changes (distance/duration instead of reps/weight). The UI conditionally renders based on `exercise.isCardio`.
