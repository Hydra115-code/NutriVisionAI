import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext'; // Importar el tema

const LOCAL_COLORS = {
  primaryGreen: '#00b347',
  lightGreen: '#d1f2eb',
  textMain: '#1a2a3a',
  textSec: '#64748b',
  white: '#fff',
  border: '#e2e8f0',
  accentBlue: '#3b82f6',
  purpleIA: '#8b5cf6'
};

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme(); // Usar colores del tema
  
  // ESTADOS DEL FORMULARIO (Aseguran que el sistema "lea" lo que escribes)
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [peso, setPeso] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [tieneDiabetes, setTieneDiabetes] = useState<'si' | 'no' | null>(null);
  const [tipoDiabetes, setTipoDiabetes] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setFechaNacimiento(formatted);
  };

  // FUNCIÓN DE VALIDACIÓN (Crucial para el Sprint 3)
  const handleFinalize = () => {
    // 1. Validar campos de texto
    if (nombre.trim() === '' || email.trim() === '' || fechaNacimiento.trim() === '' || peso.trim() === '') {
      Alert.alert("Campos Vacíos", "Por favor, completa todos los campos de texto antes de finalizar.");
      return;
    }

    // 2. Validar selección de diabetes
    if (tieneDiabetes === null) {
      Alert.alert("Información Médica", "Debes indicar si padeces diabetes o no.");
      return;
    }

    // 3. Validar tipo de diabetes si marcó 'si'
    if (tieneDiabetes === 'si' && tipoDiabetes === '') {
      Alert.alert("Tipo de Diabetes", "Selecciona qué tipo de diabetes padeces.");
      return;
    }

    // 4. Validar términos
    if (!aceptaTerminos) {
      Alert.alert("Aviso Legal", "Debes aceptar los términos para continuar.");
      return;
    }

    // Si todo está lleno, avanza
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={[styles.title, { color: colors.textMain }]}>Crear Perfil</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Configura tu salud inteligente</Text>

        <View style={styles.iaContainer}>
            <TouchableOpacity style={styles.iaButton} onPress={() => Alert.alert("IA", "Analizando...")}>
                <MaterialCommunityIcons name="file-document-edit" size={20} color={LOCAL_COLORS.white} />
                <Text style={styles.iaButtonText}>Rellenar con Diagnóstico</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.iaButton, { backgroundColor: LOCAL_COLORS.purpleIA }]} onPress={() => Alert.alert("IA", "Escaneando...")}>
                <MaterialCommunityIcons name="human-male-height" size={20} color={LOCAL_COLORS.white} />
                <Text style={styles.iaButtonText}>Escaneo Corporal IA</Text>
            </TouchableOpacity>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.mainCard }]}>
          <Text style={[styles.label, { color: colors.textMain }]}>Nombre Completo</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: colors.border, color: colors.textMain }]} 
            placeholder="María González" 
            placeholderTextColor={colors.textSecondary}
            value={nombre}
            onChangeText={setNombre} 
          />

          <Text style={[styles.label, { color: colors.textMain }]}>Correo Electrónico</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: colors.border, color: colors.textMain }]} 
            placeholder="correo@ejemplo.com" 
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address" 
            autoCapitalize="none" 
          />

          <View style={styles.row}>
            <View style={{ flex: 1.5, marginRight: 10 }}>
              <Text style={[styles.label, { color: colors.textMain }]}>Fecha de Nacimiento</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: colors.border, color: colors.textMain }]} 
                placeholder="DD/MM/AAAA" 
                placeholderTextColor={colors.textSecondary}
                value={fechaNacimiento}
                onChangeText={handleDateChange}
                keyboardType="numeric" 
                maxLength={10} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textMain }]}>Peso (kg)</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: colors.border, color: colors.textMain }]} 
                placeholder="65" 
                placeholderTextColor={colors.textSecondary}
                value={peso}
                onChangeText={setPeso}
                keyboardType="numeric" 
              />
            </View>
          </View>

          <Text style={[styles.label, { color: colors.textMain }]}>¿Padeces Diabetes?</Text>
          <View style={styles.diabetesRow}>
            <TouchableOpacity 
              style={[styles.radioBtn, tieneDiabetes === 'si' && { borderColor: LOCAL_COLORS.primaryGreen, backgroundColor: isDark ? '#064e3b' : LOCAL_COLORS.lightGreen }]} 
              onPress={() => setTieneDiabetes('si')}
            >
              <MaterialCommunityIcons 
                name={tieneDiabetes === 'si' ? "radiobox-marked" : "radiobox-blank"} 
                size={20} 
                color={tieneDiabetes === 'si' ? LOCAL_COLORS.primaryGreen : colors.textSecondary} 
              />
              <Text style={[styles.radioText, { color: colors.textMain }]}>Sí</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.radioBtn, tieneDiabetes === 'no' && { borderColor: LOCAL_COLORS.primaryGreen, backgroundColor: isDark ? '#064e3b' : LOCAL_COLORS.lightGreen }]} 
              onPress={() => { setTieneDiabetes('no'); setTipoDiabetes(''); }}
            >
              <MaterialCommunityIcons 
                name={tieneDiabetes === 'no' ? "radiobox-marked" : "radiobox-blank"} 
                size={20} 
                color={tieneDiabetes === 'no' ? LOCAL_COLORS.primaryGreen : colors.textSecondary} 
              />
              <Text style={[styles.radioText, { color: colors.textMain }]}>No</Text>
            </TouchableOpacity>
          </View>

          {tieneDiabetes === 'si' && (
            <View style={[styles.tipoContainer, { backgroundColor: isDark ? '#1a202c' : '#f8fafc', borderColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.textMain, marginTop: 0 }]}>Selecciona el Tipo</Text>
              <View style={styles.gridTipos}>
                {['Tipo 1', 'Tipo 2', 'Gestacional', 'Pre.Diabetes'].map((tipo) => (
                  <TouchableOpacity 
                    key={tipo} 
                    style={[styles.tipoTag, { backgroundColor: isDark ? '#2d3748' : LOCAL_COLORS.white, borderColor: colors.border }, tipoDiabetes === tipo && { backgroundColor: LOCAL_COLORS.primaryGreen, borderColor: LOCAL_COLORS.primaryGreen }]} 
                    onPress={() => setTipoDiabetes(tipo)}
                  >
                    <Text style={[styles.tipoTagText, { color: colors.textSecondary }, tipoDiabetes === tipo && styles.tipoTagTextActive]}>{tipo}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={styles.termsContainer} 
            onPress={() => setAceptaTerminos(!aceptaTerminos)}
          >
            <MaterialCommunityIcons 
              name={aceptaTerminos ? "checkbox-marked" : "checkbox-blank-outline"} 
              size={24} 
              color={aceptaTerminos ? LOCAL_COLORS.primaryGreen : colors.textSecondary} 
            />
            <Text style={[styles.termsText, { color: colors.textSecondary }]}>
              Acepto los <Text style={styles.termsLink}>Términos de Uso</Text> y el manejo de mis datos de salud.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mainButton, !aceptaTerminos && { opacity: 0.6 }]} 
            onPress={handleFinalize}
          >
            <Text style={styles.mainButtonText}>Finalizar Registro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 25 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginBottom: 20 },
  iaContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  iaButton: { flex: 0.48, backgroundColor: LOCAL_COLORS.accentBlue, padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  iaButtonText: { color: LOCAL_COLORS.white, fontWeight: 'bold', fontSize: 11, marginTop: 5, textAlign: 'center' },
  formCard: { borderRadius: 20, padding: 20, elevation: 3 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: { padding: 10, borderRadius: 8, fontSize: 14, borderWidth: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  diabetesRow: { flexDirection: 'row', marginTop: 5 },
  radioBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 20, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: 'transparent' },
  radioText: { marginLeft: 6, fontSize: 14, fontWeight: '500' },
  tipoContainer: { marginTop: 15, padding: 12, borderRadius: 12, borderWidth: 1 },
  gridTipos: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
  tipoTag: { borderWidth: 1, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, marginRight: 6, marginBottom: 6 },
  tipoTagText: { fontSize: 12 },
  tipoTagTextActive: { color: '#fff', fontWeight: 'bold' },
  termsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 25 },
  termsText: { flex: 1, marginLeft: 10, fontSize: 12 },
  termsLink: { color: '#00b347', fontWeight: 'bold', textDecorationLine: 'underline' },
  mainButton: { backgroundColor: '#00b347', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  mainButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});