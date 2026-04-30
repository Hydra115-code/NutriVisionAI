import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAccessibility } from '../context/AccessibilityContext';
import { useTheme, COLORS as GLOBAL_COLORS } from '../context/ThemeContext';

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { fontScale, highContrast, boldText, zoomIn, zoomOut, setHighContrast, setBoldText } = useAccessibility();
  const [step, setStep] = useState(1);

  const effectiveBg = highContrast ? (isDark ? '#000000' : '#FFFFFF') : colors.bg;
  const effectiveCardBg = highContrast ? (isDark ? '#111111' : '#F8F8F8') : colors.mainCard;
  const effectiveText = highContrast ? (isDark ? '#FFFFFF' : '#000000') : colors.textMain;
  const effectiveTextSec = highContrast ? (isDark ? '#CCCCCC' : '#333333') : colors.textSecondary;
  const effectiveBorder = highContrast ? (isDark ? '#FFFFFF' : '#000000') : colors.border;
  const fwSemi: any = boldText ? '800' : '600';
  const fwBold: any = boldText ? '900' : 'bold';
  const fwNormal: any = boldText ? '700' : '500';

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@has_seen_onboarding', 'true');
      router.replace('/login');
    } catch (e) {
      console.error('Error saving onboarding state', e);
      router.replace('/login');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <MaterialCommunityIcons name="heart-pulse" size={80} color={GLOBAL_COLORS.primaryGreen} style={styles.icon} />
      <Text style={[styles.title, { color: effectiveText, fontSize: 28 * fontScale, fontWeight: fwBold }]}>
        Bienvenido a NutriVision AI
      </Text>
      <Text style={[styles.description, { color: effectiveTextSec, fontSize: 16 * fontScale, fontWeight: fwNormal }]}>
        Tu asistente inteligente para llevar un control visual y preciso de tu nutrición y bienestar.
      </Text>
      
      <View style={[styles.card, { backgroundColor: effectiveCardBg, borderColor: effectiveBorder, borderWidth: highContrast ? 2 : 0 }]}>
        <View style={styles.featureRow}>
          <MaterialCommunityIcons name="camera" size={24} color={GLOBAL_COLORS.primaryGreen} />
          <Text style={[styles.featureText, { color: effectiveText, fontSize: 15 * fontScale, fontWeight: fwSemi }]}>Analiza tu comida con solo una foto</Text>
        </View>
        <View style={styles.featureRow}>
          <MaterialCommunityIcons name="human-male-height" size={24} color={GLOBAL_COLORS.primaryGreen} />
          <Text style={[styles.featureText, { color: effectiveText, fontSize: 15 * fontScale, fontWeight: fwSemi }]}>Estimación corporal inteligente</Text>
        </View>
        <View style={styles.featureRow}>
          <MaterialCommunityIcons name="file-document-edit" size={24} color={GLOBAL_COLORS.primaryGreen} />
          <Text style={[styles.featureText, { color: effectiveText, fontSize: 15 * fontScale, fontWeight: fwSemi }]}>Lectura automática de diagnósticos</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.mainButton, { backgroundColor: GLOBAL_COLORS.primaryGreen }]} onPress={() => setStep(2)}>
        <Text style={[styles.mainButtonText, { fontSize: 18 * fontScale }]}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <MaterialCommunityIcons name="human-wheelchair" size={80} color="#3b82f6" style={styles.icon} />
      <Text style={[styles.title, { color: effectiveText, fontSize: 26 * fontScale, fontWeight: fwBold }]}>
        Accesibilidad para ti
      </Text>
      <Text style={[styles.description, { color: effectiveTextSec, fontSize: 16 * fontScale, fontWeight: fwNormal }]}>
        Antes de empezar, puedes configurar NutriVision para que se adapte perfectamente a tus necesidades visuales.
      </Text>

      <View style={[styles.card, { backgroundColor: effectiveCardBg, borderColor: effectiveBorder, borderWidth: highContrast ? 2 : 0 }]}>
        <View style={styles.accessRow}>
          <Text style={{ color: effectiveText, fontSize: 14 * fontScale, fontWeight: fwSemi }}>Zoom de Texto</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={zoomOut} style={[styles.zoomBtn, { backgroundColor: effectiveBorder }]}><Text style={{ fontWeight: fwBold, color: effectiveBg }}>A-</Text></TouchableOpacity>
            <TouchableOpacity onPress={zoomIn} style={[styles.zoomBtn, { backgroundColor: effectiveBorder }]}><Text style={{ fontWeight: fwBold, color: effectiveBg }}>A+</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.accessRow}>
          <Text style={{ color: effectiveText, fontSize: 14 * fontScale, fontWeight: fwSemi }}>Alto Contraste</Text>
          <Switch value={highContrast} onValueChange={setHighContrast} />
        </View>
        <View style={styles.accessRow}>
          <Text style={{ color: effectiveText, fontSize: 14 * fontScale, fontWeight: fwSemi }}>Fuente en Negrita</Text>
          <Switch value={boldText} onValueChange={setBoldText} />
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: isDark ? '#1e3a8a' : '#dbeafe' }]}>
        <MaterialCommunityIcons name="information" size={24} color="#3b82f6" />
        <Text style={[styles.infoText, { color: isDark ? '#bfdbfe' : '#1e3a8a', fontSize: 14 * fontScale, fontWeight: fwNormal }]}>
          ¿Ves el botón azul flotando a la derecha? Siempre estará ahí por si necesitas cambiar estos ajustes en cualquier pantalla.
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.secondaryButton, { borderColor: effectiveTextSec }]} onPress={() => setStep(1)}>
          <Text style={[styles.secondaryButtonText, { color: effectiveText, fontSize: 16 * fontScale }]}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainButton, { backgroundColor: GLOBAL_COLORS.primaryGreen, flex: 1, marginLeft: 15, marginTop: 0 }]} onPress={finishOnboarding}>
          <Text style={[styles.mainButtonText, { fontSize: 18 * fontScale }]}>Comenzar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: effectiveBg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 1 ? renderStep1() : renderStep2()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  stepContainer: {
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    marginLeft: 15,
    flex: 1,
  },
  accessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  zoomBtn: {
    padding: 10,
    borderRadius: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
  },
  mainButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  mainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    flex: 0.5,
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
});
