import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

/**
 * Punto de entrada de la app.
 * - Si está cargando: muestra spinner.
 * - Si ya tiene sesión activa: va directo a las tabs.
 * - Si no tiene sesión: muestra el tutorial de bienvenida.
 */
export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // Sin sesión → siempre mostrar bienvenida/tutorial
  return <Redirect href="/welcome" />;
}
