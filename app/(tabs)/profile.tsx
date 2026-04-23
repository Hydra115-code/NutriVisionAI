import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { COLORS as GLOBAL_COLORS, useTheme } from '../../context/ThemeContext'; // Ajusta la ruta

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, toggleTheme, colors, isDark } = useTheme();

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: () => router.replace('/login') }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cabecera Minimalista */}
        <View style={styles.headerMinimal}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>MG</Text>
          </View>
          <Text style={[styles.userName, { color: colors.textMain }]}>María González</Text>
          <Text style={[styles.userSub, { color: colors.textSecondary }]}>Usuario desde: Enero 2024</Text>
        </View>

        {/* --- BOTÓN DE MODO OSCURO (Agregado sin romper diseño) --- */}
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
          {/* Condición Médica Visual */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Condición Médica</Text>
            <View style={styles.healthBadge}>
              <MaterialCommunityIcons name="alert-decagram" size={20} color={GLOBAL_COLORS.healthBadgeText} />
              <Text style={styles.healthBadgeText}>Diabetes tipo 2</Text>
            </View>
          </View>

          {/* Indicadores PRO (Objetivo, Estado, Racha) */}
          <View style={styles.proStatsContainer}>
            <View style={styles.proStatItem}>
              <Text style={styles.proStatEmoji}>🎯</Text>
              <Text style={[styles.proStatLabel, { color: colors.textSecondary }]}>Objetivo</Text>
              <Text style={[styles.proStatValue, { color: colors.textMain }]}>Control de Glucosa</Text>
            </View>

            <View style={styles.proStatItem}>
              <View style={[styles.statusDot, { backgroundColor: GLOBAL_COLORS.statusGreen }]} />
              <Text style={[styles.proStatLabel, { color: colors.textSecondary }]}>Estado</Text>
              <Text style={[styles.proStatValue, { color: GLOBAL_COLORS.statusGreen }]}>Estable</Text>
            </View>

            <View style={styles.proStatItem}>
              <Text style={styles.proStatEmoji}>🔥</Text>
              <Text style={[styles.proStatLabel, { color: colors.textSecondary }]}>Racha</Text>
              <Text style={[styles.proStatValue, { color: GLOBAL_COLORS.accentOrange }]}>5 Días</Text>
            </View>
          </View>

          <View style={[styles.dividerHorizontal, { backgroundColor: colors.border }]} />

          {/* Datos físicos */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="weight-kilogram" size={22} color={colors.textSecondary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Peso</Text>
              <Text style={[styles.statValue, { color: colors.textMain }]}>65 kg</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="ruler" size={22} color={colors.textSecondary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Estatura</Text>
              <Text style={[styles.statValue, { color: colors.textMain }]}>165 cm</Text>
            </View>
          </View>

          {/* Botones Jerarquizados */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert("Escaneo Corporal")}>
              <MaterialCommunityIcons name="human-male-height" size={20} color={GLOBAL_COLORS.white} />
              <Text style={styles.primaryBtnText}>Iniciar Escaneo Corporal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={() => Alert.alert("Editar Datos")}>
              <MaterialCommunityIcons name="pencil-outline" size={18} color={GLOBAL_COLORS.primaryGreen} />
              <Text style={styles.secondaryBtnText}>Editar información</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sección de Términos y Cerrar Sesión */}
        <View style={styles.footerActions}>
          <TouchableOpacity 
            style={styles.footerBtn} 
            onPress={() => Alert.alert("Términos y Condiciones", "Documento legal...")}
          >
            <Text style={[styles.footerBtnText, { color: colors.textSecondary }]}>Términos y Condiciones</Text>
          </TouchableOpacity>

          <View style={[styles.footerDivider, { backgroundColor: colors.border }]} />

          <TouchableOpacity 
            style={styles.footerBtn} 
            onPress={handleLogout}
          >
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
  healthBadge: { flexDirection: 'row', backgroundColor: GLOBAL_COLORS.healthBadgeBg, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, alignItems: 'center' },
  healthBadgeText: { color: GLOBAL_COLORS.healthBadgeText, fontWeight: 'bold', marginLeft: 8, fontSize: 15 },

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
  footerDivider: { width: 1, height: 15 }
});