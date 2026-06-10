# NutriVision AI

## Descripción

**NutriVision AI** es una plataforma móvil para eliminar la carga mental de los pacientes con Diabetes, sustituyendo el conteo manual de carbohidratos —tedioso y propenso a errores— por un sistema visual. Mediante el uso de IA Multimodal, la app interpreta platos de comida en tiempo real, ofreciendo seguridad, prevención y libertad alimentaria a través de una interfaz intuitiva y accesible.

**Problema que se busca resolver:**
Los pacientes con Diabetes (Tipo 1 y 2) enfrentan una enorme dificultad diaria para calcular con precisión los carbohidratos de sus comidas, lo cual es vital para su dosificación de insulina. El conteo manual es propenso a errores humanos, tedioso y causa "fatiga por decisión", lo que lleva a un mal control glucémico y riesgos de salud (hipoglucemia/hiperglucemia).

Esta aplicación busca automatizar este proceso mediante Inteligencia Artificial, permitiendo un registro rápido, visual y preventivo.

---

## Usuario

**¿Quién usará el sistema?**

- **Primario:** Pacientes diagnosticados con Diabetes Mellitus Tipo 1 y 2 que requieren conteo estricto de macronutrientes.
- **Secundario:** Personas con pre-diabetes o resistencia a la insulina en proceso de reeducación alimentaria.
- **Terciario:** Cuidadores de adultos mayores o niños que necesitan monitorear la alimentación de sus pacientes a distancia.

---

## Alcance

**Qué SÍ hace:**

- **Análisis Visual:** Identifica alimentos y estima porciones mediante fotos (Snap & Track) usando IA Generativa.
- **Cálculo de Riesgo:** Estima carbohidratos netos y emite alertas visuales si detecta alimentos de alto índice glucémico.
- **Historial Médico:** Guarda un registro detallado de las comidas para revisión del nutriólogo/médico.
- **Exportación de datos:** Permite exportar el historial nutricional en formato PDF o como tabla de datos.
- **Progreso semanal:** Visualiza la actividad semanal con desglose por día y macronutrientes.
- **Accesibilidad:** Soporte de tamaño de texto, contraste y animaciones configurables.

**Qué NO hace:**

- **No prescribe insulina:** No calcula unidades de insulina a inyectar (por responsabilidad legal y seguridad médica).
- **No diagnostica:** No sustituye el juicio de un médico ni realiza diagnósticos clínicos.
- **No funciona 100% Offline:** Requiere conexión a internet para el procesamiento de la IA en la nube.

---

## Tipo de sistema

**Móvil Nativo (Android / iOS)**

**Justificación:**
Se eligió una arquitectura móvil nativa (**React Native + Expo**) porque:

1. **Hardware:** Requiere acceso directo y optimizado a la cámara del dispositivo para el escaneo de alimentos.
2. **Accesibilidad:** Permite adaptar la interfaz (fuentes grandes, alto contraste) para pacientes con dificultades visuales (retinopatía), común en el público objetivo.
3. **Ubicuidad:** El control de la diabetes es una necesidad de 24 horas; el usuario necesita la herramienta en su bolsillo, no en una computadora de escritorio.

---

## Guía de Inicio Rápido (Local)

### Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Expo Go instalado en tu dispositivo físico/móvil **o** un emulador de Android/iOS activo
- Una API Key de Google Gemini (ver sección de variables de entorno)
- Tener el equipo de computo y el celular con el mismo internet

> Si no se cuentan con Node.js
> - Ingresa a la página oficial (https://nodejs.org/es) y dirígete al cuadro verde. Al hacer clic, se te redirigirá a otra ventana donde deberás buscar la opción "Windows Installer". Al seleccionarla, la descarga comenzará automáticamente. Una vez que finalice, procede con la instalación.

> Antes de un error por parte PowerShell
> - Ingresa a PowerShell mediante administrador, ingresa el siguiente código (Set-ExecutionPolicy RemoteSigned -Scope LocalMachine), cuando salga un mensaje preguntando una confirmación tecla **S** y **enter**. Después cerrar y abrir Visual Studio Code.

### 1. Clonar el repositorio

> Se recomienda crear una carpeta en escritorio, esto para guardar el proyecto, el nombre de la carpeta es opcional.
> Se trabaja con terminal de Visual Studio Code, excepto el paso 3.

```bash
git clone https://github.com/Hydra115-code/NutriVisionAI.git
cd NutriVisionAI
git checkout -b desarrollo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto. (NutriVisionAI/.env).

Luego edita `.env` y agrega tu API Key de Google Gemini. copia lo siguiente y cambia donde indique para tu llave API Key:

```env
EXPO_PUBLIC_GEMINI_API_KEY=tu_api_key_aqui
```

> **¿Cómo obtener la API Key?**
> Ve a [Google AI Studio](https://aistudio.google.com/app/apikey), inicia sesión con tu cuenta de Google personal (no usar correo institucional o empresarial) y genera una nueva clave. Es gratuita para uso de desarrollo.

> **Importante:** El archivo `.env` está en `.gitignore` y **nunca debe subirse al repositorio** ya que contiene credenciales privadas.

### 4. Iniciar el servidor de desarrollo

```bash
npx expo start -c
```

Una vez ejecutado, se desplegará en la consola la interfaz de Metro con las opciones de conexión y el código QR de vinculación.

### 5. Abrir la app en tu dispositivo

| Método | Instrucción |
|---|---|
| **Expo Go (físico/móvil)** | Escanea el código QR con la app Expo Go. Ambos dispositivos deben estar en la misma red Wi-Fi. |
| **Emulador Android** | Presiona `a` en la terminal con el AVD activo en Android Studio. |
| **Simulador iOS** | Presiona `i` en la terminal (solo macOS con Xcode instalado). |

---

## Flujo Principal del Sistema

El recorrido del usuario está diseñado para ser sencillo y evitar errores al ingresar información de salud:

1. **Inicio de Sesión:** El usuario entra a la app con su cuenta. El sistema valida campos y muestra avisos si falta información.
2. **Registro de Perfil:** El usuario nuevo llena sus datos básicos. La app pregunta si padece Diabetes; si responde Sí, se muestran opciones adicionales para el tipo de diabetes.
3. **Validación y Seguridad:** El sistema obliga a aceptar los términos y condiciones antes de continuar.
4. **Dashboard Principal:** Panel con metas diarias, escaneo de alimentos por IA, historial y navegación por pestañas.
5. **Escaneo de Alimentos:** El usuario fotografía su platillo; la IA identifica alimentos, estima macronutrientes y emite alertas si detecta alto índice glucémico.
6. **Progreso y Exportación:** El usuario puede revisar su actividad semanal con desglose detallado y exportar su historial en PDF.

---

## Estado Actual del Desarrollo — Sprint 5

El proyecto se encuentra en el **Sprint 5 (Cierre del Producto)**, correspondiente a la asignatura Ingeniería de Software (SCD-1011), periodo 18 de mayo al 4 de junio de 2026.

Este sprint cierra el ciclo de desarrollo con una **iteración ágil de cambio**: se recibió retroalimentación externa de un docente, se transformó en una mejora concreta, se implementó, probó y documentó.

### Funcionalidades implementadas

- Autenticación local (registro, inicio de sesión, recuperación de contraseña)
- Perfil de usuario con datos biométricos (peso, altura, IMC, condición de diabetes)
- Escaneo de alimentos por IA (Google Gemini Multimodal)
- Historial de registros agrupado por fecha con detalle expandible
- Dashboard con resumen diario de calorías y macronutrientes
- Gráfica de actividad semanal con desglose en bottom sheet
- Exportación de datos en PDF (reporte de salud y tabla de datos)
- Escaneo corporal por IA para estimación de peso e IMC
- Modo claro / oscuro
- Configuración de accesibilidad (tamaño de texto, contraste, animaciones)
- Base de datos local SQLite (sin dependencia de servidor externo)

### Rama activa

Durante el Sprint 5, el trabajo se integra en la rama `desarrollo`. La rama `main` solo recibe la versión final validada al cierre del sprint.

```
feature-analista   ──┐
feature-diseno     ──┤──► desarrollo ──► main (solo si queda validado)
feature-dev        ──┤
feature-qa         ──┤
feature-coordinador┘
```

---

## Tecnologías (Stack Técnico)

| Capa | Tecnología |
|---|---|
| Frontend | React Native (Expo SDK 54) |
| Navegación | Expo Router (file-based routing) |
| Base de datos | SQLite local (expo-sqlite) |
| IA | Google Gemini 2.5 Flash (Multimodal) |
| Estilos | StyleSheet nativo + temas dinámicos |
| Exportación | expo-print + expo-sharing |

---

## Estructura del Proyecto

```
NutriVisionAI/
├── .vscode/
│   └── settings.json     # Configuración compartida del editor
├── src/
│   ├── api/              # Llamadas y configuración de APIs externas
│   ├── app/              # Rutas (Expo Router)
│   ├── assets/           # Imágenes, fuentes y recursos estáticos
│   ├── components/       # Componentes reutilizables (modales, sheets, etc.)
│   ├── constants/        # Configuración y tema visual
│   ├── context/          # Contexto global principal
│   ├── contexts/         # Contextos globales (Auth, Theme)
│   ├── database/         # Configuración y acceso a SQLite local
│   ├── docs/             # Entregables y documentación del proyecto
│   ├── hooks/            # Hooks personalizados
│   ├── screens/          # Componentes de pantalla por módulo
│   ├── services/         # Lógica de negocio (geminiService, etc.)
│   ├── types/            # Definiciones de tipos TypeScript
│   └── utils/            # Funciones utilitarias y helpers
├── .gitignore
├── app.json              # Configuración de la app Expo
├── eslint.config.js      # Reglas de linting
├── expo-env.d.ts         # Tipos de entorno Expo
├── package-lock.json     # Versiones exactas de dependencias
├── package.json          # Dependencias y scripts del proyecto
├── README.md             # Documentación principal
└── tsconfig.json         # Configuración de TypeScript
```

---

## Entregables del Sprint 5

De acuerdo con los lineamientos de la asignatura, los siguientes documentos deben estar presentes en la carpeta `docs/`:

| Archivo | Responsable | Descripción |
|---|---|---|
| `solicitud_mejora_sprint5.md` | Analista | Solicitud formal de la mejora externa |
| `analisis_impacto_mejora.md` | Analista | Análisis de impacto de la mejora |
| `ajuste_diseno_sprint5.md` | Diseñador | Ajuste de interfaz derivado de la mejora |
| `nota_tecnica_implementacion.md` | Dev Líder | Nota técnica de implementación |
| `test_report_sprint5.md` | QA | Reporte de pruebas y no regresión |
| `bitacora_sprint5.md` | Coordinador | Bitácora del sprint |
| `retrospectiva_final.md` | Coordinador | Retrospectiva final del proyecto |

---

## Equipo — Sprint 5

| Rol | Integrante | Rama |
|---|---|---|
| **Coordinador** | Francisco Javier Martinez Garcia | `feature-coordinador` |
| **Analista** | Erick Martinez Rocha | `feature-analista` |
| **Diseñador UX/UI** | Juan Antonio Castañuela Carlos | `feature-diseno` |
| **QA / Tester** | Jesus Manuel Cornejo Rangel | `feature-qa` |
| **Desarrollador** | Mariam Getzamaret Gomez Renteria | `feature-dev` |

---

## Notas de Seguridad

- El archivo `.env` contiene la API Key de Gemini y **nunca debe subirse al repositorio**.
- El archivo `.env.example` sirve como plantilla — cópialo y renómbralo a `.env`.
- La base de datos SQLite se almacena localmente en el dispositivo; no se transmiten datos a servidores externos salvo las imágenes enviadas a la API de Gemini para análisis.
