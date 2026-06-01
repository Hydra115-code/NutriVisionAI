# Retrospectiva Final — NutriVision AI
**Proyecto:** NutriVision AI  
**Asignatura:** Ingeniería de Software — SCD-1011  
**Sprint:** 5 — Cierre del Producto  
**Periodo:** 18 de mayo al 4 de junio de 2026  
## Integrantes del Equipo

| Rol | Integrante | Rama |
| :--- | :--- | :--- |
| Coordinador | Francisco Javier Martínez García | `feature-coordinador` |
| Analista | Erick Martínez Rocha | `feature-analista` |
| Diseñador UX/UI | Juan Antonio Castañuela Carlos | `feature-diseno` |
| QA / Tester | Jesús Manuel Cornejo Rangel | `feature-qa` |
| Desarrollador (Dev Líder) | Mariam Getzamaret Gómez Renteria | `feature-dev` |


**Fecha de elaboración:** 30 de mayo de 2026

---

## 1. Aprendizajes del Equipo

> *¿Qué aprendió el equipo durante este sprint y a lo largo del proyecto completo?*

- Aprendimos a responder a un cambio externo de forma estructurada: recibir la retroalimentación, analizarla, reducirla a una versión viable e implementarla con evidencia.
- Comprendimos la importancia de tener variables de entorno para definir el modelo de la IA, ya que a lo largo del proyecto teniamos que ir cambiando de modelo constantemente, tambien aprendimos que es importante que el usuario no tenga un inicio tan abrupto mostrandole la pantalla de inicio.
- El flujo de ramas por rol (feature-analista, feature-dev, feature-qa, etc.) nos obligó a trabajar de forma más ordenada y a revisar el código de los demás antes de integrar.
- Aprendimos que un README claro no es opcional: es parte del producto.

---

## 2. Evolución del Proyecto desde Sprint 1

| Sprint | Enfoque | Lo que se logró |
|--------|---------|-----------------|
| Sprint 1 | Análisis del problema y requisitos | Definición del problema nutricional para personas con diabetes. Levantamiento de requisitos funcionales y no funcionales. |
| Sprint 2 | Diseño del sistema | Arquitectura de la app, diseño de pantallas, modelo de datos relacional. |
| Sprint 3 | Construcción del MVP funcional | Login, registro, escaneo de alimentos con Gemini AI, dashboard nutricional básico. |
| Sprint 4 | Calidad, refactorización y documentación | Mejora de la estructura del código, requisitos no funcionales (accesibilidad, temas), documentación técnica. |
| Sprint 5 | Mejora externa, cierre y liberación final | Implementación de la mejora derivada de retroalimentación externa, pruebas de no regresión, cierre del repositorio. |

---

## 3. Mayor Dificultad Enfrentada

> *¿Cuál fue el obstáculo técnico o de proceso más difícil del proyecto?*

**Técnico:** El obstáculo técnico más difícil del proyecto fue la inestabilidad del modelo de inteligencia artificial integrado en la aplicación. A lo largo del desarrollo, el modelo presentaba fallos intermitentes sin un patrón claro: en ocasiones simplemente no respondía o devolvía resultados inválidos, posiblemente relacionado con límites de tokens o restricciones de la API en ese momento. Esto nos obligó a evaluar y migrar entre distintas versiones del modelo en múltiples ocasiones, lo que consumió tiempo significativo de desarrollo y pruebas. La solución implicó establecer mecanismos de validación de respuesta y manejo de errores que permitieran al sistema recuperarse sin afectar la experiencia del usuario. Finalmente optamos por estabilizar la integración usando el modelo `gemini-2.5-flash` a través del endpoint `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`, que demostró ser la opción más confiable para nuestro caso de uso.

**De proceso:** Desde el Sprint 3 comenzamos a acumular retrasos en las tareas. Algunos roles no lograban completar sus responsabilidades a tiempo, lo que obligaba a otros integrantes a absorberlas sin que el rol original quedara liberado formalmente. Esto generó confusión en la distribución del trabajo y afectó el ritmo del equipo durante varios sprints. A esto se sumaron errores al subir archivos a GitHub, ya que en ocasiones los cambios se subían directamente a ramas incorrectas en lugar de hacerlo a la rama `desarrollo`, lo que complicó la integración y revisión del código.

---

## 4. Respuesta al Cambio Externo

> *¿Cómo respondió el equipo a la retroalimentación recibida del docente externo?*

**Observación recibida:**
> Se reportó que la entrada a la aplicación es abrupta tras crear el perfil. Falta un aviso de confirmación, un mensaje tipo tutorial que explique de qué trata el sistema y un perfil inicial claro. Además, se indicó que las recomendaciones tienen demasiados tecnicismos y se sugirió una opción para exportar información.

**Proceso de respuesta:**
1. El analista registró formalmente la observación y redactó la solicitud de mejora.
2. Se analizó el impacto sobre los requisitos, la interfaz y la base de datos.
3. Se definió una versión concreta y viable dentro del tiempo disponible del sprint.
4. El Dev Líder implementó el cambio en la rama `feature-dev`.
5. QA diseñó y ejecutó casos de prueba específicos para la mejora y verificó no regresión.

**Valoración del equipo:** La mejora fortaleció el sistema sin alterar su objetivo original. El proceso de gestión del cambio fue más ordenado que en sprints anteriores gracias a la documentación formal.

---

## 5. Áreas de Mejora Identificadas

> *¿Qué haría el equipo diferente si volviera a empezar?*

- **Inicialización de la BD:** Centralizar en un solo archivo la inicialización de SQLite desde el Sprint 3, evitando tener dos capas (`localDb.ts` y `database.ts`) que pueden desincronizarse.
- **Commits más frecuentes:** Algunos integrantes acumularon cambios y los subieron en un solo commit grande. Commits más pequeños y frecuentes facilitan la revisión.
- **Pruebas desde el Sprint 3:** Incorporar casos de prueba básicos desde el MVP habría reducido el tiempo de QA en los sprints finales.
- **README actualizado en cada sprint:** No dejarlo para el final. Un README desactualizado fue un riesgo real para la prueba de clonación.

---

## 6. Aportación por Rol

| Rol | Integrante | Aportación principal en Sprint 5 |
|-----|-----------|----------------------------------|
| Analista | Erick Martínez Rocha | Solicitud formal de mejora, análisis de impacto, relación con requisitos del sistema. |
| Dev Líder | Mariam Getzamaret Gómez Renteria | Implementación técnica de la mejora, ajuste visual de la pantalla afectada, corrección del error de FK en SQLite, integración a `desarrollo`, preparación del PR final. |
| QA / Tester | Jesús Manuel Cornejo Rangel | Diseño y ejecución de casos de prueba, prueba de no regresión, validación de la versión candidata a liberación. |
| Coordinador | Francisco Javier Martínez García | Coordinación de la revisión externa, gestión del Trello, bitácora del sprint, preparación de la presentación final, coordinación de la prueba de clonación. |

---

## 7. Estado Final de Liberación en Main

**Rama `main`:** [✅ Liberada / ⏳ Pendiente de dictamen / ❌ No liberada — avance en `desarrollo`]

**Criterios cumplidos para la liberación:**

| Criterio | Estado |
|---------|--------|
| Mejora externa implementada y funcional | ✅ |
| Pruebas del cambio ejecutadas y documentadas | ✅ |
| No regresión verificada | ✅ |
| Documentación técnica actualizada | ✅ |
| README con instrucciones claras | ✅ |
| Evidencia por rol en el repositorio | ✅ |
| Sistema presentado y defendido ante el grupo | ✅ |
| Clonación y ejecución por equipo externo | ⏳ Pendiente |
| Dictamen favorable recibido | ⏳ Pendiente |

---

# Reflexiones Finales del Equipo

## Erick Martinez Rocha
**Rol:** Analista

Lo que más me llevo de este semestre como Analista en NutriVision AI es haber comprendido que mi rol es el escudo y la brújula del equipo. Al principio pensaba que analizar era solo hacer listas de requisitos, pero en el salto del Sprint 2 al cierre del proyecto, me di cuenta de que se trata de aterrizar ideas para que no terminemos programando a ciegas.

El mayor reto y aprendizaje fue gestionar el cambio real: cuando nos observaron que la entrada a la app era muy abrupta y la IA usaba puros tecnicismos, aprendí a no entrar en pánico ni prometer que reescribiríamos todo el sistema. En lugar de eso, logré analizar el impacto técnico, acotar el problema y definir una mejora viable y concreta (el flujo de Onboarding y la simplificación de los prompts).

Entendí que un buen análisis, saber decir "esto no alcanza para este sprint", y llevar una documentación sólida, es lo que realmente salva al equipo de trabajar de más y garantiza que entreguemos un producto profesional.

---

## Mariam Getzamaret Gomez Renteria
**Rol:** Dev Líder

Durante el desarrollo de NutriVision AI a lo largo del semestre, adquirimos conocimientos tanto técnicos como de trabajo en equipo.

Aprendimos a utilizar tecnologías como React Native, Expo e Inteligencia Artificial para crear una aplicación funcional enfocada en el análisis nutricional. Además, comprendimos la importancia de escuchar la retroalimentación de los usuarios, ya que nos permitió identificar áreas de mejora y hacer que la aplicación fuera más intuitiva y fácil de usar.

Esta experiencia nos ayudó a fortalecer habilidades de análisis, diseño, programación, pruebas y resolución de problemas, así como a valorar la comunicación y colaboración entre los integrantes del equipo para alcanzar los objetivos del proyecto.

---

## Jesus Manuel Cornejo Rangel
**Rol:** QA / Tester

El aprendizaje que tuve en el transcurso del proyecto fue al trabajar con GitHub. Es algo confuso por sus comandos, pero mientras se usan se pueden llegar a entender o incluso recordarlos.

Al trabajar con Visual Studio Code junto con Git se puede dar un gran cambio, ya que antes no había trabajado de esta forma. ¿Fue confusa? Sí lo fue, ya que realizar cambios o guardado mediante commits y pull requests era algo que nunca había implementado antes.

El equipo fue unido y trabajó junto para realizar el proyecto hasta lograr un resultado satisfactorio, con algunos retrasos, pero cumpliendo los objetivos establecidos.

---

## Francisco Javier Martínez García
**Rol:** Coordinador

Esta metodología nos permitió trabajar de forma ágil pero a la vez estructurada, con entregas incrementales que nos daban visibilidad constante del avance. Sin embargo, también nos expuso a nuestras propias fallas como equipo: la falta de comunicación y no revisar con atención el material proporcionado por la maestra nos generó retrasos importantes que impidieron que pudiéramos ser evaluados en los Sprints 3 y 4.

Fueron errores que costaron tiempo y esfuerzo, pero que también dejaron una lección clara: en un equipo de desarrollo, la comunicación y la responsabilidad individual son tan importantes como el código mismo.

Lo valioso es que en el Sprint 5 esos errores ya no se repitieron. Llegamos más organizados, con los roles más definidos y con una mejor disposición para colaborar. Eso se reflejó en el resultado final.

Al cerrar este proyecto, siento que logramos construir algo de lo que podemos estar orgullosos: NutriVision AI es un producto escalable, funcional y con un propósito real, pensado para ayudar a personas con condiciones como diabetes o para cualquiera que quiera mejorar sus hábitos alimenticios con el apoyo de inteligencia artificial.

Me llevo el aprendizaje de que un buen producto no solo se construye con buenas ideas o buen código, sino con comunicación, compromiso y la capacidad de aprender de los errores en cada iteración.
