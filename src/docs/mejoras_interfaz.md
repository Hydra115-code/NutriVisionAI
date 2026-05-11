# Mejoras de Interfaz y Documentación de Componentes
Este documento detalla la estructura organizativa de la librería de componentes visuales de la aplicación, así como el registro de los cambios realizados en las vistas, estilos y flujos de interfaz de usuario.

## 1. Documentación y Organización de Componentes
La arquitectura visual y de componentes de la aplicación NutriVision AI sigue un patrón modular estricto diseñado para mantener la escalabilidad, la limpieza y la separación de responsabilidades. La librería visual se organizó de la siguiente manera:

### Sistema de Diseño Basado en Tokens (`constants/theme.ts`)
Toda la aplicación se alimenta de una única fuente de verdad para el diseño: el `ThemeContext` y `theme.ts`.
- No existen colores *hardcodeados* en los archivos de estilos. Todo se obtiene del contexto global (`colors.background`, `colors.primaryGreen`, `colors.text`, etc.).
- Permite la transición fluida e inmediata entre el **Modo Claro** y el **Modo Oscuro** (Dark Mode).

### Patrón Pantalla-Estilo Separado
Cada vista o componente complejo cuenta con su propio archivo de estilos `.styles.ts` independiente. 
- **Ejemplo:** `DashboardScreen.tsx` contiene puramente la lógica de estado y la estructura JSX, mientras que la presentación y hojas de estilo (Flexbox, dimensiones, sombras) viven en `DashboardScreen.styles.ts`.

### Librería de Componentes y Contextos
Se introdujeron componentes agnósticos y reutilizables en la carpeta `/components`:
- **Widgets Flotantes:** `AccessibilityWidget.tsx`, un componente diseñado para superponerse en toda la navegación usando z-index global a través del `_layout.tsx`.
- **Modales UI:** Elementos como `AppModal` y `AlertModal` centralizan la retroalimentación de la interfaz sin depender de alertas nativas crudas del sistema.
- **Providers:** Se hace uso extensivo del patrón *Provider* de React para envolver la app (`ThemeProvider`, `AuthProvider` y `AccessibilityProvider`), lo cual permite que toda la jerarquía acceda al estado global visual de la aplicación de forma reactiva.

---

## 2. Evidencia de Cambios en la Interfaz (Frontend)

Durante la última iteración, se realizaron las siguientes modificaciones principales a la interfaz de usuario para mejorar la retención, la experiencia del usuario (UX) y el onboarding:

### Pantalla de Bienvenida (Onboarding)
- **Vista (`screens/WelcomeScreen/WelcomeScreen.tsx`):** Se creó una nueva pantalla de aterrizaje ("Landing") altamente atractiva con un "Hero Section", la cual muestra la misión de la app ("Tu salud, bajo control visual") y cuenta con los beneficios principales estructurados en tarjetas estéticas con iconos de `@expo/vector-icons`.
- **Estilos (`screens/WelcomeScreen/WelcomeScreen.styles.ts`):** Se añadió padding robusto, se implementaron botones prominentes (`height: 56`) de alto contraste para llamadas a la acción (CTA) y una disposición en columna fluida.
- **Enrutamiento:** Se modificó el `app/index.tsx` original para que redirigiera a `/welcome` en lugar de `/login`, introduciendo efectivamente el flujo de Onboarding al usuario nuevo.

### Gadget y Panel de Accesibilidad
- **Widget Constante (`components/AccessibilityWidget.tsx`):** Creación de una pestaña lateral de color azul flotante y persistente. Utiliza `pointerEvents="box-none"` para no bloquear las pantallas subyacentes y posicionamiento absoluto pegado al borde izquierdo (`left: 0`).
- **Modal "Bottom Sheet" (`screens/AccessibilityScreen/AccessibilityScreen.tsx`):**
  - Pasó de ser una pantalla invasiva a pantalla completa a un elegante *Bottom Sheet* modal transparente de media pantalla (`transparentModal`).
  - **Gesto de Cierre:** Se integró un gestor de desplazamiento manual nativo (`PanResponder`) en conjunto con `Animated.timing`. El usuario puede arrastrar la pestaña gris hacia abajo (`dy > 100`) para cerrar el modal suavemente.
  - Se añadieron *Switches* para la personalización visual (Tamaño de fuente grande, Contraste, Animaciones reducidas y Ocultar Gadget flotante).
- **Contexto (`contexts/AccessibilityContext.tsx`):** Manejo global del estado de accesibilidad para la persistencia de las elecciones del usuario a través de recargas (mediante `AsyncStorage`).

### Dashbord - "Progreso Nutricional"
- **Vista (`screens/DashboardScreen/DashboardScreen.tsx`):** Se reemplazó el tradicional resumen en lista de barras lineales por un anillo de progreso de alto contraste.
- **Gráfico Circular SVG:** Implementación nativa con `react-native-svg`. Se generó un componente circular (con `Circle` de SVG) donde su `strokeDasharray` calcula dinámicamente qué proporción del círculo "rellenar" dependiendo de las calorías ingeridas (`(todayCals / calGoal) * 100`).
- **Layout de Macronutrientes:** Se cambió a un diseño de grid horizontal usando `flexDirection: 'row'`, agrupando visualmente Proteínas, Carbohidratos y Grasas en contenedores minimalistas con `borderWidth` y fondos que respetan el alfa/opacidad del color nativo, dando una estética prémium.

---
*Este documento atestigua los estándares de Clean Code, escalabilidad de CSS en JS y UI/UX moderna aplicados durante la fase final del desarrollo frontend.*
