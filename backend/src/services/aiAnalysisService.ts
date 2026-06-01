/**
 * src/services/aiAnalysisService.ts
 * Orquesta el análisis de imágenes de comida utilizando la API de Gemini directamente desde el dispositivo.
 */

import { analyzeImageDirectly } from '../api/geminiClient';
import { insertarConsumoLocal } from '../database/localDb';
import { Alimento, AnalysisResult } from '../types';

//Función de análisis de imagen

/**
 * Envía una imagen de comida codificada en base64 directamente a la API de Gemini.
 * Al ser una arquitectura completamente local, se requiere conexión a internet para esta operación.
 *
 * @param imagenBase64 - La cadena raw en base64 de la fotografía capturada.
 * @returns Un objeto tipado AnalysisResult, siempre seguro para ser renderizado en la interfaz.
 */
export async function analyzeFood(imagenBase64: string): Promise<AnalysisResult> {
    try {
        const response = await analyzeImageDirectly(imagenBase64);

        if (response.ok && response.alimentos && response.alimentos.length > 0) {
            // Asignación de IDs secuenciales para facilitar el renderizado.
            const itemsWithIds: Alimento[] = response.alimentos.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            return { ok: true, alimentos: itemsWithIds, offline: false };
        }

        return {
            ok: false,
            alimentos: [],
            mensaje: response.mensaje || 'No se detectaron alimentos en la imagen.',
        };
    } catch (error) {
        return {
            ok: false,
            alimentos: [],
            mensaje: 'Ocurrió un error al contactar el servicio de inteligencia artificial.'
        };
    }
}

//Utilidad de guardado local

/**
 * Persiste una lista de alimentos detectados en la base de datos local SQLite.
 *
 * @param usuario_id - El ID del usuario actual.
 * @param alimentos  - Arreglo de alimentos proveniente del análisis de IA.
 */
export async function guardarEscaneoLocalmente(
    usuario_id: number,
    alimentos: Alimento[]
): Promise<void> {
    const fecha = new Date().toISOString();
    // Asigna un cero por defecto para requerir estrictamente un mapeo numérico y evitar nulos/indefinidos
    const records = alimentos.map((a) => ({
        usuario_id,
        nombre_alimento: a.nombre,
        calorias: a.calorias ?? 0,
        proteinas_g: a.proteinas_g ?? 0,
        carbohidratos_g: a.carbohidratos_g ?? 0,
        grasas_g: a.grasas_g ?? 0,
        azucar_g: a.azucar_g ?? 0,
        fecha,
    }));

    await insertarConsumoLocal(records);
}
