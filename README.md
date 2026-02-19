# NutriVision AI 

## Descripción
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

## Tecnologías Tentativas (Stack Técnico)
* **Frontend:** React Native (Expo) + NativeWind.
* **Backend:** Node.js (Express) para gestión de alertas y usuarios.
* **Base de Datos:** MySQL (Relacional) para integridad de expedientes.
* **IA:** Google Gemini 1.5 Flash (Multimodal) para reconocimiento de imágenes.

## Equipo (Roles Sprint 1)
* Coordinador: [Mariam Getzamaret Gomez Renteria]
* **Analista:** [Juan Antonio Castañuela Carlos]
* **Diseñador UX/UI:** [Jesus Manuel Cornejo Rangel]
* **QA / Tester:** [Francisco Javier Martinez Garcia]
* **Desarrollador:** [Erick Martinez Rocha]
# Estado del Proyecto
sprint 1- Analisis
