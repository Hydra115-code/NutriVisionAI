import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeProvider as CustomThemeProvider } from '../context/ThemeContext'; // IMPORTANTE: Tu contexto personalizado

export const unstable_settings = {
  // Prioridad al login
  initialRouteName: 'login', 
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <CustomThemeProvider> 
      {/* ThemeProvider 
      */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
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
      </ThemeProvider>
    </CustomThemeProvider>
  );
}