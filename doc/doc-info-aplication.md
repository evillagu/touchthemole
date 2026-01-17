# Documentación de Casos de Uso de la Aplicación

Este documento describe la funcionalidad de los casos de uso (use cases) ubicados en la carpeta `src/app/application/use-cases/`.

## Estructura

Los casos de uso son funciones puras que encapsulan la lógica de negocio de la aplicación. Cada archivo representa un caso de uso específico relacionado con el juego "Toca el Topo".

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

**Configuración de i18n en `app.config.ts`:**

- **`registerLocaleData(localeEs)`**: Registra los datos de localización para español importados desde `@angular/common/locales/es`. Esto habilita el formato de fechas, números y monedas según las convenciones del idioma español.

- **`LOCALE_ID`**: Proveedor configurado con el valor `'es'` para establecer el locale español como predeterminado en toda la aplicación. Esto afecta a pipes como `DatePipe`, `CurrencyPipe` y `DecimalPipe`.

---

## Internacionalización (i18n)

El proyecto implementa internacionalización utilizando el sistema nativo de Angular i18n basado en el estándar XLIFF (XML Localization Interchange File Format). Esta implementación permite localizar todos los textos de la aplicación.

### Archivos de configuración de i18n

#### `src/locale/messages.es.xlf`

Archivo de traducciones en formato XLIFF 1.2 que contiene todas las cadenas de texto localizadas para el idioma español (es).

**Estructura:**
- Utiliza el formato estándar XLIFF 1.2 con elementos `<trans-unit>` para cada cadena traducible
- Cada `trans-unit` tiene un `id` único que identifica la cadena (ej: `@@app.title`, `@@home.playerName.label`)
- Contiene elementos `<source>` (texto original) y `<target>` (traducción)
- El atributo `datatype="html"` indica que las cadenas pueden contener HTML

**Cadenas incluidas:**
- Títulos y etiquetas de la aplicación
- Textos de botones
- Placeholders de formularios
- Etiquetas de componentes (jugador, puntos, dificultad)
- Nombres de dificultades (Bajo, Medio, Alto)
- Valores por defecto (nombre de jugador)

**Propósito:** Centraliza todas las traducciones en un único archivo, facilitando la gestión y actualización de textos localizados.

---

#### `angular.json`

Configuración de localización y polyfills en las opciones de build.

**Configuración de polyfills:**
- **`polyfills`**: Array que incluye:
  - `"zone.js"`: Polyfill para la detección de cambios de Angular
  - `"@angular/localize/init"`: Polyfill que proporciona la función global `$localize` en tiempo de ejecución. Este polyfill debe estar configurado aquí en lugar de importarse directamente en el código para evitar warnings del compilador.

**Configuración de localización:**
- **`production-es`**: Configuración de producción con localización habilitada:
  - `"localize": ["es"]`: Habilita la compilación localizada para español. Cuando se compila con esta configuración, Angular genera bundles específicos para el idioma español.

**Builder de extracción:**
- **`extract-i18n`**: Builder configurado para extraer cadenas marcadas con la directiva `i18n` de los templates HTML. Permite generar o actualizar archivos de traducción automáticamente.

**Propósito:** Configura el sistema de build para soportar localización, incluyendo el polyfill necesario para `$localize` y las opciones de compilación localizada.

---

#### `global.d.ts`

Archivo de declaración de tipos TypeScript que define la función global `$localize`.

**Contenido:**
```typescript
declare const $localize: {
  (messageParts: TemplateStringsArray, ...expressions: readonly unknown[]): string;
};
```

**Propósito:**
- Proporciona la declaración de tipos para `$localize` como función de tagged template
- Permite que TypeScript reconozca `$localize` como función global disponible en tiempo de compilación
- Resuelve errores de tipo `TS2304: Cannot find name '$localize'`
- El archivo está incluido explícitamente en `tsconfig.json` mediante `"files": ["global.d.ts"]` para garantizar su reconocimiento por el compilador

**Uso:** Esta declaración permite usar `$localize` en código TypeScript con soporte completo de tipos y autocompletado del IDE.

---

#### `package.json`

Gestiona la dependencia necesaria para i18n.

**Dependencia:**
- **`@angular/localize`**: Versión `^20.0.0`, compatible con Angular 20. Este paquete proporciona:
  - La función `$localize` en tiempo de ejecución
  - Utilidades para la localización
  - Soporte para el estándar XLIFF

**Propósito:** Asegura que el paquete necesario para la internacionalización esté disponible en la aplicación.

---

### Implementación de i18n en el código

#### Templates HTML

Los templates utilizan la directiva `i18n` para marcar cadenas de texto que requieren traducción.

**Sintaxis:**
- `i18n="@@id"`: Marca un elemento con un identificador único
- `i18n-placeholder="@@id"`: Marca el atributo `placeholder` de un input
- `i18n-title="@@id"`: Marca el atributo `title` de un elemento

**Ejemplos de uso:**
- `home.html`: Título de la aplicación, etiquetas de formulario, botones
- `game.html`: Etiquetas de dificultad y botones
- `score-board.html`: Etiquetas de jugador y puntos

**Archivos actualizados:**
- `src/app/presentation/pages/home/home.html`
- `src/app/presentation/pages/game/game.html`
- `src/app/presentation/components/score-board/score-board.html`

---

#### Código TypeScript

El código TypeScript utiliza la función global `$localize` con sintaxis de tagged template para literales en tiempo de ejecución.

**Sintaxis:**
```typescript
$localize`:@@id:Texto original`
```

**Archivos que utilizan `$localize`:**

1. **`difficulty.use-case.ts`**: Etiquetas de dificultades:
   - `$localize`:@@difficulty.low:Bajo``
   - `$localize`:@@difficulty.medium:Medio``
   - `$localize`:@@difficulty.high:Alto``

2. **`start-game.use-case.ts`**: Nombre de jugador por defecto:
   - `$localize`:@@game.defaultPlayerName:Jugador``

**Ventajas:**
- Permite localizar literales en código TypeScript, no solo en templates
- Mantiene la coherencia con el sistema de i18n de Angular
- Las cadenas se extraen automáticamente durante la compilación

---

### Flujo de trabajo de i18n

1. **Marcado de cadenas**: Los desarrolladores marcan cadenas en templates con `i18n` y en código con `$localize`
2. **Extracción**: El comando `ng extract-i18n` extrae todas las cadenas marcadas y genera/actualiza el archivo XLIFF
3. **Traducción**: Los traductores editan el archivo XLIFF añadiendo las traducciones en el elemento `<target>`
4. **Compilación**: Al compilar con `--configuration=production-es`, Angular genera bundles localizados
5. **Ejecución**: La aplicación carga las traducciones según el locale configurado

---

### Comandos relacionados con i18n

```bash
# Extraer cadenas de texto para traducción
ng extract-i18n

# Compilar para producción con localización
ng build --configuration=production-es

# Servir aplicación con localización
ng serve --configuration=production-es
```

---

## Características Comunes

Todos los casos de uso comparten las siguientes características:

- **Funciones puras**: No tienen efectos secundarios, siempre retornan el mismo resultado para las mismas entradas
- **Inmutabilidad**: No modifican directamente el estado, sino que crean nuevos objetos
- **Tipado estricto**: Utilizan los modelos de dominio (`Difficulty`, `GameState`) para garantizar la integridad de los datos
- **Separación de responsabilidades**: Cada caso de uso tiene una responsabilidad única y bien definida
