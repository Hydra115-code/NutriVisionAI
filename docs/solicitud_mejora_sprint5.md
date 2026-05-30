# Solicitud Formal de Mejora - Sprint 5

## 01. Identificación del Proyecto
* **Proyecto:** NutriVision AI
* **Equipo:** Phoenix
* **Docente Externo:** Ruth Aivi Chavez Rodriguez
* **Fecha de Revisión:** 27 de mayo de 2026

## 02. Observación y Problema Detectado
* **Observación Externa recibida:** 
  Se reportó que la entrada a la aplicación es abrupta tras crear el perfil. Falta un aviso de confirmación, un mensaje tipo tutorial que explique de qué trata el sistema y un perfil inicial claro. Además, se indicó que las recomendaciones tienen demasiados tecnicismos y se sugirió una opción para exportar información.
* **Problema Detectado:** 
  El usuario experimenta alta fricción y confusión al ingresar por primera vez. La ausencia de retroalimentación inmediata (onboarding) y el uso de lenguaje excesivamente técnico disminuyen la usabilidad y la retención inicial del sistema.

## 03. Definición de la Mejora
* **Mejora Solicitada Originalmente:** Implementar tutorial, confirmación de registro, perfil inicial, simplificación de lenguaje en recomendaciones y exportación de datos.
* **Versión que se implementará (Ajuste Viable):** 
  Se implementará un **Flujo de Onboarding (Pantalla de Bienvenida)**. Al terminar el registro, el usuario verá una confirmación de éxito y una vista rápida tipo "tutorial" explicando el uso de la app. 
  Para las recomendaciones, se ajustará el prompt del servicio de IA para generar respuestas en lenguaje coloquial y sin tecnicismos. 
  *(Nota técnica: El control de este onboarding se manejará mediante una variable global para asegurar que solo aparezca en el primer inicio de sesión. La "exportación de información" se registrará en el backlog para no comprometer el tiempo del sprint).*

## 04. Clasificación
* **Tipo de Mejora:** Usabilidad (UX) / Funcional / Visual.

## 05. Requisito Afectado y Prioridad
* **Requisito Afectado:** RNF-Usabilidad (Claridad del sistema) y RF-Generación de Recomendaciones.
* **Prioridad:** **Alta**. Impacta directamente en la primera impresión y el uso correcto del sistema por parte del usuario final.

## 06. Justificación y Evidencia
* **Justificación:** Resolver la fricción inicial es crítico para que el usuario entienda el valor de NutriVision AI. Crear un flujo de bienvenida y simplificar los textos es altamente viable en el tiempo del Sprint 5 y responde directamente a la queja principal de la "entrada abrupta" sin requerir reestructurar toda la base de datos.
* **Evidencia:** Tareas documentadas en el tablero de Trello asignadas a Diseño (interfaz de onboarding) y Desarrollo (implementación de variable global y ajuste de prompt de IA).