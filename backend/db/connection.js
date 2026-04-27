// db/connection.js
// Módulo de conexión a MySQL usando pool de conexiones
const mysql = require('mysql2/promise');
require('dotenv').config();

// Un "pool" reutiliza conexiones en lugar de abrir una nueva cada vez.
// Es más eficiente para una API con múltiples peticiones simultáneas.
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'Nutrivision',
  waitForConnections: true,
  connectionLimit: 10,    // Máximo de conexiones simultáneas
  queueLimit: 0
});

// Función de prueba: se llama al iniciar el servidor para verificar la conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL exitosa');
    connection.release(); // Devuelve la conexión al pool
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message);
    console.error('   Verifica que MySQL Workbench esté corriendo y que tu .env sea correcto.');
    process.exit(1); // Detiene el servidor si no hay BD
  }
}

module.exports = { pool, testConnection };