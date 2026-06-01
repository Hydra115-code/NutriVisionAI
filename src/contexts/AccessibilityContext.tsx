import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tamaños de texto disponibles
export type TextSizeOption = 'normal' | 'large' | 'xlarge';

export const TEXT_SIZE_SCALE: Record<TextSizeOption, number> = {
  normal: 1,
  large: 1.2,
  xlarge: 1.45,
};

interface AccessibilityContextType {
  // Botón flotante
  showGadget: boolean;
  setShowGadget: (val: boolean) => void;

  // Tamaño de texto
  textSize: TextSizeOption;
  setTextSize: (val: TextSizeOption) => void;
  /** Multiplicador numérico listo para usar: normal=1, large=1.2, xlarge=1.45 */
  fontScale: number;

  // Alto contraste
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;

  // Reducir movimiento
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;

  // Compatibilidad hacia atrás (alias de textSize !== 'normal')
  largeText: boolean;
  setLargeText: (val: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [showGadget, setShowGadgetState] = useState(true);
  const [textSize, setTextSizeState] = useState<TextSizeOption>('normal');
  const [highContrast, setHighContrastState] = useState(false);
  const [reduceMotion, setReduceMotionState] = useState(false);

  // Cargar preferencias guardadas
  useEffect(() => {
    const load = async () => {
      try {
        const gadget   = await AsyncStorage.getItem('@acc_showGadget');
        const size     = await AsyncStorage.getItem('@acc_textSize');
        const contrast = await AsyncStorage.getItem('@acc_highContrast');
        const motion   = await AsyncStorage.getItem('@acc_reduceMotion');

        if (gadget   !== null) setShowGadgetState(gadget === 'true');
        if (size     !== null && ['normal','large','xlarge'].includes(size))
          setTextSizeState(size as TextSizeOption);
        if (contrast !== null) setHighContrastState(contrast === 'true');
        if (motion   !== null) setReduceMotionState(motion === 'true');
      } catch (e) {
        console.error('Error cargando preferencias de accesibilidad', e);
      }
    };
    load();
  }, []);

  // Helpers para guardar y actualizar
  const setShowGadget = async (val: boolean) => {
    setShowGadgetState(val);
    await AsyncStorage.setItem('@acc_showGadget', String(val));
  };

  const setTextSize = async (val: TextSizeOption) => {
    setTextSizeState(val);
    await AsyncStorage.setItem('@acc_textSize', val);
  };

  const setHighContrast = async (val: boolean) => {
    setHighContrastState(val);
    await AsyncStorage.setItem('@acc_highContrast', String(val));
  };

  const setReduceMotion = async (val: boolean) => {
    setReduceMotionState(val);
    await AsyncStorage.setItem('@acc_reduceMotion', String(val));
  };

  // Alias largeText para compatibilidad con código existente
  const largeText = textSize !== 'normal';
  const setLargeText = (val: boolean) => setTextSize(val ? 'large' : 'normal');

  const fontScale = TEXT_SIZE_SCALE[textSize];

  return (
    <AccessibilityContext.Provider value={{
      showGadget,
      setShowGadget,
      textSize,
      setTextSize,
      fontScale,
      highContrast,
      setHighContrast,
      reduceMotion,
      setReduceMotion,
      largeText,
      setLargeText,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility debe usarse dentro de AccessibilityProvider');
  return ctx;
}
