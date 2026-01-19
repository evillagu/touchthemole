# Especificaciones de Clases y Métodos - Use Cases

## Objetivo

Este documento describe la funcionalidad, propósito de ciertos metodos y clases que tengan relevancia en la aplicación.

## Use-case
Los use cases contienen la lógica de negocio pura y son funciones inmutables que transforman el estado del juego.
## Ubicación

Todos los use cases se encuentran en: `src/app/application/use-cases/`

## Arquitectura

Los use cases siguen los principios de:
- **Funciones puras**: No tienen efectos secundarios, siempre retornan el mismo resultado para las mismas entradas.
- **Inmutabilidad**: No modifican el estado original, retornan un nuevo estado.
- **Separación de responsabilidades**: Contienen solo lógica de negocio, sin dependencias de infraestructura o presentación.

---

## Use Cases

### 1. `apply-hit.use-case.ts`

#### Propósito
Aplica la puntuación al jugador cuando golpea exitosamente el topo. Suma los puntos correspondientes según la dificultad actual del juego.

#### Función
```typescript
export const applyHit = (state: GameState): GameState
```

#### Parámetros
- `state: GameState` - Estado actual del juego que contiene la puntuación y dificultad.

#### Retorno
- `GameState` - Nuevo estado del juego con la puntuación actualizada.

#### Lógica
1. Toma el estado actual del juego.
2. Suma los puntos de la dificultad actual (`state.difficulty.points`) a los puntos existentes.
3. Retorna un nuevo objeto `GameState` con los puntos actualizados, manteniendo el resto del estado sin cambios.

#### Ejemplo de uso
```typescript
const currentState: GameState = {
  playerName: 'Jugador',
  points: 50,
  difficulty: { id: 'medium', points: 20, ... }
};

const newState = applyHit(currentState);
// newState.points = 70 (50 + 20)
```

#### Dónde se usa
- `src/app/presentation/pages/game/game.ts`: En el método `handleHit()` cuando el jugador golpea el topo activo.

#### Características
- **Inmutable**: No modifica el estado original.
- **Puro**: Siempre retorna el mismo resultado para las mismas entradas.
- **Determinístico**: El resultado depende únicamente de los parámetros de entrada.

---

### 2. `change-difficulty.use-case.ts`

#### Propósito
Cambia la dificultad del juego durante una partida en curso, manteniendo la puntuación y el nombre del jugador.

#### Función
```typescript
export const changeDifficulty = (state: GameState, difficulty: Difficulty): GameState
```

#### Parámetros
- `state: GameState` - Estado actual del juego.
- `difficulty: Difficulty` - Nueva dificultad a aplicar.

#### Retorno
- `GameState` - Nuevo estado del juego con la dificultad actualizada.

#### Lógica
1. Toma el estado actual del juego.
2. Reemplaza la dificultad actual con la nueva dificultad proporcionada.
3. Retorna un nuevo objeto `GameState` con la dificultad actualizada, manteniendo el nombre del jugador y los puntos sin cambios.

#### Ejemplo de uso
```typescript
const currentState: GameState = {
  playerName: 'Jugador',
  points: 100,
  difficulty: { id: 'low', points: 10, intervalMs: 1000, ... }
};

const newDifficulty: Difficulty = { id: 'high', points: 30, intervalMs: 500, ... };
const newState = changeDifficulty(currentState, newDifficulty);
// newState.difficulty = newDifficulty
// newState.points = 100 (sin cambios)
// newState.playerName = 'Jugador' (sin cambios)
```

#### Dónde se usa
- `src/app/presentation/pages/game/game.ts`: En el método `onDifficultyChange()` cuando el jugador selecciona una nueva dificultad desde el selector.

#### Características
- **Inmutable**: No modifica el estado original.
- **Puro**: Siempre retorna el mismo resultado para las mismas entradas.
- **Preserva datos**: Mantiene la puntuación y nombre del jugador al cambiar la dificultad.

---

### 3. `start-game.use-case.ts`

#### Propósito
Inicializa un nuevo estado de juego con el nombre del jugador y la dificultad seleccionada. Valida y sanitiza el nombre del jugador según las reglas del juego. Soporta modo de juego por tiempo.

#### Función
```typescript
export const startGame = (
  playerName: string,
  difficulty: Difficulty,
  isTimeBased?: boolean,
  gameDurationSeconds?: number
): GameState
```

#### Parámetros
- `playerName: string` - Nombre del jugador proporcionado por el usuario.
- `difficulty: Difficulty` - Dificultad inicial para la partida.
- `isTimeBased?: boolean` - Indica si el juego es por tiempo (opcional, por defecto `false`).
- `gameDurationSeconds?: number` - Duración del juego en segundos (opcional, usa `GAME_CONFIG.defaultGameDurationSeconds` si no se proporciona).

#### Retorno
- `GameState` - Nuevo estado de juego inicializado.

#### Lógica
1. **Sanitización del nombre**:
   - Elimina espacios en blanco al inicio y final (`trim()`).
   - Limita la longitud máxima según `GAME_CONFIG.maxPlayerNameLength` (24 caracteres).
   - Si el nombre está vacío después de sanitizar, usa el nombre por defecto (`GAME_CONFIG.defaultPlayerName`).

2. **Inicialización del estado**:
   - Establece los puntos en 0.
   - Asigna la dificultad proporcionada.
   - Usa el nombre sanitizado o el nombre por defecto.
   - Si `isTimeBased` es `true`, establece `timeRemaining` y `gameDuration` con la duración proporcionada o el valor por defecto.

#### Ejemplo de uso
```typescript
const playerName = '  Mi Nombre Largo Que Será Truncado  ';
const difficulty = { id: 'medium', points: 20, intervalMs: 750, ... };

const gameState = startGame(playerName, difficulty, true, 30);
// gameState.playerName = 'Mi Nombre Largo Que Ser' (truncado a 24 caracteres)
// gameState.points = 0
// gameState.difficulty = difficulty
// gameState.isTimeBased = true
// gameState.timeRemaining = 30
// gameState.gameDuration = 30
```

#### Casos especiales
- **Nombre vacío**: Si el nombre es `''` o solo espacios, usa `'Jugador'` (nombre por defecto).
- **Nombre muy largo**: Si excede 24 caracteres, se trunca a 24 caracteres.
- **Nombre con espacios**: Los espacios al inicio y final se eliminan.
- **Modo por tiempo**: Si `isTimeBased` es `true` y no se proporciona `gameDurationSeconds`, usa `GAME_CONFIG.defaultGameDurationSeconds` (30 segundos).

#### Dónde se usa
- `src/app/presentation/pages/home/home.ts`: En el método `start()` cuando el jugador inicia una nueva partida.
- `src/app/presentation/pages/game/game.ts`: En el constructor para inicializar el estado si no hay uno guardado, y en `onRestart()` para reiniciar la partida (siempre en modo por tiempo).

#### Características
- **Inmutable**: Crea un nuevo estado sin modificar parámetros.
- **Puro**: Siempre retorna el mismo resultado para las mismas entradas.
- **Validación**: Sanitiza y valida el nombre del jugador.
- **Configuración centralizada**: Usa `GAME_CONFIG` para límites y valores por defecto.
- **Modo por tiempo**: Soporta inicialización de juegos con límite de tiempo.

---

### 4. `tick-timer.use-case.ts`

#### Propósito
Decrementa el tiempo restante del juego en un segundo. Solo funciona si el juego está en modo por tiempo y tiene tiempo restante.

#### Función
```typescript
export const tickTimer = (state: GameState): GameState
```

#### Parámetros
- `state: GameState` - Estado actual del juego que debe tener `isTimeBased: true` y `timeRemaining` definido.

#### Retorno
- `GameState` - Nuevo estado del juego con `timeRemaining` decrementado en 1, o el estado original si no es modo por tiempo o el tiempo ya llegó a 0.

#### Lógica
1. Verifica si el juego está en modo por tiempo (`state.isTimeBased`).
2. Verifica si hay tiempo restante (`state.timeRemaining` existe y es mayor que 0).
3. Si ambas condiciones se cumplen, retorna un nuevo estado con `timeRemaining` decrementado en 1.
4. Si no se cumplen las condiciones, retorna el estado original sin cambios.

#### Ejemplo de uso
```typescript
const currentState: GameState = {
  playerName: 'Jugador',
  points: 100,
  difficulty: { id: 'medium', ... },
  isTimeBased: true,
  timeRemaining: 15,
  gameDuration: 30
};

const newState = tickTimer(currentState);
// newState.timeRemaining = 14
// newState.points = 100 (sin cambios)
```

#### Casos especiales
- **No es modo por tiempo**: Si `isTimeBased` es `false` o `undefined`, retorna el estado sin cambios.
- **Tiempo agotado**: Si `timeRemaining` es 0 o menor, retorna el estado sin cambios.
- **Tiempo no definido**: Si `timeRemaining` es `undefined`, retorna el estado sin cambios.

#### Dónde se usa
- `src/app/presentation/pages/game/game.ts`: En el método `startTimer()` que se ejecuta cada segundo mediante `setInterval`.

#### Características
- **Inmutable**: No modifica el estado original.
- **Puro**: Siempre retorna el mismo resultado para las mismas entradas.
- **Seguro**: Valida condiciones antes de modificar el tiempo.
- **Determinístico**: El resultado depende únicamente del estado de entrada.

---

### 5. `end-game-by-time.use-case.ts`

#### Propósito
Finaliza el juego estableciendo el tiempo restante en 0. Se utiliza cuando el cronómetro llega a 0 para marcar el final de la partida.

#### Función
```typescript
export const endGameByTime = (state: GameState): GameState
```

#### Parámetros
- `state: GameState` - Estado actual del juego.

#### Retorno
- `GameState` - Nuevo estado del juego con `timeRemaining` establecido en 0.

#### Lógica
1. Toma el estado actual del juego.
2. Retorna un nuevo objeto `GameState` con `timeRemaining` establecido en 0.
3. Mantiene todos los demás campos del estado sin cambios (puntuación, nombre, dificultad, etc.).

#### Ejemplo de uso
```typescript
const currentState: GameState = {
  playerName: 'Jugador',
  points: 250,
  difficulty: { id: 'high', ... },
  isTimeBased: true,
  timeRemaining: 1,
  gameDuration: 30
};

const finalState = endGameByTime(currentState);
// finalState.timeRemaining = 0
// finalState.points = 250 (sin cambios)
// finalState.playerName = 'Jugador' (sin cambios)
```

#### Dónde se usa
- `src/app/presentation/pages/game/game.ts`: En el método `finishGameByTime()` cuando el tiempo llega a 0, antes de mostrar el modal GAME OVER.

#### Características
- **Inmutable**: No modifica el estado original.
- **Puro**: Siempre retorna el mismo resultado para las mismas entradas.
- **Preserva puntuación**: Mantiene la puntuación final del jugador.
- **Marcador de finalización**: Establece claramente que el juego ha terminado.

---

### 6. `difficulty.use-case.ts`

#### Propósito
Gestiona las dificultades disponibles del juego y proporciona funciones para listarlas y resolverlas. También centraliza la configuración global del juego en `GAME_CONFIG`.

#### Funciones exportadas

##### `listDifficulties()`
```typescript
export const listDifficulties = (): readonly Difficulty[]
```

**Propósito**: Retorna todas las dificultades disponibles en el juego.

**Retorno**: Array de solo lectura con las tres dificultades (Bajo, Medio, Alto).

**Lógica**: Retorna el array interno `difficulties` que contiene las configuraciones de cada nivel.

**Ejemplo de uso**:
```typescript
const difficulties = listDifficulties();
// Retorna: [
//   { id: 'low', label: 'Bajo', multiplier: 1, intervalMs: 1000, points: 10 },
//   { id: 'medium', label: 'Medio', multiplier: 2, intervalMs: 750, points: 20 },
//   { id: 'high', label: 'Alto', multiplier: 3, intervalMs: 500, points: 30 }
// ]
```

**Dónde se usa**:
- `src/app/presentation/pages/home/home.ts`: Para obtener la dificultad por defecto.
- `src/app/presentation/pages/game/game.ts`: Para poblar el selector de dificultades y obtener la dificultad inicial.

##### `resolveDifficulty(id: string)`
```typescript
export const resolveDifficulty = (id: string): Difficulty
```

**Propósito**: Resuelve un ID de dificultad a su objeto `Difficulty` correspondiente. Si el ID no existe, retorna la dificultad por defecto (Bajo).

**Parámetros**:
- `id: string` - ID de la dificultad a resolver (`'low'`, `'medium'`, `'high'`).

**Retorno**: Objeto `Difficulty` correspondiente al ID, o la dificultad por defecto si el ID no es válido.

**Lógica**:
1. Busca la dificultad que coincida con el ID proporcionado.
2. Si encuentra una coincidencia, la retorna.
3. Si no encuentra coincidencia (ID inválido, vacío, o desconocido), retorna la primera dificultad del array (Bajo) como valor por defecto.

**Ejemplo de uso**:
```typescript
const difficulty = resolveDifficulty('medium');
// Retorna: { id: 'medium', label: 'Medio', multiplier: 2, intervalMs: 750, points: 20 }

const invalidDifficulty = resolveDifficulty('invalid-id');
// Retorna: { id: 'low', label: 'Bajo', ... } (dificultad por defecto)
```

**Dónde se usa**:
- `src/app/presentation/pages/game/game.ts`: En el método `onDifficultyChange()` para convertir el valor del selector HTML a un objeto `Difficulty`.

#### Configuración de dificultades

El archivo define tres niveles de dificultad:

1. **Bajo (Low)**
   - ID: `'low'`
   - Multiplicador: 1
   - Intervalo: 1000ms (1 segundo)
   - Puntos por golpe: 10

2. **Medio (Medium)**
   - ID: `'medium'`
   - Multiplicador: 2
   - Intervalo: 750ms (0.75 segundos)
   - Puntos por golpe: 20

3. **Alto (High)**
   - ID: `'high'`
   - Multiplicador: 3
   - Intervalo: 500ms (0.5 segundos)
   - Puntos por golpe: 30

#### `GAME_CONFIG`

Objeto de configuración centralizada que contiene parámetros globales del juego:

```typescript
export const GAME_CONFIG = {
  minVisibilityMs: 800,              // Tiempo mínimo de visibilidad del topo (ms)
  hitDelayMs: 500,                   // Delay después de golpear antes de mostrar siguiente topo (ms)
  hitDelayMsWithEffect: 200,         // Delay cuando hay efecto visual activo (ms)
  hitEffectDurationMs: 200,          // Duración del efecto visual de golpe (ms)
  totalHoles: 9,                     // Número total de agujeros en el tablero (3x3)
  maxPlayerNameLength: 24,           // Longitud máxima del nombre del jugador
  defaultPlayerName: 'Jugador',      // Nombre por defecto si el jugador no proporciona uno
  defaultGameDurationSeconds: 30,     // Duración por defecto del juego por tiempo (segundos)
  lowTimeThreshold: 5,               // Umbral de tiempo bajo para alerta visual (segundos)
  speedIncreaseThreshold: 10,        // Umbral para aumentar velocidad de topos (segundos)
  fastIntervalMultiplier: 0.625,     // Multiplicador de velocidad cuando queda poco tiempo
} as const;
```

**Propósito**: Centraliza todos los parámetros configurables del juego en un solo lugar para facilitar el mantenimiento y la consistencia.

**Nuevos parámetros de tiempo**:
- `defaultGameDurationSeconds`: Duración por defecto de las partidas por tiempo (30 segundos).
- `lowTimeThreshold`: Cuando el tiempo restante es ≤5 segundos, se activa la alerta visual (parpadeo rojo).
- `speedIncreaseThreshold`: Cuando el tiempo restante es ≤10 segundos, aumenta la velocidad de aparición de topos.
- `fastIntervalMultiplier`: Multiplicador aplicado al intervalo base cuando el tiempo es bajo (0.625 = 62.5% del tiempo original).

**Dónde se usa**:
- `start-game.use-case.ts`: Para validar la longitud del nombre, usar el nombre por defecto y establecer la duración del juego.
- `src/app/presentation/pages/game/game.ts`: Para configurar el número de agujeros, tiempos de visibilidad, delays, y gestión del timer.

#### Características
- **Inmutable**: Los arrays y objetos son de solo lectura (`readonly`).
- **Puro**: Las funciones siempre retornan el mismo resultado para las mismas entradas.
- **Configuración centralizada**: `GAME_CONFIG` permite modificar parámetros del juego en un solo lugar.
- **Resiliente**: `resolveDifficulty` maneja IDs inválidos retornando un valor por defecto seguro.
- **i18n**: Las etiquetas de dificultad usan `$localize` para soporte multiidioma.
- **Soporte de tiempo**: Incluye configuración para el sistema de juego por tiempo.

---

## Flujo de uso de los Use Cases

### Inicio de partida
1. Usuario ingresa nombre en `HomePageComponent`.
2. Se llama `startGame(playerName, defaultDifficulty)`.
3. Se guarda el estado en el repositorio.
4. Se navega a la página de juego.

### Durante el juego
1. Usuario golpea el topo → `applyHit(gameState)` actualiza los puntos.
2. Usuario cambia dificultad → `changeDifficulty(gameState, newDifficulty)` actualiza la dificultad.
3. Usuario reinicia → `startGame(playerName, currentDifficulty, true)` reinicia puntos a 0 e inicia modo por tiempo.

### Gestión de tiempo (nuevo)
1. Al iniciar el juego → `startGame()` con `isTimeBased: true` establece el tiempo inicial.
2. Cada segundo → `tickTimer(gameState)` decrementa el tiempo restante.
3. Cuando tiempo ≤10 segundos → La velocidad de topos aumenta automáticamente.
4. Cuando tiempo ≤5 segundos → Se activa alerta visual (parpadeo rojo).
5. Cuando tiempo = 0 → `endGameByTime(gameState)` finaliza el juego y se muestra modal GAME OVER.

### Gestión de dificultades
1. `listDifficulties()` proporciona opciones para el selector.
2. `resolveDifficulty(selectedId)` convierte la selección a objeto `Difficulty`.

---

## Principios de diseño

### Inmutabilidad
Todos los use cases retornan nuevos objetos en lugar de modificar los existentes. Esto garantiza:
- Predictibilidad del código.
- Facilidad para debugging.
- Prevención de efectos secundarios inesperados.

### Funciones puras
Los use cases no tienen efectos secundarios:
- No modifican variables globales.
- No realizan llamadas a APIs.
- No dependen de estado externo mutable.

### Separación de responsabilidades
- **Use cases**: Solo lógica de negocio.
- **Presentación**: Orquesta los use cases y maneja la UI.
- **Infraestructura**: Persistencia y servicios externos.

### Testabilidad
Cada use case tiene su archivo de tests (`.spec.ts`) con casos parametrizados que cubren:
- Casos normales.
- Casos límite.
- Validación de inmutabilidad.
- Verificación de resultados esperados.
