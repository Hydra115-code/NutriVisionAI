import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
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
  View,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useScanner } from '../../hooks/useScanner';
import { useAccessibility } from '../../context/AccessibilityContext';

const { height: screenHeight } = Dimensions.get('window');

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

function getPersonalizedTip(usuario: any) {
  if (!usuario) return "💡 Tip: Registra tu primera comida para comenzar a monitorear tus nutrientes.";
  
  const obj = usuario.objetivo?.toLowerCase() || '';
  if (usuario.tiene_diabetes === 'si') {
     if (obj.includes('peso')) {
        return "🍏 Tip para ti: Aumentar la ingesta de vegetales crucíferos y fibra soluble te ayudará a controlar la glucosa y a promover la pérdida de peso al mismo tiempo.";
     }
     return "🩺 Tip para ti: Mantén tus porciones de carbohidratos controladas y combínalas siempre con proteína o grasas saludables para evitar picos de azúcar.";
  } else {
     if (obj.includes('peso') || obj.includes('grasa')) {
        return "🏋️ Tip para ti: Prioriza proteínas en tu desayuno; esto estabiliza la grelina (hormona del hambre) y reduce la ansiedad por la tarde.";
     }
     if (obj.includes('masa') || obj.includes('músculo') || obj.includes('musculo')) {
        return "🥩 Tip para ti: Asegúrate de consumir suficientes proteínas y carbohidratos complejos en la ventana post-entrenamiento para optimizar la síntesis muscular.";
     }
     return "💡 Tip para ti: Recuerda que beber agua antes de cada comida mejora la digestión y acelera ligeramente tu metabolismo basal.";
  }
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { usuario } = useUser() as any;
  const { fontScale, highContrast, boldText } = useAccessibility();

  const [modalVisible, setModalVisible] = useState(false);
  const [datoAleatorio, setDatoAleatorio] = useState(DATOS_CURIOSOS[0]);

  const {
    alimentosDetectados,
    imagenUri,
    analizando,
    guardando,
    handleScan,
    handleGaleria,
    handleGuardar,
  } = useScanner();

  // Animación del escáner
  const scannerAnim = useRef(new Animated.Value(0)).current;
  // Animación de pulso para botones
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Activar animación de pulso si tiene diabetes para resaltar los llamados a la acción
    if (usuario?.tiene_diabetes === 'si') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ).start();
    }
  }, [usuario?.tiene_diabetes, pulseAnim]);

  React.useEffect(() => {
    if (alimentosDetectados.some((a: any) => a.alertaAzucar)) {
      setModalVisible(true);
    }
  }, [alimentosDetectados]);

  React.useEffect(() => {
    if (analizando) {
      setDatoAleatorio(DATOS_CURIOSOS[Math.floor(Math.random() * DATOS_CURIOSOS.length)]);
      Animated.loop(
        Animated.sequence([
          Animated.timing(scannerAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scannerAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      scannerAnim.setValue(0);
      scannerAnim.stopAnimation();
    }
  }, [analizando, scannerAnim]);

  const scannerTranslateY = scannerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenHeight * 0.5] // altura máxima aproximada de la imagen en el modal
  });

  const totales = alimentosDetectados.reduce((acc, item) => ({
    calorias: acc.calorias + item.calorias,
    proteinas: acc.proteinas + item.proteinas_g,
    carbohidratos: acc.carbohidratos + item.carbohidratos_g,
    grasas: acc.grasas + item.grasas_g,
    azucar: acc.azucar + item.azucar_g,
  }), { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, azucar: 0 });

  const hayAlertaAzucar = alimentosDetectados.some((a: any) => a.alertaAzucar);

  const onGuardar = async () => {
    if (usuario?.usuario_id) {
      await handleGuardar(usuario.usuario_id);
    } else {
      Alert.alert("Error", "No se encontró el usuario.");
    }
  };

  // ESTILOS DINÁMICOS
  const effectiveBorder = highContrast ? (isDark ? '#fff' : '#000') : colors.border;
  const dynText = { fontSize: 14 * fontScale, fontWeight: boldText ? 'bold' as const : 'normal' as const };
  const dynTitle = { fontSize: 18 * fontScale, fontWeight: boldText ? '900' as const : 'bold' as const };
  const dynLarge = { fontSize: 24 * fontScale, fontWeight: boldText ? '900' as const : 'bold' as const };
  const dynSmall = { fontSize: 12 * fontScale, fontWeight: boldText ? 'bold' as const : 'normal' as const };

  const tipPersonalizado = getPersonalizedTip(usuario);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>

      {/* Modal de escaneo en pantalla completa (ANIMADO) */}
      <Modal animationType="fade" transparent={false} visible={analizando} onRequestClose={() => {}}>
        <View style={[styles.scanningModalContainer, { backgroundColor: colors.bg }]}>
          <Text style={[styles.scanningTitle, { color: colors.textMain }, dynLarge]}>Procesando con IA...</Text>
          <View style={styles.scanningImageContainer}>
            {imagenUri ? (
              <Image source={{ uri: imagenUri }} style={styles.scanningImage} resizeMode="cover" />
            ) : (
              <View style={styles.scanningPlaceholder} />
            )}
            {/* Láser verde animado */}
            <Animated.View style={[styles.laserLine, { transform: [{ translateY: scannerTranslateY }] }]} />
          </View>
          <View style={[styles.datoCuriosoCard, { backgroundColor: isDark ? '#1e293b' : '#f0fdf4', borderColor: effectiveBorder }]}>
            <Text style={[styles.datoCuriosoTexto, { color: isDark ? '#86efac' : '#166534' }, dynText]}>
              {datoAleatorio}
            </Text>
          </View>
          <ActivityIndicator size="large" color={LOCAL_COLORS.primaryGreen} style={{ marginTop: 20 }} />
        </View>
      </Modal>

      {/* Modal de advertencia de azúcar */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.mainCard, borderColor: effectiveBorder, borderWidth: highContrast ? 2 : 0 }]}>
            <Ionicons name="warning" size={50 * fontScale} color={LOCAL_COLORS.dangerRed} />
            <Text style={[styles.modalTitle, dynTitle]}>¡ADVERTENCIA CRÍTICA!</Text>
            <Text style={[styles.modalDescription, { color: colors.textMain }, dynText]}>
              Se detectó un nivel de azúcar alto en uno o más alimentos.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalButtonText, dynText, { color: '#fff' }]}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={[styles.topHeader, { backgroundColor: isDark ? '#1e293b' : LOCAL_COLORS.lightGreen, borderColor: effectiveBorder, borderWidth: highContrast ? 1 : 0 }]}>
          <Text style={[styles.topHeaderText, { color: colors.textMain }, dynTitle]}>NutriVision AI</Text>
        </View>

        {/* Sección Inicial (antes de escanear) */}
        {alimentosDetectados.length === 0 && !analizando && (
          <View style={{ marginBottom: 20 }}>
            {/* Tarjeta de Tips Personalizados */}
            <View style={[styles.tipCard, { backgroundColor: isDark ? '#2d3748' : '#e0f2fe', borderColor: effectiveBorder, borderWidth: highContrast ? 2 : 0 }]}>
              <View style={styles.tipHeader}>
                <Ionicons name="medical" size={24 * fontScale} color={LOCAL_COLORS.primaryGreen} />
                <Text style={[styles.tipTitle, { color: colors.textMain }, dynTitle]}>Recomendación para ti</Text>
              </View>
              <Text style={[{ color: colors.textMain, marginTop: 10 }, dynText]}>
                {tipPersonalizado}
              </Text>
            </View>

            <View style={[styles.emptyCard, { backgroundColor: colors.mainCard, borderColor: effectiveBorder, borderWidth: highContrast ? 1 : 0 }]}>
              <Ionicons name="camera-outline" size={60 * fontScale} color={LOCAL_COLORS.primaryGreen} />
              <Text style={[styles.emptyTitle, { color: colors.textMain }, dynTitle]}>¡Empieza a escanear!</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }, dynText]}>
                Toma una foto de tu platillo para detectar calorías, macronutrientes y alertas de azúcar instantáneamente.
              </Text>
              
              <View style={styles.botonesEscaneoHome}>
                <AnimatedTouchableOpacity style={[styles.scanButtonBig, { backgroundColor: LOCAL_COLORS.primaryGreen, transform: [{ scale: pulseAnim }] }]} onPress={handleScan}>
                  <Ionicons name="camera" size={24 * fontScale} color={LOCAL_COLORS.white} />
                  <Text style={[styles.scanButtonText, dynText]}>Tomar foto</Text>
                </AnimatedTouchableOpacity>
                <TouchableOpacity style={[styles.scanButtonBig, { backgroundColor: '#059669', marginTop: 10 }]} onPress={handleGaleria}>
                  <Ionicons name="images" size={24 * fontScale} color={LOCAL_COLORS.white} />
                  <Text style={[styles.scanButtonText, dynText]}>Galería</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Resultados del análisis */}
        {alimentosDetectados.length > 0 && !analizando && (
          <>
            <View style={[styles.botonesEscaneoResumen]}>
                <TouchableOpacity style={[styles.scanButton, { flex: 1 }]} onPress={handleScan}>
                  <Ionicons name="camera" size={18 * fontScale} color={LOCAL_COLORS.white} />
                  <Text style={[styles.scanButtonText, dynSmall]}>Escanear de nuevo</Text>
                </TouchableOpacity>
            </View>

            {hayAlertaAzucar && (
              <View style={[styles.alertCard, { backgroundColor: isDark ? '#2c1a1a' : LOCAL_COLORS.warningBg, borderColor: LOCAL_COLORS.dangerRed }]}>
                <Ionicons name="warning-outline" size={24 * fontScale} color={LOCAL_COLORS.dangerRed} />
                <View style={styles.alertContent}>
                  <Text style={[styles.alertTitle, dynText]}>ALERTA: Nivel de azúcar ALTO</Text>
                  <Text style={[styles.alertDescription, { color: colors.textMain }, dynSmall]}>
                    Se detectó un nivel elevado de azúcar. Consumir con precaución.
                  </Text>
                </View>
              </View>
            )}

            {/* Desglose Total */}
            <View style={[styles.whiteCard, { backgroundColor: colors.mainCard, borderColor: effectiveBorder, borderWidth: highContrast ? 1 : 0 }]}>
              <Text style={[styles.sectionTitle, { color: colors.textMain }, dynTitle]}>Desglose Total</Text>
              <View style={styles.grid}>
                <View style={[styles.gridItem, { backgroundColor: isDark ? '#2d3748' : '#fcfcfc', borderColor: effectiveBorder }]}>
                  <Text style={[styles.gridLabel, { color: colors.textSecondary }, dynSmall]}>Calorías</Text>
                  <Text style={[styles.gridValue, { color: LOCAL_COLORS.primaryGreen }, dynTitle]}>{totales.calorias.toFixed(0)} kcal</Text>
                </View>
                <View style={[styles.gridItem, { backgroundColor: isDark ? '#2d3748' : '#fcfcfc', borderColor: effectiveBorder }]}>
                  <Text style={[styles.gridLabel, { color: colors.textSecondary }, dynSmall]}>Carbohidratos</Text>
                  <Text style={[styles.gridValue, { color: LOCAL_COLORS.accentBlue }, dynTitle]}>{totales.carbohidratos.toFixed(1)} g</Text>
                </View>
                <View style={[styles.gridItem, { backgroundColor: isDark ? '#2d3748' : '#fcfcfc', borderColor: effectiveBorder }]}>
                  <Text style={[styles.gridLabel, { color: colors.textSecondary }, dynSmall]}>Azúcares</Text>
                  <Text style={[styles.gridValue, { color: LOCAL_COLORS.dangerRed }, dynTitle]}>{totales.azucar.toFixed(1)} g</Text>
                </View>
                <View style={[styles.gridItem, { backgroundColor: isDark ? '#2d3748' : '#fcfcfc', borderColor: effectiveBorder }]}>
                  <Text style={[styles.gridLabel, { color: colors.textSecondary }, dynSmall]}>Proteínas</Text>
                  <Text style={[styles.gridValue, { color: '#a855f7' }, dynTitle]}>{totales.proteinas.toFixed(1)} g</Text>
                </View>
              </View>
            </View>

            {/* Tip Nutricional Basado en el Escaneo */}
            <View style={[styles.tipCard, { backgroundColor: isDark ? '#374151' : '#fef3c7', borderColor: effectiveBorder, borderWidth: highContrast ? 2 : 0 }]}>
              <View style={styles.tipHeader}>
                <Ionicons name="bulb" size={24 * fontScale} color="#d97706" />
                <Text style={[styles.tipTitle, { color: colors.textMain }, dynTitle]}>Conclusión Nutricional</Text>
              </View>
              <Text style={[{ color: colors.textMain, marginTop: 10 }, dynText]}>
                {totales.azucar > 15 && usuario?.tiene_diabetes === 'si'
                  ? "Atención: Este platillo es alto en azúcar para tu objetivo de control de diabetes. Te recomendamos combinarlo con grasas o proteínas para aplanar la curva glucémica."
                  : totales.proteinas > 20
                  ? "¡Excelente porción de proteína! Te mantendrá saciado por más tiempo y es perfecto para tus músculos."
                  : tipPersonalizado
                }
              </Text>
            </View>

            {/* Alimentos Detectados */}
            <View style={[styles.whiteCard, { backgroundColor: colors.mainCard, borderColor: effectiveBorder, borderWidth: highContrast ? 1 : 0 }]}>
              <Text style={[styles.sectionTitle, { color: colors.textMain }, dynTitle]}>Alimentos detectados</Text>
              {alimentosDetectados.map((item, index) => (
                <View key={item.id} style={[styles.itemDetail, { borderTopColor: effectiveBorder }, index === 0 ? { borderTopWidth: 0 } : null]}>
                  <View style={styles.itemTitleRow}>
                    <View style={styles.idBox}><Text style={[styles.idText, dynSmall]}>{item.id}</Text></View>
                    <Text style={[styles.itemName, { color: colors.textMain }, dynText]}>{item.nombre}</Text>
                  </View>
                  <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }, dynSmall]}>Calorías</Text>
                      <Text style={[styles.statValue, { color: colors.textMain }, dynText]}>{item.calorias} kcal</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }, dynSmall]}>Proteínas</Text>
                      <Text style={[styles.statValue, { color: colors.textMain }, dynText]}>{item.proteinas_g} g</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }, dynSmall]}>Grasas</Text>
                      <Text style={[styles.statValue, { color: colors.textMain }, dynText]}>{item.grasas_g} g</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }, dynSmall]}>Azúcares</Text>
                      <Text style={[styles.statValue, { color: colors.textMain }, dynText, item.alertaAzucar ? { color: LOCAL_COLORS.dangerRed } : null]}>
                        {item.azucar_g} g
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Botón Guardar */}
            <AnimatedTouchableOpacity style={[styles.saveButton, { transform: [{ scale: pulseAnim }] }]} onPress={onGuardar} disabled={guardando}>
              {guardando ? (
                <ActivityIndicator color={LOCAL_COLORS.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24 * fontScale} color={LOCAL_COLORS.white} />
                  <Text style={[styles.saveButtonText, dynText]}>Guardar registro diario</Text>
                </>
              )}
            </AnimatedTouchableOpacity>
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
  
  tipCard: { padding: 20, borderRadius: 15, marginBottom: 20, elevation: 2 },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tipTitle: { fontWeight: 'bold' },

  emptyCard: { borderRadius: 15, padding: 30, marginBottom: 20, alignItems: 'center', elevation: 3 },
  emptyTitle: { marginTop: 15, marginBottom: 8 },
  emptySubtitle: { textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  botonesEscaneoHome: { width: '100%' },
  scanButtonBig: { flexDirection: 'row', padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 10 },
  
  scanButton: { flexDirection: 'row', backgroundColor: LOCAL_COLORS.primaryGreen, padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center', gap: 8 },
  scanButtonText: { color: LOCAL_COLORS.white, marginLeft: 5 },
  botonesEscaneoResumen: { flexDirection: 'row', gap: 10, marginBottom: 20 },

  scanningModalContainer: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  scanningTitle: { marginBottom: 30, textAlign: 'center' },
  scanningImageContainer: { width: '100%', height: screenHeight * 0.5, borderRadius: 20, overflow: 'hidden', backgroundColor: '#000', position: 'relative' },
  scanningImage: { width: '100%', height: '100%' },
  scanningPlaceholder: { width: '100%', height: '100%', backgroundColor: '#333' },
  laserLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: '#00ff00', shadowColor: '#00ff00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10, elevation: 10 },

  datoCuriosoCard: { padding: 15, marginVertical: 30, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#00b347' },
  datoCuriosoTexto: { lineHeight: 22, fontStyle: 'italic', textAlign: 'center' },

  alertCard: { flexDirection: 'row', borderWidth: 1, borderRadius: 10, padding: 15, marginBottom: 20, borderLeftWidth: 5 },
  alertContent: { marginLeft: 10, flex: 1 },
  alertTitle: { color: LOCAL_COLORS.dangerRed },
  alertDescription: {},
  whiteCard: { borderRadius: 15, padding: 15, marginBottom: 20, elevation: 3 },
  sectionTitle: { marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1 },
  gridLabel: {},
  gridValue: { marginTop: 4 },
  itemDetail: { borderTopWidth: 1, paddingTop: 15, marginTop: 10 },
  itemTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  idBox: { backgroundColor: LOCAL_COLORS.accentBlue, width: 22, height: 22, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  idText: { color: LOCAL_COLORS.white },
  itemName: {},
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { flex: 1 },
  statLabel: {},
  statValue: {},
  saveButton: { flexDirection: 'row', backgroundColor: LOCAL_COLORS.primaryGreen, padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 40, gap: 10 },
  saveButtonText: { color: LOCAL_COLORS.white, marginLeft: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 10 },
  modalTitle: { color: LOCAL_COLORS.dangerRed, marginTop: 10, textAlign: 'center' },
  modalDescription: { marginVertical: 15, textAlign: 'center' },
  modalButton: { backgroundColor: LOCAL_COLORS.dangerRed, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10, width: '100%', alignItems: 'center' },
  modalButtonText: { color: LOCAL_COLORS.white },
});