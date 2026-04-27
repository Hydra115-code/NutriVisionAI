// server.js
// Punto de entrada del servidor NutriVision Backend
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const { testConnection } = require('./db/connection');

// Rutas
const authRoutes = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARES ───────────────────────────────────────────────────────────
// CORS: permite peticiones desde tu app móvil en desarrollo
app.use(cors({
  origin: '*', // En producción, cambia esto por tu dominio real
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsear JSON en el cuerpo de las peticiones
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ─── RUTAS ─────────────────────────────────────────────────────────────────
// Ruta de salud: útil para verificar que el servidor está vivo
app.get('/api/health', (req, res) => {
  res.json({ ok: true, mensaje: 'NutriVision API funcionando ✅' });
});

// Rutas de autenticación (registro, login)
app.use('/api/auth', authRoutes);

// ─── MANEJO DE RUTAS NO ENCONTRADAS ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada.' });
});

// ─── INICIO DEL SERVIDOR ────────────────────────────────────────────────────
async function main() {
  // Verificar conexión a MySQL antes de arrancar
  await testConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`   Prueba: GET http://localhost:${PORT}/api/health`);
  });
}

main();