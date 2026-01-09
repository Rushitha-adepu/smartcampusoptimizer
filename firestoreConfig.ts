
/**
 * Firebase Firestore Configuration
 * 
 * This file configures Firebase Firestore for storing prediction history
 * and service usage data. Uses environment variables for configuration.
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Initialize Firebase app (only if config is available)
let app: FirebaseApp | null = null;
let db: Firestore | null = null;

/**
 * Initialize Firebase and Firestore
 * Returns null if configuration is incomplete (safe for demo)
 */
export const initializeFirestore = (): Firestore | null => {
  // Check if Firebase is already initialized
  if (db) {
    return db;
  }

  // Check if required config is available
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('Firebase configuration incomplete. Firestore features disabled.');
    return null;
  }

  try {
    // Initialize Firebase app
    app = initializeApp(firebaseConfig);
    
    // Initialize Firestore
    db = getFirestore(app);
    
    return db;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return null;
  }
};

/**
 * Get Firestore instance
 * Returns null if not initialized or config is missing
 */
export const getFirestoreInstance = (): Firestore | null => {
  if (!db) {
    return initializeFirestore();
  }
  return db;
};
