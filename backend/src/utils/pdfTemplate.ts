/**
 * src/utils/pdfTemplate.ts
 * Genera el marcado HTML para el reporte nutricional en PDF.
 * Diseñado para producir un documento limpio y profesional cuando es renderizado por expo-print.
 */

import { Alimento, Usuario } from '../types';
import { formatFecha } from './formatters';

/**
 * Construye una cadena HTML que representa un reporte nutricional en PDF para una sesión de escaneo.
 *
 * @param usuario   - El usuario autenticado (para datos biométricos y nombre).
 * @param alimentos - La lista de alimentos detectados a mostrar en el reporte.
 * @returns Una cadena con el documento HTML completo lista para ser pasada a expo-print.
 */
export function buildPdfHtml(usuario: Usuario, alimentos: Alimento[]): string {
    const totalCalorias = alimentos.reduce((s, a) => s + a.calorias, 0);
    const totalProteinas = alimentos.reduce((s, a) => s + a.proteinas_g, 0);
    const totalCarbohidratos = alimentos.reduce((s, a) => s + a.carbohidratos_g, 0);
    const totalGrasas = alimentos.reduce((s, a) => s + a.grasas_g, 0);
    const totalAzucar = alimentos.reduce((s, a) => s + a.azucar_g, 0);
    const hayAlertaAzucar = alimentos.some((a) => a.alertaAzucar);
    const fechaHoy = formatFecha(new Date().toISOString());

    const filas = alimentos
        .map(
            (a) => `
      <tr>
        <td>${a.nombre}</td>
        <td class="num">${a.calorias.toFixed(0)}</td>
        <td class="num">${a.proteinas_g.toFixed(1)}</td>
        <td class="num">${a.carbohidratos_g.toFixed(1)}</td>
        <td class="num">${a.grasas_g.toFixed(1)}</td>
        <td class="num ${a.alertaAzucar ? 'alerta' : ''}">${a.azucar_g.toFixed(1)}</td>
      </tr>`
        )
        .join('');

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reporte Nutricional - NutriVision AI</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #1a1a2e;
      margin: 0;
      padding: 24px;
      font-size: 13px;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #00b347;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    h1 { color: #00b347; margin: 0; font-size: 22px; }
    .subtitle { color: #666; font-size: 11px; margin-top: 4px; }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      background: #f6fdf8;
      border: 1px solid #d1fae5;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 20px;
    }
    .info-item { display: flex; flex-direction: column; }
    .info-label { font-size: 10px; color: #888; text-transform: uppercase; }
    .info-value { font-weight: bold; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th {
      background: #00b347;
      color: #fff;
      padding: 8px 10px;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
    }
    td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
    tr:last-child td { border-bottom: none; }
    .num { text-align: right; }
    .alerta { color: #ef4444; font-weight: bold; }
    .totals-row td {
      font-weight: bold;
      background: #f0fdf4;
      border-top: 2px solid #00b347;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    .summary-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 10px;
      text-align: center;
    }
    .summary-value { font-size: 18px; font-weight: bold; color: #00b347; }
    .summary-label { font-size: 10px; color: #666; margin-top: 4px; }
    .alert-banner {
      background: #fef2f2;
      border: 1px solid #ef4444;
      border-left: 5px solid #ef4444;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 20px;
      color: #dc2626;
      font-weight: bold;
    }
    footer {
      text-align: center;
      color: #aaa;
      font-size: 10px;
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>NutriVision AI</h1>
      <div class="subtitle">Reporte Nutricional</div>
    </div>
    <div style="text-align:right; color:#555;">
      <div><strong>Fecha:</strong> ${fechaHoy}</div>
      <div><strong>Paciente:</strong> ${usuario.nombre} ${usuario.apellido ?? ''}</div>
    </div>
  </header>

  <div class="info-grid">
    <div class="info-item">
      <span class="info-label">Correo</span>
      <span class="info-value">${usuario.correo}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Condicion</span>
      <span class="info-value">
        ${usuario.tiene_diabetes === 'si' ? `Diabetes ${usuario.tipo_diabetes ?? ''}` : 'Salud General'}
      </span>
    </div>
    <div class="info-item">
      <span class="info-label">Peso</span>
      <span class="info-value">${usuario.peso_kg ? `${usuario.peso_kg} kg` : '--'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Altura</span>
      <span class="info-value">${usuario.altura_cm ? `${usuario.altura_cm} cm` : '--'}</span>
    </div>
  </div>

  ${hayAlertaAzucar ? '<div class="alert-banner">ALERTA: Se detectaron alimentos con nivel de azucar ALTO. Consuma con precaucion.</div>' : ''}

  <div class="summary-grid">
    <div class="summary-card">
      <div class="summary-value">${totalCalorias.toFixed(0)}</div>
      <div class="summary-label">kcal Totales</div>
    </div>
    <div class="summary-card">
      <div class="summary-value">${totalProteinas.toFixed(1)} g</div>
      <div class="summary-label">Proteinas</div>
    </div>
    <div class="summary-card">
      <div class="summary-value">${totalCarbohidratos.toFixed(1)} g</div>
      <div class="summary-label">Carbohidratos</div>
    </div>
    <div class="summary-card">
      <div class="summary-value">${totalGrasas.toFixed(1)} g</div>
      <div class="summary-label">Grasas</div>
    </div>
    <div class="summary-card">
      <div class="summary-value" style="${hayAlertaAzucar ? 'color:#ef4444' : ''}">${totalAzucar.toFixed(1)} g</div>
      <div class="summary-label">Azucares</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Alimento</th>
        <th>Calorias</th>
        <th>Proteinas (g)</th>
        <th>Carbs (g)</th>
        <th>Grasas (g)</th>
        <th>Azucar (g)</th>
      </tr>
    </thead>
    <tbody>
      ${filas}
      <tr class="totals-row">
        <td>TOTAL</td>
        <td class="num">${totalCalorias.toFixed(0)}</td>
        <td class="num">${totalProteinas.toFixed(1)}</td>
        <td class="num">${totalCarbohidratos.toFixed(1)}</td>
        <td class="num">${totalGrasas.toFixed(1)}</td>
        <td class="num ${hayAlertaAzucar ? 'alerta' : ''}">${totalAzucar.toFixed(1)}</td>
      </tr>
    </tbody>
  </table>

  <footer>
    Generado por NutriVision AI &bull; ${fechaHoy} &bull; Este documento es informativo y no sustituye una consulta medica.
  </footer>
</body>
</html>`;
}
