// ============================================================
// COMPONENTE MODAL UNIVERSAL - AppModal.tsx
// ============================================================
// Modal reutilizable para toda la app con variantes:
//   - success (verde): Operaciones exitosas
//   - error (rojo): Errores y fallos
//   - warning (amarillo): Alertas de salud / precaución
//   - info (azul): Información general
//
// Reemplaza todos los Alert.alert() por una UI consistente
// y visualmente profesional que evita errores crudos al usuario.
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

export type ModalVariant = 'success' | 'error' | 'warning' | 'info';

interface AppModalProps {
  visible: boolean;
  variant?: ModalVariant;
  title: string;
  message: string;
  buttonText?: string;
  secondaryButtonText?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
}

const ICON_MAP: Record<ModalVariant, { name: string; }> = {
  success: { name: 'check-circle-outline' },
  error: { name: 'alert-circle-outline' },
  warning: { name: 'alert-outline' },
  info: { name: 'information-outline' },
};

export default function AppModal({
  visible,
  variant = 'info',
  title,
  message,
  buttonText = 'Entendido',
  secondaryButtonText,
  onPrimary,
  onSecondary,
}: AppModalProps) {
  const { colors } = useAppTheme();

  const colorMap: Record<ModalVariant, string> = {
    success: colors.primaryGreen,
    error: colors.dangerRed,
    warning: colors.warningYellow,
    info: colors.accentBlue,
  };

  const bgMap: Record<ModalVariant, string> = {
    success: colors.primaryGreen + '1A',
    error: colors.dangerRed + '1A',
    warning: colors.warningYellow + '1A',
    info: colors.accentBlue + '1A',
  };

  const accentColor = colorMap[variant];
  const bgColor = bgMap[variant];
  const iconInfo = ICON_MAP[variant];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onPrimary}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* Icono */}
          <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
            <MaterialCommunityIcons
              name={iconInfo.name as any}
              size={48}
              color={accentColor}
            />
          </View>

          {/* Título */}
          <Text style={[styles.title, { color: accentColor }]}>{title}</Text>

          {/* Mensaje */}
          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

          {/* Botones */}
          <View style={styles.buttonRow}>
            {secondaryButtonText && onSecondary && (
              <TouchableOpacity
                style={[styles.secondaryBtn, { borderColor: colors.border }]}
                onPress={onSecondary}
                activeOpacity={0.7}
              >
                <Text style={[styles.secondaryBtnText, { color: colors.textSecondary }]}>
                  {secondaryButtonText}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                { backgroundColor: accentColor },
                secondaryButtonText ? { flex: 1 } : { width: '100%' },
              ]}
              onPress={onPrimary}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ============================================================
// Hook para manejar el estado del modal desde cualquier pantalla
// ============================================================
export interface ModalState {
  visible: boolean;
  variant: ModalVariant;
  title: string;
  message: string;
  buttonText: string;
  secondaryButtonText?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
}

const INITIAL_STATE: ModalState = {
  visible: false,
  variant: 'info',
  title: '',
  message: '',
  buttonText: 'Entendido',
  onPrimary: () => {},
};

export function useAppModal() {
  const [modal, setModal] = React.useState<ModalState>(INITIAL_STATE);

  const dismiss = React.useCallback(() => {
    setModal(prev => ({ ...prev, visible: false }));
  }, []);

  const showSuccess = React.useCallback((title: string, message: string, onOk?: () => void) => {
    setModal({
      visible: true,
      variant: 'success',
      title,
      message,
      buttonText: 'Continuar',
      onPrimary: () => { dismiss(); onOk?.(); },
    });
  }, [dismiss]);

  const showError = React.useCallback((title: string, message: string) => {
    setModal({
      visible: true,
      variant: 'error',
      title,
      message,
      buttonText: 'Reintentar',
      onPrimary: dismiss,
    });
  }, [dismiss]);

  const showWarning = React.useCallback((title: string, message: string, onOk?: () => void) => {
    setModal({
      visible: true,
      variant: 'warning',
      title,
      message,
      buttonText: 'Entendido',
      onPrimary: () => { dismiss(); onOk?.(); },
    });
  }, [dismiss]);

  const showInfo = React.useCallback((title: string, message: string) => {
    setModal({
      visible: true,
      variant: 'info',
      title,
      message,
      buttonText: 'OK',
      onPrimary: dismiss,
    });
  }, [dismiss]);

  const showConfirm = React.useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant: ModalVariant = 'warning'
  ) => {
    setModal({
      visible: true,
      variant,
      title,
      message,
      buttonText: confirmText,
      secondaryButtonText: cancelText,
      onPrimary: () => { dismiss(); onConfirm(); },
      onSecondary: dismiss,
    });
  }, [dismiss]);

  return { modal, showSuccess, showError, showWarning, showInfo, showConfirm, dismiss };
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  card: {
    width: '100%',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  primaryBtn: {
    minHeight: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    flex: 1,
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
