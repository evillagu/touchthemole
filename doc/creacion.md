## Fase inicial: creación y PWA

### 1) Creación del proyecto
- Resultado: se generó la base del proyecto Angular en `touch-the-mole`.
- Configuraciones vigentes al crear el proyecto:
  - Angular: `20.3.x` (según `package.json`).
  - Estilos por defecto: `scss` (según `angular.json`).
  - TypeScript en modo estricto (`strict: true`).
  - Rutas base: definidas en `src/app/app.routes.ts`.

### 2) Soporte PWA
- Comando: `ng add @angular/pwa --skip-confirmation`
- Resultado: se añadieron `ngsw-config.json`, `public/manifest.webmanifest` e íconos PWA.

### 3) Configuración del manifest
- Archivo: `public/manifest.webmanifest`
- Cambios:
  - `name`: "Touch the Mole"
  - `short_name`: "Touch the Mole"
  - `theme_color`: "#ff2d55"
  - `background_color`: "#ffd93d"

### 4) Estrategia del Service Worker
- Archivo: `ngsw-config.json`
- Estrategia: `prefetch` para todos los recursos del grupo `assets` y del grupo `app`.
- Objetivo: cachear recursos esenciales para funcionamiento offline.

### 5) Estructura Hexagonal en src/app
- `core/domain`: modelos (interfaces).
- `core/ports`: puertos (interfaces de servicios).
- `application/use-cases`: casos de uso y lógica de negocio.
- `infrastructure/adapters`: implementaciones concretas.
- `presentation/pages`: vistas (`home`, `game`).
- `presentation/components`: componentes atómicos.
- `shared`: utilidades y componentes comunes.

### 6) Routing base
- Archivo: `src/app/app.routes.ts`
- Rutas:
  - `/home` como predeterminada.
  - `/game`.
  - `**` redirige a `/home`.

