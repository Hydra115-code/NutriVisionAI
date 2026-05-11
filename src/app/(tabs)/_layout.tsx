// ============================================================
// LAYOUT DE TABS - (tabs)/_layout.tsx
// ============================================================
// Configura la barra de navegación inferior con colores
// dinámicos del ThemeContext (light/dark mode).
// ============================================================

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useAppTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.border,
          minHeight: 56,
          paddingBottom: 6,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>

      {/* 1. Pantalla de Escaneo (Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={28} color={color} />
          ),
        }}
      />

      {/* 2. Pantalla de Gráficas/Progreso */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-areaspline" size={28} color={color} />
          ),
        }}
      />

      {/* 3. Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={28} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}