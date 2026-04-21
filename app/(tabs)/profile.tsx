import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  primaryGreen: '#00b347',
  bgLight: '#f4f7f6',
  textMain: '#1a2a3a',
  textSecondary: '#64748b',
  white: '#fff',
  border: '#e2e8f0',
  healthBadgeBg: '#fee2e2',
  healthBadgeText: '#b91c1c',
  accentOrange: '#f59e0b',
  statusGreen: '#22c55e',
  danger: '#ef4444',
};

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: () => router.replace('/login') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cabecera Minimalista */}
        <View style={styles.headerMinimal}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>MG</Text>
          </View>
          <Text style={styles.userName}>María González</Text>
          <Text style={styles.userSub}>Usuario desde: Enero 2024</Text>
        </View>

        <View style={styles.mainCard}>
          {/* Condición Médica Visual */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condición Médica</Text>
            <View style={styles.healthBadge}>
              <MaterialCommunityIcons name="alert-decagram" size={20} color={COLORS.healthBadgeText} />
              <Text style={styles.healthBadgeText}>Diabetes tipo 2</Text>
            </View>
          </View>

          {/* Indicadores PRO (Objetivo, Estado, Racha) */}
          <View style={styles.proStatsContainer}>
            <View style={styles.proStatItem}>
              <Text style={styles.proStatEmoji}>🎯</Text>
              <Text style={styles.proStatLabel}>Objetivo</Text>
              <Text style={styles.proStatValue}>Control de Glucosa</Text>
            </View>

            <View style={styles.proStatItem}>
              <View style={[styles.statusDot, { backgroundColor: COLORS.statusGreen }]} />
              <Text style={styles.proStatLabel}>Estado</Text>
              <Text style={[styles.proStatValue, { color: COLORS.statusGreen }]}>Estable</Text>
            </View>

            <View style={styles.proStatItem}>
              <Text style={styles.proStatEmoji}>🔥</Text>
              <Text style={styles.proStatLabel}>Racha</Text>
              <Text style={[styles.proStatValue, { color: COLORS.accentOrange }]}>5 Días</Text>
            </View>
          </View>

          <View style={styles.dividerHorizontal} />

          {/* Datos físicos */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="weight-kilogram" size={22} color={COLORS.textSecondary} />
              <Text style={styles.statLabel}>Peso</Text>
              <Text style={styles.statValue}>65 kg</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="ruler" size={22} color={COLORS.textSecondary} />
              <Text style={styles.statLabel}>Estatura</Text>
              <Text style={styles.statValue}>165 cm</Text>
            </View>
          </View>

          {/* Botones Jerarquizados */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert("Escaneo Corporal")}>
              <MaterialCommunityIcons name="human-male-height" size={20} color={COLORS.white} />
              <Text style={styles.primaryBtnText}>Iniciar Escaneo Corporal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={() => Alert.alert("Editar Datos")}>
              <MaterialCommunityIcons name="pencil-outline" size={18} color={COLORS.primaryGreen} />
              <Text style={styles.secondaryBtnText}>Editar información</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sección de Términos y Cerrar Sesión */}
        <View style={styles.footerActions}>
          <TouchableOpacity 
            style={styles.footerBtn} 
            onPress={() => Alert.alert("Términos y Condiciones", "Documento legal de privacidad y manejo de datos de salud.")}
          >
            <Text style={styles.footerBtnText}>Términos y Condiciones</Text>
          </TouchableOpacity>

          <View style={styles.footerDivider} />

          <TouchableOpacity 
            style={styles.footerBtn} 
            onPress={handleLogout}
          >
            <Text style={[styles.footerBtnText, { color: COLORS.danger }]}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  scrollContent: { padding: 20, alignItems: 'center' },
  headerMinimal: { alignItems: 'center', marginVertical: 20 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryGreen, justifyContent: 'center', alignItems: 'center', marginBottom: 10, elevation: 3 },
  avatarText: { color: COLORS.white, fontSize: 28, fontWeight: 'bold' },
  userName: { fontSize: 22, fontWeight: 'bold', color: COLORS.textMain },
  userSub: { fontSize: 13, color: COLORS.textSecondary },

  mainCard: { width: '100%', backgroundColor: COLORS.white, borderRadius: 20, padding: 20, elevation: 3 },
  section: { alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
  healthBadge: { flexDirection: 'row', backgroundColor: COLORS.healthBadgeBg, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, alignItems: 'center' },
  healthBadgeText: { color: COLORS.healthBadgeText, fontWeight: 'bold', marginLeft: 8, fontSize: 15 },

  proStatsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, paddingHorizontal: 5 },
  proStatItem: { alignItems: 'center', flex: 1 },
  proStatEmoji: { fontSize: 20, marginBottom: 4 },
  proStatLabel: { fontSize: 10, color: COLORS.textSecondary, marginBottom: 2, fontWeight: '500' },
  proStatValue: { fontSize: 12, fontWeight: 'bold', color: COLORS.textMain, textAlign: 'center' },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 10, marginTop: 10 },

  dividerHorizontal: { height: 1, backgroundColor: COLORS.border, marginVertical: 20 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25 },
  statBox: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },

  buttonContainer: { gap: 12 },
  primaryBtn: { flexDirection: 'row', backgroundColor: COLORS.primaryGreen, padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: COLORS.white, fontWeight: 'bold', marginLeft: 10 },
  secondaryBtn: { flexDirection: 'row', borderWidth: 1, borderColor: COLORS.primaryGreen, padding: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  secondaryBtnText: { color: COLORS.primaryGreen, fontWeight: '600', marginLeft: 8 },

  footerActions: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 20, gap: 15 },
  footerBtn: { padding: 5 },
  footerBtnText: { color: COLORS.textSecondary, fontSize: 12, textDecorationLine: 'underline' },
  footerDivider: { width: 1, height: 15, backgroundColor: COLORS.border }
});