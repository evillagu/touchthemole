# Documentación de Casos de Uso de la Aplicación

Este documento describe la funcionalidad de los casos de uso (use cases) ubicados en la carpeta `src/app/application/use-cases/`.

## Estructura

Los casos de uso son funciones puras que encapsulan la lógica de negocio de la aplicación. Cada archivo representa un caso de uso específico relacionado con el juego "Touch the Mole".

## Archivos

### `difficulty.use-case.ts`

Gestiona las dificultades disponibles en el juego.

**Funciones exportadas:**

- `listDifficulties()`: Retorna un array readonly con todas las dificultades disponibles:
  - **Bajo** (Low): Multiplicador 1
  - **Medio** (Medium): Multiplicador 2
  - **Alto** (High): Multiplicador 3

- `resolveDifficulty(id: string)`: Resuelve una dificultad por su ID. Si no encuentra una coincidencia, retorna la dificultad por defecto (Bajo).

**Propósito:** Centraliza la definición de dificultades y proporciona funciones para acceder a ellas.

---

### `start-game.use-case.ts`

Inicia un nuevo juego con la configuración inicial.

**Función exportada:**

- `startGame(playerName: string, difficulty: Difficulty)`: Crea un nuevo estado de juego (`GameState`) con:
  - Nombre del jugador (sanitizado: máximo 24 caracteres, sin espacios al inicio/final, o "Jugador" si está vacío)
  - Puntos iniciales: 0
  - Dificultad seleccionada

**Propósito:** Inicializa el estado del juego cuando el usuario comienza una partida nueva.

---

### `change-difficulty.use-case.ts`

Cambia la dificultad durante el juego.

**Función exportada:**

- `changeDifficulty(state: GameState, difficulty: Difficulty)`: Actualiza el estado del juego cambiando únicamente la dificultad, manteniendo el resto del estado (nombre del jugador y puntos actuales).

**Propósito:** Permite modificar la dificultad sin reiniciar el juego completo.

---

### `apply-hit.use-case.ts`

Aplica un golpe exitoso al topo.

**Función exportada:**

- `applyHit(state: GameState)`: Incrementa los puntos del jugador según el multiplicador de la dificultad actual:
  - Dificultad Baja: +1 punto
  - Dificultad Media: +2 puntos
  - Dificultad Alta: +3 puntos

**Propósito:** Actualiza el puntaje cuando el jugador golpea exitosamente un topo.

---

### `local-storage-game-state.adapter.ts`

Implementa la persistencia del estado del juego utilizando el almacenamiento local del navegador (localStorage).

**Clase exportada:**

- `LocalStorageGameStateAdapter`: Implementa la interfaz `GameStateRepository` y proporciona métodos para guardar, cargar y limpiar el estado del juego.

**Métodos implementados:**

- `load()`: Carga el estado del juego desde localStorage. Retorna `GameState | null`:
  - Si no existe un estado guardado, retorna `null`
  - Si existe, parsea el JSON y valida que tenga la estructura correcta (playerName, points numérico, difficulty)
  - Si el parseo falla o la estructura es inválida, retorna `null`

- `save(state: GameState)`: Guarda el estado del juego en localStorage como JSON serializado usando la clave `'touch-the-mole:game-state'`.

- `clear()`: Elimina el estado guardado del localStorage.

**Características de seguridad:**

- Validación de datos al cargar: Verifica que el estado parseado tenga la estructura correcta antes de retornarlo
- Manejo de errores: Captura excepciones durante el parseo JSON y retorna `null` en caso de error
- Clave única: Utiliza una clave específica del proyecto para evitar conflictos con otras aplicaciones

**Propósito:** Proporciona persistencia del estado del juego entre sesiones del navegador, permitiendo que el jugador pueda continuar su partida después de cerrar y reabrir la aplicación.

**Arquitectura:** Este adaptador forma parte de la capa de infraestructura y implementa el puerto `GameStateRepository`, siguiendo el patrón de Arquitectura Hexagonal (Ports and Adapters). Esto permite cambiar la implementación de persistencia sin afectar la lógica de negocio.

---

### `app.config.ts`

Configuración principal de la aplicación Angular. Define todos los proveedores (providers) y servicios globales que estarán disponibles en toda la aplicación.

**Exportación:**

- `appConfig: ApplicationConfig`: Objeto de configuración que contiene todos los proveedores de la aplicación.

**Proveedores configurados:**

1. **`provideBrowserGlobalErrorListeners()`**: Habilita el manejo global de errores en el navegador, permitiendo capturar y gestionar errores no controlados de manera centralizada.

2. **`provideZoneChangeDetection({ eventCoalescing: true })`**: Configura Zone.js para la detección de cambios:
   - `eventCoalescing: true`: Optimiza el rendimiento agrupando múltiples eventos del mismo tipo antes de ejecutar la detección de cambios

3. **`provideRouter(routes)`**: Configura el sistema de enrutamiento de Angular usando las rutas definidas en `app.routes.ts`:
   - Ruta raíz (`''`) redirige a `'home'`
   - Ruta `'home'` muestra el componente `HomePageComponent`
   - Ruta `'game'` muestra el componente `GamePageComponent`
   - Cualquier otra ruta (`**`) redirige a `'home'`

4. **`provideServiceWorker('ngsw-worker.js', {...})`**: Configura el Service Worker para habilitar funcionalidades PWA (Progressive Web App):
   - `enabled: !isDevMode()`: Solo se habilita en modo producción
   - `registrationStrategy: 'registerWhenStable:30000'`: Registra el Service Worker cuando la aplicación está estable, con un timeout de 30 segundos

5. **Inyección de dependencias del repositorio**: Configura la implementación concreta del puerto `GameStateRepository`:
   - Proporciona el token `GAME_STATE_REPOSITORY`
   - Utiliza la clase `LocalStorageGameStateAdapter` como implementación

**Propósito:** Centraliza toda la configuración de la aplicación Angular, incluyendo servicios globales, enrutamiento, Service Worker y la inyección de dependencias siguiendo el patrón de Arquitectura Hexagonal.

**Arquitectura:** Este archivo es el punto de entrada de configuración de Angular y establece la conexión entre las capas de la aplicación, especialmente la inyección del adaptador de infraestructura (`LocalStorageGameStateAdapter`) como implementación del puerto del dominio (`GameStateRepository`).

---

## Características Comunes

Todos los casos de uso comparten las siguientes características:

- **Funciones puras**: No tienen efectos secundarios, siempre retornan el mismo resultado para las mismas entradas
- **Inmutabilidad**: No modifican directamente el estado, sino que crean nuevos objetos
- **Tipado estricto**: Utilizan los modelos de dominio (`Difficulty`, `GameState`) para garantizar la integridad de los datos
- **Separación de responsabilidades**: Cada caso de uso tiene una responsabilidad única y bien definida
