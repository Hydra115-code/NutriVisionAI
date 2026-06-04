## Estructura del Proyecto
---
### NutriVisionAI

```
NutriVisionAI/
├── .vscode/
│   └── settings.json     # Configuración compartida del editor
├── src/
│   ├── api/              # Llamadas y configuración de APIs externas
│   ├── app/              # Rutas (Expo Router)
│   ├── assets/           # Imágenes, fuentes y recursos estáticos
│   ├── components/       # Componentes reutilizables (modales, sheets, etc.)
│   ├── constants/        # Configuración y tema visual
│   ├── context/          # Contexto global principal
│   ├── contexts/         # Contextos globales (Auth, Theme)
│   ├── database/         # Configuración y acceso a SQLite local
│   ├── docs/             # Entregables y documentación del proyecto
│   ├── hooks/            # Hooks personalizados
│   ├── screens/          # Componentes de pantalla por módulo
│   ├── services/         # Lógica de negocio (geminiService, etc.)
│   ├── types/            # Definiciones de tipos TypeScript
│   └── utils/            # Funciones utilitarias y helpers
├── .gitignore
├── app.json              # Configuración de la app Expo
├── eslint.config.js      # Reglas de linting
├── expo-env.d.ts         # Tipos de entorno Expo
├── package-lock.json     # Versiones exactas de dependencias
├── package.json          # Dependencias y scripts del proyecto
├── README.md             # Documentación principal
└── tsconfig.json         # Configuración de TypeScript
```
