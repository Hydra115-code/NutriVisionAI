// ============================================================
// CONTEXTO DE TEMA - ThemeContext.tsx
// ============================================================
// Provee el tema (light/dark/highContrast) y fontScale a toda
// la aplicación, leyendo las preferencias de accesibilidad.
// ============================================================

import React, { createContext, useContext, useState } from 'react';
import { Appearance } from 'react-native';
import { Colors, HighContrastColors, type ThemeColors } from '../constants/theme';
import { useAccessibility } from './AccessibilityContext';

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  fontScale: number;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  // Leer accesibilidad para alto contraste y escala de fuente
  const { highContrast, fontScale } = useAccessibility();

  const toggleTheme = () => setIsDark(prev => !prev);

  // Si alto contraste está activo, usar paleta de alto contraste
  // Si no, usar la paleta normal según dark/light
  let colors: ThemeColors;
  if (highContrast) {
    colors = isDark ? HighContrastColors.dark : HighContrastColors.light;
  } else {
    colors = isDark ? Colors.dark : Colors.light;
  }

  return (
    <ThemeContext.Provider value={{ isDark, colors, fontScale, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme debe usarse dentro de ThemeProvider');
  return ctx;
}
