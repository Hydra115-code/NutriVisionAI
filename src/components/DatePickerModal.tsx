// ============================================================
// COMPONENTE SELECTOR DE FECHA - DatePickerModal.tsx
// ============================================================
// Calendario visual nativo para seleccionar fecha de nacimiento.
// Construido con componentes básicos de React Native para
// compatibilidad total sin dependencias externas adicionales.
// ============================================================

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useAppTheme } from '../contexts/ThemeContext';

interface DatePickerModalProps {
  visible: boolean;
  onSelect: (dateStr: string) => void;
  onClose: () => void;
  initialDate?: string; // DD/MM/AAAA
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAYS_HEADER = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number): number {
  return new Date(year, month, 1).getDay();
}

function parseInitialDate(str?: string): { day: number; month: number; year: number } {
  if (!str || str.length < 10) {
    const now = new Date();
    return { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() - 25 };
  }
  const parts = str.split('/');
  return {
    day: parseInt(parts[0], 10) || 1,
    month: (parseInt(parts[1], 10) || 1) - 1,
    year: parseInt(parts[2], 10) || 2000,
  };
}

export default function DatePickerModal({ visible, onSelect, onClose, initialDate }: DatePickerModalProps) {
  const { colors } = useAppTheme();
  const initial = useMemo(() => parseInitialDate(initialDate), [initialDate]);

  const [viewMonth, setViewMonth] = useState(initial.month);
  const [viewYear, setViewYear] = useState(initial.year);
  const [selectedDay, setSelectedDay] = useState(initial.day);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 5; // Mínimo 5 años (un niño)

  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else { setViewMonth(m => m - 1); }
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else { setViewMonth(m => m + 1); }
  };

  const handleConfirm = () => {
    const dd = String(selectedDay).padStart(2, '0');
    const mm = String(viewMonth + 1).padStart(2, '0');
    onSelect(`${dd}/${mm}/${viewYear}`);
  };

  // Generar celdas del calendario
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Años para el selector
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) years.push(y);

  if (showYearPicker) {
    return (
      <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.yearPickerTitle, { color: colors.text }]}>Selecciona el Año</Text>
            <ScrollView style={styles.yearScroll} showsVerticalScrollIndicator={false}>
              {years.map(y => (
                <TouchableOpacity
                  key={y}
                  style={[
                    styles.yearItem,
                    y === viewYear && { backgroundColor: colors.primaryGreen + '22' },
                  ]}
                  onPress={() => { setViewYear(y); setShowYearPicker(false); }}
                >
                  <Text style={[
                    styles.yearItemText,
                    { color: y === viewYear ? colors.primaryGreen : colors.text },
                    y === viewYear && { fontWeight: 'bold' },
                  ]}>{y}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => setShowYearPicker(false)}>
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Volver al Calendario</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* Encabezado del mes */}
          <View style={styles.header}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowYearPicker(true)} style={styles.monthYearBtn}>
              <Text style={[styles.monthYearText, { color: colors.text }]}>
                {MONTHS[viewMonth]} {viewYear}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <MaterialCommunityIcons name="chevron-right" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Días de la semana */}
          <View style={styles.daysRow}>
            {DAYS_HEADER.map(d => (
              <Text key={d} style={[styles.dayHeader, { color: colors.textMuted }]}>{d}</Text>
            ))}
          </View>

          {/* Celdas del calendario */}
          <View style={styles.grid}>
            {cells.map((day, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dayCell,
                  day === selectedDay && { backgroundColor: colors.primaryGreen },
                ]}
                onPress={() => day && setSelectedDay(day)}
                disabled={!day}
              >
                {day && (
                  <Text style={[
                    styles.dayCellText,
                    { color: day === selectedDay ? '#0f172a' : colors.text },
                  ]}>{day}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Fecha seleccionada */}
          <Text style={[styles.selectedDate, { color: colors.textSecondary }]}>
            Fecha seleccionada: {String(selectedDay).padStart(2, '0')}/{String(viewMonth + 1).padStart(2, '0')}/{viewYear}
          </Text>

          {/* Botones */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={onClose}>
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.primaryGreen }]} onPress={handleConfirm}>
              <Text style={styles.confirmBtnText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', borderRadius: 28, padding: 24, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  navBtn: { padding: 8 },
  monthYearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  monthYearText: { fontSize: 18, fontWeight: 'bold' },
  daysRow: { flexDirection: 'row', marginBottom: 8 },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  dayCellText: { fontSize: 15, fontWeight: '500' },
  selectedDate: { textAlign: 'center', marginVertical: 16, fontSize: 14 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, minHeight: 52, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { fontSize: 15, fontWeight: '600' },
  confirmBtn: { flex: 1, minHeight: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  confirmBtnText: { color: '#0f172a', fontSize: 15, fontWeight: 'bold' },
  yearPickerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  yearScroll: { maxHeight: 300, marginBottom: 16 },
  yearItem: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, marginBottom: 4 },
  yearItemText: { fontSize: 18, textAlign: 'center' },
});
