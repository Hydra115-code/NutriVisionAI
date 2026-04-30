/**
 * src/api/backendClient.ts
 * Cliente HTTP para toda la comunicación con el backend de NutriVision Express.
 * Lee la URL base de la API de la variable de entorno EXPO_PUBLIC_API_URL.
 * Todas las funciones incluyen try/catch y devuelven respuestas tipadas.
 */

import Constants from 'expo-constants';
import { Alimento, AuthResponse, BackendResponse, NutritionGoals, WeeklyDay } from '../types';

// Lee la URL de la API de las variables de entorno de Expo.
// Retrocede a la IP de desarrollo si la variable de entorno no está configurada.
const API_URL: string =
    (Constants.expoConfig?.extra?.apiUrl as string) ||
    process.env.EXPO_PUBLIC_API_URL ||
    'http://[IP_ADDRESS]';

// Default request timeout in milliseconds.
const TIMEOUT_MS = 10000;

/**
 * Realiza una solicitud fetch con un tiempo de espera configurable. Lanza un error si el tiempo de espera expira.
 */
async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        return response;
    } finally {
        clearTimeout(timer);
    }
}

// ─── AUTH ENDPOINTS ───────────────────────────────────────────────────────────

/**
 * Envia las credenciales de inicio de sesión al backend.
 *
 * @param correo    - Dirección de correo electrónico del usuario.
 * @param password  - Contraseña en texto plano (hasheada en el servidor).
 */
export async function login(correo: string, password: string): Promise<AuthResponse> {
    try {
        const res = await fetchWithTimeout(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: correo.trim().toLowerCase(), password }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('backendClient.login error:', error.message);
        return { ok: false, mensaje: 'No se pudo conectar al servidor.' };
    }
}

/**
 * Registra un nuevo usuario con datos biométricos y personales.
 */
export async function register(payload: Record<string, any>): Promise<AuthResponse> {
    try {
        const res = await fetchWithTimeout(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return await res.json();
    } catch (error: any) {
        console.error('backendClient.register error:', error.message);
        return { ok: false, mensaje: 'No se pudo conectar al servidor.' };
    }
}

// ─── IMAGE ANALYSIS ───────────────────────────────────────────────────────────

/**
 * Envía una imagen codificada en base64 al backend para análisis con IA de Gemini.
 *
 * @param imagenBase64 - Cadena Base64 de la foto de la comida.
 * @returns Objeto con la bandera `ok` y un array `alimentos` en caso de éxito.
 */
export async function analizarImagen(imagenBase64: string): Promise<{
    ok: boolean;
    alimentos?: Alimento[];
    mensaje?: string;
}> {
    try {
        const res = await fetchWithTimeout(`${API_URL}/api/auth/analizar-imagen`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imagenBase64 }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('backendClient.analizarImagen error:', error.message);
        return { ok: false, mensaje: 'Error de red al analizar la imagen.' };
    }
}

// ─── CONSUMPTION RECORDS ──────────────────────────────────────────────────────

/**
 * Guarda una lista de alimentos consumidos por el usuario en la base de datos MySQL remota.
 *
 * @param usuario_id - ID del usuario autenticado.
 * @param alimentos  - Array de alimentos detectados por el análisis de IA.
 */
export async function guardarConsumo(
    usuario_id: number,
    alimentos: Alimento[]
): Promise<BackendResponse> {
    try {
        const res = await fetchWithTimeout(`${API_URL}/api/auth/guardar-consumo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id, alimentos }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('backendClient.guardarConsumo error:', error.message);
        return { ok: false, mensaje: 'Error de red al guardar el consumo.' };
    }
}

// ─── PROGRESS ENDPOINTS ───────────────────────────────────────────────────────

/**
 * Obtiene los totales nutricionales agregados consumidos por el usuario hoy.
 */
export async function progresoHoy(usuario_id: number): Promise<BackendResponse> {
    try {
        const res = await fetchWithTimeout(
            `${API_URL}/api/auth/progreso-hoy/${usuario_id}`,
            { method: 'GET' }
        );
        return await res.json();
    } catch (error: any) {
        console.error('backendClient.progresoHoy error:', error.message);
        return { ok: false, mensaje: 'Error de red al obtener progreso.' };
    }
}

/**
 * Obtiene el resumen calórico de 7 días para el gráfico semanal.
 */
export async function progresoSemanal(usuario_id: number): Promise<{
    ok: boolean;
    semana?: WeeklyDay[];
    mensaje?: string;
}> {
    try {
        const res = await fetchWithTimeout(
            `${API_URL}/api/auth/progreso-semanal/${usuario_id}`,
            { method: 'GET' }
        );
        return await res.json();
    } catch (error: any) {
        console.error('backendClient.progresoSemanal error:', error.message);
        return { ok: false, mensaje: 'Error de red al obtener progreso semanal.' };
    }
}

/**
 * Obtiene las metas nutricionales personalizadas calculadas a partir de los datos biométricos del usuario.
 */
export async function obtenerMetas(usuario_id: number): Promise<{
    ok: boolean;
    metas?: NutritionGoals;
    mensaje?: string;
}> {
    try {
        const res = await fetchWithTimeout(
            `${API_URL}/api/auth/metas/${usuario_id}`,
            { method: 'GET' }
        );
        return await res.json();
    } catch (error: any) {
        console.error('backendClient.obtenerMetas error:', error.message);
        return { ok: false, mensaje: 'Error de red al obtener metas.' };
    }
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────

/**
 * Actualiza la información del perfil biométrico y personal del usuario.
 */
export async function actualizarPerfil(
    usuario_id: number,
    datos: Record<string, any>
): Promise<BackendResponse> {
    try {
        const res = await fetchWithTimeout(
            `${API_URL}/api/auth/actualizar-perfil/${usuario_id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
            }
        );
        return await res.json();
    } catch (error: any) {
        console.error('backendClient.actualizarPerfil error:', error.message);
        return { ok: false, mensaje: 'Error de red al actualizar perfil.' };
    }
}

/**
 * Envia una foto corporal para la estimación de peso y altura basada en IA.
 */
export async function escaneoCorporal(imagenBase64: string): Promise<BackendResponse> {
    try {
        const res = await fetchWithTimeout(`${API_URL}/api/auth/escaneo-corporal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imagenBase64 }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('backendClient.escaneoCorporal error:', error.message);
        return { ok: false, mensaje: 'Error de red en el escaneo corporal.' };
    }
}

/**
 * Envia una imagen de documento médico para la extracción de diagnósticos basada en IA.
 */
export async function analizarDiagnostico(imagenBase64: string): Promise<BackendResponse> {
    try {
        const res = await fetchWithTimeout(`${API_URL}/api/auth/analizar-diagnostico`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imagenBase64 }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('backendClient.analizarDiagnostico error:', error.message);
        return { ok: false, mensaje: 'Error de red al analizar el diagnóstico.' };
    }
}
