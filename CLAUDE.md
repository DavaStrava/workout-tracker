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
│   ├── vite.svg
│   └── icons/                   # [PLANNED] AI-generated exercise icons
│       └── exercises/           # Organized by muscle group (7-group system)
│           ├── chest/           # 18 exercise icons
│           ├── shoulders/       # 18 exercise icons
│           ├── arms/            # 38 exercise icons (biceps + triceps + forearms)
│           ├── abdomen/         # 26 exercise icons (abs + obliques)
│           ├── back/            # 55 exercise icons (upper back + lats + traps + lower back)
│           ├── glutes/          # 16 exercise icons
│           ├── legs/            # 48 exercise icons (quads + hamstrings + calves)
│           └── cardio/          # 11 exercise icons
├── scripts/                     # [PLANNED] Build and generation scripts
│   ├── generate-icons.js        # DALL-E 3 API batch generation
│   ├── optimize-icons.js        # Sharp-based resize + WebP conversion
│   └── generate-manifest.js     # Builds icon-manifest.json
├── SVGs/                        # Noun Project SVG assets for muscle icons
│   ├── noun-chest-7994440.svg           # Chest
│   ├── noun-muscle-7994436.svg          # Biceps
│   ├── noun-back-muscle-7977964.svg     # Lats
│   ├── noun-male-shoulder-3826963.svg   # Shoulders
│   ├── noun-tricep-brachii-7874542.svg  # Triceps
│   ├── noun-hamstring-7874535.svg       # Hamstrings
│   ├── noun-quads-4050080.svg           # Quads
│   ├── noun-gastrocnemius-7874531.svg   # Calves
│   ├── noun-gluteus-maximus-7874533.svg # Glutes
│   ├── noun-forearms-7874536.svg        # Forearms
│   ├── noun-six-pack.svg                # Abs
│   ├── noun-abdominal-muscles-oblique8138114.svg  # Obliques
│   ├── noun-lower-back-8242925.svg      # Lower Back
│   ├── traps.svg                        # Traps
│   └── upperback.svg                    # Upper Back
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
    │   │   ├── Badge.test.tsx
    │   │   ├── Input.test.tsx
    │   │   └── MuscleGroupSelector.test.tsx
    │   ├── anatomical/              # Anatomical body selector components
    │   │   ├── constants.ts         # SVG paths, colors, muscle region definitions
    │   │   ├── MuscleRegion.tsx     # Reusable clickable muscle region component
    │   │   ├── FrontBodySVG.tsx     # Front anatomical view with overlays
    │   │   └── BackBodySVG.tsx      # Back anatomical view with overlays
    │   ├── Layout.tsx
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   ├── Card.tsx
    │   ├── Badge.tsx
    │   ├── ErrorBoundary.tsx
    │   ├── AnatomicalBodySelector.tsx   # Main muscle group selector with front/back toggle
    │   ├── MuscleGroupSelector.tsx      # DEPRECATED (kept for reference)
    │   ├── MuscleGroupIcons.tsx         # DEPRECATED (kept for reference)
    │   ├── MuscleRecoveryMap.tsx        # DEPRECATED (kept for reference)
    │   ├── AnatomicalBody.tsx           # DEPRECATED (kept for reference)
    │   └── ExerciseSelector.tsx
    ├── features/
    │   ├── __tests__/
    │   │   ├── Auth.test.tsx
    │   │   ├── CardioLogger.test.tsx
    │   │   ├── History.test.tsx
    │   │   ├── WorkoutTypeSelector.test.tsx
    │   │   └── WorkoutLogger.test.tsx
    │   ├── Auth.tsx
    │   ├── LandingPage.tsx
    │   ├── WorkoutTypeSelector.tsx
    │   ├── WorkoutLogger.tsx
    │   ├── CardioLogger.tsx
    │   ├── History.tsx
    │   ├── DeletedWorkouts.tsx
    │   └── Analytics.tsx
    ├── data/
    │   └── exercises.ts
    ├── utils/
    │   ├── analyticsHelpers.ts
    │   ├── analyticsHelpers.test.ts
    │   ├── recoveryHelpers.ts
    │   └── styles.ts
    ├── services/
    │   ├── auth.ts
    │   ├── auth.test.ts
    │   ├── firestore.ts
    │   └── firestore.test.ts
    ├── config/
    │   └── firebase.ts
    └── assets/
        ├── react.svg
        └── icon-manifest.json   # [PLANNED] Exercise icon registry (WebP/PNG paths)
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
│   ├── auth.test.ts              # Auth service tests
│   └── firestore.test.ts         # Firestore service tests (user limit)
├── components/__tests__/
│   ├── Button.test.tsx           # Button component tests
│   ├── Card.test.tsx             # Card component tests
│   ├── Badge.test.tsx            # Badge component tests
│   ├── Input.test.tsx            # Input component tests
│   └── MuscleGroupSelector.test.tsx  # Muscle group selector tests
├── features/__tests__/
│   ├── Auth.test.tsx             # Auth UI tests (incl. user limit)
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
| Auth UI | 55 | Login/signup forms, mode toggle, error display, user limit |
| Firestore Service | 23 | User limit, registration, count, existence checks |
| WorkoutTypeSelector | 14 | Rendering, interactions, styling, accessibility |
| WorkoutLogger | 34 | Active workout, save routine modal, set management, muscle group selection |
| AnatomicalBodySelector | 7 | Rendering, interactions, recovery visualization |
| CardioLogger | 31 | Cardio exercise logging, intensity, duration tracking |
| History | 22 | Workout history display, empty state |
| Components | 53 | Button, Card, Badge variants and interactions |
| Analytics Helpers | 35 | Volume calculation, frequency tracking |

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
    deletedWorkouts: [],
    routines: [],
    saveRoutine: vi.fn(),
    softDeleteWorkout: vi.fn(),
    restoreWorkout: vi.fn(),
    permanentlyDeleteWorkout: vi.fn(),
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
- Manages soft-deleted workouts (7-day retention before permanent deletion)
- Automatically syncs to localStorage on every state change
- Hydrates from localStorage on mount
- Auto-cleans expired deleted workouts on app load

**Key principle**: All workout data flows through this context. Never manipulate localStorage directly outside of this provider.

### Data Model Hierarchy

```
Workout (workout session with metadata)
  └─ WorkoutExercise[] (instances of exercises in this workout)
      └─ WorkoutSet[] (individual sets with reps/weight or distance/duration)
```

- **Exercise definitions** live in `src/data/exercises.ts` (static catalog, 224 exercises)
- **WorkoutExercise** links to an exercise via `exerciseId` and contains the actual logged sets
- **WorkoutSet** supports both strength (reps/weight) and cardio (distance/duration/intensity) data
- **Routine** is a template that stores exercise IDs and set counts to quickly start workouts
- **Workout.deletedAt** - Optional timestamp indicating when a workout was soft-deleted. Workouts with this field set are shown in the "Deleted Workouts" view and auto-expire after 7 days
- **BodyArea** type defines 7 muscle groups for simplified exercise categorization:
  - Upper Body: Chest, Shoulders, Arms (biceps + triceps + forearms)
  - Core: Abdomen (abs + obliques)
  - Back: Back (upper back + lats + traps + lower back)
  - Lower Body: Glutes, Legs (quads + hamstrings + calves)
  - Plus: Cardio

### Component Structure

**Feature-based organization** (`src/features/`):
- `Auth.tsx` - Login/signup screen with email and Google authentication
- `WorkoutLogger.tsx` - Main workout interface (exercise selection, set logging)
- `WorkoutTypeSelector.tsx` - "Garmin-style" activity type picker
- `History.tsx` - Chronological list of past workouts with swipe-to-delete
- `DeletedWorkouts.tsx` - View and restore soft-deleted workouts (7-day retention)
- `Analytics.tsx` - Charts and stats (volume, frequency, PR tracking)
- `CardioLogger.tsx` - Cardio-specific logging interface

**Shared components** (`src/components/`):
- `Layout.tsx` - Bottom navigation wrapper with accessible tab navigation
- `Button.tsx`, `Input.tsx`, `Card.tsx` - Reusable UI primitives
- `Badge.tsx` - Status badges and StatCard component for displaying metrics
- `ErrorBoundary.tsx` - React error boundary for graceful error handling
- `AnatomicalBodySelector.tsx` - Interactive anatomical muscle selector with front/back toggle, 7 clickable muscle regions with distinct orange color shading, label lines, and recovery visualization using color overlays (bright = fresh, dark = fatigued)
- `anatomical/constants.ts` - SVG paths, muscle region definitions, base colors for 7 muscle groups, and recovery color calculation functions
- `anatomical/MuscleRegion.tsx` - Reusable clickable muscle region component with hover effects, leader lines, and labels positioned outside body silhouette
- `anatomical/FrontBodySVG.tsx` - Front anatomical view with interactive overlay regions (Chest, Shoulders, Arms, Abdomen, Legs)
- `anatomical/BackBodySVG.tsx` - Back anatomical view with interactive overlay regions (Shoulders, Arms, Back, Glutes, Legs)
- `MuscleGroupSelector.tsx` - **DEPRECATED** (kept for reference) - 2-column grid of muscle group cards
- `MuscleGroupIcons.tsx` - **DEPRECATED** (kept for reference) - Individual muscle SVG icons using Noun Project assets
- `MuscleRecoveryMap.tsx` - **DEPRECATED** (kept for reference) - 15-group muscle selection UI
- `AnatomicalBody.tsx` - **DEPRECATED** (kept for reference) - Full-body anatomical SVG with toggle views
- `ExerciseSelector.tsx` - Exercise list filtered by selected muscle group
- `ExerciseImage.tsx` - [PLANNED] Image component for photorealistic exercise icons with fallback chain (WebP → PNG → SVG → Letter)

### Analytics Helpers (`src/utils/analyticsHelpers.ts`)

Pure functions for computing workout stats:
- `getLastPerformance()` - Find previous best set for an exercise (for "last time" display)
- `calculateTotalVolume()` - Sum of (weight × reps) across workouts
- `getVolumeByWeek()` - Weekly volume data for charting (last 8 weeks)
- `getWorkoutFrequency()` - Workout counts by type (week/month/year)
- `getExerciseProgress()` - Max weight trend for specific exercise
- `getTotalWorkouts()` - Count total workouts with optional filters by type and time period

**Important**: These functions read from the entire workout history array. For MVP scale (<1000 workouts), this is acceptable. If performance becomes an issue, consider indexing or aggregation strategies.

### Recovery Helpers (`src/utils/recoveryHelpers.ts`)

Functions for calculating muscle recovery status:
- `calculateMuscleRecovery()` - Computes recovery percentage for all 7 muscle groups based on workout history
- Returns `RecoveryStats` with: `lastWorkoutDaysAgo`, `freshMuscleCount`, `totalMuscleGroups` (=7), and per-muscle `MuscleRecoveryData`
- Recovery is linear: 0% immediately after workout, 100% after 72 hours (configurable via `FULL_RECOVERY_HOURS`)
- Used by `AnatomicalBodySelector` to show visual recovery indicators as color overlays on anatomical regions

### Authentication (`src/services/auth.ts`)

Firebase Authentication with email/password and Google Sign-in:
- `signUp()` - Create new user with email/password
- `signIn()` - Sign in with email/password
- `signInWithGoogle()` - Opens Google OAuth popup
- `signOut()` - Sign out current user
- `resetPassword()` - Send password reset email

**Error Handling**: All auth functions return `{ user, error }` objects. Errors are converted to user-friendly messages via `getAuthErrorMessage()` helper (e.g., `auth/email-already-in-use` → "This email is already registered").

**Google Sign-in uses popup flow** for compatibility with Chrome's bounce tracking protection. The redirect flow was causing issues where Chrome would clear the auth state during the redirect chain.

### Firestore (`src/services/firestore.ts`)

Cloud Firestore for persistent data storage:
- Workout history synced per user
- Routines stored per user
- Active workout state preserved
- Automatic migration from localStorage on first login
- User registration with limit enforcement
- Soft delete operations (`softDeleteWorkoutInFirestore`, `restoreWorkoutInFirestore`, `permanentlyDeleteWorkoutInFirestore`)

**User Limit** (10 users max):
- `getUserCount()` - Count registered users via `getCountFromServer()`
- `checkUserExists(userId)` - Check if user document exists
- `isUserLimitReached()` - Returns true if count >= 10
- `registerUser(userId, email, displayName?, skipLimitCheck?)` - Create user document

The limit is enforced at the application level in `Auth.tsx`:
- New email signups check limit before creating Firebase Auth user
- Google sign-in checks `user.metadata.creationTime === lastSignInTime` to distinguish new vs existing users
- Existing users (different creation/login times) bypass limit and get migrated to Firestore
- If Firestore checks fail, existing users can still log in (graceful degradation)

**Note**: This is client-side enforcement only. For production security, add Firestore security rules.

**Atomic Operations**: `finishWorkoutAtomic()` uses Firestore batch writes to save completed workout and clear active workout atomically, preventing race conditions.

**Undefined Value Handling**: Firestore doesn't accept `undefined` values. The `removeUndefined()` helper strips undefined fields before saving (e.g., active workouts have no `endTime`). Applied to all workout save operations: `saveActiveWorkout`, `saveRoutineAndWorkoutAtomic`, `finishWorkoutAtomic`, `migrateLocalDataToFirestore`.

**Error Handling**: All Firestore functions return `{ error }` or `{ data, error }` objects. Errors are converted to user-friendly messages via `getFirestoreErrorMessage()` helper.

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

5. **Error Boundary**: The app is wrapped in `ErrorBoundary` component that catches React errors and displays a recovery UI with "Try Again" and "Refresh" options.

6. **Input Validation**: Weight inputs are constrained to 0-1000kg, reps to 0-100 to prevent unreasonable values.

7. **Accessibility**: Navigation uses proper ARIA attributes (`role="tablist"`, `aria-selected`). Toggle buttons use `aria-pressed`. All interactive elements have `aria-label` where needed.

8. **Muscle Group Selection Flow**: When starting a strength workout, users see an anatomical body visualization with a front/back toggle button. Each view displays clickable muscle regions with distinct orange color shading (7 different shades for 7 muscle groups). Recovery status modulates the brightness/saturation of each muscle's base color (bright orange = fresh, dark purple = fatigued). Muscle labels are positioned outside the body with leader lines connecting to the muscle regions. Hovering over a muscle increases opacity, fills the label with the muscle's base color, and scales the region. Clicking a muscle region navigates to the exercise list for that body area. Back buttons allow navigation: from exercise list → muscle groups → cancel workout (if empty) or return to workout (if exercises exist).

9. **Soft Delete with 7-Day Retention**: Workouts can be soft-deleted via swipe-to-delete in History. Deleted workouts have a `deletedAt` timestamp and are kept for 7 days before automatic permanent deletion. Users can restore or permanently delete from the DeletedWorkouts view. The cleanup runs on app load via a ref-guarded useEffect to prevent infinite loops. Context exposes `deletedWorkouts` (computed from history), `softDeleteWorkout()`, `restoreWorkout()`, and `permanentlyDeleteWorkout()`.

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

## Planned Features

### AI-Generated Photorealistic Exercise Icons

**Status**: Planned (not yet implemented)

Replace current SVG stick-figure exercise icons with AI-generated photorealistic illustrations for all 224 exercises.

**Architecture Overview**:
- Icons stored in `public/icons/exercises/{muscle-group}/{exercise_id}.webp`
- Registry manifest at `src/assets/icon-manifest.json` maps exercise IDs to image paths
- New `ExerciseImage.tsx` component handles loading with graceful fallback chain

**Fallback Chain**:
1. WebP image (primary, optimized)
2. PNG image (fallback for older browsers)
3. Existing SVG icon (if image missing)
4. Letter circle (final fallback)

**Generation Process**:
1. Run `scripts/generate-icons.js` - Batch generates 1024x1024 PNGs via DALL-E 3 API
2. Run `scripts/optimize-icons.js` - Resizes to 104px, converts to WebP using Sharp
3. Run `scripts/generate-manifest.js` - Scans directories and builds icon-manifest.json

**AI Prompt Template**:
```
Professional fitness illustration of [EXERCISE_NAME], showing proper form.
Athletic person performing the exercise with [EQUIPMENT].
Style: Photorealistic illustration, dark purple background (#1a1625),
soft professional lighting, centered composition.
Circular icon format, high contrast for small sizes.
No text or watermarks.
```

**Performance Considerations**:
- Native lazy loading (`loading="lazy"`)
- WebP format (~80% smaller than PNG)
- Immutable caching (1 year via vercel.json)
- On-demand loading (not bundled)

**Files to Create/Modify**:
| File | Action |
|------|--------|
| `src/components/ExerciseImage.tsx` | Create |
| `src/components/ExerciseCard.tsx` | Modify |
| `src/components/icons/index.ts` | Modify |
| `src/assets/icon-manifest.json` | Create |
| `scripts/generate-icons.js` | Create |
| `scripts/optimize-icons.js` | Create |
| `scripts/generate-manifest.js` | Create |
| `vercel.json` | Create/Modify |
| `package.json` | Add sharp dependency |

## Important Notes

- The PRD (`Product Requirements Document (MVP)_ Personal Workout Tracker.md`) contains detailed product specs including analytics requirements and UI/UX guidelines.
- `IMPLEMENTATION_PLAN.md` has the original architectural decisions and component breakdown.
- When logging cardio workouts, the set structure changes (distance/duration instead of reps/weight). The UI conditionally renders based on `exercise.isCardio`.
