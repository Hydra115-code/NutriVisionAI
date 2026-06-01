import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Svg, Circle, G } from 'react-native-svg';

import AlertModal from '../../components/AlertModal';
import AppModal, { useAppModal } from '../../components/AppModal';
import { useAuth } from '../../contexts/AuthContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { type AnalisisResultado } from '../../services/geminiService';
import { saveFoodRecord, getTodayFoodRecords, type FoodRecord } from '../../services/database';
import { useImageScanner } from '../../hooks/useImageScanner';
import { ErrorFeedback, LoadingFeedback } from '../../components/ui/StateFeedbacks';
import { styles } from './DashboardScreen.styles';

function parseNutrient(val: string | undefined): number {
  if (!val) return 0;
  return parseFloat(val.replace(/[^\d.]/g, '')) || 0;
}

export default function DashboardScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const { modal, showSuccess, showError } = useAppModal();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [resultado, setResultado] = useState<AnalisisResultado | null>(null);
  const [showSugarAlert, setShowSugarAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [todayRecords, setTodayRecords] = useState<FoodRecord[]>([]);

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
    ? `Se detectaron ${resultado.totalAzucares} de azúcar total. ${
        resultado.alimentos
          .filter(a => a.alertaAzucar)
          .map(a => `${a.nombre}: ${a.azucares}`)
          .join(', ')
      }. Consume con precaución.`
    : '';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AlertModal
        visible={showSugarAlert}
        title="ALERTA CRÍTICA: Nivel de Azúcar Elevado"
        message={alertMessage}
        onDismiss={() => setShowSugarAlert(false)}
      />
      <AppModal {...modal} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.headerContainer}>
          <Text style={[styles.headerSubtitle, { color: colors.primaryGreen }]}>NutriVision AI</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Home Dashboard</Text>
        </View>

        <View style={[styles.recommendationCard, { backgroundColor: colors.lightGreen, borderColor: colors.primaryGreen + '33' }]}>
          <View style={styles.zapBg}>
            <MaterialCommunityIcons name="lightbulb-on" size={80} color={colors.primaryGreen} style={{ opacity: 0.1 }} />
          </View>
          <View style={styles.recContent}>
            <View style={[styles.recIcon, { backgroundColor: colors.primaryGreen + '33' }]}>
              <MaterialCommunityIcons name="lightbulb-on" size={24} color="#f59e0b" />
            </View>
            <View style={styles.recTextContainer}>
              <Text style={[styles.recTitle, { color: colors.text }]}>Recomendación Diaria:</Text>
              <Text style={[styles.recDesc, { color: colors.textSecondary }]}>
                Tip para ti: Aumentar la ingesta de vegetales crucíferos y fibra soluble te ayudará a controlar la glucosa y a promover la pérdida de peso al mismo tiempo.
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

        {isScanning && (
          <LoadingFeedback message="La IA está procesando..." />
        )}

        {resultado && (
          <>
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

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Alimentos detectados ({resultado.alimentos.length})</Text>
              {resultado.alimentos.map((item, index) => (
                <View key={item.id} style={[styles.itemDetail, { borderTopColor: colors.divider }, index === 0 && { borderTopWidth: 0 }]}>
                  <View style={styles.itemTitleRow}>
                    <View style={[styles.idBox, { backgroundColor: colors.accentBlue }]}><Text style={styles.idText}>{item.id}</Text></View>
                    <Text style={[styles.itemName, { color: colors.text }]}>{item.nombre}</Text>
                    {item.alertaAzucar && <MaterialCommunityIcons name="alert" size={18} color={colors.dangerRed} />}
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
            <Text style={[styles.quickStatsLabel, { color: colors.textMuted }]}>Estadísticas</Text>
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
    </SafeAreaView>
  );
}
