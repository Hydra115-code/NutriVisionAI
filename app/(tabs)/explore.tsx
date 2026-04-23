import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;

// Mantenemos tus constantes de color originales como base
const ORIGINAL_COLORS = {
  primaryGreen: '#00b347',
  blueCarbs: '#3b82f6',
  orangeFats: '#f59e0b',
  bgLight: '#f8f9fa',
  white: '#fff',
  textMain: '#1a2a3a',
  textSec: '#64748b'
};

export default function ProgressScreen() {
  const { colors, isDark } = useTheme();

  const pieData = [
    {
      name: 'Proteínas: 19%',
      population: 19,
      color: ORIGINAL_COLORS.primaryGreen,
      legendFontColor: ORIGINAL_COLORS.primaryGreen,
      legendFontSize: 12,
    },
    {
      name: 'Grasas: 18%',
      population: 18,
      color: ORIGINAL_COLORS.orangeFats,
      legendFontColor: ORIGINAL_COLORS.orangeFats,
      legendFontSize: 12,
    },
    {
      name: 'Carbohidratos: 63%',
      population: 63,
      color: ORIGINAL_COLORS.blueCarbs,
      legendFontColor: ORIGINAL_COLORS.blueCarbs,
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: colors.mainCard,
    backgroundGradientTo: colors.mainCard,
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ENCABEZADO - Mantenemos tu estilo original */}
        <View style={[styles.topHeader, { backgroundColor: isDark ? '#1e293b' : '#d1f2eb' }]}>
          <Text style={[styles.topHeaderText, { color: colors.textMain }]}>Registros de comida</Text>
        </View>

        {/* TARJETA 1: PANEL DE PROGRESO */}
        <View style={[styles.card, { backgroundColor: colors.mainCard }]}>
          <Text style={[styles.cardTitle, { color: colors.textMain }]}>📈 Panel de Progreso</Text>
          <View style={styles.metricSection}>
            <View style={styles.row}>
              <Text style={[styles.metricLabel, { color: colors.textMain }]}>Calorías del día</Text>
              <Text style={[styles.metricValue, { color: colors.textSecondary }]}>1450 / 2000 kcal</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
              <View style={[styles.progressBarFill, { width: '72.5%', backgroundColor: isDark ? ORIGINAL_COLORS.primaryGreen : '#111' }]} />
            </View>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>550 kcal restantes para alcanzar tu meta</Text>
          </View>

          <Text style={[styles.subHeader, { color: colors.textMain }]}>Macronutrientes vs Meta (gramos)</Text>
          
          <View style={styles.macroItem}>
            <View style={styles.row}>
              <Text style={[styles.macroName, { color: colors.textMain }]}>Proteínas</Text>
              <Text style={[styles.macroData, { color: colors.textSecondary }]}>53g / 150g</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
              <View style={[styles.progressBarFill, { width: '35%', backgroundColor: ORIGINAL_COLORS.primaryGreen }]} />
            </View>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.row}>
              <Text style={[styles.macroName, { color: colors.textMain }]}>Carbohidratos</Text>
              <Text style={[styles.macroData, { color: colors.textSecondary }]}>172g / 200g</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
              <View style={[styles.progressBarFill, { width: '86%', backgroundColor: ORIGINAL_COLORS.blueCarbs }]} />
            </View>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.row}>
              <Text style={[styles.macroName, { color: colors.textMain }]}>Grasas</Text>
              <Text style={[styles.macroData, { color: colors.textSecondary }]}>50g / 65g</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
              <View style={[styles.progressBarFill, { width: '77%', backgroundColor: ORIGINAL_COLORS.orangeFats }]} />
            </View>
          </View>
        </View>

        {/* TARJETA 2: GRÁFICA SEMANAL */}
        <View style={[styles.card, { backgroundColor: colors.mainCard }]}>
          <Text style={[styles.subHeader, { color: colors.textMain }]}>Macronutrientes Diarios (Última semana)</Text>
          <View style={styles.chartContainer}>
            <View style={styles.yAxis}>
              {['200', '150', '100', '50', '0'].map(label => (
                <Text key={label} style={[styles.yText, { color: colors.textSecondary }]}>{label}</Text>
              ))}
            </View>
            <View style={[styles.barsArea, { borderColor: colors.border }]}>
              {[
                { d: 'Lun', h: '45%' }, { d: 'Mar', h: '55%' }, { d: 'Mié', h: '50%' }, 
                { d: 'Jue', h: '52%' }, { d: 'Vie', h: '60%' }, { d: 'Sáb', h: '48%' }, { d: 'Dom', h: '55%' }
              ].map((item, index) => (
                <View key={index} style={styles.barColumn}>
                  <View style={[styles.barWrapper, { backgroundColor: isDark ? '#2d3748' : '#f5f5f5' }]}>
                    <View style={[styles.barFillInner, { height: item.h as any, backgroundColor: ORIGINAL_COLORS.orangeFats }]} />
                  </View>
                  <Text style={[styles.dayText, { color: colors.textSecondary }]}>{item.d}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.legendContainer}>
             <View style={styles.legendItem}>
               <View style={[styles.dotSmall, {backgroundColor: ORIGINAL_COLORS.primaryGreen}]} />
               <Text style={[styles.legendText, { color: colors.textSecondary }]}>Proteínas (g)</Text>
             </View>
             <View style={styles.legendItem}>
               <View style={[styles.dotSmall, {backgroundColor: ORIGINAL_COLORS.blueCarbs}]} />
               <Text style={[styles.legendText, { color: colors.textSecondary }]}>Carbohidratos (g)</Text>
             </View>
             <View style={styles.legendItem}>
               <View style={[styles.dotSmall, {backgroundColor: ORIGINAL_COLORS.orangeFats}]} />
               <Text style={[styles.legendText, { color: colors.textSecondary }]}>Grasas (g)</Text>
             </View>
          </View>
        </View>

        {/* TARJETA 3: DISTRIBUCIÓN DE MACROS */}
        <View style={[styles.card, { backgroundColor: colors.mainCard }]}>
          <Text style={[styles.subHeader, { color: colors.textMain }]}>Distribución de Macronutrientes Hoy</Text>
          <View style={styles.chartRow}>
            <View style={styles.pieWrapper}>
              <PieChart
                data={pieData}
                width={140} 
                height={140}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"35"} 
                center={[0, 0]}
                hasLegend={false}
              />
            </View>
            
            <View style={styles.customLegend}>
              {pieData.map((item, index) => (
                <View key={index} style={styles.legendItemCustom}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={[styles.legendTextCustom, { color: item.color }]}>
                    {item.name}
                  </Text>
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
  card: { borderRadius: 15, padding: 20, marginBottom: 20, elevation: 3, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
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
  
  chartContainer: { flexDirection: 'row', height: 180, marginTop: 10, paddingRight: 10 },
  yAxis: { justifyContent: 'space-between', paddingBottom: 25, marginRight: 10 },
  yText: { fontSize: 10, textAlign: 'right' },
  barsArea: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', borderLeftWidth: 1, borderBottomWidth: 1, paddingBottom: 5 },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barWrapper: { width: 14, height: '100%', borderRadius: 7, justifyContent: 'flex-end' },
  barFillInner: { width: '100%', borderRadius: 7 },
  dayText: { fontSize: 10, marginTop: 8 },
  
  legendContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  dotSmall: { width: 8, height: 8, borderRadius: 2, marginRight: 5 },
  legendText: { fontSize: 10 },
  
  chartRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 10 },
  pieWrapper: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  customLegend: { flex: 1, paddingLeft: 10, justifyContent: 'center' },
  legendItemCustom: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  legendTextCustom: { fontSize: 12, fontWeight: 'bold' },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
});