const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/connection');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const {
    nombre, apellido, correo, password, peso_kg, altura_cm, sexo,
    fecha_nacimiento, objetivo, estado_inicial, racha_inicial,
    tiene_diabetes, tipo_diabetes
  } = req.body;

  if (!nombre || !apellido || !correo || !password) {
    return res.status(400).json({ ok: false, mensaje: 'Nombre, apellido, correo y contraseña son obligatorios.' });
  }

  try {
    const [rows] = await pool.query('SELECT usuario_id FROM USUARIO WHERE correo = ?', [correo.toLowerCase().trim()]);
    if (rows.length > 0) {
      return res.status(409).json({ ok: false, mensaje: 'Este correo ya está registrado.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    let fecha_mysql = null;
    if (fecha_nacimiento) {
      const partes = fecha_nacimiento.split('/');
      if (partes.length === 3) fecha_mysql = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    const [result] = await pool.query(
      `INSERT INTO USUARIO (nombre, apellido, correo, password_hash, fecha_nacimiento, peso_kg, altura_cm, sexo, objetivo, estado_inicial, racha_inicial, tiene_diabetes, tipo_diabetes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre.trim(), apellido.trim(), correo.toLowerCase().trim(), password_hash, fecha_mysql,
        peso_kg ? parseFloat(peso_kg) : null, altura_cm ? parseFloat(altura_cm) : null,
        sexo || null, objetivo || 'No definido', estado_inicial || 'Estable',
        racha_inicial ? parseInt(racha_inicial) : 0, tiene_diabetes || 'no', tipo_diabetes || null
      ]
    );

    const nuevoId = result.insertId;
    if (tiene_diabetes === 'si' && tipo_diabetes) {
      await pool.query(
        `INSERT INTO USUARIO_CONDICION (usuario_id, nombre_condicion, estado) VALUES (?, ?, ?)`,
        [nuevoId, `Diabetes ${tipo_diabetes}`, 'Activa']
      );
    }

    return res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado correctamente.',
      usuario: {
        usuario_id: nuevoId, nombre: nombre.trim(), apellido: apellido.trim(),
        correo: correo.toLowerCase().trim(), peso_kg, altura_cm,
        objetivo: objetivo || 'No definido', estado_inicial: estado_inicial || 'Estable',
        racha_inicial: racha_inicial || 0, sexo, fecha_nacimiento,
        tiene_diabetes: tiene_diabetes || 'no', tipo_diabetes: tipo_diabetes || null
      }
    });
  } catch (error) {
    console.error('Error en /register:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error interno en el servidor.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ ok: false, mensaje: 'Correo y contraseña obligatorios.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM USUARIO WHERE correo = ?', [correo.toLowerCase().trim()]);
    if (rows.length === 0) {
      return res.status(401).json({ ok: false, mensaje: 'Correo o contraseña incorrectos.' });
    }

    const usuario = rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ ok: false, mensaje: 'Correo o contraseña incorrectos.' });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Inicio de sesión exitoso.',
      usuario: {
        usuario_id: usuario.usuario_id, nombre: usuario.nombre, apellido: usuario.apellido,
        correo: usuario.correo, peso_kg: usuario.peso_kg, altura_cm: usuario.altura_cm,
        objetivo: usuario.objetivo, estado_inicial: usuario.estado_inicial,
        racha_inicial: usuario.racha_inicial, sexo: usuario.sexo,
        fecha_nacimiento: usuario.fecha_nacimiento,
        tiene_diabetes: usuario.tiene_diabetes, tipo_diabetes: usuario.tipo_diabetes
      }
    });
  } catch (error) {
    console.error('Error en /login:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
});

// POST /api/auth/analizar-imagen
router.post('/analizar-imagen', async (req, res) => {
  const { imagenBase64 } = req.body;
  if (!imagenBase64) return res.status(400).json({ ok: false, mensaje: 'No se recibió imagen.' });

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Analiza la imagen y devuelve ÚNICAMENTE un JSON: {\"alimentos\":[{\"nombre\":string,\"calorias\":number,\"proteinas_g\":number,\"carbohidratos_g\":number,\"grasas_g\":number,\"azucar_g\":number,\"alertaAzucar\":boolean}]}" },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imagenBase64.replace(/^data:image\/\w+;base64,/, "")
              }
            }
          ]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.log('--- ERROR DE GOOGLE API ---');
      console.log(JSON.stringify(data.error, null, 2));
      return res.status(500).json({ ok: false, mensaje: 'Error en la API de Google.' });
    }

    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!texto) return res.status(500).json({ ok: false, mensaje: 'No se detectó comida.' });

    // Limpieza de JSON por si trae basura
    const inicio = texto.indexOf('{');
    const fin = texto.lastIndexOf('}') + 1;
    const resultado = JSON.parse(texto.substring(inicio, fin));

    return res.status(200).json({ ok: true, ...resultado });

  } catch (error) {
    console.error('Error crítico:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error al procesar la imagen.' });
  }
});

// POST /api/auth/guardar-consumo
router.post('/guardar-consumo', async (req, res) => {
  const { usuario_id, alimentos } = req.body;
  if (!usuario_id || !alimentos || alimentos.length === 0) {
    return res.status(400).json({ ok: false, mensaje: 'Datos incompletos.' });
  }

  try {
    for (const alimento of alimentos) {
      await pool.query(
        `INSERT INTO CONSUMO_DIARIO (usuario_id, calorias, proteinas_g, carbohidratos_g, grasas_g, nombre_alimento)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          usuario_id,
          alimento.calorias || 0,
          alimento.proteinas_g || 0,
          alimento.carbohidratos_g || 0,
          alimento.grasas_g || 0,
          alimento.nombre || 'Desconocido'
        ]
      );
    }
    return res.status(201).json({ ok: true, mensaje: 'Consumo guardado correctamente.' });
  } catch (error) {
    console.error('Error en /guardar-consumo:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error al guardar.' });
  }
});

// GET /api/auth/progreso-hoy/:usuario_id
router.get('/progreso-hoy/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
        COALESCE(SUM(calorias), 0) as calorias,
        COALESCE(SUM(proteinas_g), 0) as proteinas,
        COALESCE(SUM(carbohidratos_g), 0) as carbos,
        COALESCE(SUM(grasas_g), 0) as grasas
       FROM CONSUMO_DIARIO
       WHERE usuario_id = ? AND DATE(fecha) = CURDATE()`,
      [usuario_id]
    );
    return res.status(200).json({ ok: true, datos: rows[0] });
  } catch (error) {
    console.error('Error en /progreso-hoy:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error al obtener progreso.' });
  }
});

// GET /api/auth/progreso-semanal/:usuario_id
// GET /api/auth/progreso-semanal/:usuario_id
router.get('/progreso-semanal/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
        DATE(fecha) as fecha_dia,
        COALESCE(SUM(calorias), 0) as calorias
       FROM CONSUMO_DIARIO
       WHERE usuario_id = ? 
         AND DATE(fecha) >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
         AND DATE(fecha) <= CURDATE()
       GROUP BY DATE(fecha)
       ORDER BY DATE(fecha) ASC`,
      [usuario_id]
    );

    console.log('Filas encontradas en BD:', JSON.stringify(rows));

    // Construir los 7 días exactos
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const semana = [];

    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);

      // Formato YYYY-MM-DD para comparar con MySQL
      const yyyy = fecha.getFullYear();
      const mm   = String(fecha.getMonth() + 1).padStart(2, '0');
      const dd   = String(fecha.getDate()).padStart(2, '0');
      const fechaStr = `${yyyy}-${mm}-${dd}`;

      const encontrado = rows.find(r => {
        const fechaBD = new Date(r.fecha_dia).toISOString().split('T')[0];
        return fechaBD === fechaStr;
      });

      semana.push({
        dia: diasSemana[fecha.getDay()],
        calorias: encontrado ? Number(encontrado.calorias) : 0
      });
    }

    console.log('Semana construida:', JSON.stringify(semana));

    return res.status(200).json({ ok: true, semana });
  } catch (error) {
    console.error('Error en /progreso-semanal:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error al obtener progreso semanal.' });
  }
});


// POST /api/auth/recuperar-password
router.post('/recuperar-password', async (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ ok: false, mensaje: 'Correo obligatorio.' });
  try {
    const [rows] = await pool.query('SELECT usuario_id FROM USUARIO WHERE correo = ?', [correo.toLowerCase().trim()]);
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'No existe una cuenta con ese correo.' });
    }
    // En un proyecto real aquí se enviaría un email
    // Para el MVP simulamos el envío exitoso
    return res.status(200).json({ ok: true, mensaje: 'Si el correo existe, recibirás instrucciones en breve.' });
  } catch (error) {
    console.error('Error en /recuperar-password:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
});

// POST /api/auth/escaneo-corporal
router.post('/escaneo-corporal', async (req, res) => {
  const { imagenBase64 } = req.body;
  if (!imagenBase64) return res.status(400).json({ ok: false, mensaje: 'No se recibió imagen.' });
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`; const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [
          { text: 'Analiza esta imagen de una persona y estima su peso en kg y altura en cm. Devuelve ÚNICAMENTE un JSON sin markdown ni texto extra: {"peso_kg": número, "altura_cm": número}' },
          { inline_data: { mime_type: 'image/jpeg', data: imagenBase64 } }
        ]}]
      })
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ ok: false, mensaje: 'Error en la API de Google.' });
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!texto) return res.status(500).json({ ok: false, mensaje: 'No se pudo estimar los datos.' });
    const parsed = JSON.parse(texto.replace(/```json|```/g, '').trim());
    return res.status(200).json({ ok: true, ...parsed });
  } catch (error) {
    console.error('Error en /escaneo-corporal:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error al procesar la imagen.' });
  }
});

// POST /api/auth/analizar-diagnostico
router.post('/analizar-diagnostico', async (req, res) => {
  const { imagenBase64 } = req.body;
  if (!imagenBase64) return res.status(400).json({ ok: false, mensaje: 'No se recibió imagen.' });
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [
          { text: `Analiza este documento médico y extrae info del paciente. Devuelve ÚNICAMENTE un JSON sin markdown: {"nombre":"", "apellido":"", "peso_kg":null, "altura_cm":null, "fecha_nacimiento":"DD/MM/AAAA", "sexo":"Masculino o Femenino", "tiene_diabetes":"si o no", "tipo_diabetes":"Tipo 1, Tipo 2, Gestacional o Pre.Diabetes o null", "objetivo":"", "estado_salud":""}` },
          { inline_data: { mime_type: 'image/jpeg', data: imagenBase64 } }
        ]}]
      })
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ ok: false, mensaje: 'Error en la API de Google.' });
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!texto) return res.status(500).json({ ok: false, mensaje: 'No se pudo leer el diagnóstico.' });
    const parsed = JSON.parse(texto.replace(/```json|```/g, '').trim());
    return res.status(200).json({ ok: true, ...parsed });
  } catch (error) {
    console.error('Error en /analizar-diagnostico:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error al procesar el documento.' });
  }
});


// GET /api/auth/metas/:usuario_id
router.get('/metas/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT peso_kg, altura_cm, fecha_nacimiento, sexo, tiene_diabetes FROM USUARIO WHERE usuario_id = ?',
      [usuario_id]
    );
    if (rows.length === 0) return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });

    const u = rows[0];
    const peso    = parseFloat(u.peso_kg)    || 70;
    const altura  = parseFloat(u.altura_cm)  || 170;
    const sexo    = u.sexo || 'Masculino';
    const diabetes = u.tiene_diabetes === 'si';

    // Calcular edad
    let edad = 30;
    if (u.fecha_nacimiento) {
      const hoy = new Date();
      const nac = new Date(u.fecha_nacimiento);
      edad = hoy.getFullYear() - nac.getFullYear();
    }

    // Fórmula Harris-Benedict para TMB
    let tmb = sexo === 'Femenino'
      ? 655 + (9.6 * peso) + (1.8 * altura) - (4.7 * edad)
      : 66  + (13.7 * peso) + (5 * altura)  - (6.8 * edad);

    // Factor actividad moderada (1.55)
    let calorias = Math.round(tmb * 1.55);

    // Si tiene diabetes reducimos 10% de carbos
    const factorCarbo = diabetes ? 0.40 : 0.50;

    const carbos    = Math.round((calorias * factorCarbo) / 4);
    const proteinas = Math.round((calorias * 0.25) / 4);
    const grasas    = Math.round((calorias * 0.25) / 9);

    return res.status(200).json({
      ok: true,
      metas: { calorias, proteinas, carbos, grasas }
    });
  } catch (error) {
    console.error('Error en /metas:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error al calcular metas.' });
  }
});

// PUT /api/auth/actualizar-perfil/:usuario_id
router.put('/actualizar-perfil/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  const { nombre, apellido, peso_kg, altura_cm, objetivo, estado_inicial } = req.body;
  try {
    await pool.query(
      `UPDATE USUARIO SET nombre=?, apellido=?, peso_kg=?, altura_cm=?, objetivo=?, estado_inicial=?, actualizado_en=NOW()
       WHERE usuario_id=?`,
      [nombre, apellido, peso_kg ? parseFloat(peso_kg) : null, altura_cm ? parseFloat(altura_cm) : null, objetivo, estado_inicial, usuario_id]
    );
    return res.status(200).json({ ok: true, mensaje: 'Perfil actualizado correctamente.' });
  } catch (error) {
    console.error('Error en /actualizar-perfil:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error al actualizar.' });
  }
});

module.exports = router;