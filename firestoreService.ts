
/**
 * Firestore Service
 * 
 * Provides functions to save prediction history and service usage data to Firestore.
 * All operations are safe for demo - they fail gracefully if Firestore is not configured.
 */

import { 
  collection, 
  addDoc, 
  Timestamp,
  Firestore 
} from 'firebase/firestore';
import { getFirestoreInstance } from './firestoreConfig';
import { PredictionResult } from './types';

/**
 * Interface for prediction history document
 */
export interface PredictionHistory {
  service: string;
  day: string;
  time: string;
  crowdLevel: string;
  estimatedWaitMinutes: number;
  confidence: number;
  reasoning: string;
  timestamp: Timestamp;
  context?: string;
}

/**
 * Interface for service usage document
 */
export interface ServiceUsage {
  service: string;
  day: string;
  time: string;
  crowdLevel: string;
  waitTime: number;
  timestamp: Timestamp;
}

/**
 * Save prediction history to Firestore
 * Fails silently if Firestore is not configured (safe for demo)
 * 
 * @param service - Service name (e.g., 'Canteen', 'Library')
 * @param day - Selected day
 * @param time - Selected time
 * @param prediction - Prediction result
 * @param context - Optional context string
 */
export const savePredictionHistory = async (
  service: string,
  day: string,
  time: string,
  prediction: PredictionResult,
  context?: string
): Promise<void> => {
  const db = getFirestoreInstance();
  
  // Silently return if Firestore is not configured
  if (!db) {
    return;
  }

  try {
    const historyData: PredictionHistory = {
      service,
      day,
      time,
      crowdLevel: prediction.crowdLevel,
      estimatedWaitMinutes: prediction.estimatedWaitMinutes,
      confidence: prediction.confidence,
      reasoning: prediction.reasoning,
      timestamp: Timestamp.now(),
      ...(context && { context }),
    };

    // Save to 'predictionHistory' collection
    await addDoc(collection(db, 'predictionHistory'), historyData);
  } catch (error) {
    // Log error but don't throw (safe for demo)
    console.error('Error saving prediction history to Firestore:', error);
  }
};

/**
 * Save service usage data to Firestore
 * Fails silently if Firestore is not configured (safe for demo)
 * 
 * @param service - Service name
 * @param day - Selected day
 * @param time - Selected time
 * @param crowdLevel - Predicted crowd level
 * @param waitTime - Estimated wait time in minutes
 */
export const saveServiceUsage = async (
  service: string,
  day: string,
  time: string,
  crowdLevel: string,
  waitTime: number
): Promise<void> => {
  const db = getFirestoreInstance();
  
  // Silently return if Firestore is not configured
  if (!db) {
    return;
  }

  try {
    const usageData: ServiceUsage = {
      service,
      day,
      time,
      crowdLevel,
      waitTime,
      timestamp: Timestamp.now(),
    };

    // Save to 'serviceUsage' collection
    await addDoc(collection(db, 'serviceUsage'), usageData);
  } catch (error) {
    // Log error but don't throw (safe for demo)
    console.error('Error saving service usage to Firestore:', error);
  }
};
