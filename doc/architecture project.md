## Arquitectura del proyecto

### Enfoque
Arquitectura Hexagonal (Domain-Driven Design) con separación por capas y dependencias dirigidas hacia el dominio.

### Capas y responsabilidades
- `core/domain`: modelos puros (interfaces) del dominio.
- `core/ports`: contratos para infraestructura (repositorios, servicios externos).
- `application/use-cases`: lógica de negocio pura y orquestación de reglas.
- `infrastructure/adapters`: implementaciones concretas de puertos.
- `presentation/pages`: páginas y composición de UI.
- `presentation/components`: componentes atómicos reutilizables.
- `shared`: utilidades transversales y componentes comunes.

### Flujo de dependencias
- `presentation` depende de `application` y `core`.
- `application` depende solo de `core`.
- `infrastructure` implementa `core/ports` y no depende de `presentation`.

### Implementación en este proyecto
- Estado de juego y dificultad definidos en `core/domain`.
- Casos de uso en `application/use-cases` para iniciar partida, cambiar dificultad y aplicar puntuación.
- Persistencia en `infrastructure/adapters` usando `localStorage`.
- Páginas en `presentation/pages` y piezas de UI en `presentation/components`.

