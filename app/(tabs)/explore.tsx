import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

const screenWidth = Dimensions.get('window').width;
const ORIGINAL_COLORS = {
  primaryGreen: '#00b347',
  blueCarbs: '#3b82f6',
  orangeFats: '#f59e0b',
};

import { API_URL } from '../../constants/config';
const META_CALORIAS_DEFAULT = 2000;

type DiaSemana = {
  dia: string;
  calorias: number;
};

export default function ProgressScreen() {
  const { colors, isDark } = useTheme();
  const { usuario } = useUser() as any;

  const [cargando, setCargando] = useState(false);
  const [semana, setSemana] = useState<DiaSemana[]>([]);
  const [datosHoy, setDatosHoy] = useState({
    caloriasConsumidas: 0,
    caloriasMeta: 2000,
    proteinas: 0,
    proteinasMeta: 150,
    carbos: 0,
    carbosMeta: 200,
    grasas: 0,
    grasasMeta: 65,
  });

  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        if (!usuario?.usuario_id) return;
        setCargando(true);
        try {
          // Carga progreso de hoy y semanal en paralelo
          const [resHoy, resSemana, resMetas] = await Promise.all([
          fetch(`${API_URL}/api/auth/progreso-hoy/${usuario.usuario_id}`),
          fetch(`${API_URL}/api/auth/progreso-semanal/${usuario.usuario_id}`),
          fetch(`${API_URL}/api/auth/metas/${usuario.usuario_id}`)
        ]);
        const dataHoy    = await resHoy.json();
        const dataSemana = await resSemana.json();
        const dataMetas  = await resMetas.json();

          if (dataHoy.ok && dataHoy.datos) {
          setDatosHoy(prev => ({
          ...prev,
          caloriasConsumidas: Number(dataHoy.datos.calorias)  || 0,
          proteinas:          Number(dataHoy.datos.proteinas) || 0,
          carbos:             Number(dataHoy.datos.carbos)    || 0,
          grasas:             Number(dataHoy.datos.grasas)    || 0,
          // ✅ Metas personalizadas por usuario
          caloriasMeta:  dataMetas.ok ? dataMetas.metas.calorias  : prev.caloriasMeta,
          proteinasMeta: dataMetas.ok ? dataMetas.metas.proteinas : prev.proteinasMeta,
          carbosMeta:    dataMetas.ok ? dataMetas.metas.carbos    : prev.carbosMeta,
          grasasMeta:    dataMetas.ok ? dataMetas.metas.grasas    : prev.grasasMeta,
  }));
}

          if (dataSemana.ok && dataSemana.semana) {
            setSemana(dataSemana.semana);
          }

        } catch (error) {
          console.log('Error cargando datos:', error);
        } finally {
          setCargando(false);
        }
      };
      cargarDatos();
    }, [usuario?.usuario_id])
  );

  const tieneDatos = datosHoy.proteinas > 0 || datosHoy.carbos > 0 || datosHoy.grasas > 0;
  const total = datosHoy.proteinas + datosHoy.carbos + datosHoy.grasas || 1;

  const pieData = [
    {
      name: `Proteínas: ${tieneDatos ? Math.round((datosHoy.proteinas / total) * 100) : 0}%`,
      population: datosHoy.proteinas || (tieneDatos ? 0 : 1),
      color: tieneDatos ? ORIGINAL_COLORS.primaryGreen : '#e2e8f0',
      legendFontColor: ORIGINAL_COLORS.primaryGreen,
      legendFontSize: 12,
    },
    {
      name: `Grasas: ${tieneDatos ? Math.round((datosHoy.grasas / total) * 100) : 0}%`,
      population: datosHoy.grasas || 0,
      color: ORIGINAL_COLORS.orangeFats,
      legendFontColor: ORIGINAL_COLORS.orangeFats,
      legendFontSize: 12,
    },
    {
      name: `Carbohidratos: ${tieneDatos ? Math.round((datosHoy.carbos / total) * 100) : 0}%`,
      population: datosHoy.carbos || 0,
      color: ORIGINAL_COLORS.blueCarbs,
      legendFontColor: ORIGINAL_COLORS.blueCarbs,
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: colors.mainCard,
    backgroundGradientTo: colors.mainCard,
    color: (opacity = 1) => isDark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`,
  };

  const porcCalorias  = Math.min((datosHoy.caloriasConsumidas / datosHoy.caloriasMeta) * 100, 100);
  const porcProteinas = Math.min((datosHoy.proteinas / datosHoy.proteinasMeta) * 100, 100);
  const porcCarbos    = Math.min((datosHoy.carbos / datosHoy.carbosMeta) * 100, 100);
  const porcGrasas    = Math.min((datosHoy.grasas / datosHoy.grasasMeta) * 100, 100);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={[styles.topHeader, { backgroundColor: isDark ? '#1e293b' : '#d1f2eb' }]}>
          <Text style={[styles.topHeaderText, { color: colors.textMain }]}>Registros de comida</Text>
        </View>

        {cargando && (
          <View style={{ alignItems: 'center', marginBottom: 15 }}>
            <ActivityIndicator color={ORIGINAL_COLORS.primaryGreen} />
            <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 5 }}>
              Actualizando datos...
            </Text>
          </View>
        )}

        {/* Panel de Progreso */}
        <View style={[styles.card, { backgroundColor: colors.mainCard }]}>
          <Text style={[styles.cardTitle, { color: colors.textMain }]}>📈 Panel de Progreso</Text>

          <View style={styles.metricSection}>
            <View style={styles.row}>
              <Text style={[styles.metricLabel, { color: colors.textMain }]}>Calorías del día</Text>
              <Text style={[styles.metricValue, { color: colors.textSecondary }]}>
                {datosHoy.caloriasConsumidas} / {datosHoy.caloriasMeta} kcal
              </Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
              <View style={[styles.progressBarFill, { width: `${porcCalorias}%`, backgroundColor: ORIGINAL_COLORS.primaryGreen }]} />
            </View>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>
              {Math.max(datosHoy.caloriasMeta - datosHoy.caloriasConsumidas, 0)} kcal restantes para tu meta
            </Text>
          </View>

          <Text style={[styles.subHeader, { color: colors.textMain }]}>Macronutrientes (gramos)</Text>

          <View style={styles.macroItem}>
            <View style={styles.row}>
              <Text style={[styles.macroName, { color: colors.textMain }]}>Proteínas</Text>
              <Text style={[styles.macroData, { color: colors.textSecondary }]}>{datosHoy.proteinas}g / {datosHoy.proteinasMeta}g</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
              <View style={[styles.progressBarFill, { width: `${porcProteinas}%`, backgroundColor: ORIGINAL_COLORS.primaryGreen }]} />
            </View>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.row}>
              <Text style={[styles.macroName, { color: colors.textMain }]}>Carbohidratos</Text>
              <Text style={[styles.macroData, { color: colors.textSecondary }]}>{datosHoy.carbos}g / {datosHoy.carbosMeta}g</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
              <View style={[styles.progressBarFill, { width: `${porcCarbos}%`, backgroundColor: ORIGINAL_COLORS.blueCarbs }]} />
            </View>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.row}>
              <Text style={[styles.macroName, { color: colors.textMain }]}>Grasas</Text>
              <Text style={[styles.macroData, { color: colors.textSecondary }]}>{datosHoy.grasas}g / {datosHoy.grasasMeta}g</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
              <View style={[styles.progressBarFill, { width: `${porcGrasas}%`, backgroundColor: ORIGINAL_COLORS.orangeFats }]} />
            </View>
          </View>
        </View>

        {/* Gráfica Semanal — ahora con datos reales */}
        <View style={[styles.card, { backgroundColor: colors.mainCard }]}>
          <Text style={[styles.subHeader, { color: colors.textMain }]}>Actividad Semanal</Text>
          <View style={styles.chartContainer}>
            <View style={styles.yAxis}>
              {['100', '75', '50', '25', '0'].map(label => (
                <Text key={label} style={[styles.yText, { color: colors.textSecondary }]}>{label}%</Text>
              ))}
            </View>
            <View style={[styles.barsArea, { borderColor: colors.border }]}>
              {(semana.length > 0 ? semana : ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => ({ dia: d, calorias: 0 }))).map((item, index) => {
                const porcentaje = Math.min((item.calorias / (datosHoy.caloriasMeta || META_CALORIAS_DEFAULT)) * 100, 100);
                const color = porcentaje >= 80
                  ? ORIGINAL_COLORS.primaryGreen
                  : porcentaje >= 40
                  ? ORIGINAL_COLORS.orangeFats
                  : '#e2e8f0';
                return (
                  <View key={index} style={styles.barColumn}>
                    <View style={[styles.barWrapper, { backgroundColor: isDark ? '#2d3748' : '#f5f5f5' }]}>
                      <View style={[styles.barFillInner, {
                        height: `${porcentaje}%`,
                        backgroundColor: color
                      }]} />
                    </View>
                    <Text style={[styles.dayText, { color: colors.textSecondary }]}>{item.dia}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Leyenda de colores */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15, gap: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: ORIGINAL_COLORS.primaryGreen, marginRight: 5 }} />
              <Text style={{ fontSize: 10, color: colors.textSecondary }}>≥80% meta</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: ORIGINAL_COLORS.orangeFats, marginRight: 5 }} />
              <Text style={{ fontSize: 10, color: colors.textSecondary }}>40-79%</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#e2e8f0', marginRight: 5 }} />
              <Text style={{ fontSize: 10, color: colors.textSecondary }}>&lt;40%</Text>
            </View>
          </View>
        </View>

        {/* Distribución Hoy */}
        <View style={[styles.card, { backgroundColor: colors.mainCard }]}>
          <Text style={[styles.subHeader, { color: colors.textMain }]}>Distribución Hoy</Text>
          <View style={styles.chartRow}>
            <PieChart
              data={pieData}
              width={140}
              height={140}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"35"}
              hasLegend={false}
            />
            <View style={styles.customLegend}>
              {pieData.map((item, index) => (
                <View key={index} style={styles.legendItemCustom}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={[styles.legendTextCustom, { color: colors.textMain }]}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  topHeader: { padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  topHeaderText: { fontWeight: '500' },
  card: { borderRadius: 15, padding: 20, marginBottom: 20, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  metricSection: { marginBottom: 25 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metricLabel: { fontSize: 16, fontWeight: 'bold' },
  metricValue: { fontSize: 14 },
  progressBarBg: { height: 10, borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  subText: { fontSize: 12, marginTop: 8 },
  subHeader: { fontSize: 15, fontWeight: 'bold', marginTop: 10, marginBottom: 15 },
  macroItem: { marginBottom: 15 },
  macroName: { fontSize: 14 },
  macroData: { fontSize: 14 },
  chartContainer: { flexDirection: 'row', height: 180, marginTop: 10 },
  yAxis: { justifyContent: 'space-between', paddingBottom: 25, marginRight: 10 },
  yText: { fontSize: 10 },
  barsArea: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', borderLeftWidth: 1, borderBottomWidth: 1 },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barWrapper: { width: 14, height: '100%', borderRadius: 7, justifyContent: 'flex-end' },
  barFillInner: { width: '100%', borderRadius: 7 },
  dayText: { fontSize: 10, marginTop: 8 },
  chartRow: { flexDirection: 'row', alignItems: 'center' },
  customLegend: { flex: 1, paddingLeft: 10 },
  legendItemCustom: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  legendTextCustom: { fontSize: 12, fontWeight: 'bold' },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
});