import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../contexts/ThemeContext';
import { styles } from './WelcomeScreen.styles';

const { width } = Dimensions.get('window');

// ─── PASOS DEL TUTORIAL ───────────────────────────────────────────────────────
const STEPS = [
  {
    key: 'step1',
    icon: 'leaf' as const,
    iconColor: '#10b981',
    bgColor: '#d1fae5',
    title: 'Bienvenido a\nNutriVision AI',
    description:
      'Tu asistente personal de nutrición. Te ayuda a entender qué estás comiendo y cómo mejorar tu alimentación día a día, de forma sencilla.',
  },
  {
    key: 'step2',
    icon: 'camera-iris' as const,
    iconColor: '#3b82f6',
    bgColor: '#dbeafe',
    title: 'Toma una foto\ny listo',
    description:
      'Fotografía tu plato y la app detecta automáticamente las calorías, proteínas, grasas y azúcares. Sin contar ni calcular nada tú mismo.',
  },
  {
    key: 'step3',
    icon: 'chart-areaspline' as const,
    iconColor: '#f97316',
    bgColor: '#ffedd5',
    title: 'Sigue tu progreso\ncada día',
    description:
      'Ve cuánto has comido, recibe consejos fáciles de entender y mantén un registro de tu alimentación semanal. Todo en un solo lugar.',
  },
];

export default function WelcomeScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<any>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const isLastStep = currentIndex === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      router.replace('/register');
    } else {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  const currentStep = STEPS[currentIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Botón saltar */}
      <View style={{ alignItems: 'flex-end', paddingHorizontal: 24, paddingTop: 16, minHeight: 44 }}>
        {!isLastStep && (
          <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={{ color: colors.textMuted, fontSize: 15, fontWeight: '600' }}>Saltar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Contenido del paso actual */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28 }}>

        {/* Ícono */}
        <View style={[
          styles.iconBox,
          {
            backgroundColor: currentStep.bgColor,
            width: 120,
            height: 120,
            borderRadius: 40,
            marginBottom: 40,
          }
        ]}>
          <MaterialCommunityIcons name={currentStep.icon} size={60} color={currentStep.iconColor} />
        </View>

        {/* Título */}
        <Text style={[styles.title, { color: colors.text, fontSize: 28, marginBottom: 20, textAlign: 'center' }]}>
          {currentStep.title}
        </Text>

        {/* Descripción */}
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: 16, lineHeight: 26, textAlign: 'center' }]}>
          {currentStep.description}
        </Text>

      </View>

      {/* Indicadores de puntos */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32 }}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === currentIndex ? colors.primaryGreen : colors.border,
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>

      {/* Botones */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primaryGreen, marginBottom: 16 }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>
            {isLastStep ? 'Crear mi cuenta' : 'Siguiente'}
          </Text>
          <MaterialCommunityIcons
            name={isLastStep ? 'check' : 'arrow-right'}
            size={20}
            color="#0f172a"
          />
        </TouchableOpacity>

        <View style={styles.loginLinkContainer}>
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={[styles.loginLink, { color: colors.primaryGreen }]}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}
