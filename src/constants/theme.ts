/**
 * src/constants/theme.ts
 * Paleta de colores para los temas light, dark y alto contraste de NutriVision AI.
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

// ── Tema claro normal ──────────────────────────────────────────────────────────
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

// ── Tema oscuro normal ─────────────────────────────────────────────────────────
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

// ── Alto contraste claro ───────────────────────────────────────────────────────
// Negro puro sobre blanco puro, bordes gruesos, sin grises intermedios
const highContrastLight: ThemeColors = {
  background: '#ffffff',
  card: '#ffffff',
  cardAlt: '#f0f0f0',
  text: '#000000',
  textSecondary: '#000000',
  textMuted: '#1a1a1a',
  border: '#000000',
  borderFocus: '#005500',
  inputBg: '#ffffff',
  primaryGreen: '#005500',
  lightGreen: '#ccffcc',
  accentBlue: '#0000cc',
  dangerRed: '#cc0000',
  warningYellow: '#996600',
  warningBg: '#ffffcc',
  tint: '#005500',
  tabIconDefault: '#333333',
  tabBarBg: '#ffffff',
  overlay: 'rgba(0,0,0,0.8)',
  divider: '#000000',
  progressBg: '#cccccc',
  protein: '#440088',
  orangeFats: '#884400',
  purpleIA: '#440088',
};

// ── Alto contraste oscuro ──────────────────────────────────────────────────────
// Blanco puro sobre negro puro
const highContrastDark: ThemeColors = {
  background: '#000000',
  card: '#000000',
  cardAlt: '#111111',
  text: '#ffffff',
  textSecondary: '#ffffff',
  textMuted: '#dddddd',
  border: '#ffffff',
  borderFocus: '#00ff88',
  inputBg: '#111111',
  primaryGreen: '#00ff88',
  lightGreen: '#003322',
  accentBlue: '#66aaff',
  dangerRed: '#ff4444',
  warningYellow: '#ffdd00',
  warningBg: '#332200',
  tint: '#00ff88',
  tabIconDefault: '#aaaaaa',
  tabBarBg: '#000000',
  overlay: 'rgba(0,0,0,0.9)',
  divider: '#ffffff',
  progressBg: '#333333',
  protein: '#cc88ff',
  orangeFats: '#ffaa44',
  purpleIA: '#cc88ff',
};

export const Colors = { light, dark };
export const HighContrastColors = { light: highContrastLight, dark: highContrastDark };
