import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import { useAppTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useScaledStyles } from '../../hooks/useScaledStyles';
import { getAllFoodRecords, deleteFoodRecord, type FoodRecord } from '../../services/database';
import { type AlimentoResultado } from '../../services/geminiService';

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseNum(val: string | undefined): number {
  if (!val) return 0;
  return parseFloat(val.replace(/[^\d.]/g, '')) || 0;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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
  return Array.from(map.entries()).map(([date, items]) => ({
    date,
    label: formatDate(date + 'T12:00:00'),
    items,
  }));
}

function parseAlimentos(json?: string): AlimentoResultado[] {
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

// ── Componente de un registro individual ─────────────────────────────────────

interface RecordCardProps {
  record: FoodRecord;
  colors: any;
  sc: (n: number) => number;
  onDelete: (id: number) => void;
}

function RecordCard({ record, colors, sc, onDelete }: RecordCardProps) {
  const [expanded, setExpanded] = useState(false);
  const alimentos = parseAlimentos(record.alimentos_json);

  return (
    <View style={[local.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Cabecera del registro */}
      <TouchableOpacity
        style={local.cardHeader}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.7}
      >
        <View style={[local.timeBox, { backgroundColor: colors.primaryGreen + '18' }]}>
          <MaterialCommunityIcons name="clock-outline" size={14} color={colors.primaryGreen} />
          <Text style={{ fontSize: sc(12), color: colors.primaryGreen, fontWeight: '600', marginLeft: 4 }}>
            {formatTime(record.created_at)}
          </Text>
        </View>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: sc(15), fontWeight: '700', color: colors.text }}>
            {alimentos.length > 0
              ? alimentos.map(a => a.nombre).join(', ')
              : 'Registro de comida'}
          </Text>
          <Text style={{ fontSize: sc(12), color: colors.textSecondary, marginTop: 2 }}>
            {record.total_calorias} · {alimentos.length} alimento{alimentos.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            onPress={() => onDelete(record.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.dangerRed} />
          </TouchableOpacity>
          <MaterialCommunityIcons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textMuted}
          />
        </View>
      </TouchableOpacity>

      {/* Totales rápidos */}
      <View style={[local.totalsRow, { borderTopColor: colors.border }]}>
        <View style={local.totalItem}>
          <Text style={{ fontSize: sc(10), color: colors.textMuted, fontWeight: '600' }}>CALORÍAS</Text>
          <Text style={{ fontSize: sc(14), color: colors.primaryGreen, fontWeight: '700' }}>{record.total_calorias}</Text>
        </View>
        <View style={[local.totalItem, { borderLeftWidth: 1, borderLeftColor: colors.border }]}>
          <Text style={{ fontSize: sc(10), color: colors.textMuted, fontWeight: '600' }}>PROTEÍNAS</Text>
          <Text style={{ fontSize: sc(14), color: colors.protein ?? '#8b5cf6', fontWeight: '700' }}>{record.total_proteinas}</Text>
        </View>
        <View style={[local.totalItem, { borderLeftWidth: 1, borderLeftColor: colors.border }]}>
          <Text style={{ fontSize: sc(10), color: colors.textMuted, fontWeight: '600' }}>CARBOS</Text>
          <Text style={{ fontSize: sc(14), color: colors.accentBlue, fontWeight: '700' }}>{record.total_carbohidratos}</Text>
        </View>
        <View style={[local.totalItem, { borderLeftWidth: 1, borderLeftColor: colors.border }]}>
          <Text style={{ fontSize: sc(10), color: colors.textMuted, fontWeight: '600' }}>GRASAS</Text>
          <Text style={{ fontSize: sc(14), color: colors.orangeFats, fontWeight: '700' }}>{record.total_grasas}</Text>
        </View>
      </View>

      {/* Detalle expandible de alimentos */}
      {expanded && alimentos.length > 0 && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Text style={{ fontSize: sc(12), color: colors.textMuted, fontWeight: '600', marginBottom: 10, marginTop: 4 }}>
            ALIMENTOS DETECTADOS
          </Text>
          {alimentos.map((a, i) => (
            <View
              key={i}
              style={[local.alimentoRow, { borderTopColor: colors.border }, i === 0 && { borderTopWidth: 0 }]}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={[local.dot, { backgroundColor: colors.accentBlue }]} />
                  <Text style={{ fontSize: sc(14), color: colors.text, fontWeight: '600', flex: 1 }}>
                    {a.nombre}
                  </Text>
                  {a.alertaAzucar && (
                    <MaterialCommunityIcons name="alert-circle" size={14} color={colors.dangerRed} />
                  )}
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6, marginLeft: 18 }}>
                  <Text style={{ fontSize: sc(12), color: colors.primaryGreen }}>{a.calorias}</Text>
                  <Text style={{ fontSize: sc(12), color: colors.textSecondary }}>· Prot: {a.proteinas}</Text>
                  <Text style={{ fontSize: sc(12), color: colors.textSecondary }}>· Carb: {a.carbohidratos}</Text>
                  <Text style={{ fontSize: sc(12), color: colors.textSecondary }}>· Gras: {a.grasas}</Text>
                  {a.azucares && (
                    <Text style={{ fontSize: sc(12), color: a.alertaAzucar ? colors.dangerRed : colors.textSecondary }}>
                      · Azúc: {a.azucares}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {expanded && alimentos.length === 0 && (
        <View style={{ padding: 16, paddingTop: 8 }}>
          <Text style={{ fontSize: sc(13), color: colors.textMuted, fontStyle: 'italic' }}>
            No hay detalle de alimentos disponible para este registro.
          </Text>
        </View>
      )}
    </View>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────

export default function HistoryScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const { sc } = useScaledStyles();

  const [records, setRecords] = useState<FoodRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const data = await getAllFoodRecords(user.id);
    setRecords(data);
    setLoading(false);
  }, [user?.id]);

  useFocusEffect(useCallback(() => { loadRecords(); }, [loadRecords]));

  const handleDelete = (id: number) => {
    Alert.alert(
      'Eliminar registro',
      '¿Seguro que quieres eliminar este registro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteFoodRecord(id);
            setRecords(prev => prev.filter(r => r.id !== id));
          },
        },
      ]
    );
  };

  const groups = groupByDate(records);

  // Totales globales
  const totalCals = records.reduce((s, r) => s + parseNum(r.total_calorias), 0);
  const totalRegistros = records.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Text style={{ fontSize: sc(28), fontWeight: '800', color: colors.text, marginBottom: 4 }}>
          Historial
        </Text>
        <Text style={{ fontSize: sc(14), color: colors.textSecondary, marginBottom: 24 }}>
          Todos tus registros de alimentación
        </Text>

        {/* Resumen global */}
        {records.length > 0 && (
          <View style={[local.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={local.summaryItem}>
              <MaterialCommunityIcons name="history" size={22} color={colors.primaryGreen} />
              <Text style={{ fontSize: sc(22), fontWeight: '800', color: colors.text, marginTop: 6 }}>
                {totalRegistros}
              </Text>
              <Text style={{ fontSize: sc(12), color: colors.textSecondary }}>Registros totales</Text>
            </View>
            <View style={[local.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={local.summaryItem}>
              <MaterialCommunityIcons name="fire" size={22} color={colors.orangeFats} />
              <Text style={{ fontSize: sc(22), fontWeight: '800', color: colors.text, marginTop: 6 }}>
                {Math.round(totalCals).toLocaleString()}
              </Text>
              <Text style={{ fontSize: sc(12), color: colors.textSecondary }}>kcal totales</Text>
            </View>
            <View style={[local.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={local.summaryItem}>
              <MaterialCommunityIcons name="calendar-range" size={22} color={colors.accentBlue} />
              <Text style={{ fontSize: sc(22), fontWeight: '800', color: colors.text, marginTop: 6 }}>
                {groups.length}
              </Text>
              <Text style={{ fontSize: sc(12), color: colors.textSecondary }}>Días registrados</Text>
            </View>
          </View>
        )}

        {/* Estado vacío */}
        {loading && (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <ActivityIndicator size="large" color={colors.primaryGreen} />
            <Text style={{ fontSize: sc(14), color: colors.textSecondary, marginTop: 16 }}>
              Cargando historial...
            </Text>
          </View>
        )}

        {!loading && records.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 60, paddingHorizontal: 32 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryGreen + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <MaterialCommunityIcons name="food-off" size={40} color={colors.primaryGreen} />
            </View>
            <Text style={{ fontSize: sc(18), fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 8 }}>
              Sin registros aún
            </Text>
            <Text style={{ fontSize: sc(14), color: colors.textSecondary, textAlign: 'center', lineHeight: sc(22) }}>
              Escanea tu primer platillo desde la pantalla de Inicio para empezar a ver tu historial aquí.
            </Text>
          </View>
        )}

        {/* Grupos por fecha */}
        {!loading && groups.map(group => (
          <View key={group.date} style={{ marginBottom: 24 }}>
            {/* Etiqueta de fecha */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 }}>
              <View style={[local.dateBadge, { backgroundColor: colors.primaryGreen + '18' }]}>
                <MaterialCommunityIcons name="calendar" size={14} color={colors.primaryGreen} />
              </View>
              <Text style={{ fontSize: sc(13), fontWeight: '700', color: colors.text, textTransform: 'capitalize', flex: 1 }}>
                {group.label}
              </Text>
              <Text style={{ fontSize: sc(12), color: colors.textMuted }}>
                {group.items.reduce((s, r) => s + parseNum(r.total_calorias), 0).toFixed(0)} kcal
              </Text>
            </View>

            {/* Registros del día */}
            {group.items.map(record => (
              <RecordCard
                key={record.id}
                record={record}
                colors={colors}
                sc={sc}
                onDelete={handleDelete}
              />
            ))}
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Estilos locales ───────────────────────────────────────────────────────────

const local = StyleSheet.create({
  summaryCard: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 28,
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 50,
    marginHorizontal: 8,
  },
  dateBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  totalsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  totalItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  alimentoRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
