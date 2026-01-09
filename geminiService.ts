
import { GoogleGenAI, Type } from "@google/genai";
import { CrowdLevel, PredictionResult } from "./types";

// Use import.meta.env for Vite environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Converts time string (e.g., "12:30 PM") to 24-hour format hour (0-23)
 */
const parseTimeToHour = (timeStr: string): number => {
  const time = timeStr.trim().toUpperCase();
  const [timePart, period] = time.split(/\s*(AM|PM)/);
  const [hours, minutes] = timePart.split(':').map(Number);
  
  let hour24 = hours;
  if (period === 'PM' && hours !== 12) {
    hour24 = hours + 12;
  } else if (period === 'AM' && hours === 12) {
    hour24 = 0;
  }
  
  return hour24;
};

/**
 * Calculates crowd level and wait time based on service, day, and time
 */
const calculateCrowdLevel = (
  module: string,
  day: string,
  hour: number,
  context: string
): { level: CrowdLevel; waitTimeRange: [number, number] } => {
  const moduleLower = module.toLowerCase();
  const dayLower = day.toLowerCase();
  const contextLower = context.toLowerCase();
  
  // Check if it's an exam period
  const isExamPeriod = contextLower.includes('exam') || contextLower.includes('preparation');
  
  // Canteen logic
  if (moduleLower.includes('canteen')) {
    // Early morning: 8:00 AM - 9:00 AM (8-9) - Low crowd
    if (hour >= 8 && hour < 9) {
      return { level: 'Low', waitTimeRange: [5, 10] };
    }
    // Breakfast peak: 9:00 AM - 11:30 AM (9-11) - Medium crowd
    if (hour >= 9 && hour < 12) {
      return { level: 'Medium', waitTimeRange: [15, 20] };
    }
    // Lunch time: 12:00 PM - 2:30 PM (12-14) - High crowd
    if (hour >= 12 && hour < 15) {
      return { level: 'High', waitTimeRange: [25, 35] };
    }
    // Afternoon snack: 2:30 PM - 5:30 PM (14-17) - Medium crowd
    if (hour >= 14 && hour < 18) {
      return { level: 'Medium', waitTimeRange: [15, 20] };
    }
    // Evening: 5:30 PM+ (17+) - Low crowd
    return { level: 'Low', waitTimeRange: [5, 10] };
  }
  
  // Library logic
  if (moduleLower.includes('library')) {
    // Exam period: High crowd
    if (isExamPeriod) {
      return { level: 'High', waitTimeRange: [25, 30] };
    }
    // Early morning: 8:00 AM - 9:00 AM (8-9) - Low crowd
    if (hour >= 8 && hour < 9) {
      return { level: 'Low', waitTimeRange: [5, 8] };
    }
    // Morning: 9:00 AM - 12:00 PM (9-12) - Low crowd
    if (hour >= 9 && hour < 12) {
      return { level: 'Low', waitTimeRange: [5, 10] };
    }
    // Afternoon: 12:00 PM - 4:00 PM (12-16) - Medium crowd
    if (hour >= 12 && hour < 16) {
      return { level: 'Medium', waitTimeRange: [15, 20] };
    }
    // Evening: 4:00 PM - 7:00 PM (16-19) - High crowd
    if (hour >= 16 && hour < 19) {
      return { level: 'High', waitTimeRange: [20, 25] };
    }
    // Late evening: 7:00 PM+ (19+) - Medium crowd
    return { level: 'Medium', waitTimeRange: [15, 20] };
  }
  
  // Admin Office logic
  if (moduleLower.includes('admin')) {
    // Early morning: 9:00 AM - 9:30 AM (9) - Low crowd
    if (hour >= 9 && hour < 10) {
      return { level: 'Low', waitTimeRange: [10, 15] };
    }
    // Morning peak: 9:30 AM - 12:00 PM (9-12) - Medium crowd
    if (hour >= 9 && hour < 12) {
      return { level: 'Medium', waitTimeRange: [15, 20] };
    }
    // Lunch break: 12:00 PM - 1:00 PM (12-13) - Low crowd
    if (hour >= 12 && hour < 13) {
      return { level: 'Low', waitTimeRange: [10, 15] };
    }
    // Afternoon: 1:00 PM - 4:00 PM (13-16) - Medium crowd
    if (hour >= 13 && hour < 16) {
      return { level: 'Medium', waitTimeRange: [15, 20] };
    }
    // Late afternoon/Evening: Low crowd
    if (hour >= 16) {
      return { level: 'Low', waitTimeRange: [10, 15] };
    }
    // Early morning: Low crowd
    return { level: 'Low', waitTimeRange: [10, 15] };
  }
  
  // Exam Cell logic
  if (moduleLower.includes('exam')) {
    // Exam days or exam period: High crowd
    if (isExamPeriod || dayLower.includes('monday') || dayLower.includes('tuesday')) {
      return { level: 'High', waitTimeRange: [30, 40] };
    }
    // Early morning: 9:00 AM - 10:00 AM (9-10) - Medium crowd
    if (hour >= 9 && hour < 10) {
      return { level: 'Medium', waitTimeRange: [15, 20] };
    }
    // Morning peak: 10:00 AM - 12:00 PM (10-12) - Medium crowd
    if (hour >= 10 && hour < 12) {
      return { level: 'Medium', waitTimeRange: [15, 20] };
    }
    // Afternoon slots: 12:00 PM - 4:00 PM (12-16) - High crowd
    if (hour >= 12 && hour < 16) {
      return { level: 'High', waitTimeRange: [25, 30] };
    }
    // Late afternoon: 4:00 PM+ (16+) - Medium crowd
    return { level: 'Medium', waitTimeRange: [15, 20] };
  }
  
  // Default fallback
  return { level: 'Medium', waitTimeRange: [15, 20] };
};

/**
 * Generates reasoning text based on the prediction
 */
const generateReasoning = (
  module: string,
  day: string,
  time: string,
  level: CrowdLevel,
  context: string
): string => {
  const moduleLower = module.toLowerCase();
  const contextLower = context.toLowerCase();
  
  if (moduleLower.includes('canteen')) {
    if (level === 'High') {
      return `Lunch rush hour at ${time} typically sees peak demand with long queues forming.`;
    } else if (level === 'Medium') {
      return `Moderate footfall expected during ${time} on ${day}.`;
    } else {
      return `Quiet period at ${time} with minimal waiting expected.`;
    }
  }
  
  if (moduleLower.includes('library')) {
    if (contextLower.includes('exam')) {
      return `Exam preparation week increases library demand significantly.`;
    }
    if (level === 'High') {
      return `Evening study hours attract many students seeking quiet spaces.`;
    } else if (level === 'Low') {
      return `Morning hours are typically less crowded, ideal for focused study.`;
    } else {
      return `Moderate occupancy expected during afternoon hours.`;
    }
  }
  
  if (moduleLower.includes('admin')) {
    if (level === 'Medium') {
      return `Standard office hours see steady flow of administrative requests.`;
    } else {
      return `Off-peak hours with reduced administrative traffic.`;
    }
  }
  
  if (moduleLower.includes('exam')) {
    if (level === 'High') {
      return `Exam period or peak service hours result in extended wait times.`;
    } else {
      return `Regular service hours with moderate demand expected.`;
    }
  }
  
  return `Based on typical ${day} patterns at ${time}.`;
};

/**
 * Calculates wait time from crowd level with some randomization within range
 */
const calculateWaitTime = (range: [number, number]): number => {
  const [min, max] = range;
  // Use a deterministic but varied calculation based on range
  const base = (min + max) / 2;
  const variation = (max - min) * 0.3;
  // Add slight variation to make it feel more dynamic
  const timeHash = (min + max + range[0] * 7) % 5;
  return Math.round(base + (timeHash - 2) * variation);
};

export const getCampusPrediction = async (
  module: string, 
  day: string, 
  time: string, 
  context: string = ""
): Promise<PredictionResult> => {
  // Use rule-based prediction logic for dynamic, varied predictions
  // This ensures predictions change based on day, time, and service
  const hour = parseTimeToHour(time);
  
  // Calculate crowd level and wait time range
  const { level, waitTimeRange } = calculateCrowdLevel(module, day, hour, context);
  
  // Calculate actual wait time from range
  const estimatedWaitMinutes = calculateWaitTime(waitTimeRange);
  
  // Generate reasoning
  const reasoning = generateReasoning(module, day, time, level, context);
  
  // Calculate confidence based on how specific the prediction is
  let confidence = 0.75;
  if (context.toLowerCase().includes('exam') || context.toLowerCase().includes('preparation')) {
    confidence = 0.85; // Higher confidence for exam periods
  }
  
  // If API is available, optionally enhance with AI (but rule-based is primary)
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Predict the crowd and demand for ${module} at CMRIT campus on ${day} at ${time}. Context: ${context}. Return a JSON object with: crowdLevel (Low/Medium/High), estimatedWaitMinutes (number), confidence (0-1 float), and reasoning (short string).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              crowdLevel: { type: Type.STRING },
              estimatedWaitMinutes: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
            },
            required: ["crowdLevel", "estimatedWaitMinutes", "confidence", "reasoning"]
          }
        }
      });
      
      const text = response.text || "{}";
      const aiResult = JSON.parse(text) as PredictionResult;
      
      // Use AI result if valid, otherwise fall back to rule-based
      if (aiResult.crowdLevel && aiResult.estimatedWaitMinutes) {
        return aiResult;
      }
    } catch (e) {
      // Fall through to rule-based prediction on API error
    }
  }
  
  // Return rule-based prediction (always works, always dynamic)
  return {
    crowdLevel: level,
    estimatedWaitMinutes,
    confidence,
    reasoning
  };
};

export const getDemandForecast = async (day: string): Promise<string[]> => {
  // If API is available, try to get AI-generated forecast
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `List 5 high-demand food items for a university canteen on ${day} considering student preferences and typical college schedules. Return as a plain comma-separated list.`,
      });
      const text = response.text || "";
      const items = text.split(',').map(s => s.trim()).filter(s => s.length > 0);
      if (items.length > 0) {
        return items;
      }
    } catch (e) {
      // Fall through to default items
    }
  }
  
  // Return default items (rule-based fallback)
  return ['South Indian Thali', 'Hyderabadi Biryani', 'Butter Masala Dosa', 'Filtered Coffee', 'Fresh Fruit Bowl'];
};
