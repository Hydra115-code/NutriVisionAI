/**
 * constants/config.ts
 * Constantes globales para NutriVision AI.
 */

// La API Key de Gemini se lee del archivo .env.
export const GEMINI_API_KEY = (process.env.EXPO_PUBLIC_GEMINI_API_KEY || '').trim();

if (!GEMINI_API_KEY) {
    console.warn('EXPO_PUBLIC_GEMINI_API_KEY is missing from .env file!');
}
