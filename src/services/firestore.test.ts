import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getUserCount,
  checkUserExists,
  isUserLimitReached,
  registerUser,
} from './firestore';

// Mock Firestore functions
const mockGetCountFromServer = vi.fn();
const mockGetDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockCollection = vi.fn();
const mockDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  getDocs: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  Timestamp: {
    now: () => ({ seconds: 1234567890, nanoseconds: 0 }),
  },
  writeBatch: vi.fn(),
  getCountFromServer: (...args: unknown[]) => mockGetCountFromServer(...args),
}));

vi.mock('../config/firebase', () => ({
  db: {},
}));

describe('Firestore User Limit Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserCount', () => {
    it('should return the count of registered users', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 5 }),
      });

      const result = await getUserCount();

      expect(result.count).toBe(5);
      expect(result.error).toBeNull();
    });

    it('should return 0 count when no users exist', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 0 }),
      });

      const result = await getUserCount();

      expect(result.count).toBe(0);
      expect(result.error).toBeNull();
    });

    it('should return error on failure', async () => {
      mockGetCountFromServer.mockRejectedValue({
        code: 'permission-denied',
        message: 'Permission denied',
      });

      const result = await getUserCount();

      expect(result.count).toBe(0);
      expect(result.error).toBe('You do not have permission to perform this action.');
    });

    it('should handle unexpected errors', async () => {
      mockGetCountFromServer.mockRejectedValue(new Error('Network error'));

      const result = await getUserCount();

      expect(result.count).toBe(0);
      expect(result.error).toBe('An unexpected error occurred.');
    });
  });

  describe('checkUserExists', () => {
    it('should return true when user exists', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => true,
      });

      const result = await checkUserExists('user-123');

      expect(result.exists).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return false when user does not exist', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      const result = await checkUserExists('user-456');

      expect(result.exists).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should return error on failure', async () => {
      mockGetDoc.mockRejectedValue({
        code: 'unavailable',
        message: 'Service unavailable',
      });

      const result = await checkUserExists('user-789');

      expect(result.exists).toBe(false);
      expect(result.error).toBe('Service temporarily unavailable. Please try again.');
    });
  });

  describe('isUserLimitReached', () => {
    it('should return false when under limit', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 5 }),
      });

      const result = await isUserLimitReached();

      expect(result.limitReached).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should return true when at limit (10 users)', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 10 }),
      });

      const result = await isUserLimitReached();

      expect(result.limitReached).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return true when over limit', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 15 }),
      });

      const result = await isUserLimitReached();

      expect(result.limitReached).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return false when at 9 users (one below limit)', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 9 }),
      });

      const result = await isUserLimitReached();

      expect(result.limitReached).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should return error when count fails', async () => {
      mockGetCountFromServer.mockRejectedValue({
        code: 'permission-denied',
        message: 'Permission denied',
      });

      const result = await isUserLimitReached();

      expect(result.limitReached).toBe(false);
      expect(result.error).toBe('You do not have permission to perform this action.');
    });
  });

  describe('registerUser', () => {
    it('should register user when under limit', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 5 }),
      });
      mockSetDoc.mockResolvedValue(undefined);

      const result = await registerUser('user-123', 'test@example.com', 'Test User');

      expect(result.error).toBeNull();
      expect(mockSetDoc).toHaveBeenCalled();
    });

    it('should register user without display name', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 5 }),
      });
      mockSetDoc.mockResolvedValue(undefined);

      const result = await registerUser('user-123', 'test@example.com');

      expect(result.error).toBeNull();
      expect(mockSetDoc).toHaveBeenCalled();
    });

    it('should reject registration when at limit', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 10 }),
      });

      const result = await registerUser('user-123', 'test@example.com', 'Test User');

      expect(result.error).toBe('Registration is currently closed. Maximum number of users reached.');
      expect(mockSetDoc).not.toHaveBeenCalled();
    });

    it('should reject registration when over limit', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 15 }),
      });

      const result = await registerUser('user-123', 'test@example.com');

      expect(result.error).toBe('Registration is currently closed. Maximum number of users reached.');
      expect(mockSetDoc).not.toHaveBeenCalled();
    });

    it('should return error when limit check fails', async () => {
      mockGetCountFromServer.mockRejectedValue({
        code: 'unavailable',
        message: 'Service unavailable',
      });

      const result = await registerUser('user-123', 'test@example.com');

      expect(result.error).toBe('Service temporarily unavailable. Please try again.');
      expect(mockSetDoc).not.toHaveBeenCalled();
    });

    it('should return error when setDoc fails', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 5 }),
      });
      mockSetDoc.mockRejectedValue({
        code: 'permission-denied',
        message: 'Permission denied',
      });

      const result = await registerUser('user-123', 'test@example.com');

      expect(result.error).toBe('You do not have permission to perform this action.');
    });

    it('should skip limit check when skipLimitCheck is true', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 15 }), // Over limit
      });
      mockSetDoc.mockResolvedValue(undefined);

      const result = await registerUser('user-123', 'test@example.com', 'Test User', true);

      expect(result.error).toBeNull();
      expect(mockSetDoc).toHaveBeenCalled();
      // getCountFromServer should not be called when skipping limit check
      expect(mockGetCountFromServer).not.toHaveBeenCalled();
    });

    it('should still check limit when skipLimitCheck is false', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 10 }),
      });

      const result = await registerUser('user-123', 'test@example.com', 'Test User', false);

      expect(result.error).toBe('Registration is currently closed. Maximum number of users reached.');
      expect(mockGetCountFromServer).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty user id', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      const result = await checkUserExists('');

      expect(result.exists).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle count of exactly 0', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 0 }),
      });

      const result = await isUserLimitReached();

      expect(result.limitReached).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should allow registration when at 9 users', async () => {
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 9 }),
      });
      mockSetDoc.mockResolvedValue(undefined);

      const result = await registerUser('user-10', 'tenth@example.com');

      expect(result.error).toBeNull();
      expect(mockSetDoc).toHaveBeenCalled();
    });
  });
});
