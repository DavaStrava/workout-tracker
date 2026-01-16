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

### Body Areas (15 muscle groups)
**Upper Body - Push**: Chest, Shoulders, Triceps
**Upper Body - Pull**: Lats, Upper Back, Traps, Biceps, Forearms
**Core**: Abs, Obliques, Lower Back
**Lower Body**: Quads, Hamstrings, Glutes, Calves
**Cardio**: Running, Cycling, etc.

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

#### [NEW] [WorkoutLogger.tsx] ✅
The clear, focused interface for the active workout.
- **Muscle Group Selection**: Visual 2-column grid with individual muscle SVG icons (MuscleRecoveryMap component)
  - 15 individual muscle icons using Noun Project SVGs with orange-pink gradient fills
  - Each card shows: icon, label, recovery status ("✓ Fresh" or exercise count)
  - Fresh muscles highlighted with green border and shadow
- Selecting a muscle group shows filtered exercises for that body area
- Auto-shows muscle groups when starting a new strength workout
- List of added exercises with set logging
- Input rows for Sets, Reps, Weight

#### [NEW] [History.tsx]
View past workouts.

## Planned: AI-Generated Photorealistic Exercise Icons

### Goal
Replace current SVG stick-figure icons with AI-generated photorealistic illustrations for all 224 exercises, improving visual quality while maintaining performance through lazy loading.

### Architecture

#### Directory Structure
```
public/icons/exercises/
├── chest/           # 18 exercises
├── shoulders/       # 18 exercises
├── biceps/          # 14 exercises
├── triceps/         # 14 exercises
├── forearms/        # 10 exercises
├── upper-back/      # 16 exercises
├── lats/            # 15 exercises
├── traps/           # 12 exercises
├── lower-back/      # 12 exercises
├── quads/           # 18 exercises
├── hamstrings/      # 14 exercises
├── glutes/          # 16 exercises
├── calves/          # 10 exercises
├── abs/             # 14 exercises
├── obliques/        # 12 exercises
└── cardio/          # 11 exercises
```

#### Icon Manifest (`src/assets/icon-manifest.json`)
```json
{
  "icons": {
    "bench_press": {
      "webp": "/icons/exercises/chest/bench_press.webp",
      "png": "/icons/exercises/chest/bench_press.png"
    }
  }
}
```

#### New Component: ExerciseImage
```typescript
// src/components/ExerciseImage.tsx
// Fallback chain: WebP → PNG → SVG Icon → Letter Circle
// Uses native lazy loading (loading="lazy")
// Graceful degradation for missing icons
```

#### Scripts
- `scripts/generate-icons.js` - DALL-E 3 API batch generation
- `scripts/optimize-icons.js` - Sharp-based resize (104px) + WebP conversion
- `scripts/generate-manifest.js` - Builds icon-manifest.json from directory contents

### AI Generation Strategy

**Prompt Template:**
```
Professional fitness illustration of [EXERCISE_NAME], showing proper form.
Athletic person performing the exercise with [EQUIPMENT].
Style: Photorealistic illustration, dark purple background (#1a1625),
soft professional lighting, centered composition.
Circular icon format, high contrast for small sizes.
No text or watermarks.
```

**Output Specs:**
- Source: 1024x1024 PNG (DALL-E 3)
- Optimized: 104px WebP (primary) + PNG (fallback)
- Target: <15KB per icon

### Performance Considerations
- **Lazy loading**: Native `loading="lazy"` on all images
- **WebP format**: 80-85% smaller than PNG at same quality
- **Caching**: Immutable cache headers (1 year) via vercel.json
- **Fallback chain**: Ensures UI never breaks if images fail to load
- **Bundle impact**: ~2KB manifest added to JS, images loaded on-demand

## Verification Plan

### Automated Tests
- Run `npm run build` to verify type safety and build process.

### Manual Verification
- Open in mobile view (Chrome DevTools).
- Create a workout, add exercises, log sets.
- Reload page to verify data persistence.
- "Finish" workout and check history.
