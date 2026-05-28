import React, { useCallback, useState } from 'react';
import { Dimensions, Modal, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { useFocusEffect } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { getTodayFoodRecords, getWeekFoodRecords, type FoodRecord } from '../../services/database';
import { styles } from './ExploreScreen.styles';

const screenWidth = Dimensions.get('window').width;

// Helper: parse "XX g" or "XXX kcal" to number
function parseNutrient(val: string | undefined): number {
  if (!val) return 0;
  return parseFloat(val.replace(/[^\d.]/g, '')) || 0;
}

// Helper: get day name abbreviation from date string
function getDayAbbr(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return days[date.getDay()] || '?';
}

export default function ExploreScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const [todayRecords, setTodayRecords] = useState<FoodRecord[]>([]);
  const [weekRecords, setWeekRecords] = useState<FoodRecord[]>([]);
  const [showWeekModal, setShowWeekModal] = useState(false);

  // Reload data every time the tab is focused
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        getTodayFoodRecords(user.id).then(setTodayRecords);
        getWeekFoodRecords(user.id).then(setWeekRecords);
      }
    }, [user?.id])
  );

  // --- CÁLCULOS DEL DÍA ---
  const todayCals = todayRecords.reduce((s, r) => s + parseNutrient(r.total_calorias), 0);
  const todayCarbs = todayRecords.reduce((s, r) => s + parseNutrient(r.total_carbohidratos), 0);
  const todayProtein = todayRecords.reduce((s, r) => s + parseNutrient(r.total_proteinas), 0);
  const todayFats = todayRecords.reduce((s, r) => s + parseNutrient(r.total_grasas), 0);

  const calGoal = 2000;
  const proteinGoal = 150;
  const carbsGoal = 200;
  const fatsGoal = 65;

  const calPercent = Math.min((todayCals / calGoal) * 100, 100);
  const proteinPercent = Math.min((todayProtein / proteinGoal) * 100, 100);
  const carbsPercent = Math.min((todayCarbs / carbsGoal) * 100, 100);
  const fatsPercent = Math.min((todayFats / fatsGoal) * 100, 100);

  // --- PIE CHART DATA ---
  const totalMacros = todayProtein + todayFats + todayCarbs;
  const proteinPct = totalMacros > 0 ? Math.round((todayProtein / totalMacros) * 100) : 33;
  const fatsPct = totalMacros > 0 ? Math.round((todayFats / totalMacros) * 100) : 33;
  const carbsPct = totalMacros > 0 ? 100 - proteinPct - fatsPct : 34;

  const pieData = [
    { name: `Proteínas: ${proteinPct}%`, population: Math.max(proteinPct, 1), color: colors.primaryGreen, legendFontColor: colors.primaryGreen, legendFontSize: 12 },
    { name: `Grasas: ${fatsPct}%`, population: Math.max(fatsPct, 1), color: colors.orangeFats, legendFontColor: colors.orangeFats, legendFontSize: 12 },
    { name: `Carbohidratos: ${carbsPct}%`, population: Math.max(carbsPct, 1), color: colors.accentBlue, legendFontColor: colors.accentBlue, legendFontSize: 12 },
  ];

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  // --- WEEKLY BAR DATA ---
  // Group week records by day and sum fats (as example macro)
  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const dayData: Record<string, number> = {};
  dayLabels.forEach(d => { dayData[d] = 0; });

  weekRecords.forEach(r => {
    const abbr = getDayAbbr(r.created_at);
    dayData[abbr] = (dayData[abbr] || 0) + parseNutrient(r.total_grasas);
  });

  const maxDayVal = Math.max(...Object.values(dayData), 1);
  const barItems = dayLabels.map(d => ({
    d,
    h: `${Math.round((dayData[d] / maxDayVal) * 100)}%`,
  }));

  // Y-axis labels for bar chart
  const yMax = Math.ceil(maxDayVal / 10) * 10 || 50;
  const yLabels = [String(yMax), String(Math.round(yMax * 0.75)), String(Math.round(yMax * 0.5)), String(Math.round(yMax * 0.25)), '0'];

  // --- DATOS SEMANALES COMPLETOS POR DÍA (para modal VER MÁS) ---
  const weekDaysFull = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const weekByDay: Record<string, { cals: number; protein: number; carbs: number; fats: number; count: number }> = {};
  weekDaysFull.forEach(d => { weekByDay[d] = { cals: 0, protein: 0, carbs: 0, fats: 0, count: 0 }; });

  weekRecords.forEach(r => {
    const abbr = getDayAbbr(r.created_at);
    if (weekByDay[abbr]) {
      weekByDay[abbr].cals += parseNutrient(r.total_calorias);
      weekByDay[abbr].protein += parseNutrient(r.total_proteinas);
      weekByDay[abbr].carbs += parseNutrient(r.total_carbohidratos);
      weekByDay[abbr].fats += parseNutrient(r.total_grasas);
      weekByDay[abbr].count += 1;
    }
  });

  const weekTotalCals = weekRecords.reduce((s, r) => s + parseNutrient(r.total_calorias), 0);
  const weekTotalProt = weekRecords.reduce((s, r) => s + parseNutrient(r.total_proteinas), 0);
  const weekTotalCarbs = weekRecords.reduce((s, r) => s + parseNutrient(r.total_carbohidratos), 0);
  const weekTotalFats = weekRecords.reduce((s, r) => s + parseNutrient(r.total_grasas), 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* ── MODAL DESGLOSE SEMANAL ── */}
      <Modal visible={showWeekModal} animationType="slide" transparent onRequestClose={() => setShowWeekModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          {/* Toca el fondo para cerrar */}
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            activeOpacity={1}
            onPress={() => setShowWeekModal(false)}
          />
          <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '85%' }}>

            {/* Indicador de arrastre */}
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
            </View>

            {/* Header modal */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>Desglose semanal</Text>
              <TouchableOpacity onPress={() => setShowWeekModal(false)}>
                <Ionicons name="close-circle" size={28} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Totales de la semana */}
            <View style={{ flexDirection: 'row', backgroundColor: colors.cardAlt, borderRadius: 16, padding: 16, marginBottom: 20, gap: 8 }}>
              {[
                { label: 'Calorías', value: `${Math.round(weekTotalCals)} kcal`, color: colors.primaryGreen },
                { label: 'Proteínas', value: `${Math.round(weekTotalProt)}g`, color: colors.protein },
                { label: 'Carbos', value: `${Math.round(weekTotalCarbs)}g`, color: colors.accentBlue },
                { label: 'Grasas', value: `${Math.round(weekTotalFats)}g`, color: colors.orangeFats },
              ].map(item => (
                <View key={item.label} style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: item.color, fontWeight: 'bold', fontSize: 14 }}>{item.value}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 2 }}>{item.label}</Text>
                </View>
              ))}
            </View>

            {/* Desglose por día */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {weekDaysFull.map((dia, i) => {
                const d = weekByDay[dia];
                const hasData = d.count > 0;
                return (
                  <View key={dia} style={{
                    borderTopWidth: i > 0 ? 1 : 0,
                    borderTopColor: colors.border,
                    paddingTop: i > 0 ? 14 : 0,
                    marginTop: i > 0 ? 14 : 0,
                    opacity: hasData ? 1 : 0.4,
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 15 }}>{dia}</Text>
                      {hasData ? (
                        <Text style={{ color: colors.primaryGreen, fontWeight: 'bold' }}>{Math.round(d.cals)} kcal</Text>
                      ) : (
                        <Text style={{ color: colors.textMuted, fontSize: 12 }}>Sin registros</Text>
                      )}
                    </View>
                    {hasData && (
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <View style={{ flex: 1, backgroundColor: colors.protein + '20', borderRadius: 8, padding: 8, alignItems: 'center' }}>
                          <Text style={{ color: colors.protein, fontWeight: 'bold', fontSize: 13 }}>{Math.round(d.protein)}g</Text>
                          <Text style={{ color: colors.textMuted, fontSize: 10 }}>Proteínas</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.accentBlue + '20', borderRadius: 8, padding: 8, alignItems: 'center' }}>
                          <Text style={{ color: colors.accentBlue, fontWeight: 'bold', fontSize: 13 }}>{Math.round(d.carbs)}g</Text>
                          <Text style={{ color: colors.textMuted, fontSize: 10 }}>Carbos</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.orangeFats + '20', borderRadius: 8, padding: 8, alignItems: 'center' }}>
                          <Text style={{ color: colors.orangeFats, fontWeight: 'bold', fontSize: 13 }}>{Math.round(d.fats)}g</Text>
                          <Text style={{ color: colors.textMuted, fontSize: 10 }}>Grasas</Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.mainTitle, { color: colors.text }]}>Progreso Nutricional</Text>

        {/* TARJETA 1: PANEL DE PROGRESO */}
        <View style={[styles.glassCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Resumen del Día</Text>
          
          <View style={styles.overviewContainer}>
            <View style={styles.pieContainer}>
              <View style={styles.pieCenterBox}>
                <MaterialCommunityIcons name="fire" size={24} color={colors.orangeFats} />
                <Text style={[styles.pieCenterTitle, { color: colors.text }]}>Calorías</Text>
                <Text style={[styles.pieCenterSub, { color: colors.textMuted }]}>{Math.round(todayCals)} / {calGoal}</Text>
                <Text style={[styles.pieCenterPercent, { color: colors.primaryGreen }]}>{Math.round(calPercent)}%</Text>
              </View>
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

            <View style={styles.macroList}>
              <View style={styles.macroRow}>
                <View style={[styles.macroIconBox, { backgroundColor: colors.primaryGreen + '1A' }]}><MaterialCommunityIcons name="food-drumstick" size={16} color={colors.primaryGreen} /></View>
                <View style={styles.macroTextCol}>
                  <View style={styles.macroHeaderRow}>
                    <Text style={[styles.macroName, { color: colors.text }]}>Proteínas</Text>
                    <Text style={[styles.macroPct, { color: colors.primaryGreen }]}>{Math.round(proteinPercent)}%</Text>
                  </View>
                  <Text style={[styles.macroData, { color: colors.textSecondary }]}>{Math.round(todayProtein)}g / {proteinGoal}g</Text>
                </View>
              </View>
              
              <View style={styles.macroRow}>
                <View style={[styles.macroIconBox, { backgroundColor: colors.accentBlue + '1A' }]}><MaterialCommunityIcons name="barley" size={16} color={colors.accentBlue} /></View>
                <View style={styles.macroTextCol}>
                  <View style={styles.macroHeaderRow}>
                    <Text style={[styles.macroName, { color: colors.text }]}>Carbohidratos</Text>
                    <Text style={[styles.macroPct, { color: colors.accentBlue }]}>{Math.round(carbsPercent)}%</Text>
                  </View>
                  <Text style={[styles.macroData, { color: colors.textSecondary }]}>{Math.round(todayCarbs)}g / {carbsGoal}g</Text>
                </View>
              </View>

              <View style={styles.macroRow}>
                <View style={[styles.macroIconBox, { backgroundColor: colors.orangeFats + '1A' }]}><MaterialCommunityIcons name="water" size={16} color={colors.orangeFats} /></View>
                <View style={styles.macroTextCol}>
                  <View style={styles.macroHeaderRow}>
                    <Text style={[styles.macroName, { color: colors.text }]}>Grasas</Text>
                    <Text style={[styles.macroPct, { color: colors.orangeFats }]}>{Math.round(fatsPercent)}%</Text>
                  </View>
                  <Text style={[styles.macroData, { color: colors.textSecondary }]}>{Math.round(todayFats)}g / {fatsGoal}g</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* TARJETA 2: GRÁFICA SEMANAL */}
        <View style={[styles.glassCard, { backgroundColor: colors.card, borderColor: colors.border, flex: 1 }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Actividad Semanal</Text>
          
          <View style={styles.barChartContainer}>
            <View style={styles.barsArea}>
              {barItems.map((item, index) => (
                <View key={index} style={styles.barColumn}>
                  <View style={[styles.barWrapper, { backgroundColor: colors.border }]}>
                    <View style={[styles.barFillInner, { height: item.h as any, backgroundColor: colors.accentBlue }]} />
                  </View>
                  <Text style={[styles.dayText, { color: colors.textMuted }]}>{item.d}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.weeklyFooter, { borderTopColor: colors.border }]}>
            <Text style={[styles.weeklyFooterText, { color: colors.textMuted }]}>Total grasas semana: <Text style={{ color: colors.text }}>{Math.round(Object.values(dayData).reduce((a, b) => a + b, 0))} g</Text></Text>
            <TouchableOpacity onPress={() => setShowWeekModal(true)}>
              <Text style={[styles.viewMoreText, { color: colors.primaryGreen }]}>VER MÁS</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
