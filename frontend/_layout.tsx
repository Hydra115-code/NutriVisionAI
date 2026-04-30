import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { UserProvider } from '../context/UserContext';
import { AccessibilityProvider } from '../context/AccessibilityContext';
import FloatingAccessibilityButton from '../components/FloatingAccessibilityButton';

import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { ThemeProvider as CustomThemeProvider } from '../context/ThemeContext'; // IMPORTANTE: Tu contexto personalizado
import { initLocalDb } from '../database/localDb';

export const unstable_settings = {
  // Prioridad al login
  initialRouteName: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initLocalDb().catch(e => console.error("Error init DB:", e));
  }, []);

  return (
    <UserProvider>
      <AccessibilityProvider>
        <CustomThemeProvider>
          {/* ThemeProvider 
        */}
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ animation: 'fade_from_bottom', animationDuration: 400 }}>
              {/* Pantalla de Onboarding */}
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              
              {/* Pantalla de Login */}
              <Stack.Screen name="login" options={{ headerShown: false }} />

              {/*  Pantalla de Registro */}
              <Stack.Screen name="register" options={{ headerShown: false }} />

              {/* Pestañas principales (Dashboard) */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/*El modal */}
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
            <FloatingAccessibilityButton />
          </ThemeProvider>
        </CustomThemeProvider>
      </AccessibilityProvider>
    </UserProvider>
  );
}