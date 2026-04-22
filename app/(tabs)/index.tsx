import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const COLORS = {
  primaryGreen: '#00b347',
  lightGreen: '#d1f2eb',
  dangerRed: '#ef4444',
  warningBg: '#fff1f2',
  textMain: '#1a2a3a',
  textSec: '#64748b',
  white: '#fff',
  bgLight: '#f8f9fa',
  accentBlue: '#3b82f6',
  orangeFats: '#f59e0b',
};

export default function HomeScreen() {
  // Estado para controlar la visibilidad del Pop-up (QA-01)
  const [modalVisible, setModalVisible] = useState(true);

  const handleScan = () => {
    Alert.alert("Cámara", "Iniciando escaneo...");
  };

  const handleSave = () => {
    Alert.alert("Éxito", "El registro ha sido guardado correctamente.");
  };

  const alimentosDetectados = [
    {
      id: 1,
      nombre: 'Pechuga de pollo',
      calorias: '165 kcal',
      carbohidratos: '0 g',
      proteinas: '31 g',
      grasas: '3.6 g',
      azucares: '0 g'
    },
    {
      id: 2,
      nombre: 'Arroz blanco',
      calorias: '130 kcal',
      carbohidratos: '28 g',
      proteinas: '2.7 g',
      grasas: '0.3 g',
      azucares: '15.2 g',
      alertaAzucar: true
    }
  ];

  return (
    <SafeAreaView style={styles.container}>

      {/* --- IMPLEMENTACIÓN POP-UP (MODAL) QA-01 --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="warning" size={50} color={COLORS.dangerRed} />
            <Text style={styles.modalTitle}>¡ADVERTENCIA CRÍTICA!</Text>
            <Text style={styles.modalDescription}>
              Se detectó un nivel de azúcar alto (15.2 g).
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Encabezado */}
        <View style={styles.topHeader}>
          <Text style={styles.topHeaderText}>Escaneo</Text>
        </View>

        {/* Sección Cámara */}
        <View style={styles.headerSection}>
          <View style={styles.subHeaderGreen}>
            <Text style={styles.subHeaderText}>Análisis nutricional en tiempo real</Text>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500' }} 
            style={styles.foodImage} 
          />
          <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
            <Ionicons name="camera" size={24} color={COLORS.white} />
            <Text style={styles.scanButtonText}>Tomar foto y analizar</Text>
          </TouchableOpacity>
        </View>

        {/* Alerta de Azúcar */}
        <View style={styles.alertCard}>
          <Ionicons name="warning-outline" size={24} color={COLORS.dangerRed} />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>ALERTA: Nivel de azúcar ALTO</Text>
            <Text style={styles.alertDescription}>
              Se detectó un nivel elevado de azúcar. Consumir con precaución.
            </Text>
          </View>
        </View>

        {/* Desglose Total */}
        <View style={styles.whiteCard}>
          <Text style={styles.sectionTitle}>Desglose Total</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}><Text style={styles.gridLabel}>Calorías</Text><Text style={[styles.gridValue, {color: COLORS.primaryGreen}]}>295 kcal</Text></View>
            <View style={styles.gridItem}><Text style={styles.gridLabel}>Carbohidratos</Text><Text style={[styles.gridValue, {color: COLORS.accentBlue}]}>28 g</Text></View>
            <View style={styles.gridItem}><Text style={styles.gridLabel}>Azúcares</Text><Text style={[styles.gridValue, {color: COLORS.dangerRed}]}>15.2 g</Text></View>
            <View style={styles.gridItem}><Text style={styles.gridLabel}>Proteínas</Text><Text style={[styles.gridValue, {color: '#a855f7'}]}>33.7 g</Text></View>
          </View>
        </View>

        {/* Alimentos Detectados */}
        <View style={styles.whiteCard}>
          <Text style={styles.sectionTitle}>Alimentos detectados</Text>
          
          {alimentosDetectados.map((item, index) => (
            <View key={item.id} style={[styles.itemDetail, index === 0 ? { borderTopWidth: 0 } : null]}>
              <View style={styles.itemTitleRow}>
                <View style={styles.idBox}><Text style={styles.idText}>{item.id}</Text></View>
                <Text style={styles.itemName}>{item.nombre}</Text>
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Calorías</Text>
                  <Text style={styles.statValue}>{item.calorias}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Proteínas</Text>
                  <Text style={styles.statValue}>{item.proteinas}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Grasas</Text>
                  <Text style={styles.statValue}>{item.grasas}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Azúcares</Text>
                  <Text style={[styles.statValue, item.alertaAzucar ? {color: COLORS.dangerRed} : null]}>
                    {item.azucares}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
          <Text style={styles.saveButtonText}>Guardar registro diario</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  scrollContent: { padding: 20 },
  topHeader: { backgroundColor: COLORS.lightGreen, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  topHeaderText: { color: COLORS.textMain, fontWeight: 'bold' },
  headerSection: { backgroundColor: COLORS.primaryGreen, borderRadius: 15, overflow: 'hidden', marginBottom: 20 },
  subHeaderGreen: { padding: 10, alignItems: 'center' },
  subHeaderText: { color: COLORS.white, fontWeight: '600' },
  foodImage: { width: '100%', height: 160 },
  scanButton: { flexDirection: 'row', backgroundColor: COLORS.primaryGreen, padding: 15, justifyContent: 'center', alignItems: 'center' },
  scanButtonText: { color: COLORS.white, fontWeight: 'bold', marginLeft: 10 },
  alertCard: { flexDirection: 'row', backgroundColor: COLORS.warningBg, borderWidth: 1, borderColor: COLORS.dangerRed, borderRadius: 10, padding: 15, marginBottom: 20, borderLeftWidth: 5 },
  alertContent: { marginLeft: 10, flex: 1 },
  alertTitle: { color: COLORS.dangerRed, fontWeight: 'bold', fontSize: 13 },
  alertDescription: { color: COLORS.textMain, fontSize: 12 },
  whiteCard: { backgroundColor: COLORS.white, borderRadius: 15, padding: 15, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', padding: 10, borderRadius: 8, marginBottom: 10, backgroundColor: '#fcfcfc', borderWidth: 1, borderColor: '#f0f0f0' },
  gridLabel: { fontSize: 12, color: COLORS.textSec },
  gridValue: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  itemDetail: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 15, marginTop: 10 },
  itemTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  idBox: { backgroundColor: COLORS.accentBlue, width: 22, height: 22, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  idText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 },
  itemName: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { flex: 1 },
  statLabel: { fontSize: 10, color: COLORS.textSec },
  statValue: { fontSize: 12, fontWeight: '700', color: COLORS.textMain },
  saveButton: { flexDirection: 'row', backgroundColor: COLORS.primaryGreen, padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 40 },
  saveButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16, marginLeft: 10 },

  // --- ESTILOS DEL MODAL QA-01 ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)', // Oscurece el fondo
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dangerRed,
    marginTop: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: COLORS.textMain,
    marginVertical: 15,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: COLORS.dangerRed,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});