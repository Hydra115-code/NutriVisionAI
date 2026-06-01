/**
 * FontScaleProvider — versión sin efectos visuales.
 * El scale de texto se maneja por pantalla individual.
 */
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function FontScaleProvider({ children }: Props) {
  return <>{children}</>;
}
