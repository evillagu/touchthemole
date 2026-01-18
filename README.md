# TouchTheMole

> **Nota:** La documentación de este proyecto se realiza en español para facilitar la comprensión del proyecto y la documentación ubicada en la carpeta `doc`.

Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) versión 20.3.10.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: Se recomienda usar una versión LTS compatible con Angular 20:
  - Node.js 20.19.x, 22.12.x o 24.x (recomendado instalar la última versión LTS disponible)
  - Puedes verificar tu versión con: `node --version`
  - Se recomienda usar [nvm](https://github.com/nvm-sh/nvm) para gestionar versiones de Node.js

- **npm** o **pnpm**: Gestor de paquetes (incluido con Node.js)

- **Angular CLI**: Se instalará globalmente o se usará a través de `npx`

## Instalación

Para instalar las dependencias del proyecto, ejecuta:

```bash
npm install
```

O si prefieres usar pnpm:

```bash
pnpm install
```

## Configuración del Proyecto

Este proyecto utiliza una configuración estructurada para gestionar la compilación y el desarrollo:

- **`package.json`**: Gestiona las versiones de Angular 20.0.0 y TypeScript 5.8.

- **`tsconfig.json`**: Define las reglas globales de compilación (configuración base con modo estricto y opciones del compilador de Angular).

- **`tsconfig.app.json`**: Hereda de la base (`tsconfig.json`) y se enfoca solo en el código de tu aplicación (`src/**/*.ts`).

- **`angular.json`**: Orquesta todo usando los builders de alto rendimiento (`@angular/build:application` y `@angular/build:dev-server`).

## Internacionalización (i18n)

El proyecto implementa internacionalización utilizando el sistema nativo de Angular i18n basado en el estándar XLIFF (XML Localization Interchange File Format).

### Configuración de i18n

- **`src/locale/messages.es.xlf`**: Archivo de traducciones en formato XLIFF 1.2 que contiene todas las cadenas de texto localizadas para el idioma español (es). Utiliza el formato estándar de Angular con trans-units identificados por IDs únicos.

- **`angular.json`**: Configuración de localización en las configuraciones de build:
  - **`production-es`**: Configuración de producción con localización habilitada para español mediante la opción `"localize": ["es"]`
  - **`extract-i18n`**: Builder configurado para extraer cadenas marcadas con la directiva `i18n` de los templates

- **`app.config.ts`**: Configuración del proveedor de locale:
  - **`LOCALE_ID`**: Proveedor configurado con el valor `'es'` para establecer el locale español como predeterminado
  - **`registerLocaleData(localeEs)`**: Registro de los datos de localización para español importados desde `@angular/common/locales/es`

- **`global.d.ts`**: Archivo de declaración de tipos TypeScript que define la función global `$localize` como una función de tagged template. Esta declaración permite que TypeScript reconozca `$localize` como función global disponible en tiempo de compilación, resolviendo errores de tipo `TS2304: Cannot find name '$localize'`. El archivo está incluido explícitamente en `tsconfig.json` mediante la propiedad `"files": ["global.d.ts"]` para garantizar su reconocimiento por el compilador.

### Implementación de i18n

- **Templates HTML**: Utilizan la directiva `i18n` con identificadores únicos (ej: `i18n="@@app.title"`) para marcar cadenas de texto que requieren traducción
- **Código TypeScript**: Utiliza la función global `$localize` con sintaxis de tagged template para literales en tiempo de ejecución (ej: `$localize`:@@game.defaultPlayerName:Jugador``)
- **Atributos**: Los atributos HTML como `placeholder` utilizan la variante `i18n-placeholder` para su localización

### Comandos relacionados con i18n

```bash
# Extraer cadenas de texto para traducción
ng extract-i18n

# Compilar para producción con localización
ng build --configuration=production-es

# Servir aplicación con localización
ng serve --configuration=production-es
```

## Servidor de desarrollo

Para iniciar un servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté en ejecución, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente siempre que modifiques alguno de los archivos fuente.

## Compilación

Para compilar el proyecto, ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los artefactos de compilación en el directorio `dist/`. Por defecto, la compilación de producción optimiza tu aplicación para rendimiento y velocidad.

## Ejecutar pruebas unitarias

Para ejecutar pruebas unitarias con el ejecutor de pruebas [Karma](https://karma-runner.github.io), usa el siguiente comando:

```bash
ng test
```
## Documentación del Proyecto

El proyecto incluye documentación detallada organizada en dos directorios principales:

### Documentación de Configuración (`doc/config/`)

Esta carpeta contiene documentación sobre la configuración y arquitectura del proyecto:

- **`architecture project.md`**: Describe la arquitectura hexagonal (Domain-Driven Design) implementada en el proyecto, incluyendo las capas (core, application, infrastructure, presentation), el flujo de dependencias, y la estructura de archivos. También documenta las tecnologías y prácticas utilizadas (Angular Signals, i18n, metodología BEM, etc.).

- **`config-PWA.md`**: Documentación completa sobre la configuración de Progressive Web App (PWA), incluyendo:
  - Configuración del Web App Manifest
  - Service Worker y estrategias de cache
  - Meta tags para PWA
  - Configuración para GitHub Pages
  - Workflow de despliegue automatizado
  - Testing y troubleshooting de PWA

- **`creacion.md`**: Documenta la fase inicial de creación del proyecto, incluyendo:
  - Configuración inicial de Angular 20
  - Instalación y configuración de PWA
  - Configuración del manifest y Service Worker
  - Configuración de la aplicación

- **`reglas-es6.md`**: Documentación completa sobre las reglas ES6 y configuración de ESLint del proyecto, incluyendo:
  - Configuración global de ESLint
  - Reglas personalizadas para TypeScript y Angular
  - Reglas de estilo y nomenclatura
  - Configuración de reglas recomendadas
  - Ejemplos y mejores prácticas

### Documentación de Especificaciones (`doc/specifications classes methods/`)

Esta carpeta contiene documentación técnica detallada sobre las clases, métodos y funcionalidades específicas:

- **`use cases.md`**: Especificaciones detalladas de todos los casos de uso de la aplicación, incluyendo:
  - `apply-hit.use-case.ts`: Lógica para aplicar puntuación al golpear el topo
  - `change-difficulty.use-case.ts`: Cambio de dificultad durante el juego
  - `start-game.use-case.ts`: Inicio de nueva partida con validación
  - `difficulty.use-case.ts`: Gestión de dificultades y configuración centralizada (`GAME_CONFIG`)
  - Principios de diseño (inmutabilidad, funciones puras, separación de responsabilidades)
  - Flujos de uso y ejemplos de implementación

- **`i18n.md`**: Documentación completa sobre la configuración y uso de internacionalización (i18n), incluyendo:
  - Configuración en `angular.json` y `app.config.ts`
  - Uso de `$localize` en templates y código TypeScript
  - Archivos XLIFF (español e inglés)
  - Comandos para extraer y compilar traducciones
  - Estrategias de testing con i18n
  - Workflow de traducción y troubleshooting

- **`most relevant methods and classes.md`**: Documentación exhaustiva de los métodos y clases más relevantes de la aplicación, incluyendo:
  - **Componentes de Páginas**: `HomePageComponent`, `GamePageComponent` (con todos sus métodos públicos y privados)
  - **Componentes Presentacionales**: `GameBoardComponent`, `MoleButtonComponent`, `ScoreBoardComponent`
  - **Adaptadores de Infraestructura**: `LocalStorageGameStateAdapter`
  - **Puertos e Interfaces**: `GameStateRepository`
  - Flujos de interacción entre componentes
  - Principios de diseño aplicados (separación de responsabilidades, reactividad, inmutabilidad)

### Cómo usar la documentación

- **Para entender la arquitectura**: Comienza con `architecture project.md` y `creacion.md`
- **Para configurar PWA**: Consulta `config-PWA.md`
- **Para entender la lógica de negocio**: Revisa `use cases.md`
- **Para trabajar con componentes**: Consulta `most relevant methods and classes.md`
- **Para configurar i18n**: Revisa `i18n.md`
- **Para seguir estándares de código**: Consulta `reglas-es6.md`

## Recursos adicionales

Para obtener más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
