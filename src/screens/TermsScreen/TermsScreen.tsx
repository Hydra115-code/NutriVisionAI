import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../contexts/ThemeContext';
import { styles } from './TermsScreen.styles';

export default function TermsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} accessibilityLabel="Regresar">
                <View style={[styles.backIconBox, { backgroundColor: colors.card }]}>
                    <Feather name="arrow-left" size={20} color={colors.text} />
                </View>
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Términos y Condiciones</Text>
            <View style={styles.backBtn} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Aceptación de los Términos</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Al descargar, instalar y utilizar NutriVision AI, usted acepta estos Términos y Condiciones en su totalidad. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar la aplicación.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Descripción del Servicio</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            NutriVision AI es una aplicación de análisis nutricional que utiliza inteligencia artificial (Gemini AI) para identificar alimentos a través de fotografías y estimar su contenido nutricional. La aplicación está diseñada como una herramienta de apoyo y NO sustituye el consejo médico profesional.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Datos de Salud</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            La aplicación recopila y almacena datos de salud proporcionados por el usuario, incluyendo peso, condición de diabetes, y registros alimenticios. Estos datos se almacenan localmente en su dispositivo mediante una base de datos SQLite y NO se transmiten a servidores externos, excepto las imágenes enviadas a la API de Gemini para su análisis.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Precisión de los Análisis</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Los valores nutricionales proporcionados por la IA son ESTIMACIONES basadas en análisis visual. Los valores reales pueden variar significativamente según la preparación, porciones y variaciones naturales de los alimentos. No debe tomar decisiones médicas basándose únicamente en estos análisis.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Alertas de Azúcar</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            La aplicación genera alertas cuando detecta niveles de azúcar superiores a 15g en un alimento. Estas alertas son informativas y no constituyen un diagnóstico médico. Si padece diabetes u otra condición, consulte siempre con su médico.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Privacidad y Seguridad</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
             Sus datos personales se almacenan localmente en su dispositivo.{'\n'}
             Las contraseñas se almacenan con un hash de seguridad.{'\n'}
             Las imágenes de alimentos se envían a Google Gemini AI para análisis.{'\n'}
             No compartimos sus datos con terceros más allá del servicio de IA.{'\n'}
             Puede eliminar sus datos en cualquier momento desinstalando la aplicación.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>7. Funciones de IA</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Las funciones de escaneo corporal y análisis de diagnósticos médicos utilizan IA para estimar datos. Estas estimaciones son aproximadas y no deben usarse como sustituto de mediciones profesionales o diagnósticos médicos verificados.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>8. Limitación de Responsabilidad</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            NutriVision AI se proporciona "tal cual" sin garantías de ningún tipo. Los desarrolladores no serán responsables de daños directos, indirectos o consecuentes derivados del uso de la aplicación o de las estimaciones nutricionales proporcionadas.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>9. Uso Apropiado</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            El usuario se compromete a utilizar la aplicación únicamente para fines personales de seguimiento nutricional. No debe utilizar la aplicación para diagnosticar, tratar o prevenir enfermedades sin supervisión médica.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>10. Contacto</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Para preguntas o inquietudes sobre estos términos, puede contactarnos a través de los canales de soporte proporcionados en la tienda de aplicaciones.
          </Text>

          <Text style={[styles.updateDate, { color: colors.textMuted }]}>
            Última actualización: Abril 2026
          </Text>
        </View>

        {/* Botón cerrar */}
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: colors.primaryGreen }]}
          onPress={() => router.back()}
          accessibilityLabel="Cerrar términos y condiciones"
          accessibilityRole="button"
          activeOpacity={0.8}
        >
          <Text style={styles.closeButtonText}>He leído y entendido</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}