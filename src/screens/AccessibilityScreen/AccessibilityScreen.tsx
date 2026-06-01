import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Switch, StyleSheet, PanResponder, Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../contexts/ThemeContext';
import { useAccessibility, type TextSizeOption } from '../../contexts/AccessibilityContext';
import { useScaledStyles } from '../../hooks/useScaledStyles';
import { makeStyles } from './AccessibilityScreen.styles';

const TEXT_SIZE_OPTIONS: { value: TextSizeOption; label: string; preview: number }[] = [
  { value: 'normal', label: 'Normal',     preview: 16 },
  { value: 'large',  label: 'Grande',     preview: 20 },
  { value: 'xlarge', label: 'Muy grande', preview: 26 },
];

export default function AccessibilityScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { sc } = useScaledStyles();
  const styles = makeStyles(sc);

  const {
    showGadget,   setShowGadget,
    textSize,     setTextSize,
    highContrast, setHighContrast,
    reduceMotion, setReduceMotion,
  } = useAccessibility();

  const panY = React.useRef(new Animated.Value(0)).current;
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 0,
      onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100 || g.vy > 0.5) {
          Animated.timing(panY, { toValue: 800, duration: 200, useNativeDriver: true })
            .start(() => router.back());
        } else {
          Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const handleClose = () => router.back();

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />

      <Animated.View style={[styles.modalContent, { backgroundColor: colors.background, transform: [{ translateY: panY }] }]}>

        <View style={styles.dragIndicatorContainer} {...panResponder.panHandlers}>
          <View style={[styles.dragIndicator, { backgroundColor: colors.textMuted }]} />
        </View>

        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <MaterialCommunityIcons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Accesibilidad</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

          {/* ── Tamaño de texto ─────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryGreen }]}>
              Tamaño de Texto
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Elige el tamaño de letra para toda la aplicación.
            </Text>

            <View style={local.sizeRow}>
              {TEXT_SIZE_OPTIONS.map((opt) => {
                const selected = textSize === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setTextSize(opt.value)}
                    style={[
                      local.sizeCard,
                      {
                        borderColor: selected ? colors.primaryGreen : colors.border,
                        backgroundColor: selected ? colors.lightGreen : colors.card,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: colors.text, fontSize: opt.preview, fontWeight: '700', marginBottom: 6 }}>
                      Aa
                    </Text>
                    <Text style={{ color: selected ? colors.primaryGreen : colors.text, fontSize: 13, fontWeight: '600', textAlign: 'center' }}>
                      {opt.label}
                    </Text>
                    {selected && (
                      <MaterialCommunityIcons name="check-circle" size={16} color={colors.primaryGreen} style={{ marginTop: 4 }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>


          </View>

          {/* ── Alto contraste ───────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryGreen }]}>
              Personalización Visual
            </Text>

            <View style={[styles.toggleContainer, { borderBottomColor: colors.border }]}>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Alto Contraste</Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  Aumenta el contraste entre texto y fondo.
                </Text>
              </View>
              <Switch
                trackColor={{ false: colors.border, true: colors.primaryGreen }}
                thumbColor={colors.card}
                ios_backgroundColor={colors.border}
                onValueChange={setHighContrast}
                value={highContrast}
              />
            </View>
          </View>

          {/* ── Botón flotante ───────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryGreen }]}>
              Botón Flotante
            </Text>

            <View style={[styles.toggleContainer, { borderBottomColor: colors.border }]}>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  Mostrar Botón de Accesibilidad
                </Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  {showGadget
                    ? 'Visible en el borde izquierdo de la pantalla.'
                    : 'Oculto. Puedes reactivarlo desde Perfil → Accesibilidad.'}
                </Text>
              </View>
              <Switch
                trackColor={{ false: colors.border, true: colors.primaryGreen }}
                thumbColor={colors.card}
                ios_backgroundColor={colors.border}
                onValueChange={setShowGadget}
                value={showGadget}
              />
            </View>

            {!showGadget && (
              <View style={[local.warningBox, { backgroundColor: colors.warningBg, borderColor: colors.warningYellow }]}>
                <MaterialCommunityIcons name="information-outline" size={16} color={colors.warningYellow} />
                <Text style={{ color: colors.text, fontSize: 12, flex: 1, lineHeight: 18 }}>
                  Ve a <Text style={{ fontWeight: '700' }}>Perfil → Accesibilidad</Text> para volver a activarlo.
                </Text>
              </View>
            )}
          </View>

          {/* ── Reducir movimiento ───────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryGreen }]}>
              Animaciones
            </Text>

            <View style={[styles.toggleContainer, { borderBottomColor: colors.border }]}>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Reducir Movimiento</Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  Las transiciones entre pantallas serán instantáneas.
                </Text>
              </View>
              <Switch
                trackColor={{ false: colors.border, true: colors.primaryGreen }}
                thumbColor={colors.card}
                ios_backgroundColor={colors.border}
                onValueChange={setReduceMotion}
                value={reduceMotion}
              />
            </View>
          </View>

          {/* ── Guardar ─────────────────────────────────────────────────── */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primaryGreen }]}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Guardar Preferencias</Text>
              <MaterialCommunityIcons name="check" size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>

        </ScrollView>
      </Animated.View>
    </View>
  );
}

const local = StyleSheet.create({
  sizeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    marginBottom: 12,
  },
  sizeCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
});
