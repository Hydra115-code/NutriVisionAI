import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet, PanResponder, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../contexts/ThemeContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { styles } from './AccessibilityScreen.styles';

export default function AccessibilityScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const {
    showGadget, setShowGadget,
    largeText, setLargeText,
    highContrast, setHighContrast,
    reduceMotion, setReduceMotion
  } = useAccessibility();

  const panY = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0,
      onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          Animated.timing(panY, {
            toValue: 800,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            router.back();
          });
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={StyleSheet.absoluteFill} 
        activeOpacity={1} 
        onPress={handleClose} 
      />
      <Animated.View style={[styles.modalContent, { backgroundColor: colors.background, transform: [{ translateY: panY }] }]}>
        <View style={styles.dragIndicatorContainer} {...panResponder.panHandlers}>
          <View style={styles.dragIndicator} />
        </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.backButton}>
          <MaterialCommunityIcons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Accesibilidad</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primaryGreen }]}>Personalización Visual</Text>
          
          <View style={[styles.toggleContainer, { borderBottomColor: colors.border }]}>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Tamaño de Texto Grande</Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                Aumenta el tamaño de la letra en toda la aplicación para facilitar la lectura.
              </Text>
            </View>
            <Switch
              trackColor={{ false: colors.border, true: colors.primaryGreen }}
              thumbColor={colors.card}
              ios_backgroundColor={colors.border}
              onValueChange={setLargeText}
              value={largeText}
            />
          </View>

          <View style={[styles.toggleContainer, { borderBottomColor: colors.border }]}>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Alto Contraste</Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                Aumenta el contraste entre el texto y el fondo para mejorar la visibilidad.
              </Text>
            </View>
            <Switch
              trackColor={{ false: colors.border, true: colors.primaryGreen }}
              thumbColor={colors.card}
              ios_backgroundColor={colors.border}
              onValueChange={setHighContrast}
              value={highContrast}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primaryGreen }]}>Widget Accesibilidad</Text>
          
          <View style={[styles.toggleContainer, { borderBottomColor: colors.border }]}>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Mostrar Botón Flotante</Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                Muestra el gadget de accesibilidad siempre visible en el borde de la pantalla.
              </Text>
            </View>
            <Switch
              trackColor={{ false: colors.border, true: colors.primaryGreen }}
              thumbColor={colors.card}
              ios_backgroundColor={colors.border}
              onValueChange={setShowGadget}
              value={showGadget}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primaryGreen }]}>Animaciones</Text>
          
          <View style={[styles.toggleContainer, { borderBottomColor: colors.border }]}>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Reducir Movimiento</Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                Minimiza las animaciones y transiciones dentro de la aplicación.
              </Text>
            </View>
            <Switch
              trackColor={{ false: colors.border, true: colors.primaryGreen }}
              thumbColor={colors.card}
              ios_backgroundColor={colors.border}
              onValueChange={setReduceMotion}
              value={reduceMotion}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.primaryGreen }]}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Guardar Preferencias</Text>
            <MaterialCommunityIcons name="check" size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>

      </ScrollView>
      </Animated.View>
    </View>
  );
}
