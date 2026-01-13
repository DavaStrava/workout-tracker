# Workout Tracker

A mobile-first Progressive Web App for tracking strength training and cardio workouts.

**Live Demo**: https://workout-tracker-blond-iota.vercel.app

## Features

- Track strength workouts with exercises, sets, reps, and weights
- Log cardio sessions with duration, distance, and intensity
- Save routines for quick workout starts
- View workout history and analytics
- Google Sign-in and email/password authentication
- Cloud sync with Firestore
- Dark purple theme (Vibrant Sunset)

## Tech Stack

- React 19 + TypeScript
- Vite
- Vitest + React Testing Library (testing)
- Framer Motion (animations)
- Recharts (analytics charts)
- Firebase Auth + Firestore (authentication & data persistence)
- Vercel (hosting)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run with coverage
npm test -- --coverage
```

Tests cover auth service, components (Button, Card, Badge), and features (WorkoutLogger, WorkoutTypeSelector).

## Deployment

```bash
# Build and deploy to Vercel production
npm run build && vercel --prod
```

Changes propagate within ~30 seconds after deployment.

### Firebase Configuration

For authentication to work, ensure your domain is added to Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → **Authentication → Settings → Authorized domains**
3. Add your production domain (e.g., `workout-tracker-blond-iota.vercel.app`)

**Environment Variables** (set in Vercel dashboard):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Project Structure

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation.
