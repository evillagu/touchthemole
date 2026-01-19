# Estructura del Proyecto - Touch the Mole

Diagrama completo de la estructura de carpetas y archivos del proyecto con descripción breve de cada elemento.

---

## 📁 Estructura Completa del Proyecto

```
touch-the-mole/
│
├── .github/                                    # Configuración de GitHub
│   └── workflows/
│       └── deploy-gh-pages.yml                 # Workflow de GitHub Actions para despliegue automático a GitHub Pages
│
├── dist/                                       # Directorio de salida del build (generado automáticamente)
│   └── touch-the-mole/
│       └── browser/                            # Archivos compilados listos para producción
│
├── documentation/                              # Documentación del proyecto
│   ├── config/                                 # Documentación de configuración
│   │   ├── architecture project.md             # Arquitectura hexagonal del proyecto
│   │   ├── config-PWA.md                      # Configuración de Progressive Web App
│   │   ├── creacion.md                        # Documentación de la fase inicial de creación
│   │   ├── github-pages.md                    # Configuración y workflow de GitHub Pages
│   │   └── reglas-es6.md                      # Reglas ES6 y configuración de ESLint
│   │
│   ├── specifications classes methods/         # Documentación técnica de clases y métodos
│   │   ├── i18n.md                            # Documentación de internacionalización
│   │   ├── most relevant methods and classes.md # Métodos y clases más relevantes
│   │   └── use cases.md                       # Especificaciones de casos de uso
│   │
│   └── UX/                                     # Documentación de experiencia de usuario
│       └── experence user - ux.md              # Flujo de navegación y UX del juego
│
├── node_modules/                               # Dependencias de npm (generado automáticamente)
│
├── out-tsc/                                    # Archivos temporales de TypeScript (generado automáticamente)
│   └── spec/
│       └── tsconfig.spec.tsbuildinfo          # Cache de compilación de tests
│
├── public/                                     # Assets estáticos copiados al build
│   ├── 404.html                                # Página 404 para GitHub Pages (redirige a index.html)
│   ├── favicon.ico                             # Icono de la aplicación
│   ├── icons/
│   │   └── topo.svg                            # Icono del topo usado en el juego
│   ├── logo-topo.svg                           # Logo principal de la aplicación
│   ├── logo-topo1.svg                          # Logo alternativo
│   └── manifest.webmanifest                    # Web App Manifest para PWA
│
├── src/                                        # Código fuente de la aplicación
│   ├── app/                                    # Aplicación Angular (arquitectura hexagonal)
│   │   ├── application/                       # Capa de casos de uso (lógica de negocio)
│   │   │   └── use-cases/
│   │   │       ├── apply-hit.use-case.ts      # Caso de uso: aplicar golpe al topo
│   │   │       ├── apply-hit.use-case.spec.ts # Tests del caso de uso apply-hit
│   │   │       ├── change-difficulty.use-case.ts # Caso de uso: cambiar dificultad
│   │   │       ├── change-difficulty.use-case.spec.ts # Tests del caso de uso change-difficulty
│   │   │       ├── difficulty.use-case.ts    # Caso de uso: gestión de dificultades y GAME_CONFIG
│   │   │       ├── difficulty.use-case.spec.ts # Tests del caso de uso difficulty
│   │   │       ├── start-game.use-case.ts     # Caso de uso: iniciar nueva partida (soporta modo por tiempo)
│   │   │       ├── start-game.use-case.spec.ts # Tests del caso de uso start-game
│   │   │       ├── tick-timer.use-case.ts      # Caso de uso: decrementar tiempo restante
│   │   │       └── end-game-by-time.use-case.ts # Caso de uso: finalizar juego por tiempo
│   │   │       ├── start-game.use-case.ts     # Caso de uso: iniciar nueva partida
│   │   │       └── start-game.use-case.spec.ts # Tests del caso de uso start-game
│   │   │
│   │   ├── core/                              # Capa de dominio (modelos y contratos)
│   │   │   ├── domain/                        # Modelos de dominio puros (interfaces)
│   │   │   │   ├── difficulty.model.ts       # Interfaz Difficulty (configuración de dificultad)
│   │   │   │   ├── game-state.model.ts       # Interfaz GameState (estado del juego con soporte de tiempo)
│   │   │   │   └── user.model.ts             # Interfaz User (modelo de usuario)
│   │   │   │
│   │   │   └── ports/                         # Contratos y tokens de inyección
│   │   │       ├── game-state-repository.port.ts # Interfaz GameStateRepository (contrato)
│   │   │       └── game-state-repository.token.ts # Token de inyección GAME_STATE_REPOSITORY
│   │   │
│   │   ├── infrastructure/                    # Capa de infraestructura (implementaciones)
│   │   │   └── adapters/
│   │   │       ├── local-storage-game-state.adapter.ts # Implementación de GameStateRepository con localStorage
│   │   │       └── local-storage-game-state.adapter.spec.ts # Tests del adaptador localStorage
│   │   │
│   │   ├── presentation/                      # Capa de presentación (UI)
│   │   │   ├── components/                    # Componentes presentacionales reutilizables
│   │   │   │   ├── game-board/                # Componente del tablero de juego
│   │   │   │   │   ├── game-board.ts          # Lógica del tablero (renderiza agujeros)
│   │   │   │   │   ├── game-board.html        # Template del tablero
│   │   │   │   │   ├── game-board.scss        # Estilos del tablero (BEM)
│   │   │   │   │   └── game-board.spec.ts     # Tests del componente game-board
│   │   │   │   │
│   │   │   │   ├── mole-button/               # Componente de botón/agujero individual
│   │   │   │   │   ├── mole-button.ts         # Lógica del botón (estado activo/golpeado)
│   │   │   │   │   ├── mole-button.html       # Template del botón con imagen del topo
│   │   │   │   │   ├── mole-button.scss       # Estilos del botón (animaciones, efectos)
│   │   │   │   │   └── mole-button.spec.ts    # Tests del componente mole-button
│   │   │   │   │
│   │   │   │   └── score-board/               # Componente del marcador
│   │   │   │       ├── score-board.ts         # Lógica del marcador (muestra nombre y puntos)
│   │   │   │       ├── score-board.html       # Template del marcador
│   │   │   │       ├── score-board.scss       # Estilos del marcador (BEM)
│   │   │   │       └── score-board.spec.ts    # Tests del componente score-board
│   │   │   │
│   │   │   └── pages/                         # Componentes de página (orquestación)
│   │   │       ├── game/                      # Página principal del juego
│   │   │       │   ├── game.ts                # Lógica del juego (estado, movimiento de topos, golpes)
│   │   │       │   ├── game.html              # Template de la página de juego
│   │   │       │   ├── game.scss              # Estilos de la página de juego (BEM)
│   │   │       │   └── game.spec.ts           # Tests del componente game
│   │   │       │
│   │   │       └── home/                      # Página inicial
│   │   │           ├── home.ts                # Lógica de la página inicial (formulario, validación)
│   │   │           ├── home.html              # Template de la página inicial
│   │   │           ├── home.scss              # Estilos de la página inicial (BEM)
│   │   │           └── home.spec.ts           # Tests del componente home
│   │   │
│   │   ├── app.config.ts                      # Configuración global de la app (providers, router, service worker)
│   │   ├── app.html                           # Template raíz de la app (contiene router-outlet)
│   │   ├── app.routes.ts                      # Definición de rutas de la aplicación
│   │   ├── app.scss                           # Estilos globales del componente raíz
│   │   ├── app.spec.ts                        # Tests del componente raíz AppComponent
│   │   └── app.ts                             # Componente raíz de la aplicación Angular
│   │
│   ├── locale/                                 # Archivos de traducción (i18n)
│   │   ├── messages.es.xlf                    # Traducciones en español (formato XLIFF)
│   │   └── messages.en.xlf                    # Traducciones en inglés (formato XLIFF)
│   │
│   ├── index.html                              # HTML principal de la aplicación (meta tags PWA, base href)
│   ├── main.ts                                 # Punto de entrada de la aplicación (bootstrap)
│   └── styles.scss                             # Estilos globales (variables CSS, estilos base)
│
├── .editorconfig                               # Configuración de EditorConfig (consistencia entre editores)
├── .gitignore                                  # Archivos y carpetas ignorados por Git
├── .prettierignore                             # Archivos excluidos del formateo de Prettier
├── angular.json                                # Configuración principal de Angular CLI (build, serve, test)
├── eslint.config.js                            # Configuración de ESLint (análisis estático de código)
├── global.d.ts                                 # Declaraciones de tipos globales ($localize para i18n)
├── ngsw-config.json                            # Configuración del Service Worker (estrategias de cache PWA)
├── package.json                                # Dependencias y scripts del proyecto npm
├── package-lock.json                           # Versiones exactas de dependencias (lock file)
├── README.md                                   # Documentación principal del proyecto
├── tsconfig.json                               # Configuración base de TypeScript (modo estricto, target ES2022)
├── tsconfig.app.json                           # Configuración de TypeScript para la aplicación
└── tsconfig.spec.json                          # Configuración de TypeScript para tests
```

---

## 📊 Resumen por Capas (Arquitectura Hexagonal)

### 🎯 Core (Dominio)
```
core/
├── domain/          # Modelos puros (interfaces sin lógica)
└── ports/            # Contratos (interfaces) y tokens de inyección
```

### 💼 Application (Casos de Uso)
```
application/
└── use-cases/        # Lógica de negocio pura (funciones puras, inmutables)
```

### 🔌 Infrastructure (Implementaciones)
```
infrastructure/
└── adapters/         # Implementaciones concretas de los puertos
```

### 🎨 Presentation (UI)
```
presentation/
├── components/       # Componentes presentacionales reutilizables
└── pages/            # Componentes de página (orquestación)
```

---

## 🔄 Flujo de Dependencias

```
presentation (UI)
    ↓ depende de
application (Casos de Uso)
    ↓ depende de
core (Dominio y Puertos)
    ↑ implementado por
infrastructure (Adaptadores)
```

**Regla**: Las dependencias siempre apuntan hacia el centro (core). La infraestructura implementa los puertos pero no depende de presentation.

---

## 📝 Convenciones de Nomenclatura

- **Componentes**: PascalCase (ej: `HomePageComponent`)
- **Archivos**: kebab-case (ej: `home-page.component.ts`)
- **Casos de uso**: kebab-case con sufijo `.use-case.ts`
- **Modelos**: kebab-case con sufijo `.model.ts`
- **Puertos**: kebab-case con sufijo `.port.ts`
- **Adaptadores**: kebab-case con sufijo `.adapter.ts`
- **Tests**: mismo nombre con sufijo `.spec.ts`
- **Estilos**: mismo nombre con extensión `.scss`
- **Templates**: mismo nombre con extensión `.html`

---

## 🎯 Archivos Clave por Funcionalidad

### Configuración
- `angular.json` - Configuración de Angular CLI
- `tsconfig.json` - Configuración de TypeScript
- `package.json` - Dependencias y scripts
- `eslint.config.js` - Reglas de linting
- `ngsw-config.json` - Configuración del Service Worker

### Punto de Entrada
- `src/main.ts` - Bootstrap de la aplicación
- `src/index.html` - HTML principal
- `src/app/app.ts` - Componente raíz
- `src/app/app.config.ts` - Configuración de providers

### Routing
- `src/app/app.routes.ts` - Definición de rutas

### Internacionalización
- `src/locale/messages.es.xlf` - Traducciones español
- `src/locale/messages.en.xlf` - Traducciones inglés
- `global.d.ts` - Declaración de $localize

### Assets
- `public/` - Assets estáticos (iconos, logos, manifest)

### Despliegue
- `.github/workflows/deploy-gh-pages.yml` - Workflow de GitHub Actions
- `public/404.html` - Página 404 para GitHub Pages

---

## 📚 Documentación

- `documentation/config/` - Configuración y arquitectura
- `documentation/specifications classes methods/` - Especificaciones técnicas
- `documentation/UX/` - Experiencia de usuario
- `README.md` - Documentación principal

---

## 🚀 Scripts Disponibles (package.json)

- `npm start` - Servidor de desarrollo
- `npm run build` - Compilación
- `npm run build:gh-pages` - Compilación para GitHub Pages
- `npm test` - Tests unitarios
- `npm run lint` - Análisis estático
- `npm run format` - Formateo de código
- `npm run validate` - Validación completa (lint + format + test)
