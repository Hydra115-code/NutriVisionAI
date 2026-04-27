import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

const LOCAL_COLORS = {
  primaryGreen: '#00b347',
  lightGreen: '#d1f2eb',
  dangerRed: '#ef4444',
  warningBg: '#fff1f2',
  accentBlue: '#3b82f6',
  white: '#fff',
};


const DATOS_CURIOSOS = [
  "💡 El agua es el único nutriente que no aporta calorías pero es esencial para la vida; ayuda a transportar nutrientes y a eliminar toxinas de los órganos vitales.",
  "🩸 Los pacientes con diabetes tipo 1 producen muy poca o ninguna insulina porque su sistema inmunitario ataca las células beta del páncreas, requiriendo administración externa.",
  "🥦 El brócoli contiene más vitamina C que una naranja por cada 100 gramos, además de sulforafano, un compuesto que ayuda a proteger los vasos sanguíneos del daño causado por el azúcar.",
  "⚡ El cerebro consume aproximadamente el 20% de la energía total del cuerpo, prefiriendo la glucosa como combustible rápido, aunque puede adaptarse a usar cetonas en periodos de ayuno.",
  "🍌 Un plátano maduro tiene más azúcar que uno verde; mientras el verde contiene almidón resistente (fibra), el maduro lo transforma en azúcares simples de absorción rápida.",
  "💪 Las proteínas son bloques de construcción esenciales; consumirlas en el desayuno ayuda a reducir los antojos de azúcar por la tarde al estabilizar las hormonas del hambre.",
  "🫀 El corazón late unas 100,000 veces al día; mantener la glucosa bajo control es vital para prevenir la neuropatía autonómica, que es el daño a los nervios que controlan el ritmo cardíaco.",
  "🥗 La fibra soluble (como la de la avena) crea un gel en el intestino que atrapa parte del azúcar y la grasa, evitando que pasen de golpe al torrente sanguíneo después de comer.",
  "🧠 La glucosa es el combustible principal del cerebro — necesita aproximadamente 120g al día para mantener funciones cognitivas, la memoria y el estado de ánimo estables.",
  "🏃 Caminar 30 minutos al día no solo quema calorías, sino que sensibiliza tus células a la insulina, permitiendo que el azúcar entre al músculo sin necesidad de tanto esfuerzo pancreático.",
  "🫙 El índice glucémico (IG) mide la velocidad de absorción de los carbohidratos; combinar alimentos de IG alto con grasas o proteínas reduce la velocidad de entrada del azúcar a la sangre.",
  "🥚 Un huevo entero es un superalimento con solo 78 calorías; su colina es vital para la salud cerebral y su proteína es la de mayor valor biológico, conteniendo todos los aminoácidos esenciales.",
  "🍎 La pectina, una fibra soluble en la manzana, no solo ralentiza el azúcar, sino que ayuda a reducir el colesterol LDL (malo) al arrastrarlo fuera del sistema digestivo.",
  "💧 Beber 500ml de agua antes de las comidas principales activa la termogénesis y puede aumentar el metabolismo temporalmente, además de mejorar el control de las porciones.",
  "🌿 La canela de Ceilán contiene polifenoles que imitan la acción de la insulina, facilitando que las células de los tejidos periféricos utilicen mejor la glucosa disponible.",
  "🧬 La diabetes tipo 2 tiene un componente genético, pero el estilo de vida (sueño, estrés y dieta) tiene la capacidad de 'encender' o 'apagar' la expresión de esos genes.",
  "🍽️ Comer despacio (masticar 20 veces por bocado) le da tiempo a la hormona leptina de llegar al cerebro, indicando que ya no necesitas más comida y evitando el sobrepeso.",
  "📊 Un nivel normal de glucosa en ayunas es entre 70 y 100 mg/dL; valores constantes por encima de 100 pueden indicar prediabetes, una etapa reversible con cambios de hábitos.",
  "🥑 Las grasas monoinsaturadas del aguacate mejoran la salud del corazón y, al no requerir insulina para procesarse, son la fuente de energía más estable para personas con diabetes.",
  "⏰ Cenar al menos 3 horas antes de dormir mejora el control glucémico matutino, ya que permite que el cuerpo use la energía de la cena antes de entrar en el estado de ayuno nocturno.",
  "🥗 El orden de ingesta es clave: empezar con vegetales (fibra) prepara el intestino; la proteína sigue para dar saciedad, y los carbohidratos al final entran a una red ya filtrada.",
  "🧊 El almidón resistente se crea al enfriar alimentos como el arroz o la pasta; esto reduce su carga glucémica y alimenta a la microbiota, produciendo butirato que desinflama el colon.",
  "🍷 El ácido acético del vinagre de manzana ralentiza la digestión de los almidones complejos en el estómago, lo que resulta en una curva de glucosa mucho más plana después de comer.",
  "😴 La falta de sueño eleva el cortisol, la hormona del estrés, la cual ordena al hígado liberar glucosa almacenada para 'emergencias', elevando tus niveles sin haber comido nada.",
  "🚶‍♂️ El músculo es el mayor consumidor de glucosa; una caminata ligera después de comer utiliza los transportadores GLUT4 para meter azúcar al músculo incluso si hay resistencia a la insulina.",
  "🧂 Reducir la sal es importante, pero priorizar el potasio (presente en espinacas y pistachos) ayuda a equilibrar la presión arterial y mejora la función de las células del páncreas.",
  "🥤 Los refrescos 'Light' o 'Zero' no suben el azúcar, pero su sabor dulce extremo puede confundir al cerebro y aumentar el deseo de comer carbohidratos reales más tarde.",
  "🌰 Los frutos secos como las almendras reducen la respuesta glucémica de la comida completa si se consumen como aperitivo, gracias a su combinación de fibra, grasa y proteína.",
  "🫐 Los arándanos y frutos rojos son ricos en antocianinas, antioxidantes que protegen a las células del páncreas del estrés oxidativo y mejoran la visión en personas con diabetes.",
  "🧘 El estrés crónico mantiene la glucosa alta permanentemente; técnicas de respiración de solo 5 minutos pueden bajar la señal de 'lucha o huida' y ayudar a normalizar el azúcar."
];

import { API_URL } from '../../constants/config';

type Alimento = {
  id: number;
  nombre: string;
  calorias: number;
  proteinas_g: number;
  carbohidratos_g: number;
  grasas_g: number;
  azucar_g: number;
  alertaAzucar: boolean;
};

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { usuario } = useUser() as any;

  const [modalVisible, setModalVisible] = useState(false);
  const [imagenUri, setImagenUri] = useState<string | null>(null);
  const [analizando, setAnalizando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [alimentosDetectados, setAlimentosDetectados] = useState<Alimento[]>([]);
  const [datoAleatorio] = useState(
  DATOS_CURIOSOS[Math.floor(Math.random() * DATOS_CURIOSOS.length)]);

  // Calcula totales del análisis actual
  const totales = alimentosDetectados.reduce((acc, item) => ({
    calorias:      acc.calorias      + item.calorias,
    proteinas:     acc.proteinas     + item.proteinas_g,
    carbohidratos: acc.carbohidratos + item.carbohidratos_g,
    grasas:        acc.grasas        + item.grasas_g,
    azucar:        acc.azucar        + item.azucar_g,
  }), { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, azucar: 0 });

  const hayAlertaAzucar = alimentosDetectados.some(a => a.alertaAzucar);

  const handleGaleria = async () => {
  const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permiso.granted) {
    Alert.alert("Permiso denegado", "Necesitamos acceso a tu galería.");
    return;
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    base64: true,
    quality: 0.7,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });

  if (resultado.canceled || !resultado.assets[0].base64) return;

  const asset = resultado.assets[0];
  setImagenUri(asset.uri);
  setAnalizando(true);

  try {
    const response = await fetch(`${API_URL}/api/auth/analizar-imagen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagenBase64: asset.base64 })
    });
    const data = await response.json();
    if (data.ok && data.alimentos) {
      setAlimentosDetectados(prev => {
        const nuevos = data.alimentos.map((a: any, i: number) => ({
          ...a,
          id: prev.length + i + 1
        }));
        return [...prev, ...nuevos];
      });
      const tieneAlerta = data.alimentos.some((a: Alimento) => a.alertaAzucar);
      if (tieneAlerta) setModalVisible(true);
    } else {
      Alert.alert("Error", "No se pudo analizar la imagen. Intenta de nuevo.");
    }
    } catch (error) {
    Alert.alert("Error de conexión", "Verifica que el servidor esté corriendo.");
    } finally {
    setAnalizando(false);
    }
    };

  // Convierte imagen a base64 y llama al backend
  const handleScan = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert("Permiso denegado", "Necesitamos acceso a tu cámara.");
      return;
    }

  

    const resultado = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.7,
    });

    if (resultado.canceled || !resultado.assets[0].base64) return;

    const asset = resultado.assets[0];
    setImagenUri(asset.uri);
    setAnalizando(true);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/analizar-imagen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagenBase64: asset.base64 })
      });

      const data = await response.json();

      if (data.ok && data.alimentos) {
        setAlimentosDetectados(prev => {
          const nuevos = data.alimentos.map((a: any, i: number) => ({
            ...a,
            id: prev.length + i + 1
          }));
          return [...prev, ...nuevos];
        });

        // Mostrar alerta si hay azúcar alta
        const tieneAlerta = data.alimentos.some((a: Alimento) => a.alertaAzucar);
        if (tieneAlerta) setModalVisible(true);
      } else {
        Alert.alert("Error", "No se pudo analizar la imagen. Intenta de nuevo.");
      }

    } catch (error) {
      Alert.alert("Error de conexión", "Verifica que el servidor esté corriendo.");
    } finally {
      setAnalizando(false);
    }
  };

  const handleGuardar = async () => {
    if (alimentosDetectados.length === 0) {
      Alert.alert("Sin datos", "Primero escanea un alimento.");
      return;
    }

    if (!usuario?.usuario_id) {
      Alert.alert("Error", "No se encontró el usuario.");
      return;
    }

    setGuardando(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/guardar-consumo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuario.usuario_id,
          alimentos: alimentosDetectados
        })
      });

      const data = await response.json();

      if (data.ok) {
        Alert.alert("✅ Guardado", "Tu registro fue guardado correctamente.");
        setAlimentosDetectados([]);
        setImagenUri(null);
      } else {
        Alert.alert("Error", data.mensaje || "No se pudo guardar.");
      }

    } catch (error) {
      Alert.alert("Error de conexión", "Verifica que el servidor esté corriendo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>

      {/* Modal de advertencia de azúcar */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.mainCard }]}>
            <Ionicons name="warning" size={50} color={LOCAL_COLORS.dangerRed} />
            <Text style={styles.modalTitle}>¡ADVERTENCIA CRÍTICA!</Text>
            <Text style={[styles.modalDescription, { color: colors.textMain }]}>
              Se detectó un nivel de azúcar alto en uno o más alimentos.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Encabezado */}
        <View style={[styles.topHeader, { backgroundColor: isDark ? '#1e293b' : LOCAL_COLORS.lightGreen }]}>
          <Text style={[styles.topHeaderText, { color: colors.textMain }]}>Escaneo</Text>
        </View>

        {/* Sección Cámara */}
        <View style={styles.headerSection}>
          <View style={styles.subHeaderGreen}>
            <Text style={styles.subHeaderText}>Análisis nutricional en tiempo real</Text>
          </View>

          {/* Imagen tomada o placeholder */}
          {imagenUri ? (
            <Image source={{ uri: imagenUri }} style={styles.foodImage} />
          ) : (
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500' }}
              style={styles.foodImage}
            />
          )}

          {/* Dos botones: cámara y galería */}
          <View style={styles.botonesEscaneo}>
          <TouchableOpacity
          style={[styles.scanButton, { flex: 1 }]}
          onPress={handleScan}
          disabled={analizando}
          >
          {analizando ? (
          <>
          <ActivityIndicator color={LOCAL_COLORS.white} />
         <Text style={styles.scanButtonText}>Analizando...</Text>
          </>
        ) : (
          <>
        <Ionicons name="camera" size={22} color={LOCAL_COLORS.white} />
        <Text style={styles.scanButtonText}>Tomar foto</Text>
          </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
        style={[styles.scanButton, { flex: 1, backgroundColor: '#059669' }]}
       onPress={handleGaleria}
       disabled={analizando}
        >
    <Ionicons name="images" size={22} color={LOCAL_COLORS.white} />
    <Text style={styles.scanButtonText}>Galería</Text>
  </TouchableOpacity>
</View>

{/* Dato curioso mientras analiza */}
{analizando && (
  <View style={[styles.datoCuriosoCard, { backgroundColor: isDark ? '#1e293b' : '#f0fdf4' }]}>
    <Text style={[styles.datoCuriosoTexto, { color: isDark ? '#86efac' : '#166534' }]}>
      {datoAleatorio}
    </Text>
  </View>
)}
        </View>

        {/* Estado vacío — usuario nuevo sin escaneos */}
        {alimentosDetectados.length === 0 && !analizando && (
          <View style={[styles.emptyCard, { backgroundColor: colors.mainCard }]}>
            <Ionicons name="restaurant-outline" size={48} color={LOCAL_COLORS.primaryGreen} />
            <Text style={[styles.emptyTitle, { color: colors.textMain }]}>¡Empieza a escanear!</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Toma una foto de tu platillo y la IA detectará los alimentos y sus valores nutricionales.
            </Text>
          </View>
        )}

        {/* Resultados del análisis */}
        {alimentosDetectados.length > 0 && (
          <>
            {/* Alerta de azúcar */}
            {hayAlertaAzucar && (
              <View style={[styles.alertCard, { backgroundColor: isDark ? '#2c1a1a' : LOCAL_COLORS.warningBg }]}>
                <Ionicons name="warning-outline" size={24} color={LOCAL_COLORS.dangerRed} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>ALERTA: Nivel de azúcar ALTO</Text>
                  <Text style={[styles.alertDescription, { color: colors.textMain }]}>
                    Se detectó un nivel elevado de azúcar. Consumir con precaución.
                  </Text>
                </View>
              </View>
            )}

            {/* Desglose Total */}
            <View style={[styles.whiteCard, { backgroundColor: colors.mainCard }]}>
              <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Desglose Total</Text>
              <View style={styles.grid}>
                <View style={[styles.gridItem, { backgroundColor: isDark ? '#2d3748' : '#fcfcfc', borderColor: colors.border }]}>
                  <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Calorías</Text>
                  <Text style={[styles.gridValue, { color: LOCAL_COLORS.primaryGreen }]}>{totales.calorias.toFixed(0)} kcal</Text>
                </View>
                <View style={[styles.gridItem, { backgroundColor: isDark ? '#2d3748' : '#fcfcfc', borderColor: colors.border }]}>
                  <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Carbohidratos</Text>
                  <Text style={[styles.gridValue, { color: LOCAL_COLORS.accentBlue }]}>{totales.carbohidratos.toFixed(1)} g</Text>
                </View>
                <View style={[styles.gridItem, { backgroundColor: isDark ? '#2d3748' : '#fcfcfc', borderColor: colors.border }]}>
                  <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Azúcares</Text>
                  <Text style={[styles.gridValue, { color: LOCAL_COLORS.dangerRed }]}>{totales.azucar.toFixed(1)} g</Text>
                </View>
                <View style={[styles.gridItem, { backgroundColor: isDark ? '#2d3748' : '#fcfcfc', borderColor: colors.border }]}>
                  <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Proteínas</Text>
                  <Text style={[styles.gridValue, { color: '#a855f7' }]}>{totales.proteinas.toFixed(1)} g</Text>
                </View>
              </View>
            </View>

            {/* Alimentos Detectados */}
            <View style={[styles.whiteCard, { backgroundColor: colors.mainCard }]}>
              <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Alimentos detectados</Text>
              {alimentosDetectados.map((item, index) => (
                <View key={item.id} style={[styles.itemDetail, { borderTopColor: colors.border }, index === 0 ? { borderTopWidth: 0 } : null]}>
                  <View style={styles.itemTitleRow}>
                    <View style={styles.idBox}><Text style={styles.idText}>{item.id}</Text></View>
                    <Text style={[styles.itemName, { color: colors.textMain }]}>{item.nombre}</Text>
                  </View>
                  <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calorías</Text>
                      <Text style={[styles.statValue, { color: colors.textMain }]}>{item.calorias} kcal</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Proteínas</Text>
                      <Text style={[styles.statValue, { color: colors.textMain }]}>{item.proteinas_g} g</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Grasas</Text>
                      <Text style={[styles.statValue, { color: colors.textMain }]}>{item.grasas_g} g</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Azúcares</Text>
                      <Text style={[styles.statValue, { color: colors.textMain }, item.alertaAzucar ? { color: LOCAL_COLORS.dangerRed } : null]}>
                        {item.azucar_g} g
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Botón Guardar */}
            <TouchableOpacity style={styles.saveButton} onPress={handleGuardar} disabled={guardando}>
              {guardando ? (
                <ActivityIndicator color={LOCAL_COLORS.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color={LOCAL_COLORS.white} />
                  <Text style={styles.saveButtonText}>Guardar registro diario</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  topHeader: { padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  topHeaderText: { fontWeight: 'bold' },
  headerSection: { backgroundColor: LOCAL_COLORS.primaryGreen, borderRadius: 15, overflow: 'hidden', marginBottom: 20 },
  subHeaderGreen: { padding: 10, alignItems: 'center' },
  subHeaderText: { color: LOCAL_COLORS.white, fontWeight: '600' },
  foodImage: { width: '100%', height: 160 },
  scanButton: { flexDirection: 'row', backgroundColor: LOCAL_COLORS.primaryGreen, padding: 15, justifyContent: 'center', alignItems: 'center', gap: 10 },
  scanButtonText: { color: LOCAL_COLORS.white, fontWeight: 'bold', marginLeft: 10 },

  // Estado vacío
  emptyCard: { borderRadius: 15, padding: 30, marginBottom: 20, alignItems: 'center', elevation: 3 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 8 },
  emptySubtitle: { fontSize: 13, textAlign: 'center', lineHeight: 20 },

  alertCard: { flexDirection: 'row', borderWidth: 1, borderColor: LOCAL_COLORS.dangerRed, borderRadius: 10, padding: 15, marginBottom: 20, borderLeftWidth: 5 },
  alertContent: { marginLeft: 10, flex: 1 },
  alertTitle: { color: LOCAL_COLORS.dangerRed, fontWeight: 'bold', fontSize: 13 },
  alertDescription: { fontSize: 12 },
  whiteCard: { borderRadius: 15, padding: 15, marginBottom: 20, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1 },
  gridLabel: { fontSize: 12 },
  gridValue: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  itemDetail: { borderTopWidth: 1, paddingTop: 15, marginTop: 10 },
  itemTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  idBox: { backgroundColor: LOCAL_COLORS.accentBlue, width: 22, height: 22, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  idText: { color: LOCAL_COLORS.white, fontWeight: 'bold', fontSize: 12 },
  itemName: { fontSize: 15, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { flex: 1 },
  statLabel: { fontSize: 10 },
  statValue: { fontSize: 12, fontWeight: '700' },
  saveButton: { flexDirection: 'row', backgroundColor: LOCAL_COLORS.primaryGreen, padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 40, gap: 10 },
  saveButtonText: { color: LOCAL_COLORS.white, fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: LOCAL_COLORS.dangerRed, marginTop: 10, textAlign: 'center' },
  modalDescription: { fontSize: 14, marginVertical: 15, textAlign: 'center' },
  modalButton: { backgroundColor: LOCAL_COLORS.dangerRed, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10, width: '100%', alignItems: 'center' },
  modalButtonText: { color: LOCAL_COLORS.white, fontWeight: 'bold', fontSize: 16 },
  botonesEscaneo: { flexDirection: 'row', gap: 1 },
datoCuriosoCard: { padding: 15, margin: 10, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#00b347' },
datoCuriosoTexto: { fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
});