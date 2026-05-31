import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useAccessibility } from '../contexts/AccessibilityContext';

export default function AccessibilityWidget() {
  const { showGadget } = useAccessibility();
  const router = useRouter();
  const pathname = usePathname();

  if (!showGadget || pathname === '/accessibility') return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity 
        style={styles.gadgetButton}
        onPress={() => router.push('/accessibility')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="wheelchair-accessibility" size={26} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    zIndex: 9999,
  },
  gadgetButton: {
    backgroundColor: '#3b82f6', // Un azul visible como en la imagen
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
