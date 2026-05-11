import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppModal, { useAppModal } from '../../components/AppModal';
import { useAuth } from '../../contexts/AuthContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { styles } from './EditProfileScreen.styles';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { colors } = useAppTheme();
  const { modal, showSuccess, showError, showWarning } = useAppModal();

  const [nombre, setNombre] = useState(user?.nombre || '');
  const [peso, setPeso] = useState(user?.peso ? String(user.peso) : '');
  const [altura, setAltura] = useState(user?.altura ? String(user.altura) : '');
  const [tieneDiabetes, setTieneDiabetes] = useState<'si' | 'no'>(user?.tiene_diabetes === 'si' ? 'si' : 'no');
  const [tipoDiabetes, setTipoDiabetes] = useState(user?.tipo_diabetes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSave = async () => {
    if (nombre.trim() === '') {
      showWarning('Campo Vacío', 'El nombre es obligatorio. Ingresa tu nombre completo para continuar.');
      return;
    }
    
    const pesoNum = parseFloat(peso);
    if (peso && (isNaN(pesoNum) || pesoNum < 30 || pesoNum > 300)) {
      showWarning('Peso Fuera de Rango', 'El peso debe estar entre 30 y 300 kg. Ingresa un valor válido para tu peso actual.');
      return;
    }
    
    const alturaNum = parseFloat(altura);
    if (altura && (isNaN(alturaNum) || alturaNum < 100 || alturaNum > 250)) {
      showWarning('Altura Fuera de Rango', 'La altura debe estar entre 100 y 250 cm. Ingresa un valor válido para tu estatura.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateProfile({
        nombre: nombre.trim(), 
        peso: pesoNum || undefined,
        altura: alturaNum || undefined,
        tiene_diabetes: tieneDiabetes, 
        tipo_diabetes: tieneDiabetes === 'si' ? tipoDiabetes : '',
      });
      if (result.success) {
        showSuccess('Perfil Actualizado', 'Tus datos personales y médicos han sido guardados correctamente.', () => router.back());
      } else {
        showError('Error al Guardar', 'No se pudieron actualizar tus datos. Verifica la información e intenta nuevamente.');
      }
    } catch {
      showError('Error Inesperado', 'Ocurrió un problema al guardar tus cambios. Esto puede deberse a un problema temporal. Intenta de nuevo en unos momentos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppModal {...modal} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <View style={[styles.backIconBox, { backgroundColor: colors.card }]}>
                    <Feather name="arrow-left" size={20} color={colors.text} />
                </View>
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Editar Perfil</Text>
            <View style={styles.backBtn} />
          </View>

          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
                <View style={[styles.avatarGlow, { backgroundColor: colors.primaryGreen }]} />
                <View style={[styles.avatarCircle, { borderColor: colors.primaryGreen }]}>
                    <View style={[styles.avatarFallback, { backgroundColor: colors.card }]}>
                        <Text style={[styles.avatarText, { color: colors.text }]}>
                            {nombre ? nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                        </Text>
                    </View>
                </View>
            </View>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            
            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: focusedField === 'nombre' ? colors.borderFocus : colors.border }]}>
              <Feather name="user" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput style={[styles.inputField, { color: colors.text }]} placeholder="Tu nombre" placeholderTextColor={colors.textMuted} value={nombre} onChangeText={setNombre} onFocus={() => setFocusedField('nombre')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputWrapper, { flex: 1, marginRight: 10, backgroundColor: colors.inputBg, borderColor: focusedField === 'peso' ? colors.borderFocus : colors.border }]}>
                <MaterialCommunityIcons name="weight-kilogram" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput style={[styles.inputField, { color: colors.text }]} placeholder="Peso (30-300 kg)" placeholderTextColor={colors.textMuted} value={peso} onChangeText={setPeso} onFocus={() => setFocusedField('peso')} onBlur={() => setFocusedField(null)} keyboardType="numeric" />
              </View>
              <View style={[styles.inputWrapper, { flex: 1, backgroundColor: colors.inputBg, borderColor: focusedField === 'altura' ? colors.borderFocus : colors.border }]}>
                <MaterialCommunityIcons name="human-male-height" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput style={[styles.inputField, { color: colors.text }]} placeholder="Altura (100-250 cm)" placeholderTextColor={colors.textMuted} value={altura} onChangeText={setAltura} onFocus={() => setFocusedField('altura')} onBlur={() => setFocusedField(null)} keyboardType="numeric" />
              </View>
            </View>

            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>¿Padeces Diabetes?</Text>
            <View style={styles.diabetesRow}>
              {(['si', 'no'] as const).map(val => (
                <TouchableOpacity key={val} style={[styles.radioBtn, { borderColor: tieneDiabetes === val ? colors.primaryGreen : colors.border, backgroundColor: tieneDiabetes === val ? colors.lightGreen : 'transparent' }]}
                  onPress={() => { setTieneDiabetes(val); if (val === 'no') setTipoDiabetes(''); }}>
                  <MaterialCommunityIcons name={tieneDiabetes === val ? "radiobox-marked" : "radiobox-blank"} size={20} color={tieneDiabetes === val ? colors.primaryGreen : colors.textSecondary} />
                  <Text style={[styles.radioText, { color: colors.text }]}>{val === 'si' ? 'Sí' : 'No'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {tieneDiabetes === 'si' && (
              <View style={styles.tipoContainer}>
                <View style={styles.gridTipos}>
                  {['Tipo 1', 'Tipo 2', 'Gestacional', 'Pre.Diabetes'].map(tipo => (
                    <TouchableOpacity key={tipo} style={[styles.tipoTag, { backgroundColor: tipoDiabetes === tipo ? colors.primaryGreen : 'transparent', borderColor: tipoDiabetes === tipo ? colors.primaryGreen : colors.border }]}
                      onPress={() => setTipoDiabetes(tipo)}>
                      <Text style={[styles.tipoTagText, { color: tipoDiabetes === tipo ? '#0f172a' : colors.textSecondary, fontWeight: tipoDiabetes === tipo ? 'bold' : 'normal' }]}>{tipo}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primaryGreen }, isSubmitting && { opacity: 0.6 }]} onPress={handleSave} disabled={isSubmitting} activeOpacity={0.8}>
              {isSubmitting ? <ActivityIndicator color="#0f172a" size="small" /> : <Text style={styles.saveBtnText}>Guardar Cambios</Text>}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
