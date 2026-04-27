<<<<<<< HEAD
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
=======
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE CONEXIÓN (Acoplado a Nutrivision)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'NutriVisioni',      // Usuario de MySQL
    password: '',      // Contraseña
    database: 'Nutrivision'
});

// CAMBIO EN EL LISTEN:
// Es mejor especificar '0.0.0.0' para decirle al servidor que escuche 
// a cualquier dispositivo de la red, no solo a la PC.
app.listen(5000, '0.0.0.0', () => {
    console.log("Servidor Nutrivision corriendo en:");
    console.log("Local: http://localhost:5000");
    console.log("Red: http://192.168.137.45:5000"); // Tu IP que encontramos
});

// PROCESO DE REGISTRO
app.post('/registro', (req, res) => {
    // Desestructuramos según tus columnas de la tabla USUARIO
    const { nombre, correo, password, edad, peso_kg, altura_cm } = req.body;

    // 1. VALIDACIÓN (Requerimiento de la imagen)
    if (!nombre || !correo || !password) {
        return res.status(400).json({ error: "Nombre, correo y password son obligatorios" });
    }

    // 2. GUARDADO DE DATOS (Query SQL)
    const query = `INSERT INTO USUARIO (nombre, correo, password_hash, edad, peso_kg, altura_cm) 
                   VALUES (?, ?, ?, ?, ?, ?)`;

    // Nota: En un entorno real, usaríamos bcrypt para el password_hash
    db.query(query, [nombre, correo, password, edad, peso_kg, altura_cm], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al guardar en Nutrivision" });
        }
        
        // 3. RESPUESTA EXITOSA
        res.status(201).json({ 
            mensaje: "Usuario registrado con éxito", 
            id: result.insertId 
        });
    });
});

app.listen(5000, () => console.log("Servidor Nutrivision en puerto 5000"));
>>>>>>> 23a43cc2fc5b8f259a0f4011b89ad34bad8c2630
