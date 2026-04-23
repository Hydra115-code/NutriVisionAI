# NutriVision AI 

## Descripción
**NutriVision AI** es una plataforma móvil para eliminar la carga mental de los pacientes con Diabetes, sustituyendo el conteo manual de carbohidratos —tedioso y propenso a errores— por un sistema visual. Mediante el uso de IA Multimodal, la app interpreta platos de comida en tiempo real, ofreciendo seguridad, prevención y libertad alimentaria a través de una interfaz intuitiva y accesible.

**Problema que se busca resolver:**
Los pacientes con Diabetes (Tipo 1 y 2) enfrentan una enorme dificultad diaria para calcular con precisión los carbohidratos de sus comidas, lo cual es vital para su dosificación de insulina. El conteo manual es propenso a errores humanos, tedioso y causa "fatiga por decisión", lo que lleva a un mal control glucémico y riesgos de salud (hipoglucemia/hiperglucemia).

Esta aplicación busca automatizar este proceso mediante Inteligencia Artificial, permitiendo un registro rápido, visual y preventivo.

## Usuario
**¿Quién usará el sistema?**
* **Primario:** Pacientes diagnosticados con Diabetes Mellitus Tipo 1 y 2 que requieren conteo estricto de macronutrientes.
* **Secundario:** Personas con pre-diabetes o resistencia a la insulina en proceso de reeducación alimentaria.
* **Terciario:** Cuidadores de adultos mayores o niños que necesitan monitorear la alimentación de sus pacientes a distancia.

## Alcance
**Qué SÍ hace:**
* **Análisis Visual:** Identifica alimentos y estima porciones mediante fotos (Snap & Track) usando IA Generativa.
* **Cálculo de Riesgo:** Estima carbohidratos netos y emite alertas visuales (Semáforo) si detecta alimentos de alto índice glucémico.
* **Historial Médico:** Guarda un registro detallado de las comidas para revisión del nutriólogo/médico.
* **Modo Cuidador:** Permite la supervisión remota de lo que come el paciente.

**Qué NO hace:**
* **No prescribe insulina:** No calcula unidades de insulina a inyectar (por responsabilidad legal y seguridad médica).
* **No diagnostica:** No sustituye el juicio de un médico ni realiza diagnósticos clínicos.
* **No funciona 100% Offline:** Requiere conexión a internet para el procesamiento de la IA en la nube.

## Tipo de sistema
**Móvil Nativo (Android / iOS)**

**Justificación:**
Se eligió una arquitectura móvil nativa (**React Native + Expo**) porque:
1.  **Hardware:** Requiere acceso directo y optimizado a la cámara del dispositivo para el escaneo de alimentos.
2.  **Accesibilidad:** Permite adaptar la interfaz (fuentes grandes, alto contraste) para pacientes con dificultades visuales (retinopatía), común en el público objetivo.
3.  **Ubicuidad:** El control de la diabetes es una necesidad de 24 horas; el usuario necesita la herramienta en su bolsillo, no en una computadora de escritorio.

---

## Guía de Inicio Rápido (Local)
Para el despliegue de la interfaz y la validación del flujo de usuario en un entorno de desarrollo local, siga los protocolos técnicos descritos a continuación:

1. Preparación del Entorno y Dependencias
Antes de la ejecución, desde la terminal, en la raíz del proyecto, ejecute:

npm install

Este comando instalará el motor de React Native, las dependencias de Expo SDK y los módulos de NativeWind configurados para el diseño.

2. Inicialización del Servidor de Metro Bundler
Para compilar el código JavaScript y habilitar el hot-reloading, inicie el entorno de desarrollo mediante:

npx expo start -c

Una vez ejecutado, se desplegará en la consola la interfaz de Metro con las opciones de conexión y el código QR de vinculación.

3. Despliegue en Entornos de Prueba
Existen dos métodos validados para interactuar con el flujo del sistema:

Emulador de Android (Recomendado): Asegúrese de que el AVD (Android Virtual Device) esté activo en Android Studio. Posteriormente, presione la tecla a en la terminal. El sistema instalará automáticamente el APK de desarrollo y abrirá la pantalla de inicio de sesión.

Dispositivo Físico: Utilice la aplicación Expo Go (disponible en Play Store/App Store). Escanee el código QR generado en la terminal. Ambos dispositivos (computadora y móvil) deben estar conectados a la misma red local para permitir la transferencia de paquetes.

4. Pruebas de Flujo y Navegación
Con la aplicación en ejecución, se puede verificar la lógica de navegación implementada en este sprint


## Flujo Principal del Sistema

El recorrido del usuario está diseñado para ser sencillo y evitar errores al ingresar información de salud. El orden es el siguiente:

Inicio de Sesión: El usuario entra a la app con su cuenta. El sistema verifica que los campos no estén vacíos y avisa si falta información para poder continuar.

Registro de Perfil: Si es un usuario nuevo, llena sus datos básicos como nombre, edad y peso. En esta parte, la app hace una pregunta clave: "¿Padeces Diabetes?".

Si el usuario responde que Sí, se abren opciones extra para elegir su tipo de diabetes.

Si responde que No, estas opciones se mantienen ocultas para no saturar la pantalla.

Validación y Seguridad: Antes de terminar, el sistema obliga a aceptar los términos y condiciones. Si el usuario olvida llenar un dato o no acepta los términos, la app muestra un aviso y le impide avanzar hasta que todo esté correcto.

Pantalla Principal (Dashboard): Una vez registrado, el usuario llega al panel principal donde puede ver sus metas diarias y navegar por las diferentes secciones de la app (como el perfil y el escáner de comida) usando la barra de navegación inferior.

## Estado Actual del Desarrollo
El proyecto se encuentra al cierre del Sprint 3, habiendo evolucionado de una fase de análisis a un Producto Mínimo Viable (MVP) Operativo. El estado actual se resume en los siguientes puntos:

Interfaz Funcional: Las pantallas de Inicio de Sesión y Registro están totalmente desarrolladas y conectadas mediante un sistema de navegación basado en archivos.

Lógica de Validación: Se han implementado reglas de negocio que impiden el avance del usuario si existen campos vacíos o si no se han aceptado los términos legales, garantizando la integridad de la base de datos.

Componentes Inteligentes: El formulario de registro cuenta con lógica condicional que adapta la interfaz según el perfil médico del usuario (diabetes tipo 1, 2, etc.).

Infraestructura de Pruebas: El entorno está configurado para ejecutarse en emuladores de Android Studio, permitiendo realizar demostraciones en tiempo real del flujo completo del sistema.

Navegación Estructurada: El sistema de pestañas principal (Tabs) está listo para recibir la integración de los módulos de Inteligencia Artificial.

## Tecnologías Tentativas (Stack Técnico)
* **Frontend:** React Native (Expo) + NativeWind.
* **Backend:** Node.js (Express) para gestión de alertas y usuarios.
* **Base de Datos:** MySQL (Relacional) para integridad de expedientes.
* **IA:** Google Gemini 2.5 Flash (Multimodal) para reconocimiento de imágenes.

## Equipo (Roles Sprint 1)
* Coordinador: [Juan Antonio Castañuela Carlos]
* **Analista:** [Mariam Getzamaret Gomez Renteria]
* **Diseñador UX/UI:** [Francisco Javier Martinez Garcia]
* **QA / Tester:** [Erick Martinez Rocha]
* **Desarrollador:** [Jesus Manuel Cornejo Rangel]
# Estado del Proyecto
sprint 3
