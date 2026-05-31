/**
 * TodayHistorySheet
 *
 * Bottom sheet que muestra "Lo que comiste hoy".
 * Usa Modal nativo para evitar bloquear el scroll del dashboard
 * y no interferir con el layout de SafeAreaView.
 */
import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Animated, PanResponder, Dimensions,
  Modal, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../contexts/ThemeContext';
import { useScaledStyles } from '../hooks/useScaledStyles';
import { deleteFoodRecord, type FoodRecord } from '../services/database';
import { type AlimentoResultado } from '../services/geminiService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.6;

interface Props {
  visible: boolean;
  records: FoodRecord[];
  onClose: () => void;
  onRecordDeleted: (id: number) => void;
}

function parseNum(val: string | undefined) {
  return parseFloat((val ?? '0').replace(/[^\d.]/g, '')) || 0;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

function parseAlimentos(json?: string): AlimentoResultado[] {
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

export default function TodayHistorySheet({ visible, records, onClose, onRecordDeleted }: Props) {
  const { colors } = useAppTheme();
  const { sc } = useScaledStyles();

  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  // Animar entrada/salida cuando cambia visible
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

  // Gesto de arrastre para cerrar
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

  const handleDelete = (id: number) => {
    Alert.alert(
      'Eliminar registro',
      '¿Eliminar este registro del historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteFoodRecord(id);
            onRecordDeleted(id);
          },
        },
      ]
    );
  };

  const totalCals = records.reduce((s, r) => s + parseNum(r.total_calorias), 0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeSheet}
    >
      {/* Overlay que cierra al tocar fuera */}
      <TouchableOpacity
        style={local.overlay}
        activeOpacity={1}
        onPress={closeSheet}
      />

      {/* Sheet animado */}
      <Animated.View
        style={[
          local.sheet,
          { backgroundColor: colors.card, transform: [{ translateY }] },
        ]}
      >
        {/* Handle de arrastre */}
        <View style={local.handleArea} {...panResponder.panHandlers}>
          <View style={[local.handle, { backgroundColor: colors.border }]} />
        </View>

        {/* Header */}
        <View style={local.header}>
          <Text style={{ fontSize: sc(20), fontWeight: '800', color: colors.text }}>
            Lo que comiste hoy
          </Text>
          <TouchableOpacity
            onPress={closeSheet}
            style={[local.closeBtn, { backgroundColor: colors.cardAlt }]}
          >
            <MaterialCommunityIcons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Contenido */}
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 36 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {records.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <MaterialCommunityIcons name="food-off" size={40} color={colors.textMuted} />
              <Text style={{ fontSize: sc(15), color: colors.textMuted, marginTop: 12, textAlign: 'center' }}>
                Aún no has registrado nada hoy.{'\n'}¡Escanea tu primer platillo!
              </Text>
            </View>
          ) : (
            records.map((record, index) => {
              const alimentos = parseAlimentos(record.alimentos_json);
              return (
                <View key={record.id}>
                  {index > 0 && (
                    <View style={[local.separator, { backgroundColor: colors.border }]} />
                  )}

                  {/* Hora + calorías + eliminar */}
                  <View style={local.recordRow}>
                    <MaterialCommunityIcons name="clock-outline" size={15} color={colors.textMuted} />
                    <Text style={{ fontSize: sc(13), color: colors.textMuted, marginLeft: 5, flex: 1 }}>
                      {formatTime(record.created_at)}
                    </Text>
                    <Text style={{ fontSize: sc(15), fontWeight: '700', color: colors.primaryGreen }}>
                      {record.total_calorias}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDelete(record.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{ marginLeft: 12 }}
                    >
                      <MaterialCommunityIcons name="trash-can-outline" size={16} color={colors.dangerRed} />
                    </TouchableOpacity>
                  </View>

                  {/* Alimentos */}
                  {alimentos.length > 0 ? (
                    alimentos.map((a, i) => (
                      <Text
                        key={i}
                        style={{ fontSize: sc(14), color: colors.text, marginBottom: 4, paddingLeft: 4 }}
                      >
                        {'• '}{a.nombre} — {a.calorias}
                        {a.alertaAzucar
                          ? <Text style={{ color: colors.dangerRed }}> ⚠️</Text>
                          : null}
                      </Text>
                    ))
                  ) : (
                    <Text style={{ fontSize: sc(13), color: colors.textMuted, paddingLeft: 4, marginBottom: 4 }}>
                      {'• '}{record.total_calorias} · {record.total_proteinas} prot · {record.total_carbohidratos} carb
                    </Text>
                  )}
                </View>
              );
            })
          )}

          {/* Total del día */}
          {records.length > 0 && (
            <View style={[local.totalRow, { borderTopColor: colors.border }]}>
              <Text style={{ fontSize: sc(14), color: colors.textSecondary, fontWeight: '600' }}>
                Total del día
              </Text>
              <Text style={{ fontSize: sc(16), color: colors.primaryGreen, fontWeight: '800' }}>
                {Math.round(totalCals)} kcal
              </Text>
            </View>
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
  handleArea: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 16,
  },
});
