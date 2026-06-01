# Análisis de Impacto de la Mejora - Sprint 5

Este documento evalúa las consecuencias técnicas de implementar el Flujo de Onboarding y la simplificación de recomendaciones en NutriVision AI.

**1. ¿Qué parte del sistema se modificará?**
El flujo de redirección posterior al registro, la pantalla principal (Home/Dashboard) y el servicio que conecta con la API de IA.

**2. ¿Qué requisito se fortalece o ajusta?**
Se fortalece significativamente la Usabilidad (RNF) y la legibilidad de la información devuelta por el sistema.

**3. ¿Qué pantalla se verá afectada?**
Se creará una nueva vista de `Onboarding/Tutorial` y se ajustará la vista del `Perfil Inicial`.

**4. ¿Qué lógica o proceso se ajustará?**
El enrutador principal (Navigation). Se debe implementar una **variable global** o estado persistente (ej. AsyncStorage/Context) que detecte si el usuario es nuevo para mostrarle el onboarding; de lo contrario, pasará directo al Dashboard. También se modificará el prompt interno de la IA.

**5. ¿La base de datos requiere cambio?**
No se requieren migraciones pesadas. Solo se necesita asegurar que el esquema actual guarde correctamente los datos del "perfil inicial".

**6. ¿Se necesita agregar, modificar o consultar información?**
No, se utilizará la información que el usuario ya provee en el registro.

**7. ¿Qué riesgo técnico existe?**
Que la variable global no persista correctamente al cerrar la app y el tutorial aparezca cada vez que el usuario inicie sesión, generando frustración.

**8. ¿Qué pruebas deberá realizar QA?**
* **Prueba de Mejora:** Crear un usuario nuevo y verificar que aparezca la confirmación, el tutorial y las recomendaciones en lenguaje sencillo.
* **Prueba de No Regresión:** Iniciar sesión con un usuario viejo y confirmar que NO aparezca el tutorial (validación de la variable global).

**9. ¿Qué puede romperse si el cambio se implementa mal?**
El usuario podría quedarse bloqueado en una pantalla de confirmación sin poder acceder a las funciones principales de la aplicación.

**10. ¿Cómo se comprobará que la mejora sí quedó implementada?**
Mediante una demostración en vivo (Test de Cierre Técnico) donde un usuario desde cero logre llegar al Dashboard pasando por la pantalla explicativa, recibiendo una recomendación entendible.