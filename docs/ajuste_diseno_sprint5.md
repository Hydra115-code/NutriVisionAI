# Ajuste de Diseño – Sprint 5

## Proyecto
**NutriVision AI**

## Equipo
**Phoenix**

## Sprint
**Sprint 5**

---

# 1. Pantallas Afectadas

Las mejoras implementadas impactaron las siguientes áreas del sistema:

- Pantalla de Registro.
- Nueva pantalla de Onboarding (Bienvenida/Tutorial).
- Dashboard o pantalla principal.
- Pantallas donde se muestran recomendaciones generadas por IA.

---

# 2. Problema Detectado

Durante la revisión externa se identificó que la experiencia inicial del usuario presentaba problemas de usabilidad.

### Observaciones recibidas

- La aplicación ingresaba directamente al sistema después del registro.
- No existía una confirmación de registro exitoso.
- El usuario no recibía una explicación inicial sobre el funcionamiento de la aplicación.
- Las recomendaciones generadas por IA utilizaban lenguaje demasiado técnico.
- Existía confusión sobre el propósito y uso de la plataforma durante el primer acceso.

### Impacto en el usuario

La ausencia de una guía inicial generaba una experiencia abrupta y poco intuitiva, afectando la comprensión del sistema y la experiencia de uso.

---

# 3. Ajuste Propuesto

Con base en la retroalimentación recibida se propusieron las siguientes mejoras:

### Flujo de Onboarding

Implementar una pantalla de bienvenida que aparezca después del registro para:

- Confirmar el registro exitoso.
- Explicar las principales funciones de la aplicación.
- Guiar al usuario durante su primer acceso.
- Mejorar la experiencia de incorporación al sistema.

### Simplificación del lenguaje de IA

Modificar el servicio de recomendaciones para:

- Utilizar lenguaje cotidiano.
- Evitar términos técnicos o científicos.
- Facilitar la comprensión de la información nutricional.

---

# 4. Ajuste Implementado

## 4.1 Pantalla de Onboarding

Se desarrolló una nueva pantalla de bienvenida compuesta por cuatro pasos informativos.

Características implementadas:

- Saludo personalizado al usuario.
- Explicación breve del funcionamiento de NutriVision AI.
- Advertencia sobre el uso responsable de la información generada por IA.
- Navegación mediante indicadores visuales.
- Botón para omitir el tutorial.
- Visualización únicamente durante el primer acceso.

Para controlar este comportamiento se reutilizó la lógica existente basada en AsyncStorage.

---

## 4.2 Recomendaciones en lenguaje sencillo

Se modificó el prompt utilizado por Google Gemini para que las respuestas:

- Sean más fáciles de entender.
- Utilicen nombres comunes de alimentos.
- Eviten tecnicismos nutricionales innecesarios.
- Mantengan la estructura JSON requerida por la aplicación.

---

# 5. Evidencia Visual

## Evidencia 1 – Flujo anterior

Antes de la mejora:

- El usuario finalizaba el registro.
- Era redirigido directamente al Dashboard.
- No existía explicación ni guía inicial.

**Insertar captura del flujo anterior.**

---

## Evidencia 2 – Nuevo flujo de onboarding

Después de la mejora:

- Confirmación de registro.
- Pantalla de bienvenida.
- Tutorial de introducción.
- Acceso al Dashboard.

**Insertar captura de la pantalla de onboarding.**

---

## Evidencia 3 – Recomendaciones simplificadas

Comparación entre:

- Recomendaciones con lenguaje técnico.
- Recomendaciones con lenguaje cotidiano.

**Insertar captura de resultados nutricionales antes y después.**

---

# 6. Relación con la Mejora Externa

Las mejoras implementadas responden directamente a la observación realizada durante la revisión externa.

### Observación recibida

> La entrada al sistema es abrupta, falta una explicación inicial del funcionamiento de la aplicación y las recomendaciones contienen demasiados tecnicismos.

### Solución aplicada

- Se implementó un flujo de onboarding para guiar al usuario durante su primer acceso.
- Se agregó una explicación visual del funcionamiento de la aplicación.
- Se simplificó el lenguaje utilizado por la inteligencia artificial.

### Resultado esperado

- Mejor comprensión del sistema.
- Menor confusión durante el primer uso.
- Experiencia de usuario más amigable.
- Mayor claridad en las recomendaciones nutricionales.

---

# 7. Conclusión

El ajuste de diseño realizado durante el Sprint 5 permitió mejorar significativamente la experiencia de incorporación de nuevos usuarios y la comprensión de la información presentada por el sistema.

Las mejoras implementadas atienden directamente la retroalimentación externa recibida y fortalecen la usabilidad general de NutriVision AI sin requerir modificaciones estructurales en la base de datos o en la arquitectura principal del sistema.