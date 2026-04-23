import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

export const COLORS = {
  primaryGreen: '#00b347',
  white: '#fff',
  accentOrange: '#f59e0b',
  statusGreen: '#22c55e',
  danger: '#ef4444',
  healthBadgeBg: '#fee2e2',
  healthBadgeText: '#b91c1c',
  // Colores que cambian
  light: {
    bg: '#f4f7f6',
    mainCard: '#fff',
    textMain: '#1a2a3a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
  },
  dark: {
    bg: '#121212',
    mainCard: '#1e1e1e',
    textMain: '#ececec',
    textSecondary: '#94a3b8',
    border: '#334155',
  }
};

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  colors: COLORS.light,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(systemColorScheme || 'light');
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const colors = theme === 'dark' ? COLORS.dark : COLORS.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);