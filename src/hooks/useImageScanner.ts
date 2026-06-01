/**
 * src/hooks/useImageScanner.ts
 * Hook para escanear imágenes con la cámara o galería y analizarlas con IA.
 * Usado por DashboardScreen, RegisterScreen y ProfileScreen.
 */

import * as ImagePicker from 'expo-image-picker';
import { useState, useCallback } from 'react';
import { analizarComida, escanearCuerpo, analizarDiagnostico } from '../services/geminiService';

type ScanType = 'comida' | 'cuerpo' | 'diagnostico';
type OnSuccessCallback = (result: any, uri: string) => void;

export function useImageScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  const clearError = useCallback(() => setErrorState(null), []);

  const processImage = useCallback(async (
    type: ScanType,
    uri: string,
    onSuccess: OnSuccessCallback
  ) => {
    setIsScanning(true);
    setErrorState(null);
    try {
      let analysisResult: any;
      if (type === 'comida') {
        analysisResult = await analizarComida(uri);
      } else if (type === 'cuerpo') {
        analysisResult = await escanearCuerpo(uri);
      } else if (type === 'diagnostico') {
        analysisResult = await analizarDiagnostico(uri);
      }
      onSuccess(analysisResult, uri);
    } catch (error: any) {
      const msg = error?.message || 'Error al procesar la imagen.';
      setErrorState(msg);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const scanFromCamera = useCallback(async (type: ScanType, onSuccess: OnSuccessCallback) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setErrorState('Se necesita permiso de cámara para escanear.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    await processImage(type, result.assets[0].uri, onSuccess);
  }, [processImage]);

  const scanFromLibrary = useCallback(async (type: ScanType, onSuccess: OnSuccessCallback) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setErrorState('Se necesita permiso de galería para seleccionar una imagen.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    await processImage(type, result.assets[0].uri, onSuccess);
  }, [processImage]);

  return { isScanning, errorState, clearError, scanFromCamera, scanFromLibrary };
}
