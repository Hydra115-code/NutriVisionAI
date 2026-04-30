import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, Modal, SafeAreaView, ScrollView,
  StyleSheet,
  Switch,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { analyzeDiagnosisDirectly, estimateBodyStatsDirectly } from '../api/geminiClient';
import { useAuth } from '../hooks/useAuth';

const LOCAL_COLORS = {
  primaryGreen: '#00b347', lightGreen: '#d1f2eb', textMain: '#1a2a3a',
  textSec: '#64748b', white: '#fff', border: '#e2e8f0',
  accentBlue: '#3b82f6', purpleIA: '#8b5cf6'
};

const OBJETIVOS_OPCIONES = [
  'Control de glucosa', 'Bajar de peso', 'Subir de peso',
  'Mantener peso', 'Ganar músculo', 'Mejorar alimentación',
  'Control de presión', 'Otro'
];

const ESTADOS_OPCIONES = [
  'Estable', 'En tratamiento', 'Saludable', 'En observación',
  'Controlado', 'En recuperación', 'Otro'
];


interface ModalListaProps {
  visible: boolean;
  opciones: string[];
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const { register } = useAuth();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [sexo, setSexo] = useState<string | null>(null);
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [objetivoCustom, setObjetivoCustom] = useState('');
  const [estadoSalud, setEstadoSalud] = useState('');
  const [estadoCustom, setEstadoCustom] = useState('');
  const [tieneDiabetes, setTieneDiabetes] = useState<'si' | 'no' | null>(null);
  const [tipoDiabetes, setTipoDiabetes] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analizandoIA, setAnalizandoIA] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [dateObj, setDateObj] = useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Global Accessibility
  const { fontScale, highContrast, boldText } = useAccessibility();

  // Modales para listas
  const [modalObjetivo, setModalObjetivo] = useState(false);
  const [modalEstado, setModalEstado] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateObj(selectedDate);
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      setFechaNacimiento(`${day}/${month}/${year}`);
    }
  };

  const handlePesoChange = (val: string) => {
    // Regex para permitir max 3 digitos enteros y hasta 2 decimales (ej 150.50)
    const regex = /^\d{0,3}(\.\d{0,2})?$/;
    if (regex.test(val)) setPeso(val);
  };
  const handleAlturaChange = (val: string) => {
    // Regex para max 3 digitos enteros y hasta 1 decimal (ej 180.5)
    const regex = /^\d{0,3}(\.\d{0,1})?$/;
    if (regex.test(val)) setAltura(val);
  };

  // Función para limpiar el JSON que devuelve la IA (quita bloques de código markdown)
  const parseIAJSON = (text: string): any => {
    try {
      const limpio = text.replace(/```json|```/g, '').trim();
      return JSON.parse(limpio);
    } catch (e) {
      console.error("Error parseando JSON de IA:", e);
      return null;
    }
  };

  // Escaneo corporal con IA — detecta peso y altura de la imagen
  const handleEscaneoCorporal = async () => {
    Alert.alert(
      "Escaneo Corporal IA",
      "¿Cómo quieres subir la imagen?",
      [
        {
          text: "📷 Tomar foto",
          onPress: async () => {
            const permiso = await ImagePicker.requestCameraPermissionsAsync();
            if (!permiso.granted) { Alert.alert("Permiso denegado", "Necesitamos acceso a tu cámara."); return; }
            const resultado = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
            if (resultado.canceled || !resultado.assets[0].base64) return;
            await procesarEscaneoCorporal(resultado.assets[0].base64);
          }
        },
        {
          text: "🖼️ Subir imagen",
          onPress: async () => {
            const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permiso.granted) { Alert.alert("Permiso denegado", "Necesitamos acceso a tu galería."); return; }
            const resultado = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });
            if (resultado.canceled || !resultado.assets[0].base64) return;
            await procesarEscaneoCorporal(resultado.assets[0].base64);
          }
        },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const procesarEscaneoCorporal = async (base64: string) => {
    setAnalizandoIA(true);
    try {
      const data = await estimateBodyStatsDirectly(base64);
      if (data.ok) {
        if (data.peso_kg != null) setPeso(String(data.peso_kg));
        if (data.altura_cm != null) setAltura(String(data.altura_cm));
        Alert.alert("✅ Escaneo completado", `Peso estimado: ${data.peso_kg} kg\nAltura estimada: ${data.altura_cm} cm\n\nPuedes ajustar los valores si lo deseas.`);
      } else {
        Alert.alert("Error", data.mensaje || "No se pudo estimar los datos.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con la IA.");
    } finally {
      setAnalizandoIA(false);
    }
  };

  // Rellenar con diagnóstico — toma foto o sube imagen de un documento médico
  const handleDiagnostico = async () => {
    Alert.alert(
      "Rellenar con Diagnóstico",
      "¿Cómo quieres subir tu diagnóstico?",
      [
        {
          text: "📷 Tomar foto",
          onPress: async () => {
            const permiso = await ImagePicker.requestCameraPermissionsAsync();
            if (!permiso.granted) return;
            const res = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.8 });
            // ✅ FIX 2: Verificar que base64 no sea undefined antes de pasar (resuelve error línea 133)
            if (!res.canceled && res.assets[0].base64) await analizarDiagnostico(res.assets[0].base64);
          }
        },
        {
          text: "🖼️ Subir imagen",
          onPress: async () => {
            const res = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.8 });
            // ✅ FIX 3: Verificar que base64 no sea undefined antes de pasar (resuelve error línea 140)
            if (!res.canceled && res.assets[0].base64) await analizarDiagnostico(res.assets[0].base64);
          }
        },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const analizarDiagnostico = async (base64: string) => {
    setAnalizandoIA(true);
    try {
      const data = await analyzeDiagnosisDirectly(base64);
      if (data.ok) {
        if (data.nombre) setNombre(data.nombre);
        if (data.apellido) setApellido(data.apellido);
        if (data.peso_kg) setPeso(String(data.peso_kg));
        if (data.altura_cm) setAltura(String(data.altura_cm));
        if (data.fecha_nacimiento) setFechaNacimiento(data.fecha_nacimiento);
        if (data.sexo) setSexo(data.sexo);
        if (data.tiene_diabetes) setTieneDiabetes(data.tiene_diabetes);
        if (data.tipo_diabetes) setTipoDiabetes(data.tipo_diabetes);
        if (data.objetivo) setObjetivo(data.objetivo);
        if (data.estado_salud) setEstadoSalud(data.estado_salud);
        Alert.alert("✅ Diagnóstico leído", "Se rellenaron los campos disponibles.");
      } else {
        Alert.alert("Error", data.mensaje || "No se pudo leer el diagnóstico.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con la IA.");
    } finally {
      setAnalizandoIA(false);
    }
  };
  const handleFinalize = async () => {
    if (nombre.trim() === '' || apellido.trim() === '' || email.trim() === '' || fechaNacimiento.trim() === '' || peso.trim() === '' || altura.trim() === '' || !sexo) {
      Alert.alert("Campos Vacíos", "Por favor, completa todos los campos esenciales.");
      return;
    }
    const pwdRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (password.trim().length < 6 || password.trim().length > 20) {
      Alert.alert("Contraseña inválida", "La contraseña debe tener entre 6 y 20 caracteres.");
      return;
    }
    if (!pwdRegex.test(password)) {
      Alert.alert("Contraseña débil", "La contraseña debe incluir al menos un símbolo especial (ej: ! @ # $ %).");
      return;
    }

    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura);

    if (isNaN(pesoNum) || pesoNum < 20 || pesoNum > 300) {
      Alert.alert("Peso inválido", "Por favor ingresa un peso real (entre 20 y 300 kg).");
      return;
    }
    if (isNaN(alturaNum) || alturaNum < 50 || alturaNum > 250) {
      Alert.alert("Altura inválida", "Por favor ingresa una altura real (entre 50 y 250 cm).");
      return;
    }

    if (tieneDiabetes === null) {
      Alert.alert("Información Médica", "Debes indicar si padeces diabetes o no.");
      return;
    }
    if (tieneDiabetes === 'si' && tipoDiabetes === '') {
      Alert.alert("Tipo de Diabetes", "Selecciona qué tipo de diabetes padeces.");
      return;
    }
    if (!aceptaTerminos) {
      Alert.alert("Aviso Legal", "Debes aceptar los términos para continuar.");
      return;
    }
    const objetivoFinal = objetivo === 'Otro' ? (objetivoCustom || 'No definido') : objetivo;
    const estadoFinal = estadoSalud === 'Otro' ? (estadoCustom || 'Estable') : estadoSalud;
    setIsLoading(true);
    try {
      const response = await register({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        correo: email.trim(),
        password,
        peso_kg: pesoNum,
        altura_cm: alturaNum,
        sexo: sexo || '',
        fecha_nacimiento: fechaNacimiento,
        objetivo: objetivoFinal || 'No definido',
        estado_inicial: estadoFinal || 'Estable',
        racha_inicial: 0,
        tiene_diabetes: tieneDiabetes || 'no',
        tipo_diabetes: tieneDiabetes === 'si' ? tipoDiabetes : ''
      });
      if (response.ok) {
        const saludo = sexo === 'Femenino' ? 'Bienvenida' : 'Bienvenido';
        Alert.alert(
          `¡Registro exitoso!`,
          `${saludo}. Tu cuenta ha sido creada y guardada en este dispositivo.`,
          [{ text: "Continuar", onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        Alert.alert("Error", response.mensaje || "Hubo un problema al registrar.");
      }
    } catch {
      Alert.alert("Error", "No se pudo registrar.");
    } finally {
      setIsLoading(false);
    }
  };

  const effectiveBg = highContrast ? (isDark ? '#000000' : '#FFFFFF') : colors.bg;
  const effectiveCardBg = highContrast ? (isDark ? '#111111' : '#F8F8F8') : colors.mainCard;
  const effectiveText = highContrast ? (isDark ? '#FFFFFF' : '#000000') : colors.textMain;
  const effectiveTextSec = highContrast ? (isDark ? '#CCCCCC' : '#333333') : colors.textSecondary;
  const effectiveBorder = highContrast ? (isDark ? '#FFFFFF' : '#000000') : colors.border;
  const fwNormal: any = boldText ? '700' : '500';
  const fwSemi: any = boldText ? '800' : '600';
  const fwBold: any = boldText ? '900' : 'bold';

  const dynamicStyles = StyleSheet.create({
    label: { fontSize: 12 * fontScale, fontWeight: fwSemi, marginBottom: 6, marginTop: 12 },
    input: { padding: 10 * fontScale, borderRadius: 8, fontSize: 14 * fontScale, borderWidth: highContrast ? 2 : 1, fontWeight: fwNormal },
    title: { fontSize: 28 * fontScale, fontWeight: fwBold },
    subtitle: { fontSize: 16 * fontScale, marginBottom: 20, fontWeight: fwNormal },
    radioText: { marginLeft: 6, fontSize: 14 * fontScale, fontWeight: fwSemi },
    iaButtonText: { color: LOCAL_COLORS.white, fontWeight: fwBold, fontSize: 11 * fontScale, marginTop: 5, textAlign: 'center' },
    selectorText: { fontSize: 14 * fontScale, fontWeight: fwNormal },
    mainButtonText: { color: '#fff', fontWeight: fwBold, fontSize: 16 * fontScale },
    termsText: { flex: 1, marginLeft: 10, fontSize: 12 * fontScale, fontWeight: fwNormal }
  });

  // ✅ FIX 1 aplicado: tipos explícitos en las props
  const ModalLista = ({ visible, opciones, onSelect, onClose }: ModalListaProps) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={[styles.modalContainer, { backgroundColor: colors.mainCard }]}>
          <Text style={[styles.modalTitle, { color: colors.textMain }]}>Selecciona una opción</Text>
          <ScrollView>
            {opciones.map((op) => (
              <TouchableOpacity key={op} style={[styles.modalOption, { borderBottomColor: colors.border }]} onPress={() => { onSelect(op); onClose(); }}>
                <Text style={[styles.modalOptionText, { color: colors.textMain }]}>{op}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: effectiveBg }]}>
      <ModalLista
        visible={modalObjetivo}
        opciones={OBJETIVOS_OPCIONES}
        onSelect={setObjetivo}
        onClose={() => setModalObjetivo(false)}
      />
      <ModalLista
        visible={modalEstado}
        opciones={ESTADOS_OPCIONES}
        onSelect={setEstadoSalud}
        onClose={() => setModalEstado(false)}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">



        <Text style={[dynamicStyles.title, { color: effectiveText, marginTop: 10 }]}>Crear Perfil</Text>
        <Text style={[dynamicStyles.subtitle, { color: effectiveTextSec }]}>Configura tu salud inteligente</Text>
        <View style={styles.iaContainer}>
          <TouchableOpacity style={styles.iaButton} onPress={handleDiagnostico} disabled={analizandoIA}>
            {analizandoIA
              ? <ActivityIndicator color={LOCAL_COLORS.white} />
              : <MaterialCommunityIcons name="file-document-edit" size={20} color={LOCAL_COLORS.white} />
            }
            <Text style={dynamicStyles.iaButtonText}>Rellenar con Diagnóstico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iaButton, { backgroundColor: LOCAL_COLORS.purpleIA }]} onPress={handleEscaneoCorporal} disabled={analizandoIA}>
            {analizandoIA
              ? <ActivityIndicator color={LOCAL_COLORS.white} />
              : <MaterialCommunityIcons name="human-male-height" size={20} color={LOCAL_COLORS.white} />
            }
            <Text style={dynamicStyles.iaButtonText}>Escaneo Corporal IA</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.formCard, { backgroundColor: effectiveCardBg, borderWidth: highContrast ? 1 : 0, borderColor: effectiveBorder }]}>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[dynamicStyles.label, { color: effectiveText }]}>Nombre</Text>
              <TextInput style={[dynamicStyles.input, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: effectiveBorder, color: effectiveText }]} placeholder="María" placeholderTextColor={effectiveTextSec} value={nombre} onChangeText={setNombre} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[dynamicStyles.label, { color: effectiveText }]}>Apellido</Text>
              <TextInput style={[dynamicStyles.input, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: effectiveBorder, color: effectiveText }]} placeholder="González" placeholderTextColor={effectiveTextSec} value={apellido} onChangeText={setApellido} />
            </View>
          </View>
          <Text style={[dynamicStyles.label, { color: effectiveText }]}>Correo Electrónico</Text>
          <TextInput style={[dynamicStyles.input, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: effectiveBorder, color: effectiveText }]} placeholder="correo@ejemplo.com" placeholderTextColor={effectiveTextSec} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Text style={[dynamicStyles.label, { color: effectiveText }]}>Contraseña</Text>
          <View style={[styles.passwordWrapper, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: effectiveBorder, borderWidth: highContrast ? 2 : 1 }]}>
            <TextInput
              style={[dynamicStyles.input, { flex: 1, borderWidth: 0 }]}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={effectiveTextSec}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!mostrarPassword}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              textContentType="password"
            />
            <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)} style={{ padding: 5 }}>
              <MaterialCommunityIcons name={mostrarPassword ? "eye-off" : "eye"} size={22} color={effectiveTextSec} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1.5, marginRight: 10 }}>
              <Text style={[dynamicStyles.label, { color: effectiveText }]}>Nacimiento</Text>
              <TouchableOpacity
                style={[dynamicStyles.input, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: effectiveBorder, justifyContent: 'center' }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: fechaNacimiento ? effectiveText : effectiveTextSec, fontSize: dynamicStyles.selectorText.fontSize, fontWeight: fwNormal }}>
                  {fechaNacimiento || "DD/MM/AAAA"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dateObj}
                  mode="date"
                  display="calendar"
                  minimumDate={new Date(1920, 0, 1)}
                  maximumDate={new Date()}
                  onChange={onDateChange}
                />
              )}
            </View>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[dynamicStyles.label, { color: effectiveText }]}>Peso (kg)</Text>
              <TextInput style={[dynamicStyles.input, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: effectiveBorder, color: effectiveText }]} placeholder="65" placeholderTextColor={effectiveTextSec} value={peso} onChangeText={handlePesoChange} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[dynamicStyles.label, { color: effectiveText }]}>Altura (cm)</Text>
              <TextInput style={[dynamicStyles.input, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: effectiveBorder, color: effectiveText }]} placeholder="170" placeholderTextColor={effectiveTextSec} value={altura} onChangeText={handleAlturaChange} keyboardType="numeric" />
            </View>
          </View>
          <Text style={[dynamicStyles.label, { color: effectiveText }]}>Objetivo</Text>
          <TouchableOpacity style={[styles.selectorBtn, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: effectiveBorder, borderWidth: highContrast ? 2 : 1 }]} onPress={() => setModalObjetivo(true)}>
            <Text style={{ color: objetivo ? effectiveText : effectiveTextSec, fontSize: dynamicStyles.selectorText.fontSize, fontWeight: fwNormal }}>
              {objetivo || 'Selecciona tu objetivo...'}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color={effectiveTextSec} />
          </TouchableOpacity>
          {objetivo === 'Otro' && (
            <TextInput style={[dynamicStyles.input, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: effectiveBorder, color: effectiveText, marginTop: 8 }]} placeholder="Escribe tu objetivo" placeholderTextColor={effectiveTextSec} value={objetivoCustom} onChangeText={setObjetivoCustom} />
          )}
          <Text style={[dynamicStyles.label, { color: effectiveText }]}>Estado Actual</Text>
          <TouchableOpacity style={[styles.selectorBtn, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: effectiveBorder, borderWidth: highContrast ? 2 : 1 }]} onPress={() => setModalEstado(true)}>
            <Text style={{ color: estadoSalud ? effectiveText : effectiveTextSec, fontSize: dynamicStyles.selectorText.fontSize, fontWeight: fwNormal }}>
              {estadoSalud || 'Selecciona tu estado...'}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color={effectiveTextSec} />
          </TouchableOpacity>
          {estadoSalud === 'Otro' && (
            <TextInput style={[dynamicStyles.input, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', borderColor: effectiveBorder, color: effectiveText, marginTop: 8 }]} placeholder="Describe tu estado" placeholderTextColor={effectiveTextSec} value={estadoCustom} onChangeText={setEstadoCustom} />
          )}
          <Text style={[dynamicStyles.label, { color: effectiveText }]}>Sexo</Text>
          <View style={styles.diabetesRow}>
            {['Masculino', 'Femenino'].map((s) => (
              <TouchableOpacity key={s} style={[styles.radioBtn, { borderColor: highContrast ? effectiveBorder : 'transparent' }, sexo === s && { borderColor: LOCAL_COLORS.primaryGreen, backgroundColor: isDark ? '#064e3b' : LOCAL_COLORS.lightGreen, borderWidth: 2 }]} onPress={() => setSexo(s)}>
                <MaterialCommunityIcons name={sexo === s ? "radiobox-marked" : "radiobox-blank"} size={20} color={sexo === s ? LOCAL_COLORS.primaryGreen : effectiveTextSec} />
                <Text style={[dynamicStyles.radioText, { color: effectiveText }]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[dynamicStyles.label, { color: effectiveText }]}>¿Padeces Diabetes?</Text>
          <View style={styles.diabetesRow}>
            <TouchableOpacity style={[styles.radioBtn, { borderColor: highContrast ? effectiveBorder : 'transparent' }, tieneDiabetes === 'si' && { borderColor: LOCAL_COLORS.primaryGreen, backgroundColor: isDark ? '#064e3b' : LOCAL_COLORS.lightGreen, borderWidth: 2 }]} onPress={() => setTieneDiabetes('si')}>
              <MaterialCommunityIcons name={tieneDiabetes === 'si' ? "radiobox-marked" : "radiobox-blank"} size={20} color={tieneDiabetes === 'si' ? LOCAL_COLORS.primaryGreen : effectiveTextSec} />
              <Text style={[dynamicStyles.radioText, { color: effectiveText }]}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.radioBtn, { borderColor: highContrast ? effectiveBorder : 'transparent' }, tieneDiabetes === 'no' && { borderColor: LOCAL_COLORS.primaryGreen, backgroundColor: isDark ? '#064e3b' : LOCAL_COLORS.lightGreen, borderWidth: 2 }]} onPress={() => { setTieneDiabetes('no'); setTipoDiabetes(''); }}>
              <MaterialCommunityIcons name={tieneDiabetes === 'no' ? "radiobox-marked" : "radiobox-blank"} size={20} color={tieneDiabetes === 'no' ? LOCAL_COLORS.primaryGreen : effectiveTextSec} />
              <Text style={[dynamicStyles.radioText, { color: effectiveText }]}>No</Text>
            </TouchableOpacity>
          </View>
          {tieneDiabetes === 'si' && (
            <View style={[styles.tipoContainer, { backgroundColor: isDark ? '#1a202c' : '#f8fafc', borderColor: effectiveBorder }]}>
              <Text style={[dynamicStyles.label, { color: effectiveText, marginTop: 0 }]}>Selecciona el Tipo</Text>
              <View style={styles.gridTipos}>
                {['Tipo 1', 'Tipo 2', 'Gestacional', 'Pre.Diabetes'].map((tipo) => (
                  <TouchableOpacity key={tipo} style={[styles.tipoTag, { backgroundColor: isDark ? '#2d3748' : LOCAL_COLORS.white, borderColor: effectiveBorder, borderWidth: highContrast ? 2 : 1 }, tipoDiabetes === tipo && { backgroundColor: LOCAL_COLORS.primaryGreen, borderColor: LOCAL_COLORS.primaryGreen }]} onPress={() => setTipoDiabetes(tipo)}>
                    <Text style={[styles.tipoTagText, { color: effectiveTextSec, fontWeight: fwSemi }, tipoDiabetes === tipo && styles.tipoTagTextActive]}>{tipo}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          <TouchableOpacity style={styles.termsContainer} onPress={() => setAceptaTerminos(!aceptaTerminos)}>
            <MaterialCommunityIcons name={aceptaTerminos ? "checkbox-marked" : "checkbox-blank-outline"} size={24} color={aceptaTerminos ? LOCAL_COLORS.primaryGreen : effectiveTextSec} />
            <Text style={[dynamicStyles.termsText, { color: effectiveText }]}>
              Acepto los <Text style={styles.termsLink}>Términos de Uso</Text> y el manejo de mis datos de salud.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mainButton, (!aceptaTerminos || isLoading) && { opacity: 0.6 }]} onPress={handleFinalize} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={dynamicStyles.mainButtonText}>Finalizar Registro</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 25 },
  accessibilityHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderRadius: 10, marginBottom: 10 },
  accessibilityPanel: { padding: 15, borderRadius: 10, borderWidth: 1, marginBottom: 10 },
  accessRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  zoomBtn: { padding: 8, borderRadius: 8, paddingHorizontal: 15 },
  iaContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  iaButton: { flex: 0.48, backgroundColor: LOCAL_COLORS.accentBlue, padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  iaButtonText: { color: LOCAL_COLORS.white, fontWeight: 'bold', fontSize: 11, marginTop: 5, textAlign: 'center' },
  formCard: { borderRadius: 20, padding: 20, elevation: 3 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: { padding: 10, borderRadius: 8, fontSize: 14, borderWidth: 1 },
  selectorBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, fontSize: 14, borderWidth: 1 },
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
  mainButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalOption: { paddingVertical: 15, borderBottomWidth: 1 },
  modalOptionText: { fontSize: 15 },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingRight: 10 },
});
