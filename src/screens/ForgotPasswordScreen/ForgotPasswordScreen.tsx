import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import AppModal, { useAppModal } from '../../components/AppModal';
import { useAppTheme } from '../../contexts/ThemeContext';
import { resetPassword } from '../../services/database';
import { useScaledStyles } from '../../hooks/useScaledStyles';
import { makeStyles } from './ForgotPasswordScreen.styles';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);

  const router = useRouter();
  const { colors } = useAppTheme();
  const { modal, showSuccess, showError, showWarning } = useAppModal();
  const { sc } = useScaledStyles();
  const styles = makeStyles(sc);

  const handleReset = async () => {
    if (email.trim() === '') {
      showWarning('Campo Vacío', 'Ingresa tu correo electrónico para que podamos localizar tu cuenta y restablecer la contraseña.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showWarning('Correo Inválido', 'El formato del correo no es válido. Asegúrate de que incluya un "@" y un dominio válido.');
      return;
    }

    if (newPassword.length < 6) {
      showWarning('Contraseña Débil', 'Tu nueva contraseña debe tener al menos 6 caracteres para garantizar la seguridad de tu cuenta.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showWarning('Contraseñas Diferentes', 'Las contraseñas que ingresaste no coinciden. Verifica que ambos campos tengan el mismo texto.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(email, newPassword);

      if (result.success) {
        showSuccess(
          'Contraseña Restablecida',
          'Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.',
          () => router.replace('/login')
        );
      } else {
        if (result.message.includes('No se encontró')) {
          showError('Cuenta No Encontrada', 'No encontramos ninguna cuenta registrada con ese correo electrónico. Verifica que sea el correo correcto o crea una cuenta nueva.');
        } else {
          showError('Error al Restablecer', result.message);
        }
      }
    } catch (error) {
      showError('Error Inesperado', 'No pudimos restablecer tu contraseña en este momento. Esto puede ser un problema temporal. Por favor intenta de nuevo en unos minutos.');
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: colors.lightGreen }]}>
            <MaterialCommunityIcons name="lock-reset" size={40} color={colors.primaryGreen} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Restablecer Contraseña</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Ingresa tu correo registrado y elige una nueva contraseña segura
          </Text>
        </View>

        <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: focusedField === 'email' ? colors.borderFocus : colors.border }]}>
            <MaterialCommunityIcons name="email-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.inputField, { color: colors.text }]} placeholder="tu-correo@ejemplo.com" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: focusedField === 'password' ? colors.borderFocus : colors.border }]}>
            <MaterialCommunityIcons name="lock-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.inputField, { color: colors.text }]} placeholder="Nueva contraseña (min. 6)" placeholderTextColor={colors.textMuted} value={newPassword} onChangeText={setNewPassword} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} secureTextEntry={!showPw} autoCapitalize="none" />
            <TouchableOpacity onPress={() => setShowPw(!showPw)}>
              <MaterialCommunityIcons name={showPw ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: focusedField === 'confirm' ? colors.borderFocus : colors.border }]}>
            <MaterialCommunityIcons name="lock-check-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.inputField, { color: colors.text }]} placeholder="Confirmar nueva contraseña" placeholderTextColor={colors.textMuted} value={confirmPassword} onChangeText={setConfirmPassword} onFocus={() => setFocusedField('confirm')} onBlur={() => setFocusedField(null)} secureTextEntry={!showPw} autoCapitalize="none" />
          </View>

          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: colors.primaryGreen }, isLoading && { opacity: 0.7 }]}
            onPress={handleReset}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#0f172a" size="small" />
            ) : (
              <Text style={styles.buttonText}>Restablecer Contraseña</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
            <Text style={[styles.loginLinkText, { color: colors.primaryGreen }]}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}