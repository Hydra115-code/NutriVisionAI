import React, { useRef, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Modal,
  Text,
  ScrollView,
  Switch,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../contexts/ThemeContext';
import { useAccessibility } from '../contexts/AccessibilityContext';

const { height } = Dimensions.get('window');

export default function AccessibilityWidget() {
  const { showGadget, largeText, setLargeText, highContrast, setHighContrast, reduceMotion, setReduceMotion, setShowGadget } = useAccessibility();
  const { colors } = useAppTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80 || g.vy > 0.5) {
          Animated.timing(panY, { toValue: 800, duration: 200, useNativeDriver: true }).start(() => {
            panY.setValue(0);
            setModalVisible(false);
          });
        } else {
          Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const handleClose = () => {
    Animated.timing(panY, { toValue: 800, duration: 200, useNativeDriver: true }).start(() => {
      panY.setValue(0);
      setModalVisible(false);
    });
  };

  if (!showGadget) return null;

  return (
    <>
      {/* ── BOTÓN FLOTANTE ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="wheelchair-accessibility" size={26} color="#fff" />
      </TouchableOpacity>

      {/* ── PANEL DE ACCESIBILIDAD ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          {/* Fondo oscuro — toca para cerrar */}
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />

          <Animated.View style={[styles.sheet, { backgroundColor: colors.background, transform: [{ translateY: panY }] }]}>

            {/* Barra de arrastre */}
            <View style={styles.dragArea} {...panResponder.panHandlers}>
              <View style={[styles.dragBar, { backgroundColor: colors.border }]} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <MaterialCommunityIcons name="close" size={26} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.title, { color: colors.text }]}>Accesibilidad</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

              <Text style={[styles.sectionTitle, { color: colors.primaryGreen }]}>Personalización Visual</Text>

              <View style={[styles.row, { borderBottomColor: colors.border }]}>
                <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>Texto Grande</Text>
                  <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>Aumenta el tamaño de letra en toda la app.</Text>
                </View>
                <Switch
                  value={largeText}
                  onValueChange={setLargeText}
                  trackColor={{ false: colors.border, true: colors.primaryGreen }}
                  thumbColor={colors.card}
                />
              </View>

              <View style={[styles.row, { borderBottomColor: colors.border }]}>
                <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>Alto Contraste</Text>
                  <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>Mejora la visibilidad del texto sobre el fondo.</Text>
                </View>
                <Switch
                  value={highContrast}
                  onValueChange={setHighContrast}
                  trackColor={{ false: colors.border, true: colors.primaryGreen }}
                  thumbColor={colors.card}
                />
              </View>

              <Text style={[styles.sectionTitle, { color: colors.primaryGreen, marginTop: 24 }]}>Animaciones</Text>

              <View style={[styles.row, { borderBottomColor: colors.border }]}>
                <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>Reducir Movimiento</Text>
                  <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>Minimiza las animaciones y transiciones.</Text>
                </View>
                <Switch
                  value={reduceMotion}
                  onValueChange={setReduceMotion}
                  trackColor={{ false: colors.border, true: colors.primaryGreen }}
                  thumbColor={colors.card}
                />
              </View>

              <Text style={[styles.sectionTitle, { color: colors.primaryGreen, marginTop: 24 }]}>Widget</Text>

              <View style={[styles.row, { borderBottomColor: colors.border }]}>
                <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>Mostrar Botón Flotante</Text>
                  <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>Muestra este botón siempre visible en la pantalla.</Text>
                </View>
                <Switch
                  value={showGadget}
                  onValueChange={setShowGadget}
                  trackColor={{ false: colors.border, true: colors.primaryGreen }}
                  thumbColor={colors.card}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.primaryGreen }]}
                onPress={handleClose}
                activeOpacity={0.85}
              >
                <Text style={styles.saveBtnText}>Guardar preferencias</Text>
                <MaterialCommunityIcons name="check" size={22} color="#0f172a" />
              </TouchableOpacity>

            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    left: 0,
    top: '45%',
    backgroundColor: '#3b82f6',
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 99999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: height * 0.85,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 8,
  },
  dragArea: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  closeBtn: {
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  rowText: {
    flex: 1,
    paddingRight: 16,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  rowDesc: {
    fontSize: 13,
  },
  saveBtn: {
    marginTop: 28,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
});
