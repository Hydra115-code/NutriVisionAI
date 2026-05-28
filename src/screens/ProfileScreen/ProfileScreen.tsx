import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppModal, { useAppModal } from '../../components/AppModal';
import { useAuth } from '../../contexts/AuthContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { escanearCuerpo } from '../../services/geminiService';
import { getTodayFoodRecords, getWeekFoodRecords } from '../../services/database';
import { styles } from './ProfileScreen.styles';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user, updateProfile } = useAuth();
  const { colors, isDark, toggleTheme } = useAppTheme();
  const { modal, showSuccess, showError, showWarning, showConfirm } = useAppModal();
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
        `Peso estimado: ${scanResult.pesoEstimado} kg\nEstatura: ${scanResult.estaturaEstimada} cm\nComplexión: ${scanResult.complexion}\nIMC: ${scanResult.imc}\n\n⚠️ Estos datos son referenciales y estimados por IA. No reemplazan una medición real ni un diagnóstico médico.\n\n¿Quieres actualizar tu perfil con estos datos?`,
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

  const handleExport = async (formato: 'pdf' | 'csv' = 'pdf') => {
    if (!user) return;
    setIsExporting(true);
    try {
      const today = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
      const todayRecords = await getTodayFoodRecords(user.id);
      const weekRecords = await getWeekFoodRecords(user.id);

      const parseNum = (val: string | undefined) =>
        parseFloat((val ?? '0').replace(/[^\d.]/g, '')) || 0;

      const todayCals = todayRecords.reduce((s, r) => s + parseNum(r.total_calorias), 0);
      const todayProt = todayRecords.reduce((s, r) => s + parseNum(r.total_proteinas), 0);
      const todayCarbs = todayRecords.reduce((s, r) => s + parseNum(r.total_carbohidratos), 0);
      const todayFats = todayRecords.reduce((s, r) => s + parseNum(r.total_grasas), 0);
      const weekCals = weekRecords.reduce((s, r) => s + parseNum(r.total_calorias), 0);

      const diabetesInfo = user.tiene_diabetes === 'si'
        ? `Sí — ${user.tipo_diabetes || 'tipo no especificado'}` : 'No';
      const imcVal = calcIMC();
      const imcCat = getIMCCategory();

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        showError('No disponible', 'Tu dispositivo no soporta compartir archivos en este momento.');
        return;
      }

      if (formato === 'pdf') {
        const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
<style>body{font-family:Arial,sans-serif;color:#1e293b;padding:32px;max-width:600px;margin:auto}h1{color:#10b981;font-size:24px;margin-bottom:4px}h2{color:#475569;font-size:16px;font-weight:normal;margin-top:0}.section{margin-top:28px}.section-title{font-size:14px;font-weight:bold;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;border-bottom:1px solid #e2e8f0;padding-bottom:6px}.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9}.label{color:#64748b}.value{font-weight:bold;color:#0f172a}.highlight{color:#10b981}.note{font-size:11px;color:#94a3b8;margin-top:6px;font-style:italic}.footer{margin-top:40px;font-size:12px;color:#94a3b8;text-align:center}</style>
</head><body>
<h1>🌿 NutriVision AI</h1><h2>Reporte de salud — ${today}</h2>
<p class="note">⚠️ Los valores nutricionales son estimaciones de IA y no reemplazan una evaluación médica.</p>
<div class="section"><div class="section-title">Información personal</div>
<div class="row"><span class="label">Nombre</span><span class="value">${user.nombre}</span></div>
<div class="row"><span class="label">Peso</span><span class="value">${user.peso ? user.peso + ' kg' : 'Sin datos'}</span></div>
<div class="row"><span class="label">Estatura</span><span class="value">${user.altura ? user.altura + ' cm' : 'Sin datos'}</span></div>
<div class="row"><span class="label">IMC</span><span class="value">${imcVal} (${imcCat})</span></div>
<div class="row"><span class="label">Diabetes</span><span class="value">${diabetesInfo}</span></div></div>
<div class="section"><div class="section-title">Consumo de hoy</div>
<div class="row"><span class="label">Calorías</span><span class="value highlight">${Math.round(todayCals)} kcal</span></div>
<div class="row"><span class="label">Proteínas</span><span class="value">${Math.round(todayProt)} g</span></div>
<div class="row"><span class="label">Carbohidratos</span><span class="value">${Math.round(todayCarbs)} g</span></div>
<div class="row"><span class="label">Grasas</span><span class="value">${Math.round(todayFats)} g</span></div>
<div class="row"><span class="label">Registros</span><span class="value">${todayRecords.length}</span></div></div>
<div class="section"><div class="section-title">Resumen semanal</div>
<div class="row"><span class="label">Total calorías (7 días)</span><span class="value highlight">${Math.round(weekCals)} kcal</span></div>
<div class="row"><span class="label">Registros totales</span><span class="value">${weekRecords.length}</span></div></div>
<div class="footer">Generado por NutriVision AI · ${today}</div>
</body></html>`;
        const { uri } = await Print.printToFileAsync({ html, base64: false });
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Compartir reporte PDF', UTI: 'com.adobe.pdf' });
      } else {
        const csvLines = [
          'Tipo,Campo,Valor',
          `Perfil,Nombre,${user.nombre}`,
          `Perfil,Correo,${user.email}`,
          `Perfil,Peso,${user.peso ?? 'Sin datos'}`,
          `Perfil,Estatura,${user.altura ?? 'Sin datos'}`,
          `Perfil,IMC,${imcVal}`,
          `Perfil,Diabetes,${user.tiene_diabetes === 'si' ? 'Sí' : 'No'}`,
          `Hoy,Calorías,${Math.round(todayCals)}`,
          `Hoy,Proteínas,${Math.round(todayProt)}`,
          `Hoy,Carbohidratos,${Math.round(todayCarbs)}`,
          `Hoy,Grasas,${Math.round(todayFats)}`,
          `Hoy,Registros,${todayRecords.length}`,
          `Semana,Total calorías,${Math.round(weekCals)}`,
          `Semana,Total registros,${weekRecords.length}`,
        ];
        const FileSystem = await import('expo-file-system/legacy');
        const csvPath = `${FileSystem.documentDirectory}nutrivision_reporte.csv`;
        await FileSystem.writeAsStringAsync(csvPath, csvLines.join('\n'), { encoding: FileSystem.EncodingType.UTF8 });
        await Sharing.shareAsync(csvPath, { mimeType: 'text/csv', dialogTitle: 'Compartir reporte CSV', UTI: 'public.comma-separated-values-text' });
      }
    } catch (error) {
      console.error('Error exportando:', error);
      showError('Error al exportar', 'No se pudo generar el reporte. Intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportChoice = () => {
    setShowExportModal(true);
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppModal {...modal} />

      {/* ── MODAL SELECCIÓN FORMATO EXPORTAR ── */}
      <Modal visible={showExportModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 28, padding: 28, width: '100%', alignItems: 'center' }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.accentBlue + '20', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <MaterialCommunityIcons name="export-variant" size={36} color={colors.accentBlue} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 8 }}>Exportar información</Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 28, lineHeight: 20 }}>
              ¿En qué formato quieres exportar tu reporte de salud?
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              {/* CSV */}
              <TouchableOpacity
                style={{ flex: 1, borderRadius: 16, borderWidth: 2, borderColor: colors.primaryGreen, paddingVertical: 14, alignItems: 'center' }}
                onPress={() => { setShowExportModal(false); setTimeout(() => handleExport('csv'), 300); }}
              >
                <MaterialCommunityIcons name="file-delimited-outline" size={22} color={colors.primaryGreen} />
                <Text style={{ color: colors.primaryGreen, fontWeight: 'bold', marginTop: 4 }}>CSV</Text>
                <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 2 }}>Para Excel</Text>
              </TouchableOpacity>
              {/* PDF */}
              <TouchableOpacity
                style={{ flex: 1, borderRadius: 16, backgroundColor: colors.accentBlue, paddingVertical: 14, alignItems: 'center' }}
                onPress={() => { setShowExportModal(false); setTimeout(() => handleExport('pdf'), 300); }}
              >
                <MaterialCommunityIcons name="file-pdf-box" size={22} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: 'bold', marginTop: 4 }}>PDF</Text>
                <Text style={{ color: '#ffffff99', fontSize: 10, marginTop: 2 }}>Reporte visual</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setShowExportModal(false)} style={{ marginTop: 20 }}>
              <Text style={{ color: colors.textMuted, fontSize: 14 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
              <Text style={[styles.statValue, { color: colors.text }]}>{calcIMC()} <Text style={{ fontSize: 10, color: colors.textMuted }}>{getIMCCategory()}</Text></Text>
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

        <View style={[styles.glassCard, { backgroundColor: colors.card, borderColor: colors.border, padding: 16, marginBottom: 32 }]}>
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
            onPress={handleExportChoice}
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