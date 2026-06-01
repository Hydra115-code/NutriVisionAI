# Nota Técnica de Implementación — Sprint 5

**Proyecto:** NutriVision AI  
**Equipo:** Phoenix  
**Rol:** Dev Líder  
**Integrante:** Mariam Getzamaret Gomez Renteria  
**Rama:** `feature-dev`  
**Fecha:** 31 de mayo de 2026  

---

## 1. Mejora Implementada

Con base en la solicitud formal de mejora del Sprint 5, se implementaron dos cambios concretos derivados de la retroalimentación externa:

### 1.1 Flujo de Onboarding (Pantalla de Bienvenida)
Se creó una pantalla de tutorial que aparece **únicamente la primera vez** que un usuario nuevo completa su registro. La pantalla guía al usuario en 4 pasos explicando el funcionamiento de la app en lenguaje sencillo, con un saludo personalizado usando su nombre.

### 1.2 Simplificación del Lenguaje en Recomendaciones de IA
Se ajustó el prompt enviado a la API de Google Gemini para que los nombres de alimentos detectados se expresen en lenguaje cotidiano (ej. "arroz blanco", "pechuga de pollo a la plancha") evitando tecnicismos o nombres científicos.

---

## 2. Archivos Modificados

| Archivo | Tipo de cambio | Descripción |
|---|---|---|
| `src/app/onboarding.tsx` | **Nuevo** | Pantalla de tutorial de 4 pasos con navegación por indicadores |
| `src/app/_layout.tsx` | **Modificado** | Registro de la ruta `/onboarding` en el Stack de navegación |
| `src/screens/RegisterScreen/RegisterScreen.tsx` | **Modificado** | Redirección post-registro hacia `/onboarding` en lugar de `/(tabs)` |
| `src/api/geminiClient.ts` | **Modificado** | Prompt ajustado para lenguaje cotidiano |
| `README.md` | **Modificado** | Actualización del estado del sprint |

---

## 3. Decisiones Técnicas

### Control de primera vez con AsyncStorage
El `AuthContext` ya contaba con `isFirstLaunch` y `markOnboardingDone()` implementados mediante `AsyncStorage`. Se aprovechó esta infraestructura existente sin necesidad de modificar la base de datos ni agregar nuevas tablas.

- Al completar el onboarding, se llama `markOnboardingDone()` que persiste la bandera `@nutrivision_first_launch = 'done'`.
- En inicios de sesión posteriores, el usuario va directo a `/(tabs)` sin ver el tutorial.
- La pantalla tiene opción de "Saltar" para usuarios que no quieran ver el tutorial completo.

### Ajuste del prompt de IA
El cambio fue mínimo y no invasivo: se agregaron dos instrucciones al prompt existente de `analyzeImageDirectly` en `geminiClient.ts`:
- Usar nombres en lenguaje cotidiano
- Evitar tecnicismos o nombres científicos

Esto no afecta la estructura del JSON devuelto ni ningún otro componente que consuma el resultado.

---

## 4. Impacto Técnico

- **Navegación:** Se agregó una ruta nueva (`/onboarding`) al Stack. No afecta rutas existentes.
- **Flujo de registro:** Modificado. Después de crear la cuenta, el usuario es redirigido a `/onboarding` en lugar de ir directo a `/(tabs)`. Al terminar el tutorial llega a `/(tabs)` normalmente.
- **Flujo de login:** No se ve afectado. Usuarios con sesión existente van directo a `/(tabs)`.
- **Base de datos:** Sin cambios. No se requirieron migraciones.
- **API de Gemini:** El ajuste del prompt es retrocompatible. La estructura del JSON de respuesta no cambia.
- **AuthContext:** Se reutilizó lógica ya existente (`isFirstLaunch`, `markOnboardingDone`). No se modificó el contexto.

---

## 5. Riesgos Identificados y Mitigación

| Riesgo | Mitigación aplicada |
|---|---|
| El tutorial aparece en cada inicio de sesión | Se usa `AsyncStorage` para persistir la bandera entre sesiones. Probado con usuario nuevo y usuario existente. |
| El usuario queda bloqueado en el onboarding | Se agregó botón "Saltar" en todos los pasos excepto el último, y el botón final redirige siempre a `/(tabs)`. |
| El prompt de IA rompe el formato JSON | Solo se agregaron instrucciones de estilo al texto del prompt. La estructura del JSON solicitado no cambió. |

---

## 6. Preparación para Clonación Externa

Para que el proyecto funcione correctamente al clonarse:

1. Crear el archivo `.env` en la raíz del proyecto
2. Agregar la variable:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=tu_api_key_aqui
   ```
3. Obtener la API Key en [Google AI Studio](https://aistudio.google.com/app/apikey)
4. Ejecutar `npm install` y luego `npx expo start --clear`

El `README.md` ya refleja estas instrucciones actualizadas.

---

## 7. Preparación para Liberación Final

El sistema está en condiciones de liberarse a `main` una vez que se cumplan los siguientes criterios:

- La mejora de onboarding está implementada y funcional en la rama `feature-dev`
- El ajuste del prompt de IA está integrado y no rompe el flujo de escaneo
- QA ejecuta y documenta las pruebas del cambio y de no regresión
- Todos los PRs de roles están integrados en `desarrollo`
- El sistema pasa la prueba de clonación y ejecución por equipo externo
- Se recibe dictamen favorable del evaluador

---

## 8. Observaciones de Integración

- Los cambios de esta rama (`feature-dev`) deben integrarse a `desarrollo` mediante Pull Request.
- El Dev Líder debe revisar y aprobar los PRs de las demás ramas antes de integrar a `desarrollo`.
- La liberación a `main` solo procede si el sistema pasa la prueba de clonación externa y recibe dictamen favorable.
