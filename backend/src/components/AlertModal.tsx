// ============================================================
// COMPONENTE DE ALERTA CRÍTICA - AlertModal.tsx
// ============================================================
// Modal reutilizable para alertas de salud críticas.
// Se dispara cuando se detecta un nivel de azúcar alto (>15g).
// Bloquea el flujo del usuario hasta que presione "Entendido".
//
// Props:
//   - visible: boolean para mostrar/ocultar
//   - title: título de la alerta
//   - message: descripción del problema
//   - onDismiss: callback cuando el usuario presiona "Entendido"
// ============================================================

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppTheme } from '../contexts/ThemeContext';

interface AlertModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onDismiss: () => void;
}

export default function AlertModal({
  visible,
  title = '️ ALERTA: Nivel de Azúcar ALTO',
  message = 'Se detectó un nivel elevado de azúcar (>15g) en este alimento. Consume con precaución y consulta a tu médico si es necesario.',
  onDismiss,
}: AlertModalProps) {
  const { colors } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
          {/* Icono de advertencia */}
          <View style={[styles.iconCircle, { backgroundColor: colors.warningBg }]}>
            <MaterialCommunityIcons
              name="alert"
              size={48}
              color={colors.dangerRed}
            />
          </View>

          {/* Título */}
          <Text
            style={[styles.title, { color: colors.dangerRed }]}
            accessibilityRole="header"
          >
            {title}
          </Text>

          {/* Mensaje */}
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Text>

          {/* Botón "Entendido" */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.dangerRed }]}
            onPress={onDismiss}
            accessibilityLabel="Cerrar alerta"
            accessibilityRole="button"
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  button: {
    width: '100%',
    minHeight: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});