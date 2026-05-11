// ============================================================
// CONTEXTO DE TEMA - ThemeContext.tsx
// ============================================================
// Provee el tema (light/dark) a toda la aplicación.
// - Usa el tema del sistema como valor inicial
// - Permite alternar manualmente con toggleTheme()
// - Expone los colores del tema activo via useAppTheme()
// ============================================================

import React, { createContext, useContext, useState } from 'react';
import { Appearance } from 'react-native';
import { Colors, type ThemeColors } from '../constants/theme';

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Inicializar con el tema del sistema operativo
  const systemScheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook para acceder al tema desde cualquier componente
export function useAppTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
}
