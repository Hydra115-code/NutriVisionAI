# Documento de Pruebas y Control de Calidad — NutriVision AI

**Proyecto:** NutriVision AI
**Rol:** QA / Tester
**Responsable:** Erick Martinez Rocha
**Periodo de pruebas:** Sprint 1 – Sprint 3
**Fecha del documento:** 29 de Abril de 2026

---

## 1. Introduccion

El presente documento tiene como objetivo registrar y documentar de forma integral las actividades de aseguramiento de calidad (QA) realizadas durante el desarrollo del proyecto NutriVision AI, una aplicacion movil construida con React Native y Expo que utiliza inteligencia artificial (Google Gemini 2.5 Flash) para el analisis nutricional visual de alimentos, orientada principalmente a pacientes con diabetes.

Como QA del equipo, mi labor consistio en disenar y ejecutar casos de prueba, identificar defectos durante las sesiones de prueba y error, documentar los fallos encontrados, verificar las correcciones implementadas por el equipo de desarrollo, y validar que los criterios de aceptacion definidos por la analista se cumplieran en cada sprint.

Las pruebas se realizaron de manera iterativa a lo largo de 3 sprints, comenzando con pruebas basicas de navegacion y formularios, avanzando a pruebas de autenticacion y base de datos, y culminando con pruebas de integracion de IA, accesibilidad y rendimiento.

---

## 2. Metodologia de Pruebas

### 2.1 Tipos de pruebas aplicadas

- **Pruebas funcionales:** Verificacion de que cada funcionalidad cumple con los requerimientos definidos por la analista.
- **Pruebas de validacion de datos:** Verificacion de que los campos de entrada aplican las restricciones de formato, rango y obligatoriedad.
- **Pruebas de integracion:** Verificacion de la comunicacion entre la capa de servicios, la base de datos SQLite y la API de Google Gemini.
- **Pruebas de regresion:** Re-ejecucion de casos previos despues de cada correccion para asegurar que los cambios no introdujeran nuevos defectos.
- **Pruebas de accesibilidad:** Verificacion de las funcionalidades de zoom de texto, alto contraste y fuente en negrita.
- **Pruebas de manejo de errores:** Verificacion de que la aplicacion maneja correctamente los escenarios de fallo (sin internet, API caida, datos invalidos) sin crashear.

### 2.2 Entorno de pruebas

| Componente | Detalle |
|---|---|
| Sistema operativo de desarrollo | Windows |
| Framework | React Native 0.81.5 + Expo SDK 54 |
| Emulador | Android Studio AVD |
| Dispositivo fisico | Dispositivo Android via Expo Go |
| Base de datos | SQLite local (expo-sqlite) |
| API de IA | Google Gemini 2.5 Flash |
| Herramienta de desarrollo | Metro Bundler (Expo) |

### 2.3 Formato de casos de prueba

Cada caso de prueba se documento con los siguientes campos:

- **ID:** Identificador unico del caso (CP-001, CP-002, etc.)
- **Modulo:** Area funcional de la aplicacion bajo prueba
- **Entrada:** Datos o acciones proporcionadas al sistema
- **Resultado esperado:** Comportamiento que deberia tener el sistema segun los requerimientos
- **Resultado obtenido:** Comportamiento real observado durante la ejecucion de la prueba
- **Estado final:** APROBADO o FALLIDO (con detalle de la correccion si aplica)

---

## 3. Registro Cronologico de Pruebas y Defectos

### 3.1 Sprint 1 — Formularios y Navegacion Basica

#### Sesion de pruebas: Formulario de Registro

Durante las primeras pruebas del formulario de registro, se identificaron varios defectos relacionados con la falta de validaciones en los campos de entrada.

#### DEFECTO #1 — Registro permitido sin campos obligatorios

| Campo | Detalle |
|---|---|
| **ID** | DEF-001 |
| **Severidad** | Alta |
| **Entrada** | Presionar "Finalizar Registro" con todos los campos vacios |
| **Resultado esperado** | El sistema debe bloquear el registro y mostrar un mensaje indicando que campos faltan |
| **Resultado obtenido (ANTES del fix)** | La aplicacion intentaba ejecutar la insercion en la base de datos con valores vacios, generando un error de SQLite por campos NOT NULL violados. La app mostraba un error generico de "No se pudo registrar" sin indicar la causa |
| **Correccion aplicada** | Se implemento validacion previa en la funcion handleFinalize() que verifica nombre, apellido, correo, fecha de nacimiento, peso, altura y sexo antes de ejecutar el registro. Se muestra una alerta clara: "Campos Vacios — Por favor, completa todos los campos esenciales" |
| **Resultado obtenido (DESPUES del fix)** | La alerta se muestra correctamente y el registro no se ejecuta hasta completar todos los campos |
| **Estado final** | **APROBADO** |

#### DEFECTO #2 — Diabetes: usuario podia seleccionar "Si" sin elegir tipo

| Campo | Detalle |
|---|---|
| **ID** | DEF-002 |
| **Severidad** | Alta |
| **Entrada** | Marcar "Si" en la pregunta "Padeces Diabetes?" sin seleccionar ningun tipo de diabetes, y presionar "Finalizar Registro" |
| **Resultado esperado** | El sistema debe requerir que el usuario seleccione el tipo de diabetes antes de continuar |
| **Resultado obtenido (ANTES del fix)** | El registro se completaba con el campo tipo_diabetes vacio en la base de datos, lo cual afectaba el calculo de metas nutricionales (la formula necesita saber si el usuario es diabetico para ajustar los carbohidratos al 40%) |
| **Correccion aplicada** | Se agrego validacion: si tieneDiabetes === 'si' y tipoDiabetes === '', se muestra alerta "Selecciona que tipo de diabetes padeces" y se bloquea el registro |
| **Resultado obtenido (DESPUES del fix)** | La validacion funciona correctamente. Los tipos disponibles (Tipo 1, Tipo 2, Gestacional, Pre.Diabetes) se muestran como tags seleccionables |
| **Estado final** | **APROBADO** |

#### DEFECTO #3 — Terminos y condiciones no eran obligatorios

| Campo | Detalle |
|---|---|
| **ID** | DEF-003 |
| **Severidad** | Alta |
| **Entrada** | Completar todos los campos pero no marcar el checkbox de "Acepto los Terminos de Uso" |
| **Resultado esperado** | El sistema debe impedir el registro hasta que el usuario acepte los terminos |
| **Resultado obtenido (ANTES del fix)** | El registro se completaba sin que el usuario aceptara los terminos legales |
| **Correccion aplicada** | Se agrego validacion !aceptaTerminos con alerta "Debes aceptar los terminos para continuar". Adicionalmente, el boton "Finalizar Registro" muestra opacidad reducida (0.6) como indicacion visual de que no esta disponible |
| **Resultado obtenido (DESPUES del fix)** | El registro se bloquea correctamente y el boton se ve visualmente deshabilitado |
| **Estado final** | **APROBADO** |

---

### 3.2 Sprint 2 — Autenticacion y Base de Datos

#### Sesion de pruebas: Login y Base de Datos SQLite

#### DEFECTO #4 — Error de conexion al backend remoto

| Campo | Detalle |
|---|---|
| **ID** | DEF-004 |
| **Severidad** | Critica |
| **Entrada** | Intentar iniciar sesion con la aplicacion apuntando al servidor Express remoto |
| **Resultado esperado** | Login exitoso o mensaje de error claro si el servidor no esta disponible |
| **Resultado obtenido (ANTES del fix)** | La aplicacion se colgaba durante aproximadamente 10 segundos esperando la respuesta del servidor, y luego mostraba un error generico "No se pudo conectar al servidor" sin ofrecer alternativa. Los usuarios no podian usar la app si el backend no estaba corriendo |
| **Correccion aplicada** | Se migro toda la logica de autenticacion a operar sobre SQLite local. El archivo authService.ts fue refactorizado para llamar a loginLocal() y registerLocal() de localDb.ts en lugar de las funciones del backendClient.ts. Esto permitio que la app funcione completamente offline |
| **Resultado obtenido (DESPUES del fix)** | Login funciona instantaneamente sin depender de conexion a internet. Los datos se almacenan y consultan localmente en SQLite |
| **Estado final** | **APROBADO** |
| **Impacto** | Este cambio afecto la arquitectura completa de la app, pasando de cliente-servidor a offline-first |

#### DEFECTO #5 — Puerto 8081 de Metro ocupado

| Campo | Detalle |
|---|---|
| **ID** | DEF-005 |
| **Severidad** | Baja (desarrollo) |
| **Entrada** | Ejecutar npx expo start cuando el puerto 8081 ya estaba siendo usado por un proceso de una sesion anterior |
| **Resultado esperado** | Metro debe iniciar correctamente o notificar del conflicto |
| **Resultado obtenido (ANTES del fix)** | Metro se quedaba cargando indefinidamente sin mostrar error. La app no se conectaba al dispositivo/emulador |
| **Correccion aplicada** | Se identifico el proceso con netstat -ano, se termino con taskkill /PID /F, y se reinicio Metro. Se documento el procedimiento para el equipo |
| **Resultado obtenido (DESPUES del fix)** | Metro inicia correctamente despues de liberar el puerto |
| **Estado final** | **APROBADO** |

#### DEFECTO #6 — Correo duplicado aceptado en registro

| Campo | Detalle |
|---|---|
| **ID** | DEF-006 |
| **Severidad** | Alta |
| **Entrada** | Registrar un usuario con un correo electronico que ya existia en la base de datos |
| **Resultado esperado** | Rechazar el registro con mensaje "El correo ya esta registrado" |
| **Resultado obtenido (ANTES del fix)** | SQLite lanzaba un error UNIQUE constraint violation que se mostraba como un error tecnico al usuario |
| **Correccion aplicada** | Se agrego la funcion checkEmailExists() en localDb.ts que ejecuta SELECT COUNT(*) antes del INSERT. En authService.ts se verifica el resultado y se retorna un mensaje amigable |
| **Resultado obtenido (DESPUES del fix)** | Se muestra alerta clara "El correo ya esta registrado" sin exponer detalles tecnicos |
| **Estado final** | **APROBADO** |

#### DEFECTO #7 — Contrasena sin requisitos de seguridad

| Campo | Detalle |
|---|---|
| **ID** | DEF-007 |
| **Severidad** | Media |
| **Entrada** | Registrar un usuario con contrasena "123" (3 caracteres, sin simbolos especiales) |
| **Resultado esperado** | Rechazar contrasenas debiles con indicacion clara de los requisitos |
| **Resultado obtenido (ANTES del fix)** | Cualquier contrasena era aceptada, incluyendo contrasenas de un solo caracter |
| **Correccion aplicada** | Se implemento doble validacion: (1) longitud entre 6 y 20 caracteres, (2) al menos un simbolo especial validado con regex |
| **Resultado obtenido (DESPUES del fix)** | Se muestran alertas especificas segun el problema: "La contrasena debe tener entre 6 y 20 caracteres" o "La contrasena debe incluir al menos un simbolo especial" |
| **Estado final** | **APROBADO** |

---

### 3.3 Sprint 3 — Integracion de IA, Accesibilidad y Progreso

#### Sesion de pruebas: Integracion con Google Gemini

#### DEFECTO #8 — Gemini devuelve JSON envuelto en bloques markdown

| Campo | Detalle |
|---|---|
| **ID** | DEF-008 |
| **Severidad** | Alta |
| **Entrada** | Escanear un alimento con la camara. Gemini responde con el JSON correcto pero envuelto en bloques de codigo markdown |
| **Resultado esperado** | El sistema debe parsear la respuesta correctamente independientemente del formato |
| **Resultado obtenido (ANTES del fix)** | JSON.parse() fallaba porque el texto contenia caracteres de markdown antes y despues del JSON valido. La app mostraba "Error al analizar la imagen" y no detectaba ningun alimento |
| **Correccion aplicada** | Se implemento limpieza defensiva en geminiClient.ts antes del parseo con expresiones regulares. Esta limpieza se aplica en las 3 funciones del cliente (analyzeImageDirectly, estimateBodyStatsDirectly, analyzeDiagnosisDirectly) |
| **Resultado obtenido (DESPUES del fix)** | Las respuestas se parsean correctamente independientemente de si Gemini envuelve o no el JSON en markdown |
| **Estado final** | **APROBADO** |
| **Notas** | Este fue uno de los bugs mas dificiles de detectar porque ocurria de forma intermitente: a veces Gemini enviaba JSON limpio y a veces lo envolvia en markdown |

#### DEFECTO #9 — Gemini devuelve texto narrativo en lugar de JSON

| Campo | Detalle |
|---|---|
| **ID** | DEF-009 |
| **Severidad** | Alta |
| **Entrada** | Escanear una imagen ambigua o de baja calidad |
| **Resultado esperado** | Si la IA no puede analizar, mostrar un mensaje amigable sin crashear la app |
| **Resultado obtenido (ANTES del fix)** | Gemini respondia con texto libre como "No puedo identificar claramente los alimentos en esta imagen..." en lugar de JSON. JSON.parse() fallaba y la app crasheaba con un error no capturado |
| **Correccion aplicada** | Se envolvio JSON.parse() en un try/catch especifico dentro de geminiClient.ts. Si el parseo falla, se retorna { ok: false, mensaje: 'La IA devolvio un formato inesperado.', alimentos: [] }. La app nunca crashea |
| **Resultado obtenido (DESPUES del fix)** | Se muestra mensaje amigable "No se detectaron alimentos" y la app permanece funcional |
| **Estado final** | **APROBADO** |

#### DEFECTO #10 — base64 undefined al cancelar la camara durante diagnostico

| Campo | Detalle |
|---|---|
| **ID** | DEF-010 |
| **Severidad** | Alta |
| **Entrada** | En la pantalla de registro, presionar "Rellenar con Diagnostico", abrir la camara y luego cancelar sin tomar foto |
| **Resultado esperado** | La app debe volver al formulario de registro sin errores |
| **Resultado obtenido (ANTES del fix)** | La funcion analizarDiagnostico() recibia undefined como parametro de base64 porque el resultado del image picker no contenia datos cuando el usuario cancelaba. Esto causaba que se enviara undefined a la API de Gemini, generando un error HTTP 400 |
| **Correccion aplicada** | Se agrego verificacion explicita antes de llamar a la funcion de analisis: if (!res.canceled && res.assets[0].base64). El codigo tiene comentarios documentando esta correccion |
| **Resultado obtenido (DESPUES del fix)** | Al cancelar la camara, la app regresa al formulario sin errores ni llamadas innecesarias a la API |
| **Estado final** | **APROBADO** |

#### DEFECTO #11 — Error de tipos en componente ModalLista

| Campo | Detalle |
|---|---|
| **ID** | DEF-011 |
| **Severidad** | Media |
| **Entrada** | Compilacion de TypeScript del componente ModalLista en register.tsx |
| **Resultado esperado** | El componente debe compilar sin errores de tipo |
| **Resultado obtenido (ANTES del fix)** | TypeScript marcaba error en las props del componente ModalLista porque no tenian tipos explicitos. Los parametros visible, opciones, onSelect y onClose eran de tipo implicito 'any' |
| **Correccion aplicada** | Se creo la interfaz ModalListaProps con tipos explicitos para cada prop y se aplico al componente |
| **Resultado obtenido (DESPUES del fix)** | Compilacion limpia sin warnings de TypeScript |
| **Estado final** | **APROBADO** |

#### Sesion de pruebas: Modo Oscuro y Tematizacion

#### DEFECTO #12 — Colores hardcodeados no cambiaban con modo oscuro

| Campo | Detalle |
|---|---|
| **ID** | DEF-012 |
| **Severidad** | Media |
| **Entrada** | Activar el modo oscuro desde el toggle en la pantalla de perfil |
| **Resultado esperado** | Toda la interfaz debe cambiar a paleta oscura: fondos, tarjetas, textos y bordes |
| **Resultado obtenido (ANTES del fix)** | Varios componentes tenian colores escritos directamente en el codigo (por ejemplo, backgroundColor: '#ffffff') en lugar de usar las variables del tema. Al activar modo oscuro, algunas tarjetas se quedaban blancas sobre fondo oscuro, haciendo el texto ilegible |
| **Correccion aplicada** | Se refactorizaron todos los componentes para usar las variables dinamicas de ThemeContext: colors.bg, colors.textMain, colors.mainCard, colors.border, colors.textSecondary. Se eliminaron todos los colores hardcodeados |
| **Resultado obtenido (DESPUES del fix)** | El modo oscuro se aplica uniformemente en todas las pantallas sin elementos con colores inconsistentes |
| **Estado final** | **APROBADO** |

#### Sesion de pruebas: Accesibilidad

#### DEFECTO #13 — Accesibilidad no era global

| Campo | Detalle |
|---|---|
| **ID** | DEF-013 |
| **Severidad** | Alta |
| **Entrada** | Configurar zoom de texto en el onboarding y luego navegar a otras pantallas |
| **Resultado esperado** | Las configuraciones de accesibilidad deben persistir en todas las pantallas |
| **Resultado obtenido (ANTES del fix)** | Las configuraciones de zoom, alto contraste y fuente en negrita solo se aplicaban en la pantalla de onboarding. Al navegar al login o al dashboard, los textos volvian a su tamano normal |
| **Correccion aplicada** | Se implemento AccessibilityContext como contexto global que envuelve toda la aplicacion. Cada pantalla accede a los valores fontScale, highContrast y boldText desde el contexto. Todas las propiedades de estilo fontSize se multiplican por fontScale |
| **Resultado obtenido (DESPUES del fix)** | Las configuraciones de accesibilidad se mantienen en todas las pantallas de la app. Se agrego ademas un boton flotante azul de accesibilidad visible en todas las pantallas para ajustar configuraciones en cualquier momento |
| **Estado final** | **APROBADO** |

#### Sesion de pruebas: API Key y Configuracion

#### DEFECTO #14 — App crasheaba sin API Key de Gemini

| Campo | Detalle |
|---|---|
| **ID** | DEF-014 |
| **Severidad** | Alta |
| **Entrada** | Ejecutar la app sin haber configurado la variable EXPO_PUBLIC_GEMINI_KEY en el archivo .env |
| **Resultado esperado** | La app debe funcionar normalmente excepto las funcionalidades de IA, mostrando un mensaje claro |
| **Resultado obtenido (ANTES del fix)** | Al intentar escanear un alimento, la app enviaba una solicitud a la API de Gemini sin API key, recibia un error HTTP 401, y no mostraba un mensaje comprensible al usuario |
| **Correccion aplicada** | Se agrego verificacion de la API key al inicio de cada funcion en geminiClient.ts. Adicionalmente, config.ts muestra un console.warn al iniciar la app si la key no esta presente |
| **Resultado obtenido (DESPUES del fix)** | La app funciona normalmente para login, registro y progreso. Al intentar escanear, muestra el mensaje informativo sin crashear |
| **Estado final** | **APROBADO** |

---

## 4. Resumen de Defectos Encontrados

| ID | Sprint | Severidad | Modulo | Descripcion | Estado |
|---|---|---|---|---|---|
| DEF-001 | Sprint 1 | Alta | Registro | Registro permitido con campos vacios | Corregido |
| DEF-002 | Sprint 1 | Alta | Registro | Diabetes "Si" sin tipo seleccionado | Corregido |
| DEF-003 | Sprint 1 | Alta | Registro | Terminos y condiciones no obligatorios | Corregido |
| DEF-004 | Sprint 2 | Critica | Autenticacion | Backend remoto causaba cuelgue de la app | Corregido |
| DEF-005 | Sprint 2 | Baja | Desarrollo | Puerto 8081 de Metro ocupado | Documentado |
| DEF-006 | Sprint 2 | Alta | Registro | Correo duplicado generaba error tecnico | Corregido |
| DEF-007 | Sprint 2 | Media | Registro | Contrasena sin requisitos de seguridad | Corregido |
| DEF-008 | Sprint 3 | Alta | Escaner IA | JSON de Gemini envuelto en markdown | Corregido |
| DEF-009 | Sprint 3 | Alta | Escaner IA | Gemini devuelve texto libre, app crasheaba | Corregido |
| DEF-010 | Sprint 3 | Alta | Registro IA | base64 undefined al cancelar camara | Corregido |
| DEF-011 | Sprint 3 | Media | Registro | Error de tipos TypeScript en ModalLista | Corregido |
| DEF-012 | Sprint 3 | Media | UI/Tema | Colores hardcodeados en modo oscuro | Corregido |
| DEF-013 | Sprint 3 | Alta | Accesibilidad | Configuraciones no eran globales | Corregido |
| DEF-014 | Sprint 3 | Alta | Configuracion | App crasheaba sin API Key de Gemini | Corregido |

---

## 5. Metricas Generales

| Metrica | Valor |
|---|---|
| Total de defectos encontrados | 14 |
| Defectos corregidos | 14 (100%) |
| Defectos pendientes | 0 |
| Severidad Critica | 1 |
| Severidad Alta | 9 |
| Severidad Media | 3 |
| Severidad Baja | 1 |
| Casos de prueba ejecutados | 50 |
| Casos aprobados | 50 (100%) |

---

## 6. Casos de Prueba Ejecutados (Resumen)

Se disenaron y ejecutaron un total de **50 casos de prueba** distribuidos en los siguientes modulos:

| Modulo | Casos | Aprobados |
|---|---|---|
| Autenticacion (Login) | 5 | 5 |
| Registro — Validaciones | 10 | 10 |
| Escaner IA (Analisis de alimentos) | 8 | 8 |
| Progreso Nutricional | 5 | 5 |
| Perfil de Usuario | 5 | 5 |
| Base de Datos SQLite | 2 | 2 |
| Accesibilidad | 4 | 4 |
| IA en Registro (Diagnostico/Escaneo) | 2 | 2 |
| API Gemini (Manejo de errores) | 3 | 3 |
| Navegacion | 2 | 2 |
| Conectividad y Entorno | 4 | 4 |
| **TOTAL** | **50** | **50** |

La matriz completa con el detalle de cada caso de prueba (Entrada, Resultado Esperado, Resultado Obtenido y Estado Final) se encuentra en el archivo adjunto **Matriz_QA_NutriVisionAI.csv**.

---

## 7. Conclusiones y Recomendaciones

### 7.1 Conclusiones

1. **Todos los defectos criticos y altos fueron resueltos.** Los 14 defectos identificados durante las sesiones de prueba y error fueron corregidos y verificados satisfactoriamente.

2. **La migracion a SQLite local fue la decision mas impactante.** El defecto DEF-004 (dependencia del backend remoto) afectaba la usabilidad fundamental de la app. La migracion a una arquitectura offline-first resolvio los problemas de conectividad y mejoro drasticamente el tiempo de respuesta del login y registro.

3. **La integracion con Gemini requirio manejo defensivo.** Los defectos DEF-008 y DEF-009 demuestran que las APIs de inteligencia artificial pueden devolver respuestas en formatos inesperados. La implementacion de limpieza de markdown y parseo defensivo de JSON fue esencial para la estabilidad de la app.

4. **La accesibilidad requirio refactorizacion global.** El defecto DEF-013 evidencio que las funcionalidades de accesibilidad no pueden implementarse como features aisladas, sino que deben ser parte de la arquitectura base de la aplicacion mediante un contexto global.

5. **Las validaciones de seguridad fueron progresivas.** Los defectos DEF-001 a DEF-003 y DEF-006 a DEF-007 muestran que las validaciones de formularios se fueron fortaleciendo incrementalmente a lo largo de los sprints, pasando de validaciones basicas (campos no vacios) a validaciones de seguridad (contrasenas con simbolos, verificacion de duplicados).

### 7.2 Recomendaciones para sprints futuros

1. **Implementar pruebas automatizadas** con Jest y React Native Testing Library para los servicios criticos (authService, aiAnalysisService, localDb).

2. **Agregar encriptacion de contrasenas** con bcrypt o similar antes de almacenarlas en SQLite (actualmente se almacenan en texto plano en la version MVP).

3. **Implementar manejo de sesion persistente** con tokens para evitar que el usuario tenga que hacer login cada vez que cierra la app.

4. **Agregar pruebas de rendimiento** para medir tiempos de respuesta de la API de Gemini y optimizar la calidad de imagen enviada (actualmente quality: 0.7).

5. **Considerar sincronizacion opcional** con un backend remoto para respaldo de datos cuando haya conexion a internet disponible.

