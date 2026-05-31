import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Modal, ScrollView, Switch,
  Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppModal, { useAppModal } from '../../components/AppModal';
import { useAuth } from '../../contexts/AuthContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { escanearCuerpo } from '../../services/geminiService';
import { getTodayFoodRecords, getWeekFoodRecords, getAllFoodRecords } from '../../services/database';
import { useScaledStyles } from '../../hooks/useScaledStyles';
import { makeStyles } from './ProfileScreen.styles';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user, updateProfile } = useAuth();
  const { colors, isDark, toggleTheme } = useAppTheme();
  const { modal, showSuccess, showError, showWarning, showConfirm } = useAppModal();
  const { sc } = useScaledStyles();
  const styles = makeStyles(sc);
  const [isScanning, setIsScanning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleLogout = () => {
    showConfirm(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar tu sesión? Tendrás que ingresar tus credenciales nuevamente para acceder.',
      () => { logout(); router.replace('/login'); },
      'Salir',
      'Cancelar',
      'warning'
    );
  };

  const handleBodyScan = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showWarning('Permiso Necesario', 'Para realizar el escaneo corporal necesitamos acceso a tu galería de fotos. Activa el permiso en la configuración de tu dispositivo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    setIsScanning(true);
    try {
      const scanResult = await escanearCuerpo(result.assets[0].uri);
      showConfirm(
        'Resultado del análisis',
        `Peso estimado: ${scanResult.pesoEstimado} kg\nEstatura: ${scanResult.estaturaEstimada} cm\nComplexión: ${scanResult.complexion}\nÍndice de masa corporal (IMC): ${scanResult.imc}\n\n¿Quieres actualizar tu perfil con estos datos?`,
        async () => {
          const pesoNum = parseFloat(scanResult.pesoEstimado);
          const alturaNum = parseFloat(scanResult.estaturaEstimada);
          const updateData: { peso?: number; altura?: number } = {};
          if (pesoNum > 0) updateData.peso = pesoNum;
          if (alturaNum > 0) updateData.altura = alturaNum;
          
          if (Object.keys(updateData).length > 0) {
            const updateResult = await updateProfile(updateData);
            if (updateResult.success) {
              showSuccess('Perfil Actualizado', 'Tus datos biométricos han sido actualizados exitosamente con los resultados del escaneo corporal.');
            } else {
              showError('Error al Actualizar', 'No se pudieron guardar los datos del escaneo. Intenta realizar el escaneo nuevamente.');
            }
          }
        },
        'Actualizar Datos',
        'Cancelar',
        'info'
      );
    } catch (error: any) {
      const msg = error?.message || '';
      if (msg.includes('API_KEY') || msg.includes('API Key')) {
        showError('Servicio no disponible', 'El servicio de inteligencia artificial no está configurado. Contacta al soporte para resolver esto.');
      } else if (msg.includes('network') || msg.includes('fetch')) {
        showError('Sin conexión', 'No pudimos conectarnos al servicio. Verifica tu internet e intenta de nuevo.');
      } else {
        showError('No se pudo analizar', 'Intenta con una foto donde se vea claramente tu cuerpo completo de frente, con buena iluminación.');
      }
    } finally {
      setIsScanning(false);
    }
  };

  // Abre el modal de selección de formato
  const handleExport = () => {
    if (!user) return;
    setShowExportModal(true);
  };

  const parseNum = (val: string | undefined) =>
    parseFloat((val ?? '0').replace(/[^\d.]/g, '')) || 0;

  // Genera y comparte el PDF
  const exportPDF = async () => {
    if (!user) return;
    setShowExportModal(false);
    setIsExporting(true);
    try {
      const today = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
      const todayRecords = await getTodayFoodRecords(user.id);
      const weekRecords  = await getWeekFoodRecords(user.id);
      const allRecords   = await getAllFoodRecords(user.id);

      const todayCals  = todayRecords.reduce((s, r) => s + parseNum(r.total_calorias), 0);
      const todayProt  = todayRecords.reduce((s, r) => s + parseNum(r.total_proteinas), 0);
      const todayCarbs = todayRecords.reduce((s, r) => s + parseNum(r.total_carbohidratos), 0);
      const todayFats  = todayRecords.reduce((s, r) => s + parseNum(r.total_grasas), 0);
      const weekCals   = weekRecords.reduce((s, r) => s + parseNum(r.total_calorias), 0);

      const diabetesInfo = user.tiene_diabetes === 'si'
        ? `Sí — ${user.tipo_diabetes || 'tipo no especificado'}` : 'No';
      const imcVal = calcIMC();
      const imcCat = getIMCCategory();

      // Filas del historial completo
      const historialRows = allRecords.slice(0, 30).map(r => {
        const fecha = new Date(r.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const hora  = new Date(r.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        return `<tr>
          <td>${fecha} ${hora}</td>
          <td style="text-align:center;color:#10b981;font-weight:bold">${r.total_calorias}</td>
          <td style="text-align:center">${r.total_proteinas}</td>
          <td style="text-align:center">${r.total_carbohidratos}</td>
          <td style="text-align:center">${r.total_grasas}</td>
        </tr>`;
      }).join('');

      const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<style>
  body{font-family:Arial,sans-serif;color:#1e293b;padding:32px;max-width:680px;margin:auto}
  h1{color:#10b981;font-size:26px;margin-bottom:2px}
  h2{color:#475569;font-size:15px;font-weight:normal;margin-top:0;margin-bottom:32px}
  .section{margin-top:28px}
  .section-title{font-size:13px;font-weight:bold;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;border-bottom:2px solid #e2e8f0;padding-bottom:6px}
  .row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f1f5f9}
  .label{color:#64748b}.value{font-weight:bold;color:#0f172a}.highlight{color:#10b981}
  table{width:100%;border-collapse:collapse;margin-top:8px;font-size:13px}
  th{background:#f1f5f9;padding:8px 10px;text-align:left;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.5px}
  td{padding:7px 10px;border-bottom:1px solid #f1f5f9}
  tr:hover td{background:#f8fafc}
  .footer{margin-top:40px;font-size:11px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;padding-top:16px}
  .badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:12px;font-weight:bold}
  .badge-green{background:#d1fae5;color:#065f46}
  .badge-red{background:#fee2e2;color:#991b1b}
</style>
</head>
<body>
<h1>🌿 NutriVision AI</h1>
<h2>Reporte de salud — ${today}</h2>

<div class="section">
  <div class="section-title">Información personal</div>
  <div class="row"><span class="label">Nombre</span><span class="value">${user.nombre}</span></div>
  <div class="row"><span class="label">Correo</span><span class="value">${user.email}</span></div>
  <div class="row"><span class="label">Peso</span><span class="value">${user.peso ? user.peso + ' kg' : 'Sin datos'}</span></div>
  <div class="row"><span class="label">Estatura</span><span class="value">${user.altura ? user.altura + ' cm' : 'Sin datos'}</span></div>
  <div class="row"><span class="label">IMC</span><span class="value">${imcVal} <span style="color:#94a3b8;font-weight:normal">(${imcCat})</span></span></div>
  <div class="row"><span class="label">Diabetes</span><span class="value">${diabetesInfo}</span></div>
</div>

<div class="section">
  <div class="section-title">Consumo de hoy</div>
  <div class="row"><span class="label">Calorías</span><span class="value highlight">${Math.round(todayCals)} kcal</span></div>
  <div class="row"><span class="label">Proteínas</span><span class="value">${Math.round(todayProt)} g</span></div>
  <div class="row"><span class="label">Carbohidratos</span><span class="value">${Math.round(todayCarbs)} g</span></div>
  <div class="row"><span class="label">Grasas</span><span class="value">${Math.round(todayFats)} g</span></div>
  <div class="row"><span class="label">Registros del día</span><span class="value">${todayRecords.length}</span></div>
</div>

<div class="section">
  <div class="section-title">Resumen semanal</div>
  <div class="row"><span class="label">Total calorías (7 días)</span><span class="value highlight">${Math.round(weekCals)} kcal</span></div>
  <div class="row"><span class="label">Registros totales</span><span class="value">${weekRecords.length}</span></div>
</div>

${allRecords.length > 0 ? `
<div class="section">
  <div class="section-title">Historial de registros (últimos ${Math.min(allRecords.length, 30)})</div>
  <table>
    <thead><tr><th>Fecha y hora</th><th>Calorías</th><th>Proteínas</th><th>Carbos</th><th>Grasas</th></tr></thead>
    <tbody>${historialRows}</tbody>
  </table>
</div>` : ''}

<div class="footer">Generado por NutriVision AI · ${today} · Total de registros: ${allRecords.length}</div>
</body>
</html>`;

      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartir reporte de salud',
          UTI: 'com.adobe.pdf',
        });
      } else {
        showError('No disponible', 'Tu dispositivo no soporta compartir archivos.');
      }
    } catch (error) {
      console.error('Error exportando PDF:', error);
      showError('Error al exportar', 'No se pudo generar el PDF. Intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  // Genera y comparte el CSV (como PDF para compatibilidad con Expo Go en iOS)
  const exportCSV = async () => {
    console.log('[CSV] Iniciando exportación...');
    if (!user) {
      console.log('[CSV] No hay usuario, abortando');
      return;
    }
    setShowExportModal(false);
    setIsExporting(true);

    try {
      console.log('[CSV] Obteniendo registros para user.id:', user.id);
      const allRecords = await getAllFoodRecords(user.id);
      console.log('[CSV] Registros obtenidos:', allRecords.length);

      if (allRecords.length === 0) {
        showWarning('Sin registros', 'No tienes registros de alimentos para exportar.');
        setIsExporting(false);
        return;
      }

      const today = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

      // Construir filas de la tabla
      const filas = allRecords.map(r => {
        const raw = r.created_at ?? '';
        const datePart = raw.split('T')[0] ?? '';
        const timePart = raw.split('T')[1]?.slice(0, 5) ?? '00:00';
        const [yyyy, mm, dd] = datePart.split('-');
        const fecha = dd && mm && yyyy ? `${dd}/${mm}/${yyyy}` : datePart;
        return `<tr>
          <td>${fecha}</td>
          <td>${timePart}</td>
          <td style="text-align:right">${parseNum(r.total_calorias).toFixed(1)}</td>
          <td style="text-align:right">${parseNum(r.total_proteinas).toFixed(1)}</td>
          <td style="text-align:right">${parseNum(r.total_carbohidratos).toFixed(1)}</td>
          <td style="text-align:right">${parseNum(r.total_grasas).toFixed(1)}</td>
          <td style="text-align:right">${parseNum(r.total_azucares ?? '0').toFixed(1)}</td>
        </tr>`;
      }).join('');

      const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<style>
  body{font-family:Arial,sans-serif;color:#1e293b;padding:24px;font-size:11px}
  h1{color:#10b981;font-size:18px;margin-bottom:2px}
  h2{color:#475569;font-size:12px;font-weight:normal;margin-top:0;margin-bottom:20px}
  table{width:100%;border-collapse:collapse}
  th{background:#f1f5f9;padding:6px 8px;text-align:left;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid #e2e8f0}
  td{padding:5px 8px;border-bottom:1px solid #f1f5f9}
  tr:nth-child(even) td{background:#f8fafc}
  .footer{margin-top:20px;font-size:10px;color:#94a3b8;text-align:center}
</style>
</head>
<body>
<h1>🌿 NutriVision AI — Datos CSV</h1>
<h2>Exportado el ${today} · ${allRecords.length} registros</h2>
<table>
  <thead>
    <tr>
      <th>Fecha</th>
      <th>Hora</th>
      <th>Calorías (kcal)</th>
      <th>Proteínas (g)</th>
      <th>Carbohidratos (g)</th>
      <th>Grasas (g)</th>
      <th>Azúcares (g)</th>
    </tr>
  </thead>
  <tbody>${filas}</tbody>
</table>
<div class="footer">NutriVision AI · ${today}</div>
</body>
</html>`;

      console.log('[CSV] Generando PDF con datos tabulares...');
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      console.log('[CSV] PDF generado en:', uri);

      setIsExporting(false);

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        showError('No disponible', 'Tu dispositivo no soporta compartir archivos.');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Exportar datos — NutriVision AI',
        UTI: 'com.adobe.pdf',
      });
      console.log('[CSV] Compartir completado');

    } catch (err) {
      console.error('[CSV] Error:', err);
      showError('Error al exportar', `No se pudo generar el archivo: ${String(err)}`);
      setIsExporting(false);
    }
  };

  const initials = user?.nombre    ? user.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'US';

  const displayName = user?.nombre || 'Usuario';
  const displayAltura = user?.altura ? `${user.altura} cm` : 'Sin datos';
  const displayPeso = user?.peso ? `${user.peso} kg` : 'Sin datos';

  const calcIMC = (): string => {
    if (!user?.peso || !user?.altura) return 'N/A';
    const alturaM = user.altura / 100;
    return (user.peso / (alturaM * alturaM)).toFixed(1);
  };

  const getIMCCategory = (): string => {
    if (!user?.peso || !user?.altura) return '';
    const alturaM = user.altura / 100;
    const imc = user.peso / (alturaM * alturaM);
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <AppModal {...modal} />

      {/* ── Modal de selección de formato de exportación ─────────────── */}
      <Modal
        visible={showExportModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExportModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 32 }}
          activeOpacity={1}
          onPress={() => setShowExportModal(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={{ backgroundColor: colors.card, borderRadius: 28, padding: 32, alignItems: 'center', width: 300 }}>
              {/* Ícono */}
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accentBlue + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <MaterialCommunityIcons name="information-outline" size={40} color={colors.accentBlue} />
              </View>

              <Text style={{ fontSize: sc(22), fontWeight: '800', color: colors.accentBlue, marginBottom: 10, textAlign: 'center' }}>
                Exportar información
              </Text>
              <Text style={{ fontSize: sc(14), color: colors.textSecondary, textAlign: 'center', lineHeight: sc(22), marginBottom: 28 }}>
                ¿En qué formato quieres exportar tu reporte de salud?
              </Text>

              {/* Botones CSV y PDF */}
              <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                <TouchableOpacity
                  onPress={exportCSV}
                  style={{ flex: 1, height: 56, borderRadius: 18, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.cardAlt }}
                >
                  <Text style={{ fontSize: sc(16), fontWeight: '700', color: colors.text }}>CSV</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={exportPDF}
                  style={{ flex: 1, height: 56, borderRadius: 18, backgroundColor: colors.accentBlue, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={{ fontSize: sc(16), fontWeight: '800', color: '#ffffff' }}>PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      {/* ─────────────────────────────────────────────────────────────── */}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.headerMinimal}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarGlow, { backgroundColor: colors.primaryGreen }]} />
            <View style={[styles.avatarCircle, { borderColor: colors.primaryGreen }]}>
                <View style={[styles.avatarFallback, { backgroundColor: colors.card }]}>
                  <Text style={[styles.avatarText, { color: colors.text }]}>{initials}</Text>
                </View>
            </View>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{displayName}</Text>
          <Text style={[styles.userSub, { color: colors.textMuted }]}>{user?.email || 'correo@ejemplo.com'}</Text>
        </View>

        {user?.tiene_diabetes === 'si' && (
          <View style={[styles.alertCard, { backgroundColor: colors.dangerRed + '1A', borderColor: colors.dangerRed + '33' }]}>
            <View style={[styles.alertIconBox, { backgroundColor: colors.dangerRed + '33' }]}>
              <MaterialCommunityIcons name="alert-circle-outline" size={24} color={colors.dangerRed} />
            </View>
            <View>
              <Text style={[styles.alertLabel, { color: colors.dangerRed }]}>CONDICIÓN MÉDICA:</Text>
              <Text style={[styles.alertValue, { color: colors.text }]}>{user?.tipo_diabetes || 'Diabetes'}</Text>
            </View>
          </View>
        )}

        <View style={[styles.glassCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.gridRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
            <View style={styles.gridItem3}>
              <View style={styles.iconCenter}><MaterialCommunityIcons name="target" size={20} color={colors.purpleIA} /></View>
              <Text style={styles.statLabel}>OBJETIVO</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>Bajar de peso</Text>
            </View>
            <View style={[styles.gridItem3, { borderLeftColor: colors.border, borderLeftWidth: 1, borderRightColor: colors.border, borderRightWidth: 1 }]}>
              <View style={styles.iconCenter}><MaterialCommunityIcons name="heart-pulse" size={20} color={colors.primaryGreen} /></View>
              <Text style={styles.statLabel}>IMC</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{calcIMC()} <Text style={{ fontSize: sc(10), color: colors.textMuted }}>{getIMCCategory()}</Text></Text>
            </View>
            <View style={styles.gridItem3}>
              <View style={styles.iconCenter}><MaterialCommunityIcons name="fire" size={20} color={colors.orangeFats} /></View>
              <Text style={styles.statLabel}>RACHA</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>12 Días</Text>
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridItem2}>
              <View style={[styles.iconBoxSm, { backgroundColor: colors.background }]}><MaterialCommunityIcons name="weight-kilogram" size={18} color={colors.textSecondary} /></View>
              <View>
                <Text style={styles.statLabel}>PESO</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{displayPeso}</Text>
              </View>
            </View>
            <View style={[styles.gridItem2, { borderLeftColor: colors.border, borderLeftWidth: 1 }]}>
              <View style={[styles.iconBoxSm, { backgroundColor: colors.background }]}><MaterialCommunityIcons name="human-male-height" size={18} color={colors.textSecondary} /></View>
              <View>
                <Text style={styles.statLabel}>ESTATURA</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{displayAltura}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.glassCard, { backgroundColor: colors.card, borderColor: colors.border, padding: 16, marginBottom: 16 }]}>
            {/* Modo claro/oscuro */}
            <View style={styles.themeRow}>
              <MaterialCommunityIcons name={isDark ? "weather-night" : "white-balance-sunny"} size={24} color={colors.primaryGreen} />
              <Text style={[styles.themeLabel, { color: colors.text }]}>{isDark ? 'Modo Oscuro' : 'Modo Claro'}</Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#ccc', true: colors.primaryGreen }}
                thumbColor={isDark ? '#fff' : '#f4f3f4'}
              />
            </View>
        </View>

        {/* Acceso a accesibilidad — siempre visible aunque el botón flotante esté oculto */}
        <TouchableOpacity
          onPress={() => router.push('/accessibility')}
          style={[styles.glassCard, { backgroundColor: colors.card, borderColor: colors.border, padding: 16, marginBottom: 32, flexDirection: 'row', alignItems: 'center', gap: 12 }]}
          activeOpacity={0.7}
        >
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accentBlue + '22', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name="wheelchair-accessibility" size={20} color={colors.accentBlue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.themeLabel, { color: colors.text }]}>Accesibilidad</Text>
            <Text style={{ color: colors.textMuted, fontSize: sc(12), marginTop: 1 }}>Tamaño de texto, contraste, animaciones</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primaryGreen }, isScanning && { opacity: 0.7 }]}
            onPress={handleBodyScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <ActivityIndicator color="#0f172a" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="human-male-height-variant" size={20} color="#0f172a" />
                <Text style={[styles.primaryBtnText, { color: '#0f172a' }]}>Iniciar Escaneo Corporal</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.primaryGreen + '33' }]}
            onPress={() => router.push('/edit-profile')}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.primaryGreen }]}>Editar Información</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.accentBlue + '44', marginTop: 0 }, isExporting && { opacity: 0.6 }]}
            onPress={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color={colors.accentBlue} size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="export-variant" size={18} color={colors.accentBlue} style={{ marginRight: 8 }} />
                <Text style={[styles.secondaryBtnText, { color: colors.accentBlue }]}>Exportar mi información</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={16} color={colors.textSecondary} />
            <Text style={[styles.logoutBtnText, { color: colors.textSecondary }]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}