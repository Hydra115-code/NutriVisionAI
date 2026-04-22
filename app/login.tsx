import { Ionicons } from '@expo/vector-icons'; // Agregada para el icono de error
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState(false); // Estado para detectar error visual
  const router = useRouter();

  const handleLogin = () => {
    // --- VALIDACIÓN DE CAMPOS VACÍOS ---
    if (email.trim() === '' || password.trim() === '') {
      setErrorPassword(true); // Activa el error visual
      Alert.alert(
        "Campos incompletos", 
        "Por favor, ingresa tu correo y contraseña para continuar.",
        [{ text: "Entendido" }]
      );
      return; 
    }

    setErrorPassword(false);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.logo}>NutriVision AI</Text>
          <Text style={styles.tagline}>Tu salud, bajo control visual.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput 
            style={styles.input}
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            style={[
              styles.input,
              errorPassword && { borderColor: '#ef4444', borderWidth: 1.5 } // Borde rojo si hay error
            ]}
            placeholder="********"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if(errorPassword) setErrorPassword(false); // Limpia el error al escribir
            }}
            secureTextEntry
          />

          {/* --- CORRECCIÓN QA: Icono + Texto para Accesibilidad --- */}
          {errorPassword && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <Text style={styles.errorText}>Contraseña o correo incompletos.</Text>
            </View>
          )}

          <TouchableOpacity style={styles.forgotPass}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.noAccountText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.registerText}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 30 },
  header: { alignItems: 'center', marginBottom: 50 },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#00b347' },
  tagline: { fontSize: 16, color: '#7f8c8d', marginTop: 10 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#34495e', marginBottom: 8 },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  // --- NUEVOS ESTILOS PARA ERROR ---
  errorContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: -15, 
    marginBottom: 15 
  },
  errorText: { 
    color: '#ef4444', 
    fontSize: 13, 
    marginLeft: 5, 
    fontWeight: '500' 
  },
  forgotPass: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotText: { color: '#00b347', fontWeight: '600' },
  loginButton: {
    backgroundColor: '#00b347',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#00b347',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  noAccountText: { color: '#7f8c8d' },
  registerText: { color: '#00b347', fontWeight: 'bold' },
});