import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Auth } from '../Auth';

// Mock auth functions
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockSignInWithGoogle = vi.fn();
const mockSignOut = vi.fn();

vi.mock('../../services/auth', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signUp: (...args: unknown[]) => mockSignUp(...args),
  signInWithGoogle: () => mockSignInWithGoogle(),
  signOut: () => mockSignOut(),
}));

// Mock firestore functions
const mockIsUserLimitReached = vi.fn();
const mockRegisterUser = vi.fn();
const mockCheckUserExists = vi.fn();

vi.mock('../../services/firestore', () => ({
  isUserLimitReached: () => mockIsUserLimitReached(),
  registerUser: (...args: unknown[]) => mockRegisterUser(...args),
  checkUserExists: (...args: unknown[]) => mockCheckUserExists(...args),
}));

describe('Auth', () => {
  const mockOnAuthSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSignIn.mockResolvedValue({ user: null, error: null });
    mockSignUp.mockResolvedValue({ user: null, error: null });
    mockSignInWithGoogle.mockResolvedValue({ user: null, error: null });
    mockSignOut.mockResolvedValue({ error: null });
    // Default: registration open, user does not exist
    mockIsUserLimitReached.mockResolvedValue({ limitReached: false, error: null });
    mockRegisterUser.mockResolvedValue({ error: null });
    mockCheckUserExists.mockResolvedValue({ exists: false, error: null });
  });

  describe('initial render', () => {
    it('should render the app title', () => {
      render(<Auth />);

      expect(screen.getByText('Workout Tracker')).toBeInTheDocument();
    });

    it('should show login mode by default', () => {
      render(<Auth />);

      expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    });

    it('should render email input', () => {
      render(<Auth />);

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    });

    it('should render password input', () => {
      render(<Auth />);

      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('should render Sign In button in login mode', () => {
      render(<Auth />);

      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('should render Google sign-in button', () => {
      render(<Auth />);

      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    });

    it('should not show Display Name field in login mode', () => {
      render(<Auth />);

      expect(screen.queryByText('Display Name')).not.toBeInTheDocument();
    });
  });

  describe('mode toggle', () => {
    it('should show "Don\'t have an account?" text in login mode', () => {
      render(<Auth />);

      expect(screen.getByText(/Don't have an account\?/)).toBeInTheDocument();
    });

    it('should switch to signup mode when toggle is clicked', async () => {
      const user = userEvent.setup();

      render(<Auth />);

      await user.click(screen.getByText('Sign up'));

      expect(screen.getByText('Start your fitness journey')).toBeInTheDocument();
    });

    it('should show Display Name field in signup mode', async () => {
      const user = userEvent.setup();

      render(<Auth />);

      await user.click(screen.getByText('Sign up'));

      expect(screen.getByText('Display Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    });

    it('should show Create Account button in signup mode', async () => {
      const user = userEvent.setup();

      render(<Auth />);

      await user.click(screen.getByText('Sign up'));

      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });

    it('should show "Already have an account?" in signup mode', async () => {
      const user = userEvent.setup();

      render(<Auth />);

      await user.click(screen.getByText('Sign up'));

      expect(screen.getByText(/Already have an account\?/)).toBeInTheDocument();
    });

    it('should switch back to login mode', async () => {
      const user = userEvent.setup();

      render(<Auth />);

      // Switch to signup
      await user.click(screen.getByText('Sign up'));
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();

      // Switch back to login
      await user.click(screen.getByText('Sign in'));
      // Wait for the AnimatePresence exit animation to complete
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Enter your name')).not.toBeInTheDocument();
      });
    });

    it('should clear form fields when switching modes', async () => {
      const user = userEvent.setup();

      render(<Auth />);

      // Fill in login fields
      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');

      // Switch to signup
      await user.click(screen.getByText('Sign up'));

      // Fields should be cleared
      expect(screen.getByPlaceholderText('your@email.com')).toHaveValue('');
      expect(screen.getByPlaceholderText('••••••••')).toHaveValue('');
    });
  });

  describe('form submission - login', () => {
    it('should call signIn with email and password', async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValue({ user: { id: '1' }, error: null });

      render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('should call onAuthSuccess when login succeeds', async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValue({ user: { id: '1' }, error: null });

      render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(mockOnAuthSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('should display error message when login fails', async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValue({ user: null, error: 'Invalid credentials' });

      render(<Auth />);

      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  describe('form submission - signup', () => {
    it('should call signUp with email, password, and displayName', async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({ user: { id: '1' }, error: null });

      render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

      // Switch to signup mode
      await user.click(screen.getByText('Sign up'));

      await user.type(screen.getByPlaceholderText('Enter your name'), 'John Doe');
      await user.type(screen.getByPlaceholderText('your@email.com'), 'john@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('john@example.com', 'password123', 'John Doe');
      });
    });

    it('should call onAuthSuccess when signup succeeds', async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({ user: { uid: '1', email: 'john@example.com' }, error: null });
      mockRegisterUser.mockResolvedValue({ error: null });

      render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

      await user.click(screen.getByText('Sign up'));
      await user.type(screen.getByPlaceholderText('Enter your name'), 'John Doe');
      await user.type(screen.getByPlaceholderText('your@email.com'), 'john@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      await waitFor(() => {
        expect(mockRegisterUser).toHaveBeenCalledWith('1', 'john@example.com', 'John Doe');
        expect(mockOnAuthSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('should display error message when signup fails', async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({ user: null, error: 'Email already in use' });

      render(<Auth />);

      await user.click(screen.getByText('Sign up'));
      await user.type(screen.getByPlaceholderText('Enter your name'), 'John Doe');
      await user.type(screen.getByPlaceholderText('your@email.com'), 'john@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      await waitFor(() => {
        expect(screen.getByText('Email already in use')).toBeInTheDocument();
      });
    });
  });

  describe('Google sign-in', () => {
    it('should call signInWithGoogle when Google button is clicked', async () => {
      const user = userEvent.setup();
      mockSignInWithGoogle.mockResolvedValue({ user: { id: '1' }, error: null });

      render(<Auth />);

      await user.click(screen.getByText('Continue with Google'));

      await waitFor(() => {
        expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onAuthSuccess when Google sign-in succeeds for existing user', async () => {
      const user = userEvent.setup();
      mockSignInWithGoogle.mockResolvedValue({ user: { uid: '1', email: 'test@example.com' }, error: null });
      mockCheckUserExists.mockResolvedValue({ exists: true, error: null });

      render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

      await user.click(screen.getByText('Continue with Google'));

      await waitFor(() => {
        expect(mockCheckUserExists).toHaveBeenCalledWith('1');
        expect(mockRegisterUser).not.toHaveBeenCalled();
        expect(mockOnAuthSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('should register new user on Google sign-in', async () => {
      const user = userEvent.setup();
      const creationTime = '2024-01-01T00:00:00Z';
      mockSignInWithGoogle.mockResolvedValue({
        user: {
          uid: '1',
          email: 'new@example.com',
          displayName: 'New User',
          metadata: { creationTime, lastSignInTime: creationTime } // Same time = new user
        },
        error: null
      });
      mockCheckUserExists.mockResolvedValue({ exists: false, error: null });
      mockRegisterUser.mockResolvedValue({ error: null });

      render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

      await user.click(screen.getByText('Continue with Google'));

      await waitFor(() => {
        expect(mockCheckUserExists).toHaveBeenCalledWith('1');
        expect(mockRegisterUser).toHaveBeenCalledWith('1', 'new@example.com', 'New User', false);
        expect(mockOnAuthSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('should display error when Google sign-in fails', async () => {
      const user = userEvent.setup();
      mockSignInWithGoogle.mockResolvedValue({ user: null, error: 'Google sign-in failed' });

      render(<Auth />);

      await user.click(screen.getByText('Continue with Google'));

      await waitFor(() => {
        expect(screen.getByText('Google sign-in failed')).toBeInTheDocument();
      });
    });
  });

  describe('loading states', () => {
    it('should disable form during sign-in to prevent double submission', async () => {
      const user = userEvent.setup();
      // Track how many times signIn is called
      let signInCallCount = 0;
      mockSignIn.mockImplementation(() => {
        signInCallCount++;
        return Promise.resolve({ user: { id: '1' }, error: null });
      });

      render(<Auth />);

      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');

      // Click the button multiple times rapidly
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      await user.click(submitButton);

      // signIn should only be called once despite the button being visible
      expect(signInCallCount).toBe(1);
    });

    it('should disable form during Google sign-in to prevent double submission', async () => {
      const user = userEvent.setup();
      // Track how many times signInWithGoogle is called
      let googleCallCount = 0;
      mockSignInWithGoogle.mockImplementation(() => {
        googleCallCount++;
        return Promise.resolve({ user: { id: '1' }, error: null });
      });

      render(<Auth />);

      await user.click(screen.getByText('Continue with Google'));

      // signInWithGoogle should only be called once
      expect(googleCallCount).toBe(1);
    });
  });

  describe('error state clearing', () => {
    it('should clear error when switching modes', async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValue({ user: null, error: 'Invalid credentials' });

      render(<Auth />);

      // Trigger error
      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'wrong');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });

      // Switch mode
      await user.click(screen.getByText('Sign up'));

      // Error should be cleared
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });

  describe('input placeholders', () => {
    it('should have email placeholder', () => {
      render(<Auth />);

      expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    });

    it('should have password placeholder', () => {
      render(<Auth />);

      // Password field has masked placeholder
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('should have display name placeholder in signup mode', async () => {
      const user = userEvent.setup();

      render(<Auth />);

      await user.click(screen.getByText('Sign up'));

      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('should require email field', () => {
      render(<Auth />);

      const emailInput = screen.getByPlaceholderText('your@email.com');
      expect(emailInput).toHaveAttribute('required');
    });

    it('should require password field', () => {
      render(<Auth />);

      const passwordInput = screen.getByPlaceholderText('••••••••');
      expect(passwordInput).toHaveAttribute('required');
    });

    it('should require display name in signup mode', async () => {
      const user = userEvent.setup();

      render(<Auth />);

      await user.click(screen.getByText('Sign up'));

      const displayNameInput = screen.getByPlaceholderText('Enter your name');
      expect(displayNameInput).toHaveAttribute('required');
    });

    it('should have email type on email input', () => {
      render(<Auth />);

      const emailInput = screen.getByPlaceholderText('your@email.com');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should have password type on password input', () => {
      render(<Auth />);

      const passwordInput = screen.getByPlaceholderText('••••••••');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('divider', () => {
    it('should render "or" divider between form and Google button', () => {
      render(<Auth />);

      expect(screen.getByText('or')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have form element', () => {
      const { container } = render(<Auth />);

      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('should have labels for all inputs', () => {
      render(<Auth />);

      // Labels are rendered as text, not associated with htmlFor
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
    });
  });

  describe('user limit', () => {
    describe('registration closed banner', () => {
      it('should show registration closed banner when limit is reached in signup mode', async () => {
        const user = userEvent.setup();
        mockIsUserLimitReached.mockResolvedValue({ limitReached: true, error: null });

        render(<Auth />);

        await user.click(screen.getByText('Sign up'));

        await waitFor(() => {
          expect(screen.getByText('Registration is currently closed')).toBeInTheDocument();
          expect(screen.getByText('Maximum number of users reached. Please try again later.')).toBeInTheDocument();
        });
      });

      it('should show "Registration closed" subtitle when limit is reached', async () => {
        const user = userEvent.setup();
        mockIsUserLimitReached.mockResolvedValue({ limitReached: true, error: null });

        render(<Auth />);

        await user.click(screen.getByText('Sign up'));

        await waitFor(() => {
          expect(screen.getByText('Registration closed')).toBeInTheDocument();
        });
      });

      it('should not show registration closed banner in login mode', async () => {
        mockIsUserLimitReached.mockResolvedValue({ limitReached: true, error: null });

        render(<Auth />);

        expect(screen.queryByText('Registration is currently closed')).not.toBeInTheDocument();
      });

      it('should not show banner when under limit', async () => {
        const user = userEvent.setup();
        mockIsUserLimitReached.mockResolvedValue({ limitReached: false, error: null });

        render(<Auth />);

        await user.click(screen.getByText('Sign up'));

        await waitFor(() => {
          expect(screen.queryByText('Registration is currently closed')).not.toBeInTheDocument();
        });
      });
    });

    describe('signup button state', () => {
      it('should disable signup button when registration is closed', async () => {
        const user = userEvent.setup();
        mockIsUserLimitReached.mockResolvedValue({ limitReached: true, error: null });

        render(<Auth />);

        await user.click(screen.getByText('Sign up'));

        await waitFor(() => {
          expect(screen.getByRole('button', { name: 'Create Account' })).toBeDisabled();
        });
      });

      it('should enable signup button when under limit', async () => {
        const user = userEvent.setup();
        mockIsUserLimitReached.mockResolvedValue({ limitReached: false, error: null });

        render(<Auth />);

        await user.click(screen.getByText('Sign up'));

        await waitFor(() => {
          expect(screen.getByRole('button', { name: 'Create Account' })).not.toBeDisabled();
        });
      });
    });

    describe('email signup with limit', () => {
      it('should block signup when limit is reached during submission', async () => {
        const user = userEvent.setup();
        // First call (useEffect) returns false, second call (submission) returns true
        mockIsUserLimitReached
          .mockResolvedValueOnce({ limitReached: false, error: null })
          .mockResolvedValueOnce({ limitReached: true, error: null });

        render(<Auth />);

        await user.click(screen.getByText('Sign up'));
        await user.type(screen.getByPlaceholderText('Enter your name'), 'John Doe');
        await user.type(screen.getByPlaceholderText('your@email.com'), 'john@example.com');
        await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
        await user.click(screen.getByRole('button', { name: 'Create Account' }));

        await waitFor(() => {
          expect(screen.getByText('Registration is currently closed. Maximum number of users reached.')).toBeInTheDocument();
          expect(mockSignUp).not.toHaveBeenCalled();
        });
      });

      it('should sign out user if registerUser fails after signup', async () => {
        const user = userEvent.setup();
        mockSignUp.mockResolvedValue({ user: { uid: '1', email: 'john@example.com' }, error: null });
        mockRegisterUser.mockResolvedValue({ error: 'Registration failed' });

        render(<Auth />);

        await user.click(screen.getByText('Sign up'));
        await user.type(screen.getByPlaceholderText('Enter your name'), 'John Doe');
        await user.type(screen.getByPlaceholderText('your@email.com'), 'john@example.com');
        await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
        await user.click(screen.getByRole('button', { name: 'Create Account' }));

        await waitFor(() => {
          expect(mockSignOut).toHaveBeenCalled();
          expect(screen.getByText('Registration failed')).toBeInTheDocument();
        });
      });

      it('should show error when limit check fails', async () => {
        const user = userEvent.setup();
        mockIsUserLimitReached
          .mockResolvedValueOnce({ limitReached: false, error: null })
          .mockResolvedValueOnce({ limitReached: false, error: 'Database error' });

        render(<Auth />);

        await user.click(screen.getByText('Sign up'));
        await user.type(screen.getByPlaceholderText('Enter your name'), 'John Doe');
        await user.type(screen.getByPlaceholderText('your@email.com'), 'john@example.com');
        await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
        await user.click(screen.getByRole('button', { name: 'Create Account' }));

        await waitFor(() => {
          expect(screen.getByText('Database error')).toBeInTheDocument();
          expect(mockSignUp).not.toHaveBeenCalled();
        });
      });
    });

    describe('Google sign-in with limit', () => {
      it('should block new Google user when limit is reached', async () => {
        const user = userEvent.setup();
        const creationTime = '2024-01-01T00:00:00Z';
        mockSignInWithGoogle.mockResolvedValue({
          user: {
            uid: '1',
            email: 'new@example.com',
            displayName: 'New User',
            metadata: { creationTime, lastSignInTime: creationTime }
          },
          error: null
        });
        mockCheckUserExists.mockResolvedValue({ exists: false, error: null });
        mockIsUserLimitReached.mockResolvedValue({ limitReached: true, error: null });

        render(<Auth />);

        await user.click(screen.getByText('Continue with Google'));

        await waitFor(() => {
          expect(mockSignOut).toHaveBeenCalled();
          expect(screen.getByText('Registration is currently closed. Maximum number of users reached.')).toBeInTheDocument();
        });
      });

      it('should allow existing Google user when limit is reached', async () => {
        const user = userEvent.setup();
        mockSignInWithGoogle.mockResolvedValue({
          user: {
            uid: '1',
            email: 'existing@example.com',
            metadata: { creationTime: '2024-01-01T00:00:00Z', lastSignInTime: '2024-06-01T00:00:00Z' }
          },
          error: null
        });
        mockCheckUserExists.mockResolvedValue({ exists: true, error: null });
        mockIsUserLimitReached.mockResolvedValue({ limitReached: true, error: null });

        render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

        await user.click(screen.getByText('Continue with Google'));

        await waitFor(() => {
          expect(mockSignOut).not.toHaveBeenCalled();
          expect(mockOnAuthSuccess).toHaveBeenCalled();
        });
      });

      it('should allow existing Firebase user without Firestore doc to login (migration)', async () => {
        const user = userEvent.setup();
        // Existing user: creationTime != lastSignInTime
        mockSignInWithGoogle.mockResolvedValue({
          user: {
            uid: '1',
            email: 'existing@example.com',
            displayName: 'Existing User',
            metadata: { creationTime: '2024-01-01T00:00:00Z', lastSignInTime: '2024-06-01T00:00:00Z' }
          },
          error: null
        });
        mockCheckUserExists.mockResolvedValue({ exists: false, error: null }); // No Firestore doc
        mockIsUserLimitReached.mockResolvedValue({ limitReached: true, error: null }); // Limit reached
        mockRegisterUser.mockResolvedValue({ error: null });

        render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

        await user.click(screen.getByText('Continue with Google'));

        await waitFor(() => {
          // Should NOT check limit for existing user
          expect(mockIsUserLimitReached).not.toHaveBeenCalled();
          // Should register with skipLimitCheck=true
          expect(mockRegisterUser).toHaveBeenCalledWith('1', 'existing@example.com', 'Existing User', true);
          expect(mockSignOut).not.toHaveBeenCalled();
          expect(mockOnAuthSuccess).toHaveBeenCalled();
        });
      });

      it('should continue login even if checkUserExists fails', async () => {
        const user = userEvent.setup();
        mockSignInWithGoogle.mockResolvedValue({
          user: {
            uid: '1',
            email: 'test@example.com',
            metadata: { creationTime: '2024-01-01T00:00:00Z', lastSignInTime: '2024-06-01T00:00:00Z' }
          },
          error: null
        });
        mockCheckUserExists.mockResolvedValue({ exists: false, error: 'Database error' });

        render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

        await user.click(screen.getByText('Continue with Google'));

        await waitFor(() => {
          // Should continue despite error - don't block login due to Firestore issues
          expect(mockSignOut).not.toHaveBeenCalled();
          expect(mockOnAuthSuccess).toHaveBeenCalled();
        });
      });

      it('should sign out and show error when registerUser fails for new Google user', async () => {
        const user = userEvent.setup();
        const creationTime = '2024-01-01T00:00:00Z';
        mockSignInWithGoogle.mockResolvedValue({
          user: {
            uid: '1',
            email: 'new@example.com',
            displayName: 'New User',
            metadata: { creationTime, lastSignInTime: creationTime }
          },
          error: null
        });
        mockCheckUserExists.mockResolvedValue({ exists: false, error: null });
        mockIsUserLimitReached.mockResolvedValue({ limitReached: false, error: null });
        mockRegisterUser.mockResolvedValue({ error: 'Registration failed' });

        render(<Auth />);

        await user.click(screen.getByText('Continue with Google'));

        await waitFor(() => {
          expect(mockSignOut).toHaveBeenCalled();
          expect(screen.getByText('Registration failed')).toBeInTheDocument();
        });
      });

      it('should sign out and show error when limit check fails for new Google user', async () => {
        const user = userEvent.setup();
        const creationTime = '2024-01-01T00:00:00Z';
        mockSignInWithGoogle.mockResolvedValue({
          user: {
            uid: '1',
            email: 'new@example.com',
            metadata: { creationTime, lastSignInTime: creationTime }
          },
          error: null
        });
        mockCheckUserExists.mockResolvedValue({ exists: false, error: null });
        mockIsUserLimitReached.mockResolvedValue({ limitReached: false, error: 'Network error' });

        render(<Auth />);

        await user.click(screen.getByText('Continue with Google'));

        await waitFor(() => {
          expect(mockSignOut).toHaveBeenCalled();
          expect(screen.getByText('Network error')).toBeInTheDocument();
        });
      });

      it('should not block existing user migration if registerUser fails', async () => {
        const user = userEvent.setup();
        // Existing user: creationTime != lastSignInTime
        mockSignInWithGoogle.mockResolvedValue({
          user: {
            uid: '1',
            email: 'existing@example.com',
            displayName: 'Existing User',
            metadata: { creationTime: '2024-01-01T00:00:00Z', lastSignInTime: '2024-06-01T00:00:00Z' }
          },
          error: null
        });
        mockCheckUserExists.mockResolvedValue({ exists: false, error: null });
        mockRegisterUser.mockResolvedValue({ error: 'Registration failed' });

        render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

        await user.click(screen.getByText('Continue with Google'));

        await waitFor(() => {
          // Should continue despite registration failure for existing users
          expect(mockSignOut).not.toHaveBeenCalled();
          expect(mockOnAuthSuccess).toHaveBeenCalled();
        });
      });
    });
  });
});
