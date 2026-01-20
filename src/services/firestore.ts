import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  deleteField,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  writeBatch,
  getCountFromServer,
  type FirestoreError,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Workout, Routine, UserPreferences } from '../types';

/**
 * Get error message from Firestore errors
 */
const getFirestoreErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'code' in error) {
    const firestoreError = error as FirestoreError;
    switch (firestoreError.code) {
      case 'permission-denied':
        return 'You do not have permission to perform this action.';
      case 'unavailable':
        return 'Service temporarily unavailable. Please try again.';
      case 'not-found':
        return 'The requested data was not found.';
      default:
        return firestoreError.message || 'A database error occurred.';
    }
  }
  return 'An unexpected error occurred.';
};

/**
 * Remove undefined values from an object at all nesting levels (Firestore doesn't accept undefined)
 * Uses JSON serialization which automatically strips undefined values
 */
const removeUndefined = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

const COLLECTIONS = {
  WORKOUTS: 'workouts',
  ROUTINES: 'routines',
  ACTIVE_WORKOUT: 'activeWorkout',
} as const;

const MAX_USERS = 10;

/**
 * Get reference to user's collection
 */
const getUserCollection = (userId: string, collectionName: string) => {
  return collection(db, 'users', userId, collectionName);
};

/**
 * Get reference to user's document
 */
const getUserDoc = (userId: string, collectionName: string, docId: string) => {
  return doc(db, 'users', userId, collectionName, docId);
};

// ==================== USER LIMIT ====================

/**
 * Get the current count of registered users
 */
export const getUserCount = async (): Promise<{ count: number; error: string | null }> => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getCountFromServer(usersRef);
    return { count: snapshot.data().count, error: null };
  } catch (error: unknown) {
    console.error('Error getting user count:', error);
    return { count: 0, error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Check if a user is already registered in Firestore
 */
export const checkUserExists = async (userId: string): Promise<{ exists: boolean; error: string | null }> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return { exists: userDoc.exists(), error: null };
  } catch (error: unknown) {
    console.error('Error checking user exists:', error);
    return { exists: false, error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Check if user limit has been reached
 */
export const isUserLimitReached = async (): Promise<{ limitReached: boolean; error: string | null }> => {
  const { count, error } = await getUserCount();
  if (error) {
    return { limitReached: false, error };
  }
  return { limitReached: count >= MAX_USERS, error: null };
};

/**
 * Register a new user (creates user document in Firestore)
 * @param userId - Firebase Auth user ID
 * @param email - User's email
 * @param displayName - User's display name (optional)
 * @param skipLimitCheck - Skip the user limit check (for migrating existing users)
 */
export const registerUser = async (
  userId: string,
  email: string,
  displayName?: string,
  skipLimitCheck = false
): Promise<{ error: string | null }> => {
  try {
    // Check limit before registering (unless skipped for migration)
    if (!skipLimitCheck) {
      const { limitReached, error: limitError } = await isUserLimitReached();
      if (limitError) {
        return { error: limitError };
      }
      if (limitReached) {
        return { error: 'Registration is currently closed. Maximum number of users reached.' };
      }
    }

    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      email,
      displayName: displayName || null,
      createdAt: Timestamp.now(),
    });
    return { error: null };
  } catch (error: unknown) {
    console.error('Error registering user:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

// ==================== USER PREFERENCES ====================

/**
 * Save user preferences to Firestore
 */
export const saveUserPreferences = async (
  userId: string,
  preferences: UserPreferences
): Promise<{ error: string | null }> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      preferences: preferences,
      preferencesUpdatedAt: Timestamp.now(),
    });
    return { error: null };
  } catch (error: unknown) {
    console.error('Error saving user preferences:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Subscribe to user preferences updates
 */
export const subscribeToUserPreferences = (
  userId: string,
  onUpdate: (preferences: UserPreferences | null) => void,
  onError?: (error: Error) => void
) => {
  const userRef = doc(db, 'users', userId);

  return onSnapshot(
    userRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.preferences) {
          onUpdate(data.preferences as UserPreferences);
        } else {
          // No preferences set yet, return null
          onUpdate(null);
        }
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error('Error in preferences subscription:', error);
      if (onError) onError(error);
    }
  );
};

// ==================== WORKOUTS ====================

/**
 * Save a workout to Firestore
 */
export const saveWorkout = async (userId: string, workout: Workout) => {
  try {
    const workoutRef = getUserDoc(userId, COLLECTIONS.WORKOUTS, workout.id);
    await setDoc(workoutRef, {
      ...workout,
      updatedAt: Timestamp.now(),
    });
    return { error: null };
  } catch (error: unknown) {
    console.error('Error saving workout:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Get all workouts for a user
 */
export const getWorkouts = async (userId: string): Promise<{ workouts: Workout[]; error: string | null }> => {
  try {
    const workoutsRef = getUserCollection(userId, COLLECTIONS.WORKOUTS);
    const q = query(workoutsRef, orderBy('startTime', 'desc'));
    const querySnapshot = await getDocs(q);

    const workouts: Workout[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      workouts.push({
        id: doc.id,
        name: data.name,
        type: data.type,
        startTime: data.startTime,
        endTime: data.endTime,
        pausedAt: data.pausedAt,
        totalPausedTime: data.totalPausedTime ?? 0,
        duration: data.duration,
        exercises: data.exercises,
        notes: data.notes,
        status: data.status,
        deletedAt: data.deletedAt,
      });
    });

    return { workouts, error: null };
  } catch (error: unknown) {
    console.error('Error getting workouts:', error);
    return { workouts: [], error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Subscribe to real-time workout updates
 */
export const subscribeToWorkouts = (
  userId: string,
  onUpdate: (workouts: Workout[]) => void,
  onError?: (error: Error) => void
) => {
  const workoutsRef = getUserCollection(userId, COLLECTIONS.WORKOUTS);
  const q = query(workoutsRef, orderBy('startTime', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const workouts: Workout[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        workouts.push({
          id: doc.id,
          name: data.name,
          type: data.type,
          startTime: data.startTime,
          endTime: data.endTime,
          pausedAt: data.pausedAt,
          totalPausedTime: data.totalPausedTime ?? 0,
          duration: data.duration,
          exercises: data.exercises,
          notes: data.notes,
          status: data.status,
          deletedAt: data.deletedAt,
        });
      });
      onUpdate(workouts);
    },
    (error) => {
      console.error('Error in workouts subscription:', error);
      if (onError) onError(error);
    }
  );
};

/**
 * Delete a workout
 */
export const deleteWorkout = async (userId: string, workoutId: string) => {
  try {
    const workoutRef = getUserDoc(userId, COLLECTIONS.WORKOUTS, workoutId);
    await deleteDoc(workoutRef);
    return { error: null };
  } catch (error: unknown) {
    console.error('Error deleting workout:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Soft delete a workout (set deletedAt timestamp for 7-day retention)
 */
export const softDeleteWorkoutInFirestore = async (
  userId: string,
  workoutId: string
): Promise<{ error: string | null }> => {
  try {
    const workoutRef = getUserDoc(userId, COLLECTIONS.WORKOUTS, workoutId);
    await updateDoc(workoutRef, {
      deletedAt: Date.now(),
      updatedAt: Timestamp.now(),
    });
    return { error: null };
  } catch (error: unknown) {
    console.error('Error soft deleting workout:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Restore a soft-deleted workout (remove deletedAt field)
 */
export const restoreWorkoutInFirestore = async (
  userId: string,
  workoutId: string
): Promise<{ error: string | null }> => {
  try {
    const workoutRef = getUserDoc(userId, COLLECTIONS.WORKOUTS, workoutId);
    await updateDoc(workoutRef, {
      deletedAt: deleteField(),
      updatedAt: Timestamp.now(),
    });
    return { error: null };
  } catch (error: unknown) {
    console.error('Error restoring workout:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Permanently delete a workout from Firestore
 */
export const permanentlyDeleteWorkoutInFirestore = async (
  userId: string,
  workoutId: string
): Promise<{ error: string | null }> => {
  try {
    const workoutRef = getUserDoc(userId, COLLECTIONS.WORKOUTS, workoutId);
    await deleteDoc(workoutRef);
    return { error: null };
  } catch (error: unknown) {
    console.error('Error permanently deleting workout:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

// ==================== UPDATE WORKOUT ====================

/**
 * Update an existing workout in Firestore
 */
export const updateWorkoutInFirestore = async (
  userId: string,
  workout: Workout
): Promise<{ error: string | null }> => {
  try {
    const workoutRef = getUserDoc(userId, COLLECTIONS.WORKOUTS, workout.id);
    await setDoc(workoutRef, {
      ...removeUndefined(workout),
      updatedAt: Timestamp.now(),
    });
    return { error: null };
  } catch (error: unknown) {
    console.error('Error updating workout:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

// ==================== ACTIVE WORKOUT ====================

/**
 * Save active workout state
 */
export const saveActiveWorkout = async (userId: string, workout: Workout | null) => {
  try {
    const activeWorkoutRef = getUserDoc(userId, COLLECTIONS.ACTIVE_WORKOUT, 'current');
    if (workout) {
      await setDoc(activeWorkoutRef, removeUndefined({
        ...workout,
        updatedAt: Timestamp.now(),
      }));
    } else {
      await deleteDoc(activeWorkoutRef);
    }
    return { error: null };
  } catch (error: unknown) {
    console.error('Error saving active workout:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Get active workout
 */
export const getActiveWorkout = async (userId: string): Promise<{ workout: Workout | null; error: string | null }> => {
  try {
    const activeWorkoutRef = getUserDoc(userId, COLLECTIONS.ACTIVE_WORKOUT, 'current');
    const docSnap = await getDoc(activeWorkoutRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        workout: {
          id: data.id,
          name: data.name,
          type: data.type,
          startTime: data.startTime,
          endTime: data.endTime,
          pausedAt: data.pausedAt,
          totalPausedTime: data.totalPausedTime ?? 0,
          duration: data.duration,
          exercises: data.exercises,
          notes: data.notes,
          status: data.status,
        },
        error: null,
      };
    }

    return { workout: null, error: null };
  } catch (error: unknown) {
    console.error('Error getting active workout:', error);
    return { workout: null, error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Subscribe to active workout updates
 */
export const subscribeToActiveWorkout = (
  userId: string,
  onUpdate: (workout: Workout | null) => void,
  onError?: (error: Error) => void
) => {
  const activeWorkoutRef = getUserDoc(userId, COLLECTIONS.ACTIVE_WORKOUT, 'current');

  return onSnapshot(
    activeWorkoutRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        onUpdate({
          id: data.id,
          name: data.name,
          type: data.type,
          startTime: data.startTime,
          endTime: data.endTime,
          pausedAt: data.pausedAt,
          totalPausedTime: data.totalPausedTime ?? 0,
          duration: data.duration,
          exercises: data.exercises,
          notes: data.notes,
          status: data.status,
        });
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error('Error in active workout subscription:', error);
      if (onError) onError(error);
    }
  );
};

// ==================== ROUTINES ====================

/**
 * Save a routine to Firestore
 */
export const saveRoutine = async (userId: string, routine: Routine) => {
  try {
    const routineRef = getUserDoc(userId, COLLECTIONS.ROUTINES, routine.id);
    await setDoc(routineRef, {
      ...routine,
      updatedAt: Timestamp.now(),
    });
    return { error: null };
  } catch (error: unknown) {
    console.error('Error saving routine:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Save a routine and update the active workout atomically
 * Used when creating a new routine from the current workout
 */
export const saveRoutineAndWorkoutAtomic = async (
  userId: string,
  routine: Routine,
  updatedWorkout: Workout
) => {
  try {
    const batch = writeBatch(db);

    // Save the new routine
    const routineRef = getUserDoc(userId, COLLECTIONS.ROUTINES, routine.id);
    batch.set(routineRef, {
      ...routine,
      updatedAt: Timestamp.now(),
    });

    // Update the active workout with routineId and new name
    const activeWorkoutRef = getUserDoc(userId, COLLECTIONS.ACTIVE_WORKOUT, 'current');
    batch.set(activeWorkoutRef, removeUndefined({
      ...updatedWorkout,
      updatedAt: Timestamp.now(),
    }));

    await batch.commit();
    return { error: null };
  } catch (error: unknown) {
    console.error('Error saving routine and workout:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Get all routines for a user
 */
export const getRoutines = async (userId: string): Promise<{ routines: Routine[]; error: string | null }> => {
  try {
    const routinesRef = getUserCollection(userId, COLLECTIONS.ROUTINES);
    const querySnapshot = await getDocs(routinesRef);

    const routines: Routine[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      routines.push({
        id: doc.id,
        name: data.name,
        exercises: data.exercises,
      });
    });

    return { routines, error: null };
  } catch (error: unknown) {
    console.error('Error getting routines:', error);
    return { routines: [], error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Subscribe to real-time routine updates
 */
export const subscribeToRoutines = (
  userId: string,
  onUpdate: (routines: Routine[]) => void,
  onError?: (error: Error) => void
) => {
  const routinesRef = getUserCollection(userId, COLLECTIONS.ROUTINES);

  return onSnapshot(
    routinesRef,
    (snapshot) => {
      const routines: Routine[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        routines.push({
          id: doc.id,
          name: data.name,
          exercises: data.exercises,
        });
      });
      onUpdate(routines);
    },
    (error) => {
      console.error('Error in routines subscription:', error);
      if (onError) onError(error);
    }
  );
};

/**
 * Delete a routine
 */
export const deleteRoutine = async (userId: string, routineId: string) => {
  try {
    const routineRef = getUserDoc(userId, COLLECTIONS.ROUTINES, routineId);
    await deleteDoc(routineRef);
    return { error: null };
  } catch (error: unknown) {
    console.error('Error deleting routine:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

// ==================== ATOMIC OPERATIONS ====================

/**
 * Atomically finish a workout - saves completed workout and clears active workout in one batch
 */
export const finishWorkoutAtomic = async (userId: string, completedWorkout: Workout) => {
  try {
    const batch = writeBatch(db);

    // Add completed workout to history
    const workoutRef = getUserDoc(userId, COLLECTIONS.WORKOUTS, completedWorkout.id);
    batch.set(workoutRef, removeUndefined({
      ...completedWorkout,
      updatedAt: Timestamp.now(),
    }));

    // Delete active workout
    const activeWorkoutRef = getUserDoc(userId, COLLECTIONS.ACTIVE_WORKOUT, 'current');
    batch.delete(activeWorkoutRef);

    await batch.commit();
    return { error: null };
  } catch (error: unknown) {
    console.error('Error finishing workout:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

/**
 * Atomically resume a finished workout - moves workout from history back to active (inverse of finishWorkoutAtomic)
 */
export const resumeFinishedWorkoutAtomic = async (userId: string, workoutId: string, resumedWorkout: Workout) => {
  try {
    const batch = writeBatch(db);

    // Delete from workouts collection
    const workoutRef = getUserDoc(userId, COLLECTIONS.WORKOUTS, workoutId);
    batch.delete(workoutRef);

    // Save as active workout
    const activeWorkoutRef = getUserDoc(userId, COLLECTIONS.ACTIVE_WORKOUT, 'current');
    batch.set(activeWorkoutRef, removeUndefined({
      ...resumedWorkout,
      updatedAt: Timestamp.now(),
    }));

    await batch.commit();
    return { error: null };
  } catch (error: unknown) {
    console.error('Error resuming finished workout:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};

// ==================== MIGRATION ====================

/**
 * Migrate localStorage data to Firestore (one-time operation)
 */
export const migrateLocalDataToFirestore = async (
  userId: string,
  workouts: Workout[],
  routines: Routine[],
  activeWorkout: Workout | null
) => {
  try {
    const batch = writeBatch(db);

    // Migrate workouts
    workouts.forEach((workout) => {
      const workoutRef = getUserDoc(userId, COLLECTIONS.WORKOUTS, workout.id);
      batch.set(workoutRef, removeUndefined({
        ...workout,
        updatedAt: Timestamp.now(),
      }));
    });

    // Migrate routines
    routines.forEach((routine) => {
      const routineRef = getUserDoc(userId, COLLECTIONS.ROUTINES, routine.id);
      batch.set(routineRef, {
        ...routine,
        updatedAt: Timestamp.now(),
      });
    });

    // Migrate active workout
    if (activeWorkout) {
      const activeWorkoutRef = getUserDoc(userId, COLLECTIONS.ACTIVE_WORKOUT, 'current');
      batch.set(activeWorkoutRef, removeUndefined({
        ...activeWorkout,
        updatedAt: Timestamp.now(),
      }));
    }

    await batch.commit();
    return { error: null };
  } catch (error: unknown) {
    console.error('Error migrating data:', error);
    return { error: getFirestoreErrorMessage(error) };
  }
};
