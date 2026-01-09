
export type CrowdLevel = 'Low' | 'Medium' | 'High';

export interface PredictionResult {
  crowdLevel: CrowdLevel;
  estimatedWaitMinutes: number;
  confidence: number;
  reasoning: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  demandFactor: number;
  imageUrl: string;
}

export interface LibrarySeat {
  id: string;
  section: string;
  floor: number;
  isOccupied: boolean;
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  branch: string;
  score: number;
}

export interface PredictionContext {
  module: string;
  day: string;
  time: string;
  extraInfo?: string;
}
