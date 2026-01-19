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

* **Identificación y Marcadores**: En la parte superior se visualiza el nombre del jugador ingresado y el marcador de puntos, que inicia en 0.
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

## 4. Feedback Interactivo
La interfaz comunica el éxito de las acciones del usuario mediante señales visuales claras.

* **Detección de Acierto (Hit)**: Cuando el usuario logra tocar a un topo, el cuadro que lo contiene cambia el color de su borde (ej. resplandor rojo o amarillo). 
* **Confirmación Visual**: Este cambio cromático sirve como feedback inmediato, indicando que el punto ha sido procesado correctamente por la lógica del juego.



---

## 5. Resumen de Estados de Interfaz

| Elemento | Acción del Usuario | Reacción del Sistema (UX) |
| :--- | :--- | :--- |
| **Input Nombre** | Vacío | Botón "Start" bloqueado. |
| **Input Nombre** | Con texto | Botón "Start" activo. |
| **Botón Play/Restart** | Clic | Inicia temporizador y limpia puntos. |
| **Tablero (Topo)** | Tocar/Clic | Cambio de color en el borde del cuadro. |
| **Botón Salir** | Clic | Redirección inmediata al Home. |

---

## 🛠️ Especificaciones Técnicas
- **Framework**: Angular 20.
- **Estilos**: SCSS (Diseño Fluido).
- **Linter**: ESLint 9 (con reglas de limpieza de código).