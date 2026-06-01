// ============================================================
// LAYOUT RAÍZ - _layout.tsx
// ============================================================
// Componente raíz de la aplicación. Define:
//   - ThemeProvider para dark/light mode en toda la app
//   - AuthProvider para autenticación global
//   - Sistema de navegación (Stack)
//   - Tema visual de react-navigation sincronizado
// ============================================================

import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider, useAppTheme } from '../contexts/ThemeContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import AccessibilityWidget from '../components/AccessibilityWidget';
import ErrorBoundary from '../components/ErrorBoundary';

export const unstable_settings = {
  // La primera pantalla que se muestra es el login
  initialRouteName: 'login',
};

// Componente interno que usa el tema
function RootLayoutInner() {
  const { isDark } = useAppTheme();

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* 0. Pantalla de Bienvenida y Accesibilidad */}
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="accessibility" options={{ presentation: 'transparentModal', animation: 'slide_from_bottom', headerShown: false }} />

        {/* 1. Pantalla de Login */}
        <Stack.Screen name="login" options={{ headerShown: false }} />

        {/* 2. Pantalla de Registro */}
        <Stack.Screen name="register" options={{ headerShown: false }} />

        {/* 3. Las pestañas principales (Dashboard) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />


        {/* 5. Restablecer contraseña */}
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />

        {/* 6. Editar perfil */}
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />

        {/* 7. Términos y condiciones */}
        <Stack.Screen name="terms" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <AccessibilityWidget />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    // ThemeProvider va por fuera para que AuthProvider y todo lo demás
    // pueda acceder al tema
    <ErrorBoundary>
      <AccessibilityProvider>
        <ThemeProvider>
          <AuthProvider>
            <RootLayoutInner />
          </AuthProvider>
        </ThemeProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}