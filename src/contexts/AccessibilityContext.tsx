import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccessibilityContextType {
  showGadget: boolean;
  setShowGadget: (val: boolean) => void;
  largeText: boolean;
  setLargeText: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [showGadget, setShowGadget] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Load preferences
    const loadPrefs = async () => {
      try {
        const gadget = await AsyncStorage.getItem('@acc_showGadget');
        if (gadget !== null) setShowGadget(gadget === 'true');
        
        const text = await AsyncStorage.getItem('@acc_largeText');
        if (text !== null) setLargeText(text === 'true');

        const contrast = await AsyncStorage.getItem('@acc_highContrast');
        if (contrast !== null) setHighContrast(contrast === 'true');

        const motion = await AsyncStorage.getItem('@acc_reduceMotion');
        if (motion !== null) setReduceMotion(motion === 'true');
      } catch (e) {
        console.error('Failed to load accessibility preferences');
      }
    };
    loadPrefs();
  }, []);

  const saveState = async (key: string, value: boolean, setter: (val: boolean) => void) => {
    setter(value);
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (e) {
      console.error('Failed to save accessibility preference', key);
    }
  };

  return (
    <AccessibilityContext.Provider value={{
      showGadget,
      setShowGadget: (v) => saveState('@acc_showGadget', v, setShowGadget),
      largeText,
      setLargeText: (v) => saveState('@acc_largeText', v, setLargeText),
      highContrast,
      setHighContrast: (v) => saveState('@acc_highContrast', v, setHighContrast),
      reduceMotion,
      setReduceMotion: (v) => saveState('@acc_reduceMotion', v, setReduceMotion),
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
