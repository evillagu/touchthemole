# Reglas ES6 y configuracion del proyecto

## Objetivo

Aplicar reglas ES6 de forma consistente en todo el proyecto usando ESLint para mantener código limpio, legible y siguiendo mejores prácticas.

## Configuracion global

- Archivo de reglas: `eslint.config.js`.
- Alcance: todo el proyecto para `*.ts` y `*.html`.
- Script: `npm run lint`.
- Configuraciones base:
  - `eslint.configs.recommended`: reglas recomendadas de ESLint.
  - `tseslint.configs.recommended`: reglas recomendadas de TypeScript ESLint.
  - `tseslint.configs.stylistic`: reglas de estilo de TypeScript ESLint.
  - `angular.configs.tsRecommended`: reglas recomendadas de Angular para TypeScript.
  - `angular.configs.templateRecommended`: reglas recomendadas para templates HTML.
  - `angular.configs.templateAccessibility`: reglas de accesibilidad para templates HTML.

## Reglas personalizadas configuradas

### Reglas para archivos TypeScript (`src/**/*.ts`)

#### `max-lines-per-function`
- **Propósito**: Limita el número de líneas por función a 20 para mantener funciones pequeñas y manejables.
- **Configuración**: 
  - Máximo: 20 líneas
  - Ignora líneas en blanco
  - Ignora comentarios
  - Incluye IIFEs (Immediately Invoked Function Expressions)
- **Excepción**: Desactivada para archivos `*.spec.ts` (tests).

#### `@angular-eslint/directive-selector`
- **Propósito**: Enforce naming conventions para selectores de directivas Angular.
- **Configuración**:
  - Tipo: `attribute`
  - Prefijo: `app`
  - Estilo: `camelCase`
- **Ejemplo**: `[appMyDirective]` es válido, `[myDirective]` no.

#### `@angular-eslint/component-selector`
- **Propósito**: Enforce naming conventions para selectores de componentes Angular.
- **Configuración**:
  - Tipo: `element`
  - Prefijo: `app`
  - Estilo: `kebab-case`
- **Ejemplo**: `<app-my-component>` es válido, `<myComponent>` no.

## Reglas activas a través de configuraciones recomendadas

### Reglas de ESLint recomendadas (eslint.configs.recommended)

#### `no-unused-vars`
- **Propósito**: Detecta variables declaradas pero no utilizadas para mantener código limpio.

#### `no-undef`
- **Propósito**: Previene el uso de variables no definidas, evitando errores en tiempo de ejecución.

#### `no-console`
- **Propósito**: Desalienta el uso de `console.log` en código de producción (puede estar desactivada según configuración).

#### `no-debugger`
- **Propósito**: Previene el uso de `debugger` en código de producción.

#### `no-duplicate-case`
- **Propósito**: Evita casos duplicados en sentencias `switch`.

#### `no-empty`
- **Propósito**: Previene bloques vacíos que pueden indicar código incompleto o errores.

#### `no-extra-semi`
- **Propósito**: Elimina punto y coma innecesarios.

#### `no-func-assign`
- **Propósito**: Previene la reasignación de funciones declaradas.

#### `no-inner-declarations`
- **Propósito**: Evita declaraciones de funciones en bloques anidados.

#### `no-irregular-whitespace`
- **Propósito**: Detecta espacios en blanco irregulares que pueden causar problemas.

#### `no-redeclare`
- **Propósito**: Previene redeclaración de variables.

#### `no-sparse-arrays`
- **Propósito**: Evita arrays con elementos faltantes.

#### `no-unreachable`
- **Propósito**: Detecta código inalcanzable después de `return`, `throw`, etc.

#### `use-isnan`
- **Propósito**: Requiere usar `isNaN()` en lugar de comparaciones directas con `NaN`.

#### `valid-typeof`
- **Propósito**: Asegura que `typeof` se use con valores válidos.

### Reglas de TypeScript ESLint recomendadas (tseslint.configs.recommended)

#### `@typescript-eslint/no-explicit-any`
- **Propósito**: Prohíbe el uso explícito del tipo `any` para mantener tipado fuerte.

#### `@typescript-eslint/no-unused-vars`
- **Propósito**: Detecta variables TypeScript no utilizadas, mejorado para tipos.

#### `@typescript-eslint/no-non-null-assertion`
- **Propósito**: Desalienta el uso de `!` (non-null assertion) que puede ser peligroso.

#### `@typescript-eslint/explicit-function-return-type`
- **Propósito**: Puede requerir tipos de retorno explícitos (según configuración).

#### `@typescript-eslint/no-inferrable-types`
- **Propósito**: Evita anotaciones de tipo innecesarias cuando TypeScript puede inferirlas.

#### `@typescript-eslint/no-empty-function`
- **Propósito**: Previene funciones vacías que pueden indicar código incompleto.

#### `@typescript-eslint/no-misused-new`
- **Propósito**: Previene uso incorrecto de `new` con interfaces.

#### `@typescript-eslint/no-namespace`
- **Propósito**: Desalienta el uso de namespaces en favor de módulos ES6.

#### `@typescript-eslint/no-this-alias`
- **Propósito**: Evita alias de `this` que pueden causar confusión.

#### `@typescript-eslint/prefer-as-const`
- **Propósito**: Fomenta el uso de `as const` para inferencia de tipos literales.

### Reglas de estilo TypeScript ESLint (tseslint.configs.stylistic)

#### `@typescript-eslint/indent`
- **Propósito**: Enforce indentación consistente (generalmente 2 espacios).

#### `@typescript-eslint/quotes`
- **Propósito**: Enforce uso consistente de comillas simples o dobles.

#### `@typescript-eslint/semi`
- **Propósito**: Requiere o prohíbe punto y coma al final de las líneas.

#### `@typescript-eslint/comma-dangle`
- **Propósito**: Controla el uso de comas finales en objetos y arrays.

#### `@typescript-eslint/brace-style`
- **Propósito**: Enforce estilo de llaves (1tbs, stroustrup, allman).

#### `@typescript-eslint/comma-spacing`
- **Propósito**: Controla espacios alrededor de comas.

#### `@typescript-eslint/func-call-spacing`
- **Propósito**: Controla espacios en llamadas a funciones.

#### `@typescript-eslint/keyword-spacing`
- **Propósito**: Controla espacios alrededor de palabras clave.

#### `@typescript-eslint/object-curly-spacing`
- **Propósito**: Controla espacios dentro de llaves de objetos.

#### `@typescript-eslint/space-before-blocks`
- **Propósito**: Controla espacios antes de bloques.

#### `@typescript-eslint/space-before-function-paren`
- **Propósito**: Controla espacios antes de paréntesis de funciones.

#### `@typescript-eslint/space-infix-ops`
- **Propósito**: Controla espacios alrededor de operadores.

### Reglas de Angular TypeScript (angular.configs.tsRecommended)

#### `@angular-eslint/no-empty-lifecycle-method`
- **Propósito**: Detecta métodos de ciclo de vida vacíos que pueden eliminarse.

#### `@angular-eslint/no-host-metadata-property`
- **Propósito**: Detecta uso de `host` metadata en favor de `@HostListener` y `@HostBinding`.

#### `@angular-eslint/no-input-rename`
- **Propósito**: Previene renombrar inputs con alias confusos.

#### `@angular-eslint/no-output-rename`
- **Propósito**: Previene renombrar outputs con alias confusos.

#### `@angular-eslint/use-lifecycle-interface`
- **Propósito**: Requiere implementar interfaces de ciclo de vida explícitamente.

#### `@angular-eslint/use-pipe-transform-interface`
- **Propósito**: Requiere que pipes implementen `PipeTransform`.

#### `@angular-eslint/relative-url-prefix`
- **Propósito**: Enforce uso de prefijos relativos en URLs de templates.

#### `@angular-eslint/use-component-selector`
- **Propósito**: Requiere que componentes tengan selector definido.

#### `@angular-eslint/use-component-view-encapsulation`
- **Propósito**: Fomenta el uso explícito de `ViewEncapsulation`.

### Reglas de templates HTML (angular.configs.templateRecommended)

#### `@angular-eslint/template/alt-text`
- **Propósito**: Requiere texto alternativo en imágenes para accesibilidad.

#### `@angular-eslint/template/button-has-type`
- **Propósito**: Requiere que botones tengan atributo `type` explícito.

#### `@angular-eslint/template/click-events-have-key-events`
- **Propósito**: Requiere eventos de teclado para eventos de clic (accesibilidad).

#### `@angular-eslint/template/no-any`
- **Propósito**: Detecta uso de `any` en templates.

#### `@angular-eslint/template/no-call-expression`
- **Propósito**: Desalienta llamadas a funciones en templates (performance).

#### `@angular-eslint/template/no-duplicate-attributes`
- **Propósito**: Detecta atributos duplicados en elementos.

#### `@angular-eslint/template/no-interactive-element-without-role`
- **Propósito**: Requiere roles ARIA en elementos interactivos.

#### `@angular-eslint/template/no-positive-tabindex`
- **Propósito**: Previene `tabindex` positivos que rompen el orden de tabulación.

#### `@angular-eslint/template/table-scope`
- **Propósito**: Requiere atributo `scope` en celdas de encabezado de tabla.

#### `@angular-eslint/template/use-track-by-function`
- **Propósito**: Requiere función `trackBy` en `*ngFor` para mejor performance.

### Reglas de accesibilidad (angular.configs.templateAccessibility)

#### `@angular-eslint/template/accessibility-alt-text`
- **Propósito**: Enforce texto alternativo descriptivo en imágenes.

#### `@angular-eslint/template/accessibility-attributes`
- **Propósito**: Requiere atributos de accesibilidad apropiados.

#### `@angular-eslint/template/accessibility-elements-content`
- **Propósito**: Asegura que elementos de accesibilidad tengan contenido.

#### `@angular-eslint/template/accessibility-label-has-associated-control`
- **Propósito**: Requiere que labels estén asociados con controles.

#### `@angular-eslint/template/accessibility-valid-aria`
- **Propósito**: Valida que atributos ARIA sean válidos.

## Excepciones y configuraciones especiales

### Archivos de test (`**/*.spec.ts`)
- `max-lines-per-function`: **Desactivada** para permitir tests más largos y descriptivos.

### Templates HTML (`src/**/*.html`)
- Procesados con reglas de templates Angular.
- Incluye reglas de accesibilidad para cumplir con estándares WCAG.

## Prettier - Formateo de código

### Configuración

Prettier está configurado para formatear automáticamente el código y mantener consistencia en el estilo. La configuración se encuentra en `.prettierrc`.

#### Reglas de Prettier configuradas

- **`semi: true`**: Añade punto y coma al final de las líneas.
- **`trailingComma: "es5"`**: Añade comas finales donde sea válido en ES5 (objetos, arrays, etc.).
- **`singleQuote: true`**: Usa comillas simples en lugar de dobles.
- **`printWidth: 80`**: Línea máxima de 80 caracteres antes de hacer wrap.
- **`tabWidth: 2`**: Usa 2 espacios para indentación (consistente con EditorConfig).
- **`useTabs: false`**: Usa espacios en lugar de tabs.
- **`arrowParens: "always"`**: Siempre incluye paréntesis alrededor de parámetros de arrow functions.
- **`endOfLine: "lf"`**: Usa line feed (LF) para fin de línea (consistente en todos los sistemas).
- **`bracketSpacing: true`**: Añade espacios dentro de llaves de objetos `{ foo: bar }`.
- **`bracketSameLine: false`**: Coloca el `>` de elementos HTML en una nueva línea.

#### Integración con ESLint

Prettier está integrado con ESLint mediante `eslint-config-prettier`, que:
- Desactiva reglas de ESLint que entran en conflicto con Prettier.
- Evita conflictos entre el formateo de Prettier y las reglas de estilo de ESLint.
- Permite que Prettier maneje el formateo mientras ESLint se enfoca en la calidad del código.

#### Archivos ignorados

Los archivos excluidos del formateo se especifican en `.prettierignore`:
- `node_modules/`
- `dist/`, `.angular/`
- `coverage/`
- Archivos generados y de configuración del IDE

## Uso

### Comandos disponibles

#### Linting (ESLint)

1. **Verificar errores de lint**:
   ```bash
   npm run lint
   ```

2. **Corregir errores automáticamente**:
   ```bash
   npm run lint:fix
   ```

#### Formateo (Prettier)

1. **Formatear todo el código**:
   ```bash
   npm run format
   ```
   - Formatea todos los archivos TypeScript, HTML, SCSS y JSON en `src/`.
   - Modifica los archivos directamente.

2. **Verificar formato sin modificar**:
   ```bash
   npm run format:check
   ```
   - Verifica si el código está formateado correctamente.
   - Útil para CI/CD o antes de commits.
   - Retorna código de error si hay archivos sin formatear.

#### Validación completa

3. **Ejecutar todas las validaciones**:
   ```bash
   npm run validate
   ```
   - Ejecuta lint, verificación de formato y tests.
   - Útil para verificar que todo está correcto antes de commits o PRs.

### Flujo de trabajo recomendado

#### Desarrollo diario

1. **Al escribir código**:
   - Prettier puede formatear automáticamente al guardar (si está configurado en el IDE).
   - ESLint mostrará errores en tiempo real en el IDE.

2. **Antes de commit**:
   ```bash
   npm run format
   npm run lint:fix
   npm run test
   ```

3. **Verificación rápida**:
   ```bash
   npm run validate
   ```

#### Configuración del IDE (VS Code)

Para formatear automáticamente al guardar, agrega a `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Resolución de conflictos

Si hay conflictos entre Prettier y ESLint:

1. **Verificar que `eslint-config-prettier` está en `extends`**: Ya está configurado en `eslint.config.js`.
2. **Ejecutar en este orden**:
   ```bash
   npm run format        # Primero formatear con Prettier
   npm run lint:fix      # Luego corregir con ESLint
   ```

### Integración con Git Hooks (recomendado)

Para formatear automáticamente antes de commits, se puede configurar Husky + lint-staged (no implementado actualmente, pero recomendado):

```json
// package.json (ejemplo futuro)
{
  "lint-staged": {
    "*.{ts,html,scss}": [
      "prettier --write",
      "eslint --fix"
    ]
  }
}
```

Esto formatearía y corregiría solo los archivos modificados antes de cada commit.
