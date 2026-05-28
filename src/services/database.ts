/**
 * src/services/database.ts
 * Capa de servicio de base de datos para NutriVision AI.
 * Actúa como puente entre la UI (feature-diseno) y la BD local SQLite (feature-dev).
 * Expone las mismas funciones que espera la UI con los tipos que usa.
 */

import * as SQLite from 'expo-sqlite';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string;
  peso?: number;
  altura?: number;
  tiene_diabetes?: string;
  tipo_diabetes?: string;
  fecha_nacimiento?: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  peso?: number;
  altura?: number;
  tiene_diabetes?: string;
  tipo_diabetes?: string;
  fecha_nacimiento?: string;
}

export interface FoodRecord {
  id: number;
  user_id: number;
  image_uri?: string;
  total_calorias: string;
  total_proteinas: string;
  total_carbohidratos: string;
  total_grasas: string;
  total_azucares: string;
  created_at: string;
}

// ─── INSTANCIA DE BD ──────────────────────────────────────────────────────────

let db: SQLite.SQLiteDatabase;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('nutrivision.db');
  }
  return db;
}

// ─── INICIALIZACIÓN ───────────────────────────────────────────────────────────

export async function initDatabase(): Promise<void> {
  const database = await getDb();

  await database.execAsync(`PRAGMA journal_mode = WAL;`);
  await database.execAsync(`PRAGMA foreign_keys = ON;`);

  // Tabla de usuarios (compatible con feature-dev)
  await database.execAsync(`
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
      racha_inicial INTEGER DEFAULT 0,
      fecha_nacimiento TEXT
    );
  `);

  // Migración: agregar columna fecha_nacimiento si la tabla ya existía sin ella
  try {
    await database.execAsync(`ALTER TABLE usuarios ADD COLUMN fecha_nacimiento TEXT;`);
  } catch (_) {
    // La columna ya existe, ignorar
  }

  // Tabla de registros de comida (formato que usa DashboardScreen/ExploreScreen)
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS food_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      image_uri TEXT,
      total_calorias TEXT DEFAULT '0 kcal',
      total_proteinas TEXT DEFAULT '0 g',
      total_carbohidratos TEXT DEFAULT '0 g',
      total_grasas TEXT DEFAULT '0 g',
      total_azucares TEXT DEFAULT '0 g',
      alimentos_json TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES usuarios (usuario_id) ON DELETE CASCADE
    );
  `);
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string): Promise<User | null> {
  const database = await getDb();
  const row = await database.getFirstAsync<any>(
    `SELECT * FROM usuarios WHERE correo = ? AND password = ? LIMIT 1`,
    [email, password]
  );
  if (!row) return null;
  return mapRowToUser(row);
}

export async function registerUser(data: RegisterData): Promise<{ success: boolean; message: string }> {
  const database = await getDb();

  // Verificar si el correo ya existe
  const existing = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM usuarios WHERE correo = ?`,
    [data.email]
  );
  if ((existing?.count ?? 0) > 0) {
    return { success: false, message: 'El correo ya está registrado.' };
  }

  try {
    await database.runAsync(
      `INSERT INTO usuarios (nombre, correo, password, peso_kg, altura_cm, tiene_diabetes, tipo_diabetes, fecha_nacimiento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nombre,
        data.email,
        data.password,
        data.peso ?? null,
        data.altura ?? null,
        data.tiene_diabetes ?? 'no',
        data.tipo_diabetes ?? null,
        data.fecha_nacimiento ?? null,
      ]
    );
    return { success: true, message: '¡Cuenta creada exitosamente!' };
  } catch (error) {
    console.error('Error en registerUser:', error);
    return { success: false, message: 'Error al crear la cuenta.' };
  }
}

export async function updateUserProfile(
  userId: number,
  data: { nombre?: string; peso?: number; altura?: number; tiene_diabetes?: string; tipo_diabetes?: string }
): Promise<{ success: boolean; message: string; user?: User }> {
  const database = await getDb();
  try {
    await database.runAsync(
      `UPDATE usuarios SET
        nombre = COALESCE(?, nombre),
        peso_kg = COALESCE(?, peso_kg),
        altura_cm = COALESCE(?, altura_cm),
        tiene_diabetes = COALESCE(?, tiene_diabetes),
        tipo_diabetes = COALESCE(?, tipo_diabetes)
       WHERE usuario_id = ?`,
      [
        data.nombre ?? null,
        data.peso ?? null,
        data.altura ?? null,
        data.tiene_diabetes ?? null,
        data.tipo_diabetes ?? null,
        userId,
      ]
    );
    const updated = await database.getFirstAsync<any>(
      `SELECT * FROM usuarios WHERE usuario_id = ?`,
      [userId]
    );
    return { success: true, message: 'Perfil actualizado.', user: updated ? mapRowToUser(updated) : undefined };
  } catch (error) {
    console.error('Error en updateUserProfile:', error);
    return { success: false, message: 'Error al actualizar perfil.' };
  }
}

export async function getUserById(userId: number): Promise<User | null> {
  const database = await getDb();
  const row = await database.getFirstAsync<any>(
    `SELECT * FROM usuarios WHERE usuario_id = ? LIMIT 1`,
    [userId]
  );
  if (!row) return null;
  return mapRowToUser(row);
}

export async function resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }> {  const database = await getDb();
  const existing = await database.getFirstAsync<{ usuario_id: number }>(
    `SELECT usuario_id FROM usuarios WHERE correo = ?`,
    [email]
  );
  if (!existing) {
    return { success: false, message: 'No se encontró ninguna cuenta con ese correo.' };
  }
  await database.runAsync(
    `UPDATE usuarios SET password = ? WHERE correo = ?`,
    [newPassword, email]
  );
  return { success: true, message: 'Contraseña restablecida exitosamente.' };
}

// ─── FOOD RECORDS ─────────────────────────────────────────────────────────────

export async function saveFoodRecord(
  userId: number,
  resultado: any,
  imageUri: string | null
): Promise<{ success: boolean }> {
  const database = await getDb();
  try {
    const now = new Date().toISOString();
    await database.runAsync(
      `INSERT INTO food_records (user_id, image_uri, total_calorias, total_proteinas, total_carbohidratos, total_grasas, total_azucares, alimentos_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        imageUri ?? null,
        resultado.totalCalorias ?? '0 kcal',
        resultado.totalProteinas ?? '0 g',
        resultado.totalCarbohidratos ?? '0 g',
        resultado.totalGrasas ?? '0 g',
        resultado.totalAzucares ?? '0 g',
        JSON.stringify(resultado.alimentos ?? []),
        now,
      ]
    );
    return { success: true };
  } catch (error) {
    console.error('Error en saveFoodRecord:', error);
    return { success: false };
  }
}

export async function getTodayFoodRecords(userId: number): Promise<FoodRecord[]> {
  const database = await getDb();
  const today = new Date().toISOString().split('T')[0];
  const rows = await database.getAllAsync<FoodRecord>(
    `SELECT * FROM food_records WHERE user_id = ? AND created_at LIKE ? ORDER BY created_at DESC`,
    [userId, `${today}%`]
  );
  return rows ?? [];
}

export async function getWeekFoodRecords(userId: number): Promise<FoodRecord[]> {
  const database = await getDb();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  const rows = await database.getAllAsync<FoodRecord>(
    `SELECT * FROM food_records WHERE user_id = ? AND created_at >= ? ORDER BY created_at ASC`,
    [userId, weekAgoStr]
  );
  return rows ?? [];
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function mapRowToUser(row: any): User {
  return {
    id: row.usuario_id,
    nombre: row.nombre,
    email: row.correo,
    password: row.password,
    peso: row.peso_kg ?? undefined,
    altura: row.altura_cm ?? undefined,
    tiene_diabetes: row.tiene_diabetes ?? undefined,
    tipo_diabetes: row.tipo_diabetes ?? undefined,
    fecha_nacimiento: row.fecha_nacimiento ?? undefined,
  };
}
