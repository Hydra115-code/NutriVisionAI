import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS as GLOBAL_COLORS, useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

import { useAuth } from '../hooks/useAuth';
export default function LoginScreen() {
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const { setUsuario } = useUser();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const { login } = useAuth();

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      setErrorPassword(true);
      Alert.alert("Campos incompletos", "Por favor, ingresa tu correo y contraseña.", [{ text: "Entendido" }]);
      return;
    }
    setErrorPassword(false);
    setIsLoading(true);
    try {
      const response = await login(email.trim(), password);

      if (response.ok) {
        router.replace('/(tabs)');
      } else {
        setErrorPassword(true);
        Alert.alert("Error", response.mensaje || "Correo o contraseña incorrectos.");
      }
    } catch (error) {
      Alert.alert("Error de conexión", "No se pudo conectar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (email.trim() === '') {
      Alert.alert(
        "Recuperar contraseña",
        "Ingresa tu correo electrónico en el campo de arriba y vuelve a presionar este botón.",
        [{ text: "Entendido" }]
      );
      return;
    }

    Alert.alert(
      "Recuperar contraseña",
      `Se enviará un correo de recuperación a:\n\n${email.trim()}\n\n¿Deseas continuar?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: async () => {
            try {
              Alert.alert(
                "✅ Solicitud enviada",
                "Si el correo está en nuestra base de datos local, lo procesaremos. (Versión offline MVP)"
              );
            } catch {
              Alert.alert("Error", "No se pudo procesar la solicitud.");
            }
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.logo, { color: GLOBAL_COLORS.primaryGreen }]}>NutriVision AI</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>Tu salud, bajo control visual.</Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.textMain }]}>Correo Electrónico</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9', borderColor: isEmailFocused ? '#00b347' : (isDark ? '#333' : '#eee'), color: colors.textMain }]}
            placeholder="ejemplo@correo.com"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
          />

          <Text style={[styles.label, { color: colors.textMain }]}>Contraseña</Text>
          {/* Wrapper para input + ojo */}
          <View style={[
            styles.passwordWrapper,
            { 
              backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9', 
              borderColor: errorPassword ? '#ef4444' : (isPasswordFocused ? '#00b347' : (isDark ? '#333' : '#eee'))
            }
          ]}>
            <TextInput
              ref={passwordRef}
              style={[styles.passwordInput, { color: colors.textMain }]}
              placeholder="********"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={(txt) => { setPassword(txt); if (errorPassword) setErrorPassword(false); }}
              secureTextEntry={!mostrarPassword}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)} style={styles.eyeButton}>
              <Ionicons name={mostrarPassword ? "eye-off" : "eye"} size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {errorPassword && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text style={styles.errorText}>Contraseña o correo incompletos.</Text>
            </View>
          )}

          <TouchableOpacity style={styles.forgotPass} onPress={handleForgotPassword}>
            <Text style={[styles.forgotText, { color: GLOBAL_COLORS.primaryGreen }]}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.loginButton, { backgroundColor: GLOBAL_COLORS.primaryGreen }]} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Iniciar Sesión</Text>}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={[styles.noAccountText, { color: colors.textSecondary }]}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={[styles.registerText, { color: GLOBAL_COLORS.primaryGreen }]}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 30 },
  header: { alignItems: 'center', marginBottom: 50 },
  logo: { fontSize: 32, fontWeight: 'bold' },
  tagline: { fontSize: 16, marginTop: 10 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 15, height: 56, marginBottom: 20, fontSize: 16 },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, height: 56, marginBottom: 20, paddingHorizontal: 15 },
  passwordInput: { flex: 1, fontSize: 16, height: '100%' },
  eyeButton: { padding: 5 },
  inputFocused: { borderColor: '#00b347', borderWidth: 2.5, elevation: 3 },
  errorContainer: { flexDirection: 'row', alignItems: 'center', marginTop: -10, marginBottom: 15 },
  errorText: { color: '#ef4444', fontSize: 14, marginLeft: 5, fontWeight: '600' },
  forgotPass: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotText: { fontWeight: '600' },
  loginButton: { height: 56, borderRadius: 15, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  noAccountText: {},
  registerText: { fontWeight: 'bold' },
});