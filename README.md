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

**Environment Variables**

The app requires 6 Firebase environment variables. See `.env.example` for the variable names. You can set them using either the Vercel dashboard or CLI:

**Option 1: Vercel Dashboard**
1. Go to Vercel project settings → **Environment Variables**
2. Add each variable for Production, Preview, and Development environments

**Option 2: Vercel CLI (Recommended)**

Use `printf` (NOT `echo`) to avoid adding trailing newline characters that will break Firebase URLs:

```bash
printf "your-api-key" | vercel env add VITE_FIREBASE_API_KEY production
printf "your-project.firebaseapp.com" | vercel env add VITE_FIREBASE_AUTH_DOMAIN production
printf "your-project-id" | vercel env add VITE_FIREBASE_PROJECT_ID production
printf "your-project.appspot.com" | vercel env add VITE_FIREBASE_STORAGE_BUCKET production
printf "your-sender-id" | vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
printf "your-app-id" | vercel env add VITE_FIREBASE_APP_ID production
```

After setting environment variables, redeploy with `vercel --prod`.

## Project Structure

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation.

## Attributions

Muscle group icons are sourced from [The Noun Project](https://thenounproject.com/) and used under the [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) license. See [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) for full creator credits.
