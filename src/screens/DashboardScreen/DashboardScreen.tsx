import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Svg, Circle, G } from 'react-native-svg';

import AlertModal from '../../components/AlertModal';
import AppModal, { useAppModal } from '../../components/AppModal';
import TodayHistorySheet from '../../components/TodayHistorySheet';
import { useAuth } from '../../contexts/AuthContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { type AnalisisResultado, type AlimentoResultado } from '../../services/geminiService';
import { saveFoodRecord, getTodayFoodRecords, type FoodRecord } from '../../services/database';
import { useImageScanner } from '../../hooks/useImageScanner';
import { ErrorFeedback, LoadingFeedback } from '../../components/ui/StateFeedbacks';
import { useScaledStyles } from '../../hooks/useScaledStyles';
import { makeStyles } from './DashboardScreen.styles';

function parseNutrient(val: string | undefined): number {
  if (!val) return 0;
  return parseFloat(val.replace(/[^\d.]/g, '')) || 0;
}

// Consejos diarios en lenguaje simple, rotando por día de la semana
const TIPS_GENERAL = [
  'Trata de tomar al menos 8 vasos de agua hoy. Mantenerte hidratado ayuda a sentirte con más energía.',
  'Incluye una fruta o verdura en tu próxima comida. No tiene que ser mucho, con un poco ya ayuda.',
  'Intenta comer despacio y sin distracciones. Tu cuerpo tarda unos minutos en sentirse satisfecho.',
  'Si tienes hambre entre comidas, una nuez o una fruta es mejor opción que algo empaquetado.',
  'Trata de que la mitad de tu plato sea verduras o ensalada. Es más fácil de lo que parece.',
  'Evita saltarte el desayuno. Comer algo en la mañana te da energía para el resto del día.',
  'Revisa las etiquetas de lo que compras. Si tiene más de 5 ingredientes que no reconoces, mejor busca otra opción.',
];

const TIPS_DIABETES = [
  'Con diabetes, es importante comer a horas fijas. Saltarse comidas puede descontrolar el azúcar en sangre.',
  'Los alimentos integrales (arroz integral, pan integral) suben el azúcar más despacio que los refinados.',
  'Caminar 15-20 minutos después de comer ayuda a que tu cuerpo use mejor el azúcar de los alimentos.',
  'Evita las bebidas azucaradas como refrescos y jugos. Aunque sean "naturales", suben el azúcar rápido.',
  'Las legumbres como frijoles y lentejas son excelentes: tienen proteína y no suben mucho el azúcar.',
  'Revisa el tamaño de tus porciones. A veces comemos más de lo que creemos sin darnos cuenta.',
  'El estrés puede subir el azúcar en sangre. Tómate unos minutos para respirar profundo si te sientes agitado.',
];

function getDailyTip(tieneDiabetes?: string): string {
  const tips = tieneDiabetes === 'si' ? TIPS_DIABETES : TIPS_GENERAL;
  const dayIndex = new Date().getDay();
  return tips[dayIndex % tips.length];
}

// Genera un consejo personalizado basado en el resultado del escaneo
function getScanTip(resultado: AnalisisResultado, tieneDiabetes?: string): { icon: string; color: string; title: string; text: string } {
  const cals  = parseFloat(resultado.totalCalorias.replace(/[^\d.]/g, '')) || 0;
  const azuc  = parseFloat(resultado.totalAzucares.replace(/[^\d.]/g, '')) || 0;
  const prot  = parseFloat(resultado.totalProteinas.replace(/[^\d.]/g, '')) || 0;
  const gras  = parseFloat(resultado.totalGrasas.replace(/[^\d.]/g, '')) || 0;
  const carb  = parseFloat(resultado.totalCarbohidratos.replace(/[^\d.]/g, '')) || 0;
  const nombres = resultado.alimentos.map(a => a.nombre.toLowerCase()).join(' ');

  // Alerta de azúcar alta
  if (resultado.tieneAlertaAzucar || azuc > 20) {
    if (tieneDiabetes === 'si') {
      return { icon: 'alert-circle', color: '#ef4444', title: '⚠️ Alto en azúcar', text: `Este platillo tiene ${resultado.totalAzucares} de azúcar. Con diabetes, es importante monitorear tu glucosa después de comerlo y evitar combinarlo con otras fuentes de azúcar.` };
    }
    return { icon: 'alert-circle', color: '#ef4444', title: '⚠️ Alto en azúcar', text: `Este platillo tiene ${resultado.totalAzucares} de azúcar. Considera acompañarlo con agua natural y evitar postres o bebidas dulces en esta comida.` };
  }

  // Calorías muy altas
  if (cals > 700) {
    return { icon: 'fire', color: '#f97316', title: '🔥 Platillo calórico', text: `Con ${resultado.totalCalorias}, este platillo representa más del 35% de una dieta de 2000 kcal. Procura que tus otras comidas del día sean más ligeras.` };
  }

  // Alto en proteínas — positivo
  if (prot > 25) {
    return { icon: 'arm-flex', color: '#10b981', title: '💪 Rico en proteínas', text: `¡Buena elección! ${resultado.totalProteinas} de proteína ayudan a mantener y construir músculo. Ideal si hiciste ejercicio hoy o planeas hacerlo.` };
  }

  // Alto en grasas
  if (gras > 30) {
    return { icon: 'water', color: '#f97316', title: '🧈 Alto en grasas', text: `Este platillo tiene ${resultado.totalGrasas} de grasa. No todas las grasas son malas, pero si son saturadas, modera el consumo durante el resto del día.` };
  }

  // Alto en carbohidratos
  if (carb > 60) {
    if (tieneDiabetes === 'si') {
      return { icon: 'barley', color: '#3b82f6', title: '🌾 Alto en carbohidratos', text: `${resultado.totalCarbohidratos} de carbohidratos pueden elevar tu glucosa. Caminar 15-20 minutos después de comer ayuda a que tu cuerpo los procese mejor.` };
    }
    return { icon: 'barley', color: '#3b82f6', title: '🌾 Rico en carbohidratos', text: `Con ${resultado.totalCarbohidratos} de carbohidratos, este platillo te dará energía. Ideal antes de actividad física, pero modera si tu día es sedentario.` };
  }

  // Platillo balanceado
  if (cals >= 200 && cals <= 600 && prot >= 10) {
    return { icon: 'check-circle', color: '#10b981', title: '✅ Platillo balanceado', text: `${resultado.totalCalorias} con buen aporte de proteínas y macros moderados. ¡Una elección nutritiva! Recuerda hidratarte bien durante el día.` };
  }

  // Platillo ligero
  if (cals < 200) {
    return { icon: 'leaf', color: '#10b981', title: '🥗 Platillo ligero', text: `Solo ${resultado.totalCalorias}. Si este es tu plato principal, considera complementarlo con una fuente de proteína para mantenerte satisfecho más tiempo.` };
  }

  // Genérico
  return { icon: 'food', color: '#10b981', title: '🍽️ Análisis completado', text: `Detectamos ${resultado.alimentos.length} alimento(s) con ${resultado.totalCalorias}. Recuerda que estos son valores aproximados. Escucha a tu cuerpo y come con consciencia.` };
}

export default function DashboardScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const { modal, showSuccess, showError } = useAppModal();
  const { sc } = useScaledStyles();
  const styles = makeStyles(sc);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [resultado, setResultado] = useState<AnalisisResultado | null>(null);
  const [showSugarAlert, setShowSugarAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [todayRecords, setTodayRecords] = useState<FoodRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // ── Estado del modal de edición ───────────────────────────────────────────
  const [editingItem, setEditingItem] = useState<AlimentoResultado | null>(null);
  const [editCalorias, setEditCalorias] = useState('');
  const [editProteinas, setEditProteinas] = useState('');
  const [editCarbohidratos, setEditCarbohidratos] = useState('');
  const [editGrasas, setEditGrasas] = useState('');
  const [editAzucares, setEditAzucares] = useState('');

  // Extrae el número de un string como "320 kcal" o "12.5 g"
  const extractNum = (val: string) => parseFloat(val.replace(/[^\d.]/g, '')) || 0;

  // Abre el modal de edición para un alimento
  const openEdit = (item: AlimentoResultado) => {
    setEditingItem(item);
    setEditCalorias(String(extractNum(item.calorias)));
    setEditProteinas(String(extractNum(item.proteinas)));
    setEditCarbohidratos(String(extractNum(item.carbohidratos)));
    setEditGrasas(String(extractNum(item.grasas)));
    setEditAzucares(String(extractNum(item.azucares)));
  };

  // Guarda los cambios del modal y recalcula totales
  const applyEdit = () => {
    if (!editingItem || !resultado) return;

    const cal  = parseFloat(editCalorias)  || 0;
    const prot = parseFloat(editProteinas) || 0;
    const carb = parseFloat(editCarbohidratos) || 0;
    const gras = parseFloat(editGrasas)    || 0;
    const azuc = parseFloat(editAzucares)  || 0;

    const updatedItem: AlimentoResultado = {
      ...editingItem,
      calorias:      `${Math.round(cal)} kcal`,
      proteinas:     `${prot.toFixed(1)} g`,
      carbohidratos: `${carb.toFixed(1)} g`,
      grasas:        `${gras.toFixed(1)} g`,
      azucares:      `${azuc.toFixed(1)} g`,
      alertaAzucar:  azuc > 15,
    };

    const newAlimentos = resultado.alimentos.map(a =>
      a.id === editingItem.id ? updatedItem : a
    );

    // Recalcular totales
    const totalCal  = newAlimentos.reduce((s, a) => s + extractNum(a.calorias), 0);
    const totalProt = newAlimentos.reduce((s, a) => s + extractNum(a.proteinas), 0);
    const totalCarb = newAlimentos.reduce((s, a) => s + extractNum(a.carbohidratos), 0);
    const totalGras = newAlimentos.reduce((s, a) => s + extractNum(a.grasas), 0);
    const totalAzuc = newAlimentos.reduce((s, a) => s + extractNum(a.azucares), 0);

    setResultado({
      ...resultado,
      alimentos:          newAlimentos,
      totalCalorias:      `${Math.round(totalCal)} kcal`,
      totalProteinas:     `${totalProt.toFixed(1)} g`,
      totalCarbohidratos: `${totalCarb.toFixed(1)} g`,
      totalGrasas:        `${totalGras.toFixed(1)} g`,
      totalAzucares:      `${totalAzuc.toFixed(1)} g`,
      tieneAlertaAzucar:  newAlimentos.some(a => a.alertaAzucar),
    });

    setEditingItem(null);
  };
  // ─────────────────────────────────────────────────────────────────────────

  const { isScanning, errorState, clearError, scanFromLibrary, scanFromCamera } = useImageScanner();

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

  const handleScanSuccess = (data: AnalisisResultado, uri: string) => {
    setImageUri(uri);
    setResultado(data);
    if (data.tieneAlertaAzucar) {
      setShowSugarAlert(true);
    }
  };

  const handleTakePhoto = () => scanFromCamera('comida', handleScanSuccess);
  const handlePickImage = () => scanFromLibrary('comida', handleScanSuccess);

  // Consejo activo: basado en el escaneo si hay resultado, o el del día
  const scanTip = resultado ? getScanTip(resultado, user?.tiene_diabetes) : null;

  const handleSave = async () => {
    if (!resultado) return;
    if (!user) {
      showError('Sesión Requerida', 'Debes iniciar sesión para poder guardar tus registros de alimentación.');
      return;
    }

    setIsSaving(true);
    try {
      const saveResult = await saveFoodRecord(user.id, resultado, imageUri);
      if (saveResult.success) {
        const updated = await getTodayFoodRecords(user.id);
        setTodayRecords(updated);
        showSuccess(
          'Registro Guardado',
          `Se guardaron ${resultado.alimentos.length} alimento(s) en tu registro diario. Tu resumen se ha actualizado.`,
          () => { setImageUri(null); setResultado(null); }
        );
      } else {
        showError('No se pudo guardar', 'Hubo un problema al guardar tu registro. Verifica tu conexión e intenta nuevamente.');
      }
    } catch (error) {
      showError('Error inesperado', 'Ocurrió un problema al guardar tu registro. Cierra esta ventana e inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const alertMessage = resultado
    ? `Detectamos ${resultado.totalAzucares} de azúcar en total en este plato. ${
        resultado.alimentos
          .filter(a => a.alertaAzucar)
          .map(a => `${a.nombre} tiene ${a.azucares} de azúcar`)
          .join('. ')
      }. Te recomendamos consumirlo con moderación, especialmente si tienes diabetes o estás cuidando tu peso.`
    : '';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <AlertModal
        visible={showSugarAlert}
        title="⚠️ Este plato tiene bastante azúcar"
        message={alertMessage}
        onDismiss={() => setShowSugarAlert(false)}
      />
      <AppModal {...modal} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.headerContainer}>
          <Text style={[styles.headerSubtitle, { color: colors.primaryGreen }]}>NutriVision AI</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {user?.nombre ? `Hola, ${user.nombre.split(' ')[0]} 👋` : 'Home Dashboard'}
          </Text>
        </View>

        {/* Aviso de bienvenida si no hay registros del día */}
        {todayRecords.length === 0 && (
          <View style={[styles.recommendationCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
            <View style={styles.recContent}>
              <View style={[styles.recIcon, { backgroundColor: colors.primaryGreen + '22' }]}>
                <MaterialCommunityIcons name="check-circle-outline" size={24} color={colors.primaryGreen} />
              </View>
              <View style={styles.recTextContainer}>
                <Text style={[styles.recTitle, { color: colors.primaryGreen }]}>¡Tu perfil está listo!</Text>
                <Text style={[styles.recDesc, { color: colors.textSecondary }]}>
                  Ya puedes empezar a usar la app. Toma una foto de tu comida y la IA detectará las calorías y nutrientes al instante.
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={[styles.recommendationCard, { backgroundColor: colors.lightGreen, borderColor: colors.primaryGreen + '33' }]}>
          <View style={styles.zapBg}>
            <MaterialCommunityIcons name="lightbulb-on" size={80} color={colors.primaryGreen} style={{ opacity: 0.1 }} />
          </View>
          <View style={styles.recContent}>
            <View style={[styles.recIcon, { backgroundColor: (scanTip ? scanTip.color : colors.primaryGreen) + '33' }]}>
              <MaterialCommunityIcons
                name={scanTip ? scanTip.icon as any : 'lightbulb-on'}
                size={24}
                color={scanTip ? scanTip.color : '#f59e0b'}
              />
            </View>
            <View style={styles.recTextContainer}>
              <Text style={[styles.recTitle, { color: scanTip ? scanTip.color : colors.text }]}>
                {scanTip ? scanTip.title : 'Consejo del día:'}
              </Text>
              <Text style={[styles.recDesc, { color: colors.textSecondary }]}>
                {scanTip ? scanTip.text : getDailyTip(user?.tiene_diabetes)}
              </Text>
            </View>
          </View>
        </View>

        {errorState && (
            <ErrorFeedback message={errorState} onDismiss={clearError} />
        )}

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
              Toma una foto de tu platillo para detectar calorías, macronutrientes y alertas de azúcar instantáneamente.
            </Text>
            {/* Aviso de precisión */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16, backgroundColor: colors.primaryGreen + '18', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={15} color={colors.primaryGreen} />
              <Text style={{ fontSize: sc(12), color: colors.primaryGreen, flex: 1, lineHeight: sc(17) }}>
                Para mayor precisión, toma la foto desde arriba y con buena iluminación.
              </Text>
            </View>
          </TouchableOpacity>
        ) : imageUri && !isScanning ? (
          <View style={[styles.cameraSection, { backgroundColor: colors.card }]}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.foodImage} />
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => { setImageUri(null); setResultado(null); clearError(); }}
              >
                <Ionicons name="close-circle" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {!isScanning && !resultado && (
          <>
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
            {/* Aviso de precisión bajo los botones */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24, backgroundColor: colors.cardAlt, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: colors.border }}>
              <MaterialCommunityIcons name="camera-enhance-outline" size={18} color={colors.primaryGreen} />
              <Text style={{ fontSize: sc(12), color: colors.textSecondary, flex: 1, lineHeight: sc(18) }}>
                <Text style={{ fontWeight: '700', color: colors.text }}>Consejo: </Text>
                Para mayor precisión, toma la foto desde arriba y con buena iluminación.
              </Text>
            </View>
          </>
        )}

        {isScanning && (
          <LoadingFeedback message="La IA está procesando..." />
        )}

        {resultado && (
          <>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Desglose Total</Text>

              {/* Nota de valores aproximados */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14, backgroundColor: colors.warningBg, borderRadius: 10, padding: 10 }}>
                <MaterialCommunityIcons name="information-outline" size={15} color={colors.warningYellow} />
                <Text style={{ fontSize: sc(12), color: colors.text, flex: 1, lineHeight: sc(17) }}>
                  Valores aproximados estimados por IA. Puedes editarlos tocando ✏️ en cada alimento.
                </Text>
              </View>

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

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Alimentos detectados ({resultado.alimentos.length})</Text>
              {resultado.alimentos.map((item, index) => (
                <View key={item.id} style={[styles.itemDetail, { borderTopColor: colors.divider }, index === 0 && { borderTopWidth: 0 }]}>
                  <View style={styles.itemTitleRow}>
                    <View style={[styles.idBox, { backgroundColor: colors.accentBlue }]}><Text style={styles.idText}>{item.id}</Text></View>
                    <Text style={[styles.itemName, { color: colors.text }]}>{item.nombre}</Text>
                    {item.alertaAzucar && <MaterialCommunityIcons name="alert" size={18} color={colors.dangerRed} />}
                    {/* Botón editar */}
                    <TouchableOpacity
                      onPress={() => openEdit(item)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={{ marginLeft: 4, padding: 4, borderRadius: 8, backgroundColor: colors.cardAlt }}
                    >
                      <MaterialCommunityIcons name="pencil-outline" size={16} color={colors.primaryGreen} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.statsRow}>
                    <View style={styles.statBox}><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calorías</Text><Text style={[styles.statValue, { color: colors.text }]}>{item.calorias}</Text></View>
                    <View style={styles.statBox}><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Proteínas</Text><Text style={[styles.statValue, { color: colors.text }]}>{item.proteinas}</Text></View>
                    <View style={styles.statBox}><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Grasas</Text><Text style={[styles.statValue, { color: colors.text }]}>{item.grasas}</Text></View>
                    <View style={styles.statBox}><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Azúcares</Text><Text style={[styles.statValue, { color: item.alertaAzucar ? colors.dangerRed : colors.text }]}>{item.azucares}</Text></View>
                  </View>
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

        <View style={[styles.dailySummaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.dailySummaryHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Progreso Nutricional</Text>
            <TouchableOpacity
              onPress={() => setShowHistory(true)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, backgroundColor: colors.primaryGreen + '18' }}
            >
              <MaterialCommunityIcons name="history" size={14} color={colors.primaryGreen} />
              <Text style={{ fontSize: sc(12), color: colors.primaryGreen, fontWeight: '700' }}>
                Ver hoy {todayRecords.length > 0 ? `(${todayRecords.length})` : ''}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.circularProgressContainer}>
            <Svg width="200" height="200" viewBox="0 0 200 200">
              <G rotation="-90" origin="100, 100">
                <Circle cx="100" cy="100" r="80" stroke={colors.progressBg} strokeWidth="16" fill="transparent" />
                <Circle cx="100" cy="100" r="80" stroke={colors.primaryGreen} strokeWidth="16" fill="transparent" strokeDasharray={`${Math.min((todayCals / calGoal) * 100, 100) * 5.02} 502`} strokeLinecap="round" />
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

      {/* ── Modal de edición de nutrientes ──────────────────────────────── */}
      <Modal
        visible={!!editingItem}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingItem(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <View style={{ backgroundColor: colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 20 }} />
            <Text style={{ fontSize: sc(18), fontWeight: '700', color: colors.text, marginBottom: 4 }}>
              Editar nutrientes
            </Text>
            <Text style={{ fontSize: sc(13), color: colors.textSecondary, marginBottom: 20 }}>
              {editingItem?.nombre}
            </Text>
            {[
              { label: 'Calorías (kcal)', value: editCalorias, setter: setEditCalorias },
              { label: 'Proteínas (g)',   value: editProteinas, setter: setEditProteinas },
              { label: 'Carbohidratos (g)', value: editCarbohidratos, setter: setEditCarbohidratos },
              { label: 'Grasas (g)',      value: editGrasas, setter: setEditGrasas },
              { label: 'Azúcares (g)',    value: editAzucares, setter: setEditAzucares },
            ].map(({ label, value, setter }) => (
              <View key={label} style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: sc(12), color: colors.textSecondary, marginBottom: 6, fontWeight: '600' }}>{label}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBg, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, height: 48 }}>
                  <TextInput
                    value={value}
                    onChangeText={setter}
                    keyboardType="decimal-pad"
                    style={{ flex: 1, fontSize: sc(16), color: colors.text }}
                    placeholderTextColor={colors.textMuted}
                    selectTextOnFocus
                  />
                </View>
              </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => setEditingItem(null)}
                style={{ flex: 1, height: 52, borderRadius: 16, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={{ fontSize: sc(15), color: colors.textSecondary, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyEdit}
                style={{ flex: 2, height: 52, borderRadius: 16, backgroundColor: colors.primaryGreen, justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={{ fontSize: sc(15), color: '#0f172a', fontWeight: '700' }}>Aplicar cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Bottom sheet de historial del día */}
      <TodayHistorySheet
        visible={showHistory}
        records={todayRecords}
        onClose={() => setShowHistory(false)}
        onRecordDeleted={(id) => setTodayRecords(prev => prev.filter(r => r.id !== id))}
      />

    </SafeAreaView>
  );
}
