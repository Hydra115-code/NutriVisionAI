import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert, Modal, SafeAreaView, ScrollView, StyleSheet,
  Switch, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { API_URL } from '../../constants/config';
import { COLORS as GLOBAL_COLORS, useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { toggleTheme, colors, isDark } = useTheme();
  const { usuario, setUsuario, cerrarSesion } = useUser() as any;

  // Estados del modal de edición
  const [modalEditar, setModalEditar] = useState(false);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editApellido, setEditApellido] = useState('');
  const [editPeso, setEditPeso] = useState('');
  const [editAltura, setEditAltura] = useState('');
  const [editObjetivo, setEditObjetivo] = useState('');
  const [editEstado, setEditEstado] = useState('');
  const [escaneandoCorporal, setEscaneandoCorporal] = useState(false);

  const iniciales = usuario?.nombre
    ? usuario.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'NU';

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: () => {
        cerrarSesion();
        router.replace('/login');
      }}
    ]);
  };

  // Abre el modal con los datos actuales precargados
  const handleAbrirEdicion = () => {
    setEditNombre(usuario?.nombre || '');
    setEditApellido(usuario?.apellido || '');
    setEditPeso(usuario?.peso_kg ? String(usuario.peso_kg) : '');
    setEditAltura(usuario?.altura_cm ? String(usuario.altura_cm) : '');
    setEditObjetivo(usuario?.objetivo || '');
    setEditEstado(usuario?.estado_inicial || '');
    setModalEditar(true);
  };

  const handleGuardarEdicion = async () => {
    if (!editNombre.trim() || !editApellido.trim()) {
      Alert.alert("Error", "Nombre y apellido son obligatorios.");
      return;
    }
    setGuardandoEdicion(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/actualizar-perfil/${usuario.usuario_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:         editNombre.trim(),
          apellido:       editApellido.trim(),
          peso_kg:        editPeso,
          altura_cm:      editAltura,
          objetivo:       editObjetivo,
          estado_inicial: editEstado,
        })
      });
      const data = await response.json();
      if (data.ok) {
        // Actualiza el contexto global para que se refleje inmediatamente
        setUsuario({
          ...usuario,
          nombre:         editNombre.trim(),
          apellido:       editApellido.trim(),
          peso_kg:        editPeso ? parseFloat(editPeso) : null,
          altura_cm:      editAltura ? parseFloat(editAltura) : null,
          objetivo:       editObjetivo,
          estado_inicial: editEstado,
        });
        setModalEditar(false);
        Alert.alert("✅ Actualizado", "Tu perfil ha sido actualizado correctamente.");
      } else {
        Alert.alert("Error", data.mensaje || "No se pudo actualizar.");
      }
    } catch {
      Alert.alert("Error de conexión", "Verifica que el servidor esté corriendo.");
    } finally {
      setGuardandoEdicion(false);
    }
  };

  const handleEscaneoCorporalPerfil = async () => {
  Alert.alert(
    "Escaneo Corporal IA",
    "¿Cómo quieres subir la imagen?",
    [
      {
        text: "📷 Tomar foto",
        onPress: async () => {
          const permiso = await ImagePicker.requestCameraPermissionsAsync();
          if (!permiso.granted) { Alert.alert("Permiso denegado", "Necesitamos acceso a tu cámara."); return; }
          const res = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
          if (!res.canceled && res.assets[0].base64) await procesarEscaneo(res.assets[0].base64);
        }
      },
      {
        text: "🖼️ Subir imagen",
        onPress: async () => {
          const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permiso.granted) { Alert.alert("Permiso denegado", "Necesitamos acceso a tu galería."); return; }
          const res = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });
          if (!res.canceled && res.assets[0].base64) await procesarEscaneo(res.assets[0].base64);
        }
      },
      { text: "Cancelar", style: "cancel" }
    ]
  );
};

const procesarEscaneo = async (base64: string) => {
  setEscaneandoCorporal(true);
  try {
    const response = await fetch(`${API_URL}/api/auth/escaneo-corporal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagenBase64: base64 })
    });
    const data = await response.json();
    if (data.ok) {
      // Actualizar en la BD
      await fetch(`${API_URL}/api/auth/actualizar-perfil/${usuario.usuario_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:         usuario.nombre,
          apellido:       usuario.apellido,
          peso_kg:        data.peso_kg,
          altura_cm:      data.altura_cm,
          objetivo:       usuario.objetivo,
          estado_inicial: usuario.estado_inicial,
        })
      });
      // Actualizar contexto global inmediatamente
      setUsuario({
        ...usuario,
        peso_kg:   data.peso_kg,
        altura_cm: data.altura_cm,
      });
      Alert.alert(
        "✅ Escaneo completado",
        `Peso estimado: ${data.peso_kg} kg\nAltura estimada: ${data.altura_cm} cm\n\nDatos actualizados en tu perfil.`
      );
    } else {
      Alert.alert("Error", data.mensaje || "No se pudo estimar los datos.");
    }
  } catch {
    Alert.alert("Error de conexión", "Verifica que el servidor esté corriendo.");
  } finally {
    setEscaneandoCorporal(false);
  }
};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>

      {/* Modal de edición */}
      <Modal visible={modalEditar} transparent animationType="slide" onRequestClose={() => setModalEditar(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.mainCard }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textMain }]}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setModalEditar(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Nombre</Text>
              <TextInput
                style={[styles.editInput, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', color: colors.textMain, borderColor: colors.border }]}
                value={editNombre}
                onChangeText={setEditNombre}
                placeholder="Nombre"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Apellido</Text>
              <TextInput
                style={[styles.editInput, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', color: colors.textMain, borderColor: colors.border }]}
                value={editApellido}
                onChangeText={setEditApellido}
                placeholder="Apellido"
                placeholderTextColor={colors.textSecondary}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Peso (kg)</Text>
                  <TextInput
                    style={[styles.editInput, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', color: colors.textMain, borderColor: colors.border }]}
                    value={editPeso}
                    onChangeText={setEditPeso}
                    placeholder="65"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Altura (cm)</Text>
                  <TextInput
                    style={[styles.editInput, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', color: colors.textMain, borderColor: colors.border }]}
                    value={editAltura}
                    onChangeText={setEditAltura}
                    placeholder="170"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Objetivo</Text>
              <TextInput
                style={[styles.editInput, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', color: colors.textMain, borderColor: colors.border }]}
                value={editObjetivo}
                onChangeText={setEditObjetivo}
                placeholder="Ej. Control de glucosa"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Estado Actual</Text>
              <TextInput
                style={[styles.editInput, { backgroundColor: isDark ? '#2d3748' : '#f1f5f9', color: colors.textMain, borderColor: colors.border }]}
                value={editEstado}
                onChangeText={setEditEstado}
                placeholder="Ej. Estable"
                placeholderTextColor={colors.textSecondary}
              />

              <TouchableOpacity
                style={[styles.guardarBtn, guardandoEdicion && { opacity: 0.6 }]}
                onPress={handleGuardarEdicion}
                disabled={guardandoEdicion}
              >
                {guardandoEdicion
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.guardarBtnText}>Guardar cambios</Text>
                }
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerMinimal}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{iniciales}</Text>
          </View>
          <Text style={[styles.userName, { color: colors.textMain }]}>
            {usuario?.nombre || 'Usuario'} {usuario?.apellido || ''}
          </Text>
          <Text style={[styles.userSub, { color: colors.textSecondary }]}>
            {usuario?.correo || ''}
          </Text>
        </View>

        <View style={[styles.mainCard, { backgroundColor: colors.mainCard, marginBottom: 15, paddingVertical: 10 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name={isDark ? "weather-night" : "weather-sunny"} size={20} color={colors.textMain} />
              <Text style={{ marginLeft: 10, color: colors.textMain, fontWeight: '600' }}>Modo Oscuro</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: GLOBAL_COLORS.primaryGreen }}
              thumbColor={isDark ? GLOBAL_COLORS.white : "#f4f3f4"}
              onValueChange={toggleTheme}
              value={isDark}
            />
          </View>
        </View>

        <View style={[styles.mainCard, { backgroundColor: colors.mainCard }]}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Condición Médica</Text>
            <View style={[styles.healthBadge, { backgroundColor: usuario?.tiene_diabetes === 'si' ? '#fef2f2' : GLOBAL_COLORS.healthBadgeBg }]}>
              <MaterialCommunityIcons
                name={usuario?.tiene_diabetes === 'si' ? "alert-circle" : "check-circle"}
                size={20}
                color={usuario?.tiene_diabetes === 'si' ? "#ef4444" : GLOBAL_COLORS.healthBadgeText}
              />
              <Text style={[styles.healthBadgeText, { color: usuario?.tiene_diabetes === 'si' ? "#ef4444" : GLOBAL_COLORS.healthBadgeText }]}>
                {usuario?.tiene_diabetes === 'si' ? `Diabetes ${usuario?.tipo_diabetes || ''}` : 'Salud General'}
              </Text>
            </View>
          </View>

          <View style={styles.proStatsContainer}>
            <View style={styles.proStatItem}>
              <Text style={styles.proStatEmoji}>🎯</Text>
              <Text style={[styles.proStatLabel, { color: colors.textSecondary }]}>Objetivo</Text>
              <Text style={[styles.proStatValue, { color: colors.textMain }]}>{usuario?.objetivo || 'No definido'}</Text>
            </View>
            <View style={styles.proStatItem}>
              <View style={[styles.statusDot, { backgroundColor: GLOBAL_COLORS.statusGreen }]} />
              <Text style={[styles.proStatLabel, { color: colors.textSecondary }]}>Estado</Text>
              <Text style={[styles.proStatValue, { color: GLOBAL_COLORS.statusGreen }]}>{usuario?.estado_inicial || 'Estable'}</Text>
            </View>
            <View style={styles.proStatItem}>
              <Text style={styles.proStatEmoji}>🔥</Text>
              <Text style={[styles.proStatLabel, { color: colors.textSecondary }]}>Racha</Text>
              <Text style={[styles.proStatValue, { color: GLOBAL_COLORS.accentOrange }]}>{usuario?.racha_inicial || 0} Días</Text>
            </View>
          </View>

          <View style={[styles.dividerHorizontal, { backgroundColor: colors.border }]} />

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="weight-kilogram" size={22} color={colors.textSecondary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Peso</Text>
              <Text style={[styles.statValue, { color: colors.textMain }]}>{usuario?.peso_kg ? `${usuario.peso_kg} kg` : '--'}</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="ruler" size={22} color={colors.textSecondary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Estatura</Text>
              <Text style={[styles.statValue, { color: colors.textMain }]}>{usuario?.altura_cm ? `${usuario.altura_cm} cm` : '--'}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
  style={[styles.primaryBtn, escaneandoCorporal && { opacity: 0.6 }]}
  onPress={handleEscaneoCorporalPerfil}
  disabled={escaneandoCorporal}
>
  {escaneandoCorporal
    ? <ActivityIndicator color={GLOBAL_COLORS.white} />
    : <MaterialCommunityIcons name="human-male-height" size={20} color={GLOBAL_COLORS.white} />
  }
  <Text style={styles.primaryBtnText}>
    {escaneandoCorporal ? 'Analizando...' : 'Iniciar Escaneo Corporal'}
  </Text>
</TouchableOpacity>
            {/* ✅ Botón de editar ahora funcional */}
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleAbrirEdicion}>
              <MaterialCommunityIcons name="pencil-outline" size={18} color={GLOBAL_COLORS.primaryGreen} />
              <Text style={styles.secondaryBtnText}>Editar información</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.footerBtn} onPress={() => Alert.alert("Términos y Condiciones", "Documento legal...")}>
            <Text style={[styles.footerBtnText, { color: colors.textSecondary }]}>Términos y Condiciones</Text>
          </TouchableOpacity>
          <View style={[styles.footerDivider, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.footerBtn} onPress={handleLogout}>
            <Text style={[styles.footerBtnText, { color: GLOBAL_COLORS.danger }]}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, alignItems: 'center' },
  headerMinimal: { alignItems: 'center', marginVertical: 20 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: GLOBAL_COLORS.primaryGreen, justifyContent: 'center', alignItems: 'center', marginBottom: 10, elevation: 3 },
  avatarText: { color: GLOBAL_COLORS.white, fontSize: 28, fontWeight: 'bold' },
  userName: { fontSize: 22, fontWeight: 'bold' },
  userSub: { fontSize: 13 },
  mainCard: { width: '100%', borderRadius: 20, padding: 20, elevation: 3 },
  section: { alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' },
  healthBadge: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, alignItems: 'center' },
  healthBadgeText: { fontWeight: 'bold', marginLeft: 8, fontSize: 15 },
  proStatsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, paddingHorizontal: 5 },
  proStatItem: { alignItems: 'center', flex: 1 },
  proStatEmoji: { fontSize: 20, marginBottom: 4 },
  proStatLabel: { fontSize: 10, marginBottom: 2, fontWeight: '500' },
  proStatValue: { fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 10, marginTop: 10 },
  dividerHorizontal: { height: 1, marginVertical: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25 },
  statBox: { alignItems: 'center' },
  statLabel: { fontSize: 12, marginTop: 4 },
  statValue: { fontSize: 16, fontWeight: 'bold' },
  buttonContainer: { gap: 12 },
  primaryBtn: { flexDirection: 'row', backgroundColor: GLOBAL_COLORS.primaryGreen, padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: GLOBAL_COLORS.white, fontWeight: 'bold', marginLeft: 10 },
  secondaryBtn: { flexDirection: 'row', borderWidth: 1, borderColor: GLOBAL_COLORS.primaryGreen, padding: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  secondaryBtnText: { color: GLOBAL_COLORS.primaryGreen, fontWeight: '600', marginLeft: 8 },
  footerActions: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 20, gap: 15 },
  footerBtn: { padding: 5 },
  footerBtnText: { fontSize: 12, textDecorationLine: 'underline' },
  footerDivider: { width: 1, height: 15 },
  // Modal de edición
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  editLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  editInput: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 4 },
  guardarBtn: { backgroundColor: GLOBAL_COLORS.primaryGreen, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20, marginBottom: 10 },
  guardarBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});