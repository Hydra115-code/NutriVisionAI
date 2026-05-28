import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppModal, { useAppModal } from '../../components/AppModal';
import DatePickerModal from '../../components/DatePickerModal';
import { useAppTheme } from '../../contexts/ThemeContext';
import { useRegisterForm } from '../../hooks/useAuthForm';
import { useImageScanner } from '../../hooks/useImageScanner';
import { ErrorFeedback, LoadingFeedback } from '../../components/ui/StateFeedbacks';
import { styles } from './RegisterScreen.styles';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { modal, showSuccess, showError, showWarning, showInfo } = useAppModal();
  
  const { isScanning, errorState, clearError, scanFromLibrary } = useImageScanner();
  const form = useRegisterForm();

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDiagnosisSuccess = (diag: any) => {
    if (diag.nombrePaciente) form.setNombre(diag.nombrePaciente);
    if (diag.pesoDetectado) form.setPeso(diag.pesoDetectado);
    if (diag.tieneDiabetes) { 
        form.setTieneDiabetes('si'); 
        if (diag.tipoDiabetes) form.setTipoDiabetes(diag.tipoDiabetes); 
    } else { 
        form.setTieneDiabetes('no'); 
        form.setTipoDiabetes(''); 
    }
    showSuccess(
      'Datos del documento detectados',
      `Encontramos tu información en el documento y ya llenamos los campos automáticamente. Revisa que todo esté correcto antes de continuar.`
    );
  };

  const handleBodyScanSuccess = (scan: any) => {
    form.setPeso(scan.pesoEstimado);
    if (scan.estaturaEstimada) form.setAltura(String(Math.round(parseFloat(scan.estaturaEstimada))));
    showSuccess(
      'Datos detectados',
      `Peso estimado: ${scan.pesoEstimado} kg\nEstatura: ${scan.estaturaEstimada} cm\nComplexión: ${scan.complexion}\nIMC: ${scan.imc}\n\nYa llenamos los campos con estos datos. Puedes ajustarlos si no son exactos.`
    );
  };

  const onFinalizePress = async () => {
    try {
      const result = await form.handleFinalize((msg) => showWarning('Campos Incompletos', msg));
      if (result?.success) {
        showSuccess(
          '¡Ya eres parte de NutriVision! 🎉',
          `Tu cuenta está lista, ${form.nombre.split(' ')[0] || 'bienvenido'}.\n\nDesde ahora puedes fotografiar tus comidas y la app te dirá exactamente qué estás comiendo. ¡Empieza cuando quieras!`,
          () => router.replace('/(tabs)')
        );
      } else if (result) {
        showError('No se pudo crear la cuenta', result.message || 'Verifica que tus datos sean correctos e inténtalo de nuevo.');
      }
    } catch (error) {
      showError('Algo salió mal', 'Hubo un problema al crear tu cuenta. Cierra esta ventana e intenta de nuevo.');
    }
  };

  const handleDateSelect = (dateStr: string) => {
    form.handleDateChange(dateStr);
    setShowDatePicker(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppModal {...modal} />
      <DatePickerModal
        visible={showDatePicker}
        onSelect={handleDateSelect}
        onClose={() => setShowDatePicker(false)}
        initialDate={form.fechaNacimiento}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
            <Text style={[styles.stepText, { color: colors.textMuted }]}>Crea tu perfil — solo toma un minuto</Text>
            <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                <View style={[styles.progressBarFill, { backgroundColor: colors.primaryGreen }]} />
            </View>
        </View>

        {errorState && <ErrorFeedback message={errorState} onDismiss={clearError} />}
        {isScanning && <LoadingFeedback message="Analizando imagen con IA..." />}

        {/* Botones IA */}
        <View style={styles.iaContainer}>
          <TouchableOpacity
            style={[styles.iaButton, { backgroundColor: colors.card, borderColor: colors.border }, isScanning && { opacity: 0.5 }]}
            onPress={() => scanFromLibrary('diagnostico', handleDiagnosisSuccess)}
            disabled={isScanning}
          >
            <View style={[styles.iaIconBox, { backgroundColor: colors.accentBlue + '33' }]}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color={colors.accentBlue} />
            </View>
            <Text style={[styles.iaButtonTitle, { color: colors.text }]}>Tengo un diagnóstico médico</Text>
            <Text style={[styles.iaButtonSub, { color: colors.textMuted }]}>Sube una foto y llenamos los datos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iaButton, { backgroundColor: colors.card, borderColor: colors.border }, isScanning && { opacity: 0.5 }]}
            onPress={() => scanFromLibrary('cuerpo', handleBodyScanSuccess)}
            disabled={isScanning}
          >
            <View style={[styles.iaIconBox, { backgroundColor: colors.primaryGreen + '33' }]}>
              <MaterialCommunityIcons name="human-male-height" size={24} color={colors.primaryGreen} />
            </View>
            <Text style={[styles.iaButtonTitle, { color: colors.text }]}>Detectar mi peso y estatura</Text>
            <Text style={[styles.iaButtonSub, { color: colors.textMuted }]}>La IA lo estima con una foto</Text>
          </TouchableOpacity>
        </View>

        {/* --- FORMULARIO --- */}
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>Información Básica</Text>

          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: focusedField === 'nombre' ? colors.borderFocus : colors.border }]}>
            <Feather name="user" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.inputField, { color: colors.text }]} placeholder="Nombre completo" placeholderTextColor={colors.textMuted} value={form.nombre} onChangeText={form.setNombre} onFocus={() => setFocusedField('nombre')} onBlur={() => setFocusedField(null)} />
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: focusedField === 'email' ? colors.borderFocus : colors.border }]}>
            <MaterialCommunityIcons name="email-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.inputField, { color: colors.text }]} placeholder="Correo Electrónico" placeholderTextColor={colors.textMuted} value={form.email} onChangeText={form.setEmail} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: focusedField === 'password' ? colors.borderFocus : colors.border }]}>
            <MaterialCommunityIcons name="lock-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.inputField, { color: colors.text }]} placeholder="Contraseña (min. 6 caracteres)" placeholderTextColor={colors.textMuted} value={form.password} onChangeText={form.setPassword} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} secureTextEntry autoCapitalize="none" />
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: focusedField === 'confirmPassword' ? colors.borderFocus : colors.border }]}>
            <MaterialCommunityIcons name="lock-check-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.inputField, { color: colors.text }]} placeholder="Confirmar Contraseña" placeholderTextColor={colors.textMuted} value={form.confirmPassword} onChangeText={form.setConfirmPassword} onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)} secureTextEntry autoCapitalize="none" />
          </View>

          {/* Fecha de Nacimiento con botón de calendario */}
          <TouchableOpacity
            style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: focusedField === 'fecha' ? colors.borderFocus : colors.border }]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="calendar-month-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <Text style={[styles.inputField, { color: form.fechaNacimiento ? colors.text : colors.textMuted, paddingVertical: 18 }]}>
              {form.fechaNacimiento || 'Fecha de Nacimiento'}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={[styles.inputWrapper, { flex: 1, marginRight: 10, backgroundColor: colors.inputBg, borderColor: focusedField === 'peso' ? colors.borderFocus : colors.border }]}>
              <MaterialCommunityIcons name="weight-kilogram" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput style={[styles.inputField, { color: colors.text }]} placeholder="Peso (kg)" placeholderTextColor={colors.textMuted} value={form.peso} onChangeText={form.setPeso} onFocus={() => setFocusedField('peso')} onBlur={() => setFocusedField(null)} keyboardType="numeric" />
            </View>
            <View style={[styles.inputWrapper, { flex: 1, backgroundColor: colors.inputBg, borderColor: focusedField === 'altura' ? colors.borderFocus : colors.border }]}>
              <MaterialCommunityIcons name="human-male-height-variant" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput style={[styles.inputField, { color: colors.text }]} placeholder="Altura (cm)" placeholderTextColor={colors.textMuted} value={form.altura} onChangeText={form.setAltura} onFocus={() => setFocusedField('altura')} onBlur={() => setFocusedField(null)} keyboardType="numeric" />
            </View>
          </View>

          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>¿Padeces Diabetes?</Text>
          <View style={styles.diabetesRow}>
            <TouchableOpacity style={[styles.radioBtn, { borderColor: form.tieneDiabetes === 'si' ? colors.primaryGreen : colors.border, backgroundColor: form.tieneDiabetes === 'si' ? colors.lightGreen : 'transparent' }]} onPress={() => form.setTieneDiabetes('si')}>
              <MaterialCommunityIcons name={form.tieneDiabetes === 'si' ? "radiobox-marked" : "radiobox-blank"} size={20} color={form.tieneDiabetes === 'si' ? colors.primaryGreen : colors.textSecondary} />
              <Text style={[styles.radioText, { color: colors.text }]}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.radioBtn, { borderColor: form.tieneDiabetes === 'no' ? colors.primaryGreen : colors.border, backgroundColor: form.tieneDiabetes === 'no' ? colors.lightGreen : 'transparent' }]} onPress={() => { form.setTieneDiabetes('no'); form.setTipoDiabetes(''); }}>
              <MaterialCommunityIcons name={form.tieneDiabetes === 'no' ? "radiobox-marked" : "radiobox-blank"} size={20} color={form.tieneDiabetes === 'no' ? colors.primaryGreen : colors.textSecondary} />
              <Text style={[styles.radioText, { color: colors.text }]}>No</Text>
            </TouchableOpacity>
          </View>

          {form.tieneDiabetes === 'si' && (
            <View style={styles.tipoContainer}>
              <View style={styles.gridTipos}>
                {['Tipo 1', 'Tipo 2', 'Gestacional', 'Pre.Diabetes'].map((tipo) => (
                  <TouchableOpacity key={tipo} style={[styles.tipoTag, { backgroundColor: form.tipoDiabetes === tipo ? colors.primaryGreen : 'transparent', borderColor: form.tipoDiabetes === tipo ? colors.primaryGreen : colors.border }]} onPress={() => form.setTipoDiabetes(tipo)}>
                    <Text style={[styles.tipoTagText, { color: form.tipoDiabetes === tipo ? '#0f172a' : colors.textSecondary, fontWeight: form.tipoDiabetes === tipo ? 'bold' : 'normal' }]}>{tipo}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.termsContainer} onPress={() => form.setAceptaTerminos(!form.aceptaTerminos)}>
            <MaterialCommunityIcons name={form.aceptaTerminos ? "checkbox-marked" : "checkbox-blank-outline"} size={24} color={form.aceptaTerminos ? colors.primaryGreen : colors.textSecondary} />
            <Text style={[styles.termsText, { color: colors.textSecondary }]}>Acepto los <Text style={[styles.termsLink, { color: colors.primaryGreen }]} onPress={() => router.push('/terms')}>Términos de Uso</Text> y el manejo de mis datos de salud.</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.mainButton, { backgroundColor: colors.primaryGreen }, (!form.aceptaTerminos || form.isSubmitting) && { opacity: 0.6 }]} onPress={onFinalizePress} disabled={form.isSubmitting}>
          {form.isSubmitting ? <ActivityIndicator color="#0f172a" size="small" /> : <Text style={styles.mainButtonText}>Finalizar Registro</Text>}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}><Text style={[styles.loginLink, { color: colors.primaryGreen }]}>Inicia sesión</Text></TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}