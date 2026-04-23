import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState(false);
  
  // --- NUEVOS ESTADOS PARA EL FOCO (QA-IN-03) ---
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  const router = useRouter();

  const handleLogin = () => {
    if (email.trim() === '' || password.trim() === '') {
      setErrorPassword(true);
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
            style={[
              styles.input,
              isEmailFocused && styles.inputFocused // Aplica borde verde si está seleccionado
            ]}
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            style={[
              styles.input,
              isPasswordFocused && styles.inputFocused, // Borde verde
              errorPassword && { borderColor: '#ef4444', borderWidth: 2 } // Prioridad al rojo si hay error
            ]}
            placeholder="********"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if(errorPassword) setErrorPassword(false);
            }}
            secureTextEntry
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />

          {errorPassword && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
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
    borderWidth: 1.5,
    borderColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56, // Cumple QA-IN-01 (Motricidad)
    marginBottom: 20,
    fontSize: 16,
  },
  
  // --- ESTILO DE FOCO REQUERIDO (QA-IN-03) ---
  inputFocused: {
    borderColor: '#00b347', // Verde principal
    borderWidth: 2.5,       // Más grueso para contraste
    backgroundColor: '#fff', // Cambia fondo para resaltar más
    shadowColor: '#00b347',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },

  errorContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: -10, 
    marginBottom: 15 
  },
  errorText: { 
    color: '#ef4444', 
    fontSize: 14, 
    marginLeft: 5, 
    fontWeight: '600' 
  },
  
  forgotPass: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotText: { color: '#00b347', fontWeight: '600' },

  loginButton: {
    backgroundColor: '#00b347',
    height: 56, 
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
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