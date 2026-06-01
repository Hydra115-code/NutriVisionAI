/**
 * src/services/authService.ts
 * Capa de servicio de autenticación para NutriVision AI.
 * Al haberse eliminado el backend remoto, este servicio opera enteramente sobre SQLite local.
 */

import { checkEmailExists, loginLocal, registerLocal, updateProfileLocal } from '../database/localDb';
import { AuthResponse, Usuario } from '../types';
import { isNonEmpty, isValidEmail } from '../utils/validators';

//login
export async function loginUser(correo: string, password: string): Promise<AuthResponse> {
    if (!isNonEmpty(correo) || !isValidEmail(correo)) {
        return { ok: false, mensaje: 'Ingresa un correo electrónico válido.' };
    }
    if (!isNonEmpty(password)) {
        return { ok: false, mensaje: 'La contraseña no puede estar vacía.' };
    }

    // Se utiliza la contraseña en texto plano temporalmente para mantener compatibilidad con la lógica anterior
    const user = await loginLocal(correo, password);

    if (user) {
        return { ok: true, usuario: user };
    } else {
        return { ok: false, mensaje: 'Credenciales inválidas.' }
    }
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────

export async function registerUser(payload: {
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    [key: string]: any;
}): Promise<AuthResponse> {
    if (!isNonEmpty(payload.nombre)) {
        return { ok: false, mensaje: 'Nombre es obligatorio.' };
    }
    if (!isValidEmail(payload.correo)) {
        return { ok: false, mensaje: 'Correo electrónico inválido.' };
    }
    if (!payload.password || payload.password.length < 6) {
        return { ok: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    // Verifica localmente si el correo ya está en uso
    const emailExists = await checkEmailExists(payload.correo);
    if (emailExists) {
        return { ok: false, mensaje: 'El correo ya está registrado.' }
    }

    const user = await registerLocal(payload, payload.password);

    if (user) {
        return { ok: true, usuario: user };
    } else {
        return { ok: false, mensaje: 'Ocurrió un error al registrar el usuario.' }
    }
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────

export async function logoutUser(): Promise<void> {
    // En el modo de base de datos local, cerrar sesión solo requiere limpiar el estado en la interfaz de usuario.
    return Promise.resolve();
}

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────

export async function updateProfile(
    usuario: Usuario,
    updatedFields: Partial<Usuario>
): Promise<AuthResponse> {

    const success = await updateProfileLocal(usuario.usuario_id, updatedFields);

    if (success) {
        return { ok: true };
    } else {
        return { ok: false, mensaje: 'Ocurrió un error al actualizar el perfil.' };
    }
}
