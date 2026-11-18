import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);

  // Check if real Firebase keys are loaded
  useEffect(() => {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (apiKey && apiKey !== 'YOUR_API_KEY' && apiKey.length > 10) {
      setIsFirebaseConfigured(true);
    }
  }, []);

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

    // If Firebase is initialized with real credentials, bind listener
    if (auth && auth.name && import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY') {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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

            // Sync to Firestore if available
            try {
              if (db) {
                const userRef = doc(db, 'users', firebaseUser.uid);
                await setDoc(userRef, { ...profile, serverUpdated: serverTimestamp() }, { merge: true });
              }
            } catch (fsErr) {
              console.warn('Firestore sync note:', fsErr.message);
            }

            setUser(profile);
            setUserProfile(profile);
            localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(profile));
          }
        } catch (err) {
          console.error('Auth state error:', err);
        } finally {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    } else {
      // In preview / local mode
      setLoading(false);
    }
  }, []);

  // Google Sign-In with popup
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
        setUser(profile);
        setUserProfile(profile);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(profile));
        return profile;
      } else {
        // Fallback for immediate preview before user pastes production API keys:
        throw new Error('FIREBASE_CONFIG_REQUIRED');
      }
    } catch (err) {
      console.warn('Google sign-in status:', err.message);
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Instant Launch / Preview Login (allows testing both Admin and Regular user immediately)
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
    return mockUser;
  };

  // Sign out
  const logout = async () => {
    try {
      if (auth && isFirebaseConfigured) {
        await firebaseSignOut(auth);
      }
    } catch (e) {
      console.warn('Sign out cleanup:', e);
    } finally {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  };

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authError,
        isAdmin,
        isFirebaseConfigured,
        signInWithGoogle,
        loginAsPreviewUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
