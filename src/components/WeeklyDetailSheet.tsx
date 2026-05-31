/**
 * WeeklyDetailSheet
 *
 * Bottom sheet que muestra el desglose completo de la actividad semanal.
 * Se abre desde el botón "VER MÁS" de la gráfica de Actividad Semanal.
 */
import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Animated, PanResponder, Dimensions,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../contexts/ThemeContext';
import { useScaledStyles } from '../hooks/useScaledStyles';
import { type FoodRecord } from '../services/database';
import { type AlimentoResultado } from '../services/geminiService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.78;

interface Props {
  visible: boolean;
  weekRecords: FoodRecord[];
  onClose: () => void;
}

function parseNum(val: string | undefined) {
  return parseFloat((val ?? '0').replace(/[^\d.]/g, '')) || 0;
}

function parseAlimentos(json?: string): AlimentoResultado[] {
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

function groupByDate(records: FoodRecord[]): { date: string; label: string; items: FoodRecord[] }[] {
  const map = new Map<string, FoodRecord[]>();
  for (const r of records) {
    const key = r.created_at.split('T')[0];
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0])) // más reciente primero
    .map(([date, items]) => ({
      date,
      label: formatDate(date + 'T12:00:00'),
      items,
    }));
}

// ── Fila de un registro individual ───────────────────────────────────────────

interface RecordRowProps {
  record: FoodRecord;
  colors: any;
  sc: (n: number) => number;
  isLast: boolean;
}

function RecordRow({ record, colors, sc, isLast }: RecordRowProps) {
  const [expanded, setExpanded] = useState(false);
  const alimentos = parseAlimentos(record.alimentos_json);

  return (
    <View>
      <TouchableOpacity
        style={local.recordHeader}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.7}
      >
        <View style={[local.timeBox, { backgroundColor: colors.primaryGreen + '18' }]}>
          <MaterialCommunityIcons name="clock-outline" size={12} color={colors.primaryGreen} />
          <Text style={{ fontSize: sc(11), color: colors.primaryGreen, fontWeight: '600', marginLeft: 4 }}>
            {formatTime(record.created_at)}
          </Text>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontSize: sc(13), fontWeight: '700', color: colors.text }} numberOfLines={1}>
            {alimentos.length > 0
              ? alimentos.map(a => a.nombre).join(', ')
              : 'Registro de comida'}
          </Text>
          <Text style={{ fontSize: sc(11), color: colors.textSecondary, marginTop: 1 }}>
            {record.total_calorias} · {record.total_proteinas} prot · {record.total_carbohidratos} carb
          </Text>
        </View>
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      {expanded && alimentos.length > 0 && (
        <View style={{ paddingLeft: 12, paddingBottom: 8 }}>
          {alimentos.map((a, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <View style={[local.dot, { backgroundColor: colors.accentBlue }]} />
              <Text style={{ fontSize: sc(12), color: colors.text, flex: 1 }}>
                {a.nombre}
              </Text>
              <Text style={{ fontSize: sc(11), color: colors.primaryGreen }}>{a.calorias}</Text>
              {a.alertaAzucar && (
                <MaterialCommunityIcons name="alert-circle" size={12} color={colors.dangerRed} />
              )}
            </View>
          ))}
        </View>
      )}

      {!isLast && (
        <View style={[local.separator, { backgroundColor: colors.border }]} />
      )}
    </View>
  );
}

// ── Sheet principal ───────────────────────────────────────────────────────────

export default function WeeklyDetailSheet({ visible, weekRecords, onClose }: Props) {
  const { colors } = useAppTheme();
  const { sc } = useScaledStyles();

  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(SHEET_HEIGHT);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 3,
        speed: 14,
      }).start();
    }
  }, [visible]);

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5 && g.dy > 0,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80 || g.vy > 0.5) {
          closeSheet();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const groups = groupByDate(weekRecords);

  // Totales de la semana
  const totalCals = weekRecords.reduce((s, r) => s + parseNum(r.total_calorias), 0);
  const totalProt = weekRecords.reduce((s, r) => s + parseNum(r.total_proteinas), 0);
  const totalCarbs = weekRecords.reduce((s, r) => s + parseNum(r.total_carbohidratos), 0);
  const totalFats = weekRecords.reduce((s, r) => s + parseNum(r.total_grasas), 0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeSheet}
    >
      <TouchableOpacity
        style={local.overlay}
        activeOpacity={1}
        onPress={closeSheet}
      />

      <Animated.View
        style={[local.sheet, { backgroundColor: colors.card, transform: [{ translateY }] }]}
      >
        {/* Handle */}
        <View style={local.handleArea} {...panResponder.panHandlers}>
          <View style={[local.handle, { backgroundColor: colors.border }]} />
        </View>

        {/* Header */}
        <View style={local.header}>
          <Text style={{ fontSize: sc(20), fontWeight: '800', color: colors.text }}>
            Actividad Semanal
          </Text>
          <TouchableOpacity
            onPress={closeSheet}
            style={[local.closeBtn, { backgroundColor: colors.cardAlt ?? colors.background }]}
          >
            <MaterialCommunityIcons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Resumen de totales */}
        {weekRecords.length > 0 && (
          <View style={[local.summaryRow, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <View style={local.summaryItem}>
              <MaterialCommunityIcons name="fire" size={18} color={colors.orangeFats} />
              <Text style={{ fontSize: sc(16), fontWeight: '800', color: colors.text, marginTop: 4 }}>
                {Math.round(totalCals).toLocaleString()}
              </Text>
              <Text style={{ fontSize: sc(10), color: colors.textSecondary }}>kcal</Text>
            </View>
            <View style={[local.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={local.summaryItem}>
              <MaterialCommunityIcons name="food-drumstick" size={18} color={colors.primaryGreen} />
              <Text style={{ fontSize: sc(16), fontWeight: '800', color: colors.text, marginTop: 4 }}>
                {Math.round(totalProt)}g
              </Text>
              <Text style={{ fontSize: sc(10), color: colors.textSecondary }}>proteínas</Text>
            </View>
            <View style={[local.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={local.summaryItem}>
              <MaterialCommunityIcons name="barley" size={18} color={colors.accentBlue} />
              <Text style={{ fontSize: sc(16), fontWeight: '800', color: colors.text, marginTop: 4 }}>
                {Math.round(totalCarbs)}g
              </Text>
              <Text style={{ fontSize: sc(10), color: colors.textSecondary }}>carbos</Text>
            </View>
            <View style={[local.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={local.summaryItem}>
              <MaterialCommunityIcons name="water" size={18} color={colors.orangeFats} />
              <Text style={{ fontSize: sc(16), fontWeight: '800', color: colors.text, marginTop: 4 }}>
                {Math.round(totalFats)}g
              </Text>
              <Text style={{ fontSize: sc(10), color: colors.textSecondary }}>grasas</Text>
            </View>
          </View>
        )}

        {/* Lista de registros agrupados por día */}
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {weekRecords.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <MaterialCommunityIcons name="food-off" size={44} color={colors.textMuted} />
              <Text style={{ fontSize: sc(15), color: colors.textMuted, marginTop: 14, textAlign: 'center' }}>
                No hay registros esta semana.{'\n'}¡Escanea tu primer platillo!
              </Text>
            </View>
          ) : (
            groups.map(group => {
              const dayCals = group.items.reduce((s, r) => s + parseNum(r.total_calorias), 0);
              return (
                <View key={group.date} style={{ marginBottom: 20 }}>
                  {/* Cabecera del día */}
                  <View style={[local.dayHeader, { borderColor: colors.border }]}>
                    <View style={[local.dateBadge, { backgroundColor: colors.primaryGreen + '18' }]}>
                      <MaterialCommunityIcons name="calendar" size={13} color={colors.primaryGreen} />
                    </View>
                    <Text style={{ fontSize: sc(13), fontWeight: '700', color: colors.text, flex: 1, textTransform: 'capitalize', marginLeft: 8 }}>
                      {group.label}
                    </Text>
                    <Text style={{ fontSize: sc(12), color: colors.primaryGreen, fontWeight: '700' }}>
                      {Math.round(dayCals)} kcal
                    </Text>
                  </View>

                  {/* Registros del día */}
                  <View style={[local.dayCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    {group.items.map((record, idx) => (
                      <RecordRow
                        key={record.id}
                        record={record}
                        colors={colors}
                        sc={sc}
                        isLast={idx === group.items.length - 1}
                      />
                    ))}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const local = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  handleArea: { alignItems: 'center', paddingVertical: 12 },
  handle: { width: 40, height: 4, borderRadius: 2 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, marginHorizontal: 4 },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  dateBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  separator: { height: 1 },
  dot: { width: 7, height: 7, borderRadius: 4 },
});
