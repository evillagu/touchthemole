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

## Servidor de desarrollo

Para iniciar un servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté en ejecución, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente siempre que modifiques alguno de los archivos fuente.

## Generación de código

Angular CLI incluye potentes herramientas de generación de código. Para generar un nuevo componente, ejecuta:

```bash
ng generate component component-name
```

Para obtener una lista completa de esquemas disponibles (como `components`, `directives` o `pipes`), ejecuta:

```bash
ng generate --help
```

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

## Ejecutar pruebas end-to-end

Para pruebas end-to-end (e2e), ejecuta:

```bash
ng e2e
```

Angular CLI no incluye un framework de pruebas end-to-end por defecto. Puedes elegir uno que se adapte a tus necesidades.

## Recursos adicionales

Para obtener más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
