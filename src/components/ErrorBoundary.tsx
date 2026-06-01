// ============================================================
// ERROR BOUNDARY GLOBAL - ErrorBoundary.tsx
// ============================================================
// Captura errores no manejados en el árbol de componentes React.
// En lugar de mostrar una pantalla blanca o un error crudo,
// muestra una pantalla amigable con opción de reintentar.
// ============================================================

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'Ocurrió un error inesperado',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#ef4444" />
            </View>

            <Text style={styles.title}>¡Ups! Algo salió mal</Text>
            <Text style={styles.message}>
              La aplicación encontró un problema inesperado. Esto no debería pasar y nuestro equipo trabajará para solucionarlo.
            </Text>

            <View style={styles.errorBox}>
              <Text style={styles.errorLabel}>Detalle técnico:</Text>
              <Text style={styles.errorText} numberOfLines={3}>
                {this.state.errorMessage}
              </Text>
            </View>

            <TouchableOpacity style={styles.retryBtn} onPress={this.handleRetry} activeOpacity={0.8}>
              <MaterialCommunityIcons name="refresh" size={20} color="#0f172a" />
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>

            <Text style={styles.hint}>
              Si el problema persiste, cierra la aplicación completamente y ábrela de nuevo.
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  errorBox: {
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  errorLabel: {
    fontSize: 10,
    color: '#ef4444',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34d399',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    marginBottom: 24,
    minWidth: 200,
  },
  retryText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
