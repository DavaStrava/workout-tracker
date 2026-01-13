# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A mobile-first Progressive Web App (PWA) for tracking strength training and cardio workouts. Built with React + TypeScript using Vite. Uses Firebase for authentication and Firestore for cloud data persistence (falls back to localStorage when not authenticated).

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
├── vitest.config.ts
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
    ├── test/
    │   └── setup.ts
    ├── types/
    │   └── index.ts
    ├── hooks/
    │   └── useWorkoutStore.tsx
    ├── components/
    │   ├── __tests__/
    │   │   ├── Button.test.tsx
    │   │   ├── Card.test.tsx
    │   │   └── Badge.test.tsx
    │   ├── Layout.tsx
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   ├── Card.tsx
    │   └── Badge.tsx
    ├── features/
    │   ├── __tests__/
    │   │   ├── WorkoutTypeSelector.test.tsx
    │   │   └── WorkoutLogger.test.tsx
    │   ├── Auth.tsx
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
    │   ├── analyticsHelpers.test.ts
    │   └── styles.ts
    ├── services/
    │   ├── auth.ts
    │   ├── auth.test.ts
    │   └── firestore.ts
    ├── config/
    │   └── firebase.ts
    └── assets/
        └── react.svg
```

## Deployment

**Production URL**: https://workout-tracker-blond-iota.vercel.app

### Deploying to Vercel

The app is deployed via Vercel. To deploy updates:

```bash
# Build locally first to catch any errors
npm run build

# Deploy to production
vercel --prod
```

**Important**: After running `vercel --prod`, changes typically propagate within 30 seconds. The command outputs the deployment URL - verify your changes are live by visiting the production URL.

### Firebase Setup for Production

For authentication to work in production, the domain must be authorized in Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to: **Authentication → Settings → Authorized domains**
4. Add: `workout-tracker-blond-iota.vercel.app`

**Already configured domains**:
- `localhost` (for development)
- `workout-tracker-blond-iota.vercel.app` (production)

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

# Run tests
npm test              # Watch mode
npm test -- --run     # Run once
npm test -- --coverage # With coverage report
```

## Testing

Uses **Vitest** with **React Testing Library** for unit and integration tests.

### Test File Locations

```
src/
├── services/
│   └── auth.test.ts              # Auth service tests
├── components/__tests__/
│   ├── Button.test.tsx           # Button component tests
│   ├── Card.test.tsx             # Card component tests
│   └── Badge.test.tsx            # Badge component tests
├── features/__tests__/
│   ├── WorkoutTypeSelector.test.tsx  # Workout type picker tests
│   └── WorkoutLogger.test.tsx        # Workout logging tests
├── utils/
│   └── analyticsHelpers.test.ts  # Analytics helper tests
└── test/
    └── setup.ts                  # Test setup (jest-dom matchers)
```

### Test Coverage

| Area | Tests | Coverage |
|------|-------|----------|
| Auth Service | 15 | signUp, signIn, signInWithGoogle, signOut, resetPassword |
| WorkoutTypeSelector | 14 | Rendering, interactions, styling, accessibility |
| WorkoutLogger | 27 | Active workout, save routine modal, set management |
| Components | 40+ | Button, Card, Badge variants and interactions |
| Analytics Helpers | 10+ | Volume calculation, frequency tracking |

### Writing Tests

**Component tests** follow this pattern:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ComponentName', () => {
  it('should do something', async () => {
    const user = userEvent.setup();
    render(<Component />);
    await user.click(screen.getByText('Button'));
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

**Mocking the workout context**:
```typescript
vi.mock('../../hooks/useWorkoutStore', () => ({
  useWorkout: () => ({
    activeWorkout: mockWorkout,
    history: [],
    saveRoutine: vi.fn(),
    // ... other methods
  }),
}));
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
- `Auth.tsx` - Login/signup screen with email and Google authentication
- `WorkoutLogger.tsx` - Main workout interface (exercise selection, set logging)
- `WorkoutTypeSelector.tsx` - "Garmin-style" activity type picker
- `History.tsx` - Chronological list of past workouts
- `Analytics.tsx` - Charts and stats (volume, frequency, PR tracking)
- `CardioLogger.tsx` - Cardio-specific logging interface

**Shared components** (`src/components/`):
- `Layout.tsx` - Bottom navigation wrapper
- `Button.tsx`, `Input.tsx`, `Card.tsx` - Reusable UI primitives
- `Badge.tsx` - Status badges and StatCard component for displaying metrics

### Analytics Helpers (`src/utils/analyticsHelpers.ts`)

Pure functions for computing workout stats:
- `getLastPerformance()` - Find previous best set for an exercise (for "last time" display)
- `calculateTotalVolume()` - Sum of (weight × reps) across workouts
- `getVolumeByWeek()` - Weekly volume data for charting (last 8 weeks)
- `getWorkoutFrequency()` - Workout counts by type (week/month/year)
- `getExerciseProgress()` - Max weight trend for specific exercise
- `getTotalWorkouts()` - Count total workouts with optional filters by type and time period

**Important**: These functions read from the entire workout history array. For MVP scale (<1000 workouts), this is acceptable. If performance becomes an issue, consider indexing or aggregation strategies.

### Authentication (`src/services/auth.ts`)

Firebase Authentication with email/password and Google Sign-in:
- `signUp()` - Create new user with email/password
- `signIn()` - Sign in with email/password
- `signInWithGoogle()` - Opens Google OAuth popup
- `signOut()` - Sign out current user

**Google Sign-in uses popup flow** for compatibility with Chrome's bounce tracking protection. The redirect flow was causing issues where Chrome would clear the auth state during the redirect chain.

### Firestore (`src/services/firestore.ts`)

Cloud Firestore for persistent data storage:
- Workout history synced per user
- Routines stored per user
- Active workout state preserved
- Automatic migration from localStorage on first login

### Styling

**Vibrant Sunset Theme**: The app uses a consistent dark purple theme:
- **Background**: `#1a1625` - dark purple (set directly on body)
- **Card backgrounds**: `rgba(30, 27, 50, 0.8)` - semi-transparent dark purple
- **Brand colors**: Orange (`#f97316`) and Pink (`#ec4899`)

**Key styling patterns**:
- Primary buttons use orange-to-pink gradient with glow shadows
- Focus states use purple (`#a855f7`) ring color
- `.text-gradient` class applies orange-pink-purple gradient to headings
- All Card/Button variants use solid dark backgrounds (no glassmorphism)

**CSS Variables** (defined in `src/index.css`):
- `--color-bg-app`: `#1a1625`
- `--color-bg-card`: `#2d2640`
- `--color-primary`: `#f97316` (orange)
- `--color-accent`: `#ec4899` (pink)

Uses Flexbox/Grid for layout, Framer Motion for animations, and TailwindCSS utilities via `clsx` and `tailwind-merge` helpers.

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

- **Firebase backend**: Uses Firebase Auth for authentication and Firestore for data persistence. Falls back to localStorage when not authenticated.
- **Environment variables**: Firebase config requires `VITE_FIREBASE_*` environment variables. These are configured in the Vercel dashboard for production.
- **Authorized domains**: Production domains must be added to Firebase Console → Authentication → Settings → Authorized domains for sign-in to work.
- **Mobile-first**: UI is optimized for mobile touch targets. Test in Chrome DevTools mobile view.
- **PWA ready**: The app can be added to home screen. Ensure manifest and service worker (if added) are configured correctly.
- **React 19**: Uses latest React features including automatic batching.

## Important Notes

- The PRD (`Product Requirements Document (MVP)_ Personal Workout Tracker.md`) contains detailed product specs including analytics requirements and UI/UX guidelines.
- `IMPLEMENTATION_PLAN.md` has the original architectural decisions and component breakdown.
- When logging cardio workouts, the set structure changes (distance/duration instead of reps/weight). The UI conditionally renders based on `exercise.isCardio`.
