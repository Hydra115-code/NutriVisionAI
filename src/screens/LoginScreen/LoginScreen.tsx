import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppModal, { useAppModal } from '../../components/AppModal';
import { useAppTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useScaledStyles } from '../../hooks/useScaledStyles';
import { makeStyles } from './LoginScreen.styles';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { login } = useAuth();
  const { modal, showError, showWarning } = useAppModal();
  const { sc } = useScaledStyles();
  const styles = makeStyles(sc);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      showWarning('Campos Incompletos', 'Por favor, ingresa tu correo electrónico y contraseña para poder iniciar sesión.');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showWarning('Correo Inválido', 'El formato del correo electrónico no es válido. Verifica que incluya un "@" y un dominio (ej: usuario@correo.com).');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        showError('Acceso Denegado', 'El correo o la contraseña que ingresaste no coinciden con ninguna cuenta registrada. Verifica tus datos o crea una cuenta nueva.');
      }
    } catch (error) {
      showError('Error de Conexión', 'No pudimos procesar tu inicio de sesión en este momento. Esto puede deberse a un problema temporal. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <AppModal {...modal} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconBox, { backgroundColor: colors.lightGreen }]}>
              <MaterialCommunityIcons name="leaf" size={32} color={colors.primaryGreen} />
            </View>
          </View>
          <Text style={[styles.logo, { color: colors.text, fontSize: sc(28) }]}>NutriVision AI</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary, fontSize: sc(14) }]}>Tu salud, bajo control visual.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: emailFocused ? colors.borderFocus : colors.border, borderWidth: 1 }]}>
            <MaterialCommunityIcons name="email-outline" size={20} color={colors.textMuted} style={{ marginRight: 12 }} />
            <TextInput
              style={[styles.inputBase, { color: colors.text }]}
              placeholder="Correo Electrónico"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: passwordFocused ? colors.borderFocus : colors.border, borderWidth: 1 }]}>
            <MaterialCommunityIcons name="lock-outline" size={20} color={colors.textMuted} style={{ marginRight: 12 }} />
            <TextInput
              style={[styles.inputBase, { color: colors.text }]}
              placeholder="Contraseña"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <MaterialCommunityIcons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotContainer} onPress={() => router.push('/forgot-password')}>
            <Text style={[styles.forgotText, { color: colors.primaryGreen, fontSize: sc(14) }]}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primaryGreen }, isLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#0f172a" size="small" />
            ) : (
              <Text style={[styles.buttonText, { fontSize: sc(16) }]}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={[styles.noAccountText, { color: colors.textSecondary, fontSize: sc(14) }]}>¿No tienes cuenta?{' '}</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={[styles.registerText, { color: colors.primaryGreen, fontSize: sc(14) }]}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>

          
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
