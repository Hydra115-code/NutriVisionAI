/**
 * src/services/pdfService.ts
 * Servicio de generación y compartición de PDF para NutriVision AI.
 * Utiliza expo-print para renderizar una plantilla HTML y expo-sharing para compartir el archivo.
 * Todos los errores son capturados y devueltos como un objeto de resultado, nunca se lanzan a la UI.
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alimento, Usuario } from '../types';
import { buildPdfHtml } from '../utils/pdfTemplate';

export interface PdfResult {
    ok: boolean;
    mensaje?: string;
}

/**
 * Genera un reporte nutricional profesional como PDF y abre la ventana nativa
 * de compartir para que el usuario pueda guardarlo, enviarlo por correo o imprimirlo.
 *
 * @param usuario   - El usuario autenticado (nombre y datos biométricos).
 * @param alimentos - La lista de alimentos detectados en el escaneo actual.
 * @returns PdfResult indicando éxito o fracaso con un mensaje legible.
 */
export async function exportarPdf(usuario: Usuario, alimentos: Alimento[]): Promise<PdfResult> {
    if (!alimentos || alimentos.length === 0) {
        return { ok: false, mensaje: 'No hay alimentos para incluir en el reporte.' };
    }

    try {
        // 1. Build the HTML document from the template.
        const html = buildPdfHtml(usuario, alimentos);

        // 2. Render the HTML to a temporary PDF file.
        const { uri } = await Print.printToFileAsync({ html, base64: false });

        // 3. Check if the sharing API is available on this platform.
        const disponible = await Sharing.isAvailableAsync();
        if (!disponible) {
            return {
                ok: false,
                mensaje: 'El sistema de compartir no esta disponible en este dispositivo.',
            };
        }

        // 4. Abre la ventana nativa de compartir con el PDF generado.
        await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Compartir reporte nutricional',
            UTI: 'com.adobe.pdf', // Requerido para iOS.
        });

        return { ok: true };
    } catch (error: any) {
        console.error('pdfService.exportarPdf error:', error.message);
        return {
            ok: false,
            mensaje: 'Ocurrio un error al generar el PDF. Intenta de nuevo.',
        };
    }
}
