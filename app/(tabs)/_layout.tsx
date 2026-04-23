import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS as GLOBAL_COLORS, useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        // Mantenemos tu configuración original
        tabBarActiveTintColor: GLOBAL_COLORS.primaryGreen,
        headerShown: false,
        tabBarButton: HapticTab,
        
        // Solo cambiamos los colores necesarios sin forzar alturas
        tabBarInactiveTintColor: isDark ? '#8e8e93' : '#999',
        tabBarStyle: {
          backgroundColor: colors.mainCard,
          borderTopColor: colors.border,
          // Eliminamos el 'height' y 'padding' manuales que causan el desplazamiento
        },
      }}>
      
      <Tabs.Screen
        name="index" 
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-areaspline" size={28} color={color} />
          ),
        }}
      />

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