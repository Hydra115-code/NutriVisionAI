// ============================================================
// LAYOUT RAÍZ - _layout.tsx
// ============================================================

import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider, useAppTheme } from '../contexts/ThemeContext';
import { AccessibilityProvider, useAccessibility } from '../contexts/AccessibilityContext';
import AccessibilityWidget from '../components/AccessibilityWidget';
import ErrorBoundary from '../components/ErrorBoundary';
import FontScaleProvider from '../components/FontScaleProvider';

export const unstable_settings = {
  initialRouteName: 'index',
};

function RootLayoutInner() {
  const { isDark } = useAppTheme();
  const { reduceMotion } = useAccessibility();

  const transition = reduceMotion ? 'none' : 'default';
  const slideUp    = reduceMotion ? 'none' : 'slide_from_bottom';

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index"           options={{ headerShown: false }} />
        <Stack.Screen name="welcome"         options={{ headerShown: false, animation: transition }} />
        <Stack.Screen name="accessibility"   options={{ presentation: 'transparentModal', animation: slideUp, headerShown: false }} />
        <Stack.Screen name="login"           options={{ headerShown: false, animation: transition }} />
        <Stack.Screen name="register"        options={{ headerShown: false, animation: transition }} />
        <Stack.Screen name="(tabs)"          options={{ headerShown: false, animation: transition }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false, animation: transition }} />
        <Stack.Screen name="edit-profile"    options={{ headerShown: false, animation: transition }} />
        <Stack.Screen name="terms"           options={{ presentation: 'modal', headerShown: false, animation: slideUp }} />
      </Stack>
      <AccessibilityWidget />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        {/* FontScaleProvider aplica el scale a todos los Text de la app */}
        <FontScaleProvider>
          <ThemeProvider>
            <AuthProvider>
              <RootLayoutInner />
            </AuthProvider>
          </ThemeProvider>
        </FontScaleProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}