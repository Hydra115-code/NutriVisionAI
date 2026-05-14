import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../contexts/ThemeContext';
import { styles } from './WelcomeScreen.styles';

export default function WelcomeScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <View style={[styles.iconBox, { backgroundColor: colors.lightGreen }]}>
            <MaterialCommunityIcons name="leaf" size={48} color={colors.primaryGreen} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Bienvenido a{'\n'}NutriVision AI</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Descubre una nueva forma de cuidar tu alimentación. Analiza tus comidas al instante con nuestra inteligencia artificial.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureRow}>
            <View style={[styles.featureIconBox, { backgroundColor: colors.accentBlue + '20' }]}>
              <MaterialCommunityIcons name="camera-iris" size={24} color={colors.accentBlue} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Escaneo Inteligente</Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>Detecta calorías y macronutrientes solo con una foto.</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIconBox, { backgroundColor: colors.dangerRed + '20' }]}>
              <MaterialCommunityIcons name="alert-decagram" size={24} color={colors.dangerRed} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Alertas de Salud</Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>Recibe advertencias sobre excesos de azúcar o procesados.</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primaryGreen }]}
            onPress={() => router.push('/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Comenzar</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#0f172a" />
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[styles.loginLink, { color: colors.primaryGreen }]}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
