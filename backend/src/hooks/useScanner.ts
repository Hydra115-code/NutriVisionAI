/**
 * src/hooks/useScanner.ts
 * Hook personalizado que encapsula el flujo completo de escaneo de alimentos:
 * captura de imagen -> análisis de IA directo en dispositivo -> guardado en SQLite local.
 * Los componentes de interfaz solo llaman a los manejadores (handlers) retornados.
 */

import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { analyzeFood, guardarEscaneoLocalmente } from '../services/aiAnalysisService';
import { Alimento } from '../types';

export interface UseScannerReturn {
    /** Lista de alimentos detectados en la sesión actual. */
    alimentosDetectados: Alimento[];
    /** URI de la última imagen capturada (para previsualización). */
    imagenUri: string | null;
    /** Verdadero mientras la solicitud de análisis de IA esté en progreso. */
    analizando: boolean;
    /** Verdadero mientras la solicitud de guardado en SQLite esté en progreso. */
    guardando: boolean;
    /** Abre la cámara y analiza la fotografía capturada. */
    handleScan: () => Promise<void>;
    /** Abre la galería multimedia y analiza la fotografía seleccionada. */
    handleGaleria: () => Promise<void>;
    /** Guarda los alimentos detectados en la base de datos local SQLite. */
    handleGuardar: (usuario_id: number) => Promise<void>;
    /** Limpia la sesión actual de escaneo. */
    resetScan: () => void;
}

/**
 * Hook para manejar el ciclo de vida del escaneo de alimentos.
 * Pasa los manejadores retornados directamente a las propiedades onPress de la UI.
 */
export function useScanner(): UseScannerReturn {
    const [alimentosDetectados, setAlimentosDetectados] = useState<Alimento[]>([]);
    const [imagenUri, setImagenUri] = useState<string | null>(null);
    const [analizando, setAnalizando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // ─── INTERNO: Procesar imagen capturada ──────────────────────────────────

    const procesarImagen = useCallback(
        async (base64: string, uri: string) => {
            setImagenUri(uri);
            setAnalizando(true);
            try {
                const resultado = await analyzeFood(base64);

                if (resultado.ok && resultado.alimentos.length > 0) {
                    setAlimentosDetectados((prev) => {
                        // Re-asignar IDs para mantener una lista incremental.
                        const offset = prev.length;
                        return [
                            ...prev,
                            ...resultado.alimentos.map((a, i) => ({ ...a, id: offset + i + 1 })),
                        ];
                    });
                } else {
                    Alert.alert(
                        'Atención',
                        resultado.mensaje || 'No se detectaron alimentos. Intenta con otra imagen.'
                    );
                }
            } catch {
                Alert.alert('Error', 'Ocurrio un error inesperado al analizar la imagen.');
            } finally {
                setAnalizando(false);
            }
        },
        []
    );

    // ─── MANEJADOR DE CÁMARA ───────────────────────────────────────────────────────

    const handleScan = useCallback(async () => {
        const permiso = await ImagePicker.requestCameraPermissionsAsync();
        if (!permiso.granted) {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a tu camara.');
            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
        if (resultado.canceled || !resultado.assets[0].base64) return;

        const asset = resultado.assets[0];
        await procesarImagen(asset.base64!, asset.uri);
    }, [procesarImagen]);

    // ─── MANEJADOR DE GALERÍA ──────────────────────────────────────────────────────

    const handleGaleria = useCallback(async () => {
        const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permiso.granted) {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galeria.');
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            quality: 0.7,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (resultado.canceled || !resultado.assets[0].base64) return;

        const asset = resultado.assets[0];
        await procesarImagen(asset.base64!, asset.uri);
    }, [procesarImagen]);

    // ─── MANEJADOR DE GUARDADO ─────────────────────────────────────────────────────────

    const handleGuardar = useCallback(
        async (usuario_id: number) => {
            if (alimentosDetectados.length === 0) {
                Alert.alert('Sin datos', 'Primero escanea un alimento.');
                return;
            }

            setGuardando(true);
            try {
                await guardarEscaneoLocalmente(usuario_id, alimentosDetectados);
                Alert.alert('Guardado', 'Tu registro fue guardado correctamente en este dispositivo.');
                setAlimentosDetectados([]);
                setImagenUri(null);
            } catch (e) {
                console.error(e);
                Alert.alert('Error', 'No se pudo guardar el registro. Intenta de nuevo.');
            } finally {
                setGuardando(false);
            }
        },
        [alimentosDetectados]
    );

    // ─── REINICIAR SESIÓN ────────────────────────────────────────────────────────────────

    const resetScan = useCallback(() => {
        setAlimentosDetectados([]);
        setImagenUri(null);
    }, []);

    return {
        alimentosDetectados,
        imagenUri,
        analizando,
        guardando,
        handleScan,
        handleGaleria,
        handleGuardar,
        resetScan,
    };
}
