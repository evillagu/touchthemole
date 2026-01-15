## Reglas ES6 y configuracion del proyecto

### Objetivo
Aplicar reglas ES6 de forma consistente en todo el proyecto usando ESLint.

### Configuracion global
- Archivo de reglas: `eslint.config.mjs`.
- Alcance: todo el proyecto para `*.ts`.
- Script: `npm run lint`.

### Reglas ES6 activas
- `@typescript-eslint/member-ordering`: metodos publicos arriba y privados abajo.
- `@typescript-eslint/no-explicit-any`: prohíbe el uso de `any`.
- `no-var`: obliga a usar `const` o `let`.
- `prefer-const`: usa `const` cuando no hay reasignacion.
- `indent`: indentacion uniforme de 2 espacios.
- `block-spacing`: espacios consistentes en bloques.
- `no-duplicate-imports`: evita imports duplicados.
- `object-shorthand`: usa sintaxis corta en objetos.
- `prefer-template`: usa templates en lugar de concatenacion.
- `prefer-arrow-callback`: usa funciones flecha como callbacks.
- `arrow-body-style`: evita cuerpos de flecha innecesarios.
- `no-class-assign`: evita reasignar clases.
- `no-const-assign`: evita reasignar constantes.
- `no-this-before-super`: evita usar `this` antes de `super`.
- `constructor-super`: asegura `super()` en clases derivadas.
- `no-new-symbol`: evita `new Symbol()`.
- `symbol-description`: requiere descripcion en `Symbol()`.
- `no-useless-computed-key`: evita keys computadas innecesarias.
- `@typescript-eslint/no-useless-constructor`: evita constructores vacios.
- `@typescript-eslint/no-dupe-class-members`: evita miembros duplicados.

### Uso
1. Instalar dependencias: `npm install`.
2. Ejecutar lint: `npm run lint`.

