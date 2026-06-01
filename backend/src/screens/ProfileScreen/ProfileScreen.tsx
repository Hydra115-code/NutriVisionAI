import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppModal, { useAppModal } from '../../components/AppModal';
import { useAuth } from '../../contexts/AuthContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { escanearCuerpo } from '../../services/geminiService';
import { styles } from './ProfileScreen.styles';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user, updateProfile } = useAuth();
  const { colors, isDark, toggleTheme } = useAppTheme();
  const { modal, showSuccess, showError, showWarning, showConfirm } = useAppModal();
  const [isScanning, setIsScanning] = useState(false);

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
        'Resultado del Análisis',
        `Peso estimado: ${scanResult.pesoEstimado} kg\nEstatura: ${scanResult.estaturaEstimada} cm\nComplexión: ${scanResult.complexion}\nIMC: ${scanResult.imc}\n\n${scanResult.observaciones}\n\n¿Deseas actualizar tu perfil con estos datos?`,
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
        showError('Servicio No Disponible', 'El servicio de inteligencia artificial no está configurado correctamente. Contacta al soporte técnico para resolver este problema.');
      } else if (msg.includes('network') || msg.includes('fetch')) {
        showError('Sin Conexión', 'No se pudo conectar con el servicio de análisis. Verifica tu conexión a internet e intenta nuevamente.');
      } else {
        showError('Error en el Escaneo', 'No se pudo completar el análisis biométrico. Intenta con una foto donde se vea claramente tu cuerpo completo de frente.');
      }
    } finally {
      setIsScanning(false);
    }
  };

  const initials = user?.nombre
    ? user.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
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

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={16} color={colors.textSecondary} />
            <Text style={[styles.logoutBtnText, { color: colors.textSecondary }]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}