/**
 * useScaledStyles
 *
 * Hook que devuelve una función `sc(size)` que multiplica cualquier
 * fontSize por el fontScale de accesibilidad del usuario.
 *
 * Uso en cualquier pantalla:
 *   const { sc } = useScaledStyles();
 *   <Text style={{ fontSize: sc(16) }}>Hola</Text>
 */
import { useAccessibility } from '../contexts/AccessibilityContext';

export function useScaledStyles() {
  const { fontScale } = useAccessibility();
  const sc = (size: number) => Math.round(size * fontScale);
  return { sc, fontScale };
}
