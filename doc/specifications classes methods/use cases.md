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
Inicializa un nuevo estado de juego con el nombre del jugador y la dificultad seleccionada. Valida y sanitiza el nombre del jugador según las reglas del juego.

#### Función
```typescript
export const startGame = (playerName: string, difficulty: Difficulty): GameState
```

#### Parámetros
- `playerName: string` - Nombre del jugador proporcionado por el usuario.
- `difficulty: Difficulty` - Dificultad inicial para la partida.

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

#### Ejemplo de uso
```typescript
const playerName = '  Mi Nombre Largo Que Será Truncado  ';
const difficulty = { id: 'medium', points: 20, intervalMs: 750, ... };

const gameState = startGame(playerName, difficulty);
// gameState.playerName = 'Mi Nombre Largo Que Ser' (truncado a 24 caracteres)
// gameState.points = 0
// gameState.difficulty = difficulty
```

#### Casos especiales
- **Nombre vacío**: Si el nombre es `''` o solo espacios, usa `'Jugador'` (nombre por defecto).
- **Nombre muy largo**: Si excede 24 caracteres, se trunca a 24 caracteres.
- **Nombre con espacios**: Los espacios al inicio y final se eliminan.

#### Dónde se usa
- `src/app/presentation/pages/home/home.ts`: En el método `start()` cuando el jugador inicia una nueva partida.
- `src/app/presentation/pages/game/game.ts`: En el constructor para inicializar el estado si no hay uno guardado, y en `onRestart()` para reiniciar la partida.

#### Características
- **Inmutable**: Crea un nuevo estado sin modificar parámetros.
- **Puro**: Siempre retorna el mismo resultado para las mismas entradas.
- **Validación**: Sanitiza y valida el nombre del jugador.
- **Configuración centralizada**: Usa `GAME_CONFIG` para límites y valores por defecto.

---

### 4. `difficulty.use-case.ts`

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
  minVisibilityMs: 800,        // Tiempo mínimo de visibilidad del topo (ms)
  hitDelayMs: 500,             // Delay después de golpear antes de mostrar siguiente topo (ms)
  totalHoles: 9,               // Número total de agujeros en el tablero (3x3)
  maxPlayerNameLength: 24,     // Longitud máxima del nombre del jugador
  defaultPlayerName: 'Jugador' // Nombre por defecto si el jugador no proporciona uno
} as const;
```

**Propósito**: Centraliza todos los parámetros configurables del juego en un solo lugar para facilitar el mantenimiento y la consistencia.

**Dónde se usa**:
- `start-game.use-case.ts`: Para validar la longitud del nombre y usar el nombre por defecto.
- `src/app/presentation/pages/game/game.ts`: Para configurar el número de agujeros, tiempos de visibilidad y delays.

#### Características
- **Inmutable**: Los arrays y objetos son de solo lectura (`readonly`).
- **Puro**: Las funciones siempre retornan el mismo resultado para las mismas entradas.
- **Configuración centralizada**: `GAME_CONFIG` permite modificar parámetros del juego en un solo lugar.
- **Resiliente**: `resolveDifficulty` maneja IDs inválidos retornando un valor por defecto seguro.
- **i18n**: Las etiquetas de dificultad usan `$localize` para soporte multiidioma.

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
3. Usuario reinicia → `startGame(playerName, currentDifficulty)` reinicia puntos a 0.

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
