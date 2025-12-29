# Workout Tracker Implementation Plan

## Goal Description
Build a mobile-first web application for tracking strength training workouts. The user can define exercises, log sets (reps, weight), and categorize them by body area. The app will be designed with a premium, modern aesthetic and optimized for mobile usage.

## User Review Required
> [!IMPORTANT]
> The application will be a **Progressive Web App (PWA)**. This means you can open it in your mobile browser and "Add to Home Screen" to use it like a native app. Is this acceptable?

## Proposed Tech Stack
- **Framework**: React + TypeScript (via Vite)
- **Styling**: Vanilla CSS (CSS Variables for theming, Flexbox/Grid for layout)
- **State Management**: React Context + Hooks (possibly `zustand` if complexity grows, but Context is efficient for this scale).
- **Persistence**: `localStorage` for initial version (easy to persist on device).
- **Icons**: `lucide-react` or similar lightweight icon library.

## Data Model
- **Exercise**: `{ id, name, bodyArea, type (strength/cardio) }`
- **Set**: `{ id, reps, weight, completed }`
- **WorkoutLog**: `{ id, date, exercises: [{ exerciseId, sets: [] }] }`

## Proposed Changes

### Project Structure
```
src/
  components/      # Reusable UI components (Button, Card, Input)
  features/        # Feature specific components (WorkoutLogger, History)
  hooks/           # Custom hooks (useWorkouts, useLocalStorage)
  types/           # TypeScript definitions
  App.tsx          # Main entry
  index.css        # Global styles & variables
```

### Core Components
#### [NEW] [Layout.tsx]
Main wrapper with navigation (bottom tab bar for mobile feel).

#### [NEW] [WorkoutLogger.tsx]
The clear, focused interface for the active workout.
- Selector for Body Area -> Exercise.
- List of added exercises.
- Input rows for Sets, Reps, Weight.

#### [NEW] [History.tsx]
View past workouts.

## Verification Plan

### Automated Tests
- Run `npm run build` to verify type safety and build process.

### Manual Verification
- Open in mobile view (Chrome DevTools).
- Create a workout, add exercises, log sets.
- Reload page to verify data persistence.
- "Finish" workout and check history.
