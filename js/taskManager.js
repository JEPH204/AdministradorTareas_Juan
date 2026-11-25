class TaskManager {
  // Inicializa el arreglo de tareas y el contador de IDs
  constructor(currentId = 0) {
    this.tasks = [];
    this.currentId = currentId;
  }

  // Convierte una fecha "YYYY-MM-DD" a formato corto "DD/MM" (sin año) para ahorrar espacio visual
  formatShortDate(dateStr) {
    if (!dateStr || typeof dateStr !== "string") return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const day = parts[2];
    const month = parts[1];
    return `${day}/${month}`;
  }

  // Construye la etiqueta visible en formato "DD/MM" (fecha única) o "DD/MM - DD/MM" (rango)
  buildDueDateLabel(startDate, endDate) {
    const startShort = this.formatShortDate(startDate);
    const endShort = this.formatShortDate(endDate);

    if (!startShort) return endShort;
    if (!endShort || startDate === endDate) return startShort;
    return `${startShort} - ${endShort}`;
  }

  // Incrementa currentId y agrega una tarea con rango de fechas y estado inicial 'PORHACER'
  addTask(name, description, dueDate, status, startDate = "", endDate = "") {
    this.currentId++;
    const effectiveStart = startDate || dueDate;
    const effectiveEnd = endDate || effectiveStart;
    const formattedDueDate =
      this.buildDueDateLabel(effectiveStart, effectiveEnd) || dueDate;

    this.tasks.push({
      id: this.currentId,
      name: name,
      description: description,
      dueDate: formattedDueDate,
      startDate: effectiveStart,
      endDate: effectiveEnd,
      status: "PORHACER"
    });
  }

  // Alterna el estado de la tarea entre 'COMPLETADA' y 'PORHACER'; devuelve true si quedó completada
  toggleTaskStatus(taskId) {
    const targetTask = this.tasks.find((task) => task.id === taskId);
    if (!targetTask) return false;

    const isNowCompleted = targetTask.status !== "COMPLETADA";
    targetTask.status = isNowCompleted ? "COMPLETADA" : "PORHACER";
    return isNowCompleted;
  }

  // Crea un nuevo arreglo conservando solo las tareas cuyo id sea distinto a taskId
  deleteTask(taskId) {
    const newTasks = [];
    for (let task of this.tasks) {
      if (task.id !== taskId) {
        newTasks.push(task);
      }
    }
    this.tasks = newTasks;
  }

  // Genera el HTML de una tarjeta con botones superiores de eliminar (circular) y completar
  createTaskHtml(task) {
    const displayDate =
      task.startDate && task.endDate
        ? this.buildDueDateLabel(task.startDate, task.endDate)
        : task.dueDate;

    const isCompleted = task.status === "COMPLETADA";
    const completedClass = isCompleted ? " task-completed" : "";
    const toggleBtnClass = isCompleted ? "btn-outline-secondary" : "btn-outline-success";
    const toggleIconClass = isCompleted ? "bi-clock-history" : "bi-check-lg";
    const toggleTitle = isCompleted
      ? "Desmarcar y volver a pendiente"
      : "Marcar como completada";
    const statusBadgeClass = isCompleted ? "bg-success text-white" : "bg-light text-dark";

    return `
      <div class="col-md-6">
        <div class="card border-secondary p-3 position-relative${completedClass}" data-task-id="${task.id}">
          <!-- Botones superiores: papelera circular a la izquierda y check de completado a la derecha -->
          <div class="position-absolute top-0 end-0 m-2 d-flex align-items-center gap-1">
            <button
              type="button"
              class="btn btn-outline-danger btn-sm rounded-circle delete-button"
              aria-label="Eliminar tarea"
              title="Eliminar tarea"
            >
              <i class="bi bi-trash"></i>
            </button>

            <button
              type="button"
              class="btn ${toggleBtnClass} btn-sm btn-toggle-complete"
              aria-label="Marcar o desmarcar tarea completada"
              title="${toggleTitle}"
            >
              <i class="bi ${toggleIconClass}"></i>
            </button>
          </div>

          <h6 class="text-muted fw-bold">Tarea ${task.id}</h6>
          <h5 class="card-title">${task.name}</h5>
          <p class="card-text fw-semibold text-muted small">${task.description}</p>

          <!-- Fecha corta (DD/MM) y estado actual de la tarea -->
          <div class="mt-2 mb-2 pt-2 border-top border-light d-flex align-items-center justify-content-between gap-2">
            <span class="badge bg-secondary text-dark small"><i class="bi bi-clock"></i> ${displayDate}</span>
            <span class="badge ${statusBadgeClass} small fw-bold">${task.status}</span>
          </div>

          <button type="button" class="btn btn-outline-light mx-auto btn-sm">Detalles</button>
        </div>
      </div>
    `;
  }

  // Convierte todas las tareas de this.tasks en HTML y las pinta dentro de #tasksContainer
  render() {
    const tasksContainer = document.querySelector("#tasksContainer");
    if (!tasksContainer) return;

    const tasksHtmlList = this.tasks.map((task) => this.createTaskHtml(task));
    tasksContainer.innerHTML = tasksHtmlList.join("");
  }

  // Guarda las tareas y currentId en localStorage de forma segura
  save() {
    try {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
      localStorage.setItem("currentId", String(this.currentId));
    } catch (error) {
      console.error("No se pudieron guardar las tareas en localStorage:", error);
    }
  }

  // Carga las tareas y currentId desde localStorage al iniciar o recargar
  load() {
    try {
      const tasksJson = localStorage.getItem("tasks");
      const savedCurrentId = localStorage.getItem("currentId");

      if (tasksJson) {
        const parsedTasks = JSON.parse(tasksJson);
        if (Array.isArray(parsedTasks)) {
          this.tasks = parsedTasks;
        }
      }

      if (savedCurrentId !== null && savedCurrentId !== "") {
        const parsedId = Number(savedCurrentId);
        if (!Number.isNaN(parsedId)) {
          this.currentId = parsedId;
        }
      } else if (this.tasks.length > 0) {
        this.currentId = Math.max(...this.tasks.map((task) => Number(task.id) || 0));
      }
    } catch (error) {
      console.error("No se pudieron cargar las tareas desde localStorage:", error);
      this.tasks = [];
    }
  }
}