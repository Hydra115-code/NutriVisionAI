import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  // Prioridad al login
  initialRouteName: 'login', 
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* 1. Pantalla de Login */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        
        {/* 2. Pantalla de Registro (Añadimos esta línea) */}
        <Stack.Screen name="register" options={{ headerShown: false }} />
        
        {/* 3. Las pestañas principales (Dashboard) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* 4. El modal */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}