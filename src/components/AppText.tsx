/**
 * AppText — reemplaza <Text> en toda la app.
 * Aplica automáticamente el fontScale de accesibilidad
 * multiplicando el fontSize definido en el style.
 *
 * Uso: igual que <Text> normal.
 * Las pantallas que ya usan <Text> pueden seguir usándolo;
 * este componente se usa en pantallas nuevas o al refactorizar.
 */
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface AppTextProps extends TextProps {
  children?: React.ReactNode;
}

export default function AppText({ style, children, ...props }: AppTextProps) {
  const { fontScale } = useAccessibility();

  // Aplanar el style para poder leer fontSize
  const flat = StyleSheet.flatten(style) ?? {};
  const baseFontSize: number = (flat.fontSize as number) ?? 14;
  const scaledFontSize = baseFontSize * fontScale;

  return (
    <Text
      {...props}
      allowFontScaling={false}
      style={[style, { fontSize: scaledFontSize }]}
    >
      {children}
    </Text>
  );
}
