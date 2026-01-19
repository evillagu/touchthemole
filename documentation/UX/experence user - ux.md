# 🕹️ Documentación de Experiencia de Usuario (UX) - Toca el Topo

Este documento describe el flujo de navegación, las reglas de interfaz y la lógica de interacción del juego "Toca el Topo", basada en el diseño visual de la aplicación.

---

## 1. Pantalla de Inicio (Home)
La primera interacción del usuario está diseñada para asegurar la captura de datos antes de permitir el acceso al juego.

* **Formulario de Registro**: Aparece un cuadro de diálogo central con un campo de entrada (input) para el nombre del jugador.
* **Validación de Botón (Estado Disabled)**: El botón **"Start"** se mantiene deshabilitado (gris y sin respuesta) mientras el campo de texto esté vacío.
* **Activación de Flujo**: Una vez que el usuario escribe su nombre, el botón cambia visualmente (azul intenso) y se habilita para permitir el inicio de la sesión.



---

## 2. Preparación del Juego
Tras el acceso, el usuario es redirigido al tablero principal donde se presentan los controles de configuración.

* **Identificación y Marcadores Visuales**: 
  - En la parte superior se visualiza el nombre del jugador junto con un icono circular de usuario (blanco) que representa visualmente al jugador.
  - El marcador de puntos se muestra junto con un icono circular de trofeo (blanco) que representa los logros del jugador.
  - Ambos iconos tienen forma circular y color blanco para mantener consistencia visual.
  - Los valores inician en 0 puntos.
* **Control de Dificultad**: 
  - Un icono circular de fuego (blanco) precede al selector de dificultad, representando visualmente la intensidad del juego.
  - El selector permite elegir entre tres niveles (Bajo, Medio, Alto).
* **Control de Sesión (Play & Restart)**: El botón principal tiene una doble función:
    1.  **Iniciar**: Dispara la lógica de aparición de los topos.
    2.  **Reiniciar**: Permite resetear el puntaje a 0 en cualquier momento durante la partida.
* **Navegación de Retorno**: Se incluye un botón **"Salir"** en la zona inferior que permite al usuario finalizar la sesión y regresar a la pantalla de inicio.

---

## 3. Mecánicas de Juego y Dificultad
El núcleo del juego se basa en una cuadrícula de 3x3 con comportamientos dinámicos según el progreso del usuario.

* **Selector de Dificultad**: El usuario puede elegir entre tres niveles (*Bajo, Medio, Alto*) a través de un menú desplegable (select). Esto determina la velocidad de respuesta requerida.
* **Curva de Dificultad Progresiva**: 
    * Al inicio, los topos aparecen de uno en uno.
    * **Regla de Intensidad**: Tras la aparición de los primeros 5 topos, el sistema incrementa el desafío mostrando **2 topos simultáneos** en el tablero.

---

## 3.1. Sistema de Juego por Tiempo

El juego funciona con un sistema de tiempo limitado que añade presión y emoción a la partida.

* **Cronómetro Visual**: En el header del juego se muestra el tiempo restante en formato "Tiempo: Xs". El cronómetro se actualiza cada segundo.
* **Duración de Partida**: Cada partida tiene una duración de 30 segundos por defecto.
* **Aceleración Progresiva**: 
    * Cuando quedan **10 segundos o menos**, la velocidad de aparición de topos aumenta automáticamente (62.5% del tiempo original).
    * Esto hace que el juego sea más intenso y desafiante hacia el final.
* **Alerta Visual de Tiempo Bajo**: 
    * Cuando quedan **5 segundos o menos**, el cronómetro cambia a color rojo y parpadea.
    * Esta animación alerta visualmente al jugador de que el tiempo está por agotarse.
* **Finalización Automática**: 
    * Cuando el tiempo llega a 0, el juego se detiene automáticamente.
    * Todos los topos desaparecen y se muestra el modal GAME OVER.

---

## 3.2. Modal GAME OVER

Cuando el tiempo se agota, se muestra un modal visual que informa al jugador sobre el final de la partida.

* **Overlay Oscuro**: Un fondo semitransparente oscuro cubre toda la pantalla, enfocando la atención en el modal.
* **Accesibilidad del Overlay**:
    * El overlay es focusable mediante `tabindex="0"` para permitir navegación por teclado.
    * Soporta eventos de teclado: Enter y Espacio para cerrar el modal.
    * Tiene `role="button"` para indicar su función interactiva a lectores de pantalla.
    * Incluye `aria-label="Cerrar modal"` para accesibilidad.
* **Contenido del Modal**:
    * **Contenedor del Modal**: Tiene `role="dialog"` para indicar que es un diálogo modal.
    * **Título**: "GAME OVER" en color rojo y tamaño grande.
    * **Puntuación Final**: Muestra la puntuación total obtenida durante la partida.
    * **Botón de Cerrar**: Permite cerrar el modal y continuar.
* **Interacción**: 
    * El usuario puede cerrar el modal haciendo clic en el botón "Cerrar".
    * También puede cerrar el modal haciendo clic fuera del modal (en el overlay oscuro).
    * **Navegación por Teclado**: El modal puede cerrarse usando las teclas Enter o Espacio cuando el overlay tiene el foco.
    * **Prevención de Propagación**: Los eventos de teclado en el contenido del modal no cierran el modal, solo los del overlay.
* **Después del Modal**: 
    * Una vez cerrado el modal, el usuario puede reiniciar el juego con el botón "Play & Restart".
    * El tablero permanece oculto hasta que se reinicie el juego.



---

## 4. Feedback Interactivo
La interfaz comunica el éxito de las acciones del usuario mediante señales visuales claras.

* **Detección de Acierto (Hit)**: Cuando el usuario logra tocar a un topo, el cuadro que lo contiene cambia el color de su borde (ej. resplandor rojo o amarillo). 
* **Confirmación Visual**: Este cambio cromático sirve como feedback inmediato, indicando que el punto ha sido procesado correctamente por la lógica del juego.
* **Recompensa Dual**: Al golpear un topo exitosamente:
  - Se suman puntos según la dificultad (10/20/30 puntos)
  - Se añade tiempo bonus al cronómetro según la dificultad:
    - **Dificultad Baja**: +1 segundo
    - **Dificultad Media**: +1.5 segundos
    - **Dificultad Alta**: +2 segundos
* **Estrategia de Tiempo**: Los jugadores pueden extender su tiempo de juego golpeando topos exitosamente, especialmente en dificultades más altas que otorgan más tiempo bonus.



---

## 5. Resumen de Estados de Interfaz

| Elemento | Acción del Usuario | Reacción del Sistema (UX) |
| :--- | :--- | :--- |
| **Input Nombre** | Vacío | Botón "Start" bloqueado. |
| **Input Nombre** | Con texto | Botón "Start" activo. |
| **Botón Play/Restart** | Clic | Inicia temporizador, limpia puntos e inicia cronómetro de 30 segundos. |
| **Tablero (Topo)** | Tocar/Clic | Cambio de color en el borde del cuadro y suma puntos. |
| **Cronómetro** | Automático | Decrementa cada segundo. Parpadea en rojo cuando quedan ≤5 segundos. |
| **Modal GAME OVER** | Tiempo = 0 | Aparece automáticamente mostrando puntuación final. |
| **Botón Cerrar (Modal)** | Clic | Cierra el modal GAME OVER. |
| **Overlay (Modal)** | Clic | Cierra el modal GAME OVER al hacer clic fuera. |
| **Botón Salir** | Clic | Detiene timer y redirección inmediata al Home. |

---

## 🛠️ Especificaciones Técnicas
- **Framework**: Angular 20.
- **Estilos**: SCSS (Diseño Fluido).
- **Linter**: ESLint 9 (con reglas de limpieza de código).