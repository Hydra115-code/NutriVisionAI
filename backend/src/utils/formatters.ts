/**
 * src/utils/formatters.ts
 * Utilidades de formateo de datos para NutriVision AI.
 * Provee un formato consistente para fechas, números y unidades a lo largo de la aplicación.
 */

/**
 * Formatea una cadena de fecha ISO (YYYY-MM-DD o ISO completa) a un formato
 * legible en español: DD/MM/YYYY.
 *
 * @param isoString - Una cadena de fecha en formato ISO 8601.
 * @returns Cadena de fecha formateada, ej. "27/04/2026".
 */
export function formatFecha(isoString: string): string {
    if (!isoString) return '--';
    try {
        const date = new Date(isoString);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    } catch {
        return isoString;
    }
}

/**
 * Convierte una cadena de fecha en formato DD/MM/YYYY al formato YYYY-MM-DD compatible con MySQL/SQLite.
 *
 * @param fechaDisplay - Cadena de fecha en formato DD/MM/YYYY.
 * @returns Cadena de fecha en formato YYYY-MM-DD, o nulo si la entrada es inválida.
 */
export function fechaDisplayToMysql(fechaDisplay: string): string | null {
    const partes = fechaDisplay.split('/');
    if (partes.length !== 3) return null;
    const [dd, mm, yyyy] = partes;
    return `${yyyy}-${mm}-${dd}`;
}

/**
 * Formatea un valor numérico como un entero redondeado con un sufijo de unidad.
 * Ejemplo: formatCalories(2123.7) => "2124 kcal"
 *
 * @param value - El valor calórico a formatear.
 */
export function formatCalories(value: number): string {
    return `${Math.round(value)} kcal`;
}

/**
 * Formatea un valor numérico como gramos con un lugar decimal.
 * Ejemplo: formatGrams(24.567) => "24.6 g"
 *
 * @param value - El valor en gramos a formatear.
 */
export function formatGrams(value: number): string {
    return `${value.toFixed(1)} g`;
}

/**
 * Calcula y formatea un porcentaje, con un límite máximo del 100%.
 * Utilizado para el llenado de las barras de progreso.
 *
 * @param consumed - La cantidad consumida.
 * @param goal     - La cantidad de la meta objetivo.
 * @returns Un número entre 0 y 100 que representa el porcentaje de avance.
 */
export function calcPorcentaje(consumed: number, goal: number): number {
    if (!goal || goal <= 0) return 0;
    return Math.min((consumed / goal) * 100, 100);
}
