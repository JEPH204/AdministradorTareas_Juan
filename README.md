# Planificador de Tareas - Sprint 1

## Descripción del Proyecto
El Planificador de Tareas es una herramienta web orientada a la organización personal y de equipos, construida bajo un entorno de diseño moderno (*Dark Mode*). Cuenta con un panel de control interactivo que incluye un calendario, un formulario de registro con validaciones de campos y fechas en tiempo real, contadores de estado y una sección dinámica de tarjetas de tareas.

## Enlaces del Proyecto
* **Tablero de Trello:** [[Enlace a tu tablero de Trello](https://trello.com/invite/b/6ae255d98f8406ccf4ec51af/ATTId769f94cb91e7750b2e23f53602250bb0CF5AC6C/desarrollo-administrador-tarea)]
* **Wireframe (Figma):** [[Enlace al diseño en Figma](https://www.figma.com/design/QNs1hNQlQlNA3Rvtl67REo/Administrador-de-Tareas?t=kLf7i1CEuXhIr5SY-1)]
* **Demo del Proyecto (GitHub Pages):** [[Enlace publicado en GitHub Pages](https://jeph204.github.io/AdministradorTareas_Juan/)]

## Funcionalidades implementadas en el Sprint 1
* Interfaz visual estructurada con sistema de rejillas (*Grid*) de Bootstrap 5.
* Estilos personalizados con paleta de colores de alta contraste (*Dark Mode*).
* Validación de entradas de formulario mediante la función `validFormFieldInput(data)`.
* Retroalimentación visual inmediata mediante alertas dinámicas de error.
* Renderizado dinámico de tarjetas de tareas y gestión de rangos de fechas.

### Sprint 2 — Gestión con `TaskManager`, Estado, Eliminación y Persistencia
- **Clase `TaskManager` (`js/taskManager.js`):** administra la colección `this.tasks` y el contador incremental `currentId` con métodos organizados (`addTask`, `toggleTaskStatus`, `deleteTask`, `createTaskHtml`, `render`, `save` y `load`).
- **Renderizado dinámico y vista diaria (`js/app.js`):** pinta las tarjetas en **LISTA DE TAREAS** y filtra en **MIS TAREAS HOY** las tareas activas para la fecha actual que aún no estén completadas.
- **Estado de completado y fechas:** alterna el estado entre `PORHACER` y `COMPLETADA` (actualizando la apariencia de la tarjeta y retirando las tareas completadas de **MIS TAREAS HOY**), con soporte para fecha única o rango en formato corto (`DD/MM`).
- **Eliminación de tareas:** botón circular de eliminar en cada tarjeta (`delete-button`) con confirmación previa, eliminación por `id` mediante `deleteTask(taskId)` y actualización inmediata de la vista y `localStorage`.
- **Persistencia en `localStorage`:** guarda y recupera automáticamente las tareas y el identificador actual al recargar la página.
