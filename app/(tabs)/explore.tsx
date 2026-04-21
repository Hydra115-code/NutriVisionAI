import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const COLORS = {
  primaryGreen: '#00b347',
  blueCarbs: '#3b82f6',
  orangeFats: '#f59e0b',
  bgLight: '#f8f9fa',
  white: '#fff',
  textMain: '#1a2a3a',
  textSec: '#64748b'
};

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const pieData = [
    {
      name: 'Proteínas: 19%',
      population: 19,
      color: COLORS.primaryGreen,
      legendFontColor: COLORS.primaryGreen,
      legendFontSize: 12,
    },
    {
      name: 'Grasas: 18%',
      population: 18,
      color: COLORS.orangeFats,
      legendFontColor: COLORS.orangeFats,
      legendFontSize: 12,
    },
    {
      name: 'Carbohidratos: 63%',
      population: 63,
      color: COLORS.blueCarbs,
      legendFontColor: COLORS.blueCarbs,
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ENCABEZADO */}
        <View style={styles.topHeader}>
          <Text style={styles.topHeaderText}>Registros de comida</Text>
        </View>

        {/* TARJETA 1: PANEL DE PROGRESO */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📈 Panel de Progreso</Text>
          <View style={styles.metricSection}>
            <View style={styles.row}>
              <Text style={styles.metricLabel}>Calorías del día</Text>
              <Text style={styles.metricValue}>1450 / 2000 kcal</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '72.5%', backgroundColor: '#111' }]} />
            </View>
            <Text style={styles.subText}>550 kcal restantes para alcanzar tu meta</Text>
          </View>

          <Text style={styles.subHeader}>Macronutrientes vs Meta (gramos)</Text>
          <View style={styles.macroItem}>
            <View style={styles.row}><Text style={styles.macroName}>Proteínas</Text><Text style={styles.macroData}>53g / 150g</Text></View>
            <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '35%', backgroundColor: COLORS.primaryGreen }]} /></View>
          </View>
          <View style={styles.macroItem}>
            <View style={styles.row}><Text style={styles.macroName}>Carbohidratos</Text><Text style={styles.macroData}>172g / 200g</Text></View>
            <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '86%', backgroundColor: COLORS.blueCarbs }]} /></View>
          </View>
          <View style={styles.macroItem}>
            <View style={styles.row}><Text style={styles.macroName}>Grasas</Text><Text style={styles.macroData}>50g / 65g</Text></View>
            <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '77%', backgroundColor: COLORS.orangeFats }]} /></View>
          </View>
        </View>

        {/* TARJETA 2: GRÁFICA SEMANAL */}
        <View style={styles.card}>
          <Text style={styles.subHeader}>Macronutrientes Diarios (Última semana)</Text>
          <View style={styles.chartContainer}>
            <View style={styles.yAxis}>
              {['200', '150', '100', '50', '0'].map(label => <Text key={label} style={styles.yText}>{label}</Text>)}
            </View>
            <View style={styles.barsArea}>
              {[
                { d: 'Lun', h: '45%' }, { d: 'Mar', h: '55%' }, { d: 'Mié', h: '50%' }, 
                { d: 'Jue', h: '52%' }, { d: 'Vie', h: '60%' }, { d: 'Sáb', h: '48%' }, { d: 'Dom', h: '55%' }
              ].map((item, index) => (
                <View key={index} style={styles.barColumn}>
                  <View style={styles.barWrapper}>
                    <View style={[styles.barFillInner, { height: item.h as any }]} />
                  </View>
                  <Text style={styles.dayText}>{item.d}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.legendContainer}>
             <View style={styles.legendItem}><View style={[styles.dotSmall, {backgroundColor: COLORS.primaryGreen}]} /><Text style={styles.legendText}>Proteínas (g)</Text></View>
             <View style={styles.legendItem}><View style={[styles.dotSmall, {backgroundColor: COLORS.blueCarbs}]} /><Text style={styles.legendText}>Carbohidratos (g)</Text></View>
             <View style={styles.legendItem}><View style={[styles.dotSmall, {backgroundColor: COLORS.orangeFats}]} /><Text style={styles.legendText}>Grasas (g)</Text></View>
          </View>
        </View>

        {/* TARJETA 3: DISTRIBUCIÓN (CORRECCIÓN DEFINITIVA DE RECORTE) */}
        <View style={styles.card}>
          <Text style={styles.subHeader}>Distribución de Macronutrientes Hoy</Text>
          <View style={styles.chartRow}>
            <View style={styles.pieWrapper}>
              <PieChart
                data={pieData}
                // Reducimos el ancho significativamente para que el SVG no se salga
                width={140} 
                height={140}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"35"} // Empuja el círculo hacia el centro del recorte
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
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  scrollContent: { padding: 20 },
  topHeader: { backgroundColor: '#d1f2eb', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  topHeaderText: { color: '#1a2a3a', fontWeight: '500' },
  card: { backgroundColor: COLORS.white, borderRadius: 15, padding: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 20 },
  metricSection: { marginBottom: 25 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metricLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
  metricValue: { fontSize: 14, color: COLORS.textSec },
  progressBarBg: { height: 10, backgroundColor: '#eee', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  subText: { fontSize: 12, color: COLORS.textSec, marginTop: 8 },
  subHeader: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain, marginTop: 10, marginBottom: 15 },
  macroItem: { marginBottom: 15 },
  macroName: { fontSize: 14, color: COLORS.textMain },
  macroData: { fontSize: 14, color: COLORS.textSec },
  
  // Gráfica Semanal
  chartContainer: { flexDirection: 'row', height: 180, marginTop: 10, paddingRight: 10 },
  yAxis: { justifyContent: 'space-between', paddingBottom: 25, marginRight: 10 },
  yText: { fontSize: 10, color: '#999', textAlign: 'right' },
  barsArea: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', borderLeftWidth: 1, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 5 },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barWrapper: { width: 14, height: '100%', backgroundColor: '#f5f5f5', borderRadius: 7, justifyContent: 'flex-end' },
  barFillInner: { width: '100%', backgroundColor: COLORS.orangeFats, borderRadius: 7 },
  dayText: { fontSize: 10, color: '#666', marginTop: 8 },
  
  // Leyendas
  legendContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  dotSmall: { width: 8, height: 8, borderRadius: 2, marginRight: 5 },
  legendText: { fontSize: 10, color: '#666' },
  
  // GRÁFICA DE PASTEL (Ajuste crítico)
  chartRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start',
    marginTop: 10 
  },
  pieWrapper: { 
    width: 140, // Ancho fijo para que no intente expandirse
    height: 140, 
    justifyContent: 'center', 
    alignItems: 'center',
    overflow: 'hidden' // Corta cualquier borde sobrante del SVG
  },
  customLegend: { 
    flex: 1, 
    paddingLeft: 10, 
    justifyContent: 'center' 
  },
  legendItemCustom: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  legendTextCustom: { 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  dot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    marginRight: 8 
  },
});