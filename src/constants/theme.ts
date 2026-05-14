/**
 * src/constants/theme.ts
 * Paleta de colores para los temas light y dark de NutriVision AI.
 * Usado por ThemeContext para proveer colores a toda la app.
 */

export interface ThemeColors {
  background: string;
  card: string;
  cardAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderFocus: string;
  inputBg: string;
  primaryGreen: string;
  lightGreen: string;
  accentBlue: string;
  dangerRed: string;
  warningYellow: string;
  warningBg: string;
  tint: string;
  tabIconDefault: string;
  tabBarBg: string;
  overlay: string;
  divider: string;
  progressBg: string;
  protein: string;
  orangeFats: string;
  purpleIA: string;
}

const light: ThemeColors = {
  background: '#f8fafc',
  card: '#ffffff',
  cardAlt: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
  borderFocus: '#34d399',
  inputBg: '#f1f5f9',
  primaryGreen: '#10b981',
  lightGreen: '#d1fae5',
  accentBlue: '#3b82f6',
  dangerRed: '#ef4444',
  warningYellow: '#f59e0b',
  warningBg: '#fef3c7',
  tint: '#10b981',
  tabIconDefault: '#94a3b8',
  tabBarBg: '#ffffff',
  overlay: 'rgba(0,0,0,0.5)',
  divider: '#e2e8f0',
  progressBg: '#e2e8f0',
  protein: '#8b5cf6',
  orangeFats: '#f97316',
  purpleIA: '#8b5cf6',
};

const dark: ThemeColors = {
  background: '#0f172a',
  card: '#1e293b',
  cardAlt: '#334155',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  border: '#334155',
  borderFocus: '#34d399',
  inputBg: '#1e293b',
  primaryGreen: '#34d399',
  lightGreen: '#064e3b',
  accentBlue: '#60a5fa',
  dangerRed: '#f87171',
  warningYellow: '#fbbf24',
  warningBg: '#451a03',
  tint: '#34d399',
  tabIconDefault: '#64748b',
  tabBarBg: '#1e293b',
  overlay: 'rgba(0,0,0,0.7)',
  divider: '#334155',
  progressBg: '#334155',
  protein: '#a78bfa',
  orangeFats: '#fb923c',
  purpleIA: '#a78bfa',
};

export const Colors = { light, dark };
