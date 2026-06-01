/**
 * src/services/geminiService.ts
 * Servicio de análisis con IA para NutriVision AI.
 * Puente entre la UI (feature-diseno) y el cliente Gemini (feature-dev).
 * Expone los tipos y funciones que usan DashboardScreen, ProfileScreen y RegisterScreen.
 */

import { analyzeImageDirectly, estimateBodyStatsDirectly, analyzeDiagnosisDirectly } from '../api/geminiClient';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface AlimentoResultado {
  id: number;
  nombre: string;
  calorias: string;
  proteinas: string;
  grasas: string;
  carbohidratos: string;
  azucares: string;
  alertaAzucar: boolean;
}

export interface AnalisisResultado {
  alimentos: AlimentoResultado[];
  totalCalorias: string;
  totalProteinas: string;
  totalCarbohidratos: string;
  totalGrasas: string;
  totalAzucares: string;
  tieneAlertaAzucar: boolean;
}

export interface EscaneoCorporalResultado {
  pesoEstimado: string;
  estaturaEstimada: string;
  complexion: string;
  imc: string;
  observaciones: string;
}

export interface DiagnosticoResultado {
  nombrePaciente?: string;
  pesoDetectado?: string;
  tieneDiabetes?: boolean;
  tipoDiabetes?: string;
  observaciones: string;
}

// ─── ANÁLISIS DE COMIDA ───────────────────────────────────────────────────────

/**
 * Analiza una imagen de comida y devuelve los macronutrientes detectados.
 * @param imageUri URI local de la imagen (se convierte a base64 internamente).
 */
export async function analizarComida(imageUri: string): Promise<AnalisisResultado> {
  const base64 = await uriToBase64(imageUri);
  const result = await analyzeImageDirectly(base64);

  if (!result.ok || !result.alimentos || result.alimentos.length === 0) {
    throw new Error(result.mensaje || 'No se detectaron alimentos en la imagen.');
  }

  const alimentos: AlimentoResultado[] = result.alimentos.map((a, i) => ({
    id: i + 1,
    nombre: a.nombre,
    calorias: `${Math.round(a.calorias)} kcal`,
    proteinas: `${a.proteinas_g.toFixed(1)} g`,
    grasas: `${a.grasas_g.toFixed(1)} g`,
    carbohidratos: `${a.carbohidratos_g.toFixed(1)} g`,
    azucares: `${a.azucar_g.toFixed(1)} g`,
    alertaAzucar: a.alertaAzucar || a.azucar_g > 15,
  }));

  const totalCal = result.alimentos.reduce((s, a) => s + a.calorias, 0);
  const totalProt = result.alimentos.reduce((s, a) => s + a.proteinas_g, 0);
  const totalCarb = result.alimentos.reduce((s, a) => s + a.carbohidratos_g, 0);
  const totalGras = result.alimentos.reduce((s, a) => s + a.grasas_g, 0);
  const totalAzuc = result.alimentos.reduce((s, a) => s + a.azucar_g, 0);

  return {
    alimentos,
    totalCalorias: `${Math.round(totalCal)} kcal`,
    totalProteinas: `${totalProt.toFixed(1)} g`,
    totalCarbohidratos: `${totalCarb.toFixed(1)} g`,
    totalGrasas: `${totalGras.toFixed(1)} g`,
    totalAzucares: `${totalAzuc.toFixed(1)} g`,
    tieneAlertaAzucar: alimentos.some(a => a.alertaAzucar),
  };
}

// ─── ESCANEO CORPORAL ─────────────────────────────────────────────────────────

export async function escanearCuerpo(imageUri: string): Promise<EscaneoCorporalResultado> {
  const base64 = await uriToBase64(imageUri);
  const result = await estimateBodyStatsDirectly(base64);

  if (!result.ok) {
    throw new Error(result.mensaje || 'No se pudo completar el escaneo corporal.');
  }

  const peso = result.peso_kg ?? 0;
  const altura = result.altura_cm ?? 0;
  const alturaM = altura / 100;
  const imc = alturaM > 0 ? (peso / (alturaM * alturaM)).toFixed(1) : 'N/A';

  let complexion = 'Normal';
  const imcNum = parseFloat(imc);
  if (!isNaN(imcNum)) {
    if (imcNum < 18.5) complexion = 'Delgado';
    else if (imcNum < 25) complexion = 'Normal';
    else if (imcNum < 30) complexion = 'Sobrepeso';
    else complexion = 'Obesidad';
  }

  return {
    pesoEstimado: peso > 0 ? peso.toFixed(1) : 'N/A',
    estaturaEstimada: altura > 0 ? altura.toFixed(0) : 'N/A',
    complexion,
    imc,
    observaciones: `Análisis biométrico completado. IMC estimado: ${imc} (${complexion}).`,
  };
}

// ─── ANÁLISIS DE DIAGNÓSTICO ──────────────────────────────────────────────────

export async function analizarDiagnostico(imageUri: string): Promise<DiagnosticoResultado> {
  const base64 = await uriToBase64(imageUri);
  const result = await analyzeDiagnosisDirectly(base64);

  if (!result.ok) {
    throw new Error(result.mensaje || 'No se pudo procesar el diagnóstico.');
  }

  return {
    nombrePaciente: result.nombre ? `${result.nombre} ${result.apellido ?? ''}`.trim() : undefined,
    pesoDetectado: result.peso_kg ? String(result.peso_kg) : undefined,
    tieneDiabetes: result.tiene_diabetes === 'si',
    tipoDiabetes: result.tipo_diabetes ?? undefined,
    observaciones: result.estado_salud ?? 'Diagnóstico procesado correctamente.',
  };
}

// ─── HELPER: URI → BASE64 ─────────────────────────────────────────────────────

async function uriToBase64(uri: string): Promise<string> {
  // Usamos la API legacy para mantener compatibilidad con expo-file-system v54+
  const FileSystem = await import('expo-file-system/legacy');
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return base64;
}
