# Arquitectura del proyecto

## Enfoque

Arquitectura Hexagonal (Domain-Driven Design) con separación por capas y dependencias dirigidas hacia el dominio.

## Capas y responsabilidades

- `core/domain`: modelos puros (interfaces) del dominio.
- `core/ports`: contratos para infraestructura (repositorios, servicios externos) y tokens de inyección (InjectionToken).
- `application/use-cases`: lógica de negocio pura y orquestación de reglas. Incluye `GAME_CONFIG` para configuración centralizada.
- `infrastructure/adapters`: implementaciones concretas de puertos.
- `presentation/pages`: páginas y composición de UI.
- `presentation/components`: componentes atómicos reutilizables.

## Estructura de archivos

Cada componente/página sigue la estructura:
- `*.ts`: lógica del componente
- `*.html`: template
- `*.scss`: estilos (metodología BEM)
- `*.spec.ts`: tests unitarios

## Flujo de dependencias

- `presentation` depende de `application` y `core`.
- `application` depende solo de `core`.
- `infrastructure` implementa `core/ports` y no depende de `presentation`.

## Configuración centralizada

- `GAME_CONFIG`: objeto de configuración en `application/use-cases/difficulty.use-case.ts` que centraliza parámetros del juego (tiempos, puntos, límites).
- Variables CSS: todas las variables de colores, espaciado y tipografía están centralizadas en `src/styles.scss`.

## Implementación en este proyecto

### Core
- `core/domain`: modelos puros (interfaces) del dominio:
  - `GameState`: estado del juego (nombre jugador, puntos, dificultad, tiempo restante, duración, modo por tiempo)
  - `Difficulty`: configuración de dificultad (id, label, multiplier, intervalMs, points)
  - `User`: modelo de usuario
- `core/ports`: contratos y tokens de inyección:
  - `GameStateRepository`: interfaz para persistencia
  - `GAME_STATE_REPOSITORY`: token de inyección de Angular (InjectionToken)

### Application
- `application/use-cases`: casos de uso puros:
  - `start-game.use-case.ts`: iniciar nueva partida con validación de nombre (soporta modo por tiempo)
  - `change-difficulty.use-case.ts`: cambiar dificultad durante el juego
  - `apply-hit.use-case.ts`: aplicar puntuación al golpear el topo
  - `tick-timer.use-case.ts`: decrementar tiempo restante del juego
  - `end-game-by-time.use-case.ts`: finalizar juego cuando el tiempo llega a 0
  - `difficulty.use-case.ts`: gestión de dificultades y `GAME_CONFIG` centralizado

### Infrastructure
- `infrastructure/adapters`: implementaciones concretas:
  - `LocalStorageGameStateAdapter`: persistencia en `localStorage` del navegador

### Presentation
- `presentation/pages`: páginas de la aplicación:
  - `home`: página inicial con formulario para ingresar nombre del jugador
  - `game`: página de juego con tablero, controles, puntuación, timer y modal GAME OVER
- `presentation/components`: componentes reutilizables:
  - `mole-button`: botón individual que muestra/oculta el topo con estados visuales
  - `game-board`: tablero con grid de 3x3 botones
  - `score-board`: panel que muestra nombre del jugador y puntuación

## Tecnologías y prácticas

- **Angular Signals**: gestión reactiva del estado con `signal()` y `WritableSignal`
- **i18n**: internacionalización con Angular i18n (español e inglés) usando XLIFF
- **Metodología BEM**: nomenclatura CSS Block__Element--Modifier para estilos encapsulados
- **Diseño fluido**: uso de `clamp()` y variables CSS sin media para la adaptación a cualquier resolución
- **Tests dinámicos**: casos parametrizados con arrays para mayor cobertura y mantenibilidad
- **ViewEncapsulation**: encapsulación de estilos por componente (Emulated)
- **Configuración centralizada**: `GAME_CONFIG` para parámetros del juego y variables CSS para estilos
