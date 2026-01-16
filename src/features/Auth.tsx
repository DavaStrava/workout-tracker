import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { signIn, signUp, signInWithGoogle, signOut } from '../services/auth';
import { isUserLimitReached, registerUser, checkUserExists } from '../services/firestore';

interface AuthProps {
  onAuthSuccess?: () => void;
}

export const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationClosed, setRegistrationClosed] = useState(false);

  // Check user limit when switching to signup mode
  useEffect(() => {
    if (mode === 'signup') {
      isUserLimitReached().then(({ limitReached }) => {
        setRegistrationClosed(limitReached);
      });
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Check user limit before creating account
        const { limitReached, error: limitError } = await isUserLimitReached();
        if (limitError) {
          setError(limitError);
          return;
        }
        if (limitReached) {
          setRegistrationClosed(true);
          setError('Registration is currently closed. Maximum number of users reached.');
          return;
        }

        const { user, error } = await signUp(email, password, displayName);
        if (error) {
          setError(error);
        } else if (user) {
          // Register user in Firestore
          const { error: registerError } = await registerUser(user.uid, email, displayName);
          if (registerError) {
            // User was created in Firebase Auth but failed to register in Firestore
            // Sign them out to prevent access without registration
            await signOut();
            setError(registerError);
            return;
          }
          onAuthSuccess?.();
        }
      } else {
        const { user, error } = await signIn(email, password);
        if (error) {
          setError(error);
        } else if (user) {
          onAuthSuccess?.();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const { user, error } = await signInWithGoogle();
      if (error) {
        setError(error);
        return;
      }

      if (user) {
        // Check if this user already exists in Firestore
        const { exists, error: existsError } = await checkUserExists(user.uid);

        if (!exists && !existsError) {
          // User doesn't exist in Firestore - could be new or existing Firebase Auth user
          // Check if this is their first sign-in by looking at metadata
          // If metadata is missing, assume existing user (safer default - don't block)
          const creationTime = user.metadata?.creationTime;
          const lastSignInTime = user.metadata?.lastSignInTime;
          const isNewUser = creationTime && lastSignInTime && creationTime === lastSignInTime;

          if (isNewUser) {
            // Truly new user - enforce limit
            const { limitReached, error: limitError } = await isUserLimitReached();
            if (limitError) {
              await signOut();
              setError(limitError);
              return;
            }
            if (limitReached) {
              await signOut();
              setRegistrationClosed(true);
              setError('Registration is currently closed. Maximum number of users reached.');
              return;
            }
          }

          // Register the user in Firestore (new or migrating existing user)
          // Skip limit check for existing users being migrated
          const { error: registerError } = await registerUser(
            user.uid,
            user.email || '',
            user.displayName || undefined,
            !isNewUser // skipLimitCheck for existing users
          );
          if (registerError) {
            // For existing users, don't block login if registration fails
            // Just log the error and continue
            if (!isNewUser) {
              console.warn('Failed to migrate existing user to Firestore:', registerError);
            } else {
              await signOut();
              setError(registerError);
              return;
            }
          }
        }
        // Note: If existsError occurred, we continue anyway - don't block login due to Firestore issues

        onAuthSuccess?.();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'linear-gradient(135deg, #1a1625 0%, #1e1b4b 100%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '40px',
            fontWeight: 900,
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Workout Tracker
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>
            {mode === 'login' ? 'Welcome back!' : (registrationClosed ? 'Registration closed' : 'Start your fitness journey')}
          </p>
        </div>

        {mode === 'signup' && registrationClosed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '16px',
              marginBottom: '16px',
              borderRadius: '12px',
              background: 'rgba(251, 146, 60, 0.1)',
              border: '1px solid rgba(251, 146, 60, 0.3)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '14px', color: '#fb923c', fontWeight: 500 }}>
              Registration is currently closed
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
              Maximum number of users reached. Please try again later.
            </p>
          </motion.div>
        )}

        <div style={{
          padding: '32px',
          borderRadius: '24px',
          background: 'rgba(30, 27, 50, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="displayName"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    label="Display Name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    required={mode === 'signup'}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <p style={{ fontSize: '14px', color: '#ef4444' }}>{error}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              isLoading={isLoading}
              disabled={mode === 'signup' && registrationClosed}
              style={{ width: '100%' }}
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div style={{ position: 'relative', margin: '28px 0' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <span style={{ padding: '0 16px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', background: 'rgba(30, 27, 50, 0.9)' }}>or</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="glass"
            size="lg"
            isLoading={isLoading}
            style={{ width: '100%' }}
          >
            <svg style={{ width: '20px', height: '20px', marginRight: '10px' }} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={toggleMode}
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <span style={{ color: '#f472b6', fontWeight: 600 }}>Sign up</span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span style={{ color: '#f472b6', fontWeight: 600 }}>Sign in</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
