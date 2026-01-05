# Firebase Setup Guide

This guide will walk you through setting up Firebase for your Workout Tracker app to enable cross-device sync.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Workout Tracker")
4. (Optional) Enable Google Analytics
5. Click **"Create project"** and wait for it to finish

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "Workout Tracker Web")
3. **Check** "Also set up Firebase Hosting" (optional, but useful for deployment)
4. Click **"Register app"**
5. You'll see a config object with your credentials - **keep this page open**

## Step 3: Enable Authentication

1. In the Firebase Console sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable the following providers:
   - **Email/Password**: Click, toggle "Enable", click "Save"
   - **Google**: Click, toggle "Enable", add a support email, click "Save"

## Step 4: Set Up Firestore Database

1. In the Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll add security rules next)
4. Select a Firestore location (choose one closest to you)
5. Click **"Enable"**

### Add Security Rules

1. In Firestore, go to the **"Rules"** tab
2. Replace the default rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data is private to the user
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

**What these rules do:**
- Users can only read/write their own data under `/users/{their-user-id}/`
- Unauthenticated users cannot access any data
- Each user's workouts, routines, and active workout are isolated

## Step 5: Configure Your App

1. Copy the Firebase config from Step 2 (or find it in Project Settings > General > Your apps)
2. Open the `.env` file in your project root
3. Replace the placeholder values with your actual Firebase config:

```bash
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

**Important:** Keep your `.env` file private! It's already in `.gitignore` so it won't be committed to git.

## Step 6: Test the App

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser (http://localhost:5173)
3. You should see the login screen
4. Create a new account with your email
5. Log a test workout
6. Open the app in a different browser or incognito mode
7. Log in with the same account
8. Your workout should sync automatically!

## Step 7: Deploy to Vercel/Netlify

### Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. **Add environment variables** in Vercel dashboard:
   - Go to your project in Vercel dashboard
   - Settings > Environment Variables
   - Add all `VITE_FIREBASE_*` variables from your `.env` file

### Netlify

1. Build the app:
   ```bash
   npm run build
   ```

2. Drag the `dist/` folder to [Netlify's deploy page](https://app.netlify.com/drop)

3. **Add environment variables** in Netlify dashboard:
   - Go to Site settings > Environment variables
   - Add all `VITE_FIREBASE_*` variables from your `.env` file

4. Redeploy to pick up the environment variables

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure you've enabled Email/Password authentication in Firebase Console
- Check that your `.env` file has the correct values

### "Missing or insufficient permissions"
- Check that Firestore security rules are correctly set (Step 4)
- Make sure you're logged in

### "Data not syncing"
- Open browser DevTools > Console and check for errors
- Verify you're logged in with the same account on both devices
- Check your internet connection

### "Migration not happening"
- The migration only happens once on first login
- If you want to force re-migration, clear localStorage:
  - DevTools > Application > Local Storage > Clear
  - Or run: `localStorage.clear()` in console

## Data Model

Your data is stored in Firestore with this structure:

```
/users/{userId}/
  ├── workouts/{workoutId}
  │   └── { name, type, startTime, endTime, exercises, notes, status }
  ├── routines/{routineId}
  │   └── { name, exercises }
  └── activeWorkout/current
      └── { current active workout data }
```

## Offline Support

The app uses Firebase's offline persistence, which means:
- You can log workouts without internet
- Changes are queued and sync when you're back online
- Data is cached locally for fast access

## Costs

**Free tier includes:**
- 50,000 document reads/day
- 20,000 document writes/day
- 1GB storage
- 10GB/month network egress

For personal use (1 user, ~100 workouts/month), you'll likely stay in the free tier forever.

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- Check the browser console for error messages
