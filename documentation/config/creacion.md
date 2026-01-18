# Fase inicial: creación y PWA

## 1) Creación del proyecto

- Resultado: se generó la base del proyecto Angular en `touch-the-mole`.
- Configuraciones vigentes:
  - Angular: `20.0.0` (según `package.json`).
  - TypeScript: `5.8.0`.
  - RxJS: `7.8.0`.
  - Zone.js: `0.15.0`.
  - Estilos por defecto: `scss` (según `angular.json`).
  - TypeScript en modo estricto (`strict: true`).
  - Rutas base: definidas en `src/app/app.routes.ts`.

## 2) Soporte PWA

- Comando: `ng add @angular/pwa --skip-confirmation`
- Resultado: se añadieron `ngsw-config.json`, `public/manifest.webmanifest` e íconos PWA.
- Dependencia añadida: `@angular/service-worker: ^20.0.0`

## 3) Configuración del manifest

- Archivo: `public/manifest.webmanifest`
- Configuración:
  - `name`: "Toca el Topo"
  - `short_name`: "Toca el Topo"
  - `display`: "standalone" (aplicación sin barra del navegador)
  - `scope`: "./" (alcance de la PWA)
  - `start_url`: "./" (URL de inicio)
  - `theme_color`: "#ff2d55"
  - `background_color`: "#ffd93d"
  - `icons`: 
    - `logo-topo.svg` (SVG, sizes: "any")
    - `icons/topo.svg` (SVG, sizes: "any")

## 4) Estrategia del Service Worker

- Archivo: `ngsw-config.json`
- Estrategias de cache:
  - Grupo `app`: `installMode: "prefetch"` (precarga al instalar)
    - Recursos: `favicon.ico`, `index.html`, `index.csr.html`, `manifest.webmanifest`, `*.css`, `*.js`
  - Grupo `assets`: `installMode: "prefetch"` y `updateMode: "prefetch"` (precarga y actualización)
    - Recursos: archivos estáticos (SVG, imágenes, fuentes, audio)
- Objetivo: cachear recursos esenciales para funcionamiento offline.

## 5) Configuración del Service Worker en app.config.ts

- Archivo: `src/app/app.config.ts`
- Provider: `provideServiceWorker('ngsw-worker.js', {...})`
- Configuración:
  - `enabled: !isDevMode()`: Service Worker activo solo en producción
  - `registrationStrategy: 'registerWhenStable:30000'`: registro después de 30 segundos de estabilidad
- Objetivo: registrar el Service Worker automáticamente en producción para habilitar funcionalidad offline.

## 6) Configuración de build en angular.json

- Archivo: `angular.json`
- Configuración de producción:
  - `serviceWorker: "ngsw-config.json"`: referencia al archivo de configuración del Service Worker
  - `outputHashing: "all"`: hash en nombres de archivos para cache busting
  - `optimization: true`: optimizaciones activadas
- Configuraciones de build:
  - `production`: build estándar con Service Worker
  - `production-es`: build en español con Service Worker
  - `production-en`: build en inglés con Service Worker
- Objetivo: generar el Service Worker automáticamente durante el build de producción.

## 7) Estructura Hexagonal en src/app

- `core/domain`: modelos (interfaces).
- `core/ports`: puertos (interfaces de servicios) y tokens de inyección.
- `application/use-cases`: casos de uso y lógica de negocio.
- `infrastructure/adapters`: implementaciones concretas.
- `presentation/pages`: vistas (`home`, `game`).
- `presentation/components`: componentes atómicos.

## 8) Routing base

- Archivo: `src/app/app.routes.ts`
- Rutas:
  - `/home` como predeterminada.
  - `/game`.
  - `**` redirige a `/home`.

## 9) Resumen de configuración PWA

1. **Instalación**: `ng add @angular/pwa --skip-confirmation`
2. **Provider**: `provideServiceWorker()` en `app.config.ts` con estrategia de registro
3. **Configuración**: `ngsw-config.json` con estrategias de cache (`prefetch` para app y assets)
4. **Manifest**: `public/manifest.webmanifest` con metadatos de la aplicación
5. **Build**: `angular.json` con `serviceWorker: "ngsw-config.json"` en configuraciones de producción

El Service Worker se genera automáticamente durante el build de producción y gestiona el cache offline según la configuración en `ngsw-config.json`.
