import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
  type AuthError,
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Get a user-friendly error message from Firebase Auth errors
 */
const getAuthErrorMessage = (error: unknown): string => {
  // DEBUG: Log the full error to console
  console.error('Firebase Auth Error:', error);

  if (error && typeof error === 'object' && 'code' in error) {
    const authError = error as AuthError;
    console.error('Error code:', authError.code);
    console.error('Error message:', authError.message);

    switch (authError.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/popup-closed-by-user':
        return ''; // User intentionally closed popup
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return authError.message || 'An authentication error occurred.';
    }
  }
  return 'An unexpected error occurred.';
};

/**
 * Sign up a new user with email and password
 */
export const signUp = async (email: string, password: string, displayName?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }

    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
};

/**
 * Sign in an existing user with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
};

/**
 * Sign in with Google (uses popup for better compatibility with Chrome's tracking protection)
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error: unknown) {
    const errorMessage = getAuthErrorMessage(error);
    // Return null error for user-cancelled popup (empty message from helper)
    if (!errorMessage) {
      return { user: null, error: null };
    }
    return { user: null, error: errorMessage };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: unknown) {
    return { error: getAuthErrorMessage(error) };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: unknown) {
    return { error: getAuthErrorMessage(error) };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
