import React, { useCallback, useState } from 'react';
import { Dimensions, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
            <TouchableOpacity>
              <Text style={[styles.viewMoreText, { color: colors.primaryGreen }]}>VER MÁS</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
