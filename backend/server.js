const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE CONEXIÓN (Acoplado a Nutrivision)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'NutriVision',      // Usuario de MySQL
    password: '',      // Contraseña
    database: 'Nutrivision'
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