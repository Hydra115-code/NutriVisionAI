/**
 * src/types/index.ts
 * Centralized TypeScript interfaces for NutriVision AI.
 * All data models used across services, hooks, and components are defined here.
 */

// ─── USER MODEL ───────────────────────────────────────────────────────────────

/**
 * Represents the authenticated user stored in UserContext and local SQLite.
 */
export interface Usuario {
    usuario_id: number;
    nombre: string;
    apellido?: string;
    correo: string;
    peso_kg?: number | null;
    altura_cm?: number | null;
    sexo?: string | null;
    fecha_nacimiento?: string | null;
    objetivo?: string | null;
    estado_inicial?: string | null;
    racha_inicial?: number;
    tiene_diabetes?: 'si' | 'no';
    tipo_diabetes?: string | null;
}

// ─── FOOD / ANALYSIS MODEL ────────────────────────────────────────────────────

/**
 * Represents a single food item returned by the Gemini AI analysis.
 */
export interface Alimento {
    id: number;
    nombre: string;
    calorias: number;
    proteinas_g: number;
    carbohidratos_g: number;
    grasas_g: number;
    azucar_g: number;
    alertaAzucar: boolean;
}

/**
 * Raw result returned by the backend analysis endpoint.
 * The `offline` flag is set locally when the network is unavailable.
 */
export interface AnalysisResult {
    ok: boolean;
    alimentos: Alimento[];
    offline?: boolean;
    mensaje?: string;
}

// ─── DAILY RECORD ─────────────────────────────────────────────────────────────

/**
 * A saved daily consumption record stored in SQLite and synced to MySQL.
 */
export interface DailyRecord {
    id?: number;
    usuario_id: number;
    nombre_alimento: string;
    calorias: number;
    proteinas_g: number;
    carbohidratos_g: number;
    grasas_g: number;
    azucar_g?: number;
    fecha: string; // ISO date string
    synced?: boolean; // true when the record has been sent to the remote backend
}

// ─── PROGRESS MODEL ───────────────────────────────────────────────────────────

/**
 * Aggregated nutritional totals for the current day.
 */
export interface DailyProgress {
    caloriasConsumidas: number;
    caloriasMeta: number;
    proteinas: number;
    proteinasMeta: number;
    carbos: number;
    carbosMeta: number;
    grasas: number;
    grasasMeta: number;
}

/**
 * A single day entry for the weekly bar chart.
 */
export interface WeeklyDay {
    dia: string;
    calorias: number;
}

/**
 * Personalized nutritional goals calculated from the user's biometric profile.
 */
export interface NutritionGoals {
    calorias: number;
    proteinas: number;
    carbos: number;
    grasas: number;
}

// ─── AUTH RESPONSES ───────────────────────────────────────────────────────────

export interface AuthResponse {
    ok: boolean;
    mensaje?: string;
    usuario?: Usuario;
}

export interface BackendResponse {
    ok: boolean;
    mensaje?: string;
    [key: string]: any;
}
