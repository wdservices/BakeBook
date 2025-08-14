// Simple configuration for Gemini API
export const geminiConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || '',
  modelName: 'gemini-pro',
  apiVersion: 'v1beta',
};
