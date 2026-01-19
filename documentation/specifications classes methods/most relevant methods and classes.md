# Especificaciones de Clases y Métodos - Métodos y Clases Más Relevantes

## Objetivo

Este documento describe la funcionalidad y propósito de los métodos y clases más relevantes de la aplicación "Touch the Mole", enfocándose en componentes de presentación, adaptadores de infraestructura y puertos que no están cubiertos en la documentación de use cases.

## Ubicación

- **Componentes de Páginas**: `src/app/presentation/pages/`
- **Componentes Presentacionales**: `src/app/presentation/components/`
- **Adaptadores de Infraestructura**: `src/app/infrastructure/adapters/`
- **Puertos**: `src/app/core/ports/`

---

## Componentes de Páginas

### 1. `HomePageComponent`

**Ubicación**: `src/app/presentation/pages/home/home.ts`

**Propósito**: Componente de página inicial que permite al usuario ingresar su nombre y comenzar una nueva partida.

#### Propiedades Públicas

##### `nameControl: FormControl<string>`

Control de formulario reactivo para el nombre del jugador.

**Configuración**:
- `nonNullable: true` - El valor nunca puede ser `null` o `undefined`
- Validadores:
  - `Validators.required` - El campo es obligatorio
  - Validador personalizado que rechaza strings que solo contienen espacios en blanco

**Ejemplo de uso**:
```typescript
component.nameControl.setValue('Jugador1');
const isValid = component.nameControl.valid; // true o false
```

#### Métodos Públicos

##### `start(): void`

**Propósito**: Inicia una nueva partida con el nombre ingresado por el usuario.

**Lógica**:
1. Valida que el formulario sea válido (`nameControl.invalid`)
2. Si es inválido, retorna sin hacer nada
3. Crea un nuevo estado de juego usando `startGame()` con el nombre y dificultad por defecto
4. Guarda el estado en el repositorio usando `repository.save()`
5. Navega a la ruta `/game` usando `router.navigate()`

**Validaciones**:
- El formulario debe ser válido antes de ejecutar
- El nombre se sanitiza automáticamente en `startGame()` (trim, límite de longitud)

**Ejemplo de uso**:
```typescript
component.nameControl.setValue('Mi Jugador');
component.start();
// Navega a /game y guarda el estado inicial
```

**Dónde se usa**:
- Template `home.html`: Botón "Start" con `(click)="start()"`

**Características**:
- **Validación**: Solo ejecuta si el formulario es válido
- **Navegación**: Redirige automáticamente a la página de juego
- **Persistencia**: Guarda el estado antes de navegar

---

### 2. `GamePageComponent`

**Ubicación**: `src/app/presentation/pages/game/game.ts`

**Propósito**: Componente principal del juego que gestiona el estado de la partida, el movimiento del topo, la puntuación y las interacciones del usuario.

**Implementa**: `OnDestroy` - Para limpieza de recursos al destruir el componente.

#### Propiedades Públicas

##### `gameState: WritableSignal<GameState>`

Signal reactivo que contiene el estado completo del juego (nombre del jugador, puntos, dificultad, tiempo restante, duración, modo por tiempo).

**Inicialización**: Se carga desde el repositorio o se crea un estado por defecto si no existe.

**Ejemplo de uso**:
```typescript
const currentState = component.gameState();
component.gameState.set(newState);
```

##### `handleHit: (holeIndex: number) => void`

Función que maneja los golpes exitosos al topo. Se inicializa en el constructor mediante `initializeHandleHit()`.

**Parámetros**:
- `holeIndex: number` - Índice del agujero donde se golpeó el topo

**Comportamiento**: Aplica puntos, actualiza estado, elimina el topo golpeado del array de topos activos y programa el siguiente movimiento solo si no quedan topos activos.

##### `isGameStarted: Signal<boolean>`

Signal que indica si el juego está actualmente iniciado.

**Valores**:
- `false`: Juego no iniciado (pantalla inicial)
- `true`: Juego en curso (tablero visible)

##### `activeMoleIndexes: Signal<number[]>`

Signal que contiene un array con los índices de los agujeros donde están los topos activos. Puede contener 0, 1 o 2 índices simultáneamente.

**Valores**:
- `[]`: No hay topos visibles
- `[number]`: Un solo topo visible en el índice especificado (0-8)
- `[number, number]`: Dos topos visibles simultáneamente en los índices especificados (cada 5 topos que aparecen)

**Comportamiento especial**: Cada 5 topos que aparecen (`moleCounter % 5 === 0`), se muestran 2 topos simultáneamente en lugar de 1.

##### `gameConfig: typeof GAME_CONFIG`

Referencia a la configuración global del juego (`GAME_CONFIG`). Se expone públicamente para uso en templates.

**Uso**: Permite acceder a valores de configuración como `lowTimeThreshold` en el template HTML.

##### `showGameOver: Signal<boolean>`

Signal que controla la visibilidad del modal GAME OVER.

**Valores**:
- `false`: Modal oculto
- `true`: Modal visible

**Uso**: Se establece en `true` cuando el tiempo llega a 0 para mostrar el modal de finalización.

##### `finalScore: Signal<number>`

Signal que almacena la puntuación final cuando el juego termina por tiempo.

**Uso**: Se establece con la puntuación final antes de mostrar el modal GAME OVER.

##### `difficulties: readonly Difficulty[]`

Array de solo lectura con todas las dificultades disponibles del juego.

**Uso**: Se usa para poblar el selector de dificultad en el template.

##### `holes: readonly number[]`

Array de índices de agujeros (0 a 8) generado según `GAME_CONFIG.totalHoles`.

**Uso**: Se pasa al componente `GameBoardComponent` para renderizar los botones.

#### Métodos Públicos

##### `onDifficultyChange(event: Event): void`

**Propósito**: Cambia la dificultad del juego durante una partida en curso.

**Parámetros**:
- `event: Event` - Evento del selector HTML (`<select>`)

**Lógica**:
1. Extrae el valor del elemento `<select>` (`event.target.value`)
2. Si el target es `null`, usa la primera dificultad por defecto
3. Resuelve el ID de dificultad a un objeto `Difficulty` usando `resolveDifficulty()`
4. Actualiza el estado del juego con la nueva dificultad usando `changeDifficulty()`
5. Si el juego está iniciado, el efecto `initializeDifficultyEffect()` reinicia automáticamente el movimiento del topo con el nuevo intervalo

**Efectos secundarios**:
- Actualiza el estado del juego
- Guarda el estado en el repositorio
- Reinicia el movimiento del topo si el juego está activo (debido al effect)

**Ejemplo de uso**:
```typescript
const event = {
  target: { value: 'high' }
} as unknown as Event;
component.onDifficultyChange(event);
// Cambia la dificultad y reinicia el movimiento del topo
```

**Dónde se usa**:
- Template `game.html`: Selector de dificultad con `(change)="onDifficultyChange($event)"`

**Características**:
- **Resiliente**: Maneja casos donde `event.target` es `null`
- **Reactivo**: El cambio de dificultad reinicia automáticamente el movimiento
- **Persistente**: Guarda el estado actualizado

---

##### `onRestart(): void`

**Propósito**: Reinicia la partida actual, reseteando los puntos a 0 pero manteniendo el nombre del jugador y la dificultad actual. Inicia el juego en modo por tiempo.

**Lógica**:
1. Obtiene el estado actual del juego
2. Crea un nuevo estado con `startGame()` usando el nombre actual, la dificultad actual y `isTimeBased: true`
3. Actualiza el estado del juego (puntos reseteados a 0, tiempo inicializado)
4. Establece `isGameStarted` a `true`
5. Resetea `activeMoleIndexes` a un array vacío
6. Resetea `moleCounter` a 0
7. Inicia el movimiento del topo llamando a `startMoleMovement()`
8. Si el juego es por tiempo (`isTimeBased`), inicia el timer llamando a `startTimer()`

**Efectos secundarios**:
- Resetea los puntos a 0
- Inicializa el tiempo del juego (30 segundos por defecto)
- Inicia el cronómetro que decrementa cada segundo
- Inicia inmediatamente el movimiento del topo
- No guarda el estado en el repositorio durante el juego por tiempo (solo al finalizar)

**Ejemplo de uso**:
```typescript
component.onRestart();
// Puntos reseteados a 0, movimiento del topo iniciado
```

**Dónde se usa**:
- Template `game.html`: Botón "Reiniciar" con `(click)="onRestart()"`

**Características**:
- **Preserva datos**: Mantiene el nombre del jugador y la dificultad
- **Inmediato**: Inicia el movimiento del topo inmediatamente después de reiniciar
- **Persistente**: Guarda el estado reiniciado

---

##### `onChangePlayer(): void`

**Propósito**: Permite al usuario cambiar de jugador, limpiando el estado guardado y regresando a la página de inicio.

**Lógica**:
1. Detiene el movimiento del topo llamando a `stopMoleMovement()`
2. Detiene el timer llamando a `stopTimer()`
3. Limpia el repositorio usando `repository.clear()`
4. Navega a la ruta `/home` usando `router.navigate()`

**Efectos secundarios**:
- Detiene todos los timers e intervalos del movimiento del topo
- Detiene el cronómetro del juego
- Elimina el estado guardado del localStorage
- Navega a la página de inicio

##### `onCloseGameOver(): void`

**Propósito**: Cierra el modal GAME OVER cuando el usuario hace clic en el botón de cerrar o en el overlay.

**Lógica**:
1. Establece `showGameOver` a `false`

**Efectos secundarios**:
- Oculta el modal GAME OVER

**Ejemplo de uso**:
```typescript
component.onChangePlayer();
// Detiene el juego, limpia el estado y navega a /home
```

**Dónde se usa**:
- Template `game.html`: Botón "Salir" o "Cambiar jugador" con `(click)="onChangePlayer()"`

**Características**:
- **Limpieza completa**: Detiene todos los procesos activos
- **Persistencia**: Limpia el estado guardado
- **Navegación**: Redirige a la página de inicio

---

##### `ngOnDestroy(): void`

**Propósito**: Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye. Limpia recursos para prevenir memory leaks.

**Lógica**:
1. Llama a `stopMoleMovement()` para detener todos los timers e intervalos del movimiento del topo
2. Llama a `stopTimer()` para detener el cronómetro del juego

**Cuándo se ejecuta**:
- Cuando el usuario navega fuera de la página de juego
- Cuando el componente se destruye por cualquier razón

**Importancia**: Crítico para prevenir memory leaks, ya que detiene intervalos y timeouts que de otra manera continuarían ejecutándose.

**Ejemplo de uso**:
```typescript
// Se ejecuta automáticamente cuando el componente se destruye
// No requiere llamada manual
```

**Características**:
- **Automático**: Se ejecuta automáticamente por Angular
- **Limpieza**: Previene memory leaks
- **Completo**: Detiene todos los procesos activos

---

#### Propiedades Privadas (Relevantes para Entender el Flujo)

##### `moleCounter: number`

Contador que rastrea cuántos topos han aparecido desde el inicio o reinicio del juego.

**Propósito**: Determinar cuándo mostrar 2 topos simultáneamente (cada 5 topos).

**Comportamiento**:
- Se incrementa cada vez que aparece un topo (en `moveMole()`)
- Se resetea a 0 cuando se reinicia el juego (`onRestart()`) o se detiene (`stopMoleMovement()`)
- Se inicializa a 0 en el constructor

**Lógica especial**: Cuando `moleCounter % 5 === 0`, se muestran 2 topos simultáneamente en lugar de 1.

**Ejemplo**:
- Topos 1-4: `moleCounter` = 1, 2, 3, 4 → Muestra 1 topo
- Topo 5: `moleCounter` = 5 → Muestra 2 topos (5 % 5 === 0)
- Topos 6-9: `moleCounter` = 6, 7, 8, 9 → Muestra 1 topo
- Topo 10: `moleCounter` = 10 → Muestra 2 topos (10 % 5 === 0)

---

#### Métodos Privados (Relevantes para Entender el Flujo)

##### `startMoleMovement(): void`

**Propósito**: Inicia el movimiento automático del topo según la dificultad actual.

**Lógica**:
1. Detiene cualquier movimiento previo llamando a `stopMoleMovement()`
2. Mueve el topo inmediatamente llamando a `moveMole()`
3. Calcula el intervalo según la dificultad actual (`gameState().difficulty.intervalMs`)
4. Configura un `setInterval` que llama a `moveMole()` periódicamente según el intervalo

**Efectos secundarios**:
- Inicia un intervalo que se ejecuta periódicamente
- Mueve el topo inmediatamente y luego periódicamente

**Cuándo se llama**:
- Al iniciar el juego (`onRestart()`)
- Cuando cambia la dificultad y el juego está activo (mediante effect)

**Características**:
- **Automático**: El movimiento continúa automáticamente
- **Configurable**: El intervalo depende de la dificultad
- **Limpio**: Siempre detiene movimiento previo antes de iniciar uno nuevo

---

##### `stopMoleMovement(): void`

**Propósito**: Detiene completamente el movimiento del topo, limpiando todos los timers e intervalos.

**Lógica**:
1. Si existe `moleInterval`, lo cancela con `clearInterval()` y lo establece a `null`
2. Si existe `moleTimeout`, lo cancela con `clearTimeout()` y lo establece a `null`
3. Resetea `activeMoleIndexes` a un array vacío
4. Resetea `moleCounter` a 0

**Efectos secundarios**:
- Detiene todos los procesos de movimiento
- El topo desaparece inmediatamente

**Cuándo se llama**:
- Al cambiar de jugador (`onChangePlayer()`)
- Al destruir el componente (`ngOnDestroy()`)
- Antes de iniciar un nuevo movimiento (`startMoleMovement()`)

**Características**:
- **Completo**: Limpia todos los timers e intervalos
- **Seguro**: Maneja casos donde los timers pueden ser `null`
- **Inmediato**: El topo desaparece inmediatamente

---

##### `moveMole(): void`

**Propósito**: Mueve el topo (o topos) a agujeros aleatorios y programa su desaparición después de un tiempo determinado. Cada 5 topos que aparecen, muestra 2 topos simultáneamente.

**Lógica**:
1. Incrementa el contador `moleCounter`
2. Determina cuántos topos mostrar:
   - Si `moleCounter % 5 === 0`: Muestra 2 topos simultáneamente usando `getTwoRandomIndexes()`
   - En otros casos: Muestra 1 topo usando `getRandomIndex()`
3. Establece `activeMoleIndexes` con los índices seleccionados (los topos aparecen)
4. Si existe un `moleTimeout` previo, lo cancela
5. Calcula el tiempo de visibilidad según la dificultad:
   - Usa `Math.max(GAME_CONFIG.minVisibilityMs, interval)` para asegurar un tiempo mínimo
6. Configura un `setTimeout` que oculta los topos después del tiempo de visibilidad
7. En el timeout, verifica que los topos aún estén en los mismos índices antes de ocultarlos usando `arraysEqual()`

**Efectos secundarios**:
- El topo (o topos) aparece en agujeros aleatorios
- Los topos desaparecen automáticamente después del tiempo de visibilidad

**Cuándo se llama**:
- Al iniciar el movimiento (`startMoleMovement()`)
- Periódicamente según el intervalo de la dificultad
- Después de un golpe exitoso cuando no quedan topos activos (con delay)

**Características**:
- **Aleatorio**: Selecciona agujeros aleatorios cada vez
- **Múltiple**: Puede mostrar 1 o 2 topos simultáneamente
- **Patrón especial**: Cada 5 topos, muestra 2 simultáneamente
- **Temporal**: Los topos desaparecen automáticamente
- **Configurable**: El tiempo de visibilidad depende de la dificultad
- **Seguro**: Verifica que los topos aún estén en los mismos índices antes de ocultarlos

---

##### `getRandomIndex(): number`

**Propósito**: Genera un índice aleatorio para un agujero.

**Retorno**: Número aleatorio entre 0 y `holes.length - 1`.

**Lógica**:
1. Genera un número aleatorio entre 0 y la longitud del array de agujeros
2. Retorna el índice redondeado hacia abajo

**Uso**: Se usa internamente por `moveMole()` y `getTwoRandomIndexes()`.

**Características**:
- **Aleatorio**: Cada llamada puede retornar un valor diferente
- **Rango válido**: Siempre retorna un índice válido dentro del array de agujeros

---

##### `getTwoRandomIndexes(): number[]`

**Propósito**: Genera dos índices aleatorios diferentes para mostrar dos topos simultáneamente.

**Retorno**: Array con dos números diferentes, cada uno entre 0 y `holes.length - 1`.

**Lógica**:
1. Genera el primer índice aleatorio usando `getRandomIndex()`
2. Genera el segundo índice aleatorio
3. Si el segundo índice coincide con el primero, genera uno nuevo hasta que sean diferentes
4. Retorna un array con ambos índices

**Uso**: Se usa por `moveMole()` cuando `moleCounter % 5 === 0` para mostrar 2 topos simultáneamente.

**Características**:
- **Únicos**: Garantiza que los dos índices sean diferentes
- **Aleatorios**: Cada llamada puede retornar valores diferentes
- **Rango válido**: Siempre retorna índices válidos dentro del array de agujeros

---

##### `arraysEqual(arr1: number[], arr2: number[]): boolean`

**Propósito**: Compara dos arrays de números para verificar si contienen los mismos valores (sin importar el orden).

**Parámetros**:
- `arr1: number[]` - Primer array a comparar
- `arr2: number[]` - Segundo array a comparar

**Retorno**: `true` si los arrays contienen los mismos valores, `false` en caso contrario.

**Lógica**:
1. Compara las longitudes de los arrays
2. Si son diferentes, retorna `false`
3. Ordena ambos arrays
4. Compara elemento por elemento
5. Retorna `true` solo si todos los elementos coinciden

**Uso**: Se usa por `moveMole()` en el timeout para verificar que los topos aún estén en los mismos índices antes de ocultarlos.

**Características**:
- **Orden independiente**: No importa el orden de los elementos
- **Eficiente**: Ordena antes de comparar para manejar cualquier orden
- **Precisa**: Compara elemento por elemento

---

##### `initializeHandleHit(): (holeIndex: number) => void`

**Propósito**: Crea y retorna la función que maneja los golpes exitosos al topo.

**Retorno**: Función que acepta `holeIndex: number` como parámetro y maneja el golpe.

**Lógica de la función retornada**:
1. Obtiene los índices de topos activos actuales (`activeMoleIndexes()`)
2. Verifica que el índice golpeado esté en el array de topos activos (`currentIndexes.includes(holeIndex)`)
3. Si el golpe es válido:
   - Aplica el golpe usando `applyHit()` para sumar puntos y tiempo bonus (si es modo por tiempo)
   - Actualiza el estado del juego
   - Elimina el topo golpeado del array usando `filter()` (los otros topos permanecen activos)
   - Actualiza `activeMoleIndexes` con los topos restantes
   - Si no quedan topos activos (`remainingIndexes.length === 0`):
     - Cancela el timeout de desaparición automática si existe
     - Programa un nuevo movimiento después de `GAME_CONFIG.hitDelayMs` (500ms)
   - Si aún quedan topos activos, no programa nuevo movimiento (espera a que desaparezcan o sean golpeados)

**Parámetros de la función retornada**:
- `holeIndex: number` - Índice del agujero donde se golpeó el topo

**Ejemplo de uso**:
```typescript
const handleHit = component.handleHit;
handleHit(5); // Aplica el golpe al topo en el agujero 5 y lo elimina del array
```

**Dónde se usa**:
- Se pasa al componente `GameBoardComponent` como input `onHit`
- Se ejecuta cuando el usuario golpea un topo activo
- El `GameBoardComponent` pasa el `holeIndex` como parámetro

**Características**:
- **Validación**: Solo ejecuta si el índice golpeado está en los topos activos
- **Múltiples topos**: Maneja correctamente cuando hay 2 topos simultáneos
- **Selectivo**: Solo elimina el topo golpeado, los demás permanecen
- **Delay condicional**: Solo programa nuevo movimiento si no quedan topos activos
- **Inmutable**: Usa use cases para actualizar el estado

---

##### `initializeDifficultyEffect(): void`

**Propósito**: Configura un effect de Angular que reinicia el movimiento del topo cuando cambia la dificultad.

**Lógica**:
1. Crea un `effect()` que observa cambios en `gameState().difficulty`
2. Cuando la dificultad cambia:
   - Si el juego está iniciado (`isGameStarted()` es `true`), reinicia el movimiento llamando a `startMoleMovement()`

**Efectos secundarios**:
- El movimiento del topo se reinicia automáticamente cuando cambia la dificultad
- El nuevo intervalo se aplica inmediatamente

**Cuándo se ejecuta**:
- Automáticamente cuando `gameState().difficulty` cambia
- Solo si el juego está iniciado

**Características**:
- **Reactivo**: Responde automáticamente a cambios en la dificultad
- **Condicional**: Solo actúa si el juego está iniciado
- **Automático**: No requiere intervención manual

---

##### `updateState(state: GameState): void`

**Propósito**: Actualiza el estado del juego y lo persiste en el repositorio.

**Parámetros**:
- `state: GameState` - Nuevo estado del juego a establecer

**Lógica**:
1. Actualiza el signal `gameState` con el nuevo estado
2. Guarda el estado en el repositorio usando `repository.save()`

**Efectos secundarios**:
- El estado reactivo se actualiza (dispara cambios en el template)
- El estado se persiste en localStorage

**Cuándo se llama**:
- Después de aplicar un golpe (`initializeHandleHit()`)
- Al cambiar la dificultad (`onDifficultyChange()`)
- Al reiniciar el juego (`onRestart()`)

**Características**:
- **Reactivo**: Actualiza el signal que dispara cambios en la UI
- **Persistente**: Guarda automáticamente en el repositorio (solo si no es modo por tiempo)
- **Centralizado**: Único punto de actualización del estado
- **Condicional**: No guarda en el repositorio durante juegos por tiempo (solo al finalizar)

---

##### `startTimer(): void`

**Propósito**: Inicia el cronómetro del juego que decrementa el tiempo restante cada segundo.

**Lógica**:
1. Detiene cualquier timer existente llamando a `stopTimer()`
2. Crea un `setInterval` que se ejecuta cada 1000ms (1 segundo)
3. En cada iteración:
   - Obtiene el estado actual del juego
   - Verifica que el juego esté en modo por tiempo y tenga tiempo restante
   - Llama a `tickTimer()` para decrementar el tiempo
   - Actualiza el estado con el nuevo tiempo
   - Si el tiempo llega a 0, llama a `finishGameByTime()`

**Efectos secundarios**:
- Inicia un intervalo que se ejecuta cada segundo
- Actualiza el estado del juego con el tiempo decrementado
- Finaliza el juego automáticamente cuando el tiempo llega a 0

**Cuándo se llama**:
- Al iniciar el juego (`onRestart()`) si el juego es por tiempo

**Características**:
- **Automático**: Se ejecuta continuamente hasta que el tiempo llega a 0
- **Seguro**: Valida condiciones antes de decrementar el tiempo
- **Reactivo**: Actualiza el estado que dispara cambios visuales en el template

---

##### `stopTimer(): void`

**Propósito**: Detiene el cronómetro del juego limpiando el intervalo activo.

**Lógica**:
1. Si existe `timerInterval`, lo cancela con `clearInterval()`
2. Establece `timerInterval` a `null`

**Efectos secundarios**:
- Detiene el decremento automático del tiempo
- Limpia el intervalo activo

**Cuándo se llama**:
- Al cambiar de jugador (`onChangePlayer()`)
- Al finalizar el juego por tiempo (`finishGameByTime()`)
- Al destruir el componente (`ngOnDestroy()`)

**Características**:
- **Limpio**: Previene memory leaks cancelando intervalos
- **Seguro**: Maneja casos donde el intervalo no existe

---

##### `finishGameByTime(): void`

**Propósito**: Finaliza el juego cuando el tiempo llega a 0, deteniendo todos los procesos y mostrando el modal GAME OVER.

**Lógica**:
1. Detiene el movimiento del topo llamando a `stopMoleMovement()`
2. Detiene el timer llamando a `stopTimer()`
3. Llama a `endGameByTime()` para establecer el tiempo en 0
4. Actualiza el estado final del juego
5. Establece `isGameStarted` a `false`
6. Guarda la puntuación final en `finalScore`
7. Muestra el modal GAME OVER estableciendo `showGameOver` a `true`

**Efectos secundarios**:
- Detiene todos los procesos del juego
- Oculta el tablero de juego
- Muestra el modal con la puntuación final

**Cuándo se llama**:
- Automáticamente cuando `tickTimer()` detecta que el tiempo llegó a 0

**Características**:
- **Completo**: Detiene todos los procesos activos
- **Visual**: Muestra feedback al usuario con el modal
- **Preserva puntuación**: Mantiene la puntuación final para mostrarla

---

##### `calculateMoleInterval(baseInterval: number, timeRemaining?: number): number`

**Propósito**: Calcula el intervalo de aparición de topos ajustándolo según el tiempo restante. Cuando queda poco tiempo, aumenta la velocidad.

**Parámetros**:
- `baseInterval: number` - Intervalo base según la dificultad (en milisegundos)
- `timeRemaining?: number` - Tiempo restante del juego (opcional)

**Retorno**: Intervalo ajustado en milisegundos.

**Lógica**:
1. Si no hay tiempo restante o es mayor que `GAME_CONFIG.speedIncreaseThreshold` (10 segundos), retorna el intervalo base
2. Si el tiempo restante es ≤10 segundos, aplica `GAME_CONFIG.fastIntervalMultiplier` (0.625) al intervalo base
3. Retorna el intervalo ajustado redondeado hacia abajo

**Ejemplo de uso**:
```typescript
const baseInterval = 1000; // 1 segundo (dificultad baja)
const timeRemaining = 8;  // 8 segundos restantes

const adjustedInterval = component.calculateMoleInterval(baseInterval, timeRemaining);
// Retorna: 625ms (1000 * 0.625)
```

**Dónde se usa**:
- En `startMoleMovement()` para establecer el intervalo inicial
- En `moveMole()` para calcular el tiempo de visibilidad
- En `scheduleNextMoleInterval()` para ajustar dinámicamente el intervalo

**Características**:
- **Dinámico**: Ajusta la velocidad según el tiempo restante
- **Configurable**: Usa valores de `GAME_CONFIG` para los umbrales
- **Progresivo**: Aumenta la dificultad cuando queda poco tiempo

---

## Componentes Presentacionales

### 3. `GameBoardComponent`

**Ubicación**: `src/app/presentation/components/game-board/game-board.ts`

**Propósito**: Componente que renderiza el tablero de juego con todos los agujeros y maneja la interacción cuando el usuario hace clic en un agujero.

#### Propiedades Públicas (Inputs)

##### `holes: InputSignal<readonly number[]>`

Array de índices de agujeros a renderizar. Cada índice representa un agujero en el tablero.

**Ejemplo**: `[0, 1, 2, 3, 4, 5, 6, 7, 8]` para un tablero de 9 agujeros.

##### `onHit: InputSignal<((holeIndex: number) => void) | undefined>`

Callback opcional que se ejecuta cuando el usuario golpea un topo activo.

**Parámetros**: Acepta `holeIndex: number` como parámetro.

**Comportamiento**: Solo se ejecuta si el agujero clickeado tiene un topo activo.

##### `activeMoleIndexes: InputSignal<number[]>`

Array con los índices de los agujeros donde están los topos activos. Puede contener 0, 1 o 2 índices simultáneamente.

**Valores**:
- `[]`: No hay topos visibles
- `[number]`: Un solo topo visible
- `[number, number]`: Dos topos visibles simultáneamente (cada 5 topos)

**Uso**: Se pasa a cada `MoleButtonComponent` para indicar si está activo verificando si su índice está en el array.

#### Métodos Públicos

##### `handleHit(holeIndex: number): void`

**Propósito**: Maneja el clic del usuario en un agujero específico.

**Parámetros**:
- `holeIndex: number` - Índice del agujero donde el usuario hizo clic

**Lógica**:
1. Obtiene el array de índices de topos activos (`activeMoleIndexes()`)
2. Verifica si el agujero clickeado tiene un topo activo (`activeIndexes.includes(holeIndex)`)
3. Si el índice está en el array, ejecuta el callback `onHit()` pasando el `holeIndex` como parámetro

**Validación**:
- Solo ejecuta `onHit()` si el agujero clickeado tiene un topo activo (está en el array)
- No hace nada si el usuario hace clic en un agujero sin topo
- Maneja correctamente cuando hay múltiples topos activos simultáneamente

**Ejemplo de uso**:
```typescript
component.handleHit(5);
// Si el topo está en el agujero 5, ejecuta onHit()
// Si no, no hace nada
```

**Dónde se usa**:
- Template `game-board.html`: Cada `MoleButtonComponent` llama a `handleHit(hole)` cuando se hace clic
- El template verifica `activeMoleIndexes().includes(hole)` para determinar si el botón está activo

**Características**:
- **Validación**: Solo ejecuta si el golpe es válido (el índice está en el array)
- **Múltiples topos**: Maneja correctamente cuando hay 2 topos simultáneos
- **Delegación**: Delega la lógica al callback `onHit` pasando el `holeIndex`
- **Seguro**: Maneja casos donde `onHit` puede ser `undefined`

---

### 4. `MoleButtonComponent`

**Ubicación**: `src/app/presentation/components/mole-button/mole-button.ts`

**Propósito**: Componente que representa un botón individual del topo. Muestra visualmente el topo cuando está activo y maneja la interacción del usuario.

#### Propiedades Públicas

##### `isActive: InputSignal<boolean>`

Indica si este botón tiene el topo activo.

**Uso**: Controla la visualización del topo y los estilos CSS aplicados.

##### `hit: OutputEmitterRef<void>`

Evento que se emite cuando el usuario golpea exitosamente el topo.

**Uso**: Se conecta al componente padre para manejar el golpe.

##### `isHit: WritableSignal<boolean>`

Signal que indica si el topo acaba de ser golpeado (para efectos visuales).

**Comportamiento**: Se establece a `true` cuando se golpea y vuelve a `false` después de 200ms.

#### Métodos Públicos

##### `onHit(): void`

**Propósito**: Maneja el clic del usuario en el botón del topo.

**Lógica**:
1. Verifica que el topo esté activo (`isActive()` es `true`)
2. Si está activo:
   - Establece `isHit` a `true` (efecto visual de golpe)
   - Emite el evento `hit` para notificar al componente padre
   - Programa un timeout para resetear `isHit` a `false` después de 200ms

**Validación**:
- Solo ejecuta la lógica si `isActive()` es `true`
- No hace nada si el usuario hace clic cuando no hay topo

**Efectos visuales**:
- El botón muestra un efecto visual de "golpeado" durante 200ms
- Los estilos CSS cambian según `isHit`

**Ejemplo de uso**:
```typescript
component.isActive.set(true);
component.onHit();
// Emite el evento hit y muestra efecto visual
```

**Dónde se usa**:
- Template `mole-button.html`: Botón con `(click)="onHit()"`

**Características**:
- **Validación**: Solo ejecuta si el topo está activo
- **Visual**: Proporciona feedback visual al usuario
- **Event-driven**: Emite evento para comunicación con el padre

---

### 5. `ScoreBoardComponent`

**Ubicación**: `src/app/presentation/components/score-board/score-board.ts`

**Propósito**: Componente presentacional puro que muestra el nombre del jugador y la puntuación actual mediante iconos SVG y valores numéricos.

#### Propiedades Públicas (Inputs)

##### `playerName: InputSignal<string>`

Nombre del jugador a mostrar.

**Uso**: Se muestra en el template junto con un icono de usuario (`user-full.svg`).

##### `points: InputSignal<number>`

Puntuación actual del jugador.

**Uso**: Se muestra en el template junto con un icono de trofeo (`trophy-full.svg`).

#### Estructura Visual

El componente utiliza una estructura visual basada en iconos SVG:

- **Icono de Usuario**: `user-full.svg` - Representa visualmente al jugador
- **Icono de Trofeo**: `trophy-full.svg` - Representa visualmente los puntos
- **Estilos de Iconos**: 
  - Color blanco mediante `filter: brightness(0) invert(1)`
  - Forma circular con `border-radius: 50%`
  - Tamaño relativo al texto (`1.2em`)
  - Opacidad consistente con las etiquetas

#### Estructura HTML

El componente utiliza contenedores `score-board__box` para agrupar iconos y valores:

```html
<div class="score-board__box">
  <img src="icons/user-full.svg" alt="Usuario" class="score-board__icon" />
  <div class="score-board__stat">
    <strong>{{ playerName() }}</strong>
  </div>
</div>

<div class="score-board__box">
  <img src="icons/trophy-full.svg" alt="Puntos" class="score-board__icon" />
  <div class="score-board__stat">
    <strong>{{ points() }}</strong>
  </div>
</div>
```

#### Métodos Públicos

**Ninguno** - Este componente es puramente presentacional y no tiene métodos públicos.

**Características**:
- **Presentacional**: Solo muestra datos, no tiene lógica
- **Reactivo**: Se actualiza automáticamente cuando cambian los inputs
- **Reutilizable**: Puede usarse en cualquier parte donde se necesite mostrar puntuación
- **Visual**: Utiliza iconos SVG para mejorar la experiencia visual
- **Accesible**: Los iconos tienen `aria-hidden="true"` y `alt` descriptivo

---

## Adaptadores de Infraestructura

### 6. `LocalStorageGameStateAdapter`

**Ubicación**: `src/app/infrastructure/adapters/local-storage-game-state.adapter.ts`

**Propósito**: Implementación concreta del puerto `GameStateRepository` que persiste el estado del juego en el localStorage del navegador.

**Implementa**: `GameStateRepository`

#### Propiedades Privadas

##### `storageKey: string`

Clave utilizada para almacenar el estado en localStorage.

**Valor**: `'touch-the-mole:game-state'`

**Uso**: Identificador único para el estado del juego en localStorage.

#### Métodos Públicos

##### `load(): GameState | null`

**Propósito**: Carga el estado del juego desde localStorage.

**Retorno**:
- `GameState | null` - Estado del juego si existe y es válido, o `null` si no existe o es inválido

**Lógica**:
1. Intenta leer el valor de localStorage usando `storageKey`
2. Si no existe, retorna `null`
3. Intenta parsear el JSON
4. Valida la estructura del objeto parseado:
   - Debe tener `playerName` (string no vacío)
   - Debe tener `points` (número)
   - Debe tener `difficulty` (objeto)
5. Si la validación falla, retorna `null`
6. Si todo es válido, retorna el estado parseado

**Manejo de errores**:
- Retorna `null` si no hay datos guardados
- Retorna `null` si el JSON está corrupto (catch del try-catch)
- Retorna `null` si la estructura del objeto es inválida

**Ejemplo de uso**:
```typescript
const adapter = new LocalStorageGameStateAdapter();
const state = adapter.load();
if (state) {
  console.log(`Jugador: ${state.playerName}, Puntos: ${state.points}`);
} else {
  console.log('No hay estado guardado');
}
```

**Dónde se usa**:
- `GamePageComponent`: En el constructor para cargar el estado inicial

**Características**:
- **Resiliente**: Maneja errores de parsing y validación
- **Validación**: Verifica la estructura del objeto antes de retornarlo
- **Seguro**: Retorna `null` en lugar de lanzar excepciones

---

##### `save(state: GameState): void`

**Propósito**: Guarda el estado del juego en localStorage.

**Parámetros**:
- `state: GameState` - Estado del juego a guardar

**Lógica**:
1. Serializa el estado a JSON usando `JSON.stringify()`
2. Guarda el JSON en localStorage usando `storageKey`
3. Sobrescribe cualquier estado previo

**Efectos secundarios**:
- El estado anterior se sobrescribe completamente
- El estado queda persistido en el navegador del usuario

**Ejemplo de uso**:
```typescript
const adapter = new LocalStorageGameStateAdapter();
const state: GameState = {
  playerName: 'Jugador1',
  points: 100,
  difficulty: { id: 'medium', ... }
};
adapter.save(state);
// Estado guardado en localStorage
```

**Dónde se usa**:
- `HomePageComponent`: Al iniciar una nueva partida
- `GamePageComponent`: Después de cada actualización del estado (golpes, cambios de dificultad, reinicio)

**Características**:
- **Sincrónico**: La operación es inmediata (localStorage es síncrono)
- **Persistente**: El estado sobrevive a recargas de página
- **Sobrescribe**: Reemplaza el estado anterior

---

##### `clear(): void`

**Propósito**: Elimina el estado guardado del localStorage.

**Lógica**:
1. Remueve la clave `storageKey` de localStorage usando `localStorage.removeItem()`

**Efectos secundarios**:
- El estado guardado se elimina completamente
- La próxima llamada a `load()` retornará `null`

**Ejemplo de uso**:
```typescript
const adapter = new LocalStorageGameStateAdapter();
adapter.clear();
// Estado eliminado de localStorage
```

**Dónde se usa**:
- `GamePageComponent`: En `onChangePlayer()` para limpiar el estado al cambiar de jugador

**Características**:
- **Completo**: Elimina completamente el estado guardado
- **Seguro**: No lanza excepciones si la clave no existe
- **Inmediato**: La operación es inmediata

---

## Puertos e Interfaces

### 7. `GameStateRepository`

**Ubicación**: `src/app/core/ports/game-state-repository.port.ts`

**Propósito**: Interfaz (puerto) que define el contrato para la persistencia del estado del juego. Permite desacoplar la lógica de negocio de la implementación concreta de almacenamiento.

#### Métodos del Contrato

##### `load(): GameState | null`

**Propósito**: Contrato para cargar el estado del juego desde el almacenamiento.

**Retorno**: Estado del juego si existe, o `null` si no existe.

**Implementaciones**:
- `LocalStorageGameStateAdapter`: Carga desde localStorage

---

##### `save(state: GameState): void`

**Propósito**: Contrato para guardar el estado del juego en el almacenamiento.

**Parámetros**: Estado del juego a guardar.

**Implementaciones**:
- `LocalStorageGameStateAdapter`: Guarda en localStorage

---

##### `clear(): void`

**Propósito**: Contrato para eliminar el estado guardado.

**Implementaciones**:
- `LocalStorageGameStateAdapter`: Elimina de localStorage

---

#### Token de Inyección

**Ubicación**: `src/app/core/ports/game-state-repository.token.ts`

**Token**: `GAME_STATE_REPOSITORY`

**Uso**: Token de inyección de Angular (`InjectionToken`) que permite inyectar la implementación del repositorio.

**Configuración**: Se proporciona en `app.config.ts` con `LocalStorageGameStateAdapter` como implementación.

**Características**:
- **Desacoplamiento**: Permite cambiar la implementación sin modificar el código que la usa
- **Testeable**: Permite inyectar mocks en los tests
- **Flexible**: Facilita cambiar de localStorage a otra implementación (API, IndexedDB, etc.)

---

## Flujo de Interacción entre Componentes

### Flujo de Inicio de Partida

1. **Usuario ingresa nombre** en `HomePageComponent`
2. **Usuario hace clic en "Start"** → `HomePageComponent.start()`
3. **Se valida el formulario** → Si es válido, continúa
4. **Se crea estado inicial** → `startGame(nameControl.value, defaultDifficulty)`
5. **Se guarda el estado** → `repository.save(state)`
6. **Se navega a `/game`** → `router.navigate(['/game'])`
7. **`GamePageComponent` se inicializa** → Carga estado desde `repository.load()`
8. **Usuario hace clic en "Play"** → `onRestart()` inicia el juego
9. **Se inicia el movimiento del topo** → `startMoleMovement()`

### Flujo de Golpe al Topo

1. **Topo(s) aparece(n)** → `moveMole()` establece `activeMoleIndexes` (puede ser 1 o 2 topos)
2. **Usuario hace clic** → `MoleButtonComponent.onHit()`
3. **Se valida que esté activo** → Si `isActive()` es `true`, continúa
4. **Se emite evento** → `hit.emit()` notifica al padre
5. **`GameBoardComponent` recibe el evento** → `handleHit(holeIndex)`
6. **Se valida el golpe** → Si `activeMoleIndexes().includes(holeIndex)`, ejecuta `onHit(holeIndex)`
7. **Se aplica el golpe** → `applyHit(gameState)` suma puntos
8. **Se actualiza el estado** → `updateState(newState)`
9. **Se guarda el estado** → `repository.save(state)`
10. **Se elimina el topo golpeado** → Se filtra del array `activeMoleIndexes`
11. **Se programa siguiente movimiento** → Solo si no quedan topos activos, después de `hitDelayMs`

### Flujo de Cambio de Dificultad

1. **Usuario cambia dificultad** → `onDifficultyChange(event)`
2. **Se resuelve la dificultad** → `resolveDifficulty(selectedId)`
3. **Se actualiza el estado** → `changeDifficulty(gameState, newDifficulty)`
4. **Se guarda el estado** → `repository.save(state)`
5. **Effect detecta el cambio** → `initializeDifficultyEffect()` se ejecuta
6. **Se reinicia el movimiento** → `startMoleMovement()` con nuevo intervalo

---

## Principios de Diseño Aplicados

### Separación de Responsabilidades

- **Componentes de Páginas**: Orquestan la lógica y coordinan componentes hijos
- **Componentes Presentacionales**: Solo muestran datos y emiten eventos
- **Adaptadores**: Implementan la persistencia sin conocer la lógica de negocio
- **Puertos**: Definen contratos sin implementación

### Reactividad

- **Signals**: Uso extensivo de Signals de Angular para reactividad
- **Effects**: Effects para reaccionar automáticamente a cambios
- **Inputs/Outputs**: Comunicación entre componentes mediante inputs y outputs

### Inmutabilidad

- **Use Cases**: Los use cases retornan nuevos estados sin modificar los existentes
- **Signals**: Los signals se actualizan con nuevos valores, no se mutan

### Gestión de Recursos

- **OnDestroy**: Limpieza adecuada de timers e intervalos
- **Memory Leaks Prevention**: Todos los timers se limpian al destruir componentes

---

## Resumen

Este documento describe los métodos y clases más relevantes de la aplicación "Touch the Mole":

1. **Componentes de Páginas**: `HomePageComponent`, `GamePageComponent`
2. **Componentes Presentacionales**: `GameBoardComponent`, `MoleButtonComponent`, `ScoreBoardComponent`
3. **Adaptadores**: `LocalStorageGameStateAdapter`
4. **Puertos**: `GameStateRepository`

Cada método y clase está documentado con:
- Propósito y responsabilidad
- Parámetros y retornos
- Lógica de implementación
- Ejemplos de uso
- Dónde se usa en la aplicación
- Características y principios aplicados

Esta documentación complementa la documentación de use cases y proporciona una visión completa de la arquitectura y funcionamiento de la aplicación.
