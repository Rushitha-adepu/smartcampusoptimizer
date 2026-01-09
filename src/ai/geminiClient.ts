const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const isGeminiAvailable = Boolean(GEMINI_API_KEY);
