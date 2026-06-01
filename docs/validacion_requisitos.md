# Validación de requisitos del sistema

## Proyecto
NutriVisionAI

## Rama de trabajo
feature-analista

---

# 1. Validación de Requisitos Funcionales

| RF | Cumple | Observaciones |
|---|---|---|
| RF-01: Registro y autenticación de usuarios | Sí | El sistema permite el registro de usuarios y valida contraseña y correo electrónico. |
| RF-02: Ingreso manual de datos corporales | Sí | El sistema permite el ingreso manual de altura y peso. |
| RF-03: Escaneo corporal con estimación referencial | Parcialmente | El sistema realiza un escaneo corporal mediante IA, pero no muestra un mensaje indicando que los datos son referenciales y no exactos. |
| RF-04: Identificación de alimentos mediante imágenes | Sí | El sistema escanea alimentos y genera un desglose nutricional. |
| RF-05: Visualización de valores nutricionales estimados | Parcialmente | El sistema muestra información nutricional, pero no indica que los valores son aproximados. |
| RF-06: Registro diario de consumo | No | El sistema no permite consultar el historial de alimentos consumidos. |
| RF-07: Generación de recomendaciones personalizadas | No | El sistema solo muestra consejos generales al escanear alimentos. |
| RF-08: Informes visuales de progreso | Sí | El sistema muestra gráficas de calorías, macronutrientes y actividad semanal. |
| RF-09: Exportación de información en PDF y CSV | No | El sistema no permite exportar información en PDF o CSV. |
| RF-10: Corrección manual de alimentos detectados | No | El sistema no permite editar la información nutricional después del escaneo. |
| RF-11: Validación de riesgos alimenticios | Parcialmente | El sistema muestra alertas por exceso de azúcar, pero no detecta otros riesgos nutricionales. |

---

# 2. Validación de Requisitos No Funcionales

| RNF | Cumple | Observaciones |
|---|---|---|
| RNF-01: Seguridad | Sí | Contraseñas cifradas con bcrypt y credenciales protegidas mediante archivo `.env`. |
| RNF-02: Rendimiento | Sí | El procesamiento responde entre 4 y 6 segundos bajo conexión WiFi estable. |
| RNF-03: Precisión en reconocimiento de alimentos | Parcialmente | El sistema alcanza aproximadamente un 85% de precisión con buena iluminación. Puede bajar con platillos mezclados o fotos oscuras. |
| RNF-04: Precisión en escaneo corporal | Sí | El margen aproximado es de ±10%, dentro del rango aceptable. |
| RNF-05: Disponibilidad y escalabilidad | Sí | El sistema soporta múltiples usuarios y puede migrarse a la nube sin cambios importantes. |
| RNF-06: Accesibilidad y usabilidad | Sí | Cuenta con modo oscuro, alto contraste y opciones de accesibilidad visual. |
| RNF-07: Escalabilidad técnica y económica | Sí | El análisis con IA se ejecuta únicamente bajo demanda para optimizar recursos. |

---

# 3. Auditoría de Validaciones de Usuario

## Funcionalidades incompletas o fuera del alcance pactado

| Requisito | Problema Detectado | Acción Requerida |
|---|---|---|
| RF-03 | No se indica que el escaneo corporal es referencial. | Agregar mensaje aclaratorio visible para el usuario. |
| RF-05 | Los valores nutricionales no indican ser aproximados. | Mostrar aviso indicando que los datos son estimaciones. |
| RF-06 | No existe historial consultable de alimentos consumidos. | Implementar historial diario de consumo. |
| RF-07 | No existen recomendaciones personalizadas reales. | Generar recomendaciones basadas en datos y hábitos del usuario. |
| RF-09 | No existe exportación de datos. | Implementar exportación PDF y CSV. |
| RF-10 | No se permite corregir alimentos detectados. | Permitir edición manual posterior al escaneo. |
| RF-11 | Solo se detecta exceso de azúcar. | Agregar validaciones para calorías y otros riesgos nutricionales. |
| RNF-03 | La precisión depende demasiado de la iluminación. | Agregar recomendaciones visuales para tomar fotografías adecuadas. |

---

# 4. Control de Alcance

## Funcionalidades pendientes respecto al alcance definido

| Área | Estado Actual | Pendiente |
|---|---|---|
| Escaneo corporal | Funcional | Agregar aclaración de resultados referenciales |
| Información nutricional | Funcional | Mostrar advertencia de valores aproximados |
| Historial de consumo | Incompleto | Crear consulta de historial diario |
| Recomendaciones personalizadas | Incompleto | Implementar recomendaciones basadas en perfil |
| Exportación de datos | No implementado | Generar archivos PDF y CSV |
| Corrección manual de alimentos | No implementado | Habilitar edición de resultados detectados en los alimentos |
| Riesgos alimenticios | Parcial | Detectar más tipos de riesgo nutricional |

---

# 5. Mapeo de Requisitos — Implementados vs Pendientes

| Requisito | Implementado | Pendiente |
|---|---|---|
| RF-01 | Registro y autenticación completos | — |
| RF-02 | Ingreso manual de altura y peso | — |
| RF-03 | Escaneo corporal con IA | Mensaje de datos referenciales |
| RF-04 | Identificación de alimentos | — |
| RF-05 | Visualización nutricional | Indicar que los datos son aproximados |
| RF-06 | Registro de consumo básico | Historial consultable |
| RF-07 | Consejos generales | Recomendaciones personalizadas |
| RF-08 | Informes visuales y gráficas | — |
| RF-09 | — | Exportación PDF y CSV |
| RF-10 | — | Corrección manual de alimentos |
| RF-11 | Alerta por azúcar | Más alertas nutricionales |
| RNF-01 | Seguridad con bcrypt | — |
| RNF-02 | Rendimiento aceptable | — |
| RNF-03 | Precisión aproximada del 85% | Mejoras de captura |
| RNF-04 | Escaneo corporal dentro del margen esperado | — |
| RNF-05 | Escalable y multiusuario | — |
| RNF-06 | Accesibilidad y modo oscuro | — |
| RNF-07 | Optimización de uso de IA | — |

---

# Conclusión

El sistema NutriVisionAI cumple parcialmente con el alcance pactado.  
La mayoría de los requisitos funcionales principales se encuentran implementados; sin embargo, aún existen funcionalidades pendientes relacionadas con exportación de datos, historial nutricional, recomendaciones personalizadas y edición manual de resultados detectados por IA.

En requisitos no funcionales, el sistema presenta un desempeño adecuado en seguridad, accesibilidad y escalabilidad, aunque todavía pueden realizarse mejoras en precisión y validación informativa para el usuario.
