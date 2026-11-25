// Instancia principal de TaskManager para gestionar las tareas
const taskManager = new TaskManager();

// Referencias a elementos del formulario, alertas y contenedores en el DOM
const taskForm = document.querySelector("#taskForm");
const alertError = document.querySelector("#alertError");
const todayTasksList = document.querySelector("#todayTasksList");
const tasksContainer = document.querySelector("#tasksContainer");

const newTaskNameInput = document.querySelector("#newTaskNameInput");
const newTaskDescriptionInput = document.querySelector("#newTaskDescriptionInput");
const newTaskStartDateInput = document.querySelector("#newTaskStartDateInput"); // Campo principal de fecha
const newTaskEndDateInput = document.querySelector("#newTaskEndDateInput");     // Campo opcional de fin de rango
const toggleRangeBtn = document.querySelector("#toggleRangeBtn");
const endDateWrapper = document.querySelector("#endDateWrapper");

// Devuelve la fecha local de hoy en formato YYYY-MM-DD para comparaciones exactas
function getTodayDateStr() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Configura el atributo min de los inputs de fecha para evitar elegir días pasados en el selector
function syncDateInputsMin() {
    const todayStr = getTodayDateStr();
    if (newTaskStartDateInput) {
        newTaskStartDateInput.min = todayStr;
    }
    if (newTaskEndDateInput) {
        newTaskEndDateInput.min =
            newTaskStartDateInput && newTaskStartDateInput.value
                ? newTaskStartDateInput.value
                : todayStr;
    }
}

syncDateInputsMin();

// Si el usuario activa o desactiva el modo de rango de fechas, muestra u oculta el campo "hasta"
if (toggleRangeBtn && endDateWrapper && newTaskEndDateInput) {
    toggleRangeBtn.addEventListener("click", () => {
        const isHidden = endDateWrapper.classList.toggle("d-none");
        if (isHidden) {
            newTaskEndDateInput.value = "";
            toggleRangeBtn.innerHTML = `<i class="bi bi-calendar-range"></i> Elegir rango de fechas`;
        } else {
            syncDateInputsMin();
            toggleRangeBtn.innerHTML = `<i class="bi bi-x-circle"></i> Quitar rango de fechas`;
        }
    });
}

// Mantiene sincronizado el mínimo de fecha fin cuando cambia la fecha principal
if (newTaskStartDateInput) {
    newTaskStartDateInput.addEventListener("change", () => {
        syncDateInputsMin();
    });
}

// Valida campos obligatorios y que las fechas no sean anteriores a hoy ni estén invertidas
function validFormFieldInput(data) {
    const todayStr = getTodayDateStr();

    console.log("name: " + data.name);
    console.log("description: " + data.description);
    console.log("Fecha:", data.startDate);
    console.log("Fecha Fin (rango):", data.endDate);

    // Título, descripción y fecha son obligatorios
    if (
        data.name.trim() === "" ||
        data.description.trim() === "" ||
        data.startDate.trim() === ""
    ) {
        return false; // Hay campos vacíos
    }

    // Bloquea cualquier fecha anterior a la fecha actual
    if (data.startDate < todayStr) {
        alert("No puedes seleccionar una fecha anterior a la fecha actual.");
        return false;
    }

    // Si se eligió rango, valida que la fecha final no sea anterior a hoy ni menor a la fecha inicial
    if (data.endDate.trim() !== "") {
        if (data.endDate < todayStr) {
            alert("La fecha final del rango no puede ser anterior a la fecha actual.");
            return false;
        }
        if (data.endDate < data.startDate) {
            alert("La fecha final no puede ser anterior a la fecha inicial.");
            return false;
        }
    }

    return true; // Todo bien
}

// Verifica si la fecha de hoy (YYYY-MM-DD) coincide o queda dentro del rango de la tarea
function isTaskForToday(task, todayStr) {
    if (task.startDate && task.endDate) {
        return task.startDate <= todayStr && todayStr <= task.endDate;
    }
    return task.dueDate === todayStr;
}

// Filtra las tareas pendientes de hoy (no completadas) y las pinta en MIS TAREAS HOY
function renderTodayTasks() {
    if (!todayTasksList) return;

    const todayStr = getTodayDateStr();

    // Solo se muestran en MIS TAREAS HOY las tareas del día que siguen en 'PORHACER'
    const todayPendingTasks = taskManager.tasks.filter(
        (task) => isTaskForToday(task, todayStr) && task.status !== "COMPLETADA"
    );

    if (todayPendingTasks.length === 0) {
        todayTasksList.innerHTML = `<li class="text-muted py-2">Sin tareas pendientes para hoy.</li>`;
        return;
    }

    todayPendingTasks.sort((a, b) => a.id - b.id);

    todayTasksList.innerHTML = todayPendingTasks
        .map((task) => {
            const shortDate =
                task.startDate && task.endDate
                    ? taskManager.buildDueDateLabel(task.startDate, task.endDate)
                    : task.dueDate;

            return `
                <li class="d-flex justify-content-between align-items-center gap-2 py-2 border-bottom border-secondary border-opacity-25">
                    <span class="text-truncate fw-semibold flex-grow-1" title="${task.name}">${task.name}</span>
                    <span class="text-nowrap text-muted small">
                        <i class="bi bi-clock text-warning"></i> ${shortDate}
                    </span>
                    <span class="badge bg-warning text-dark fw-bold text-nowrap">
                        <i class="bi bi-check2-square"></i> ${task.status}
                    </span>
                </li>
            `;
        })
        .join("");
}

// Restaura las tareas guardadas en localStorage y pinta la interfaz al cargar la página
taskManager.load();
taskManager.render();
renderTodayTasks();
console.log("Tareas cargadas desde localStorage:", taskManager.tasks);

// Escuchar el evento submit del formulario para registrar, guardar y pintar la tarea
if (taskForm) {
    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const taskData = {
            name: newTaskNameInput.value,
            description: newTaskDescriptionInput.value,
            startDate: newTaskStartDateInput.value,
            endDate: newTaskEndDateInput ? newTaskEndDateInput.value : ""
        };

        const esValido = validFormFieldInput(taskData);

        if (!esValido) {
            alertError.classList.remove("d-none");
            console.warn("Validación fallida: Campos incompletos o fecha inválida.");
        } else {
            alertError.classList.add("d-none");

            // Si no se eligió rango, la fecha final es igual a la fecha principal
            const effectiveEndDate =
                taskData.endDate.trim() !== "" ? taskData.endDate : taskData.startDate;

            const dueDateLabel = taskManager.buildDueDateLabel(
                taskData.startDate,
                effectiveEndDate
            );

            taskManager.addTask(
                taskData.name,
                taskData.description,
                dueDateLabel,
                "PORHACER",
                taskData.startDate,
                effectiveEndDate
            );

            // Persiste las tareas y el contador actualizado en localStorage
            taskManager.save();

            console.log("Tareas registradas y guardadas:", taskManager.tasks);

            taskManager.render();
            renderTodayTasks();

            // Reinicia el formulario y vuelve a ocultar el campo de rango si estaba abierto
            taskForm.reset();
            if (endDateWrapper && !endDateWrapper.classList.contains("d-none")) {
                endDateWrapper.classList.add("d-none");
                if (toggleRangeBtn) {
                    toggleRangeBtn.innerHTML = `<i class="bi bi-calendar-range"></i> Elegir rango de fechas`;
                }
            }
            syncDateInputsMin();
        }
    });
}

// Delegación de eventos en #tasksContainer para alternar estado completado o eliminar tareas
if (tasksContainer) {
    tasksContainer.addEventListener("click", (event) => {
        // 1. Botón de marcar o desmarcar tarea completada
        const toggleButton = event.target.closest(".btn-toggle-complete");
        if (toggleButton) {
            const card = toggleButton.closest("[data-task-id]");
            if (!card) return;

            const taskId = Number(card.dataset.taskId);
            const isCompleted = taskManager.toggleTaskStatus(taskId);

            // Guarda el nuevo estado ('COMPLETADA' o 'PORHACER') y actualiza las vistas
            taskManager.save();
            taskManager.render();
            renderTodayTasks();

            console.log(
                isCompleted
                    ? `Tarea ${taskId} marcada como COMPLETADA.`
                    : `Tarea ${taskId} marcada como PORHACER.`
            );
            return;
        }

        // 2. Botón circular de eliminar tarea (.delete-button) con aviso de confirmación
        const deleteButton = event.target.closest(".delete-button");
        if (deleteButton) {
            const parentTask = deleteButton.closest("[data-task-id]");
            if (!parentTask) return;

            const taskId = Number(parentTask.dataset.taskId);
            const taskFound = taskManager.tasks.find((task) => task.id === taskId);
            const taskLabel = taskFound ? `"${taskFound.name}"` : `la Tarea ${taskId}`;

            // Aviso de confirmación antes de eliminar la tarea
            const confirmed = confirm(`¿Seguro que deseas eliminar ${taskLabel}?`);
            if (!confirmed) return;

            taskManager.deleteTask(taskId);
            taskManager.save();

            // Muestra en consola el arreglo actualizado tras eliminar sin requerir recarga
            console.log("Tareas restantes tras eliminar:", taskManager.tasks);

            taskManager.render();
            renderTodayTasks();
        }
    });
}