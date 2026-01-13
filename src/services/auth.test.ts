import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  signUp,
  signIn,
  signInWithGoogle,
  signOut,
  resetPassword,
  getCurrentUser,
} from './auth';

// Mock Firebase auth
const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
};

const mockUserCredential = {
  user: mockUser,
};

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  updateProfile: vi.fn(),
  GoogleAuthProvider: class GoogleAuthProvider {},
  signInWithPopup: vi.fn(),
}));

vi.mock('../config/firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../config/firebase';

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a new user with email and password', async () => {
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(mockUserCredential as any);

      const result = await signUp('test@example.com', 'password123');

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('should update display name if provided', async () => {
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(mockUserCredential as any);
      vi.mocked(updateProfile).mockResolvedValue(undefined);

      await signUp('test@example.com', 'password123', 'John Doe');

      expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'John Doe' });
    });

    it('should not update display name if not provided', async () => {
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(mockUserCredential as any);

      await signUp('test@example.com', 'password123');

      expect(updateProfile).not.toHaveBeenCalled();
    });

    it('should return error message on failure', async () => {
      const firebaseError = { code: 'auth/email-already-in-use', message: 'Email already in use' };
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(firebaseError);

      const result = await signUp('test@example.com', 'password123');

      expect(result.user).toBeNull();
      expect(result.error).toBe('This email is already registered. Please sign in instead.');
    });
  });

  describe('signIn', () => {
    it('should sign in user with email and password', async () => {
      vi.mocked(signInWithEmailAndPassword).mockResolvedValue(mockUserCredential as any);

      const result = await signIn('test@example.com', 'password123');

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('should return error message on invalid credentials', async () => {
      const firebaseError = { code: 'auth/wrong-password', message: 'Invalid password' };
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue(firebaseError);

      const result = await signIn('test@example.com', 'wrongpassword');

      expect(result.user).toBeNull();
      expect(result.error).toBe('Incorrect password. Please try again.');
    });
  });

  describe('signInWithGoogle', () => {
    it('should sign in user with Google popup', async () => {
      vi.mocked(signInWithPopup).mockResolvedValue(mockUserCredential as any);

      const result = await signInWithGoogle();

      expect(signInWithPopup).toHaveBeenCalled();
      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('should return null user and no error when popup is closed by user', async () => {
      const popupClosedError = { code: 'auth/popup-closed-by-user', message: 'Popup closed' };
      vi.mocked(signInWithPopup).mockRejectedValue(popupClosedError);

      const result = await signInWithGoogle();

      expect(result.user).toBeNull();
      expect(result.error).toBeNull();
    });

    it('should return error message on other failures', async () => {
      const firebaseError = { code: 'auth/network-request-failed', message: 'Network error' };
      vi.mocked(signInWithPopup).mockRejectedValue(firebaseError);

      const result = await signInWithGoogle();

      expect(result.user).toBeNull();
      expect(result.error).toBe('Network error. Please check your connection.');
    });
  });

  describe('signOut', () => {
    it('should sign out the current user', async () => {
      vi.mocked(firebaseSignOut).mockResolvedValue(undefined);

      const result = await signOut();

      expect(firebaseSignOut).toHaveBeenCalledWith(auth);
      expect(result.error).toBeNull();
    });

    it('should return error message on failure', async () => {
      const firebaseError = { code: 'auth/internal-error', message: 'Sign out failed' };
      vi.mocked(firebaseSignOut).mockRejectedValue(firebaseError);

      const result = await signOut();

      expect(result.error).toBe('Sign out failed');
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      vi.mocked(sendPasswordResetEmail).mockResolvedValue(undefined);

      const result = await resetPassword('test@example.com');

      expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, 'test@example.com');
      expect(result.error).toBeNull();
    });

    it('should return error message on failure', async () => {
      const firebaseError = { code: 'auth/user-not-found', message: 'User not found' };
      vi.mocked(sendPasswordResetEmail).mockRejectedValue(firebaseError);

      const result = await resetPassword('nonexistent@example.com');

      expect(result.error).toBe('No account found with this email.');
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user from auth', () => {
      // Mock auth.currentUser
      Object.defineProperty(auth, 'currentUser', {
        value: mockUser,
        writable: true,
      });

      const result = getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    it('should return null when no user is signed in', () => {
      Object.defineProperty(auth, 'currentUser', {
        value: null,
        writable: true,
      });

      const result = getCurrentUser();

      expect(result).toBeNull();
    });
  });
});
