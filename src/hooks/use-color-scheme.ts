/**
 * src/hooks/use-color-scheme.ts
 * Hook para obtener el esquema de color del sistema.
 */

import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme(): 'light' | 'dark' {
  return useRNColorScheme() ?? 'light';
}
