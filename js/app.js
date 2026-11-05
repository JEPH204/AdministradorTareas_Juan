// 2.3 Identificar los campos del formulario usando querySelector
const taskForm = document.querySelector("#taskForm");
const alertError = document.querySelector("#alertError");

const newTaskNameInput = document.querySelector("#newTaskNameInput");
const newTaskDescriptionInput = document.querySelector("#newTaskDescriptionInput");
const newTaskStartDateInput = document.querySelector("#newTaskStartDateInput"); // <-- Fecha Inicio
const newTaskEndDateInput = document.querySelector("#newTaskEndDateInput");     // <-- Fecha Fin

// Función para validar que los campos no estén vacíos.
function validFormFieldInput(data) {
    //Comprobar los datos mediante console.log (de momento solo estos 4)
    console.log("name: " + data.name);
    console.log("description: " + data.description);
    console.log("Fecha Inicio:", data.startDate);
    console.log("Fecha Fin:", data.endDate);

    // Validar que ningún campo esté vacío
    if (data.name.trim() === "" || data.description.trim() === "" || data.startDate.trim() === "" || data.endDate.trim() === "") {
        return false; // Hay errores
    }

    if (data.endDate < data.startDate) {
        alert("La fecha de fin no puede ser anterior a la fecha de inicio.");
        return false; // validacion por inconsistencia en la fecha
    }

    return true; // Todo bien

    /* Estoy en proceso de validar como puedo hacer para el caso de una fecha unica, o por cierto tiempo la tarea
    Es decir si un usuario ingresa una fecha unica pasa la validacion, pero si es una tarea que vaya por cierto tiempo (del 6 Nov - 11 Nov)
    pase igualmen
    */
}

// Escuchar el evento submit del formulario
if (taskForm) {
    taskForm.addEventListener("submit", (event) => {
        // Evitamos que la página se recargue por defecto al enviar
        event.preventDefault();

        // Se capturan los valores usando la propiedad .value
        const taskData = {
        name: newTaskNameInput.value,
        description: newTaskDescriptionInput.value,
        startDate: newTaskStartDateInput.value,
        endDate: newTaskEndDateInput.value
        };

        // Ejecutamos la función de validación
        const esValido = validFormFieldInput(taskData);

        // Paso 3: Mostrar u ocultar errores al usuario mediante el Alert
        if (!esValido) {
            // Si hay errores, removemos 'd-none' para mostrar la alerta roja
            alertError.classList.remove("d-none");
            console.warn("Validación fallida: Hay campos incompletos.");
        } else {
            // Si todo es válido, ocultamos la alerta agregando 'd-none'
            alertError.classList.add("d-none");
            console.log("!Tarea Registrada!");
            
            taskForm.reset();
        }
    });
}