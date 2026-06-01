import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../contexts/ThemeContext';

/**
 * @description Componente visual para mostrar estados de error (Permisos denegados, errores de red, etc).
 * Mantiene la estética Glassmorphism del proyecto.
 */
export const ErrorFeedback = ({ message, onDismiss }: { message: string, onDismiss: () => void }) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.errorContainer, { backgroundColor: colors.dangerRed + '1A', borderColor: colors.dangerRed + '33' }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.dangerRed + '33' }]}>
        <Feather name="alert-triangle" size={24} color={colors.dangerRed} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.errorTitle, { color: colors.dangerRed }]}>Error de Proceso</Text>
        <Text style={[styles.errorMessage, { color: colors.text }]}>{message}</Text>
      </View>
      <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
        <Feather name="x" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

/**
 * @description Skeleton/Spinner para estados de carga interactivos agradables al usuario.
 */
export const LoadingFeedback = ({ message = 'Procesando...' }: { message?: string }) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.loadingContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <ActivityIndicator size="large" color={colors.primaryGreen} />
      <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeBtn: {
    padding: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
