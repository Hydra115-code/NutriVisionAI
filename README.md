# 🧠 NutriVision AI — Backend & Funcionalidad

> Aplicación móvil con inteligencia artificial para el análisis nutricional visual, diseñada especialmente para personas con diabetes y usuarios que buscan controlar su alimentación.

[![React Native](https://img.shields.io/badge/React_Native-0.81.5-blue?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-black?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-Local_DB-green?logo=sqlite)](https://docs.expo.dev/versions/latest/sdk/sqlite/)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.5_Flash-AI_Engine-orange?logo=google)](https://ai.google.dev/)

---

##  Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Estructura de Archivos (Backend)](#-estructura-de-archivos-backend)
- [Modelos de Datos](#-modelos-de-datos)
- [Módulos Funcionales](#-módulos-funcionales)
  - [Base de Datos Local (SQLite)](#1--base-de-datos-local-sqlite)
  - [Clientes de API](#2--clientes-de-api)
  - [Capa de Servicios](#3--capa-de-servicios)
  - [Hooks de Lógica de Negocio](#4--hooks-de-lógica-de-negocio)
  - [Utilidades](#5--utilidades)
- [Flujos Principales](#-flujos-principales)
- [Variables de Entorno](#-variables-de-entorno)
- [Dependencias Clave](#-dependencias-clave)
- [Cómo Ejecutar](#-cómo-ejecutar)
- [Equipo de Desarrollo](#-equipo-de-desarrollo)

---

##  Descripción General

**NutriVision AI** es una aplicación móvil construida con **React Native + Expo** que permite a los usuarios:

1. **Escanear alimentos** con la cámara del dispositivo
2. **Analizar nutrientes** automáticamente usando **Google Gemini 2.5 Flash**
3. **Detectar alertas de azúcar** para pacientes con diabetes
4. **Registrar consumo diario** en una base de datos local SQLite
5. **Visualizar progreso** nutricional con gráficas diarias y semanales
6. **Estimar datos corporales** (peso/altura) mediante análisis de imagen con IA
7. **Extraer diagnósticos médicos** desde fotografías de documentos clínicos
8. **Exportar reportes PDF** con el desglose nutricional del escaneo

La aplicación opera completamente **offline-first**, almacenando todos los datos localmente en SQLite con la capacidad de conectarse a un servidor Express remoto como respaldo.

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                     CAPA DE INTERFAZ                     │
│          (Screens, Components — NO incluidos)             │
└───────────────────────────┬─────────────────────────────┘
                            │ Llama a
┌───────────────────────────▼─────────────────────────────┐
│                   HOOKS DE NEGOCIO                        │
│       useAuth.ts │ useScanner.ts │ useHistory.ts          │
└──────┬────────────────┬────────────────┬────────────────┘
       │                │                │
┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
│  SERVICIOS  │  │  SERVICIOS  │  │  CONTEXTOS  │
│ authService │  │aiAnalysis   │  │ UserContext  │
│ pdfService  │  │  Service    │  │             │
└──────┬──────┘  └──────┬──────┘  └─────────────┘
       │                │
┌──────▼────────────────▼─────────────────────────────────┐
│                  CLIENTES DE API                         │
│          backendClient.ts │ geminiClient.ts               │
└──────┬────────────────────────────┬─────────────────────┘
       │                            │
┌──────▼──────┐              ┌──────▼──────┐
│   SQLite    │              │  Google     │
│   Local DB  │              │  Gemini API │
│ (localDb.ts)│              │  (Nube)     │
└─────────────┘              └─────────────┘
```

---

## 📁 Estructura de Archivos (Backend)

```
src/
├── api/                          # Clientes de comunicación externa
│   ├── backendClient.ts          # Cliente HTTP para backend Express
│   └── geminiClient.ts           # Cliente directo para Google Gemini AI
│
├── database/                     # Capa de persistencia local
│   └── localDb.ts                # SQLite: tablas, CRUD, consultas agregadas
│
├── services/                     # Lógica de negocio
│   ├── authService.ts            # Autenticación (login, registro, logout)
│   ├── aiAnalysisService.ts      # Orquestación del análisis de alimentos
│   └── pdfService.ts             # Generación y compartición de reportes PDF
│
├── hooks/                        # Hooks reutilizables de funcionalidad
│   ├── useAuth.ts                # Ciclo de vida de autenticación
│   ├── useScanner.ts             # Flujo completo de escaneo de alimentos
│   └── useHistory.ts             # Carga de progreso diario y semanal
│
├── context/                      # Estado global de la aplicación
│   └── UserContext.tsx            # Proveedor del usuario autenticado
│
├── types/                        # Definiciones de tipos TypeScript
│   └── index.ts                  # Interfaces: Usuario, Alimento, DailyRecord, etc.
│
├── utils/                        # Funciones utilitarias puras
│   ├── validators.ts             # Validación de correo, contraseña, peso, altura
│   ├── formatters.ts             # Formateo de fechas, calorías, porcentajes
│   └── pdfTemplate.ts            # Plantilla HTML para generación de PDF
│
└── constants/                    # Configuración global
    └── config.ts                 # Lectura de API key de Gemini desde .env
```

---

##  Modelos de Datos

### `Usuario`
Representa al usuario autenticado y su perfil biométrico.

```typescript
interface Usuario {
  usuario_id: number;
  nombre: string;
  apellido?: string;
  correo: string;
  peso_kg?: number | null;
  altura_cm?: number | null;
  sexo?: string | null;
  objetivo?: string | null;          // "Control de glucosa", "Bajar de peso", etc.
  tiene_diabetes?: 'si' | 'no';
  tipo_diabetes?: string | null;     // "Tipo 1", "Tipo 2", "Gestacional", "Pre.Diabetes"
  estado_inicial?: string | null;    // "Estable", "En tratamiento", etc.
  racha_inicial?: number;
}
```

### `Alimento`
Representa un alimento individual detectado por la IA.

```typescript
interface Alimento {
  id: number;
  nombre: string;
  calorias: number;
  proteinas_g: number;
  carbohidratos_g: number;
  grasas_g: number;
  azucar_g: number;
  alertaAzucar: boolean;   // true si el nivel de azúcar es peligrosamente alto
}
```

### `DailyRecord`
Registro de consumo diario almacenado en SQLite.

```typescript
interface DailyRecord {
  id?: number;
  usuario_id: number;
  nombre_alimento: string;
  calorias: number;
  proteinas_g: number;
  carbohidratos_g: number;
  grasas_g: number;
  azucar_g?: number;
  fecha: string;           // ISO date string
}
```

### `NutritionGoals`
Metas nutricionales personalizadas calculadas con la fórmula Harris-Benedict.

```typescript
interface NutritionGoals {
  calorias: number;
  proteinas: number;
  carbos: number;
  grasas: number;
}
```

---

##  Módulos Funcionales

### Base de Datos Local (SQLite)

**Archivo:** `src/database/localDb.ts`

Base de datos relacional local usando `expo-sqlite` con dos tablas principales y relación de integridad referencial con `FOREIGN KEY`.

#### Tablas

| Tabla | Descripción |
|---|---|
| `usuarios` | Almacena perfil del usuario: datos personales, biométricos y condición médica |
| `registros_diarios` | Registros de consumo nutricional diario con referencia al usuario (`ON DELETE CASCADE`) |

#### Funciones Principales

| Función | Descripción |
|---|---|
| `initLocalDb()` | Inicializa la BD, crea tablas, configura `WAL` y `foreign_keys` |
| `loginLocal(correo, password)` | Autenticación local contra tabla `usuarios` |
| `checkEmailExists(correo)` | Verifica duplicados de correo antes del registro |
| `registerLocal(payload, password)` | Inserta un nuevo usuario y retorna el registro completo |
| `updateProfileLocal(id, datos)` | Actualización parcial del perfil con `COALESCE` |
| `insertarConsumoLocal(records)` | Inserción transaccional en lote de registros diarios |
| `obtenerProgresoHoyLocal(id)` | Suma agregada de macronutrientes del día (`SUM` + `COALESCE`) |
| `obtenerProgresoSemanalLocal(id)` | Historial calórico de los últimos 7 días |
| `obtenerMetasLocal(id)` | Cálculo dinámico de metas con fórmula **Harris-Benedict** (TMB) |

#### Fórmula de Metas Nutricionales

```
TMB (Hombre) = 66 + (13.7 × peso) + (5 × altura) - (6.8 × edad)
TMB (Mujer)  = 655 + (9.6 × peso) + (1.8 × altura) - (4.7 × edad)

Calorías diarias = TMB × 1.55 (factor de actividad moderada)
Carbohidratos    = 50% de calorías (40% si tiene diabetes)
Proteínas        = 25% de calorías
Grasas           = 25% de calorías
```

---

###  Clientes de API

#### `backendClient.ts` — Cliente HTTP para Backend Express

Comunicación con el servidor Express remoto. Incluye timeout de 10 segundos y manejo de errores con `AbortController`.

| Endpoint | Método | Función | Descripción |
|---|---|---|---|
| `/api/auth/login` | POST | `login()` | Autenticación remota |
| `/api/auth/register` | POST | `register()` | Registro de usuario |
| `/api/auth/analizar-imagen` | POST | `analizarImagen()` | Análisis de comida con IA |
| `/api/auth/guardar-consumo` | POST | `guardarConsumo()` | Persistir alimentos consumidos |
| `/api/auth/progreso-hoy/:id` | GET | `progresoHoy()` | Totales nutricionales del día |
| `/api/auth/progreso-semanal/:id` | GET | `progresoSemanal()` | Resumen calórico de 7 días |
| `/api/auth/metas/:id` | GET | `obtenerMetas()` | Metas nutricionales personalizadas |
| `/api/auth/actualizar-perfil/:id` | PUT | `actualizarPerfil()` | Actualización de perfil |
| `/api/auth/escaneo-corporal` | POST | `escaneoCorporal()` | Estimación de peso/altura con IA |
| `/api/auth/analizar-diagnostico` | POST | `analizarDiagnostico()` | Extracción de datos de documento médico |

#### `geminiClient.ts` — Cliente Directo para Google Gemini

Comunicación directa con la API de Google Gemini 2.5 Flash desde el dispositivo.

| Función | Descripción |
|---|---|
| `analyzeImageDirectly(base64)` | Envía foto de comida → Recibe JSON con array de alimentos detectados, macronutrientes y alerta de azúcar |
| `estimateBodyStatsDirectly(base64)` | Envía foto corporal → Recibe estimación de peso (kg) y altura (cm) |
| `analyzeDiagnosisDirectly(base64)` | Envía foto de documento médico → Extrae nombre, peso, altura, fecha de nacimiento, sexo, diabetes y objetivo |

**Modelo utilizado:** `gemini-2.5-flash`  
**Temperatura:** `0.1` (respuestas deterministas)  
**Formato de respuesta:** JSON puro (con limpieza de markdown residual)

---

###  Capa de Servicios

#### `authService.ts` — Servicio de Autenticación

Opera enteramente sobre SQLite local.

| Función | Descripción |
|---|---|
| `loginUser(correo, password)` | Valida formato de correo → Verifica credenciales en SQLite → Retorna `AuthResponse` |
| `registerUser(payload)` | Valida campos → Verifica email duplicado → Inserta en SQLite → Retorna usuario creado |
| `logoutUser()` | Limpia el estado (no hay sesión persistente en la versión local) |
| `updateProfile(usuario, fields)` | Actualiza campos parciales del perfil en SQLite |

**Validaciones aplicadas:**
- Correo con formato válido (regex)
- Contraseña mínima de 6 caracteres
- Nombre no vacío
- Verificación de email duplicado antes del registro

#### `aiAnalysisService.ts` — Servicio de Análisis de Alimentos

Orquesta el flujo completo de análisis de imagen.

| Función | Descripción |
|---|---|
| `analyzeFood(imagenBase64)` | Envía imagen a Gemini → Asigna IDs secuenciales → Retorna `AnalysisResult` tipado |
| `guardarEscaneoLocalmente(id, alimentos)` | Mapea alimentos a `DailyRecord` → Inserta en SQLite con fecha ISO actual |

#### `pdfService.ts` — Servicio de Reportes PDF

| Función | Descripción |
|---|---|
| `exportarPdf(usuario, alimentos)` | Genera HTML desde template → Renderiza PDF con `expo-print` → Comparte con `expo-sharing` |

---

###  Hooks de Lógica de Negocio

#### `useAuth.ts`
Hook que conecta `authService` con `UserContext`.

```typescript
const { loading, login, logout, register } = useAuth();
```

- `login(correo, password)` → Autentica y actualiza `UserContext`
- `register(payload)` → Registra y actualiza `UserContext`
- `logout()` → Limpia contexto y redirige al login

#### `useScanner.ts`
Hook que encapsula el ciclo completo de escaneo.

```typescript
const { alimentosDetectados, imagenUri, analizando, guardando,
        handleScan, handleGaleria, handleGuardar, resetScan } = useScanner();
```

- `handleScan()` → Abre cámara → Captura → Envía a IA → Muestra resultados
- `handleGaleria()` → Abre galería → Selecciona → Envía a IA → Muestra resultados
- `handleGuardar(usuario_id)` → Persiste alimentos detectados en SQLite
- Manejo automático de permisos de cámara y galería

#### `useHistory.ts`
Hook que carga datos de progreso nutricional desde SQLite.

```typescript
const { datosHoy, semana, cargando, cargarDatos } = useHistory();
```

- `cargarDatos(usuario_id)` → Consulta en paralelo: progreso del día + semana + metas
- Metas por defecto: 2000 kcal, 150g proteínas, 200g carbos, 65g grasas

---

###  Utilidades

#### `validators.ts` — Validaciones de Entrada

| Función | Regla |
|---|---|
| `isNonEmpty(value)` | Cadena no vacía después de trim |
| `isValidEmail(email)` | Formato `x@x.x` con regex |
| `isInRange(value, min, max)` | Valor numérico dentro del rango inclusivo |
| `isValidPeso(peso)` | Entre 1 y 500 kg |
| `isValidAltura(altura)` | Entre 50 y 280 cm |
| `isValidPassword(password)` | Mínimo 6 caracteres |

#### `formatters.ts` — Formateo de Datos

| Función | Ejemplo |
|---|---|
| `formatFecha(iso)` | `"2026-04-29"` → `"29/04/2026"` |
| `fechaDisplayToMysql(fecha)` | `"29/04/2026"` → `"2026-04-29"` |
| `formatCalories(value)` | `2123.7` → `"2124 kcal"` |
| `formatGrams(value)` | `24.567` → `"24.6 g"` |
| `calcPorcentaje(consumed, goal)` | `(800, 2000)` → `40` (máximo 100) |

#### `pdfTemplate.ts` — Plantilla HTML para PDF

Genera un documento HTML completo con estilos inline para renderizar como PDF profesional, incluyendo tabla de alimentos con macronutrientes y totales.

---

## Flujos Principales

### Flujo 1: Autenticación (Login)

```
Usuario ingresa correo y contraseña
    │
    ▼
useAuth.login() → authService.loginUser()
    │
    ├── Valida formato de correo (validators.ts)
    ├── Valida contraseña no vacía
    │
    ▼
localDb.loginLocal() → SELECT FROM usuarios WHERE correo = ? AND password = ?
    │
    ├── X Credenciales válidas → setUsuario() en UserContext → Redirige a Dashboard
    └── SI  Inválidas → Retorna { ok: false, mensaje: "Credenciales inválidas" }
```

### Flujo 2: Escaneo de Alimentos (Flujo Principal)

```
Usuario presiona "Tomar foto"
    │
    ▼
useScanner.handleScan() → expo-image-picker (solicita permisos)
    │
    ▼
Captura imagen → convierte a base64
    │
    ▼
aiAnalysisService.analyzeFood(base64)
    │
    ▼
geminiClient.analyzeImageDirectly(base64) → Google Gemini 2.5 Flash API
    │
    ├── Prompt: "Analiza la imagen de comida y devuelve JSON con
    │           nombre, calorías, proteínas, carbohidratos, grasas,
    │           azúcar y alertaAzucar (boolean)"
    │
    ▼
Respuesta JSON → Limpieza de markdown → JSON.parse → Asignación de IDs
    │
    ├──  Alimentos detectados → Mostrar en UI con desglose nutricional
    │       │
    │       ├── Si alertaAzucar === true → Modal de advertencia rojo
    │       │
    │       └── Usuario presiona "Guardar"
    │               │
    │               ▼
    │           guardarEscaneoLocalmente() → localDb.insertarConsumoLocal()
    │               → INSERT transaccional en registros_diarios
    │
    └── ❌ Sin alimentos → Alert: "No se detectaron alimentos"
```

### Flujo 3: Progreso Nutricional

```
Pantalla Explore recibe focus
    │
    ▼
useHistory.cargarDatos(usuario_id)
    │
    ├── obtenerProgresoHoyLocal()  → SUM(calorías, proteínas, carbos, grasas) WHERE fecha = HOY
    ├── obtenerProgresoSemanalLocal() → Iteración 7 días → SUM por día
    └── obtenerMetasLocal() → Calcula TMB con Harris-Benedict → Distribución de macros
    │
    ▼
Renderiza barras de progreso + gráfica semanal + gráfica de pie
```

---

##  Variables de Entorno

Archivo `.env` en la raíz del proyecto:

```env
# URL del servidor Express (para modo online, opcional)
EXPO_PUBLIC_API_URL=http://[TU_IP]:3000

# API Key de Google Gemini (requerida para análisis de IA)
EXPO_PUBLIC_GEMINI_KEY=tu_api_key_aqui
```

>  **Nota:** La API key de Gemini es necesaria para las funcionalidades de análisis de imagen. Sin ella, el escaneo de alimentos, el escaneo corporal y la lectura de diagnósticos no funcionarán.

---

##  Dependencias Clave

| Paquete | Versión | Uso en Backend |
|---|---|---|
| `expo-sqlite` | ^55.0.15 | Base de datos local SQLite |
| `expo-image-picker` | ~17.0.10 | Captura de imágenes (cámara/galería) |
| `expo-print` | ^55.0.13 | Generación de PDFs |
| `expo-sharing` | ^55.0.18 | Compartir archivos generados |
| `expo-constants` | ~18.0.13 | Lectura de configuración de entorno |
| `expo-file-system` | ^55.0.17 | Manejo de archivos locales |
| `@react-native-async-storage/async-storage` | 2.2.0 | Almacenamiento de preferencias (onboarding) |
| `axios` | ^1.15.2 | Cliente HTTP (disponible como alternativa) |

---

##  Cómo Ejecutar

### Prerrequisitos
- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`)
- Cuenta en [Google AI Studio](https://aistudio.google.com/) para obtener API key de Gemini

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/NutriVisionAI.git
cd NutriVisionAI

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env y agregar tu EXPO_PUBLIC_GEMINI_KEY

# 4. Iniciar el servidor de desarrollo
npx expo start
```

### Ejecutar en dispositivo
```bash
# Android
npx expo start --android

# iOS
npx expo start --ios
```

---

##  Equipo de Desarrollo

| Integrante | Rol |
|---|---|
| **Juan** | Coordinador del Proyecto |
| **Mariam** | Analista de Sistemas |
| **Jesús** | Desarrollador Backend |
| **Francisco** | Diseñador de Interfaz |
| **Erick Martínez** | QA — Casos de Prueba |

---

##  Licencia

Proyecto académico — Uso educativo.
