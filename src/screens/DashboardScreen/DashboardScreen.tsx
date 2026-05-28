import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  PanResponder,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Svg, Circle, G } from 'react-native-svg';

import AlertModal from '../../components/AlertModal';
import AppModal, { useAppModal } from '../../components/AppModal';
import { useAuth } from '../../contexts/AuthContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { type AnalisisResultado, type AlimentoResultado } from '../../services/geminiService';
import { saveFoodRecord, getTodayFoodRecords, type FoodRecord } from '../../services/database';
import { useImageScanner } from '../../hooks/useImageScanner';
import { ErrorFeedback, LoadingFeedback } from '../../components/ui/StateFeedbacks';
import { styles } from './DashboardScreen.styles';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function parseNutrient(val: string | undefined): number {
  if (!val) return 0;
  return parseFloat(val.replace(/[^\d.]/g, '')) || 0;
}

// ─── CONSEJOS DIARIOS ─────────────────────────────────────────────────────────

const TIPS_GENERAL = [
  'Trata de tomar al menos 8 vasos de agua hoy. Mantenerte hidratado ayuda a sentirte con más energía.',
  'Incluye una fruta o verdura en tu próxima comida. No tiene que ser mucho, con un poco ya ayuda.',
  'Intenta comer despacio y sin distracciones. Tu cuerpo tarda unos minutos en sentirse satisfecho.',
  'Si tienes hambre entre comidas, una nuez o una fruta es mejor opción que algo empaquetado.',
  'Trata de que la mitad de tu plato sea verduras o ensalada. Es más fácil de lo que parece.',
  'Evita saltarte el desayuno. Comer algo en la mañana te da energía para el resto del día.',
  'Revisa las etiquetas de lo que compras. Si tiene muchos ingredientes que no reconoces, busca otra opción.',
];

const TIPS_DIABETES = [
  'Con diabetes, es importante comer a horas fijas. Saltarse comidas puede descontrolar el azúcar en sangre.',
  'Los alimentos integrales (arroz integral, pan integral) suben el azúcar más despacio que los refinados.',
  'Caminar 15-20 minutos después de comer ayuda a que tu cuerpo use mejor el azúcar de los alimentos.',
  'Evita las bebidas azucaradas como refrescos y jugos. Aunque sean naturales, suben el azúcar rápido.',
  'Las legumbres como frijoles y lentejas son excelentes: tienen proteína y no suben mucho el azúcar.',
  'Revisa el tamaño de tus porciones. A veces comemos más de lo que creemos sin darnos cuenta.',
  'El estrés puede subir el azúcar en sangre. Tómate unos minutos para respirar profundo si te sientes agitado.',
];

function getDailyTip(tieneDiabetes?: string): string {
  const tips = tieneDiabetes === 'si' ? TIPS_DIABETES : TIPS_GENERAL;
  return tips[new Date().getDay() % tips.length];
}

// ─── RECOMENDACIONES PERSONALIZADAS (RF-07) ───────────────────────────────────

function getPersonalizedRecommendation(
  cals: number, protein: number, carbs: number, fats: number,
  calGoal: number, proteinGoal: number, carbsGoal: number, fatsGoal: number,
  tieneDiabetes?: string
): string {
  if (cals === 0) return getDailyTip(tieneDiabetes);

  const calPct = (cals / calGoal) * 100;
  const protPct = (protein / proteinGoal) * 100;
  const fatPct = (fats / fatsGoal) * 100;
  const carbPct = (carbs / carbsGoal) * 100;

  if (calPct > 90) return 'Ya consumiste casi todas tus calorías del día. Si tienes hambre, opta por algo ligero como una fruta o un vaso de agua.';
  if (fatPct > 100) return 'Hoy consumiste bastante grasa. Para la siguiente comida elige algo más ligero, como pollo a la plancha o ensalada.';
  if (tieneDiabetes === 'si' && carbPct > 80) return 'Llevas muchos carbohidratos hoy. Evita pan, arroz o dulces en tu próxima comida para mantener estable tu azúcar.';
  if (protPct < 40) return 'Te falta proteína hoy. Agrega huevo, pollo, atún o frijoles en tu siguiente comida para sentirte más satisfecho.';
  if (calPct < 30) return 'Llevas pocas calorías hoy. Asegúrate de comer bien para tener energía durante el día.';
  return 'Vas bien con tu alimentación de hoy. Sigue así y trata de mantenerte hidratado.';
}

// ─── VALIDACIÓN DE RIESGOS (RF-11) ────────────────────────────────────────────

interface RiesgoAlimenticio {
  tipo: 'azucar' | 'grasa' | 'calorias';
  mensaje: string;
  color: string;
}

function detectarRiesgos(
  resultado: AnalisisResultado,
  todayCals: number,
  calGoal: number,
  colors: any
): RiesgoAlimenticio[] {
  const riesgos: RiesgoAlimenticio[] = [];
  const azucar = parseNutrient(resultado.totalAzucares);
  const grasas = parseNutrient(resultado.totalGrasas);
  const cals = parseNutrient(resultado.totalCalorias);

  if (resultado.tieneAlertaAzucar || azucar > 15) {
    riesgos.push({
      tipo: 'azucar',
      mensaje: `Este plato tiene ${resultado.totalAzucares} de azúcar. Consumirlo seguido puede afectar tu energía y peso.`,
      color: colors.dangerRed,
    });
  }
  if (grasas > 25) {
    riesgos.push({
      tipo: 'grasa',
      mensaje: `Contiene ${resultado.totalGrasas} de grasa. Es alto para una sola comida. Trata de balancear el resto del día.`,
      color: colors.orangeFats,
    });
  }
  if (todayCals + cals > calGoal * 0.95) {
    riesgos.push({
      tipo: 'calorias',
      mensaje: `Con este plato estarías llegando a tu límite de calorías del día (${calGoal} kcal). Considera una porción más pequeña.`,
      color: colors.warningYellow,
    });
  }
  return riesgos;
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function DashboardScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const { modal, showSuccess, showError } = useAppModal();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [resultado, setResultado] = useState<AnalisisResultado | null>(null);
  const [editableAlimentos, setEditableAlimentos] = useState<AlimentoResultado[]>([]);
  const [showSugarAlert, setShowSugarAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [todayRecords, setTodayRecords] = useState<FoodRecord[]>([]);
  const [showHistorial, setShowHistorial] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTemp, setEditTemp] = useState<Partial<AlimentoResultado>>({});

  const { isScanning, errorState, clearError, scanFromLibrary, scanFromCamera } = useImageScanner();

  // Gesto deslizar hacia abajo para cerrar el modal de historial
  const historialPanY = useRef(new Animated.Value(0)).current;
  const historialPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: Animated.event([null, { dy: historialPanY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80 || g.vy > 0.5) {
          Animated.timing(historialPanY, { toValue: 800, duration: 200, useNativeDriver: true }).start(() => {
            historialPanY.setValue(0);
            setShowHistorial(false);
          });
        } else {
          Animated.spring(historialPanY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const closeHistorial = () => {
    Animated.timing(historialPanY, { toValue: 800, duration: 200, useNativeDriver: true }).start(() => {
      historialPanY.setValue(0);
      setShowHistorial(false);
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        getTodayFoodRecords(user.id).then(setTodayRecords);
      }
    }, [user?.id])
  );

  const calGoal = 2000;
  const proteinGoal = 150;
  const carbsGoal = 250;
  const fatsGoal = 70;

  const todayCals = todayRecords.reduce((s, r) => s + parseNutrient(r.total_calorias), 0);
  const todayProtein = todayRecords.reduce((s, r) => s + parseNutrient(r.total_proteinas), 0);
  const todayCarbs = todayRecords.reduce((s, r) => s + parseNutrient(r.total_carbohidratos), 0);
  const todayFats = todayRecords.reduce((s, r) => s + parseNutrient(r.total_grasas), 0);

  const riesgos = resultado ? detectarRiesgos(resultado, todayCals, calGoal, colors) : [];

  const handleScanSuccess = (data: AnalisisResultado, uri: string) => {
    setImageUri(uri);
    setResultado(data);
    setEditableAlimentos([...data.alimentos]);
    if (data.tieneAlertaAzucar) setShowSugarAlert(true);
  };

  const handleTakePhoto = () => scanFromCamera('comida', handleScanSuccess);
  const handlePickImage = () => scanFromLibrary('comida', handleScanSuccess);

  // RF-10: Guardar edición de un alimento
  const handleSaveEdit = (index: number) => {
    const updated = [...editableAlimentos];
    const toNum = (v: any) => v ? v.toString().replace(/[^\d.]/g, '') : '0';
    updated[index] = {
      ...updated[index],
      calorias: `${toNum(editTemp.calorias)} kcal`,
      proteinas: `${toNum(editTemp.proteinas)} g`,
      grasas: `${toNum(editTemp.grasas)} g`,
      azucares: `${toNum(editTemp.azucares)} g`,
      carbohidratos: `${toNum(editTemp.carbohidratos)} g`,
    };
    setEditableAlimentos(updated);
    setEditingIndex(null);
    setEditTemp({});
  };

  const handleSave = async () => {
    if (!resultado) return;
    if (!user) {
      showError('Sesión requerida', 'Debes iniciar sesión para guardar tus registros.');
      return;
    }
    setIsSaving(true);
    try {
      // Recalcular totales con los valores editados
      const totalCals = editableAlimentos.reduce((s, a) => s + parseNutrient(a.calorias), 0);
      const totalProt = editableAlimentos.reduce((s, a) => s + parseNutrient(a.proteinas), 0);
      const totalCarb = editableAlimentos.reduce((s, a) => s + parseNutrient(a.carbohidratos), 0);
      const totalGras = editableAlimentos.reduce((s, a) => s + parseNutrient(a.grasas), 0);
      const totalAzuc = editableAlimentos.reduce((s, a) => s + parseNutrient(a.azucares), 0);

      const resultadoFinal = {
        ...resultado,
        alimentos: editableAlimentos,
        totalCalorias: `${Math.round(totalCals)} kcal`,
        totalProteinas: `${totalProt.toFixed(1)} g`,
        totalCarbohidratos: `${totalCarb.toFixed(1)} g`,
        totalGrasas: `${totalGras.toFixed(1)} g`,
        totalAzucares: `${totalAzuc.toFixed(1)} g`,
      };

      const saveResult = await saveFoodRecord(user.id, resultadoFinal, imageUri);
      if (saveResult.success) {
        const updated = await getTodayFoodRecords(user.id);
        setTodayRecords(updated);
        showSuccess(
          'Registro guardado',
          `Se guardaron ${editableAlimentos.length} alimento(s) en tu registro diario.`,
          () => { setImageUri(null); setResultado(null); setEditableAlimentos([]); }
        );
      } else {
        showError('No se pudo guardar', 'Hubo un problema al guardar. Intenta de nuevo.');
      }
    } catch {
      showError('Error inesperado', 'Ocurrió un problema. Cierra esta ventana e inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const alertMessage = resultado
    ? `Detectamos ${resultado.totalAzucares} de azúcar en total. ${
        editableAlimentos.filter(a => a.alertaAzucar).map(a => `${a.nombre} tiene ${a.azucares}`).join('. ')
      }. Te recomendamos consumirlo con moderación, especialmente si tienes diabetes o estás cuidando tu peso.`
    : '';

  const recommendation = getPersonalizedRecommendation(
    todayCals, todayProtein, todayCarbs, todayFats,
    calGoal, proteinGoal, carbsGoal, fatsGoal,
    user?.tiene_diabetes
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AlertModal
        visible={showSugarAlert}
        title="⚠️ Este plato tiene bastante azúcar"
        message={alertMessage}
        onDismiss={() => setShowSugarAlert(false)}
      />
      <AppModal {...modal} />

      {/* ── MODAL HISTORIAL DEL DÍA (RF-06) ── */}
      <Modal visible={showHistorial} animationType="none" transparent onRequestClose={closeHistorial}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          {/* Fondo oscuro — toca para cerrar */}
          <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} activeOpacity={1} onPress={closeHistorial} />

          <Animated.View style={{ backgroundColor: colors.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '80%', transform: [{ translateY: historialPanY }] }}>

            {/* Indicador de arrastre */}
            <View style={{ alignItems: 'center', marginBottom: 8 }} {...historialPanResponder.panHandlers}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>Lo que comiste hoy</Text>
              <TouchableOpacity onPress={closeHistorial}>
                <Ionicons name="close-circle" size={28} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            {todayRecords.length === 0 ? (
              <Text style={{ color: colors.textSecondary, textAlign: 'center', paddingVertical: 32 }}>
                Aún no tienes registros hoy. ¡Escanea tu primera comida!
              </Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {todayRecords.map((record, i) => {
                  const hora = new Date(record.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                  let alimentos: any[] = [];
                  try { alimentos = JSON.parse((record as any).alimentos_json || '[]'); } catch { alimentos = []; }
                  return (
                    <View key={record.id} style={{ borderTopWidth: i > 0 ? 1 : 0, borderTopColor: colors.border, paddingTop: i > 0 ? 16 : 0, marginTop: i > 0 ? 16 : 0 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ color: colors.textMuted, fontSize: 13 }}>🕐 {hora}</Text>
                        <Text style={{ color: colors.primaryGreen, fontWeight: 'bold' }}>{record.total_calorias}</Text>
                      </View>
                      {alimentos.length > 0 ? alimentos.map((a: any, j: number) => (
                        <Text key={j} style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 2 }}>
                          • {a.nombre} — {a.calorias}
                        </Text>
                      )) : (
                        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                          Proteínas: {record.total_proteinas} · Carbs: {record.total_carbohidratos} · Grasas: {record.total_grasas}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </Animated.View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={[styles.headerSubtitle, { color: colors.primaryGreen }]}>NutriVision AI</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {user?.nombre ? `Hola, ${user.nombre.split(' ')[0]} 👋` : 'Inicio'}
          </Text>
        </View>

        {/* AVISO PERFIL LISTO */}
        {todayRecords.length === 0 && (
          <View style={[styles.recommendationCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
            <View style={styles.recContent}>
              <View style={[styles.recIcon, { backgroundColor: colors.primaryGreen + '22' }]}>
                <MaterialCommunityIcons name="check-circle-outline" size={24} color={colors.primaryGreen} />
              </View>
              <View style={styles.recTextContainer}>
                <Text style={[styles.recTitle, { color: colors.primaryGreen }]}>¡Tu perfil está listo!</Text>
                <Text style={[styles.recDesc, { color: colors.textSecondary }]}>
                  Ya puedes empezar. Toma una foto de tu comida y la IA detectará las calorías y nutrientes al instante.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* RECOMENDACIÓN PERSONALIZADA (RF-07) */}
        <View style={[styles.recommendationCard, { backgroundColor: colors.lightGreen, borderColor: colors.primaryGreen + '33' }]}>
          <View style={styles.zapBg}>
            <MaterialCommunityIcons name="lightbulb-on" size={80} color={colors.primaryGreen} style={{ opacity: 0.1 }} />
          </View>
          <View style={styles.recContent}>
            <View style={[styles.recIcon, { backgroundColor: colors.primaryGreen + '33' }]}>
              <MaterialCommunityIcons name="lightbulb-on" size={24} color="#f59e0b" />
            </View>
            <View style={styles.recTextContainer}>
              <Text style={[styles.recTitle, { color: colors.text }]}>
                {todayCals > 0 ? 'Para ti, basado en lo que comiste:' : 'Consejo del día:'}
              </Text>
              <Text style={[styles.recDesc, { color: colors.textSecondary }]}>{recommendation}</Text>
            </View>
          </View>
        </View>

        {errorState && <ErrorFeedback message={errorState} onDismiss={clearError} />}

        {/* ZONA DE ESCANEO */}
        {!imageUri && !isScanning ? (
          <TouchableOpacity
            style={[styles.uploadBox, { backgroundColor: colors.primaryGreen + '0D', borderColor: colors.primaryGreen + '33' }]}
            onPress={handleTakePhoto}
          >
            <View style={[styles.uploadIconBox, { backgroundColor: colors.primaryGreen + '1A' }]}>
              <MaterialCommunityIcons name="camera" size={44} color={colors.primaryGreen} />
            </View>
            <Text style={[styles.uploadTitle, { color: colors.text }]}>¡Empieza a escanear!</Text>
            <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
              Toma una foto de tu platillo para detectar calorías y nutrientes al instante.
            </Text>
            {/* RNF-03: aviso de precisión */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 6 }}>
              <MaterialCommunityIcons name="information-outline" size={14} color={colors.textMuted} />
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                Mejor precisión con buena iluminación y plato visible completo
              </Text>
            </View>
          </TouchableOpacity>
        ) : imageUri && !isScanning ? (
          <View style={[styles.cameraSection, { backgroundColor: colors.card }]}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.foodImage} />
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => { setImageUri(null); setResultado(null); setEditableAlimentos([]); clearError(); }}
              >
                <Ionicons name="close-circle" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {!isScanning && !resultado && (
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primaryGreen }]} onPress={handleTakePhoto}>
              <MaterialCommunityIcons name="camera-outline" size={22} color="#0f172a" />
              <Text style={[styles.actionBtnText, { color: '#0f172a' }]}>Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primaryGreen }]} onPress={handlePickImage}>
              <MaterialCommunityIcons name="image-outline" size={22} color="#0f172a" />
              <Text style={[styles.actionBtnText, { color: '#0f172a' }]}>Galería</Text>
            </TouchableOpacity>
          </View>
        )}

        {isScanning && <LoadingFeedback message="La IA está analizando tu comida..." />}

        {resultado && (
          <>
            {/* RF-05: Aviso de valores estimados */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.warningBg, borderRadius: 12, padding: 12, marginBottom: 16, gap: 8 }}>
              <MaterialCommunityIcons name="information-outline" size={18} color={colors.warningYellow} />
              <Text style={{ color: colors.warningYellow, fontSize: 12, flex: 1 }}>
                Los valores nutricionales son estimaciones de la IA. Pueden variar según la preparación y el tamaño real de la porción.
              </Text>
            </View>

            {/* RF-11: Riesgos alimenticios */}
            {riesgos.map((r, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', backgroundColor: r.color + '18', borderRadius: 12, padding: 12, marginBottom: 10, gap: 8, borderLeftWidth: 3, borderLeftColor: r.color }}>
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color={r.color} />
                <Text style={{ color: r.color, fontSize: 12, flex: 1, fontWeight: '600' }}>{r.mensaje}</Text>
              </View>
            ))}

            {/* DESGLOSE TOTAL */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Desglose Total</Text>
              <View style={styles.grid}>
                <View style={[styles.gridItem, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                  <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Calorías</Text>
                  <Text style={[styles.gridValue, { color: colors.primaryGreen }]}>{resultado.totalCalorias}</Text>
                </View>
                <View style={[styles.gridItem, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                  <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Carbohidratos</Text>
                  <Text style={[styles.gridValue, { color: colors.accentBlue }]}>{resultado.totalCarbohidratos}</Text>
                </View>
                <View style={[styles.gridItem, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                  <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Azúcares</Text>
                  <Text style={[styles.gridValue, { color: resultado.tieneAlertaAzucar ? colors.dangerRed : colors.text }]}>{resultado.totalAzucares}</Text>
                </View>
                <View style={[styles.gridItem, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                  <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Proteínas</Text>
                  <Text style={[styles.gridValue, { color: colors.protein }]}>{resultado.totalProteinas}</Text>
                </View>
              </View>
            </View>

            {/* RF-10: Alimentos detectados con edición */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 6 }]}>
                Alimentos detectados ({editableAlimentos.length})
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 }}>
                <MaterialCommunityIcons name="pencil-outline" size={13} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>Toca el lápiz de cada alimento para editar sus valores</Text>
              </View>

              {editableAlimentos.map((item, index) => (
                <View key={item.id} style={[styles.itemDetail, { borderTopColor: colors.divider }, index === 0 && { borderTopWidth: 0 }]}>
                  <View style={styles.itemTitleRow}>
                    <View style={[styles.idBox, { backgroundColor: colors.accentBlue }]}>
                      <Text style={styles.idText}>{item.id}</Text>
                    </View>
                    <Text style={[styles.itemName, { color: colors.text }]}>{item.nombre}</Text>
                    {item.alertaAzucar && <MaterialCommunityIcons name="alert" size={18} color={colors.dangerRed} />}
                    <TouchableOpacity
                      onPress={() => {
                        // Extraer solo números al abrir el editor
                        const toNum = (v: string) => v.replace(/[^\d.]/g, '');
                        setEditingIndex(index);
                        setEditTemp({
                          calorias: toNum(item.calorias),
                          proteinas: toNum(item.proteinas),
                          grasas: toNum(item.grasas),
                          carbohidratos: toNum(item.carbohidratos),
                          azucares: toNum(item.azucares),
                        });
                      }}
                      style={{ padding: 4 }}
                    >
                      <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.primaryGreen} />
                    </TouchableOpacity>
                  </View>

                  {editingIndex === index ? (
                    // Modo edición
                    <View style={{ backgroundColor: colors.cardAlt, borderRadius: 12, padding: 12, gap: 8 }}>
                      <Text style={{ color: colors.textMuted, fontSize: 11, marginBottom: 4 }}>Edita los valores (puedes escribir solo el número):</Text>
                      {[
                        { label: 'Calorías', key: 'calorias', unit: 'kcal' },
                        { label: 'Proteínas', key: 'proteinas', unit: 'g' },
                        { label: 'Grasas', key: 'grasas', unit: 'g' },
                        { label: 'Carbohidratos', key: 'carbohidratos', unit: 'g' },
                        { label: 'Azúcares', key: 'azucares', unit: 'g' },
                      ].map(({ label, key, unit }) => {
                        // Extraer solo el número del valor actual para mostrarlo en el input
                        const rawVal = String((editTemp as any)[key] ?? '');
                        const numOnly = rawVal.replace(/[^\d.]/g, '');
                        return (
                          <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ color: colors.textSecondary, fontSize: 12, width: 110 }}>{label}</Text>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBg, borderRadius: 8, paddingHorizontal: 10 }}>
                              <TextInput
                                style={{ flex: 1, color: colors.text, paddingVertical: 6, fontSize: 14 }}
                                value={numOnly}
                                onChangeText={(v) => {
                                  // Solo permitir números y punto decimal
                                  const clean = v.replace(/[^0-9.]/g, '');
                                  setEditTemp(prev => ({ ...prev, [key]: clean }));
                                }}
                                keyboardType="decimal-pad"
                                placeholder="0"
                                placeholderTextColor={colors.textMuted}
                              />
                              <Text style={{ color: colors.textMuted, fontSize: 13, marginLeft: 4 }}>{unit}</Text>
                            </View>
                          </View>
                        );
                      })}
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                        <TouchableOpacity
                          style={{ flex: 1, backgroundColor: colors.primaryGreen, borderRadius: 10, padding: 10, alignItems: 'center' }}
                          onPress={() => handleSaveEdit(index)}
                        >
                          <Text style={{ color: '#0f172a', fontWeight: 'bold' }}>Guardar cambios</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ flex: 1, backgroundColor: colors.cardAlt, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}
                          onPress={() => { setEditingIndex(null); setEditTemp({}); }}
                        >
                          <Text style={{ color: colors.textSecondary }}>Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    // Modo visualización
                    <View style={styles.statsRow}>
                      <View style={styles.statBox}><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calorías</Text><Text style={[styles.statValue, { color: colors.text }]}>{item.calorias}</Text></View>
                      <View style={styles.statBox}><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Proteínas</Text><Text style={[styles.statValue, { color: colors.text }]}>{item.proteinas}</Text></View>
                      <View style={styles.statBox}><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Grasas</Text><Text style={[styles.statValue, { color: colors.text }]}>{item.grasas}</Text></View>
                      <View style={styles.statBox}><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Azúcares</Text><Text style={[styles.statValue, { color: item.alertaAzucar ? colors.dangerRed : colors.text }]}>{item.azucares}</Text></View>
                    </View>
                  )}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primaryGreen }, isSaving && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <ActivityIndicator color="#0f172a" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#0f172a" />
                  <Text style={styles.saveButtonText}>Guardar registro diario</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* PROGRESO NUTRICIONAL */}
        <View style={[styles.dailySummaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.dailySummaryHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Progreso del día</Text>
            {/* RF-06: Botón ver historial */}
            <TouchableOpacity
              onPress={() => setShowHistorial(true)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <MaterialCommunityIcons name="history" size={16} color={colors.primaryGreen} />
              <Text style={{ color: colors.primaryGreen, fontSize: 13, fontWeight: '600' }}>Ver lo que comí</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.circularProgressContainer}>
            <Svg width="200" height="200" viewBox="0 0 200 200">
              <G rotation="-90" origin="100, 100">
                <Circle cx="100" cy="100" r="80" stroke={colors.progressBg} strokeWidth="16" fill="transparent" />
                <Circle cx="100" cy="100" r="80" stroke={colors.primaryGreen} strokeWidth="16" fill="transparent"
                  strokeDasharray={`${Math.min((todayCals / calGoal) * 100, 100) * 5.02} 502`}
                  strokeLinecap="round" />
              </G>
            </Svg>
            <View style={styles.circularProgressInner}>
              <Text style={[styles.caloriesValue, { color: colors.text }]}>{Math.round(todayCals)}</Text>
              <Text style={[styles.caloriesLabel, { color: colors.textSecondary }]}>/ {calGoal} kcal</Text>
            </View>
          </View>

          <View style={styles.macroRowContainer}>
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, { borderColor: colors.protein, backgroundColor: colors.protein + '20' }]}>
                <MaterialCommunityIcons name="food-drumstick" size={24} color={colors.protein} />
              </View>
              <Text style={[styles.macroValue, { color: colors.text }]}>{Math.round(todayProtein)}g</Text>
              <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Proteínas</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, { borderColor: colors.accentBlue, backgroundColor: colors.accentBlue + '20' }]}>
                <MaterialCommunityIcons name="barley" size={24} color={colors.accentBlue} />
              </View>
              <Text style={[styles.macroValue, { color: colors.text }]}>{Math.round(todayCarbs)}g</Text>
              <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Carbohidratos</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, { borderColor: colors.orangeFats, backgroundColor: colors.orangeFats + '20' }]}>
                <MaterialCommunityIcons name="water" size={24} color={colors.orangeFats} />
              </View>
              <Text style={[styles.macroValue, { color: colors.text }]}>{Math.round(todayFats)}g</Text>
              <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Grasas</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
