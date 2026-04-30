/**
 * src/database/localDb.ts
 * Capa de acceso a datos utilizando SQLite de forma local y offline.
 * Implementa la arquitectura relacional solicitada con integridad referencial.
 */

import * as SQLite from 'expo-sqlite';
import { DailyRecord, Usuario } from '../types';

let db: SQLite.SQLiteDatabase;

/**
 * Inicializa la base de datos local SQLite.
 * Configura PRAGMA journal_mode = WAL para mayor concurrencia y rendimiento,
 * y PRAGMA foreign_keys = ON para garantizar la integridad referencial.
 */
export async function initLocalDb(): Promise<void> {
    try {
        if (!db) {
            db = await SQLite.openDatabaseAsync('nutrivision.db');
        }

        await db.execAsync(`PRAGMA journal_mode = WAL;`);
        await db.execAsync(`PRAGMA foreign_keys = ON;`);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS usuarios (
                usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                apellido TEXT,
                correo TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                peso_kg REAL,
                altura_cm REAL,
                sexo TEXT,
                objetivo TEXT,
                tiene_diabetes TEXT DEFAULT 'no',
                tipo_diabetes TEXT,
                estado_inicial TEXT DEFAULT 'Estable',
                racha_inicial INTEGER DEFAULT 0
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS registros_diarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                nombre_alimento TEXT NOT NULL,
                calorias REAL DEFAULT 0,
                proteinas_g REAL DEFAULT 0,
                carbohidratos_g REAL DEFAULT 0,
                grasas_g REAL DEFAULT 0,
                azucar_g REAL DEFAULT 0,
                fecha TEXT NOT NULL,
                FOREIGN KEY (usuario_id) REFERENCES usuarios (usuario_id) ON DELETE CASCADE
            );
        `);

    } catch (error) {
        console.error('Excepcion al inicializar la base de datos local:', error);
        throw new Error('Fallo crítico al iniciar SQLite.');
    }
}

/**
 * Autentica un usuario verificando las credenciales locales.
 *
 * @param correo Correo electrónico del usuario.
 * @param passwordHash Contraseña procesada del usuario.
 * @returns Objeto de usuario o null si falla la autenticación.
 */
export async function loginLocal(correo: string, passwordHash: string): Promise<Usuario | null> {
    try {
        if (!db) db = await SQLite.openDatabaseAsync('nutrivision.db');
        const row = await db.getFirstAsync<Usuario>(
            `SELECT * FROM usuarios WHERE correo = ? AND password = ? LIMIT 1`,
            [correo, passwordHash]
        );
        return row ?? null;
    } catch (error) {
        console.error('Excepcion en proceso de login local:', error);
        return null;
    }
}

/**
 * Valida la existencia de un correo en la tabla usuarios.
 *
 * @param correo Correo electrónico a validar.
 * @returns Verdadero si existe, falso en caso contrario.
 */
export async function checkEmailExists(correo: string): Promise<boolean> {
    try {
        if (!db) db = await SQLite.openDatabaseAsync('nutrivision.db');
        const row = await db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM usuarios WHERE correo = ?`,
            [correo]
        );
        return (row?.count ?? 0) > 0;
    } catch (error) {
        console.error('Excepcion validando correo:', error);
        return false;
    }
}

/**
 * Registra un nuevo usuario en la base de datos local.
 *
 * @param payload Datos completos del perfil del usuario.
 * @param passwordHash Contraseña procesada para almacenamiento.
 * @returns El usuario recién creado o null en caso de error.
 */
export async function registerLocal(payload: any, passwordHash: string): Promise<Usuario | null> {
    try {
        if (!db) db = await SQLite.openDatabaseAsync('nutrivision.db');
        const result = await db.runAsync(
            `INSERT INTO usuarios
             (nombre, apellido, correo, password, peso_kg, altura_cm, sexo, objetivo, tiene_diabetes, tipo_diabetes, estado_inicial)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                payload.nombre,
                payload.apellido ?? null,
                payload.correo,
                passwordHash,
                payload.peso_kg ?? null,
                payload.altura_cm ?? null,
                payload.sexo ?? null,
                payload.objetivo ?? null,
                payload.tiene_diabetes ?? 'no',
                payload.tipo_diabetes ?? null,
                payload.estado_inicial ?? 'Estable'
            ]
        );

        return await db.getFirstAsync<Usuario>(
            `SELECT * FROM usuarios WHERE usuario_id = ?`,
            [result.lastInsertRowId]
        );
    } catch (error) {
        console.error('Excepcion en registro de usuario local:', error);
        return null;
    }
}

/**
 * Actualiza la información del perfil del usuario en la base de datos.
 *
 * @param usuario_id Identificador único del usuario.
 * @param datos Objeto parcial con los datos a actualizar.
 * @returns Verdadero si la operación es exitosa.
 */
export async function updateProfileLocal(usuario_id: number, datos: Partial<Usuario>): Promise<boolean> {
    try {
        if (!db) db = await SQLite.openDatabaseAsync('nutrivision.db');
        await db.runAsync(
            `UPDATE usuarios SET
                nombre = COALESCE(?, nombre),
                apellido = COALESCE(?, apellido),
                peso_kg = COALESCE(?, peso_kg),
                altura_cm = COALESCE(?, altura_cm),
                objetivo = COALESCE(?, objetivo),
                estado_inicial = COALESCE(?, estado_inicial)
             WHERE usuario_id = ?`,
            [
                datos.nombre ?? null,
                datos.apellido ?? null,
                datos.peso_kg ?? null,
                datos.altura_cm ?? null,
                datos.objetivo ?? null,
                datos.estado_inicial ?? null,
                usuario_id
            ]
        );
        return true;
    } catch (error) {
        console.error('Excepcion actualizando perfil de usuario:', error);
        return false;
    }
}

/**
 * Inserta un lote de registros diarios en la tabla registros_diarios de forma transaccional.
 *
 * @param records Arreglo de registros nutricionales diarios.
 */
export async function insertarConsumoLocal(records: Omit<DailyRecord, 'id'>[]): Promise<void> {
    try {
        if (!db) db = await SQLite.openDatabaseAsync('nutrivision.db');
        await db.withTransactionAsync(async () => {
            for (const record of records) {
                await db.runAsync(
                    `INSERT INTO registros_diarios
                     (usuario_id, nombre_alimento, calorias, proteinas_g, carbohidratos_g, grasas_g, azucar_g, fecha)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        record.usuario_id,
                        record.nombre_alimento,
                        record.calorias,
                        record.proteinas_g,
                        record.carbohidratos_g,
                        record.grasas_g,
                        record.azucar_g ?? 0,
                        record.fecha,
                    ]
                );
            }
        });
    } catch (error) {
        console.error('Excepcion insertando consumo local:', error);
        throw error;
    }
}

/**
 * Obtiene el total de macronutrientes consumidos por el usuario en el dia en curso.
 *
 * @param usuario_id Identificador único del usuario.
 * @returns Objeto con las sumatorias nutricionales del dia.
 */
export async function obtenerProgresoHoyLocal(usuario_id: number): Promise<{
    calorias: number;
    proteinas: number;
    carbos: number;
    grasas: number;
}> {
    try {
        if (!db) db = await SQLite.openDatabaseAsync('nutrivision.db');
        const today = new Date().toISOString().split('T')[0];
        const result = await db.getFirstAsync<{
            calorias: number;
            proteinas: number;
            carbos: number;
            grasas: number;
        }>(
            `SELECT
                COALESCE(SUM(calorias), 0)         AS calorias,
                COALESCE(SUM(proteinas_g), 0)      AS proteinas,
                COALESCE(SUM(carbohidratos_g), 0)  AS carbos,
                COALESCE(SUM(grasas_g), 0)         AS grasas
             FROM registros_diarios
             WHERE usuario_id = ? AND fecha LIKE ?`,
            [usuario_id, `${today}%`]
        );
        return result ?? { calorias: 0, proteinas: 0, carbos: 0, grasas: 0 };
    } catch (error) {
        console.error('Excepcion consultando progreso nutricional diario:', error);
        return { calorias: 0, proteinas: 0, carbos: 0, grasas: 0 };
    }
}

/**
 * Obtiene el desglose calorico de los ultimos 7 dias.
 *
 * @param usuario_id Identificador único del usuario.
 * @returns Arreglo de historico semanal.
 */
export async function obtenerProgresoSemanalLocal(usuario_id: number): Promise<{ dia: string; calorias: number }[]> {
    try {
        if (!db) db = await SQLite.openDatabaseAsync('nutrivision.db');
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
        const semana: { dia: string; calorias: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - i);
            const fechaStr = fecha.toISOString().split('T')[0];

            const row = await db.getFirstAsync<{ total: number }>(
                `SELECT COALESCE(SUM(calorias), 0) AS total
                 FROM registros_diarios
                 WHERE usuario_id = ? AND fecha LIKE ?`,
                [usuario_id, `${fechaStr}%`]
            );

            semana.push({
                dia: diasSemana[fecha.getDay()],
                calorias: row?.total ?? 0,
            });
        }

        return semana;
    } catch (error) {
        console.error('Excepcion consultando historial semanal:', error);
        return [];
    }
}

/**
 * Calcula dinámicamente las metas nutricionales según perfil del usuario.
 *
 * @param usuario_id Identificador único del usuario.
 * @returns Objeto de objetivos nutricionales o null en caso de error.
 */
export async function obtenerMetasLocal(usuario_id: number) {
    try {
        if (!db) db = await SQLite.openDatabaseAsync('nutrivision.db');
        const user = await db.getFirstAsync<Usuario>(
            `SELECT peso_kg, altura_cm, sexo, tiene_diabetes FROM usuarios WHERE usuario_id = ?`,
            [usuario_id]
        );
        if (!user) return null;

        const peso = user.peso_kg || 70;
        const altura = user.altura_cm || 170;
        const sexo = user.sexo || 'Masculino';
        const diabetes = user.tiene_diabetes === 'si';
        const edad = 30; // Parametro fijo para simplificacion MVP

        let tmb = sexo === 'Femenino'
            ? 655 + (9.6 * peso) + (1.8 * altura) - (4.7 * edad)
            : 66 + (13.7 * peso) + (5 * altura) - (6.8 * edad);

        let calorias = Math.round(tmb * 1.55);
        const factorCarbo = diabetes ? 0.40 : 0.50;

        const carbos = Math.round((calorias * factorCarbo) / 4);
        const proteinas = Math.round((calorias * 0.25) / 4);
        const grasas = Math.round((calorias * 0.25) / 9);

        return { calorias, proteinas, carbos, grasas };
    } catch (error) {
        console.error('Excepcion calculando metas corporales:', error);
        return null;
    }
}
