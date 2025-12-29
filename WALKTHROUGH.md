# Workout Tracker Walkthrough

I've built your mobile-first Workout Tracker! Here's how to run it and what to verify.

## Quick Start
1. **Navigate to the project**:
   ```bash
   cd workout-tracker
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```
3. **Open:** [http://localhost:5173](http://localhost:5173)

> [!TIP]
> Since this is a mobile-first app, it looks best on a mobile screen!

## Feature Verification

### 1. Mobile Experience
- Open Chrome DevTools (`Cmd+Option+I` on Mac).
- Toggle the **Device Toolbar** (`Cmd+Shift+M`) and select a phone (e.g., iPhone 12 Pro).
- Observe the layout:
    - **Tab Bar**: Fixed at the bottom.
    - **Header**: Sticky at the top (or clear distinction).
    - **Dark Mode**: Premium deep blue/black aesthetics.

### 2. Logging a Workout
- Click **Start Workout**.
- Tap **Add Exercise** (dashed box).
- Select a body area (e.g., "Chest") and tap "Bench Press".
- **Add Sets**:
    - Enter weight (e.g., 60) and reps (e.g., 10).
    - Tap the "Check" icon to mark it as complete (it turns green).
    - Add another set with the "+ Add Set" button.
- **Finish**: Tap the "Finish" button in the top right.

### 3. History Persistence
- After finishing, you should be redirected to the home screen (or empty state).
- Tap the **History** tab at the bottom.
- You should see your completed workout with:
    - Date/Time
    - Duration
    - Total exercises
- **Reload the page**: The history should persist!

## PWA Installation (Mobile)
To use this as a real app:
1. Access the local URL from your phone (if on the same network) OR deploy it.
2. Tap "Share" (iOS) or "Menu" (Android).
3. Select **"Add to Home Screen"**.
4. Launch it from your home screen—it will open in full screen without the browser URL bar.
