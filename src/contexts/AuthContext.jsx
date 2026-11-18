import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { ADMIN_EMAIL, STORAGE_KEYS } from '../config/constants';

const AuthContext = createContext(null);

// Synchronously detect if valid Firebase credentials are provided
const hasValidFirebaseConfig = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY' &&
  import.meta.env.VITE_FIREBASE_API_KEY.length > 10
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const isFirebaseConfigured = hasValidFirebaseConfig;

  // Determine role based on strict email check
  const getRole = (email) =>
    email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';

  // Initialize Auth state (supports real Firebase + local preview mode)
  useEffect(() => {
    // Check local storage for existing session first
    const savedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setUserProfile(parsed);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }

    // Safety timeout: Never leave the app stuck in loading state longer than 2.5 seconds
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    // If Firebase is initialized with real credentials, bind listener
    if (auth && isFirebaseConfigured) {
      let unsubscribe;
      try {
        unsubscribe = onAuthStateChanged(
          auth,
          async (firebaseUser) => {
            clearTimeout(safetyTimer);
            try {
              if (firebaseUser) {
                const role = getRole(firebaseUser.email);
                const profile = {
                  uid: firebaseUser.uid,
                  displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
                  email: firebaseUser.email,
                  photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.email}`,
                  role,
                  lastLogin: new Date().toISOString()
                };

                // Sync to Firestore in background without blocking state
                if (db) {
                  try {
                    const userRef = doc(db, 'users', firebaseUser.uid);
                    setDoc(userRef, { ...profile, serverUpdated: serverTimestamp() }, { merge: true })
                      .catch((e) => console.warn('Firestore user profile sync warning:', e.message));
                  } catch (e) {
                    console.warn('Firestore sync skipped:', e.message);
                  }
                }

                setUser(profile);
                setUserProfile(profile);
                localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(profile));
              }
            } catch (err) {
              console.error('Auth state processing error:', err);
            } finally {
              setLoading(false);
            }
          },
          (err) => {
            console.warn('onAuthStateChanged error:', err);
            clearTimeout(safetyTimer);
            setLoading(false);
          }
        );
      } catch (err) {
        console.warn('Failed to bind onAuthStateChanged:', err);
        clearTimeout(safetyTimer);
        setLoading(false);
      }

      return () => {
        clearTimeout(safetyTimer);
        if (unsubscribe) unsubscribe();
      };
    } else {
      // In preview / local mode
      clearTimeout(safetyTimer);
      setLoading(false);
    }
  }, [isFirebaseConfigured]);

  // Google Sign-In with popup (and clear error handling)
  const signInWithGoogle = async () => {
    setAuthError(null);
    setLoading(true);

    try {
      if (isFirebaseConfigured && auth) {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const role = getRole(fbUser.email);
        const profile = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0],
          email: fbUser.email,
          photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.email}`,
          role,
          lastLogin: new Date().toISOString()
        };

        // Background sync to Firestore
        if (db) {
          try {
            const userRef = doc(db, 'users', fbUser.uid);
            setDoc(userRef, { ...profile, serverUpdated: serverTimestamp() }, { merge: true })
              .catch((e) => console.warn('Firestore profile sync note:', e.message));
          } catch (e) { }
        }

        setUser(profile);
        setUserProfile(profile);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(profile));
        return profile;
      } else {
        throw new Error('FIREBASE_CONFIG_REQUIRED');
      }
    } catch (err) {
      console.warn('Google sign-in error:', err.code, err.message);
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Instant Launch / Preview Login
  const loginAsPreviewUser = (email = ADMIN_EMAIL, displayName = 'Master Architect') => {
    const role = getRole(email);
    const mockUser = {
      uid: `user_${btoa(email).replace(/=/g, '')}`,
      email,
      displayName: role === 'admin' ? 'Master Architect' : displayName,
      photoURL: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
      role,
      lastLogin: new Date().toISOString(),
      isDemo: true
    };

    setUser(mockUser);
    setUserProfile(mockUser);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(mockUser));
    setLoading(false);
    return mockUser;
  };

  // Sign out
  const signOut = async () => {
    try {
      if (auth && isFirebaseConfigured) {
        await firebaseSignOut(auth);
      }
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  };

  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    userProfile,
    loading,
    authError,
    isFirebaseConfigured,
    isAdmin,
    signInWithGoogle,
    loginAsPreviewUser,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
