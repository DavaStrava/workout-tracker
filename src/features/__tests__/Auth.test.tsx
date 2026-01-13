import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Auth } from '../Auth';

// Mock auth functions
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockSignInWithGoogle = vi.fn();

vi.mock('../../services/auth', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signUp: (...args: unknown[]) => mockSignUp(...args),
  signInWithGoogle: () => mockSignInWithGoogle(),
}));

describe('Auth', () => {
  const mockOnAuthSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSignIn.mockResolvedValue({ user: null, error: null });
    mockSignUp.mockResolvedValue({ user: null, error: null });
    mockSignInWithGoogle.mockResolvedValue({ user: null, error: null });
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
      mockSignUp.mockResolvedValue({ user: { id: '1' }, error: null });

      render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

      await user.click(screen.getByText('Sign up'));
      await user.type(screen.getByPlaceholderText('Enter your name'), 'John Doe');
      await user.type(screen.getByPlaceholderText('your@email.com'), 'john@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      await waitFor(() => {
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

    it('should call onAuthSuccess when Google sign-in succeeds', async () => {
      const user = userEvent.setup();
      mockSignInWithGoogle.mockResolvedValue({ user: { id: '1' }, error: null });

      render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

      await user.click(screen.getByText('Continue with Google'));

      await waitFor(() => {
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
    it('should show loading state on submit button during login', async () => {
      const user = userEvent.setup();
      // Make the sign in take time
      mockSignIn.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ user: { id: '1' }, error: null }), 100)));

      render(<Auth />);

      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      // Button should be in loading state (disabled or show loading indicator)
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      expect(submitButton).toBeDisabled();
    });

    it('should show loading state on Google button during sign-in', async () => {
      const user = userEvent.setup();
      mockSignInWithGoogle.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ user: { id: '1' }, error: null }), 100)));

      render(<Auth />);

      await user.click(screen.getByText('Continue with Google'));

      // Google button should be in loading state
      const googleButton = screen.getByText('Continue with Google').closest('button');
      expect(googleButton).toBeDisabled();
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
});
