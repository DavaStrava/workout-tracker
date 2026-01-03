

---

# **Product Requirements Document (MVP): Personal Workout Tracker**

## **1\. Executive Summary**

Product Name: (TBD \- e.g., "IronLog", "Trackt")

Goal: A mobile-first Progressive Web App (PWA) designed for personal workout tracking. It mimics the high-level activity selection of wearables (Garmin/Apple) while offering granular data entry for strength training (sets/reps/weight) and cardio (distance/time).

Target User: An individual trainee who requires offline-capable, fast logging during workouts and detailed volume/progress analytics post-workout.

## **2\. Functional Requirements**

### **2.1. Workout Session Management**

* **Start Workout Flow:**  
  * User must be able to select a **Workout Mode** (Activity Type) immediately upon starting, similar to a smartwatch interface.  
  * **Supported Modes:**  
    * *Strength Training* (Standard gym session)  
    * *Cardio* (Running, Cycling, Rowing)  
    * *HIIT/Circuit* (Mixed modalities)  
* **Active Workout State:**  
  * Timer display (Duration of current workout).  
  * Ability to minimize the active workout to view history/analytics without cancelling the session.

### **2.2. Exercise Logging (Strength)**

* **Exercise Selection:** Searchable list of exercises (e.g., "Bench Press", "Incline Dumbbell Press").  
* **Set Logging:**  
  * Input fields for: **Weight (lbs/kg)** and **Reps**.  
  * "Add Set" button to append rows dynamically.  
  * "Complete" toggle (checkbox) for every set.  
* **History Lookup:** While logging an exercise, the user should be able to see "Last Performance" (what they lifted last time) to guide weight selection.

### **2.3. Cardio Logging**

* If the "Cardio" Workout Mode is selected, the logging interface changes.  
* **Fields:** Duration (Time), Distance, and optionally Intensity (Low/Med/High).  
* **Free-form Note:** Ability to add notes (e.g., "Felt sluggish," "Treadmill incline set to 2").

### **2.4. Data Analytics (The Reporting Engine)**

The application must compute and visualize data for three timeframes: **Weekly, Monthly, Yearly**.

* **Metric 1: Workout Frequency:**  
  * Total number of workout sessions logged.  
  * Breakdown by Type (e.g., "12 Strength sessions, 4 Cardio sessions").  
* **Metric 2: Volume Load (Strength):**  
  * Calculation: $\\sum (\\text{Weight} \\times \\text{Reps})$ for all exercises.  
  * Visual: Line graph showing Total Volume per week/month.  
* **Metric 3: Repetition Volume:**  
  * Total reps performed (regardless of weight).  
* **Metric 4: Exercise Specific Progress:**  
  * Select a specific exercise (e.g., "Bench Press") to see a max weight trend line over time.

## **3\. Data Model (Schema Design)**

To support the analytics, the data model from your original plan needs to be slightly expanded.

TypeScript  
// Types definitions

type WorkoutType \= 'STRENGTH' | 'CARDIO' | 'HIIT';

interface ExerciseDef {  
  id: string;  
  name: string;      // e.g., "Bench Press", "5k Run"  
  category: string;  // e.g., "Chest", "Cardio"  
  isCardio: boolean; // Determines which input fields to show  
}

interface SetLog {  
  id: string;  
  reps?: number;     // Strength only  
  weight?: number;   // Strength only  
  distance?: number; // Cardio only  
  duration?: number; // Cardio/HIIT (in seconds)  
  completed: boolean;  
}

interface ExerciseLog {  
  id: string;        // Unique instance ID  
  exerciseId: string; // Links to ExerciseDef  
  sets: SetLog\[\];  
}

interface WorkoutSession {  
  id: string;  
  date: string;      // ISO Date  
  startTime: number; // Timestamp  
  endTime: number;   // Timestamp  
  type: WorkoutType; // "Garmin-style" selector  
  exercises: ExerciseLog\[\];  
}

## **4\. UI/UX Requirements**

### **4.1. Navigation Structure (Mobile Bottom Bar)**

1. **Dashboard/Analytics:** High-level view of Weekly/Monthly stats. (Default View when not working out).  
2. **Log/Start:** Large, central button to start a workout.  
3. **History:** Chronological list of past workouts with expandable details.  
4. **Settings:** Edit specific exercises, manage data (export/clear).

### **4.2. Visual Aesthetic**

* **Theme:** Dark mode default (better for battery life in gym and "premium" feel).  
* **Interactivity:** Large touch targets (buttons must be easy to hit with sweaty fingers).  
* **Feedback:** Visual confirmation when a set is marked complete (e.g., green flash or haptic feedback if supported).

## **5\. Technical Implementation Strategy**

### **5.1. Tech Stack (Confirmed)**

* **Framework:** React \+ TypeScript (Vite)  
* **State Management:** React Context (Suitable for MVP).  
* **Storage:** localStorage (Key for MVP).  
  * *Constraint Note:* Analytics on localStorage requires fetching *all* history into memory to calculate sums. For an MVP with \<1000 workouts, this is fine.  
* **Styling:** Vanilla CSS Variables (root level theme definition).  
* **Charting Library:** **Recharts** or **Chart.js** (Recommended addition).  
  * *Reasoning:* Writing analytics visualizations from scratch in Vanilla CSS is time-consuming and prone to errors. A lightweight library is better for the MVP.

### **5.2. Component Architecture Updates**

Based on your file, here is the updated component plan:

* **src/features/analytics/**  
  * Dashboard.tsx: Container for charts.  
  * VolumeChart.tsx: Visualizes weight moved over time.  
  * FrequencyStats.tsx: Simple counter cards (e.g., "4 Workouts this week").  
* **src/features/tracker/**  
  * WorkoutTypeSelector.tsx: The "Garmin-style" entry screen.  
  * CardioLogger.tsx: Inputs for distance/time.  
  * StrengthLogger.tsx: Inputs for sets/reps/weight.

## **6\. Implementation Roadmap**

### **Phase 1: Core Logging (Days 1-3)**

* Setup React/Vite/PWA manifest.  
* Implement useLocalStorage hook.  
* Build the "Start Workout" flow with Type selection.  
* Build Strength Logging (Sets/Reps).

### **Phase 2: History & Persistence (Days 4-5)**

* Save workout flows.  
* Create the History view (list of past JSON objects formatted nicely).  
* Allow editing of past exercises (optional for MVP, but good to have).

### **Phase 3: Analytics Engine (Days 6-7)**

* Implement helper functions to calculate:  
  * getVolumeByWeek(workouts)  
  * getWorkoutCountByMonth(workouts)  
* Integrate Charting library.  
* Connect Dashboard to these helper functions.

---

### **Recommended Next Step**

Would you like me to generate the **TypeScript interfaces** and the **Analytics Helper functions** (the logic to calculate weekly volume/reps) so you can drop them straight into your project?

