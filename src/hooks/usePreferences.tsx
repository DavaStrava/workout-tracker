import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import type { UnitSystem, UserPreferences } from '../types';
import { auth } from '../config/firebase';
import {
  saveUserPreferences,
  subscribeToUserPreferences,
} from '../services/firestore';

const DEFAULT_PREFERENCES: UserPreferences = {
  unitSystem: 'metric',
};

const STORAGE_KEY = 'userPreferences';

interface PreferencesContextType {
  preferences: UserPreferences;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  isLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (!authUser) {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to Firestore preferences when user is authenticated
  useEffect(() => {
    if (!user) return;

    setIsLoading(true);

    const unsubscribe = subscribeToUserPreferences(
      user.uid,
      (firestorePrefs) => {
        if (firestorePrefs) {
          setPreferences(firestorePrefs);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(firestorePrefs));
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error subscribing to preferences:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Sync to localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const setUnitSystem = useCallback(async (system: UnitSystem) => {
    const newPrefs = { ...preferences, unitSystem: system };
    setPreferences(newPrefs);

    // Sync to Firestore if authenticated
    if (user) {
      const { error } = await saveUserPreferences(user.uid, newPrefs);
      if (error) {
        console.error('Error saving preferences to Firestore:', error);
      }
    }
  }, [preferences, user]);

  const value: PreferencesContextType = {
    preferences,
    unitSystem: preferences.unitSystem,
    setUnitSystem,
    isLoading,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
