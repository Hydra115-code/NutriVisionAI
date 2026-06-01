Reporte de Pruebas – Sprint 5 

**\*\*Proyecto:\*\***  NutriVisión AI

\*\*Equipo:\*\*  Phoenix

\*\*Rol:\*\*  QA/Tester 

**\*\*Integrante:\*\***  Jesús Manuel Cornejo Rangel 

\*\*Rama:\*\*  ‘featuer\_qa’

\*\*Fecha:\*\*  31 de mayo de 2026

**\*\*Estado General:\*\*** FUNCIONAL (Evaluación en Expo Go) 

**1. Casos Específicos de la Mejora (4 Casos)**

**## CP-01 — Exportar datos en PDF**

- **Objetivo:** Exportar la información del usuario sobre la evolución de su alimentación. 
- **Entrada:** Escanear cualquier alimento legítimo → verificar la parte inferior de la pantalla de resultados nutricionales → posteriormente dirigirse a la sección de perfil/progreso y oprimir el botón “exportar información”. 
- **Resultado esperado:** Exportación de un documento PDF hablando sobre la evolución del usuario. El sistema procesa los datos de DatabaseLite y abre el menú nativo del celular para guardar o compartir el archivo exportado con éxito. 
- **Resultado obtenido:** El sistema procesó los datos locales de DatabaseLite de manera correcta y desplegó el menú nativo del móvil para compartir el archivo PDF de evolución. 
- **Estatus:** Pasa 

**## CP-02 — Introducción al sistema**

- **Objetivo:** Mostrarle al usuario lo que la aplicación le presenta. 
- **Entrada:** Al momento de entrar a la aplicación se muestra un resumen de lo que puede hacer o ayudar. 
- **Resultado esperado:** Un pequeño resumen y tutorial sobre la aplicación para mejor entendimiento. 
- **Resultado obtenido:** Se despliega correctamente el resumen inicial junto con el tutorial de inducción interactivo. 
- **Estatus:** Pasa 

**## CP-03 — Comprensión de recomendaciones de salud**

- **Objetivo:** Mostrar avisos de mejorar la alimentación para el usuario. 
- **Entrada:** Captura de imagen sobre la comida → mostrar un mensaje sobre cuidar su alimentación. 
- **Resultado esperado:** El mensaje de advertencia es completamente digerible para cualquier persona. No utiliza tecnicismos médicos complejos. 
- **Resultado obtenido:** Las alertas y sugerencias nutricionales se presentan con un lenguaje claro, accesible y libre de tecnicismos complejos. 
- **Estatus:**  Pasa 

**## CP-04 — Aviso legal de la IA**

- **Objetivo:** Prevenir al usuario sobre no depositar demasiada confianza al escaneo, solo por ser respaldado por IA. 
- **Entrada:** Escanear el platillo → mostrar mensaje sobre evitar responsabilidades y consultar con especialistas. 
- **Resultado esperado:** En el paso 2, se lee claramente el anuncio/advertencia legal indicando que la información proviene de una IA y que el usuario no debe tomarla como 100% confiable (descargo de responsabilidad médica). 
- **Resultado obtenido:** El descargo de responsabilidad médica se visualiza de forma destacada y clara durante el segundo paso del flujo. 
- **Estatus:** Pasa 


**2. Pruebas de No Regresión — Flujo Principal (3 Casos)**

**## CNR-01 — Activación de cámara en el escáner**

- **Objetivo:** Verificar que el flujo básico de captura de imágenes permanezca intacto tras las actualizaciones.
- **Resultado esperado:** El escáner de imágenes sigue activando la cámara correctamente. 
- **Resultado obtenido:** La cámara se activa de manera inmediata y correcta al pulsar el botón del escáner. 
- **Estatus:**  Pasa 

**## CNR-02 — Persistencia de sesión de usuario**

- **Objetivo:** Validar el mantenimiento del estado de la sesión local.
- **Resultado esperado:** La base de datos (DatabaseLite) mantiene la sesión activa del usuario. 
- **Resultado obtenido:** Los datos de sesión persisten correctamente en la base de datos local sin desligues inesperados. 
- **Estatus:**  Pasa 

**## CNR-03 — Renderizado de la gráfica de evolución**

- **Objetivo:** Confirmar la integridad visual del progreso histórico del usuario.
- **Resultado esperado:** La gráfica de evolución se renderiza sin errores visuales. 
- **Resultado obtenido:** Los componentes gráficos cargan de forma limpia y muestran los datos de evolución de manera correcta. 
- **Estatus:**  Pasa 


**3. Caso de Error con Dato Inválido (1 Caso)**

**## CE-01 — Escaneo de imagen inválida o no comestible**

- **Objetivo:** Evaluar la resiliencia del sistema frente al escaneo de objetos no aptos o fallas concurrentes. 
- **Entrada:** Se abre la cámara → se escanea un objeto no comestible o inválido → se analiza la imagen. 
- **Resultado esperado:** La aplicación no debe cerrarse inesperadamente (hacer crash) ni quedarse congelada infinitamente en una animación de carga. La API de la IA debe responder controladamente y la app debe desplegar un mensaje de error claro y amigable para el usuario, como: *"No logramos identificar un alimento en la imagen. Por favor, intenta capturar el producto nuevamente"*. 
- **Resultado obtenido:** El sistema manejó la excepción sin caídas ni bloqueos de pantalla; se mostró correctamente el mensaje amigable de error al usuario. 
- **Estatus:**  Pasa 
- **Evidencia:** [captura de pantalla o descripción]

**4. Conclusión y Firma de Liberación**

**Dictamen Final de QA**

Tras verificar la implementación de las mejoras sugeridas y la corrección de los dos puntos pendientes, la versión en Expo Go se declara oficialmente como: **[FUNCIONAL]**. 

La aplicación funciona correctamente y no presenta fallos estructurales. Se muestran de forma adecuada las recomendaciones y los avisos de emergencia diseñados para personas con diabetes. 

A nivel de rendimiento, presenta una excelente fluidez en el cambio de pestañas, no se perciben retrasos al procesar o dar a conocer la información, y el documento de exportación en PDF cuenta con total coherencia y consistencia en sus datos. 

**Firma de Liberación:** Jesús Manuel Cornejo Rangel 
