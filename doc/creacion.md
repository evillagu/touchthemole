## Fase inicial: creación y PWA

### 1) Creación del proyecto
- Comando: `ng new touch-the-mole --skip-git --style=css`
- Resultado: se generó la base del proyecto Angular en `touch-the-mole`.

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
- `core/models`: contratos de datos (User, GameState, Difficulty).
- `core/ports`: interfaces para servicios.
- `infrastructure/adapters`: implementaciones concretas.
- `application/use-cases`: casos de uso.
- `features`: `home` y `game` como vistas.
- `shared`: componentes comunes.

### 6) Routing base
- Archivo: `src/app/app.routes.ts`
- Rutas:
  - `/home` como predeterminada.
  - `/game`.
  - `**` redirige a `/home`.

