/**
 * src/api/geminiClient.ts
 * Cliente local directo para interactuar con la API de Google Gemini.
 * Utiliza la clave EXPO_PUBLIC_GEMINI_KEY leída de las variables de entorno.
 */

import { GEMINI_API_KEY } from '../constants/config';
import { AnalysisResult } from '../types';

/**
 * Envía una imagen a la API de Gemini con una instrucción de sistema estricta para devolver JSON.
 * @param base64 - Los datos de la imagen a analizar.
 */
export async function analyzeImageDirectly(base64: string): Promise<AnalysisResult> {
    if (!GEMINI_API_KEY) {
        return { ok: false, mensaje: 'La clave de API de Gemini no está configurada.', alimentos: [] };
    }

    //gemini-2.5-flash en v1 (versión estable, disponible en este proyecto)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `Analiza la imagen de comida y devuelve estrictamente un array JSON plano 
  (sin markdown, sin \`\`\`, solo los corchetes) donde cada elemento represente un alimento.
  Estructura por elemento:
  {
    "nombre": "string",
    "calorias": number,
    "proteinas_g": number,
    "carbohidratos_g": number,
    "grasas_g": number,
    "azucar_g": number,
    "alertaAzucar": boolean
  }
  Si no hay comida, devuelve [].`;

    try {
        // 1️⃣ Verificar que la clave llega
        console.log('[Gemini] API Key presente:', !!GEMINI_API_KEY);
        console.log('[Gemini] Enviando imagen, tamaño base64:', base64?.length);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    mimeType: 'image/jpeg',
                                    data: base64
                                }
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.1
                    // ❌ Elimina responseMimeType — puede causar errores con modelos multimodales
                }
            })
        });

        // 2️⃣ Ver qué HTTP status devuelve
        console.log('[Gemini] HTTP status:', response.status);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('[Gemini] Error body:', errorBody); // 👈 Aquí verás el mensaje real
            return { ok: false, mensaje: `Error API: ${response.status}`, alimentos: [] };
        }

        const data = await response.json();

        // 3️⃣ Ver la respuesta cruda antes de parsear
        const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log('[Gemini] Raw output:', textOutput);

        if (!textOutput) {
            console.warn('[Gemini] Respuesta vacía. Data completa:', JSON.stringify(data));
            return { ok: false, mensaje: 'Sin respuesta de la IA.', alimentos: [] };
        }

        // 4️⃣ Limpiar el texto antes de parsear (defensa contra markdown residual)
        const cleaned = textOutput
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim();

        let parsed: any;
        try {
            parsed = JSON.parse(cleaned);
        } catch (parseError) {
            console.error('[Gemini] JSON.parse falló. Texto recibido:', cleaned);
            return { ok: false, mensaje: 'La IA devolvió un formato inesperado.', alimentos: [] };
        }

        if (!Array.isArray(parsed)) parsed = [parsed];

        if (parsed.length === 0) {
            return { ok: false, mensaje: 'No se encontraron alimentos.', alimentos: [] };
        }

        return { ok: true, alimentos: parsed };

    } catch (error: any) {
        // 5️⃣ Capturar cualquier error de red u otro
        console.error('[Gemini] Error completo:', error?.message, error);
        return {
            ok: false,
            mensaje: `Error de conexión: ${error?.message ?? 'desconocido'}`,
            alimentos: []
        };
    }
}

/**
 * Sends a full body image to Gemini API to estimate weight and height.
 */
export async function estimateBodyStatsDirectly(base64: string): Promise<{ ok: boolean; mensaje?: string; peso_kg?: number; altura_cm?: number }> {
    if (!GEMINI_API_KEY) {
        return { ok: false, mensaje: 'La clave de API de Gemini no está configurada.' };
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `Analiza la imagen corporal y devuelve estrictamente JSON (sin markdown).
  Estima el peso y la altura.
  Estructura esperada:
  {
    "peso_kg": number,
    "altura_cm": number
  }`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: base64 } }] }],
                generationConfig: { temperature: 0.1 }
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('[Gemini BodyStats] Error body:', errorBody);
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textOutput) return { ok: false, mensaje: 'No se pudo obtener la respuesta de la IA.' };

        const cleaned = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return { ok: true, peso_kg: parsed.peso_kg, altura_cm: parsed.altura_cm };
    } catch (error: any) {
        console.error('[Gemini BodyStats] Error:', error);
        return { ok: false, mensaje: 'Error al contactar a la inteligencia artificial.' };
    }
}

/**
 * Sends a medical diagnosis image to Gemini API to extract patient data.
 */
export async function analyzeDiagnosisDirectly(base64: string): Promise<any> {
    if (!GEMINI_API_KEY) {
        return { ok: false, mensaje: 'La cla    ve de API de Gemini no está configurada.' };
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `Lee el siguiente diagnóstico o examen médico y extrae la información del paciente en JSON estricto (sin markdown).
    Campos posibles (si no aparece o no es seguro, usa null):
    - nombre: string
    - apellido: string
    - peso_kg: number
    - altura_cm: number
    - fecha_nacimiento: string (formato DD/MM/AAAA)
    - sexo: "Masculino" | "Femenino"
    - tiene_diabetes: "si" | "no"
    - tipo_diabetes: "Tipo 1" | "Tipo 2" | "Gestacional" | "Pre.Diabetes"
    - objetivo: (Mejorar alimentación, Control de glucosa, Bajar de peso, etc.)
    - estado_salud: breve descripción del estado (ej. "En tratamiento", "Estable")`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: base64 } }] }],
                generationConfig: { temperature: 0.1 }
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('[Gemini Diagnosis] Error body:', errorBody);
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textOutput) return { ok: false, mensaje: 'No se pudo leer el documento.' };

        const cleaned = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return { ok: true, ...parsed };
    } catch (error: any) {
        console.error('[Gemini Diagnosis] Error:', error);
        return { ok: false, mensaje: 'Error al procesar el diagnóstico.' };
    }
}
