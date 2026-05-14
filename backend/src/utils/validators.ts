/**
 * src/utils/validators.ts
 * Utilidades de validación de entradas para los campos de los formularios en NutriVision AI.
 * Funciones puras sin efectos secundarios — seguras para usarse en cualquier parte.
 */

/**
 * Retorna verdadero si la cadena de texto no está vacía después de remover los espacios en blanco.
 *
 * @param value - La cadena de texto a verificar.
 */
export function isNonEmpty(value: string | null | undefined): boolean {
    return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Retorna verdadero si la cadena de texto cumple con un formato básico de correo electrónico.
 *
 * @param email - La dirección de correo electrónico a validar.
 */
export function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
}

/**
 * Retorna verdadero si el valor es numérico y se encuentra dentro del rango dado (inclusivo).
 *
 * @param value - El valor numérico a evaluar.
 * @param min   - Valor mínimo permitido.
 * @param max   - Valor máximo permitido.
 */
export function isInRange(value: number, min: number, max: number): boolean {
    return !isNaN(value) && value >= min && value <= max;
}

/**
 * Retorna verdadero si el valor de peso proporcionado es fisiológicamente plausible.
 * Acepta valores entre 1 kg y 500 kg.
 *
 * @param peso - Peso en kilogramos.
 */
export function isValidPeso(peso: number): boolean {
    return isInRange(peso, 1, 500);
}

/**
 * Retorna verdadero si el valor de altura proporcionado es fisiológicamente plausible.
 * Acepta valores entre 50 cm y 280 cm.
 *
 * @param altura - Altura en centímetros.
 */
export function isValidAltura(altura: number): boolean {
    return isInRange(altura, 50, 280);
}

/**
 * Retorna verdadero si la contraseña cumple con los requerimientos mínimos de seguridad:
 * al menos 6 caracteres de longitud.
 *
 * @param password - La cadena de texto de la contraseña a evaluar.
 */
export function isValidPassword(password: string): boolean {
    return typeof password === 'string' && password.length >= 6;
}
